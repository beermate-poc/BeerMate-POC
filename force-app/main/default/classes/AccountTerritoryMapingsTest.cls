/**
  * @author        Accenture 
  * @Name          AccountTerritoryMapingsTest  
  * @description   This test class for AccountTerritoryMappings
  * @Version       1.0
**/

@isTest
public without sharing class AccountTerritoryMapingsTest {
	@testsetup
	static void createTestData() {
        User usr = C360_Util_TestDataCreation.createUser('C360 Sales User','Molson2','Molson2@miller.com');
       }
    @isTest
    static void testMMCETerritorypopulation() {
       List<Account> accList = new List<Account>();
       user usr = [select id from user Limit 1];
       System.runAs(usr){
        Account acc = new Account();
            
        acc.Name = 'Test-MCCE';
        acc.C360_Legal_Entity__c = 'Obrt';
        acc.BillingStreet ='11';
        acc.BillingCity = 'CZ';
        acc.RecordTypeId=C360_UtilClass.getRecordtypeIdByName('MCCE_Account');
        acc.BillingCountry = 'Croatia';
        acc.BillingPostalCode = '2333409';
        acc.C360_CRM_Corporate_ID__c = '1222';
        acc.OwnerId = usr.Id;
        accList.add(acc);
        insert acc;
         
        }
       
        
        C360_Territory_Mapping__c ctm = new C360_Territory_Mapping__c();
        ctm.C360_CRM_TerrID_Employee1__c = usr.Id;
        insert ctm;
        
        Test.startTest();
        AccountTerritoryMappings.insertTerrMapOnAccounts(accList);
        Test.stopTest();
      system.assert(ctm.Id != null);
    }
}