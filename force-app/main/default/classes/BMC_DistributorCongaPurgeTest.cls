/**
@Author Accenture
@name BMC_DistributorCongaPurgeTest
@CreateDate  12/26/2019
@Description Includes methods for testing BMC_DistributorCongaPurge & BMC_DistributorCongaPurgeScheduler.
@Version <1.0>
*/
@istest
public class BMC_DistributorCongaPurgeTest {
    private Static Final String DIST_ACCOUNT_NAME = 'Test distributor Account';
    private static Final String accountRecordType = 'Distributor';
    private Static Final String CRON_EXP = '0 0 * * * ?';	
    private static Final String blobValue = 'Unit Test Attachment Body';
    private static Final String pathOnClientTest = 'Chain_Execution_Detail_Report_Test.xlsx';

    
    /**
*  @description: Method for initialDataSetup. 
*  @name: initialDataSetup
*  @param: null
*  @return: null
*/ 
    @testSetup static void initialDataSetup() 
    {	
        Account onaccObj=TestDataFactory.returnDistributoraccount(DIST_ACCOUNT_NAME, Constants.DISTRIBUTOR);
    }
    
    static testMethod void testMethod1()
    {
        Account distaccObject=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:DIST_ACCOUNT_NAME AND RecordType.Name=:accountRecordType LIMIT 1];
       
        Blob beforeblob = Blob.valueOf(blobValue);
        ContentVersion cv = new ContentVersion();
        cv.title = Label.BMC_ReportName; 
        cv.PathOnClient = pathOnClientTest;
        cv.VersionData = beforeblob;
        insert cv;
        
        ContentVersion testContent = [SELECT id, ContentDocumentId FROM ContentVersion where Id = :cv.Id];
		ContentDocumentLink contentlink=new ContentDocumentLink();
        contentlink.LinkedEntityId=distaccObject.id;
        contentlink.ShareType= 'V';
        contentlink.ContentDocumentId=testContent.ContentDocumentId;
        insert contentlink;
       
        
        Test.startTest();
        Constants.coverExceptionScenario = true;
        String jobId = System.schedule('ScheduleApexClassTest',CRON_EXP, new BMC_DistributorCongaPurgeScheduler());
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];
        System.assertEquals(CRON_EXP, ct.CronExpression);
        System.assertEquals(0, ct.TimesTriggered);                	
        Test.stopTest();
       
    }
    


}