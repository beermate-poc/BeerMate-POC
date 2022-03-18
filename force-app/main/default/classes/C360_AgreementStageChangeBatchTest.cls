@isTest
public class C360_AgreementStageChangeBatchTest {
  	private Static Final String CANADA_ACC = 'Test Account';
    private Static Final String FUTURE = 'Future';
    private Static Final String SIGNATURECOMPLETED = 'Signature Completed';
    private Static Final String LOSTCOMPETITION = 'Lost Competition';
    private Static Final String OPEN = 'Open';
    private Static Final String CRON_EXP = '0 0 * * * ?';	 
    @testSetup static void initialDataSetup() 
    {	
        Account canadaAcc = C360_Util_TestDataCreation.createAccount(CANADA_ACC);
        insert canadaAcc; 
        MCBC_Agreement__c aggObj=C360_Util_TestDataCreation.createAgreement(canadaAcc.Id, System.today()-5, System.today()+5,false,SIGNATURECOMPLETED);
    MCBC_Agreement__c aggObj1=C360_Util_TestDataCreation.createAgreement(canadaAcc.Id, System.today()-5, System.today()-3,false,LOSTCOMPETITION);
        MCBC_Agreement__c aggObj2=C360_Util_TestDataCreation.createAgreement(canadaAcc.Id, System.today()+5, System.today()+6,false,OPEN);
    }   
    static testMethod void testMethod1()
    {
        Account canadaAcc=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:CANADA_ACC LIMIT 1];
        MCBC_Agreement__c aggObj=[SELECT id, Start_Date__c,Stage__c,Status__c,End_Date__c,Rolling__c,Customer_Name__c  FROM MCBC_Agreement__c where Customer_Name__c =: canadaAcc.Id and End_Date__c >: Date.today()  LIMIT 1];       
        
        Test.startTest();
        Constants.coverExceptionScenario = true;
        String jobId = System.schedule('AgreementStageUpdateBatchTst1',CRON_EXP, new AgreementStageUpdate());
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];
        System.assertEquals(CRON_EXP, ct.CronExpression);
        System.assertEquals(0, ct.TimesTriggered);                	
        Test.stopTest();        
    }
    static testMethod void testMethod2()
    {
        Account canadaAcc=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:CANADA_ACC LIMIT 1];
        MCBC_Agreement__c aggObj=[SELECT id, Start_Date__c,Stage__c,End_Date__c,Rolling__c,Customer_Name__c  FROM MCBC_Agreement__c where Customer_Name__c =: canadaAcc.Id and End_Date__c <: Date.today() LIMIT 1];
        
        Test.startTest();
        Constants.coverExceptionScenario = true;
        String jobId = System.schedule('AgreementStageUpdateBatchTst2',CRON_EXP, new AgreementStageUpdate());
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];
        System.assertEquals(CRON_EXP, ct.CronExpression);
        System.assertEquals(0, ct.TimesTriggered);                	
        Test.stopTest();       
    } 
}