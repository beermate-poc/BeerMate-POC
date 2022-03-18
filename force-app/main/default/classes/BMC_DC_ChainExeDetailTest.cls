/**
@Author Accenture
@name BMC_DC_ChainExeDetailTest
@CreateDate  05/08/2019
@Description Includes methods for testing BMC_DC_ChainExeDetail.
@Version <1.0>
*/
@isTest(SeeAllData= false)
public  with sharing  class BMC_DC_ChainExeDetailTest {
    private Static Final String DISTRIBUTOR_NAME = 'Test Dis CAD';
    private Static Final String CHAINPARENT_NAME = 'Test Account';
    private Static Final String CHAINPARENT_BILLINGCOUNTRY ='United States';
    
    
    /**
*  @description: Method for initialDataSetup. 
*  @name: initialDataSetup
*  @param: null
*  @return: null
*/ 
    
    
    @testSetup static void initialDataSetup()
    {
        Account chainParentObj = TestDataFactory.returnSingleAccount(CHAINPARENT_NAME,constants.CHAIN_PARENT);
        chainParentObj.BillingCountry = CHAINPARENT_BILLINGCOUNTRY;
        Database.update(chainParentObj);
        Account acc1 = TestDataFactory.returnSingleAccount('test1','On-Premise');
        Account acc2 = TestDataFactory.returnSingleAccount('test2','Off-Premise');
        
        Account distributorObj = TestDataFactory.returnDistributoraccount(DISTRIBUTOR_NAME,Constants.DISTRIBUTOR);
        Product__c productSample = TestDataFactory.insertProduct('Test Brand 1', '701325', 'Test Package Off', 'Test Package On');
        BMC_Chain_Activity__c chainActivityRec = TestDataFactory.insertSingleChain('Test Chain Activity', chainParentObj.Id ,System.today()+5 , System.today()+11 ,'Chain Activity','Activity' ,productSample.Id , acc1.Id , acc2.id );
        List<BMC_Chain_Activity_Detail__c> chainDetailList = TestDataFactory.insertChainActivityDetail(distributorObj.Id, chainActivityRec.Id, acc2.Id);
    	BMC_Chain_Activity__c chainActivityRecStandard = TestDataFactory.insertSingleChain('Test Chain Activity', chainParentObj.Id ,System.today() , System.today()+1 ,'Chain Mandate','Standard' ,productSample.Id , acc1.Id , acc2.id );
        List<BMC_Chain_Activity_Detail__c> chainDetailListStandard = TestDataFactory.insertChainActivityDetail(distributorObj.Id, chainActivityRecStandard.Id , acc2.Id);
    	
    }
    /**
@Author Accenture
@name getreturnDataTest
@CreateDate  05/08/2019
@Description Method tests the getreturnData method.
*/
    @isTest
    private static void getreturnDataTest(){
        Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
        List<BMC_Chain_Activity_Detail__c> testData =  [SELECT Id, Name, BMC_Brand__c, BMC_Distributor_Account__c, BMC_Chain_Parent_Account__c, BMC_Package__c, BMC_Total_Products_Possible__c, BMC_Status__c, BMC_Gap_Calculation_Status__c , BMC_Mandate_Gap_Flag__c, BMC_Gap_Count__c,BMC_Retail_Outlet__c FROM BMC_Chain_Activity_Detail__c where BMC_Distributor_Account__c  = :distributorObj.id]; 
        BMC_DC_ChainExeDetail tenmp = new BMC_DC_ChainExeDetail();
        tenmp.accountId = distributorObj.Id;
        tenmp.getreturnData();
    }
    /**
@Author Accenture
@name getreturnTable1Test
@CreateDate  05/08/2019
@Description Method tests the getreturnTable1 method.
*/
    @isTest
    private static void getreturnTable1Test(){
        Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
        List<BMC_Chain_Activity_Detail__c> testData =  [SELECT Id, Name, BMC_Brand__c, BMC_Distributor_Account__c, BMC_Chain_Parent_Account__c, BMC_Package__c, BMC_Total_Products_Possible__c, BMC_Status__c, BMC_Gap_Calculation_Status__c , BMC_Mandate_Gap_Flag__c, BMC_Gap_Count__c,BMC_Retail_Outlet__c FROM BMC_Chain_Activity_Detail__c where BMC_Distributor_Account__c  = :distributorObj.id];
        BMC_DC_ChainExeDetail tenmp1 = new BMC_DC_ChainExeDetail();
        tenmp1.accountId = distributorObj.Id;
        tenmp1.getreturnTable1();
        //TestData.brandPackTableData dataCompareTo = new TestData.brandPackTableData();
    }
    /**
@Author Accenture
@name getactivityRetTest
@CreateDate  05/08/2019
@Description Method tests the getactivityRet method.
*/
    @isTest
    private static void getactivityRetTest(){
        Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
       // BMC_Chain_Activity__c testData = [Select Id, Name from BMC_Chain_Activity__c where Name =:'Test Chain Activity' Limit 3];
        List<BMC_Chain_Activity_Detail__c> testDetailData =  [SELECT Id, Name, BMC_Chain_Activity_ID__c, BMC_Distributor_Account__c, BMC_Chain_Parent_Account__c FROM BMC_Chain_Activity_Detail__c where BMC_Distributor_Account__c  =: distributorObj.Id];
        BMC_DC_ChainExeDetail tenmp1 = new BMC_DC_ChainExeDetail();
        tenmp1.accountId = distributorObj.Id;
        tenmp1.getactivityRet();
    }
}