@isTest(SeeAllData=false)
private class C360_AccountProductList_CA_Test {

    /**
  *  @author        Accenture
  *  @Date          04/12/2018
  *  @Description   Provides the test data for C360_FetchUserDetails class for positive scenarios.  
  *  @name          testCreateObjective
  */
 
    private static testmethod void testAccountProductCA(){
        Id RecordTypeIdAccount = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Canada Account').getRecordTypeId();
        Account pacc =C360_Util_TestDataCreation.createAccount('parent Account');
        pacc.C360_Sales_Organization__c='0010';
        pacc.RecordTypeId=RecordTypeIdAccount;
        pacc.BILLINGSTATE='Quebec';
        database.insert(pacc);
        Account acc =C360_Util_TestDataCreation.createAccount('Child Account');
        acc.C360_Sales_Organization__c='0010';
        acc.RecordTypeId=RecordTypeIdAccount;
        acc.ParentId=pacc.Id;
        acc.BILLINGSTATE='Quebec';
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
       C360_AccountProductList_CA cap = new C360_AccountProductList_CA();
       Database.executebatch(cap,2);
        Test.stopTest();
        List<Account>acct = [Select Id,C360_Product_List_prim__c from account where id=:acc.id];
        System.assertNotEquals(null,acct[0].C360_Product_List_prim__c);
    }
    
    private static testmethod void schedulemethod(){
        Id RecordTypeIdAccount = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Canada Account').getRecordTypeId();
        Account pacc =C360_Util_TestDataCreation.createAccount('parent Account');
        pacc.C360_Sales_Organization__c='0010';
        pacc.RecordTypeId=RecordTypeIdAccount;
        pacc.BILLINGSTATE='Quebec';
        database.insert(pacc);
        Account acc =C360_Util_TestDataCreation.createAccount('Child Account');
        acc.C360_Sales_Organization__c='0010';
        acc.RecordTypeId=RecordTypeIdAccount;
        acc.ParentId=pacc.Id;
        acc.BILLINGSTATE='Quebec';
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
        Datetime dt = Datetime.now().addMinutes(1);
        String CRON_EXP = '0 '+ dt.minute() + ' * ' + dt.day() + ' ' + dt.month() + ' ? ' + dt.year();
        String jobid =System.Schedule('Sample_Heading', CRON_EXP, new C360_AccountProductList_CA () );  
        Test.stopTest();
        System.assertNotEquals(null,jobid);
    }
    
    private static testmethod void testAccountProducctCAWID(){
        Id RecordTypeIdAccount = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Canada Account').getRecordTypeId();
        Account pacc =C360_Util_TestDataCreation.createAccount('parent Account');
        pacc.C360_Sales_Organization__c='0010';
        pacc.RecordTypeId=RecordTypeIdAccount;
        pacc.BILLINGSTATE='Quebec';
        database.insert(pacc);
        Account acc =C360_Util_TestDataCreation.createAccount('Child Account');
        acc.C360_Sales_Organization__c='0010';
        acc.RecordTypeId=RecordTypeIdAccount;
        acc.ParentId=pacc.Id;
        acc.BILLINGSTATE='Quebec';
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
        List<String> accid= new List<String>();
        accid.add(acc.id);
        C360_AccountProductList_CA_WID cap = new C360_AccountProductList_CA_WID(accid);
        Database.executebatch(cap);
        
        Test.stopTest();
        List<Account>acct = [Select Id,C360_Product_List_prim__c from account where id=:acc.id];
        System.assertNotEquals(null,acct[0].C360_Product_List_prim__c);
    }
}