/*
@Author RDC Team
@name ADBP_ArchiveBrandFilesTest
@CreateDate  1/13/2021
@Description Includes methods for testing ADBP_ArchiveBrandFilesTest & ADBP_ArchiveBrandFilesScheduler.
@Version <1.0>
*/
@isTest
public class ADBP_ArchiveBrandFilesTest {
    private static final string archive = 'Archived File';
    private static final string brand = 'Brand Files';
    private Static Final String CRON_EXP = '0 0 * * * ?';	
    private static Final String blobValue = 'Unit Test Attachment Body';
    

    @isTest
    public static void getDocumentsListTest(){
        List<ContentVersion> contentVersions = new List<ContentVersion>();
		 User user = [SELECT Id FROM User WHERE Email ='mamatha.dhanoji@accenture.com'];
         System.runAs(user) {
       
           for(Integer i = 1; i <= 12; i++) {
            String fileExtension = '';
            Switch on i {
                when 1 {
                    fileExtension='csv';
                }
                when 2 {
                    fileExtension='jpg';
                }
                when 3 {
                    fileExtension='gif';
                }
                when 4 {
                    fileExtension='tiff';
                }
                when 5 {
                    fileExtension='ppt';
                }
                when 6 {
                    fileExtension='xls';
                }
                when 7 {
                    fileExtension='xlsx';
                }
                when 8 {
                    fileExtension='doc';
                }
                when 9 {
                    fileExtension='docx';
                }
                when 10 {
                    fileExtension='pdf';
                }
                when 11 {
                    fileExtension='pptx';
                }
                when else {
                    fileExtension='json';
                }
            }
    
            ContentVersion cv = new ContentVersion();
            cv.title = 'test content'+i;        
            cv.VersionData = Blob.valueOf('Unit Test Attachment Body'+i);
            cv.PathOnClient = 'test content'+i+'.'+fileExtension;
            cv.PDE_End_Date__c = date.parse('12/27/2009');
            contentVersions.add(cv);
        }
        insert contentVersions;

        List<ContentVersion> testContent = [SELECT Id, ContentDocumentId FROM ContentVersion];
        List<ContentWorkspace> workspaceIDList = new List<ContentWorkspace>([Select Id from ContentWorkspace where Name =:brand]);
        List<ContentDocumentLink> cdlList = new List<ContentDocumentLink>();
        for (ContentVersion c : testContent){
            ContentDocumentLink cd = new ContentDocumentLink();
            cd.ContentDocumentId = c.ContentDocumentId;
            cd.LinkedEntityId = workspaceIDList[0].Id;
            cdlList.add(cd);
        }
        insert cdlList;
            Test.startTest();
                Constants.coverExceptionScenario = true;
                String jobId = System.schedule('ScheduleApexClassTest',CRON_EXP, new ADBP_ArchiveBrandFilesScheduler());
                CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];
                System.assertEquals(CRON_EXP, ct.CronExpression);
                System.assertEquals(0, ct.TimesTriggered);   
            Test.stopTest();
         }   
    }
     
}