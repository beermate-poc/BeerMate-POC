/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Batch class to share Fund Requests to all AccountContactRelations associated with
                the Fund Request's Ship To
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

global class ACE_FundRequestBatchable implements Database.batchable<sObject>{

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns batch of Fund Requests based on creation date.
            Current out of the box validation rule prevents users from updating Account Ship To
            so Fund Requests will never move among hierarchies.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    global PartnerFundRequest[] start(Database.BatchableContext info){
        return [SELECT id, Account_Ship_To__c, ChannelPartnerId, Allocation.ACE_Co_Op_Event__c, 
                ACE_Status__c FROM PartnerFundRequest WHERE CreatedDate = LAST_N_DAYS:365 AND 
                (ACE_Status__c='Pending Acceptance' OR ACE_Status__c='Approved' OR ACE_Status__c='Open') 
               LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Gets related Contacts from the Fund Request's Ship To, gets Community users from Contacts, assigns
            Manual Sharing to Fund Request.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    global void execute(Database.BatchableContext info, List<PartnerFundRequest> fundRequests){
        PartnerFundRequest[] muFundRequests = ACE_Utils.filterPartnerFundRequestsByNullFieldVal(fundRequests, 'Account_Ship_To__c');
        System.debug(muFundRequests);
        Map<Id, Id[]> fundRequestIdsByMUId = sortFundRequestsByMU(muFundRequests);
        System.debug(fundRequestIdsByMUId);
        Set<Id> muIds = fundRequestIdsByMUId.keySet();
        Set<Id> shipToIds = getLookupIds(fundRequests, 'Account_Ship_To__c');
   
        
        Account[] shipTosFromMU = ACE_Utils.getShipTosByMU(muIds);
        Map<Id, Id[]> shipToIdToFundRequestIds = sortFundRequestsByShipTos(fundRequests);
        System.debug(shipToIdToFundRequestIds);
        System.debug(shipTosFromMU);
        shipToIdToFundRequestIds = sortFundRequestsByMUHierarchy(shipToIdToFundRequestIds,shipTosFromMU,fundRequestIdsByMUId);
        System.debug(shipToIdToFundRequestIds);

        Map<Id, Id[]> contactByShipTos = ACE_Utils.getAndSortContactByShipTos(shipToIdToFundRequestIds.keyset());
        User[] communityUsers = ACE_Utils.getCommunityUsers(contactByShipTos.keySet());
        Map<Id, Id[]> userIdToFundRequestIds = ACE_Utils.getAndSortDistObjectIdsByCommunityUser(shipToIdToFundRequestIds, contactByShipTos, communityUsers);
        System.debug(userIdToFundRequestIds);
        removePermissions(fundRequests, userIdToFundRequestIds);
        assignPermissions(userIdToFundRequestIds);
        
    }
    global void finish(Database.BatchableContext info){
         Integer reimburseBatchsize = Integer.valueOf(Label.ACE_ReimbursementBatch_Size);
         Database.executeBatch(new ACE_ReimbursementBatchable(), reimburseBatchsize);
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns Map of Account Ship To Id -> Fund Request Ids so that process can identify
               Fund Requests relevant to a community user based on the community user's contact's account lookup.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/


    private static Map<Id, Id[]> sortFundRequestsByShipTos(PartnerFundRequest[] fundReqs){
        Map<Id, Id[]> shipToIdToFundRequestIds = new Map<Id, Id[]>();
        for(PartnerFundRequest fr : fundReqs){
            if(fr.Account_Ship_To__c != null && (isNotCoOpFR(fr.Allocation.ACE_Co_Op_Event__c) || isCoOpFRAndStatusPendingAcceptance(fr))){
                if(!shipToIdToFundRequestIds.containsKey(fr.Account_Ship_To__c)){
                    shipToIdToFundRequestIds.put(fr.Account_Ship_To__c, new Id[]{});
                }
                shipToIdToFundRequestIds.get(fr.Account_Ship_To__c).add(fr.id);
            }
        }
        return shipToIdToFundRequestIds;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns Boolean statement based on Boolean input if Fund Request is Co Op

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static Boolean isNotCoOpFR(Boolean coOpIndicator){
        return !coOpIndicator;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns Boolean statement based on Boolean input if Fund Request is Co Op and Pending

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static Boolean isCoOpFRAndStatusPendingAcceptance(PartnerFundRequest fr){
        return fr.Allocation.ACE_Co_Op_Event__c && (fr.ACE_Status__c == 'Pending Acceptance' || fr.ACE_Status__c == 'Approved');
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns list of lookup ids from list of Fund Request records and lookup field String API name.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static Set<Id> getLookupIds(PartnerFundRequest[] fundRequests, String lookupField){
        Set<Id> lookupIds = new Set<Id>{};
        for(PartnerFundRequest fr : fundRequests){
            lookupIds.add((Id)fr.get(lookupField));
        }
        return lookupIds;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Inserts Manual Sharing Rules between a Fund Request record and all relevant Community Users.
            Removes Fund Requests from batch to create if a sharing rule has already been created because
            Salesforce will not allow duplicates.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/

    private static void assignPermissions(Map<Id, Id[]> userIdToFundRequestIds){
        System.debug('userIdToFundRequestIds:'+userIdToFundRequestIds);
        PartnerFundRequestShare[] frShares = new PartnerFundRequestShare[]{};
        PartnerFundRequestShare[] existingShares = [
                SELECT id, ParentId, UserOrGroupId
                FROM PartnerFundRequestShare
                WHERE UserOrGroupId IN :userIdToFundRequestIds.keySet()
        		LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];

        for(PartnerFundRequestShare existingShare : existingShares){
            if(userIdToFundRequestIds.containsKey(existingShare.UserOrGroupId) && userIdToFundRequestIds.get(existingShare.UserOrGroupId).contains(existingShare.ParentId)){
                Integer frIdx = userIdToFundRequestIds.get(existingShare.UserOrGroupId).indexOf(existingShare.ParentId);
                userIdToFundRequestIds.get(existingShare.UserOrGroupId).remove(frIdx);
            }
        }

        for(Id userId : userIdToFundRequestIds.keySet()){
            Id[] fundReqIds = userIdToFundRequestIds.get(userId);
            for(Id frId : fundReqIds){
                PartnerFundRequestShare frShare = new PartnerFundRequestShare();
                frShare.ParentId = frId;
                frShare.AccessLevel = 'Edit';
                frShare.UserOrGroupId = userId;
                frShares.add(frShare);
            }
        }
        insert frShares;
    }

    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Removes Fund Request permission if user is no longer associated with the Ship To Account.

<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
    private static void removePermissions(PartnerFundRequest[] fundRequests, Map<Id, Id[]> userIdToFundRequestIds){
        PartnerFundRequestShare[] frSharesToDelete = new PartnerFundRequestShare[]{};
        PartnerFundRequestShare[] currentFRShares = [SELECT id, ParentId, UserOrGroupId FROM 
        PartnerFundRequestShare WHERE ParentId IN :fundRequests AND RowCause='Manual' 
         LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];//AND UserOrGroupId IN :userIdToFundRequestIds.keySet() 

        for(PartnerFundRequestShare frShare : currentFRShares){
            if(!userIdToFundRequestIds.containsKey(frShare.UserOrGroupId) || !userIdToFundRequestIds.get(frShare.UserOrGroupId).contains(frShare.ParentId)){
                frSharesToDelete.add(frShare);
            }
        }
        delete frSharesToDelete;
    }
    
    private static Map<Id,Id[]> sortFundRequestsByMU(PartnerFundRequest[] muFundRequests){
        Map<Id, Id[]> fundRequestIdsByMUId = new Map<Id, Id[]>(); 
        for(PartnerFundRequest fr : muFundRequests){
            if(!fundRequestIdsByMUId.containsKey(fr.ChannelPartnerId)){
                fundRequestIdsByMUId.put(fr.ChannelPartnerId, new Id[]{});
            }
            fundRequestIdsByMUId.get(fr.ChannelPartnerId).add(fr.Id);
        }
        return fundRequestIdsByMUId;
    }
    
    private static Map<Id, Id[]> sortFundRequestsByMUHierarchy(Map<Id, Id[]> shipToIdToFundRequestIds, Account[] shipTosFromMU, Map<Id, Id[]> fundRequestIdsByMUId){
        //check to make sure this isn't pass by reference
        for(Account shipTo : shipTosFromMU){
            if(!shipToIdToFundRequestIds.containsKey(shipTo.Id)){
                shipToIdToFundRequestIds.put(shipTo.Id, new Id[]{});
            }
            
            Id[] fundReqs = fundRequestIdsByMUId.get(shipTo.Cust_Hierarchy_lvl4_link__c);
           	shipToIdToFundRequestIds.get(shipTo.id).addAll(fundReqs);
        }
        return shipToIdToFundRequestIds;  
    }
}