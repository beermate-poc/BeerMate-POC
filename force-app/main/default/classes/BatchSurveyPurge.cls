/*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   A batch class used to delete available survey records
Inputs:        none
History
06/14/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
global class BatchSurveyPurge implements Database.Batchable<sObject> {
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   Method that querys for a list of Available_Survey__c records to purge
    Inputs:        Database.BatchableContext BC
    History
    9/14/2017      Bryant Daniels     Initial creation
    ------------------------------------------------------------*/
    global Database.QueryLocator start(Database.BatchableContext BC) {
        return Database.getQueryLocator('SELECT Id, Survey_Assignment__c FROM Available_Survey__c WHERE Survey_Assignment__r.Purge_Date__c <= TODAY');
    }
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   Method that deletes Available_Survey__c records if they need to be purged.  Also
                   empties the recycle bin
    Inputs:        Database.BatchableContext BC
    History
    9/14/2017      Bryant Daniels     Initial creation
    ------------------------------------------------------------*/
    global void execute(Database.BatchableContext BC, List<Available_Survey__c> scope) {
        Set<Id> surveyAssignmentIds = new Set<Id>();
        for (Available_Survey__c a : scope) {
            surveyAssignmentIds.add(a.Survey_Assignment__c);
        }
        List<Survey_Assignment__c> surveyAssignments = [SELECT Status__c FROM Survey_Assignment__c WHERE Id IN :surveyAssignmentIds];
        for (Survey_Assignment__c s : surveyAssignments) {
            s.Status__c = Constants.PURGED;
        }
        if(!surveyAssignments.isEmpty()){
            update surveyAssignments;
        }
        if(!scope.isEmpty()){
            delete scope;
        }
        DataBase.emptyRecycleBin(scope);
    }
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   Finish method not in use
    Inputs:        Database.BatchableContext BC
    History
    9/14/2017      Bryant Daniels     Initial creation
    ------------------------------------------------------------*/
    global void finish(Database.BatchableContext BC) {}
}