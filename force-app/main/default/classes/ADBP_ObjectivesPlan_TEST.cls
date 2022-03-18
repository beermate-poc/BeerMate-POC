/*------------------------------------------------------------
Author:        Mihai Badescu (mihai.badescu@molsoncoors.com)
Description:   Test class for PDE_Brand_Files_Assignment.
Inputs:        none
History
14/09/2020     Initial creation
------------------------------------------------------------*/

@isTest
public class ADBP_ObjectivesPlan_TEST {

    @isTest
    public static void shouldUpdateObjectives(){
        
      Id pricebookId = Test.getStandardPricebookId();

      Account objAccount = new Account();
      objAccount.Name = 'Test';
      Insert objAccount;

      Opportunity opp = new Opportunity();
      opp.Name = 'test';
      opp.StageName = 'test';
      opp.CloseDate = date.valueOf(system.now());
      opp.Benchmark_Placements__c = 50;
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
      obj.Opportunity__c = opp.Id ;
      obj.C360_Product__c = objProduct.Id;
      obj.Smart_Objective__c = true;
      obj.Projected_DNR__c = 350;
      obj.Projected_NSR__c = 320;
      obj.BMC_Projected90Days__c = 32;
      obj.Objectives_Premise_Type__c = 'Off-Premise';
      obj.C360_Country__c = 'United States';
      Insert obj;

      List<Id> includeList = new List<Id>();
      includeList.add(obj.Id);

      Profile p = [SELECT Id FROM Profile WHERE Name='Standard User']; 
      User u = new User(Alias = 'testuid', Email= 'test@test.com', 
      EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US', 
      LocaleSidKey='en_US', ProfileId = p.Id, 
      TimeZoneSidKey='America/New_York', UserName= 'testtestttttest@mcbc.com'); 
      insert u;

      Test.startTest();
      List<Objective__c> objList = ADBP_ObjectivesPlan.getObjectivesList(opp.Id);
      String s = ADBP_ObjectivesPlan.updateObjectivesToPlan(includeList,new List<Id>(),opp.Id);
      List<Opportunity> oppList = ADBP_ObjectivesPlan.getOppDetails(opp.Id,u.Id);
      String s2 = ADBP_ObjectivesPlan.updateObjectivesToPlan(new List<Id>(),includeList,opp.Id);
      System.assertEquals(1,objList.size());
      System.assertEquals('success',s);
      Test.stopTest();
    }

}