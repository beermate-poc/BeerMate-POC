/**
@Author Accenture
@name BMC_AuditReportCalculationHandlerTest
@CreateDate  11/10/2018
@Description Includes methods for testing BMC_SampleOutletSelectionController.
@Version <1.0>
*/
@isTest
private with sharing class BMC_AuditReportCalculationHandlerTest {
    
    private Static Final String DISTRIBUTOR_NAME = 'Test Retail Quality Audit Distributor Account';
    private Static Final String AUDITACCOUNT_NAME = 'Test Retail Quality Audit Account';
    private Static Final String DQA_PROCESSAUDIT = 'DQA-Process Audit';
    private Static Final String SALES_USER ='Sales User';
    private Static Final String USER_NAME ='TestUser';
    private Static Final String ROLE ='Leadership';
    private Static Final String NAME ='User';
    private Static Final String CONTINUOUS = 'Continuous' ;
    private Static Final String ACCOUNT_CRITERIA =  'Account Criteria' ; 
    private Static Final String USER_CRITERIA = 'User Criteria';
    private Static Final String ACTIVE = 'Active';
    private Static Final String INSERT_TARGETCRITERIA1 = 'Name,equals,brian;FirstInvoiceDt__c,equals,03/12/2018;My_Accounts__c,equals,true;Number_of_Brands_13_Wk__c,equals,5;' ;
     private Static Final String INSERT_TARGETCRITERIA2 = 'Name,contains,Test;';
    /**
*  @description: Method for initialDataSetup. 
*  @name: initialDataSetup
*  @param: null
*  @return: null
*/ 
    @testSetup static void initialDataSetup()
    {
        User currUser = TestDataFactory.returnUser(SALES_USER, USER_NAME, ROLE);
        insert currUser;
        System.runAs(currUser){
            Account onaccObj=TestDataFactory.returnSingleOnAccount(AUDITACCOUNT_NAME,CONSTANTS.SOS_ONPREMISE,CONSTANTS.SOS_ON);
            Account distributorObj=TestDataFactory.returnDistributoraccount(DISTRIBUTOR_NAME,CONSTANTS.DISTRIBUTOR);
            BMC_Retail_Quality_Audit__c rqa=TestDataFactory.createRetailaudit(onaccObj.Id,distributorObj.Id); 
            Survey__c surv=TestDataFactory.insertSurvey(DQA_PROCESSAUDIT);
            Target_Criteria__c tc = TestDataFactory.insertTargetCriteria(INSERT_TARGETCRITERIA1, USER_CRITERIA);
            Target_Criteria__c ta = TestDataFactory.insertTargetCriteria(INSERT_TARGETCRITERIA2, ACCOUNT_CRITERIA);
            
            Survey_Assignment__c sa=TestDataFactory.insertSurveyAssignment(ACTIVE,System.TODAY(),CONTINUOUS,surv.Id,tc.Id,ta.Id);
            
            Available_Survey__c survAvail=new Available_Survey__c();
            survAvail.Account__c=distributorObj.Id;
            survAvail.Name =surv.Id;
            survAvail.Survey_Assignment__c=sa.Id;
            insert survAvail;
            
            SurveyTaker__c surveytaken= new SurveyTaker__c();
            surveytaken.Account__c=distributorObj.Id;
            surveytaken.Survey__c =surv.Id;
            surveytaken.Available_Survey__c=survAvail.Id;
            insert surveytaken;
            
        }
    }
    /**
@Author Accenture
@name dqaSummarycalculationTest
@CreateDate  11/12/2018
@Description Method tests the dqaSummarycalculation method.
*/
    @isTest
    public static void dqaSummarycalculationTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                Account distributorObj=[SELECT ID , Name FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME and RECORDTYPE.NAME =: CONSTANTS.DISTRIBUTOR LIMIT 1];
                BMC_Audit_Report__c auditReportObj= new BMC_Audit_Report__c();
                auditReportObj.BMC_Start_Date__c=System.today();
                auditReportObj.BMC_End_Date__c=System.today();
                auditReportObj.BMC_Distributor__c=distributorObj.Id;
                Test.startTest();
                insert auditReportObj;
                BMC_AuditReportCalculationHandler.dqaSummarycalculation(null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            System.assertEquals(e.getMessage(), Constants.EXCEPTION_MSSG );
            Constants.coverExceptionScenario = false;
        }
    }
    
}