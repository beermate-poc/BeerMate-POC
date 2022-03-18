@isTest
/* Test Class for Uk batch to stamp product id's on Account based on Buying list*/
private class C360_AccountProductList_UK_Test {

    /**
  *  @author        Accenture
  *  @Date          04/12/2018
  *  @Description   Provides the test data for C360_AccountProductList_UK class for positive scenarios.  
  *  @name          testCreateObjective
  */
    private static testmethod void testAccountProduct(){
        Id RecordTypeIdAccount = Schema.SObjectType.Account.getRecordTypeInfosByName().get('UK/I Account').getRecordTypeId();
       // List<Account> acclist = new List<Account>();
        Account pacc =C360_Util_TestDataCreation.createAccount('parent Account');
        pacc.C360_Sales_Organization__c='3600';
        pacc.RecordTypeId=RecordTypeIdAccount;
        pacc.C360_Buying_List__c='T001';
        database.insert(pacc);
        Account acc =C360_Util_TestDataCreation.createAccount('Child Account');
        acc.C360_Sales_Organization__c='3600';
        acc.RecordTypeId=RecordTypeIdAccount;
        acc.C360_Buying_List__c='T001';
        database.insert(acc);
        List<Product2>pdtlist = new List<Product2>();
        Product2 pdt =C360_Util_TestDataCreation.createProduct();
        pdtlist.add(pdt);
         database.insert(pdtlist);
        List<C360_AccountProducts__c>acpdtlsit = new List<C360_AccountProducts__c>();
        C360_AccountProducts__c pacpdt = C360_Util_TestDataCreation.createAccountProducts('TestAccountProductparent',pacc,pdtlist[0]);
        C360_AccountProducts__c acpdt = C360_Util_TestDataCreation.createAccountProducts('TestAccountProduct',acc,pdtlist[0]);
        acpdtlsit.add(pacpdt);
        acpdtlsit.add(acpdt);       
        database.insert(acpdtlsit);
        Test.startTest();
        C360_AccountProductList_UK cap = new C360_AccountProductList_UK();
        cap.execute(null);
        Test.stopTest();
        List<Account> accrec = [select C360_Product_List_prim__c from  Account where id=:acc.id limit 1];
        //System.assertNotEquals(null,accrec[0].C360_Product_List_prim__c);
    }
    
    
    
      /**
  *  @author        Accenture
  *  @Date          04/12/2018
  *  @Description   Provides the test data for C360_AccountProductList_UK_WID   
  *  @name          testCreateObjective
  */
    private static testmethod void testAccountProductUKWID(){
        Id RecordTypeIdAccount = Schema.SObjectType.Account.getRecordTypeInfosByName().get('UK/I Account').getRecordTypeId();
       // List<Account> acclist = new List<Account>();
        Account pacc =C360_Util_TestDataCreation.createAccount('parent Account');
        pacc.C360_Sales_Organization__c='3600';
        pacc.RecordTypeId=RecordTypeIdAccount;
        pacc.C360_Buying_List__c='BL33';
        database.insert(pacc);
        Account acc =C360_Util_TestDataCreation.createAccount('Child Account');
        acc.C360_Sales_Organization__c='3600';
        acc.RecordTypeId=RecordTypeIdAccount;
        acc.C360_Buying_List__c='BL33';
        database.insert(acc);
        List<Product2>pdtlist = new List<Product2>();
        Product2 pdt =C360_Util_TestDataCreation.createProduct();
        pdtlist.add(pdt);
         database.insert(pdtlist);
        List<C360_AccountProducts__c>acpdtlsit = new List<C360_AccountProducts__c>();
        C360_AccountProducts__c pacpdt = C360_Util_TestDataCreation.createAccountProducts('TestAccountProductparent',pacc,pdtlist[0]);
        pacpdt.C360_BuyingListId__c='BL33';
        C360_AccountProducts__c acpdt = C360_Util_TestDataCreation.createAccountProducts('TestAccountProduct',acc,pdtlist[0]);
        acpdt.C360_BuyingListId__c='BL33';
        acpdtlsit.add(pacpdt);
        acpdtlsit.add(acpdt);       
        database.insert(acpdtlsit);
        List<String> buylist = new List<String>();
        buylist.add(acc.C360_Buying_List__c);
        Test.startTest();
            C360_AccountProductList_UK_WID cap = new C360_AccountProductList_UK_WID(buylist);
             Database.executeBatch(cap);
        Test.stopTest();
        List<Account> accrec = [select C360_Product_List_prim__c from  Account where id=:acc.id limit 1];
       // System.assertNotEquals(null,accrec[0].C360_Product_List_prim__c);
        
    }
}