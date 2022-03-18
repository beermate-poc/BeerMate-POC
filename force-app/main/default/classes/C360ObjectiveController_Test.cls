/*********************************************
 * Test Class - C360ObjectiveController_Test
 * Main Class - C360ObjectiveController
 * @Author    - Abhilash Daslal
 * Created On - 15th May 2019
 *********************************************/

@isTest
public class C360ObjectiveController_Test {
    
    private static final String CURRENCY_USED = 'USD';
    private static final String TERRITORY = '1-1841;';
    private static final String EMP_ID = '0000900914';
    private static final String COUNTRY = 'Canada';
    private static final String OBJ_Name = 'Test Objective';
    private static final String STATUS = 'Executed';
    private static final String STATUS2 = 'In Progress';
    private static final String EXECUTION_TYPE = 'Price';
    private static final String OBJ_SUMMARY = 'Test Summary';
    private static final String NAME = 'Test';
    private static final String SALES_ORGANISATION = '0010';

    public static testMethod void ObjectiveControllerTest(){
        
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
            
            Event myEvent2 = new Event();
            myEvent2.CurrencyIsoCode = CURRENCY_USED;
            myEvent2.StartDateTime = System.now().addHours(72);
            myEvent2.EndDateTime = System.now().addHours(100);
            myEvent2.WhatId = acc.id;
            myEvent2.Objective_Call_Summary__c = NULL;
            insert myEvent2;
            
            Test.startTest();
            Objective__c obj1 = C360ObjectiveController.getObjectiveDetails(obj.Id);
            Objective_Call_Summary__c ocs1 = C360ObjectiveController.createObjectiveCallSummaryFun(obj);
            C360ObjectiveController.updateObjectiveCallSummaryFun('Test',ocs1.id,Integer.valueOf(5));
            Event event2 = C360ObjectiveController.getEventDetails(myEvent.id);
            C360ObjectiveController.ResultWrapper wrap = C360ObjectiveController.objectiveCallSummaryFun(myEvent.Id,obj.Id);
            C360ObjectiveController.ResultWrapper wrap2 = C360ObjectiveController.objectiveCallSummaryFun(myEvent2.Id,obj.Id);
            C360ObjectiveController.ResultWrapper wrap3 = C360ObjectiveController.objectiveCallSummaryFun(myEvent2.Id,acc.id);
            String sampleString = C360ObjectiveController.appendValueFU('',obj1);
            Test.stopTest();
        }
    }
}