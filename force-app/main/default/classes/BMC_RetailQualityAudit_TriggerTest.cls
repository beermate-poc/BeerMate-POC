/**
@Author Accenture
@name BMC_RetailQualityAudit_TriggerTest
@CreateDate  9/13/2018
@Description Test class for BMC_RetailQualityAudit_Trigger_Handler.
@Version <1.0>
*/
@isTest
private with sharing class BMC_RetailQualityAudit_TriggerTest {
  
    public Static Final String DISTRIBUTOR_NAME = 'Test Retail Quality Audit Distributor Account';
    public Static Final String RETAIL_NAME = 'Test Retail Quality Audit Account';
    public Static Final String DRO_NAME = 'Test Rep';
    /**
    *  @description: Method for initialDataSetup. 
    *  @name: initialDataSetup
    *  @param: null
    *  @return: null
    */ 
    @testSetup static void initialDataSetup()
    {
        Account distributorObj=TestDataFactory.returnDistributoraccount(DISTRIBUTOR_NAME,Constants.DISTRIBUTOR);
        List<Product__c> prodList=TestDataFactory.createauditProduct();    
        Account onaccObj=TestDataFactory.returnSingleOnAccount(RETAIL_NAME,Constants.SOS_ONPREMISE,Constants.SOS_ON);
        Distributor_Retail_Outlet__c droObj=TestDataFactory.insertDRO(distributorObj.Id,onaccObj.Id, DRO_NAME);
        List<STR_Brand_Package__c> strpackageList=TestDataFactory.insertSTRPackage(onaccObj.Id,distributorObj.Id,prodList );   
    }
    
    
    /**
    *  @description: Test method for createBrandpacks. 
    *  @name: createBrandpacksTest
    *  @param: null
    *  @return: null
    */    
    @isTest
    public static void createBrandpacksTest(){
        Account accObj=[SELECT ID FROM ACCOUNT WHERE NAME =:RETAIL_NAME LIMIT 1];
        Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
        BMC_Retail_Quality_Audit__c retailObj= new BMC_Retail_Quality_Audit__c();
        retailObj.BMC_Audit_Date__c=system.Today();
        retailObj.BMC_Outlet__c=accObj.Id;
        retailObj.BMC_Distributor__c=distributorObj.Id;
        insert retailObj;
        try{
            Constants.coverExceptionScenario = true;
            BMC_RetailQualityAudit_Trigger_Handler.createBrandpacks(null);
        }
        catch(Exception e){
            System.assertEquals(e.getMessage(), Constants.EXCEPTION_MSSG );
            Constants.coverExceptionScenario = false;
        }
    }
}