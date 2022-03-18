/**
  * @author        Accenture 
  * @Name          AssignObjectiveToAccountsControllerTest
  * @Created date  24/6/2020
  * @description   Test class for AssignObjectiveToAccountsController
  * @Version       1.0
**/
@isTest
private class AssignObjectiveToAccountsControllerTest {   
/**
  *  @author        Accenture
  *  @Date          24/6/2020
  *  @Description   Provides the test data for C360_FetchUserDetails class for positive scenarios.  
  *  @name          testCreateObjective
  */
    private static testmethod void testCreateObjective(){
        Objective__c obj= C360_Util_TestDataCreation.createObjective('TestObjective','Test objective details','Not Started');
        obj.C360_Execution_Type__c='Product';
        obj.Start_Time__c= Date.today();
        obj.End_Time__c= Date.today() + 5;
        obj.C360_Country__c = 'UKI'; 
        obj.RecordTypeId= C360_UtilClass.getRecordtypeIdByName('C360_Planned_Objective');
        database.insert(obj);
        
        User usr = C360_Util_TestDataCreation.createUser('C360 Sales User','Molson1234','Molson1234@millers.com');
        database.insert(usr);
        
        User usrec = C360_Util_TestDataCreation.createUser('C360 Sales User','helloworld','helloworld@millers.com');
         Integer countRec=0;
       System.runAs(usrec){                   
        Test.startTest();
       
        AssignObjectiveToAccountsController.createObjective(obj.Id,'2',usr.Id);
        AssignObjectiveToAccountsController.fetchUser('Molson');
        test.stopTest();
       
         }
         countRec = [SELECT COUNT() FROM Objective__c WHERE C360_Planned_Objective__c=:obj.id limit 3];
        System.assertEquals(2,countRec);     
        
    }
    
 
  /**
  *  @author        Accenture
  *  @Date          04/12/2018
  *  @Description   Provides the test data for getters , setters & picklist value
  *  @name          pageref
  */
    private static testmethod void  pageref(){
    
        User usr = C360_Util_TestDataCreation.createUser('C360 Sales User','James','james@xyz.com');
        Account acc = C360_Util_TestDataCreation.createAccount('Green Dragon');
        database.insert(acc);
        
        Objective__c obj= C360_Util_TestDataCreation.createObjective('TestObjective','Test objective details','Not Started');
        obj.C360_Execution_Type__c='Product';
        obj.Declined_Reason__c = 'Pricing concerns';
        obj.Start_Time__c= Date.today();
        obj.End_Time__c= Date.today() + 5;
        obj.C360_Country__c = 'UKI'; 
        obj.RecordTypeId= C360_UtilClass.getRecordtypeIdByName('C360_Assigned_Objective');
        database.insert(obj);
        
        PageReference pageRef = Page.C360_AccountRelateToObjective;
         Test.setCurrentPage(pageRef);
         pageRef.getParameters().put('id',obj.Id);
         
          List <SelectOption> asp = new  List <SelectOption>();
          List <SelectOption> bsp = new  List <SelectOption>();
          List <SelectOption> mSh = new  List <SelectOption>();
         
            List<SelectOption> surveyGrpOptions = new List<SelectOption>();
            List<SelectOption> ukOutletTypes = new List<SelectOption>();
            List<SelectOption> accountStatus = new List<SelectOption>();
          System.runAs(usr){
         Test.startTest();
         ApexPages.StandardController sc = new ApexPages.StandardController(Acc);
         ApexPages.StandardController sc2 = new ApexPages.StandardController(obj);
         AssignObjectiveToAccountsController testAcc = new AssignObjectiveToAccountsController(sc);
         AssignObjectiveToAccountsController testAcc2 = new AssignObjectiveToAccountsController(sc2);
         AssignObjectiveToAccountsController.cAccount wrapper = new AssignObjectiveToAccountsController.cAccount(acc,true);
         List<User> userList = AssignObjectiveToAccountsController.fetchUser('James');
         AssignObjectiveToAccountsController.createObjective(usr.ProfileId,'10',usr.Id);
         
         asp = testAcc2.getOnPremiseOptions;
         bsp = testAcc2.getOffPremiseOptions;
         msh= testAcc2.getMHSOutletGrpOptions;
         surveyGrpOptions = testAcc2.getSurveyGroup;
         ukOutletTypes = testAcc2.getUKOutletTypes;
         accountStatus = testAcc2.getAccountStatus;
            testAcc2.accountName='Molsoncoors';
            testAcc2.buyingGroup='BuyingGroup1';
            testAcc2.salesDistrict='TestSalesDistrict';
            testAcc2.hierarchy='Testhierarchy';
            testAcc2.onPremiseSelectedValue='Fine Dining';
            testAcc2.offPremiseSelectedValue='Liquor Store';
            testAcc2.onPremise=asp;
            testAcc2.offPremise=bsp;
            testAcc2.mhsOutletgrp=msh;
            testAcc2.accountStatus = 'Prospect';
            testAcc2.surveyGroup = 'AB On Premise';
            testAcc2.qualityRank = 'Good';
            testAcc2.outletType = 'Fine Dining';
            testAcc2.hasNext = true;
            testAcc2.hasPrevious = true;
            testAcc2.isRecordSearched = true;
           
            testAcc2.first();
            testAcc2.last();
            testAcc2.isallAccount = false;
            testAcc2.setPagination();
            testAcc2.createAssignmentObjectives();
            Test.stopTest();
          }
       } 
    
