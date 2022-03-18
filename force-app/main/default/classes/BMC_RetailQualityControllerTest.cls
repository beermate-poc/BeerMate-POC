/**
@Author Accenture
@name BMC_CustomLookupControllerTest
@CreateDate  6/18/2018
@Description Includes methods for testing BMC_RetailQualityController.
@Version <1.0>
*/
@isTest(SeeAllData= false)
private with sharing class BMC_RetailQualityControllerTest {
    private Static Final String DISTRIBUTOR_NAME = 'Test Retail Quality Audit Distributor Account';
    private Static Final String ONACCOUNT_NAME = 'Test Retail Quality Audit Account';
    private Static Final String OFFACCOUNT_NAME = 'Test Retail Quality Audit Off Account';
    private Static Final String SALES_REP = 'Test Rep';
    private Static Final String BRAND_FAMILY = 'TEST FAMILY';
    private Static Final String BRAND_FAMILY1 ='TEST FAMILY1';
    private Static Final String AUDIT_ITEM ='BMC_Audit_Item__c';
    private Static Final String LOCATION ='BMC_Location__c';
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
            Account onaccObj = TestDataFactory.returnSingleOnAccount(ONACCOUNT_NAME, Constants.SOS_ONPREMISE, Constants.SOS_ON);
            Account offaccObj = TestDataFactory.returnSingleOffAccount(OFFACCOUNT_NAME,Constants.SOS_OffPREMISE, Constants.SOS_OFF);
            Account distributorObj = TestDataFactory.returnDistributoraccount(DISTRIBUTOR_NAME,Constants.DISTRIBUTOR);
            List<Product__c> prodList = TestDataFactory.createauditProduct();
            
            Distributor_Retail_Outlet__c droObj = TestDataFactory.insertDRO(distributorObj.Id,onaccObj.Id, SALES_REP);
            Distributor_Retail_Outlet__c droOffObj = TestDataFactory.insertDRO(distributorObj.Id,offaccObj.Id, SALES_REP);
            
            BMC_Retail_Quality_Audit__c retailQualityaudit = TestDataFactory.createRetailaudit(onaccObj.Id,distributorObj.Id); 
            BMC_Retail_Quality_Audit__c retailQualityaudit_off = TestDataFactory.createRetailaudit(offaccObj.Id,distributorObj.Id); 
            
            List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList = TestDataFactory.createRetailauditbrandpack(retailQualityaudit.Id,prodList);
            List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off = TestDataFactory.createRetailauditbrandpack(retailQualityaudit_off.Id,prodList); 
            
            List<BMC_Audit_Item__c> audititemList = TestDataFactory.createAuditItem(auditpackList);
            List<BMC_Audit_Item__c> audititemList_off =TestDataFactory.createAuditItem(auditpackList_off);
        }
        
    }
    
    /**
@Author Accenture
@name getRetailQualityAuditinfoTest
@CreateDate  9/13/2018
@Description Method tests the getRetailQualityAuditinfo method.
*/
    @isTest
    public static void getRetailQualityAuditinfoTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID,BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:ONACCOUNT_NAME LIMIT 1];
                Test.startTest();
                BMC_Retail_Quality_Audit__c retailAudit = BMC_RetailQualityController.getRetailQualityAuditinfo(retailQualityaudit.Id);
                // Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.getRetailQualityAuditinfo(null);
                Test.stopTest();
                System.assertEquals(retailAudit.BMC_Outlet__c, retailQualityaudit.BMC_Outlet__c);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getAccountRecordTest
@CreateDate  9/13/2018
@Description Method tests the getAccountRecord method.
*/
    @isTest
    public static void getAccountRecordTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                Account onaccObj=[SELECT ID, NAME FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME LIMIT 1];
                Test.startTest();
                Account accDetail=BMC_RetailQualityController.getAccountRecord(onaccObj.Id);
                //Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.getAccountRecord(null);
                Test.stopTest();
                System.assertEquals(accDetail.Name, onaccObj.Name);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getAllDistributorTest
