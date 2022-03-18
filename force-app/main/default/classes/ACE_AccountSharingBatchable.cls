global class ACE_AccountSharingBatchable implements Database.batchable<sObject>{
    /*------------------------------------------------------------
Author:       Accenture
Description:  Fetches all the Heirarchy Level Account.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
1/16/2020   Rajeshwari Shetty
------------------------------------------------------------*/
    global Account[] start(Database.BatchableContext info) {
        return [select id, ParentId FROM Account WHERE RecordType.DeveloperName = 'Hierarchy' AND ParentId=NULL Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    	
    }
/*------------------------------------------------------------
Author:       Accenture
Description:  Accounts are shared with the contacts in the upper level Account Heirarchy.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
1/16/2020   Rajeshwari Shetty
------------------------------------------------------------*/
    global void execute(Database.BatchableContext info, Account[] greAccounts) {
        System.debug('@@Account Id::'+greAccounts[0].id);
        Map<Id, Account> accountsWithHierarchiesById = new Map<Id, Account>(greAccounts);
        Map<Id, Id[]> contactIdToAccountIds = new Map<ID,ID[]>();
        try{
        /*Get all the child Account and map contacts to parents in the hierarchy*/
        List<Account> ChildAccts = getAllChildAccts(accountsWithHierarchiesById,'id, ParentId');
        Map<Id,Id[]> accToParentAccount = getchildToParentAccounts(ChildAccts);
        set<AccountContactWrap> AccountIdToContact =new Set<AccountContactWrap>(prepareParentAccountToChildContact(accToParentAccount));
        Map<Id,List<Id>> parentAccttochildAcct = getParentTochildAccounts(ChildAccts);
        /*Prepare the Collections to delete the relationship in lower hierarchies*/
        Set<Id> parentContactIds = getAllParentContacts(AccountIdToContact);
        Set<Id> childAcc = getAllChildAcc(AccountIdToContact);
        Map<Id, Id[]> contactIdToAccountIdnew = getAndSortContactsByAccountsnew(AccountIdToContact);
        childAcc.addAll(accountsWithHierarchiesById.keyset());
        AccountContactRelation[] shipTos = getAccountContactRelation(childAcc);
        contactIdToAccountIds = getAndSortContactByShipTos(shipTos); 
        /*Prepare account contact relationships to be inserted in lower Hierarchy based on manually created relationship*/
        set<AccountContactWrap> addedAccountIdToContact = sortAddedHeirarchy(contactIdToAccountIdnew,parentAccttochildAcct,AccountIdToContact,shipTos);
        Set<Id> childAccnotHeirchy = getAllChildAcc(addedAccountIdToContact);
        Set<Id> parentContactIdsNotHierarchy = getAllParentContacts(addedAccountIdToContact);
        Map<Id, User> communityUsersById = new Map<Id, User>(ACE_Utils.getCommunityUsers(contactIdToAccountIds.keyset()));
        /*Delete the Account Contact relationships in lower hierarchy if deleted at parent Level*/
        //AccountIdToContact.add();
        parentContactIds.addAll(parentContactIdsNotHierarchy);
        childAcc.AddAll(childAccnotHeirchy);
        Set<Id> childAccToDelete = new set<Id>();
        childAccToDelete.addAll(childAcc);
        childAccToDelete.addAll(accToParentAccount.keyset());
        delete deleteAccountContactRelationOutofDirectHeirarchy(childAccToDelete,parentContactIds,accToParentAccount,contactIdToAccountIds);
        shipTos = getAccountContactRelation(childAcc);
        contactIdToAccountIds = getAndSortContactByShipTos(shipTos); 
        delete removeAccountSharesFromUsersRemovedFromHierarchy(communityUsersById, childAcc, contactIdToAccountIds);
        AccountContactRelation[] newAccountContactRelations =  createNewAccountContactRelationsForParentAccountsinChild(AccountIdToContact,true);
        AccountContactRelation[] newAccountContactRelations1 = createNewAccountContactRelationsForParentAccountsinChild(addedAccountIdToContact,true);
        newAccountContactRelations.addAll(newAccountContactRelations1);
        AccountContactRelation[] filteredRelations = removeAlreadyExistingAccountContactRelations(newAccountContactRelations,childAcc,parentContactIds);
        insert filteredRelations;
        assignCommunityUsersAcctHierarchyPermissions(contactIdToAccountIds, communityUsersById.values()); 
    	}
        Catch(Exception ex)
        {
            ex.getMessage();
        }
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Creates Manual Sharing rules for related objects based on AccountContactRelations.
                created from Account Hierarchies in execute(). If additional sharing rules are needed for other objects,
                another batch class can be created for that object and added here.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    global void finish(Database.BatchableContext info) {
        Integer fundReqBatchSize = Integer.valueOf(Label.ACE_fundReqSharingBatch_Size);
        Integer reimburseBatchsize = Integer.valueOf(Label.ACE_ReimbursementBatch_Size);
        Database.executeBatch(new ACE_FundRequestBatchable(), fundReqBatchSize);
        Database.executeBatch(new ACE_ReimbursementBatchable(), reimburseBatchsize);
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sorts the set of Contacts from AccountContactWrap.
Method Name:  getAllParentContacts
Parameters:   Collection of AccountContactWrap to be created as Account Contact relations
------------------------------------------------------------*/
    private static Set<Id> getAllParentContacts(Set<AccountContactWrap> contactIdToAccount)
    {
        set<Id> contactIds = new Set<Id>();
        try{
            for(AccountContactWrap awc:contactIdToAccount)
            {
                contactIds.add(awc.contactId);            
            }
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        return contactIds;
    } 
    /*------------------------------------------------------------
Author:       Accenture
Description:  Deletes the Indirect Account Contact relationships[Manually Created Relationship which are not created
			  based on Direct Account Heirarchy] from child Account,when parent Relationship is removed.
Method Name:  deleteAccountContactRelationOutofDirectHeirarchy
Parameters:   Set of AccountId and ContactIds,Map of Child Account To parent and Account and Existing Account Contact relationships
------------------------------------------------------------*/
    public static List<AccountContactRelation> deleteAccountContactRelationOutofDirectHeirarchy(Set<Id> AccountId,Set<Id> contactId,Map<Id,ID[]> childAccountToParentAcc,Map<Id,ID[]> ConToAccts)
    {
        List<AccountContactRelation> acrList = [select id,AccountId,ContactId,IsNotDirectHeirarchy__c from 
                                                AccountContactRelation where Accountid=:AccountId AND isdirect = false
                                                AND (contact.Role__c = 'Site Analyst'OR Contact.Role__c = 'Site Admin')  Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];//contactid =:contactId and
        Map<Id,Boolean> accToIsHierarchy = new Map<Id,Boolean>();
        List<AccountContactRelation> AccountContactRelationToDelete = new List<AccountContactRelation>();
        Map<Id,Id[]> ContToAccountIds = new Map<Id,Id[]>();
        Map<AccountContactWrap,Id> awToAcrIds = new Map<AccountContactWrap,Id>();
        Map<Id,Boolean> acrToIsHeirarchy = new Map<Id,Boolean>();
        Map<Id,AccountContactRelation[]> conToAcrIds = new Map<Id,AccountContactRelation[]>();
        Boolean isNotDeletedParentHeirarchy;
        try{ 
        for(AccountContactRelation acr:acrList){
            accToIsHierarchy.put(acr.AccountId,acr.IsNotDirectHeirarchy__c);
            if(!ContToAccountIds.containsKey(acr.ContactId)){
                ContToAccountIds.put(acr.ContactId,new List<Id>());
            }
            ContToAccountIds.get(acr.ContactId).add(acr.AccountId);
            if(!conToAcrIds.containsKey(acr.ContactId)){
                conToAcrIds.put(acr.ContactId,new List<AccountContactRelation>());
            }
            conToAcrIds.get(acr.ContactId).add(acr);
            awToAcrIds.put(new AccountContactWrap(acr.AccountId,acr.ContactId),acr.id);
            acrToIsHeirarchy.put(acr.id,acr.IsNotDirectHeirarchy__c);
        }
        for(AccountContactRelation acr:acrList)
        {
            Boolean isdelete = true;
            if(acr.IsNotDirectHeirarchy__c != true)
            {
                Continue;
            }
            else{
                if(childAccountToParentAcc.containskey(acr.AccountId) && childAccountToParentAcc.get(acr.AccountId).Size() >0){
                    for(Id parentId:childAccountToParentAcc.get(acr.AccountId))
                    {
                        if(ContToAccountIds.get(acr.ContactId).contains(parentId))
                        {
                            for(AccountContactRelation acc:conToAcrIds.get(acr.contactId))
                            {
                                if(acc.AccountId == parentId && acc.ContactId ==acr.ContactId && acc.IsNotDirectHeirarchy__c != true)
                                {
                                    isdelete = false;
                                    break;
                                }
                            }
                        }
                    }
                }
                if(isdelete){
                    AccountContactRelationToDelete.add(acr);
                }
            }
        }
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        System.debug('DeletedCount::'+AccountContactRelationToDelete.size());
        return AccountContactRelationToDelete;
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort the Existing AccountContactRelation in a MAP as contact To List of Account Ids
Method Name:  getAndSortContactByShipTos
Parameters:   List of Existing AccountContactRelation
------------------------------------------------------------*/
    public static Map<Id, Id[]> getAndSortContactByShipTos(AccountContactRelation[] shipToAccts)
    {
        Map<Id, Id[]> contactIdToShipToIds = new Map<Id, Id[]>();
        try{ 
        for(AccountContactRelation ac : shipToAccts){
            if(!contactIdToShipToIds.containsKey(ac.ContactId)){
                contactIdToShipToIds.put(ac.ContactId, new Id[]{});
            }
            contactIdToShipToIds.get(ac.ContactId).add(ac.AccountId);
        }
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        return contactIdToShipToIds;
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort the new AccountContactRelation in a MAP as contact To List of Account Ids
Method Name:  getAndSortContactsByAccountsnew
Parameters:   List of Existing AccountContactRelation
------------------------------------------------------------*/
    public Static Map<Id,ID[]> getAndSortContactsByAccountsnew(set<AccountContactWrap> acwList)
    {
        Map<Id,ID[]> conToAccIds = new Map<Id,ID[]>();
        try{
            for(AccountContactWrap ac : acwList){
            if(!conToAccIds.containsKey(ac.ContactId)){
                conToAccIds.put(ac.ContactId, new Id[]{});
            }
            conToAccIds.get(ac.ContactId).add(ac.AccountId);
        	}
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        
        return conToAccIds;
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  get all the Existing Account Contact Relationships
Method Name:  getAccountContactRelation
Parameters:   Set of All accountIds in the Hierarchy.
------------------------------------------------------------*/
    public static AccountContactRelation[] getAccountContactRelation(Set<Id> acctIds){
       try{
            AccountContactRelation[] shipToAccts = [SELECT id, ContactId,AccountId,IsDirect,IsNotDirectHeirarchy__c FROM AccountContactRelation WHERE AccountId IN :acctIds AND (contact.Role__c = 'Site Analyst'OR Contact.Role__c = 'Site Admin') Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        	return shipToAccts;
       }
        Catch(Exception ex)
        {
            ex.getMessage();
            return null;
        }
        
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort the new AccountContactRelation to be created below hierarchy based on the manual relationships
Method Name:  sortAddedHeirarchy
Parameters:   List of Existing AccountContactRelation
------------------------------------------------------------*/
    public static set<AccountContactWrap> sortAddedHeirarchy(Map<Id, Id[]> contToAccountIds,Map<ID,List<Id>> parentToChildAccts,set<AccountContactWrap> AccountIdToContact,AccountContactRelation[] shipToAccts){ 
        set<AccountContactWrap> addedrelations = new Set<AccountContactWrap>();
        try{ 
        for(AccountContactRelation ac : shipToAccts){
            if(ac.IsDirect == false && ac.IsNotDirectHeirarchy__c != true)
            {
                AccountContactWrap acw = new AccountContactWrap(ac.AccountId,ac.ContactId);
                if(parentToChildAccts.containskey(ac.AccountId))
                {
                    for(Id accId:parentToChildAccts.get(ac.AccountId))
                    {
                        if(contToAccountIds.get(ac.contactId) == null || !contToAccountIds.get(ac.contactId).contains(accID)){
                            addedrelations.add(new AccountContactWrap(accId,ac.ContactId));
                        }
                    }
                }
            }
        }
        }
        Catch(Exception ex){
            ex.getMessage();
        }
        System.debug('addedrelationssize::'+addedrelations.size());
        return addedrelations;
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort the new AccountContactRelation to be created below hierarchy based on the manual relationships
Method Name:  sortAddedHeirarchy
Parameters:   List of Existing AccountContactRelation
------------------------------------------------------------*/
    private static Boolean contactIsRelatedToAccount(Boolean contactIsRelated){
        return contactIsRelated;
    }
/*------------------------------------------------------------
Author:       Accenture
Description:  get All Child Accounts
Method Name:  getAllChildAcc
Parameters:   List of new Account Contact Relationships to be created.
------------------------------------------------------------*/
    Private static Set<Id> getAllChildAcc(Set<AccountContactWrap> contactIdToAccount)
    {
        set<Id> accIds = new Set<Id>();
        try{
            for(AccountContactWrap awc:contactIdToAccount)
        	{
            	accIds.add(awc.accountId);            
        	}
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        return accIds;
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Removes AccountShares if Community User is no longer in the Account Hierarchy.
                Based on: 1) if the user was not queried in current batch
                            (i.e. the user should never be queried in another batch anyways since code
                            initially queries Accounts from the highest level)
                          2) if user was queried but Contact not part of hierarchy tree
                          3) if user was queried and Contact is part of hierarchy tree, but Account is no longer associated with Contact
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    private static AccountShare[] removeAccountSharesFromUsersRemovedFromHierarchy(Map<Id, User> communityUsersById,Set<ID> AccountIds, Map<Id, Id[]> contactIdToAccountIds){
        try{ 
        AccountShare[] currentAccountShares = [SELECT id, AccountId, UserOrGroupId FROM AccountShare WHERE AccountId IN :AccountIds AND RowCause = 'Manual' Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        AccountShare[] accountSharesToRemove = new AccountShare[]{};     
            
            for (AccountShare acctShare : currentAccountShares) {
                if(!communityUsersById.containsKey(acctShare.UserOrGroupId) ||
                   !contactIdToAccountIds.containsKey(communityUsersById.get(acctShare.UserOrGroupId).ContactId)|| 
                   !contactIdToAccountIds.get(communityUsersById.get(acctShare.UserOrGroupId).ContactID).contains(acctShare.AccountID)){  
                       accountSharesToRemove.add(acctShare);
                   }
            }
        return accountSharesToRemove;
        }
        Catch(Exception ex){
            ex.getMessage();
            return null;
        }
    }
    /*------------------------------------------------------------
    Author:       Alexandria Sanborn
    Company:       Accenture
    Description:   Removes already existing AccountContactRelations from list to create.
                    Batch job initially queries all accounts in hierarchy, regardless of create/edit date,
                    and DML insert will fail if duplicate AccountContactRelations exist.

    <Date>      <Author Name>     <Brief Description of Change>
    3/20/2019   Alexandria Sanborn
    ------------------------------------------------------------*/
    private static AccountContactRelation[] removeAlreadyExistingAccountContactRelations(AccountContactRelation[] newAccountContactRelationshipsPotential, Set<id> accountIds, Set<id> contactIds){
        try{ 
        set<AccountContactRelation> newAccountContactRelationshipsActualCreate = new set<AccountContactRelation>();
        AccountContactRelation[] possibleACDuplicates = [SELECT id, AccountId, ContactId FROM AccountContactRelation 
                                                         WHERE AccountId IN :accountIds AND ContactId IN :contactIds 
                                                         AND (contact.Role__c = 'Site Analyst'OR Contact.Role__c = 'Site Admin') Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        
        for(AccountContactRelation potential : newAccountContactRelationshipsPotential){
            Boolean acExists = FALSE;
            for(AccountContactRelation existing : possibleACDuplicates){
                if(existing.AccountId == potential.AccountId && existing.ContactId == potential.ContactId){
                    acExists = TRUE;
                }
            }
            if(!acExists){
                newAccountContactRelationshipsActualCreate.add(potential);
            }
        }
        return new List<AccountContactRelation>(newAccountContactRelationshipsActualCreate);
        }
        Catch(Exception ex){
            ex.getMessage();
            return null;
        }
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Create Account Contact relationships to be created.
Method Name:  getAllChildAccts
Parameters:   Set of All child accountIds in the Hierarchy.
------------------------------------------------------------*/   
    private static AccountContactRelation[] createNewAccountContactRelationsForParentAccountsinChild(Set<AccountContactWrap> parentContactToChildAccount,Boolean isNotDirectHeirarchy)
    {
        
        List<AccountContactRelation> acContactList = new List<AccountContactRelation>();
        try{ 
            for(AccountContactWrap acw:parentContactToChildAccount){
            acContactList.add(new AccountContactRelation(AccountId = acw.accountId,contactId = acw.contactId,IsNotDirectHeirarchy__c=isNotDirectHeirarchy));
        	}
        }
        Catch(Exception ex){
            ex.getMessage();
        }
        return acContactList;
        //return accContList;
    }
     /*------------------------------------------------------------
Author:       Accenture
Description:  get all child Account in the Hierarchy.
Method Name:  getAllChildAccts
Parameters:   Set of All child accountIds in the Hierarchy.
------------------------------------------------------------*/
    Private List<Account> getAllChildAccts(Map<Id, Account> allAcctsByIds,String fields)
    {
        try{
            Set<Id> acctIds = allAcctsByIds.keySet();
        	String acctQuery = ACE_AccountHierarchy.getAllChildAccount(fields);
        	Account[] childAccounts = Database.query(acctQuery);
        	return childAccounts;
        }
        Catch(Exception ex)
        {
            ex.getMessage();
            return null;
        }
        
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort Parent Account To All child Account.
Method Name:  getchildToParentAccounts
Parameters:   Set of All child accountIds in the Hierarchy.
------------------------------------------------------------*/
    Private Map<Id,List<Id>> getParentTochildAccounts(List<Account> childAccounts)
    {
        Map<Id,List<Id>> parentAccountChildAccounts = new Map<Id,List<Id>>();
        try{ 
        for(Account childAcc:childAccounts)
        {
            if(!parentAccountChildAccounts.containskey(childAcc.parentid)){
                parentAccountChildAccounts.put(childAcc.parentid,new List<Id>());
            }
            parentAccountChildAccounts.get(childAcc.parentid).add(childAcc.id);
        }
        for(Id parentId:parentAccountChildAccounts.keyset())
        {
            for(Id secParentId:parentAccountChildAccounts.get(parentId) )
            {
                if(parentAccountChildAccounts.get(secParentId)!= null && parentAccountChildAccounts.get(secParentId).size() >0)
                {
                    parentAccountChildAccounts.get(parentId).addAll(parentAccountChildAccounts.get(secParentId));
                }
            }
        }
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        return parentAccountChildAccounts;
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort Account To All parent Account Map.
Method Name:  getchildToParentAccounts
Parameters:   Set of All child accountIds in the Hierarchy.
------------------------------------------------------------*/
    private Map<Id,List<Id>> getchildToParentAccounts(List<Account> childAccounts){
        Map<id,List<ID>> accToparentAccMap = new Map<id,List<ID>>();
        try{
        for(Account childAcc:childAccounts)
        {
            List<Id> parentIds = new List<Id>();
            if(!String.isBlank(childAcc.ParentID) )
            {
                parentIds.add(childAcc.ParentID);
            }
            if(!String.isBlank(childAcc.Parent.ParentID) )
            {
                parentIds.add(childAcc.Parent.ParentID);
            }
            if(!String.isBlank(childAcc.Parent.Parent.ParentId))
            {
                parentIds.add(childAcc.Parent.Parent.ParentId);
            }
            else if(!String.isBlank(childAcc.Parent.Parent.ParentId))
            {
                parentIds.add(childAcc.Parent.Parent.ParentId);
            }
            else if(!String.isBlank(childAcc.Parent.Parent.Parent.ParentId))
            {
                parentIds.add(childAcc.Parent.Parent.Parent.ParentId);
            }
            else if(!String.isBlank(childAcc.Parent.Parent.Parent.ParentId))
            {
                parentIds.add(childAcc.Parent.Parent.Parent.Parent.ParentId);
            }
            AccToparentAccMap.put(childAcc.id,parentIds);
        }
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        return accToparentAccMap;
    }
    /*------------------------------------------------------------
Author:       Accenture
Description:  Sort and get Account contact Relation to be created.
Method Name:  prepareParentAccountToChildContact
Parameters:   Map of child Account to List of Parent Account Ids
------------------------------------------------------------*/
    private List<AccountContactWrap> prepareParentAccountToChildContact(Map<id,List<ID>> accToparentAccMap)
    {
        Map<Id,List<Contact>> childAccToparentContactsMap = new Map<Id,List<Contact>>();
        Set<Id> parentAccIds = new Set<Id>();
        List<AccountContactWrap> parentContactToChildAccount = new List<AccountContactWrap>();
        
        try{ 
        for(Id childId:AccToparentAccMap.keyset())
        {
            parentAccIds.addAll(AccToparentAccMap.get(childId));
        }
        //Get all the contacts of all parentAccount
        List<contact> contList = [select id,AccountId from contact where Accountid =:parentAccIds AND (Role__c = 'Site Analyst'OR Role__c = 'Site Admin') Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        Map<Id,Id> contactToparentAcc = new map<Id,Id>();
        for(Contact con :contList)
        {
            contactToparentAcc.put(con.Id,con.AccountId);
        }
        //Iterate over child Account
        for(Id childId:AccToparentAccMap.keyset())
        {
            childAccToparentContactsMap.put(childId,new List<Contact>());
            for(Contact con:contList)
            {
                if(con.AccountId != childId && AccToparentAccMap.get(childId).contains(contactToparentAcc.get(con.Id)))
                {
                    if(childAccToparentContactsMap.containsKey(childId))
                    {
                        childAccToparentContactsMap.get(childId).add(con);
                    }
                    parentContactToChildAccount.add(new AccountContactWrap(childID,con.id));
                }
            }
        }
        }
        Catch(exception ex){
            ex.getMessage();
        }
        return parentContactToChildAccount;
    }
    public class AccountContactWrap{
        public Id accountId;
        public Id contactId;
        public AccountContactWrap(Id accountId,Id contactId){
            this.accountId = accountId;
            this.contactId = contactId;
        }
        
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Handler method to sort through and create AccountShare permissions from Community Users and Map<Id, Id[]> contactIdToAccountIds.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/ 
    private static void assignCommunityUsersAcctHierarchyPermissions(Map<Id,Id[]> contactIdToAccountIds, User[] communityUsers){
        assignPermissions(getAndSortAccountsByCommunityUser(contactIdToAccountIds, communityUsers));
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Generates AccountShares based on map of user id to account ids and 
				removes already created AccountShares to prevent duplicate errors
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/ 
    private static void assignPermissions(Map<Id, Id[]> userIdToAcctIds){
        AccountShare[] accountShares = new AccountShare[]{};
        Set<Id> acctIdsCurr = new Set<Id>();
        try{
        for(Id[] acctIdList : userIdToAcctIds.values()){
            acctIdsCurr.addAll(acctIdList);
        }
        AccountShare[] existingShares = [
            SELECT id, UserOrGroupId, AccountId
            FROM AccountShare
            WHERE UserOrGroupId IN :userIdToAcctIds.keySet() AND AccountId IN :acctIdsCurr];
        
        for(AccountShare existingShare : existingShares){
            if(userIdToAcctIds.containsKey(existingShare.UserOrGroupId) && userIdToAcctIds.get(existingShare.UserOrGroupId).contains(existingShare.AccountId)){
                
                Integer acctIdx = userIdToAcctIds.get(existingShare.UserOrGroupId).indexOf(existingShare.AccountId);
                userIdToAcctIds.get(existingShare.UserOrGroupId).remove(acctIdx);
            }
        }
        for(Id userId : userIdToAcctIds.keySet()){
            Id[] acctIds = userIdToAcctIds.get(userId);
            
            for(Id acctId : acctIds){
                AccountShare acctShare = new AccountShare();
                acctShare.AccountId = acctId;
                acctShare.AccountAccessLevel = 'Read';
                acctShare.UserOrGroupId = userId;
                acctShare.OpportunityAccessLevel = 'None';
                acctShare.ContactAccessLevel = 'Edit';
                accountShares.add(acctShare);
            }
        }
        insert accountShares;
        }
        Catch(exception ex)
        {
            ex.getMessage();
        }
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Sorts Account Ids to Community User Id based on Community Contact associated with both.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/      
    private static Map<Id, Id[]> getAndSortAccountsByCommunityUser(Map<Id, Id[]> contactIdToAccountIds, User[] communityUsers){
        Map<Id, Id[]> userIdToAccountIds = new Map<Id, Id[]>();
        try{
            for(User cu : communityUsers){
            if(!userIdToAccountIds.containsKey(cu.id)){
                userIdToAccountIds.put(cu.id, new Id[]{});
            }
            userIdToAccountIds.get(cu.Id).addAll(contactIdToAccountIds.get(cu.ContactId));
        }
        }
        Catch(Exception ex)
        {
            ex.getMessage();
        }
        return userIdToAccountIds;
    }
}