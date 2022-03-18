@istest
public class ACE_HANAJobSchedulerTest {
    private Static Final String CRON_EXP = '0 0 * * * ?';
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
    static testMethod void testMethod1()
    {
        List<PartnerFundAllocation> allocationList = [SELECT Id, Title, ACE_FY_Promotion_ID__c, Description, Amount, ACE_Start_Date__c, ACE_End_Date__c, ACE_Co_Op_Event__c, ChannelPartner.Accountnumber, ACE_Status__c, ACE_Promo_Counter__c, RecordType.Name FROM PartnerFundAllocation];
        System.debug('allocationList'+allocationList.size());
        
       Test.startTest();
        Constants.coverExceptionScenario = true;
        String jobId = System.schedule('ScheduleApexClassTest',CRON_EXP, new ACE_HANAJobScheduler());
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];
        System.assertEquals(CRON_EXP, ct.CronExpression);
        System.assertEquals(0, ct.TimesTriggered);                	
        Test.stopTest();
    }
}