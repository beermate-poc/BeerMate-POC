@isTest
public class ACE_FundRequestBatchTest {
 @testSetup
    public static void testDataSetup(){
        User user =ACE_TestDataFactory.createPortalUser();
        //insert user;
        PartnerMarketingBudget appSpend = ACE_TestDataFactory.createBudget(50);
        insert appSpend;
        
        Account prtnrAcc = new Account();
        prtnrAcc.Name = 'MU - IL IA';
        insert(prtnrAcc);
        prtnrAcc.IsPartner = true;
        update(prtnrAcc);
        
        List<Account> mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
        insert mgmtUnits;
        List<Account> shipToAcc;
        system.runAs(user){ 
        shipToAcc = ACE_TestDataFactory.createShipTos(1,mgmtUnits);
        insert shipToAcc;
        }
        PartnerFundAllocation allocation=ACE_TestDataFactory.createPromotion(appSpend.Id, prtnrAcc.Id, 'MU - IL IA');
        insert allocation;
        List<PartnerFundRequest> fundRequest = ACE_TestDataFactory.createFundRequests(allocation,1);
        insert fundRequest;
    }
     public static  testMethod void executeTest(){
        List<PartnerFundRequest> reqList = [SELECT Id, ACE_FY_Fund_Request_ID__c, Title, Amount, ACE_Start_Date__c, ACE_End_Date__c, ACE_Internal_Order__r.ACE_Internal_Order_Nbr__c, ACE_Co_Op_Event__c, RecordType.Name, ChannelPartner.Accountnumber, Account_Ship_To__r.Name, Account_Ship_To__r.AccountNumber, Account_Ship_To__r.C360_Cust_Hierarchy_Lvl3_Code__c, Account_Ship_To__r.PrimaryMgmtUnitDesc__c, ACE_Status__c, Allocation.ACE_FY_Promotion_ID__c, ACE_Spend_Type__r.ACE_Spend_Type_ID__c FROM PartnerFundRequest];
        System.debug('reqList'+reqList.size());
        ACE_FundRequestBatch BFR = new ACE_FundRequestBatch();
        Database.BatchableContext BC; 
        Test.startTest();
        Test.setMock(WebServiceMock.class, new ACE_TestRequestWebServiceMock());
        BFR.execute(BC, reqList);
        BFR.finish(BC);
        Test.stopTest();
    }
}