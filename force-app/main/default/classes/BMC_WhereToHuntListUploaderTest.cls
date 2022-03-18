/**
@Author Accenture
@name: WhereToHuntDashboardController
@CreateDate 06/11/2018
@Description This class covers unit test cases for BMC_WhereToHuntListUploader class .
@Version <1.0>
*/
@isTest
private with sharing class BMC_WhereToHuntListUploaderTest {
    public static List<Account> testAccounts = TestDataFactory.createAccountwth('testAccount', 'On-Premise', 10000,10);
    public static Where_to_Hunt__c wthObj=TestDataFactory.insertWhereToHunt('WTH List'); 
    public static Blob csvFileBody= TestDataFactory.createCSV();
    public static Blob csvFileBodytwocolumn= TestDataFactory.createCSVtwocolumn();
    public static Blob createCSVinvalidids= TestDataFactory.createCSVinvalidids();
    public static Blob createinvalidCSVfile= TestDataFactory.createinvalidCSVfile();
    private static String wthName='WTH LIST 2';
    @testSetup static void initialDataSetup(){
        Account testParentAcct = TestDataFactory.returnSingleAccount('Chain Level 1 Parent','Chain Parent','10001');
        Account testGchildAcct = TestDataFactory.returnChildAccountActive('Gchild1','Chain On-Premise',testParentAcct.Id,'10009', 'Active');
        insert testGchildAcct;
        Account testGchildAcct1 = TestDataFactory.returnChildAccountActive('Gchild1','Chain On-Premise',testParentAcct.Id,'10004', 'Active');
        insert testGchildAcct1;
        Account testGchildAcct2 = TestDataFactory.returnChildAccountActive('Gchild2','Chain Off-Premise',testParentAcct.Id,'10005', 'Active');
        insert testGchildAcct2;
        Account testGchildAcct3 = TestDataFactory.returnChildAccountActive('Gchild3','Chain On-Premise',testParentAcct.Id,'10006', 'Active');
        insert testGchildAcct3;
        Account testGchildAcct4 = TestDataFactory.returnChildAccountActive('Gchild4','Chain Off-Premise',testParentAcct.Id,'10007', 'InActive');
        insert testGchildAcct4;
        BMC_Chain_Activity__c ChainActivity = TestDataFactory.createChainActivity(testParentAcct.Id, Date.newInstance(2050,12,19),Date.newInstance(2019,1,19));
        
    }
    
    /**
*  @description: Method to test for File Exception
*  @name: readfileexceptionTest
*  @param: none
*  @return: none
*/
    public static testMethod void readfileexceptionTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthName;
        wthController.nameFile = 'Testfile.csv';
        wthController.readFile();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    /**
*  @description: Method to test for duplicate list name
*  @name: duplicatelistnameTest
*  @param: none
*  @return: none
*/
    public static testMethod void duplicatelistnameTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthObj.Name;
        wthController.nameFile = 'Testfile.csv';
        wthController.contentFile=csvFileBody;
        wthController.readFile();
        wthController.closefileDatapopup();
        wthController.closelistpopup();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    
    /**
*  @description: Method to test list creation
*  @name: readfileTest
*  @param: none
*  @return: none
*/
    public static testMethod void readfileTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthName;
        wthController.nameFile = 'Testfile.csv';
        wthController.contentFile=csvFileBody;
        wthController.readFile();
        wthController.closeFileError();
        wthController.closeError();
        wthController.closePopup();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    
    
    public static testMethod void readfileFailTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthName;
        wthController.nameFile = 'Testfile.xlsx';
        wthController.contentFile=csvFileBody;
        wthController.readFile();
        wthController.closevalidCSVpopup();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    
    /**
*  @description: Method to test outlet and target accounts creation
*  @name: readCAFileTest
*  @param: none
*  @return: none
*/
    public static testMethod void readCAFileTest() {      
        Test.startTest();   
        BMC_Chain_Activity__c testChainAccount =[select Id , Name ,BMC_Chain_Parent_Account__c from BMC_Chain_Activity__c];
       // System.debug('testChainAccount id'+testChainAccount);
        Where_to_Hunt__c testwth = [select Id , Name from Where_to_Hunt__c where Name =: testChainAccount.Name 
                                    and BMC_Chain_Activity_ID__c =: testChainAccount.Id limit 1 ];
        PageReference where2HuntChainPage;
        where2HuntChainPage = Page.WhereToHuntDashboard;
        Test.setCurrentPage(where2HuntChainPage);
        ApexPages.currentPage().getParameters().put('id',testChainAccount.Id);
        ApexPages.currentPage().getParameters().put('chainName',testChainAccount.Name);
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.nameFile = 'Testfile.csv';
        wthController.contentFile=csvFileBody;
        wthController.readCAFile();
        wthController.closeFileError();
        wthController.closeFileEmptyError();
        wthController.closeError();
        wthController.returnChain();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    /**
*  @description: Method to test file with 2 columns 
*  @name: filewithtwocolumnsTest
*  @param: none
*  @return: none
*/
    public static testMethod void filewithtwocolumnsTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthName;
        wthController.contentFile=csvFileBodytwocolumn;
        wthController.nameFile = 'Testfile.csv';
        wthController.readFile();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    /**
*  @description:  Method to test file with invalid outlet ids
*  @name: filewithinvalididsTest
*  @param: none
*  @return: none
*/
    public static testMethod void filewithinvalididsTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthName;
        wthController.contentFile=createCSVinvalidids;
        wthController.nameFile = 'Testfile.csv';
        wthController.readFile();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    /**
*  @description: Method to test invalid file
*  @name: filewithinvalidnameTest
*  @param: none
*  @return: none
*/
    public static testMethod void filewithinvalidnameTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.contentFile=createCSVinvalidids;
        wthController.readFile();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
        
    }
    /**
*  @description:  Method to test invalid file
*  @name: createinvalidCSVfileTest
*  @param: none
*  @return: none
*/
    public static testMethod void createinvalidCSVfileTest() {       
        Test.startTest();        
        BMC_WhereToHuntListUploader wthController= new BMC_WhereToHuntListUploader();
        wthController.listName=wthName;
        wthController.contentFile=createinvalidCSVfile;
        wthController.nameFile = 'Testfile.csv';
        wthController.readFile();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    } 
}