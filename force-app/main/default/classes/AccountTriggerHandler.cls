/*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Class to handle logic for the AccountTriggger
Inputs:        none
History
05/10/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
public with sharing class AccountTriggerHandler {
    //Added By CTS
    Public static Final String  CLASSNAME = 'AccountTriggerHandler';
    Public static Final String  METHODUPDATEPBSTATUS = 'updatePBStatusOnOutlet';
    Public static Final String  BARRECORDDERIVEDPB = 'Bar Record derived PB';
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Method to handle the after insert logic for the account trigger
Inputs:        Map<Id, Account> newMap
Returns:       none
History
05/10/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
    public static void handleAfterInsert(Map<Id, Account> newMap) {
        SurveyManager.createAvailableSurveyRecordsFromNewAccount(newMap.keySet());
    }
    
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Method to handle the after update logic for the account trigger
Inputs:        Map<Id, Account> newMap
Returns:       none
History
05/10/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
    public static void handleAfterUpdate(Map<Id, Account> newMap) {
        SurveyManager.createAvailableSurveyRecordsFromNewAccount(newMap.keySet());
    }
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Upon updating of account, set Objective's account owner 
email field to be the same as updated account's email
Inputs:        Map of Account Ids
History
05/10/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
    public static void handleAfterAccountOwnerUpdate(Map<Id, Account> newMap) {
        try{
            List<Account> acctswithOwnerChanged = new List<Account>();
            for(Account acc: ((Map<Id,Account>) Trigger.newMap).values()){
                if(acc.OwnerId != ((Map<Id,Account>) Trigger.oldMap).get(acc.Id).OwnerId){
                    acctswithOwnerChanged.add(acc);
                }
            }
            if(!acctswithOwnerChanged.IsEmpty()){
                List<Objective__c> tempList = new List<Objective__c>();
                for(Objective__c o : [SELECT Account__r.Id, Account_Owner_Email__c, Account__r.Owner.email
                                      FROM Objective__c
                                      WHERE Account__c IN :acctswithOwnerChanged AND RecordTypeId IN (SELECT Id FROM Recordtype WHERE SObjectType = :Label.Objective_SObject AND Name IN (:Label.Feature, :Label.Engagement, :Label.Placement, :Label.Space, :Label.Display, :Label.Merchandise)) LIMIT :(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                          if(o.Account_Owner_Email__c != o.Account__r.Owner.email){
                                              o.Account_Owner_Email__c = o.Account__r.Owner.email;
                                              tempList.add(o);
                                          }
                                      }
                if(!tempList.isEmpty()){
                    update tempList;
                }
            }
            
            
        } catch(Exception e){
            ErrorLog.insertErrorLog('AccountTriggerHandler', 'handleAfterAccountOwnerUpdate', e.getMessage(), e.getLineNumber());
        }
    }
    
    /*
* Added By CTS
*When the Field CTS_Setup_Principle_Brewer_Manually__c is updated and made to false from true then the logic runs and updates the Principle brewer.
*/
    public static void updatePBStatusOnOutlet()
    {
        set<Id> outletIds = new set<Id>();
        Map<Id,CTS_Utility_Class.PBValueWrapper> outletToBeUpdatedWithPBMap = new Map<Id,CTS_Utility_Class.PBValueWrapper>();
        for(Account outlet :(List<Account>) Trigger.new)
        {
            /*if((((Map<Id,Account>) Trigger.oldMap).get(outlet.Id).CTS_Setup_Principle_Brewer_Manually__c != outlet.CTS_Setup_Principle_Brewer_Manually__c) && 
(!outlet.CTS_Setup_Principle_Brewer_Manually__c))
{
outletIds.add(outlet.Id);
}*/
            if((((Map<Id,Account>) Trigger.oldMap).get(outlet.Id).CTS_PB_Status_Service_Owner__c != outlet.CTS_PB_Status_Service_Owner__c) && 
               (outlet.CTS_PB_Status_Service_Owner__c == BARRECORDDERIVEDPB))
            {
                outletIds.add(outlet.Id);
            }
        }
        try
        {
            if(!outletIds.IsEmpty())
            {
                outletToBeUpdatedWithPBMap = CTS_Utility_Class.returnPBValue(outletIds);
            }
            if(!outletToBeUpdatedWithPBMap.values().isEmpty())
            {
                //system.debug('Ids Size====='+outletIds);
                //system.debug('Keys====='+outletToBeUpdatedWithPBMap.keySet());
                //system.debug('values====='+outletToBeUpdatedWithPBMap.values() + outletToBeUpdatedWithPBMap.values().size());
                for(Account outlet:(List<Account>) Trigger.new)
                {
                    if(outletToBeUpdatedWithPBMap.containskey(outlet.Id)){
                    	outlet.CTS_Principal_Brewer_Status__c = outletToBeUpdatedWithPBMap.get(outlet.Id).pbValue;
                    }
                }
                
            }
        }catch(Exception ex){
            //system.debug('PB Error-----'+ex.getMessage()+ex.getLineNumber());
            ErrorLog.insertErrorLog(CLASSNAME, METHODUPDATEPBSTATUS, ex.getMessage(), ex.getLineNumber());
        }
        
    }
}