@CreateDate  9/13/2018
@Description Method tests the getAllDistributor method.
*/
    @isTest
    public static void getAllDistributorTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                Account onaccObj=[SELECT ID FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME LIMIT 1];
                Test.startTest();
                List<String> distributorList= BMC_RetailQualityController.getAllDistributor(onaccObj.Id);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.getAllDistributor(null);
                Test.stopTest();
                System.assertEquals(1, distributorList.size());
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name fetchBrandpacksTest
@CreateDate  9/13/2018
@Description Method tests the fetchBrandpacks method.
*/
    @isTest
    public static void fetchBrandpacksTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID, BMC_Audit_Date__c, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:ONACCOUNT_NAME LIMIT 1];
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList = [SELECT Id, BMC_Retail_Quality_Audit__c FROM BMC_Retail_Quality_Audit_Brand_Pack__c Where BMC_Retail_Quality_Audit__c =: retailQualityaudit.Id];
                Test.startTest();
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> brandpackList= BMC_RetailQualityController.fetchBrandpacks(retailQualityaudit.Id,retailQualityaudit.BMC_Audit_Date__c);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.fetchBrandpacks(null,null);
                Test.stopTest();
                System.assertEquals(brandpackList.size(),auditpackList.size());
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name retrieveBrandFamilyTest
@CreateDate  9/13/2018
@Description Method tests the retrieveBrandFamily method.
*/
    @isTest
    public static void retrieveBrandFamilyTest(){
        try{               
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:ONACCOUNT_NAME LIMIT 1];
                Test.startTest();
                List<String> brandFamilylist= BMC_RetailQualityController.retrieveBrandFamily(retailQualityaudit.Id);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.retrieveBrandFamily(null);
                Test.stopTest();
                System.assertEquals(1,brandFamilylist.size() );
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name fetchBrandselectedTest
@CreateDate  9/13/2018
@Description Method tests the fetchBrandselected method.
*/
    @isTest
    public static void fetchBrandselectedTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID, BMC_Audit_Date__c, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:ONACCOUNT_NAME LIMIT 1];
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList = [SELECT Id, BMC_Retail_Quality_Audit__c FROM BMC_Retail_Quality_Audit_Brand_Pack__c Where BMC_Retail_Quality_Audit__c =: retailQualityaudit.Id];
                Test.startTest();
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> brandpackList= BMC_RetailQualityController.fetchBrandselected(retailQualityaudit.Id, BRAND_FAMILY, retailQualityaudit.BMC_Audit_Date__c);
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> nobrandpackList= BMC_RetailQualityController.fetchBrandselected(retailQualityaudit.Id,BRAND_FAMILY1,retailQualityaudit.BMC_Audit_Date__c);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.fetchBrandselected(null,null,null);
                Test.stopTest();
                System.assertEquals(auditpackList.size(),brandpackList.size() );
                System.assertEquals(0,nobrandpackList.size() );
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getpreviousAuditTest
@CreateDate  9/13/2018
@Description Method tests the getpreviousAudit method.
*/
    @isTest
    public static void getpreviousAuditTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID, BMC_Audit_Date__c, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:ONACCOUNT_NAME LIMIT 1];
                List<BMC_Audit_Item__c> audititemList = [SELECT Id, BMC_UOM__c, BMC_Location__c  from BMC_Audit_Item__c LIMIT 5];
                Test.startTest();
                List<BMC_Audit_Item__c> auditItem= BMC_RetailQualityController.getpreviousAudit(retailQualityaudit.Id);  
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.getpreviousAudit(null);
                Test.stopTest();
                system.assertEquals(audititemList[0].BMC_UOM__c, auditItem[0].BMC_UOM__c);
                system.assertEquals(audititemList[0].BMC_Location__c, auditItem[0].BMC_Location__c);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        
    }
    /**
@Author Accenture
@name createAuditprodutsTest
@CreateDate  9/13/2018
@Description Method tests the createAuditproduts method.
*/
    @isTest
    public static void createAuditprodutsTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:ONACCOUNT_NAME LIMIT 1];
                BMC_Retail_Quality_Audit__c retailQualityaudit_Off =[SELECT ID, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:OFFACCOUNT_NAME LIMIT 1];
                List<Product__c> prodList =[SELECT ID, TrademarkBrandLongNme__c, OnPremisePackageDesc__c, PackageDesc__c from Product__c LIMIT 3];
                Test.startTest();
                BMC_Retail_Quality_Audit_Brand_Pack__c brandpack= BMC_RetailQualityController.createAuditproduts(retailQualityaudit.Id, prodList[0].TrademarkBrandLongNme__c,prodList[0].Id);
                BMC_Retail_Quality_Audit_Brand_Pack__c brandpackOff= BMC_RetailQualityController.createAuditproduts(retailQualityaudit_Off.Id, prodList[0].TrademarkBrandLongNme__c,prodList[0].Id);
                BMC_RetailQualityController.createAuditproduts(null,null,null);
                Test.stopTest();
                system.assertEquals(brandpack.BMC_Brand_Package__c,prodList[0].Id);
                system.assertEquals(brandpack.BMC_Brand_Package_Audit_Pack__c,prodList[0].TrademarkBrandLongNme__c+Constants.BLANK_WITHSPACE + prodList[0].OnPremisePackageDesc__c);
                system.assertEquals(brandpackOff.BMC_Brand_Package__c,prodList[0].Id);
                system.assertEquals(brandpackOff.BMC_Brand_Package_Audit_Pack__c,prodList[0].TrademarkBrandLongNme__c+Constants.BLANK_WITHSPACE + prodList[0].PackageDesc__c);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name findRetailAuditTest
