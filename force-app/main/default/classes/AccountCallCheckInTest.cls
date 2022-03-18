/**
  * @author        Accenture 
  * @Name          AccountCallCheckInTest
  * @Created date  13/06/2019
  * @description   checkIn Call
  * @Version       1.0
**/
@isTest
private class AccountCallCheckInTest {

    private static testmethod void testProspectCallCheckin(){
        Account acc=C360_Util_TestDataCreation.createAccount('C360 Test Account');
        acc.C360_Account_Status__c='Prospect';
       // acc.C360_Default_OrderType__c='Direct';
        database.insert(acc);
        Test.startTest();
        AccountCallCheckIn.CallCheckIn(10.000,121.000,acc.id);
        Test.stopTest();
    }
       private static testmethod void testF1CallCheckin(){
        Profile profile1 = [Select Id from Profile where name = 'System Administrator'];
       System.debug('What is the profile id ' + profile1);
       UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
         User u = new User(
            UserRoleId = portalRole.Id,
            ProfileId = profile1.Id,
            Username = 'testtermsconditions09876@kaplan.com',
            Alias = 'batman',
            Email='testtermsconditions09876@kaplan.com',
            EmailEncodingKey='UTF-8',
            Firstname='Bruce',
            Lastname='Wayne',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago',
                    Sales_Role__c='F1');
            insert u;
           System.runAs(u){
            Account acc=C360_Util_TestDataCreation.createAccount('C360 Test Account');
        	database.insert(acc); 
           Test.startTest();
        	AccountCallCheckIn.CallCheckIn(10.000,121.000,acc.id);
        	Test.stopTest();
           }
    }
    private static testmethod void testM1CallCheckin(){
        Profile profile1 = [Select Id from Profile where name = 'System Administrator'];
       System.debug('What is the profile id ' + profile1);
       UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
         User u = new User(
            UserRoleId = portalRole.Id,
            ProfileId = profile1.Id,
            Username = 'testtermsconditions08765@kaplan.com',
            Alias = 'batman',
            Email='testtermsconditions08765@kaplan.com',
            EmailEncodingKey='UTF-8',
            Firstname='Bruce',
            Lastname='Wayne',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago',
            Sales_Role__c='M1');
            insert u;
           System.runAs(u){
            Account acc=C360_Util_TestDataCreation.createAccount('C360 Test Account');
        	database.insert(acc); 
           Test.startTest();
        	AccountCallCheckIn.CallCheckIn(10.000,121.000,acc.id);
        	Test.stopTest();
           }
    }
        private static testmethod void testF2CallCheckin(){
        Profile profile1 = [Select Id from Profile where name = 'System Administrator'];
       System.debug('What is the profile id ' + profile1);
       UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
         User u = new User(
            UserRoleId = portalRole.Id,
            ProfileId = profile1.Id,
            Username = 'testtermsconditions07654@kaplan.com',
            Alias = 'batman',
            Email='testtermsconditions07654@kaplan.com',
            EmailEncodingKey='UTF-8',
            Firstname='Bruce',
            Lastname='Wayne',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago',
            Sales_Role__c='F2');
            insert u;
           System.runAs(u){
            Account acc=C360_Util_TestDataCreation.createAccount('C360 Test Account');
        	database.insert(acc); 
           Test.startTest();
        	AccountCallCheckIn.CallCheckIn(10.000,121.000,acc.id);
        	Test.stopTest();
           }
    }
    private static testmethod void testSalesAdminCallCheckin(){
        Profile profile1 = [Select Id from Profile where name = 'Sales Administrator'];
       System.debug('What is the profile id ' + profile1);
       UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
         User u = new User(
            UserRoleId = portalRole.Id,
            ProfileId = profile1.Id,
            Username = 'testtermsconditions06543@kaplan.com',
            Alias = 'batman',
            Email='testtermsconditions06543@kaplan.com',
            EmailEncodingKey='UTF-8',
            Firstname='Bruce',
            Lastname='Wayne',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago',
            Sales_Role__c='F2');
            insert u;
           System.runAs(u){
            Account acc=C360_Util_TestDataCreation.createAccount('C360 Test Account');
        	database.insert(acc); 
           Test.startTest();
        	AccountCallCheckIn.CallCheckIn(10.000,121.000,acc.id);
        	Test.stopTest();
           }
    }
            private static testmethod void testblankCallCheckin(){
        Profile profile1 = [Select Id from Profile where name = 'System Administrator'];
       System.debug('What is the profile id ' + profile1);
       UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
         User u = new User(
            UserRoleId = portalRole.Id,
            ProfileId = profile1.Id,
            Username = 'testtermsconditions05432@kaplan.com',
            Alias = 'batman',
            Email='testtermsconditions05432@kaplan.com',
            EmailEncodingKey='UTF-8',
            Firstname='Bruce',
            Lastname='Wayne',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago');
            insert u;
           System.runAs(u){
            Account acc=C360_Util_TestDataCreation.createAccount('C360 Test Account');
        	database.insert(acc); 
           Test.startTest();
        	AccountCallCheckIn.CallCheckIn(10.000,121.000,acc.id);
        	Test.stopTest();
           }
    }
}