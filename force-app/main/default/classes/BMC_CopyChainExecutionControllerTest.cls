/**
@Author Accenture
@name BMC_CopyChainExecutionControllerTest
@CreateDate  11/29/2019
@Description Includes methods for testing BMC_CopyChainExecutionController.
@Version <1.0>
*/
@isTest
private class BMC_CopyChainExecutionControllerTest {
    private static Final String CHAINLEVELPARENT= 'Chain Level 1 Parent' ;
    private static Final String CHAINPARENT ='Chain Parent';
    private static Final String CHILDONE ='Child1';
    private static Final String CHILDTWO ='Child2';
    private static Final String GCHILDONE ='Gchild1';
    private static Final String TESTOUTLETONE ='123456';
    private static Final String TESTOUTLETTWO ='123457';
    private static Final String TESTOUTLETC2 ='234567';
    private static Final String TESTOUTLETG1 ='345678';
    private Static Final String SALES_USER ='Sales User';
    private Static Final String USER_NAME ='testChainActivityUser';
    private Static Final String ROLE ='Sales Administrator';
    private Static Final String NAME ='User';
    
    /**
*  @description: Method for initialDataSetup. 
*  @name: setup
*  @param: null
*  @return: null
*/ 
    @testSetup
    private static void setup(){
        User testUser = TestDataFactory.insertUser(SALES_USER, USER_NAME, ROLE);
       // system.debug(testUser);
        System.runAs(testUser)
        {
            Account testParentAcct = TestDataFactory.returnSingleAccount(CHAINLEVELPARENT,CHAINPARENT,TESTOUTLETONE);
            Account testParentAcctTwo = TestDataFactory.returnSingleAccount('CHAINLEVELPARENTTWO',CHAINPARENT,TESTOUTLETONE);
            Account testChildAcct1 = TestDataFactory.returnChildAccount(CHILDONE, CHAINPARENT, testParentAcct.id,TESTOUTLETTWO);   
            Account testChildAcct2 = TestDataFactory.returnChildAccount(CHILDTWO,CHAINPARENT, testParentAcct.id,TESTOUTLETC2);
            insert new Account[] {testChildAcct1,testChildAcct2};
                
                Account testGchildAcct1 = TestDataFactory.returnChildAccount(GCHILDONE,'Chain On-Premise',testChildAcct1.Id,TESTOUTLETG1);
            Account testGchildAcct2 = TestDataFactory.returnChildAccount('Gchild2','Chain Off-Premise',testChildAcct1.Id,'456789');
            Account testGchildAcct3 = TestDataFactory.returnChildAccount('Gchild3','Chain On-Premise',testChildAcct1.Id,'345623');
            Account testGchildAcct4 = TestDataFactory.returnChildAccount('Gchild4','Chain Off-Premise',testChildAcct1.Id,'456239');
            insert new Account[] {testGchildAcct1, testGchildAcct2, testGchildAcct3, testGchildAcct4};
                
                
                BMC_Chain_Activity__c testChainActivity = TestDataFactory.createChainActivity(testParentAcct.Id, Date.newInstance(2021,12,19),Date.newInstance(2020,1,19));
            BMC_Chain_Activity__c testChainActivityTwo = TestDataFactory.createChainActivity(testParentAcctTwo.Id, Date.newInstance(2021,12,19),Date.newInstance(2020,1,19));
            List<BMC_Chain_Activity__c> testChainActivityList = TestDataFactory.insertChainActivity('chainName', testParentAcct.Id, Date.newInstance(2020,1,19),Date.newInstance(2021,12,19),'Chain Activity','Activity');
           List<BMC_Chain_Activity__c> testChainActivityList1 = TestDataFactory.insertChainActivity('chainName1', testParentAcct.Id, Date.newInstance(2020,1,19),Date.newInstance(2021,12,19),'Chain Mandate','Standard');
            Where_to_Hunt__c whereToHuntCE = TestDataFactory.insertWhereToHunt('Favorite List');
            whereToHuntCE.BMC_Source__c = 'Chain Activity-Favorite';
            whereToHuntCE.BMC_Chain_Activity_ID__c =testChainActivityTwo.id;
            update whereToHuntCE;
            
            Where_to_Hunt__c whereToHuntMaster = [SELECT id FROM Where_to_Hunt__c WHERE BMC_Chain_Activity_ID__c=:testChainActivity.id AND BMC_Chain_Activity_Favorite__c=false LIMIT 1];
            Where_to_Hunt__c whereToHuntMasterTwo = [SELECT id FROM Where_to_Hunt__c WHERE BMC_Chain_Activity_ID__c=:testChainActivityList[0].id AND BMC_Chain_Activity_Favorite__c=false LIMIT 1];
            
            Target_Account__c testOutlet1 = TestDataFactory.insertTargetAccount(whereToHuntMaster.id, testGchildAcct1.id);
            Target_Account__c testOutlet2 = TestDataFactory.insertTargetAccount(whereToHuntMasterTwo.id, testGchildAcct2.id);
            
            Product__c testProduct = TestDataFactory.insertProduct('test','test','test','test');
            
            BMC_Chain_Activity_Product__c chainActivityProduct = TestDataFactory.insertSingleChainProduct(testChainActivity.Id, testProduct.Id);
            BMC_Chain_Activity_Product__c chainActivityProductTwo = TestDataFactory.insertSingleChainProduct(testChainActivityList[0].Id, testProduct.Id);
            
        }
    }
    