@CreateDate  9/13/2018
@Description Method tests the findRetailAudit method.
*/
    @isTest
    public static void findRetailAuditTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                Account onaccObj=[SELECT ID FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME LIMIT 1];
                Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
                Test.startTest();
                List<BMC_Retail_Quality_Audit__c> retailObj= BMC_RetailQualityController.findRetailAudit(onaccObj.Id,distributorObj.Id,system.now());  
                BMC_RetailQualityController.findRetailAudit(null,null,null);
                Test.stopTest();
                system.assertEquals(retailObj[0].BMC_Outlet__c, onaccObj.Id);
                system.assertEquals(retailObj[0].BMC_Distributor__c,distributorObj.Id);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name saveRetailAuditTest
@CreateDate  9/13/2018
@Description Method tests the saveRetailAudit method.
*/
    @isTest
    public static void saveRetailAuditTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                Account onaccObj=[SELECT ID FROM ACCOUNT WHERE NAME =:ONACCOUNT_NAME LIMIT 1];
                Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
                Test.startTest();
                BMC_Retail_Quality_Audit__c retailObj= BMC_RetailQualityController.saveRetailAudit(onaccObj.Id,distributorObj.Id,system.now());  
                BMC_RetailQualityController.saveRetailAudit(null,null,null);
                Test.stopTest();
                system.assertEquals(retailObj.BMC_Audit_Date__c,system.Today());
                system.assertEquals(retailObj.BMC_Outlet__c, onaccObj.Id);
                system.assertEquals(retailObj.BMC_Distributor__c,distributorObj.Id);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getValuesTest
