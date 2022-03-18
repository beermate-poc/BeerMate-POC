@isTest
private class BMC_SendEmailToDistributorContactTest {
    private static Final String testAccount = 'testAccount';
    private static Final String testAccount1 = 'testAccount1';
    private static Final String accountRecordType = 'Distributor';
     private static Final String accountRecordType1 = 'Ship_To';
     private static Final String accountRecordType2 = 'Hierarchy';
    private static Final String blobValue = 'Unit Test Attachment Body';
    //private static Final String titleTest = 'Chain_Execution_Detail_Report_Test';
    private static Final String pathOnClientTest = 'Chain_Execution_Detail_Report_Test.xlsx';

    
    @isTest 
    private static void executeTest(){
        
        Account testAcct = TestDataFactory.returnDistributoraccount(testAccount, accountRecordType);
        Contact testContact = TestDataFactory.returnDistributorContact(testAcct.id);
		Contact testContact2 = TestDataFactory.returnDistributorContactwithFirstName(testAcct.id);     
       
        for (AccountContactRelation accConObj : [Select Id,AccountId,ContactId from AccountContactRelation where AccountId=:testAcct.Id and ContactId=:testContact.Id] ){
            accConObj.BMC_Chain_Execution_Communications__c = true;
            update accConObj;
        }
        
        
        Blob beforeblob = Blob.valueOf(blobValue);
        ContentVersion cv = new ContentVersion();
        cv.title = Label.BMC_ReportName; 
        cv.PathOnClient = pathOnClientTest;
        cv.VersionData = beforeblob;
        insert cv;
        
        ContentVersion testContent = [SELECT id, ContentDocumentId FROM ContentVersion where Id = :cv.Id];
		ContentDocumentLink contentlink=new ContentDocumentLink();
        contentlink.LinkedEntityId=testAcct.id;
        contentlink.ShareType= 'V';
        contentlink.ContentDocumentId=testContent.ContentDocumentId;
        insert contentlink;
        Test.startTest();        
        BMC_EmailToDistributorContactScheduler sh1 = new BMC_EmailToDistributorContactScheduler();
        String sch = '0 0 2 * * ?'; 
        system.schedule('Test Email Check', sch, sh1); 
        Test.stopTest();
    }
    
     
    
       @isTest 
    private static void executeTest2(){
        
        Account testAcct1 = TestDataFactory.returnDistributoraccount(testAccount1, accountRecordType);
        Contact testContact = TestDataFactory.returnDistributorContact(testAcct1.id);
		Contact testContact2 = TestDataFactory.returnDistributorContactwithFirstName(testAcct1.id);       
        
       // system.debug('testAcct1.ParentId---------------'+testAcct1.ParentId);
       // system.debug('testAcct1.ParentId.Name---------------'+testAcct1.Parent.Name);
       // system.debug('testAcct.Account.Name---------------'+testAcct.AccountId);
        
        Account accObj = [Select Id,ParentId from Account where ParentId=:testAcct1.Id];
        AccountContactRelation accCon = new AccountContactRelation(AccountId =accObj.Id , ContactId = testContact.Id );
        
        
        for (AccountContactRelation accConObj : [Select Id,AccountId,ContactId from AccountContactRelation where AccountId=:accObj.Id and ContactId=:testContact.Id] ){
            accConObj.BMC_Chain_Execution_Communications__c = true;
            update accConObj;
        }
        
                
        Blob beforeblob = Blob.valueOf(blobValue);
        ContentVersion cv = new ContentVersion();
        cv.title = Label.BMC_ReportName; 
        cv.PathOnClient = pathOnClientTest;
        cv.VersionData = beforeblob;
        insert cv;
        
        ContentVersion testContent = [SELECT id, ContentDocumentId FROM ContentVersion where Id = :cv.Id];
		ContentDocumentLink contentlink=new ContentDocumentLink();
        contentlink.LinkedEntityId=testAcct1.id;
        contentlink.ShareType= 'V';
        contentlink.ContentDocumentId=testContent.ContentDocumentId;
        insert contentlink;
        Test.startTest();        
        BMC_EmailToDistributorContactScheduler sh1 = new BMC_EmailToDistributorContactScheduler();
        String sch = '0 0 2 * * ?';
        system.schedule('Test Email Check', sch, sh1); 
        Test.stopTest();
    }
}