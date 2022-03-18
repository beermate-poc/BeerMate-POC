/**
* @author        PRAKASH PITCHAIAH
* @Name          C360ObjectiveController
* @Created date  05/11/2019
* @description   Manual call action for objectives
* @Version       1.0
**/
public without sharing class C360ObjectiveController{
    
    public class ResultWrapper{
    
        @AuraEnabled public Boolean success;
        @AuraEnabled public String message;
    }

    //Use @AuraEnabled to enable to create a objective summary record
    @AuraEnabled
    public static ResultWrapper objectiveCallSummaryFun(String eventId, String objectiveId) {
        
        ResultWrapper wrap = new ResultWrapper();
        wrap.success = true;
        try {
            Objective__c objRec = getObjectiveDetails(objectiveId);
            Event eve = getEventDetails(eventId);
            
            // ALLOW ONLY EXECUTED OBJECTIVE
            if (objRec != NULL && objRec.Status__c == 'Executed' && eve != NULL && eve.Objective_Call_Summary__c != NULL) { 
            
                String objectiveCallSummaValue = eve != NULL && eve.Objective_Call_Summary__r.Future_Objective_Call_Summary__c == TRUE ? appendValueFU('', objRec) : appendValueFU(eve.Objective_Call_Summary__r.Objective_Summary__c, objRec);
                Decimal noOfObjectiveValue = eve != NULL && eve.Objective_Call_Summary__r.Future_Objective_Call_Summary__c == TRUE ? 1 :eve.Objective_Call_Summary__r.Number_of_objectives__c +1 ;
                updateObjectiveCallSummaryFun(objectiveCallSummaValue, eve.Objective_Call_Summary__c, noOfObjectiveValue );
                
            }else if (objRec != NULL && objRec.Status__c == 'Executed'){ // CREATE OBJECTIVE CALL SUMMARY RECORDS FOR THE SALES REP
                
                Objective_Call_Summary__c objcallSumm = createObjectiveCallSummaryFun(objRec);
                // UPDATE EVENT
               // system.debug ('::eve::' +eve);
                eve.Objective_Call_Summary__c = objcallSumm.Id; // ASSOCIATE THE OBJECTIVE CALL SUMMARY ID ON THE EVENT RECORD
                Update eve;                        
            }  
        } catch(Exception ex){
            
            wrap.success = false;
            wrap.message = ex.getMessage()+'\n'+ex.getStackTraceString();
            ErrorLog.insertErrorLog(C360_Util_Constants.ClsNameOLC , C360_Util_Constants.MethodNameOLC , ex.getMessage(), ex.getLineNumber());

        }  
        return wrap;            
    }
    
    // event details 
    public static Event getEventDetails(String eventId) {
            
        return [SELECT Id,Objective_Call_Summary__c,Objective_Call_Summary__r.Objective_Summary__c,  Objective_Call_Summary__r.Future_Objective_Call_Summary__c,  Objective_Call_Summary__r.Number_of_objectives__c FROM Event WHERE Id = :eventId LIMIT 1];    
    }
    
    // objective detials
    public static Objective__c getObjectiveDetails(String objectiveId){
        
        return [SELECT Id, Status__c,C360_Execution_Type__c,C360_Product__c,Name, C360_Product__r.Name FROM Objective__c WHERE Id = :objectiveId LIMIT 1 ];
    }
    
    //CREATE OBJECTIVE CALL SUMMARY RECORDS FOR THE SALES REP 
    public static Objective_Call_Summary__c createObjectiveCallSummaryFun(Objective__c obj){
        
        Objective_Call_Summary__c objrec = new Objective_Call_Summary__c(Objective_Summary__c = appendValueFU('', obj), Number_of_objectives__c = 1);
        Insert objrec;
        return objrec;       
    }
    
    // append objective information
    public static string appendValueFU(string appendValue, Objective__c obj) {
        
        string executionType = obj.C360_Execution_Type__c != NULL ? obj.C360_Execution_Type__c :'';
        string productName = obj.C360_Product__c != NULL ? obj.C360_Product__r.Name :'';
        
        appendValue += obj.Name + ', ' + executionType + ', ' + productName  + '; ';
        return appendValue;
    }
    
    // UPDATE OBJECTIVE CALL SUMMARY FUNCTION RECORD
    public static void updateObjectiveCallSummaryFun(String summaryVal, String OCSId, Decimal noOfObjective) {
        
        Objective_Call_Summary__c objrec = new Objective_Call_Summary__c(Id = OCSId,Objective_Summary__c = summaryVal, Future_Objective_Call_Summary__c = FALSE,Number_of_objectives__c = noOfObjective);
        Update objrec;
    }
    
    
    
}