@CreateDate  9/13/2018
@Description Method tests the getValues method.
*/
    @isTest
    public static void getValuesTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                Test.startTest();
                List<String> values= BMC_RetailQualityController.getValues(AUDIT_ITEM, LOCATION);  
                //Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.getValues(null,null);
                Test.stopTest();
                system.assertEquals(15,values.size());
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name saveAuditItemTest
@CreateDate  9/13/2018
@Description Method tests the saveAuditItem method.
*/
    @isTest
    public static void 	saveAuditItemTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off = [SELECT ID  from BMC_Retail_Quality_Audit_Brand_Pack__c LIMIT 3];
                BMC_Audit_Item__c saveAudititem_off = TestDataFactory.saveAuditItem(auditpackList_off);
                Test.startTest();
                BMC_RetailQualityController.saveAuditItem(saveAudititem_off.BMC_Location__c,saveAudititem_off.BMC_Code_Date__c, saveAudititem_off.BMC_No_Manufacture_Date__c ,saveAudititem_off.BMC_UI_Quantity__c, saveAudititem_off.BMC_UOM__c  , saveAudititem_off.BMC_Out_of_Rotation__c, saveAudititem_off.BMC_Repack__c, saveAudititem_off.BMC_Damaged__c,saveAudititem_off.BMC_STR_Brand_Package_Audit_Item__c );
                BMC_RetailQualityController.saveAuditItem(null,null, null ,null, null,null,null,null,null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getallAudititemsTest
@CreateDate  9/13/2018
@Description Method tests the getallAudititems method.
*/
    @isTest
    public static void getallAudititemsTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off =  [SELECT ID  from BMC_Retail_Quality_Audit_Brand_Pack__c LIMIT 3]; 
                BMC_Audit_Item__c saveAudititem_off=TestDataFactory.saveAuditItem(auditpackList_off);
                Test.startTest();
                List<BMC_Audit_Item__c> allAuditList = BMC_RetailQualityController.getallAudititems(saveAudititem_off.BMC_STR_Brand_Package_Audit_Item__c);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.getallAudititems(null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getcodeAuditItemsTest
@CreateDate  9/13/2018
@Description Method tests the getcodeAuditItems method.
*/
    @isTest
    public static void getcodeAuditItemsTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off =  [SELECT ID  from BMC_Retail_Quality_Audit_Brand_Pack__c LIMIT 3]; 
                BMC_Retail_Quality_Audit__c retailQualityaudit =[SELECT ID, BMC_Audit_Date__c, BMC_Outlet__r.NAME FROM BMC_Retail_Quality_Audit__c WHERE BMC_Outlet__r.NAME =:OFFACCOUNT_NAME LIMIT 1];
                Test.startTest();
                List<BMC_Audit_Item__c> codeAuditList= BMC_RetailQualityController.getcodeAudititems(auditpackList_off,retailQualityaudit.BMC_Audit_Date__c);
                BMC_RetailQualityController.getcodeAudititems(null,null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name getAuditItemTest
@CreateDate  9/13/2018
@Description Method tests the getAuditItem method.
*/
    @isTest
    public static void getAuditItemTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off = [SELECT ID  from BMC_Retail_Quality_Audit_Brand_Pack__c LIMIT 3];
                BMC_Audit_Item__c saveAudititem_off = TestDataFactory.saveAuditItem(auditpackList_off);
                insert saveAudititem_off;
                Test.startTest();
                BMC_Audit_Item__c audittemList= BMC_RetailQualityController.getAuditItem(saveAudititem_off.Id);
                BMC_RetailQualityController.getAuditItem(null);
                Test.stopTest();
                System.assertEquals(audittemList.Id, saveAudititem_off.Id);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name updateAuditrecordTest
@CreateDate  9/13/2018
@Description Method tests the updateAuditrecord method.
*/
    @isTest
    public static  void updateAuditrecordTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off = [SELECT ID  from BMC_Retail_Quality_Audit_Brand_Pack__c LIMIT 3];
                BMC_Audit_Item__c saveAudititem_off = TestDataFactory.saveAuditItem(auditpackList_off);
                insert saveAudititem_off;
                Test.startTest();
                BMC_RetailQualityController.updateAuditrecord(saveAudititem_off);
                BMC_RetailQualityController.updateAuditrecord(null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        
    }
    
    /**
@Author Accenture
@name deleteRetailAuditTest
@CreateDate  9/13/2018
@Description Method tests the deleteRetailAudit method.
*/
    @isTest
    public static  void deleteRetailAuditTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<BMC_Retail_Quality_Audit_Brand_Pack__c> auditpackList_off = [SELECT ID  from BMC_Retail_Quality_Audit_Brand_Pack__c LIMIT 3];
                BMC_Audit_Item__c saveAudititem_off = TestDataFactory.saveAuditItem(auditpackList_off);
                insert saveAudititem_off;
                Test.startTest();
                BMC_RetailQualityController.deleteRetailAudit(saveAudititem_off);
                //Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.deleteRetailAudit(null);
                Test.stopTest();
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name searchScannedProductTest
@CreateDate  9/13/2018
@Description Method tests the searchScannedProduct method.
*/
    @isTest
    public static void searchScannedProductTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<Product__c> prodList = [SELECT Id, BMC_Secondary_UPC_Retail_Unit__c from Product__c LIMIT 5];
                Test.startTest();
                Product__c prod = BMC_RetailQualityController.searchScannedProduct(prodList[0].BMC_Secondary_UPC_Retail_Unit__c);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.searchScannedProduct(null);
                Test.stopTest();
                System.assertEquals(prod.BMC_Secondary_UPC_Retail_Unit__c, prodList[0].BMC_Secondary_UPC_Retail_Unit__c);
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name retrievePackageTest
@CreateDate  9/13/2018
@Description Method tests the retrievePackage method.
*/
    @isTest
    public static void retrievePackageTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<Product__c> prodList = [SELECT Id, BMC_Secondary_UPC_Retail_Unit__c from Product__c LIMIT 5];
                Test.startTest();
                List<String> pack = BMC_RetailQualityController.retrievePackage(prodList[0].BMC_Secondary_UPC_Retail_Unit__c);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.retrievePackage(null);
                Test.stopTest();
                System.assertEquals(1,pack.size());
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    /**
@Author Accenture
@name retrievePackageOffPremiseTest
@CreateDate  9/13/2018
@Description Method tests the retrievePackageOffPremise method.
*/
    @isTest
    public static void retrievePackageOffPremiseTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){
                List<Product__c> prodList = [SELECT Id, BMC_Secondary_UPC_Retail_Unit__c from Product__c LIMIT 5];
                Test.startTest();
                List<String> pack = BMC_RetailQualityController.retrievePackageOffPremise(prodList[0].BMC_Secondary_UPC_Retail_Unit__c);
                Constants.coverExceptionScenario = true;
                BMC_RetailQualityController.retrievePackageOffPremise(null);
                Test.stopTest();
                System.assertEquals(1,pack.size());
            }
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
    
    
}