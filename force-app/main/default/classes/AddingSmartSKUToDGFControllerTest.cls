/**
    *  @author        Accenture
    *  @Version       1.0
    *  @Date          07/14/2020(MM/DD/YYYY)
    *  @Name   		  AddingSmartSKUToDGFControllerTest 
    *  @type          test class for AddingSmartSKUToDGFController
    
    */
@isTest
private with sharing class AddingSmartSKUToDGFControllerTest {
    private static Final String  ACCNAME = 'Test Record ACC';
    private static Final String  DRONAME = 'Test Record DRO';
    private static Final String  CALNAME = 'Calculator Test';
    private static Final String  NETID = '1212';
    private static Final String  PROFILENAME_US = 'Sales Administrator';
    private static Final String  NAMEUSR_US = 'MolsnUS';
    private static Final String  USRMAILID_US = 'MolsnUS@miller.com';
    private static Final String  SUCCESSSTR = 'Success';
    /**
    *  @author        Accenture
    *  @Version       1.0
    *  @Date          07/14/2020(MM/DD/YYYY)
    *  @Description   Provides the test data for updateCalculation for positive scenarios.  
    *  @name          positiveCase
    *  @param         NA
    *  @return        NA
    *  @throws exception  NA
    */
    private static testmethod void updateCalculationPositive(){
        //User creation
        User usr = C360_Util_TestDataCreation.createUser(PROFILENAME_US,NAMEUSR_US,USRMAILID_US);
        usr.C360_MCBC_Network_ID__c =NETID;
        
        Account acc = C360_Util_TestDataCreation.createAccount(ACCNAME);
        database.insert(acc);
        
        Distributor_Retail_Outlet__c dro = new Distributor_Retail_Outlet__c();
        dro.Name = DRONAME;
        database.insert(dro);
        
        SmartSKUs__c skuacc = new SmartSKUs__c();
        skuacc.Name = ACCNAME;
        skuacc.Retail_Outlet__c = acc.Id;
        database.insert(skuacc);
        SmartSKUs__c skudro = new SmartSKUs__c();
        skudro.Name = DRONAME;
        skudro.Distributor_Retail_Outlet__c = dro.Id;
        database.insert(skudro);
        
        Calculations__c cal = new Calculations__c(Name=CALNAME);
        
        String assertSuccess;
        Calculations__c calAssert;
        system.RunAs(usr){
        //Calculations__c Creation
        
        database.insert(cal);
        //system.debug('Cal Id--'+cal.Id);
        
         
            Test.startTest();
            	calAssert = AddingSmartSKUToDGFController.getCalculator(cal.Id);
            	AddingSmartSKUToDGFController.getSKUsForAccount(acc.Id,skuacc.id);
            	AddingSmartSKUToDGFController.getSKUsForAccount(acc.Id,null);
            	AddingSmartSKUToDGFController.getSKUsForDRO(dro.Id,skudro.id);
            	AddingSmartSKUToDGFController.getSKUsForDRO(dro.Id,null);
            	assertSuccess = AddingSmartSKUToDGFController.saveCalculator(cal);
            Test.stopTest();
        }
		
        System.assertEquals(calAssert.Id ,cal.Id);
        System.assertEquals(assertSuccess ,SUCCESSSTR);
        
    }

}