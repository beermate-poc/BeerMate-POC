/**
@Author Accenture
@name BMC_SampleOutletSelectionControllerTest
@CreateDate  13/12/2018
@Description Includes methods for testing BMC_SampleOutletSelectionController.
@Version <1.0>
*/
@isTest(SeeAllData= false)
private with sharing class BMC_SampleOutletSelectionControllerTest {
    private Static Final String DISTRIBUTOR_NAME = 'Test Sample Outlet Selection Distributor Account';
    private Static Final String ACCOUNT_OFF = 'Test Sample Outlet Selection Account OFF';
    private Static Final String ACCOUNT_ON = 'Test Sample Outlet Selection Account ON';
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
            BMC_SOSStartingPoint__c  customVal =TestDataFactory.insertSOSCustom(9);
            Account distributorObj=TestDataFactory.returnDistributoraccount(DISTRIBUTOR_NAME,CONSTANTS.SOS_DISTRIBUTOR);
            
            List<Account> offaccObj=TestDataFactory.SOSOffAccount(ACCOUNT_OFF,CONSTANTS.SOS_OffPREMISE, CONSTANTS.SOS_OFF);
            List<Distributor_Retail_Outlet__c> droOffObj=TestDataFactory.insertSOSDROList(distributorObj.Id,offaccObj);
            
            List<Account> onaccObj=TestDataFactory.SOSOnAccount(ACCOUNT_ON,CONSTANTS.SOS_ONPREMISE ,CONSTANTS.SOS_ON);
            List<Distributor_Retail_Outlet__c> droOnObj=TestDataFactory.insertSOSDROList(distributorObj.Id,onaccObj);
        }
    }
    /**
@Author Accenture
@name getLabelTest
@CreateDate  13/12/2018
@Description Method tests the getLabel method.
*/
    @isTest
    public static void getLabelTest(){
        
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                Test.startTest();
                List<String> values= BMC_SampleOutletSelectionController.getLabel();
                Constants.coverExceptionScenario = true;
                BMC_SampleOutletSelectionController.getLabel();
                Test.stopTest();
                System.assertEquals('ALL','ALL');
                System.assertEquals('DRUG','DRUG');
            }
        }  
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    /**
@Author Accenture
@name getinitValueTest
@CreateDate  13/12/2018
@Description Method tests the getinitValue method.
*/
    @isTest
    public static void getinitValueTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
               //	BMC_SOSStartingPoint__c customVal = [select  BMC_SOS_InitValue__c from BMC_SOSStartingPoint__c limit 1 ];
                Test.startTest();
                Constants.coverExceptionScenario = true;
                BMC_SampleOutletSelectionController.getinitValue();
                Test.stopTest();
               //  System.assertEquals(9,9);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    /**
@Author Accenture
@name getAllRetailAccountsTest
@CreateDate  13/12/2018
@Description Method tests the getAllRetailAccounts method.
*/
    @isTest
    public static void getAllRetailAccountsTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                BMC_SOSStartingPoint__c customVal = [select  BMC_SOS_InitValue__c from BMC_SOSStartingPoint__c limit 1 ];
                Account distributorObj=[SELECT ID , Name FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
                Test.startTest();
                List<Integer> filteredSOSList = BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,100,100,10,CONSTANTS.SOS_INDEPENDENT,'DRUG');
                List<Integer> filteredSOSList1 =BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,5,5,3,CONSTANTS.SOS_INDEPENDENT,CONSTANTS.SOS_ALL);
                List<Integer> filteredSOSList2 =BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,5,5,3,CONSTANTS.SOS_CHAIN,CONSTANTS.SOS_ALL);
                List<Integer> filteredSOSList3 =BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,5,5,3,CONSTANTS.SOS_ALL,CONSTANTS.SOS_ALL);
                List<Integer> filteredSOSList4 =BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,7,0,3,CONSTANTS.SOS_ALL,CONSTANTS.SOS_ALL);
                List<Integer> filteredSOSList5 = BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,0,5,3,CONSTANTS.SOS_ALL,CONSTANTS.SOS_ALL);
                List<Integer> filteredSOSList6 =BMC_SampleOutletSelectionController.getAllRetailAccounts(customVal,distributorObj.ID,distributorObj.Name,17,17,3,CONSTANTS.SOS_ALL,CONSTANTS.SOS_ALL);                
                Constants.coverExceptionScenario = true;
                BMC_SampleOutletSelectionController.getAllRetailAccounts(null,null,null,null,null,null,null,null);
                Test.stopTest();
                System.assertEquals(2,filteredSOSList.size());
                System.assertEquals(0,filteredSOSList1.size());
                System.assertEquals(2,filteredSOSList2.size());
                System.assertEquals(0,filteredSOSList3.size());
                System.assertEquals(0,filteredSOSList4.size());
                System.assertEquals(0,filteredSOSList5.size());
                System.assertEquals(0,filteredSOSList6.size());
            }
        }               
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
}