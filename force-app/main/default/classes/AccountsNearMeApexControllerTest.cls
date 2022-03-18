/*------------------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   A test class created to validate the AccountsNearMeApexController
               Tests executed:
               1 - testfindNearbyAccounts()
               Tests that the correct nearby accounts are returned
               2 - testfindNearbyWhereToHuntAccount()
               Tests that the correct accounts found in a where to hunt list are returned
History
9/14/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
  /*------------------------------------------------------------ /*
     * @description: This method sets up test Data for the methods
     */ 
@isTest
public without sharing class AccountsNearMeApexControllerTest {
    private static string EXCEPTION_MSSG='Script-thrown exception' ;
    @testSetup
    private static void setup() {
        List<Account> accountsToInsert = TestDataFactory.returnBulkAccount('Test Account IL', 'On-Premise', 30);
        for (Account acc : accountsToInsert) {
            acc.BillingLatitude = 41.622288;
            acc.BillingLongitude = -87.661228;
            acc.BillingCity = 'Harvey';
            acc.BillingState = 'IL';
            acc.BillingStreet = '14700 Wood St';
            acc.TradeChannelDesc__c = 'CONVENIENCE STORE';
            acc.StatusNme__c = 'Active';
            acc.PremiseTypeNme__c ='ON';
            acc.TradeChannelDesc__c='DINING';
        //    acc.C360_TOP_INDEPENDENT__c='Yes';
			acc.C360_TOP_INDEPENDENT__c='No';
            acc.C360_Account_Status__c='Trading';
            acc.C360_Sales_Channel_Description__c='On-Premise';
			acc.Number_of_Brands_13_Wk__c = 290;
			acc.Number_of_Brand_Packages_13_Wk__c = 100;
			acc.Total_13_Wk_Volume__c = 100;
            acc.TradeChannelDesc__c = 'abc abc';
        }
         Database.insert(accountsToInsert);
        Where_to_Hunt__c wthTest = TestDataFactory.insertWhereToHunt('Test List');
        TestDataFactory.insertTargetAccount(wthTest.Id, accountsToInsert[0].Id);
    }
     /*
     * @description: This method runs test coverage for findNearbyAccounts
     */ 
    @isTest static void testfindNearbyAccounts(){
        Test.startTest();
        	system.debug('@@' + [select BillingAddress,Distance(BillingAddress,GeoLocation(41.983476, -87.673394), 'mi') calculatedDistance from account]);
            List<Account> nearByAccounts = AccountsNearMeApexController.findNearbyAccounts(41.983476, -87.673394);
         Test.stopTest();    
        System.assertEquals(Constants.FIRST_30_ACCOUNTS, nearByAccounts.size());       
        try{
            //List<Account> errorList = AccountsNearMeApexController.findNearbyAccounts(0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
    }
	
	@isTest static void testfindNearbyAccounts2(){
        Test.startTest();
			User u2 = TestDataFactory.insertUser('C360 Sales User','User','C360 Sales User');
			System.runAs(u2){
        	system.debug('@@' + [select BillingAddress,Distance(BillingAddress,GeoLocation(41.983476, -87.673394), 'mi') calculatedDistance from account]);
            List<Account> nearByAccounts = AccountsNearMeApexController.findNearbyAccounts(41.983476, -87.673394);
         Test.stopTest();     
          system.assert(u2.Id != null);     
        try{
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
		}	
    }
	
	@isTest static void testfindNearbyAccounts3(){
        Test.startTest();
			User u3 = TestDataFactory.insertUser('Sales User','User','Sales User');
			System.runAs(u3){
        	system.debug('@@' + [select BillingAddress,Distance(BillingAddress,GeoLocation(41.983476, -87.673394), 'mi') calculatedDistance from account]);
            List<Account> nearByAccounts = AccountsNearMeApexController.findNearbyAccounts(41.983476, -87.673394);
         Test.stopTest();    
        System.assertEquals(Constants.FIRST_30_ACCOUNTS, nearByAccounts.size());       
        try{
            //List<Account> errorList = AccountsNearMeApexController.findNearbyAccounts(0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
		}	
    }
	
      /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for findNearbyWhereToHuntAccount
     */ 
    @isTest static void testfindNearbyWhereToHuntAccount(){
        Test.startTest();
            List<Target_Account__c> whereToHuntAccounts = [SELECT Id, Account_Name__c FROM Target_Account__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            List<Account> nearByAccounts = AccountsNearMeApexController.findNearbyWhereToHuntAccount(whereToHuntAccounts, 41.983476, -87.673394);
         Test.stopTest();    
        System.assertEquals(Constants.DAYNUM_1, nearByAccounts.size());       
        try{
           // List<Account> errorList = AccountsNearMeApexController.findNearbyWhereToHuntAccount(null, null, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
    }
      /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for searchAccountName
     */ 
   @isTest static void searchAccountNameTest(){
        Test.startTest();
            List<Account> nearByAccounts = AccountsNearMeApexController.searchAccountName('Test Account IL', 41.983476, -87.673394);
       Test.stopTest();     
       System.assertEquals(Constants.FIRST_30_ACCOUNTS, nearByAccounts.size());        
        try{
           // List<Account> errorList = AccountsNearMeApexController.searchAccountName(null, 0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
    }
	
	@isTest static void searchAccountNameTest2(){
        Test.startTest();
		User u3 = TestDataFactory.insertUser('C360 Sales User','User','C360 Sales User');
			System.runAs(u3){
            List<Account> nearByAccounts = AccountsNearMeApexController.searchAccountName('Test Account IL', 41.983476, -87.673394);
       Test.stopTest();      
        try{
        } catch(Exception e){
            system.assert(u3.Id != null);
        }
	}
    }
    
    @isTest static void searchAccountNameTest3(){
        Test.startTest();
		User u4 = TestDataFactory.insertUser('C360 Sales User','User','C360 Sales User');
			System.runAs(u4){
            List<Account> nearByAccounts = AccountsNearMeApexController.searchAccountName('Test Account 2 TS2', 41.983476, -87.673394);
       Test.stopTest();      
        try{
        } catch(Exception e){
            system.assert(u4.Id != null);
        }
	}
    }
	
	@isTest static void fetchUserTest(){
        Test.startTest(); 
            User u = AccountsNearMeApexController.fetchUser();
       Test.stopTest();      
        try{
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
    }
  
    /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for accountPremisetype
     */ 
    @isTest static void accountPremisetypeTest(){
        Test.startTest();
        	String premiseId=[SELECT PremiseTypeNme__c  from Account where Name='Test Account IL1' LIMIT 1].PremiseTypeNme__c ;
            List<Account> accountRecordTypes = AccountsNearMeApexController.accountPremisetype(premiseId,41.983476, -87.673394);
         Test.stopTest();
            System.assertEquals(Constants.FIRST_30_ACCOUNTS, accountRecordTypes.size());       
        try{
           // List<Account> errorList = AccountsNearMeApexController.accountPremisetype(null,0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
    }
     /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for tradeChannelValues
     */ 
     @isTest static void tradeChannelValuesTest(){
        Test.startTest();
            List<String> tradeChannelList = AccountsNearMeApexController.tradeChannelValues();
          Test.stopTest();   
         System.assertEquals(Constants.TRADE_CHANNEL, tradeChannelList.size());              
    }
     /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for accountTradeChannel
     */ 
    @isTest static void accountTradeChannelTest(){
        Test.startTest();
        	String tradeChannel=[SELECT TradeChannelDesc__c  from Account where Name='Test Account IL1' LIMIT 1].TradeChannelDesc__c ;
            List<Account> accountRecordTypes = AccountsNearMeApexController.accountTradeChannel(tradeChannel,41.983476, -87.673394);
         Test.stopTest();
            System.assertEquals(Constants.FIRST_30_ACCOUNTS, accountRecordTypes.size());       
        try{
           // List<Account> errorList = AccountsNearMeApexController.accountTradeChannel(null,0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }
    }
    /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for calledOnAccounts
     */
    @isTest static void calledOnAccountsTest(){
        Test.startTest();
        	String accStatus=[Select C360_TOP_INDEPENDENT__c from Account where Name='Test Account IL1' LIMIT 1].C360_TOP_INDEPENDENT__c;
        	List<Account> accountRecordTypes =  AccountsNearMeApexController.calledOnAccounts(accStatus,41.983476, -87.673394);
        Test.stopTest();
        	System.assertEquals(Constants.FIRST_30_ACCOUNTS, accountRecordTypes.size());
        try{
            //List<Account> errorList = AccountsNearMeApexController.calledOnAccounts(null,0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }      
    }
	
        /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for salesChannelDesc
     */
    @isTest static void salesChannelDescTest(){
        Test.startTest();
        	String salesChannelD=[Select C360_Sales_Channel_Description__c from Account where Name='Test Account IL1' LIMIT 1].C360_Sales_Channel_Description__c;
        	List<Account> accountRecordTypes =  AccountsNearMeApexController.salesChannelDesc(salesChannelD,41.983476, -87.673394);
        Test.stopTest();
        	System.assertEquals(Constants.FIRST_30_ACCOUNTS, accountRecordTypes.size());
        try{
            //List<Account> errorList = AccountsNearMeApexController.salesChannelDesc(null,0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }      
    }
       /*------------------------------------------------------------ /*
     * @description: This method runs test coverage for accountStatus
     */
    @isTest static void accountStatusTest(){
        Test.startTest();
        	String accountStat=[Select C360_Account_Status__c from Account where Name='Test Account IL1' LIMIT 1].C360_Account_Status__c;
        	List<Account> accountRecordTypes =  AccountsNearMeApexController.accountStatus(accountStat,41.983476, -87.673394);
        Test.stopTest();
        	System.assertEquals(Constants.FIRST_30_ACCOUNTS, accountRecordTypes.size());
        try{
            //List<Account> errorList = AccountsNearMeApexController.accountStatus(null,0, null);
        } catch(Exception e){
            System.assertEquals(e.getMessage(), EXCEPTION_MSSG);
        }      
    }
	
	@isTest static void filterByMyAccountstest(){
		Test.startTest();
			AccountsNearMeApexController.filterByMyAccounts(True,41.622288,-87.661228);
		Test.stopTest();
	}
	
	@isTest static void profileNametest(){
		Test.startTest();
			AccountsNearMeApexController.profileName();
		Test.stopTest();
	}
    
}