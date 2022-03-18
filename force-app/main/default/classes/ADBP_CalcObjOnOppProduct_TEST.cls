/*
@Author Mihai Badescu
@name ADBP_CalcObjOnOppProduct_TEST
@CreateDate  4/26/2021
@Description Includes methods for testing ADBP_CalculateObjectivesOnOppProduct & ADBP_CalcObjOnOppProductScheduler.
@Version <1.0>
*/

@isTest
public class ADBP_CalcObjOnOppProduct_TEST {

    private Static Final String CRON_EXP = '0 0 * * * ?';	
    
    @isTest
    public static void shouldCalculateValues(){

        Id pricebookId = Test.getStandardPricebookId();
        Id recordTypeIdOpportunity = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('ADBP Opportunity').getRecordTypeId();

        Account objAccount = new Account();
        objAccount.Name = 'Test';
        Insert objAccount;

        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User']; 
        User u = new User(Alias = 'testuid', Email= 'test@test.com', 
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
        LocaleSidKey='en_US', ProfileId = p.Id, 
        TimeZoneSidKey='America/New_York', UserName= 'testtestttttest@mcbc.com'); 
        insert u;

        Opportunity opp = new Opportunity();
        opp.Name = 'test';
        opp.StageName = 'Plan';
        opp.RecordTypeId = recordTypeIdOpportunity;
        opp.CloseDate = date.valueOf(system.now());
        opp.Benchmark_Placements__c = 50;
        opp.OwnerId = u.Id;
        opp.AccountId = objAccount.Id;
        Insert opp;

        Product2 objProduct = new Product2();
        objProduct.Name = 'Test';
        objProduct.Description = 'Test';
        objProduct.C360_Sales_Organization__c = '1000';
        objProduct.IsActive = true;
        objProduct.Record_Type_Category__c = 'Brand-Package';
        objProduct.C360_Container_Type__c = 'BTL';
        Insert objProduct;

        PricebookEntry pbEntry = new PricebookEntry();
        pbEntry.Pricebook2Id = pricebookId;
        pbEntry.Product2Id = objProduct.Id;
        pbEntry.UnitPrice = 100.00;
        pbEntry.IsActive = true;
        insert pbEntry;

        OpportunityLineItem objLineItem = new OpportunityLineItem();
        objLineItem.PriceBookEntryId = pbEntry.Id;
        objLineItem.OpportunityId = opp.Id;
        objLineItem.Quantity = 1;
        objLineItem.Unitprice = 500;
        Insert objLineItem;

        Objective__c obj = new Objective__c();
        obj.Opportunity__c = opp.Id;
        obj.C360_Product__c = objProduct.Id;
        obj.Smart_Objective__c = true;
        obj.Projected_DNR__c = 350;
        obj.Projected_NSR__c = 320;
        obj.BMC_Projected90Days__c = 32;
        obj.Objectives_Premise_Type__c = 'Off-Premise';
        obj.C360_Country__c = 'United States';
        Insert obj;

        Test.startTest();
        Constants.coverExceptionScenario = true;
        String jobId = System.schedule('ScheduleApexClassTest',CRON_EXP, new ADBP_CalcObjOnOppProductScheduler());
        CronTrigger ct = [SELECT Id, CronExpression, TimesTriggered, NextFireTime FROM CronTrigger WHERE id = :jobId];
        System.assertEquals(CRON_EXP, ct.CronExpression);
        System.assertEquals(0, ct.TimesTriggered);
        Test.stopTest();
    }
}