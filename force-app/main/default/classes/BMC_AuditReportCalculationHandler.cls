/**
@Author Accenture
@name BMC_AuditReportCalculationHandler
@CreateDate  1/30/2019
@Description Trigger handler to calculate distributor quality index for Audit Report.
@Version <1.0>
*/
public with sharing class BMC_AuditReportCalculationHandler {
     /**
    *  Method to calculate distributor quality index for Audit Report. 
    *  @name dqaSummarycalculation
    *  @param auditreportList: Audit Report Records
    *  @return null
    */    
  public static void dqaSummarycalculation(List<BMC_Audit_Report__c> auditreportList){
        try{
            set<Id> distributorIds= new set<Id>();
            for(BMC_Audit_Report__c auditReportObj:auditreportList){
                distributorIds.add(auditReportObj.BMC_Distributor__c);
            }
            
            for(BMC_Retail_Quality_Audit__c rqaObj:[SELECT BMC_Audit_Date__c, BMC_Distributor__c,BMC_RQA_QCE__c,BMC_RQA_QACE__c,BMC_RQA_QACE_Draught__c,BMC_RQA_QACE_Pacakge__c,BMC_RQA_QAGE__c,BMC_RQA_QAGE_Draught__c,BMC_RQA_QAGE_Package__c, BMC_RQA_QOOC__c, BMC_RQA_QOOR__c, BMC_RQA_QDMG__c, BMC_RQA_AQOOC__c, BMC_RQA_AOOC__c from BMC_Retail_Quality_Audit__c where BMC_Distributor__c IN: distributorIds LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())])
            {
                for(BMC_Audit_Report__c auditReportObj:auditreportList){
                    if(rqaObj.BMC_Audit_Date__c >= auditReportObj.BMC_Start_Date__c && rqaObj.BMC_Audit_Date__c <= auditReportObj.BMC_End_Date__c && rqaObj.BMC_Distributor__c  == auditReportObj.BMC_Distributor__c){ 
                        auditReportObj.BMC_AR_QCE__c=auditReportObj.BMC_AR_QCE__c+rqaObj.BMC_RQA_QCE__c;
                        auditReportObj.BMC_AR_QACE__c=auditReportObj.BMC_AR_QACE__c+rqaObj.BMC_RQA_QACE__c;
                        auditReportObj.BMC_AR_QACE_Draught__c=auditReportObj.BMC_AR_QACE_Draught__c+rqaObj.BMC_RQA_QACE_Draught__c;
                        auditReportObj.BMC_AR_QACE_Package__c=auditReportObj.BMC_AR_QACE_Package__c+rqaObj.BMC_RQA_QACE_Pacakge__c;
                        auditReportObj.BMC_AR_QAGE__c=auditReportObj.BMC_AR_QAGE__c+rqaObj.BMC_RQA_QAGE__c;
                        auditReportObj.BMC_AR_QAGE_Draught__c=auditReportObj.BMC_AR_QAGE_Draught__c+rqaObj.BMC_RQA_QAGE_Draught__c;
                        auditReportObj.BMC_AR_QAGE_Package__c=auditReportObj.BMC_AR_QAGE_Package__c+rqaObj.BMC_RQA_QAGE_Package__c;                                          
                        auditReportObj.BMC_AR_QOOC__c=auditReportObj.BMC_AR_QOOC__c+rqaObj.BMC_RQA_QOOC__c;
                        auditReportObj.BMC_AR_QOOR__c=auditReportObj.BMC_AR_QOOR__c+rqaObj.BMC_RQA_QOOR__c;
                        auditReportObj.BMC_AR_QDMG__c=auditReportObj.BMC_AR_QDMG__c+rqaObj.BMC_RQA_QDMG__c;
                        auditReportObj.BMC_AR_AQOOC__c=auditReportObj.BMC_AR_AQOOC__c+rqaObj.BMC_RQA_AQOOC__c;
                        auditReportObj.BMC_AR_AOOC__c=auditReportObj.BMC_AR_AOOC__c+rqaObj.BMC_RQA_AOOC__c;
                        auditReportObj.BMC_Total_Accounts_Inspected__c=auditReportObj.BMC_Total_Accounts_Inspected__c+1;          
                    } 
                    
                }
            }
            
            for(SurveyTaker__c srtObj:[SELECT BMC_SR_Score__c, Account__c, BMC_Last_Modified_Date_Date__c from SurveyTaker__c where Account__c IN: distributorIds and Survey_Name__c='DQA-Process Audit' and Available_Survey__r.Survey_Assignment__r.Status__c = 'Active' order by LastModifiedDate asc LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())])
            {
                System.debug(srtObj.Account__c);
                for(BMC_Audit_Report__c auditReportObj:auditreportList){
                        if(srtObj.BMC_Last_Modified_Date_Date__c >= auditReportObj.BMC_Start_Date__c && srtObj.BMC_Last_Modified_Date_Date__c <= auditReportObj.BMC_End_Date__c && srtObj.Account__c  == auditReportObj.BMC_Distributor__c){ 
                        auditReportObj.BMC_AR_SR_Score__c=srtObj.BMC_SR_Score__c;
                        auditReportObj.BMC_Survey_Taken_Latest_Id__c=srtObj.Id;
                     } 
                    
                }
            }         
            
        }
        catch(Exception e){
            System.debug('JSON Exception: ' + e.getMessage());
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
}