/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Batch class to share Reimbursements to all AccountContactRelations associated with
                the Reimbursement's Ship To
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
global class ACE_ReimbursementBatchable implements Database.batchable<sObject>{

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns batch of reimbursements based on creation date.
                Current out of the box validation rule prevents users from updating Account Ship To
                so reimbursements will never move among hierarchies.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    global PartnerFundClaim[] start(Database.BatchableContext info){
        return [SELECT id, Account_Ship_To__c,Line_Item__c FROM PartnerFundClaim WHERE CreatedDate=LAST_N_DAYS:365 
                Limit :Limits.getLimitQueryRows() - Limits.getQueryRows() ];
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Gets related Contacts from the Reimbursement's Ship To, gets Community users from Contacts, assigns
                Manual Sharing to Reimbursement.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    global void execute(Database.BatchableContext info, List<PartnerFundClaim> reimbursements){
        Set<Id> shipToIds = getLookupIds(reimbursements, 'Account_Ship_To__c');
        Map<Id, Id[]> shipToIdToReimbursementIds = sortReimbursementsByShipTos(reimbursements);
        Map<Id, Id[]> contactByShipTos = ACE_Utils.getAndSortContactByShipTos(shipToIds);
        for(String ids:contactByShipTos.keyset()){
            if(ids=='0030S00000O1qU3QAJ'){
                System.debug('contactByShipTos'+contactByShipTos.get(ids));
            }
        }
        User[] communityUsers = ACE_Utils.getCommunityUsers(contactByShipTos.keySet());
        Map<Id, Id[]> userIdToReimbursementIds = ACE_Utils.getAndSortDistObjectIdsByCommunityUser(shipToIdToReimbursementIds, contactByShipTos, communityUsers);
        removePermissions(reimbursements,userIdToReimbursementIds);
        assignPermissions(userIdToReimbursementIds);
        
        
    }

    global void finish(Database.BatchableContext info){}

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns list of lookup ids from list of reimbursement records and lookup field String API name.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static Set<Id> getLookupIds(PartnerFundClaim[] reimbursements, String lookupField){
        Set<Id> lookupIds = new Set<Id>{};
        for(PartnerFundClaim r : reimbursements){
            lookupIds.add((Id)r.get(lookupField));
        }
        return lookupIds;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns Map of Account Ship To Id -> Reimbursement Ids so that process can identify
               reimbursements relevant to a community user based on the community user's contact's account lookup.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    private static Map<Id, Id[]> sortReimbursementsByShipTos(PartnerFundClaim[] reimbursements){
        Map<Id, Id[]> shipToIdToReimbursementIds = new Map<Id, Id[]>();
        for(PartnerFundClaim r : reimbursements){
            if(!shipToIdToReimbursementIds.containsKey(r.Account_Ship_To__c)){
                shipToIdToReimbursementIds.put(r.Account_Ship_To__c, new Id[]{});
            }
            shipToIdToReimbursementIds.get(r.Account_Ship_To__c).add(r.id);
        }
        return shipToIdToReimbursementIds;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Inserts Manual Sharing Rules between a Reimbursement record and all relevant Community Users.
                Removes reimbursements from batch to create if a sharing rule has already been created because
                Salesforce will not allow duplicates.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static void assignPermissions(Map<Id, Id[]> userIdToReimbursementIds){
        PartnerFundClaimShare[] reimbursementShares = new PartnerFundClaimShare[]{};
        Set<Id> reimbuseIdsCurr = new Set<Id>();
        try{
        for(Id[] reimbIdList : userIdToReimbursementIds.values()){
            reimbuseIdsCurr.addAll(reimbIdList);
        }
        PartnerFundClaimShare[] existingShares = [
                SELECT id, ParentId, UserOrGroupId
                FROM PartnerFundClaimShare
                WHERE UserOrGroupId IN :userIdToReimbursementIds.keySet() AND
                ParentId IN :reimbuseIdsCurr
            Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];

        for(PartnerFundClaimShare existingShare : existingShares){
            if(userIdToReimbursementIds.containsKey(existingShare.UserOrGroupId) && userIdToReimbursementIds.get(existingShare.UserOrGroupId).contains(existingShare.ParentId)){
                Integer rIdx = userIdToReimbursementIds.get(existingShare.UserOrGroupId).indexOf(existingShare.ParentId);
                userIdToReimbursementIds.get(existingShare.UserOrGroupId).remove(rIdx);
            }
        }

        for(Id userId : userIdToReimbursementIds.keySet()){
            Id[] reimbursementIds = userIdToReimbursementIds.get(userId);
            for(Id rId : reimbursementIds){
                PartnerFundClaimShare reimbursement = new PartnerFundClaimShare();
                reimbursement.ParentId = rId;
                reimbursement.AccessLevel = 'Edit';
                reimbursement.UserOrGroupId = userId;
                reimbursementShares.add(reimbursement);
            }
        }
        insert reimbursementShares;
        }
        Catch(exception ex)
        {
            ex.getMessage();
        }
    }
    private static void removePermissions(PartnerFundClaim[] reimbursements, Map<Id, Id[]> userIdToReimbursementIds){
        PartnerFundClaimShare[] frSharesToDelete = new PartnerFundClaimShare[]{};
        PartnerFundClaimShare[] currentFRShares = [SELECT id, ParentId, UserOrGroupId FROM 
        PartnerFundClaimShare WHERE ParentId IN :reimbursements AND RowCause='Manual' Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
		System.debug('reimbursements'+reimbursements);
        System.debug('userIdToReimbursementIds'+userIdToReimbursementIds);
        for(String ids:userIdToReimbursementIds.keyset()){
            if(ids =='0050S000002WaP0QAK'){
                System.debug('reimb::'+userIdToReimbursementIds.get(ids));
            }
        }
        for(PartnerFundClaimShare frShare : currentFRShares){
            if(!userIdToReimbursementIds.containsKey(frShare.UserOrGroupId) || !userIdToReimbursementIds.get(frShare.UserOrGroupId).contains(frShare.ParentId)){
                frSharesToDelete.add(frShare);
            }
        }
        delete frSharesToDelete;
    }
}