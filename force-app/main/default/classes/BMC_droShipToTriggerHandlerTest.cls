/**
@Author Accenture
@name BMC_droShipToTriggerHandlerTest
@CreateDate  1/4/2019
@Description Includes methods for testing BMC_droShipToTriggerHandler.
@Version <1.0>
*/
@isTest(SeeAllData= false)
private with sharing class BMC_droShipToTriggerHandlerTest {
    
    private Static Final String ONACCOUNT_NAME = 'Test dro Insert ShipTo Account';
    private Static Final String DIST_LIST_NAME = 'Test dro List ShipTo Account';
    private Static Final String ONACCOUNT_DRO_NAME = 'Test dro ShipTo Account';
    private Static Final String SALES_REP = 'salesRep';
    private Static Final String SALES_USER ='Sales User';
    private Static Final String USER_NAME ='TestUser';
    private Static Final String ROLE ='Leadership';
    private Static Final String NAME ='User';
    
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
            Account onaccObj=TestDataFactory.returnSingleOnAccount(ONACCOUNT_NAME, Constants.SOS_ONPREMISE, Constants.SOS_ON);
            Account onaccObjDro=TestDataFactory.returnSingleAccountWithDro(ONACCOUNT_DRO_NAME, Constants.SOS_ONPREMISE, Constants.SOS_ON);
            List<Account> distList= TestDataFactory.returnDistributoraccountList(DIST_LIST_NAME, Constants.DISTRIBUTOR);
                
        }
    }
    
    /**
@Author Accenture
@name insertShipToOnAccountTest
@CreateDate  1/4/2019
@Description Method tests the insertShipToOnAccount method.
*/
    @isTest
    public static void insertShipToOnAccountTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                Account onaccObj=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME LIMIT 1];
                List<Account> distList=[SELECT ID FROM ACCOUNT WHERE NAME =:DIST_LIST_NAME LIMIT 1];
                Distributor_Retail_Outlet__c distRetailOutlet= TestDataFactory.initialiseDRO(onaccObj.Id, distList[0].Id, SALES_REP);
                Test.startTest();
                insert distRetailOutlet;
                BMC_droShipToTriggerHandler.insertShipToOnAccount(null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name insertShipToOnAccountTest_else
@CreateDate  1/4/2019
@Description Method tests the insertShipToOnAccount method.
*/
    @isTest
    public static void insertShipToOnAccountTest_else(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                Account onaccObjDro=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_DRO_NAME LIMIT 1];
                List<Account> distList=[SELECT ID FROM ACCOUNT WHERE NAME =:DIST_LIST_NAME LIMIT 10];
                Distributor_Retail_Outlet__c insertdistRetailOutlet= TestDataFactory.insertDRO(onaccObjDro.Id, distList[0].Id, SALES_REP);
                Distributor_Retail_Outlet__c distRetailOutlet= TestDataFactory.initialiseDRO(onaccObjDro.Id, distList[1].Id, SALES_REP);
                Test.startTest();
                insert distRetailOutlet;
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name updateShipToOnAccountTest
@CreateDate  1/4/2019
@Description Method tests the updateShipToOnAccount method.
*/
    @isTest
    public static void updateShipToOnAccountTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                Account onaccObjDro=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_DRO_NAME LIMIT 1];
                Account onaccObj=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME LIMIT 1];
                List<Account> distList=[SELECT ID FROM ACCOUNT WHERE NAME =:DIST_LIST_NAME LIMIT 10];
                
                Distributor_Retail_Outlet__c distRetailOutlet= TestDataFactory.initialiseDRO(onaccObjDro.Id, distList[0].Id, SALES_REP);
                
                Distributor_Retail_Outlet__c updatedistRetOutlet= TestDataFactory.updateDRO(distRetailOutlet);
                
                Test.startTest();
                update updatedistRetOutlet;
                BMC_droShipToTriggerHandler.updateShipToOnAccount(null, null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
}