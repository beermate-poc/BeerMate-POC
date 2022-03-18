@isTest
public class ACE_FundAllocationBatchTest {
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
    }
    public static  testMethod void executeTest(){
        List<PartnerFundAllocation> allocationList = [SELECT Id, Title, ACE_FY_Promotion_ID__c, Description, Amount, ACE_Start_Date__c, ACE_End_Date__c, ACE_Co_Op_Event__c, ChannelPartner.Accountnumber, ACE_Status__c, ACE_Promo_Counter__c, RecordType.Name FROM PartnerFundAllocation];
        System.debug('allocationList'+allocationList.size());
        ACE_FundAllocationBatch BFA = new ACE_FundAllocationBatch();
        Database.BatchableContext BC; 
        Test.startTest();
        Test.setMock(WebServiceMock.class, new ACE_TestAllocationWebServiceMock());
        BFA.start(BC);
        BFA.execute(BC, allocationList);
        BFA.finish(BC);
        Test.stopTest();
    }
}