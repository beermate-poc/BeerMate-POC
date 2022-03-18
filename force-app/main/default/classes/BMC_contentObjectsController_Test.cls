@isTest
public class BMC_contentObjectsController_Test {
    private Static Final String CHAINPARENT_NAME = 'Test Account';
    private static Final String CHAINACTIVITY_NAME = 'Test chain Activity';
    private static Final String FILECONTENT_NAME = 'Filecontent';
    private static Final String CV_TITLE = 'Test CA Document';
    private static Final String CV_PATH = 'TestCADocument.pdf';
    private static Final String CV_BLOBDATA = 'Test CA';
     private static Final Boolean CV_ISVERSION = true;
    
    @testSetup
    private static void setup(){
        Account chainParentObj = TestDataFactory.returnSingleAccount(CHAINPARENT_NAME,constants.CHAIN_PARENT);
        List<BMC_Chain_Activity__c> chainActivityRec = TestDataFactory.insertChainActivity(CHAINACTIVITY_NAME, chainParentObj.Id ,System.today()+5 , System.today()+11 ,'Chain Activity','Activity');
        
    }
    @isTest
    private static void generateLinksTest(){
        //RecordType ContentRT = [select Id FROM RecordType WHERE Name=: FILECONTENT_NAME];
        BMC_Chain_Activity__c activityObj = [SELECT Id, Name FROM BMC_Chain_Activity__c where BMC_Chain_Activity_Name__c=: 'Test chain Activity 1' LIMIT 1]; 
        
        List<ContentVersion> contentList= new List<ContentVersion>();
        for(integer i=0;i<10;i++){
            ContentVersion cv = new ContentVersion();
            cv.Title = CV_TITLE;
            cv.PathOnClient = CV_PATH;
            cv.VersionData = Blob.valueOf(CV_BLOBDATA);
            cv.IsMajorVersion = CV_ISVERSION;
            cv.FirstPublishLocationId=activityObj.Id;
            contentList.add(cv); 
        }
            Test.startTest();
 
        database.insert(contentList);
            Test.stopTest();
 
        BMC_Chain_Activity__c oBMC = [SELECT Id, BMC_Attachment_Links__c FROM BMC_Chain_Activity__c where BMC_Chain_Activity_Name__c= 'Test chain Activity 1' LIMIT 1];
        system.assert(oBMC.BMC_Attachment_Links__c != null);
        
        set<Id> contentdocIDs= new set<ID>();
        for(ContentVersion cvObj:[SELECT Id, ContentDocumentId FROM ContentVersion where Id IN:contentList]){
            contentdocIDs.add(cvObj.ContentDocumentId);            
        }
        List<ContentDocument> cdoclist = [SELECT Id FROM ContentDocument where ID IN:contentdocIDs ];
        delete cdoclist;
       
        BMC_Chain_Activity__c  oBMC1 = [SELECT Id, BMC_Attachment_Links__c FROM BMC_Chain_Activity__c where BMC_Chain_Activity_Name__c= 'Test chain Activity 1' LIMIT 1];
        system.assertEquals(null,oBMC1.BMC_Attachment_Links__c);
        
    }
  
}