    /**
@Author Accenture
@name getRelatedCETest
@CreateDate  11/29/2019
@Description Method tests the getRelatedCE & getUserName methods.
*/
    @isTest
    private static void getRelatedCETest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                BMC_Chain_Activity__c testChainActivity = [SELECT Id, Name,BMC_Chain_Activity_Name__c, recordTypeId,recordType.Name, BMC_Mandate_Type__c, BMC_Chain_Parent_Account__c,BMC_Chain_Parent_Account__r.Name, BMC_Total_Products_Possible__c,BMC_Start_Date__c, BMC_Status__c, BMC_Notes__c, BMC_Gap_Calculation_Status__c, BMC_End_Date__c, BMC_Total_Outlets_Selected__c, BMC_Mobile_Restriction__c, BMC_Monthly_Business_Objectives__c, BMC_Happy_Hour_Specials__c, BMC_Weekly_Features__c, BMC_LTO_BOM__c, BMC_Ad_Feature__c, BMC_Display__c, BMC_Event__c, BMC_POS__c, BMC_Other__c, BMC_Electronic_Funds_Transfer__c, BMC_Program_Cost_Estimate__c,BMC_Distributor_Option_Minimum_Products__c, BMC_Seasonal_Brand_Group__c   FROM BMC_Chain_Activity__c LIMIT 1 ];
                Test.startTest();
                BMC_CopyChainExecutionController.getRelatedCE(testChainActivity.id); 
                BMC_CopyChainExecutionController.getUserName(); 
                Test.stopTest(); 
            }
        }
        catch(Exception e){
         //   system.debug(e);
        }
    }
    
    /**
@Author Accenture
@name checkAndSaveMandateTest
@CreateDate  11/29/2019
@Description Method tests the checkAndSaveMandate methods.
*/
    @isTest
    private static void checkAndSaveMandateTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                BMC_Chain_Activity__c testChainActivity = [SELECT Id, Name,BMC_Chain_Activity_Name__c, recordTypeId,recordType.Name, BMC_Mandate_Type__c, BMC_Chain_Parent_Account__c,BMC_Chain_Parent_Account__r.Name, BMC_Total_Products_Possible__c,BMC_Start_Date__c, BMC_Status__c, BMC_Notes__c, BMC_Gap_Calculation_Status__c, BMC_End_Date__c, BMC_Total_Outlets_Selected__c, BMC_Mobile_Restriction__c, BMC_Monthly_Business_Objectives__c, BMC_Happy_Hour_Specials__c, BMC_Weekly_Features__c, BMC_LTO_BOM__c, BMC_Ad_Feature__c, BMC_Display__c, BMC_Event__c, BMC_POS__c, BMC_Other__c, BMC_Electronic_Funds_Transfer__c, BMC_Program_Cost_Estimate__c,BMC_Distributor_Option_Minimum_Products__c, BMC_Seasonal_Brand_Group__c   FROM BMC_Chain_Activity__c where recordType.Name=:'Chain Mandate' LIMIT 1 ];
                Test.startTest();
                BMC_CopyChainExecutionController.checkAndSaveMandate(testChainActivity.Id, testChainActivity.Name, testChainActivity.BMC_Mandate_Type__c, testChainActivity.BMC_Status__c,testChainActivity.BMC_Start_Date__c, testChainActivity.BMC_End_Date__c, testChainActivity.BMC_Notes__c, testChainActivity.BMC_Distributor_Option_Minimum_Products__c, testChainActivity.BMC_Seasonal_Brand_Group__c); 
                Test.stopTest(); 
            }
        }
        catch(Exception e){
           // system.debug(e);
        }
    }
    
    /**
@Author Accenture
@name checkandsaveTest
@CreateDate  11/29/2019
@Description Method tests the checkandsave methods.
*/@isTest
    private static void checkandsaveTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                BMC_Chain_Activity__c testChainActivity = [SELECT Id, Name,BMC_Chain_Activity_Name__c, recordTypeId,recordType.Name, BMC_Mandate_Type__c, BMC_Chain_Parent_Account__c,BMC_Chain_Parent_Account__r.Name, BMC_Total_Products_Possible__c,BMC_Start_Date__c, BMC_Status__c, BMC_Notes__c, BMC_Gap_Calculation_Status__c, BMC_End_Date__c, BMC_Total_Outlets_Selected__c, BMC_Mobile_Restriction__c, BMC_Monthly_Business_Objectives__c, BMC_Happy_Hour_Specials__c, BMC_Weekly_Features__c, BMC_LTO_BOM__c, BMC_Ad_Feature__c, BMC_Display__c, BMC_Event__c, BMC_POS__c, BMC_Other__c, BMC_Electronic_Funds_Transfer__c, BMC_Program_Cost_Estimate__c,BMC_Distributor_Option_Minimum_Products__c, BMC_Seasonal_Brand_Group__c   FROM BMC_Chain_Activity__c where recordType.Name=:'Chain Activity' LIMIT 1 ];
                Test.startTest();
                BMC_CopyChainExecutionController.checkandsave(testChainActivity.Id,  testChainActivity.Name,  testChainActivity.BMC_Mandate_Type__c,  testChainActivity.BMC_Status__c, testChainActivity.BMC_Start_Date__c, testChainActivity.BMC_End_Date__c, testChainActivity.BMC_Monthly_Business_Objectives__c, testChainActivity.BMC_Notes__c,  testChainActivity.BMC_Happy_Hour_Specials__c, testChainActivity.BMC_LTO_BOM__c, testChainActivity.BMC_Weekly_Features__c, testChainActivity.BMC_Ad_Feature__c, testChainActivity.BMC_Display__c, testChainActivity.BMC_Event__c, testChainActivity.BMC_POS__c, testChainActivity.BMC_Other__c, testChainActivity.BMC_Electronic_Funds_Transfer__c, testChainActivity.BMC_Program_Cost_Estimate__c); 
                Test.stopTest(); 
            }
        }
        catch(Exception e){
           // system.debug(e);
        }
    }
}