    public static testMethod void pageRef2(){
        User usr = C360_Util_TestDataCreation.createUser('C360 Sales User','James','james@xyz.com');
        Account acc = C360_Util_TestDataCreation.createAccount('Green Dragon');
        acc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('C360_Account').getRecordTypeId();
        acc.C360_Account_Status__c = 'Prospect';
        database.insert(acc);
        
        Objective__c obj= C360_Util_TestDataCreation.createObjective('TestObjective','Test objective details','Not Started');
        obj.C360_Execution_Type__c='Product';
        obj.Declined_Reason__c = 'Pricing concerns';
        obj.Start_Time__c= Date.today();
        obj.End_Time__c= Date.today() + 5;
        obj.C360_Country__c = 'UKI'; 
        obj.RecordTypeId= C360_UtilClass.getRecordtypeIdByName('C360_Assigned_Objective');
        database.insert(obj);
        
        PageReference pageRef = Page.C360_AccountRelateToObjective;
         Test.setCurrentPage(pageRef);
         pageRef.getParameters().put('id',obj.Id);
         
          List <SelectOption> asp = new  List <SelectOption>();
          List <SelectOption> bsp = new  List <SelectOption>();
          List <SelectOption> mSh = new  List <SelectOption>();
         
            List<SelectOption> surveyGrpOptions = new List<SelectOption>();
            List<SelectOption> ukOutletTypes = new List<SelectOption>();
            List<SelectOption> accountStatus = new List<SelectOption>();
          System.runAs(usr){
         Test.startTest();
         ApexPages.StandardController sc = new ApexPages.StandardController(Acc);
         ApexPages.StandardController sc2 = new ApexPages.StandardController(obj);
         AssignObjectiveToAccountsController testAcc = new AssignObjectiveToAccountsController(sc);
         AssignObjectiveToAccountsController testAcc2 = new AssignObjectiveToAccountsController(sc2);
         AssignObjectiveToAccountsController.cAccount wrapper = new AssignObjectiveToAccountsController.cAccount(acc,true);
         List<User> userList = AssignObjectiveToAccountsController.fetchUser('James');
         AssignObjectiveToAccountsController.createObjective(usr.ProfileId,'10',usr.Id);
         testAcc2.myAccount = 'NO';
         asp = testAcc2.getOnPremiseOptions;
         bsp = testAcc2.getOffPremiseOptions;
         msh= testAcc2.getMHSOutletGrpOptions;
         surveyGrpOptions = testAcc2.getSurveyGroup;
         ukOutletTypes = testAcc2.getUKOutletTypes;
         accountStatus = testAcc2.getAccountStatus;
            testAcc2.accountName='Green Dragon';
            
            testAcc2.accountStatus = 'Prospect';
            
            testAcc2.isRecordSearched = false;
            testAcc2.intPageNumber = Integer.valueOf(10);
            testAcc2.intNumberofPages = Integer.valueOf(20);
            testAcc2.hasNext = true;
            testAcc2.hasPrevious = true;
            testAcc2.setPagination();
            testAcc2.previous();
            testAcc2.next();
            AssignObjectiveToAccountsController.listacc = new List<Account>{new Account(Name='Test')};
            AssignObjectiveToAccountsController.account = new Account(Name='Test');
           
            testAcc2.first();
            testAcc2.last();
            testAcc2.isallAccount = true;

    }    
      
    }
    
    }