@isTest
public class BMC_CA_ProductTriggerHandlerTest {
    private Static Final String CHAINPARENT_NAME = 'Test Account';
    private static Final String CHAINACTIVITY_NAME = 'Test chain Activity';
    private static Final String CHAINACTIVITY_NAMETEST = 'Test chain Activity 1';
    @testSetup
    private static void setup(){
        Account chainParentObj = TestDataFactory.returnSingleAccount(CHAINPARENT_NAME,constants.CHAIN_PARENT);
        List<BMC_Chain_Activity__c> chainActivityRec = TestDataFactory.insertChainActivity(CHAINACTIVITY_NAME, chainParentObj.Id ,System.today()+5 , System.today()+11 ,'Chain Activity','Activity');
        List<Product__c> productList = TestDataFactory.createauditProduct();
    }
    
    @isTest
    private static void concatenateBrandPackTest(){
        BMC_Chain_Activity__c testChainActivity = [SELECT Id, Name FROM BMC_Chain_Activity__c where BMC_Chain_Activity_Name__c=: CHAINACTIVITY_NAMETEST LIMIT 1];
        List<Product__c> productList = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c];
        List<BMC_Chain_Activity_Product__c>  caProductList= new List<BMC_Chain_Activity_Product__c>();
        for(Product__c prodObj:productList){                
            BMC_Chain_Activity_Product__c testCAProduct = new BMC_Chain_Activity_Product__c();
            testCAProduct.BMC_Chain_Activity_ID__c= testChainActivity.Id;
            testCAProduct.BMC_Chain_Activity_Product__c = prodObj.Id;
            caProductList.add(testCAProduct);
        }
        
        insert caProductList;   
        system.assertEquals(5, [SELECT COUNT() FROM BMC_Chain_Activity_Product__c WHERE BMC_Chain_Activity_ID__c=:testChainActivity.Id]);
        
        List<BMC_Chain_Activity_Product__c> deletecaProdsecond=[SELECT ID, Name from BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #2' OR BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #3'];
        delete deletecaProdsecond;
        system.assertEquals(0, [SELECT COUNT() FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #2'OR BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #3']);
        
        List<BMC_Chain_Activity_Product__c> deletecaProdfirst=[SELECT ID, Name from BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #0'];
        delete deletecaProdfirst;
        system.assertEquals(0, [SELECT COUNT() FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #0']);
        
        List<BMC_Chain_Activity_Product__c> deletecaProdfourth=[SELECT ID, Name from BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #4'];
        delete deletecaProdfourth;
        system.assertEquals(0, [SELECT COUNT() FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #4']);
        
        List<BMC_Chain_Activity_Product__c> deletecaProdlast=[SELECT ID, Name from BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #1'];
        delete deletecaProdlast;
        system.assertEquals(0, [SELECT COUNT() FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_Product__r.TrademarkBrandLongNme__c='My Brand #1']);
        
    }    
}