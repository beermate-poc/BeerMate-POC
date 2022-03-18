@isTest
private class BMC_ChainActivityTest {
    private static Final String CHAINLEVELPARENT= 'Chain Level 1 Parent' ;
    private static Final String CHAINPARENT ='Chain Parent';
    private static Final String CHILDONE ='Child1';
    private static Final String CHILDTWO ='Child2';
    private static Final String GCHILDONE ='Gchild1';
    private static Final String TESTOUTLETONE ='123456';
    private static Final String TESTOUTLETTWO ='123457';
    private static Final String TESTOUTLETC2 ='234567';
    private static Final String TESTOUTLETG1 ='345678';
    @testSetup
    private static void setup(){
        User testUser = TestDataFactory.insertUser('Sales User','testChainActivityUser','Sales Administrator');
        system.debug(testUser);
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
                BMC_Chain_Activity__c testChainActivity = TestDataFactory.createChainActivity(testParentAcct.Id, Date.newInstance(2050,12,19),Date.newInstance(2019,1,19));
            BMC_Chain_Activity__c testChainActivityTwo = TestDataFactory.createChainActivity(testParentAcctTwo.Id, Date.newInstance(2050,12,19),Date.newInstance(2019,1,19));
            Where_to_Hunt__c whereToHuntFavorite = TestDataFactory.insertWhereToHunt('Favorite List');
            Where_to_Hunt__c whereToHuntCE = TestDataFactory.insertWhereToHunt('Favorite List');
            whereToHuntCE.BMC_Source__c = 'Chain Activity-Favorite';
            whereToHuntCE.BMC_Chain_Activity_ID__c =testChainActivityTwo.id;
            update whereToHuntCE;
            Where_to_Hunt__c whereToHuntMaster = [SELECT id FROM Where_to_Hunt__c WHERE BMC_Chain_Activity_ID__c=:testChainActivity.id AND BMC_Chain_Activity_Favorite__c=false];
            Target_Account__c testOutlet1 = TestDataFactory.insertTargetAccount(whereToHuntMaster.id, testGchildAcct1.id);
            Target_Account__c testOutlet2 = TestDataFactory.insertTargetAccount(whereToHuntMaster.id, testGchildAcct2.id);
            Product__c testProduct = TestDataFactory.insertProduct('test','test','test','test');
            testProduct.BMC_OffPremisePackageCd__c='test';
            testProduct.BMC_OnPremiseContainerCd__c='test';
            testProduct.TrademarkBrandCd__c='test';
            testProduct.BMC_Seasonal_Brand_Group_Name__c = 'test';
            update testProduct;
        }
    }
    
    @isTest
    private static void itFetchesOutletsFromServer(){
        BMC_Chain_Activity__c testChainActivity = [SELECT Id, BMC_Chain_Parent_Account__c, BMC_Where_to_Hunt_List__c, (SELECT id FROM Where_to_Hunt__r WHERE BMC_Chain_Activity_Favorite__c = false) FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
        //Map<String, BMC_ChainActivityController.AccountWrapper> expectedAccts = BMC_ChainActivityController.fetchOutletsFromServer(testChainActivity.Id);
        BMC_ChainActivityController.AccountWrapper expectedAccts = BMC_ChainActivityController.fetchOutletsFromServer(testChainActivity.Id);
        List<Id> selectedAccounts= new List<Id>();
        List<Account> allAccounts= new List<Account>();
        
        Map<Id, Account> accountById = new Map<Id, Account> ([SELECT Id, recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c FROM Account WHERE Id = :testChainActivity.BMC_Chain_Parent_Account__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]);
        accountById = ACE_AccountHierarchy.getAllChildAccts(accountById, 'recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c', null,'ChainLevelNbr__c ASC');
        List<Id> selectedAcctIds = new List<Id>{};
            for(Target_Account__c targetAcct : [select id, Account_Name__c,Target_List__c from target_account__c where Target_List__r.BMC_Chain_Activity_ID__c = :testChainActivity.Id AND Target_List__r.BMC_Chain_Activity_Favorite__c = FALSE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                selectedAcctIds.add(targetAcct.Account_Name__c);            
            }  
        
        for(account acct:accountById.values()){
            if (acct.recordType.developerName <> 'Chain_Parent'){
                Boolean isSelected = selectedAcctIds.contains(acct.id);
                if(isSelected){
                    selectedAccounts.add(acct.id);
                } else {
                    allAccounts.add(acct);
                }
            }
        }
        BMC_ChainActivityController.AccountWrapper acctWrapper = new BMC_ChainActivityController.AccountWrapper(selectedAccounts,allAccounts);
        BMC_ChainActivityController.AccountWrapper caAcctWrapper = BMC_ChainActivityController.fetchOutletsFromServer(testChainActivity.Id);
        
        // system.assertEquals(acctWrapper.allAccounts.size(), caAcctWrapper.selectedAccounts.size());
        //  system.assertEquals(acctWrapper.allAccounts.size(), caAcctWrapper.allAccounts.size());
    } 
    @isTest
    private static void itFetchesOutletsFromServerException(){
        try{
            BMC_Chain_Activity__c testChainActivity = [SELECT Id, BMC_Chain_Parent_Account__c, BMC_Where_to_Hunt_List__c, (SELECT id FROM Where_to_Hunt__r WHERE BMC_Chain_Activity_Favorite__c = false) FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            //Map<String, BMC_ChainActivityController.AccountWrapper> expectedAccts = BMC_ChainActivityController.fetchOutletsFromServer('1234');
            BMC_ChainActivityController.AccountWrapper expectedAccts = BMC_ChainActivityController.fetchOutletsFromServer('1234');
        }
        catch(Exception e){
            system.debug(e);
        }
    } 
    @isTest
    private static void testCheckDuplicatWTHName(){
        Test.startTest();
        System.assertEquals(true, BMC_ChainActivityController.checkDuplicatWTHName('Favorite List'));
        Test.stopTest();
    } 
    
    @isTest
    private static void applyTargetAccountsTest(){
        BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name =: CHAINLEVELPARENT LIMIT 1]; 
        Where_to_Hunt__c genWTH = [SELECT Id FROM Where_to_Hunt__c where BMC_Chain_Activity_ID__c =: testChainActivity.Id and Name =:testChainActivity.Name and  List_Status__c  =: Constants.ACTIVE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        System.debug('testChainActivity'+testChainActivity);
        System.debug('genWTH'+genWTH);
        Test.startTest();
        BMC_ChainActivityController.applyTargetAccounts(genWTH.Id,testChainActivity.id); 
        Test.stopTest();
    }
    
    
    @isTest
    private static void testGetAccountDetails(){
        BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name =: CHAINLEVELPARENT LIMIT 1]; 
        List<String> seasonalGroupList = new List<String>();
        Test.startTest();
        BMC_ChainActivityController.ChainActivityWrapper testChainActivityWrapper = new  BMC_ChainActivityController.ChainActivityWrapper(testChainActivity,seasonalGroupList);
        Test.stopTest();
        System.assertEquals(testChainActivity,BMC_ChainActivityController.getAccountDetails(testChainActivity.Id).chainActivity);
    } 
    @isTest
    private static void testCreateChainProducts(){
        User testUser = [select Id from User where FederationIdentifier ='testChainActivityUsertest@millercoors.com' Limit 1];
        System.runAs(testUser)
        {
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
            Test.startTest();
            BMC_ChainActivityController.createChainProducts(testChainActivity.Id,'test',testProduct.id);
            Test.stopTest();
            system.assertEquals(1,[select id from BMC_Chain_Activity_Product__c].size());
        }
    } 
    @isTest
    private static void testCreateChainProductsOn(){
        User testUser = [select Id from User where FederationIdentifier ='testChainActivityUsertest@millercoors.com' Limit 1];
        System.runAs(testUser)
        {
            Account testAccount =[select Id,PremiseTypeNme__c from Account where Name = :CHAINLEVELPARENT Limit 1];
            testAccount.PremiseTypeNme__c ='Off';
            update testAccount;
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
            Test.startTest();
            BMC_ChainActivityController.createChainProducts(testChainActivity.Id,'test',testProduct.id);
            Test.stopTest();
            system.assertEquals(1,[select id from BMC_Chain_Activity_Product__c].size());
        }
    } 
    @isTest
    private static void testGetPackageNames(){		
        Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
        Test.startTest();
        System.assertEquals(1,BMC_ChainActivityController.getPackageNames('test',true).size());
        Test.stopTest();
    }
    @isTest
    private static void testGetPackageNamesOff(){		
        Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
        Test.startTest();
        System.assertEquals(1,BMC_ChainActivityController.getPackageNames('test',false).size());
        Test.stopTest();
    }
    
    @isTest
    private static void testInsertCAProduct(){	
        User testUser = [select Id from User where FederationIdentifier ='testChainActivityUsertest@millercoors.com' Limit 1];
        System.runAs(testUser)
        {
            Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            Integer sizeBefore =[select Id from BMC_Chain_Activity_Product__c].size();
            Test.startTest();
            BMC_ChainActivityController.insertCAProduct(testChainActivity.Id,'test','test',true);
            Test.stopTest();
            List<Product__c> testProducts = [select Id,BMC_OffPremisePackageCd__c,BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c from Product__c
                                             where BMC_Seasonal_Brand_Group_Name__c =: 'test' AND
                                             (OnPremisePackageDesc__c = :'test' OR BMC_OffPremisePackageDesc__c =:'test') LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ];
            Integer sizeAfter = sizeBefore + testProducts.size();
            system.assertEquals(sizeAfter, [select Id from BMC_Chain_Activity_Product__c].size());
        }
    }
    @isTest
    private static void testInsertCAProductException(){	
        try{
            Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            Integer sizeBefore =[select Id from BMC_Chain_Activity_Product__c].size();
            Test.startTest();
            BMC_ChainActivityController.insertCAProduct('1234','test','test',true);
            Test.stopTest();
        }
        catch(Exception e){
            system.debug(e);      
        } 
        
    }
    
    
    @isTest
    private static void testInsertCAProductOff(){	
        User testUser = [select Id from User where FederationIdentifier ='testChainActivityUsertest@millercoors.com' Limit 1];
        System.runAs(testUser)
        {
            Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            Integer sizeBefore =[select Id from BMC_Chain_Activity_Product__c].size();
            BMC_Chain_Activity_Product__c testCAProduct = new BMC_Chain_Activity_Product__c();
            testCAProduct.BMC_Chain_Activity_ID__c= testChainActivity.Id;
            testCAProduct.BMC_Chain_Activity_Product__c = testProduct.Id;
            insert testCAProduct;    
            Test.startTest();
            BMC_ChainActivityController.insertCAProduct(testChainActivity.Id,'test','test',false);
            Test.stopTest();
            testChainActivity.BMC_Seasonal_Brand_Group__c = 'test';
            update testChainActivity;
            BMC_ChainActivityController.insertCAProduct(testChainActivity.Id,'test','test',false);   
        }
    }
    @isTest
    private static void testInsertCAProductOn(){	
        User testUser = [select Id from User where FederationIdentifier ='testChainActivityUsertest@millercoors.com' Limit 1];
        System.runAs(testUser)
        {
            Product__c testProduct = [SELECT Id,BMC_OffPremisePackageCd__c, BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c FROM Product__c LIMIT 1];
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1]; 
            Integer sizeBefore =[select Id from BMC_Chain_Activity_Product__c].size();
            BMC_Chain_Activity_Product__c testCAProduct = new BMC_Chain_Activity_Product__c();
            testCAProduct.BMC_Chain_Activity_ID__c= testChainActivity.Id;
            testCAProduct.BMC_Chain_Activity_Product__c = testProduct.Id;
            insert testCAProduct;    
            Test.startTest();
            BMC_ChainActivityController.insertCAProduct(testChainActivity.Id,'test','test',true);
            Test.stopTest();
            testChainActivity.BMC_Seasonal_Brand_Group__c = 'test';
        }
    }
    @isTest
    private static void generateWhereToHuntListTest(){    
        BMC_Chain_Activity__c testChainActivity = [SELECT Id , Name FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name = :CHAINLEVELPARENT LIMIT 1];
        Where_to_Hunt__c genWTH = [SELECT Id FROM Where_to_Hunt__c where BMC_Chain_Activity_ID__c =: testChainActivity.Id and Name =:testChainActivity.Name and  List_Status__c  =: Constants.ACTIVE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        List<Id> targetId=new List<Id>();
        for(Target_Account__c a : [SELECT  Account_Name__c FROM Target_Account__c where Target_List__c =: genWTH.Id LIMIT 2]){
            targetId.add(a.Account_Name__c);
        }
        String expectedAcctsString = JSON.serialize(targetId);
        BMC_ChainActivityController.generateWhereToHuntList(testChainActivity.id, expectedAcctsString,true,'test'); 
        
    }
    @isTest
    private static void fetchfavoriteListTest(){   
        User testUser = [select Id from User where FederationIdentifier ='testChainActivityUsertest@millercoors.com' Limit 1];
        System.runAs(testUser)
        {
            BMC_Chain_Activity__c testChainActivity = [SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE BMC_Chain_Parent_Account__r.Name =:'CHAINLEVELPARENTTWO' LIMIT 1]; 
            User loggedinUser=[Select Id,Name,Email from User where Id=:userinfo.getuserId() limit 1];
            List<Where_to_Hunt__c> listWTH= [select id,Name,Count_Target_Accounts__c,BMC_Chain_Activity_ID__c  from Where_to_Hunt__c where BMC_Chain_Activity_ID__c=:testChainActivity.Id and BMC_Source__c = : 'Chain Activity-Favorite' and (OwnerId =: loggedinUser.Id or CreatedById =: loggedinUser.Id) ];
            system.debug(listWTH);
            System.debug(BMC_ChainActivityController.fetchfavoriteList(testChainActivity.Id));
        }
    }
    
}