/**
* @author        PRAKASH PITCHAIAH
* @Name          C360FutureObjectiveCallSummaryBatch 
* @Created date  05/11/2019
* @description   Batch will create objective call summary records for future dated event & Objectivies
* @Version       1.0
**/

global class C360FutureObjectiveCallSummaryBatch implements Database.Batchable<sObject>{

    global String query;
    global Date tomorrowDate = Date.today()+1;
    global Date todayDate = Date.today();
    global string objName = 'Account'; // QUERY EVENT UNDER ACCOUNTS
    global C360FutureObjectiveCallSummaryBatch__c objGame = C360FutureObjectiveCallSummaryBatch__c.getValues('C360FutureObjectiveCallSummaryBatch');
  
    global Database.QueryLocator start(Database.BatchableContext BC){
                           
        // QUERY FUTURE DATED EVENT RECORDS 
        string query = 'SELECT Id, StartDateTime, EndDateTime,WhatId,Objective_Call_Summary__c FROM Event WHERE What.Type = :objName AND DAY_ONLY(StartDateTime) >= :tomorrowDate ORDER BY WhatId,StartDateTime';
        return Database.getQueryLocator(query);
    }

    global void execute(Database.BatchableContext BC, List<Event> eventList){
    
        try {
        
            Set<Id> accIdSet = new Set<Id>();
            Map<Id, List<Objective__c>> accountIdAndObjectiveMap = new  Map<Id, List<Objective__c>>();
            List<Objective_Call_Summary__c> tobeInsertOrUpdateOCSList = new List<Objective_Call_Summary__c>();
            List<Id> tempEventIdList = new List<Id>();
            
            for (Event ev :eventList) {
                accIdSet.add(ev.WhatId); // ADD ACCOUNT ID IN THE SET
            }
            accountIdAndObjectiveMap = queryObjectiveDetails(accIdSet); // CALL METHOD TO GET THE FUTURE FUTURE OBJECTIVE DETAILS RECORD
            Objective_Call_Summary__c objrec; 
            String appendValue;
            
            Datetime lastexecutionBatchDatetime = objGame != NULL ? objGame.Last_Batch_executed_time__c : NULL;
            Boolean recentUpdatetedDatetimeObjective = false; 
            
            for (Event ev :eventList) {
                
                objrec = new Objective_Call_Summary__c(); // INITIALIZE THE OCS
                appendValue = ''; // INITIALIZE THE APPEND VALUE
                recentUpdatetedDatetimeObjective = false; // INITIALIZE THE BOOLEAN VALUE
                
                if (ev.Objective_Call_Summary__c != NULL) {
                    objrec.Id = ev.Objective_Call_Summary__c;
                }
                
                // ALLOW ONLY EVENT HAVE OBJECTIVES
                if (accountIdAndObjectiveMap.containsKey(ev.WhatId) && accountIdAndObjectiveMap.get(ev.WhatId) != NULL) {
                
                    for (Objective__c obj : accountIdAndObjectiveMap.get(ev.WhatId)) { // ITERATE CORRSPONDING OBJECTIVE RECORDS
                        
                        appendValue = C360ObjectiveController.appendValueFU(appendValue, obj);
                        recentUpdatetedDatetimeObjective  = lastexecutionBatchDatetime == NULL || recentUpdatetedDatetimeObjective || lastexecutionBatchDatetime <= obj.LastModifiedDate ? true :false; // TRUE MEAN THE OBJECTIVE RECORD HAS UPDATED RECENTLY                
                    }
                    objrec.Objective_Summary__c = appendValue;
                    objrec.Future_Objective_Call_Summary__c = TRUE; // TO DETERMINE FUTURE OBJECTIVE CALL SUMMARY RECORDS
                    objrec.Number_of_objectives__c = accountIdAndObjectiveMap.containsKey(ev.WhatId) && accountIdAndObjectiveMap.get(ev.WhatId) != NULL ? accountIdAndObjectiveMap.get(ev.WhatId).size() : 0;
                    IF (recentUpdatetedDatetimeObjective || ev.Objective_Call_Summary__c == NULL) { // IF IT IS NULL MEAN NO RECORD HAS BEEN CREATED IN THE OCS FOR THIS EVENT
                    
                        tobeInsertOrUpdateOCSList.add(objrec);
                        tempEventIdList.add(ev.Id); // ADDING TEMP EVENT ID TO FIND OUT WHICH EVENT BELONGS TO PARTICULR OBJECTIVES RECORDS
                    }
                }
            }
            
            if (!tobeInsertOrUpdateOCSList.isempty()) {
            
                List<Database.UpsertResult> srList = Database.Upsert (tobeInsertOrUpdateOCSList, false);
                ErrorLog.logDatabaseError(srList, C360_Util_Constants.ClsNameBatch +':' + C360_Util_Constants.MethodNameBatch ); // ERROR LOG CREATION 
                toUpdateOCSIdOnEventFun(srList, tempEventIdList); // UPDATE OCS ID ON EVENT RECORDS 
            }
        } catch(Exception ex){
            
            ErrorLog.insertErrorLog(C360_Util_Constants.ClsNameBatch, C360_Util_Constants.MethodNameBatch , ex.getMessage(), ex.getLineNumber());
        }         
    }
    
    // QUERY FUTURE OBJECTIVE DETAILS RECORD 
    public Map<Id, List<Objective__c>> queryObjectiveDetails(Set<Id> accIdSet) {
                        
        Map<Id, List<Objective__c>> accountIdAndObjectiveMap = new  Map<Id, List<Objective__c>>();
        
      /*  Example:
        If today is 9th May, 2019 and The Fountain Inn(Account) – scheduled/manually created call for May 10th 2019 Objective 1 – Sell in Carling (start January 2019, end December 2019)
        Objective 2 – Sell in Coors Light (start February 2019, end June 2019) Objective 3 – Sell in Blue Moon (start January 2019, end April 2019)
        Objective 1 and 2 should be associated with the scheduled/manually created call as both ‘Active’ on the date of the call. Objective 3 has expired so that it should not be associated.
        */
        for (Objective__c obj :[SELECT Id, Status__c,C360_Execution_Type__c,C360_Product__c,Name, C360_Product__r.Name, Account__c,C360_Planned_Objective_Start__c, C360_Planned_Objective_End__c, LastModifiedDate  
                                FROM Objective__c 
                                WHERE Account__c = :accIdSet AND C360_Planned_Objective_Start__c <= :todayDate AND C360_Planned_Objective_End__c >= :tomorrowDate 
                                ORDER BY Account__c,C360_Planned_Objective_End__c  LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
        
            if (!accountIdAndObjectiveMap.containsKey(obj.Account__c))
                accountIdAndObjectiveMap.put(obj.Account__c, new List<Objective__c>());  
                
            accountIdAndObjectiveMap.get(obj.Account__c).add (obj); // ACCOUNT ID AND CORRESPONDING OBJECTIVES RECORDS
        }
        return accountIdAndObjectiveMap;

    }

    global void finish(Database.BatchableContext BC){
           
        if (objGame != NULL){
            insertCustomSettingsFun(objGame.Id);
        }else{
         insertCustomSettingsFun('');
        }
    }
    
    public void insertCustomSettingsFun(String recId) {
        
        try {
            C360FutureObjectiveCallSummaryBatch__c cv =  new C360FutureObjectiveCallSummaryBatch__c(Name = 'C360FutureObjectiveCallSummaryBatch',Last_Batch_executed_time__c = system.now());
            if (recId != NULL && recId != ''){
                cv.Id = recId;
            } 
            Upsert cv;
        } catch(Exception ex){
            
            ErrorLog.insertErrorLog(C360_Util_Constants.ClsNameBatch, C360_Util_Constants.MethodNameBatch , ex.getMessage(), ex.getLineNumber());
        }
    }
    
    // UPDATING OBJECTIVE CALL SUMMARY ID ON EVENT RECORDS
    public void toUpdateOCSIdOnEventFun(List<Database.UpsertResult> results, List<Id> tempEventIdList) {
        
        List<Event> tobeUpdatedEventList = new List<Event>();
        Id eventId;
        
        for(Integer index = 0, size = results.size(); index < size; index++) {
            
            if(results[index].isSuccess()) {
                
                Event ev = new Event(Id = tempEventIdList[index], Objective_Call_Summary__c = results[index].Id);
                tobeUpdatedEventList.add(ev);
            }
        }
        
        if (!tobeUpdatedEventList.isempty()) {
            
            List<Database.SaveResult> srList = Database.Update(tobeUpdatedEventList, false);
            ErrorLog.logDataUpdateError(srList, C360_Util_Constants.ClsNameBatch +':' + 'toUpdateOCSIdOnEventFun' ); // ERROR LOG CREATION 
        }
    }
}