@isTest(SeeAllData= false)
private with sharing class AccountsRelatedObjectivesController_Test {
    private Static Final String ONACCOUNT_NAME = 'Test Retail Quality Audit Account';
    private Static Final String SALES_USER ='Sales User';
    private Static Final String USER_NAME ='TestUser';
    private Static Final String ROLE ='Leadership';
    private Static Final String NAME ='User';
    
    @testSetup static void initialDataSetup()
    {
        User currUser = TestDataFactory.returnUser(SALES_USER, USER_NAME, ROLE);
        insert currUser;
        
        System.runAs(currUser){
            Account onaccObj = TestDataFactory.returnSingleOnAccount(ONACCOUNT_NAME, Constants.SOS_ONPREMISE, Constants.SOS_ON);
            List<Product__c> prodList = TestDataFactory.createauditProduct();
            
        }
    }
    
    @isTest static void getNotStartedObjectiveSizeTest(){
        List<Account> onaccObj=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME];
        
        List<Objective__c> objList= new List<Objective__c>();
        for(Integer i=0;i < 10;i++){
            Objective__c obj= new Objective__c();
            obj.Name = 'Obj'+ i ;
            obj.Account__c = onaccObj[0].Id;
            obj.Status__c = 'Not Started';
            objList.add(obj);
        }
        insert objList;
        
        
        Test.startTest();
        Apexpages.StandardController sc = new ApexPages.StandardController(onaccObj[0]);
        AccountsRelatedObjectivesController myClass = new AccountsRelatedObjectivesController(sc); 
        Integer sample1 = myClass.getNotStartedObjectiveSize();
        Test.stopTest();
        
        
        System.assertEquals(10, sample1);
    }
    
    @isTest static void getInProgressObjectiveSizeTest(){
        List<Account> onaccObj=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME];
        
        List<Objective__c> objList= new List<Objective__c>();
        for(Integer i=0;i < 10;i++){
            Objective__c obj= new Objective__c();
            obj.Name = 'Obj'+ i ;
            obj.Account__c = onaccObj[0].Id;
            obj.Status__c = 'In Progress';
            objList.add(obj);
        }
        insert objList;
        
        
        Test.startTest();
        Apexpages.StandardController sc = new ApexPages.StandardController(onaccObj[0]);
        AccountsRelatedObjectivesController myClass = new AccountsRelatedObjectivesController(sc); 
        Integer sample1 = myClass.getInProgressObjectiveSize();
        Test.stopTest();
        
        
        System.assertEquals(10, sample1);
    }
    
}