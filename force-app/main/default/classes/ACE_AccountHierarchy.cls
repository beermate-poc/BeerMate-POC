/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Utility methods related to retrieving and sorting Account Hierarchy

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
public with sharing class ACE_AccountHierarchy {

/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns a set of account ids for any given "branch" in an Account Hierarchy.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    public static Set<Id> getAccountIdsFromHierarchy(Id accountId, ACE_AccountHierarchy.AccountHierarchy[] accountHierarchies, Map<Id, Account> accountById){
        ACE_AccountHierarchy.AccountHierarchy theHierarchy;
        Set<id> accountIds = new Set<Id>();
        theHierarchy  = filterAccountHierarchy(accountId, accountHierarchies, theHierarchy, null, accountById);
        if(theHierarchy != null){
            flattenAccountIdsFromHierarchy(theHierarchy, accountIds, accountId);
        }
        return accountIds;
    }


    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns a "branch" in the Account Hierarchy based on an account id input.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static ACE_AccountHierarchy.AccountHierarchy filterAccountHierarchy(Id accountId, ACE_AccountHierarchy.AccountHierarchy[] acctHierarchies, ACE_AccountHierarchy.AccountHierarchy theHierarchy, ACE_AccountHierarchy.AccountHierarchy topLevelBranch, Map<Id, Account> accountById){
        if(theHierarchy == null){
            for(ACE_AccountHierarchy.AccountHierarchy hierarchy : acctHierarchies){
                if(hierarchy.theParentId != accountId && hierarchy.accountChildren.size() != 0){
                    theHierarchy  = filterAccountHierarchy(accountId, hierarchy.accountChildren, theHierarchy, topLevelBranch, accountById);
                } else if (hierarchy.theParentId == accountId){
                    theHierarchy = hierarchy;
                    return theHierarchy;
                }
            }
        }
        return theHierarchy;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns a set of Account ids from the Account "branch" input.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static Set<Id> flattenAccountIdsFromHierarchy(ACE_AccountHierarchy.AccountHierarchy acctHierarchy, Set<Id> accountIds, Id accountId){
        accountIds.add(acctHierarchy.theParentId);
        if(acctHierarchy.accountChildren.size() > 0){
            Boolean isCurrentHierarchyLevel = FALSE;
            for(ACE_AccountHierarchy.AccountHierarchy hierarchy : acctHierarchy.accountChildren){
                if(hierarchy.theParentId == accountId){
                    isCurrentHierarchyLevel = TRUE;
                }
            }
            if(!isCurrentHierarchyLevel){
                for(ACE_AccountHierarchy.AccountHierarchy hierarchy : acctHierarchy.accountChildren){
                    flattenAccountIdsFromHierarchy(hierarchy, accountIds, accountId);
                }
            }
        }
        return accountIds;
    }

/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns all parent and children Accounts belonging to a Hierarchy unsorted.
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    public static Map<Id, Account> getAllChildAccts(Map<Id, Account> allAcctsByIds, String fields, String[] whereClauses, String orderClause){
        String acctQuery = acctQueryBuilder(fields, whereClauses, orderClause);
        Set<Id> acctIds = allAcctsByIds.keySet();
        Account[] accts = Database.query(acctQuery);
        Map<Id, Account> childAccts = new Map<Id, Account>(accts);

        Set<Id> parentAndChildAccounts = new Set<Id>(allAcctsByIds.keySet());
        parentAndChildAccounts.addAll(childAccts.keySet());
        if(childAccountsFound(allAcctsByIds.size(), parentAndChildAccounts.size())){
            for(Account parentAcct : childAccts.values()){
                if(!allAcctsByIds.containsKey(parentAcct.id)){
                    allAcctsByIds.put(parentAcct.id, parentAcct);
                }
            }
            getAllChildAccts(allAcctsByIds,fields, whereClauses,orderClause);
        }
        return allAcctsByIds;
    }
	public static string getAllChildAccount(String fields)
    {
       return acctQueryBuilder(fields, null, null);
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Sorts Accounts into their respective hierarchies using
                custom inner class ACE_AccountHierarchy.AccountHierarchy
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    public static ACE_AccountHierarchy.AccountHierarchy[] createAccountHierarchy(ACE_AccountHierarchy.AccountHierarchy[] currentHierarchy, Map<Id, Account> accountsByIds){
        Account[] remainingAccts = accountsByIds.values();
        Integer remainingAcctsSize = remainingAccts.size();
        
        for(Integer acctIdx=0; acctIdx < remainingAcctsSize; acctIdx++){
            Account acct = remainingAccts[acctIdx];           
            if(acct.ParentId == null){
                currentHierarchy.add(new ACE_AccountHierarchy.AccountHierarchy(acct.id));
                accountsByIds.remove(acct.id);
            } else {
                Boolean accountFound = FALSE;               
                Integer currentHierarchySize = currentHierarchy.size();
                for(Integer hierarchyIdx=0; hierarchyIdx < currentHierarchySize; hierarchyIdx++){
                    ACE_AccountHierarchy.AccountHierarchy currBranch = currentHierarchy[hierarchyIdx];
                    if(currBranch.theParentId == acct.ParentId){
                        accountFound = TRUE;
                        accountsByIds.remove(acct.id);
                        currBranch.accountChildren.add(new ACE_AccountHierarchy.AccountHierarchy(acct.Id));
                    }
                    if(!accountFound && currBranch.accountChildren.size() > 0){
                        createAccountHierarchy(currBranch.accountChildren, accountsByIds);
                    }
                }
            }
        }
        return currentHierarchy;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns boolean comparing list sizes of current parent accounts and
                current parent and child accounts after querying for next level child Accounts
                to see if there could potentially be more 
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    public static Boolean childAccountsFound(Integer topLevelAcctsSize, Integer allAccountsSize) {
        return topLevelAcctsSize < allAccountsSize;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Maps a Contact id to all associated Account ids in hierarchy
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    public static Map<Id, Id[]> sortShipTosByAccountContact(AccountContactRelation[] acctContacts, ACE_AccountHierarchy.AccountHierarchy[] accountHierarchies, Map<Id, Account> accountById){
        Map<Id, Id[]> contactIdToShipToIds = new Map<Id, Id[]>();

        for(AccountContactRelation acctcontact : acctContacts){
            if(!contactIdToShipToIds.containsKey(acctcontact.ContactId)){
                contactIdToShipToIds.put(acctcontact.ContactId, new Id[]{});
            }

            Set<Id> accountIds = ACE_AccountHierarchy.getAccountIdsFromHierarchy(acctcontact.AccountId, accountHierarchies, accountById);
            for(Id acctId : accountIds){
                contactIdToShipToIds.get(acctcontact.ContactId).add(acctId);
            }
        }
        return contactIdToShipToIds;
    }
    
   private static string acctQueryBuilder(String fields, String[] whereClauses, String orderClause){
        String acctQuery = 'SELECT ' + fields + 
            ', Parent.ParentId, Parent.Parent.ParentId, Parent.Parent.Parent.ParentId, Parent.Parent.Parent.Parent.ParentId ' + 
            'FROM ACCOUNT ' + 
            'WHERE Id NOT IN :acctIds AND (ParentId IN :acctIds OR Parent.ParentId IN :acctIds OR Parent.Parent.ParentId IN :acctIds OR Parent.Parent.Parent.ParentId IN :acctIds OR Parent.Parent.Parent.Parent.ParentId IN :acctIds) ';
        if(whereClauses != null && whereClauses.size() > 0){
            for(String clause : whereClauses){
                acctQuery = acctQuery + ' AND ' + clause;
            }
        }
        acctQuery += ' ORDER BY ParentId NULLS FIRST';
        acctQuery = orderClause != null ? acctQuery + ',' + orderClause : acctQuery;
       return acctQuery;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Custom inner class for sorting Accounts by hierarchy
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    public class AccountHierarchy{
        public Id theParentId;
        public List<AccountHierarchy> accountChildren;

        public AccountHierarchy(Id acctId){
            this.theParentId = acctId;
            this.accountChildren = new List<AccountHierarchy>();
        }
    }
}