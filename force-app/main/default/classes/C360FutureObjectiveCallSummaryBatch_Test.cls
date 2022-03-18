/*********************************************************
 * Test Class - C360FutureObjectiveCallSummaryBatch_Test
 * Main Class - C360FutureObjectiveCallSummaryBatch
 * @Author    - Abhilash Daslal
 * Created On - 15th May 2019
 *********************************************************/

@isTest
public class C360FutureObjectiveCallSummaryBatch_Test {
    
    private static final String CURRENCY_USED = 'USD';
    private static final String TERRITORY = '1-1841;';
    private static final String EMP_ID = '0000900914';
    private static final String COUNTRY = 'Canada';
    private static final String OBJ_Name = 'Test Objective';
    private static final String STATUS = 'In Progress';
    private static final String EXECUTION_TYPE = 'Price';
    private static final String OBJ_SUMMARY = 'Test Summary';
    private static final String NAME = 'Test';
    private static final String SALES_ORGANISATION = '0010';

    public static testMethod void testObjectCallSummaryCreation(){
        User user = C360_Util_TestDataCreation.createUser('C360 Sales User','Gayle','Gayle@testMail.com');
        user.IsActive = true;
        user.C360_Territory__c = TERRITORY;
        user.C360_CRM_Employee_ID__c = EMP_ID;
        insert user;
        
        System.runAs(user){
            Account acc = TestDataFactory.returnSingleAccountNoInsert('Test Account','Canada Account');
            insert acc;
            
            Product2 prod = new Product2();
            prod.Name = NAME;
            prod.StockKeepingUnit = NAME;
            prod.IsActive = true;
            prod.C360_Sales_Organization__c = SALES_ORGANISATION;
            insert prod;
            
            Objective__c obj = new Objective__c();
            obj.C360_Country__c = COUNTRY;
            obj.Account__c = acc.id;
            obj.Name = OBJ_Name;
            obj.Status__c = STATUS;
            obj.RecordTypeId = Schema.SObjectType.Objective__c.getRecordTypeInfosByName().get('Planned Objective').getRecordTypeId();
            obj.C360_Execution_Type__c = EXECUTION_TYPE;
            obj.C360_Product__c = prod.id;
            obj.Start_Time__c = System.now().addHours(-72);
            obj.End_Time__c = System.now().addHours(72);
            insert obj;
            
            Objective_Call_Summary__c ocs = new Objective_Call_Summary__c();
            ocs.CurrencyIsoCode = CURRENCY_USED;
            ocs.Future_Objective_Call_Summary__c = true;
            ocs.Number_of_objectives__c = Integer.valueOf(3);
            ocs.Objective_Summary__c = OBJ_SUMMARY;
            ocs.OwnerId = user.id;
            insert ocs;
            
            
            Event myEvent = new Event();
            myEvent.CurrencyIsoCode = CURRENCY_USED;
            myEvent.StartDateTime = System.now().addHours(72);
            myEvent.EndDateTime = System.now().addHours(100);
            myEvent.WhatId = acc.id;
            myEvent.Objective_Call_Summary__c = ocs.Id;
            insert myEvent;
            
            C360FutureObjectiveCallSummaryBatch__c objCallSummary = new C360FutureObjectiveCallSummaryBatch__c();
            objCallSummary.Name = NAME;
            objCallSummary.Last_Batch_executed_time__c = System.now();
            insert objCallSummary;
            
            Test.startTest();
            C360FutureObjectiveCallSummaryBatch batch = new C360FutureObjectiveCallSummaryBatch();
            Id jobId = Database.executeBatch(batch);
            Test.stopTest();
            System.assert(jobId != NULL);
            System.assertEquals([Select count() from Objective_Call_Summary__c], 1,'Objective Call Summary record created successfully');
        }
    }
}