@isTest
public class ACE_wsTest {
    private static User portalUser = ACE_TestDataFactory.createPortalUser();
    
    @testSetup
    private static void setup(){
        portalUser.ACE_Approver__c = TRUE;
        update portalUser;
        
        System.runAs(portalUser) {
        
        List<Account> mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
        insert mgmtUnits;

        List<Account> shipTos = ACE_TestDataFactory.createShipTos(2, mgmtUnits);
        insert shipTos;
        
        User user =ACE_TestDataFactory.createPortalUser();
        //insert user;

        PartnerMarketingBudget budget = ACE_TestDataFactory.createBudget(30000);
        insert budget;

        List<ACE_Internal_Order__c> internalOrders = ACE_TestDataFactory.createInternalOrders();
        insert internalOrders;

        List<Spend_Type__c> spendTypes = ACE_TestDataFactory.createSpendTypes();
        insert spendTypes;
        
        Account prtnrAcc = new Account();
        prtnrAcc.Name = 'MU - IL IA';
        insert(prtnrAcc);
        prtnrAcc.IsPartner = true;
        update(prtnrAcc);
        
        PartnerFundAllocation allocation=ACE_TestDataFactory.createPromotion(budget.Id, prtnrAcc.Id, 'MU - IL IA');
        insert allocation;
        List<PartnerFundRequest> fundRequest = ACE_TestDataFactory.createFundRequests(allocation,1);
        insert fundRequest;
        List<PartnerFundClaim> ptfList=ACE_TestDataFactory.createReimbursement(fundRequest, 1);
        insert ptfList;
        }
    }
    @isTest
    public static void testSpendType_crud(){
		
        List<ws_Spend_Type.wsSpend_Type> lstSpendTypes = new List<ws_Spend_Type.wsSpend_Type>();
        List<ws_Spend_Type.wsSpend_Type> lstSpendTypesFailed = new List<ws_Spend_Type.wsSpend_Type>();
        
        ws_Spend_Type.wsSpend_Type wst1 = new ws_Spend_Type.wsSpend_Type();
        wst1.ACESpendTypeIDc = 'tt3';
        wst1.ACEDeletionIndicatorc = true;
        wst1.ACESpendTypeDescriptionc ='test';
        wst1.ACETaxableFlag = true;
        ws_Spend_Type.wsSpend_Type wst2 = new ws_Spend_Type.wsSpend_Type();
        wst2.ACESpendTypeIDc = 'tt2';
        wst2.ACEDeletionIndicatorc = true;
        wst2.ACESpendTypeDescriptionc ='test';
        wst2.ACETaxableFlag = true;
        ws_Spend_Type.wsSpend_Type wst3 = new ws_Spend_Type.wsSpend_Type();
        wst3.ACESpendTypeIDc = 'tt2';
        wst3.ACEDeletionIndicatorc = true;
        wst3.ACESpendTypeDescriptionc ='test';
        wst3.ACETaxableFlag = true;
        lstSpendTypes.add(wst3);
        lstSpendTypes.add(wst1);
        lstSpendTypes.add(wst2);
        ws_Spend_Type.Response response3 = ws_Spend_Type.SpendType_crud(lstSpendTypes);
       // System.assertEquals(response3.StatusCode, 200);
        
        ws_Spend_Type.wsSpend_Type wst4 = new ws_Spend_Type.wsSpend_Type();
        wst4.ACESpendTypeIDc = 'tt32';
        wst4.ACEDeletionIndicatorc = true;
        wst4.ACESpendTypeDescriptionc ='test';
        wst4.ACETaxableFlag = true;
        lstSpendTypesFailed.add(wst4);
        ws_Spend_Type.Response response1 = ws_Spend_Type.SpendType_crud(lstSpendTypesFailed);
        System.assertEquals(response1.StatusCode, 200);

		lstSpendTypes.clear();
        ws_Spend_Type.wsSpend_Type wst5 = new ws_Spend_Type.wsSpend_Type();
        wst5.ACESpendTypeIDc = 'tt3';
        wst5.ACEDeletionIndicatorc = true;
        wst5.ACESpendTypeDescriptionc ='test';
        wst5.ACETaxableFlag = true;
        lstSpendTypes.add(wst5);
        ws_Spend_Type.Response response2 = ws_Spend_Type.SpendType_crud(lstSpendTypes);
        System.assertEquals(response2.StatusCode, 200);

    }
    @isTest
    public static void testwsInternalOrder(){
        List<ws_Internal_Order.wsInternal_Order> lstWSIO = new List<ws_Internal_Order.wsInternal_Order>();
        
		ws_Internal_Order.wsInternal_Order wsio = new ws_Internal_Order.wsInternal_Order();
		wsio.ACEInternalOrderTypec = 'test';
		wsio.ACEInternalOrderNumberc ='ORD1';
		lstWSIO.add(wsio);
		ws_Internal_Order.Response response1 = ws_Internal_Order.InternalOrder_crud(lstWSIO);  
        System.assertEquals(response1.StatusCode, 200);
        
        lstWSIO.clear();
        ws_Internal_Order.isThrowExceptionTest = true;
        ws_Internal_Order.wsInternal_Order wsio4 = new ws_Internal_Order.wsInternal_Order();
		wsio4.ACEInternalOrderTypec = 'test';
		wsio4.ACEInternalOrderNumberc ='ORD1';
		lstWSIO.add(wsio4);
        ws_Internal_Order.Response response4 = ws_Internal_Order.InternalOrder_crud(lstWSIO);
        
        List<ACE_Internal_Order__c> lstIO = [select id from ACE_Internal_Order__c Limit 1];
        lstIO[0].ACE_Internal_Order_Nbr__c = 'ORD1';
        update lstIO;
        ws_Internal_Order.Response response2 = ws_Internal_Order.InternalOrder_crud(lstWSIO);
        
        ws_Internal_Order.wsInternal_Order wsio1 = new ws_Internal_Order.wsInternal_Order();
		wsio1.ACEInternalOrderTypec = 'test';
		wsio1.ACEInternalOrderNumberc ='ORD1';
		lstWSIO.add(wsio1);
        ws_Internal_Order.Response response3 = ws_Internal_Order.InternalOrder_crud(lstWSIO);
        
    }
    
    @isTest
    public static void testwsSpendLimit(){
        List<ws_Spend_Limit.wsSpend_Limit> lstWsl = new List<ws_Spend_Limit.wsSpend_Limit>();
        ws_Spend_Limit.wsSpend_Limit wsl1 = new ws_Spend_Limit.wsSpend_Limit();
        wsl1.ACEPersonnelNumberc = '2350';
        wsl1.MCBCNetworkIdc = 'NET-012';
        wsl1.SpendLimitc = 10.00;
        lstWsl.add(wsl1);
        ws_Spend_Limit.Response response1 = ws_Spend_Limit.SpendLimit_crud(lstWsl);
        
        ws_Spend_Limit.wsSpend_Limit wsl2 = new ws_Spend_Limit.wsSpend_Limit();
        wsl2.ACEPersonnelNumberc = '2350';
        wsl2.MCBCNetworkIdc = 'NET-012';
        wsl2.SpendLimitc = 10.00;
        lstWsl.add(wsl2);
        ws_Spend_Limit.Response response2 = ws_Spend_Limit.SpendLimit_crud(lstWsl); 
        
        ws_Spend_Limit.wsSpend_Limit wsl3 = new ws_Spend_Limit.wsSpend_Limit();
        wsl3.ACEPersonnelNumberc = '23506';
        wsl3.MCBCNetworkIdc = '====================================================Inserting more than 50 character to generate Exception=======================================================================================================================================================================================================================';
        wsl3.SpendLimitc = 10.00;
        lstWsl.add(wsl3);
        ws_Spend_Limit.Response response3 = ws_Spend_Limit.SpendLimit_crud(lstWsl);
        
        lstWsl.clear();
        Test.startTest();
        ws_Spend_Limit.isThrowExceptionTest = true;
        ws_Spend_Limit.wsSpend_Limit wsl4 = new ws_Spend_Limit.wsSpend_Limit();
        wsl4.ACEPersonnelNumberc = '2350';
        wsl4.MCBCNetworkIdc = 'NET-012';
        wsl4.SpendLimitc = 10.00;
        lstWsl.add(wsl4);
        ws_Spend_Limit.Response response4 = ws_Spend_Limit.SpendLimit_crud(lstWsl);
        Test.stopTest();
        
        lstWsl.clear();
       /* User user =ACE_TestDataFactory.createPortalUser();
        //insert user;
        ws_Spend_Limit.isThrowExceptionTest = false;
        ws_Spend_Limit.wsSpend_Limit wsl5 = new ws_Spend_Limit.wsSpend_Limit();
        wsl5.ACEPersonnelNumberc = '2350';
        wsl5.MCBCNetworkIdc = 'NET-012';
        wsl5.SpendLimitc = 10.00;
        lstWsl.add(wsl5);
        ws_Spend_Limit.Response response5 = ws_Spend_Limit.SpendLimit_crud(lstWsl);*/
        
    }
    @isTest public static void testReimbursements_crud(){
        System.runAs(portalUser) {
                    List<ws_Reimbursements.wsReimbursements> lstReimburse = new List<ws_Reimbursements.wsReimbursements>();
        List<PartnerFundClaim> claim = [select id,ACE_Header_Record_Read__c,Related_Header_ID__c from PartnerFundClaim limit 1];
        List<PartnerFundClaim> claimLst = ACE_TestDataFactory.createLineItems(claim);
        insert claimLst;
        List<PartnerFundClaim> claimList =[select id,ACE_Header_Record_Read__c,Related_Header_ID__c from PartnerFundClaim where id =:claimLst];
        
        for(PartnerFundClaim ptf:claimList){ 
            ws_Reimbursements.wsReimbursements wsr = new ws_Reimbursements.wsReimbursements();
            wsr.ACERecordIDc = ptf.ACE_Header_Record_Read__c;
            wsr.RelatedHeaderIdc = ptf.Related_Header_ID__c;
            wsr.ACESAPBillingDocumentNumberc = '1020000024788';
            wsr.ACESAPBillingDatec = date.parse('1/01/2019');
            wsr.ShipToCustomerNbrc ='56789';
            lstReimburse.add(wsr);
        }
        ws_Reimbursements.Reimbursements_crud(lstReimburse);
        
        ws_Reimbursements.wsReimbursements wsr = new ws_Reimbursements.wsReimbursements();
        wsr.ACERecordIDc = '4567';
        wsr.RelatedHeaderIdc = claimList[0].Related_Header_ID__c;
        wsr.ACESAPBillingDocumentNumberc = '1020000024788';
        wsr.ACESAPBillingDatec = date.parse('1/01/2019');
        wsr.ShipToCustomerNbrc ='56789';
        lstReimburse.add(wsr);
        ws_Reimbursements.Reimbursements_crud(lstReimburse);
        
        //lstReimburse.clear();
        ws_Reimbursements.isThrowExceptionTest = true;
        ws_Reimbursements.wsReimbursements wsr1 = new ws_Reimbursements.wsReimbursements();
        wsr1.ACERecordIDc = claimList[0].ACE_Header_Record_Read__c;
        wsr1.RelatedHeaderIdc = claimList[0].Related_Header_ID__c;
        wsr1.ACESAPBillingDocumentNumberc = '1020000024788';
        wsr1.ACESAPBillingDatec = date.parse('1/01/2019');
        wsr1.ShipToCustomerNbrc ='56789';
        lstReimburse.add(wsr1);
        ws_Reimbursements.Reimbursements_crud(lstReimburse);
        
        lstReimburse.clear();
        Test.startTest();
        ws_Reimbursements.wsReimbursements wsr2 = new ws_Reimbursements.wsReimbursements();
        ws_Reimbursements.isThrowExceptionTest = false;
        wsr2.ACERecordIDc = claimList[0].ACE_Header_Record_Read__c;
        System.debug('rl::'+claimList[0].ACE_Header_Record_Read__c);
        wsr2.RelatedHeaderIdc = claimList[0].Related_Header_ID__c;
        System.debug('rl::'+claimList[0].Related_Header_ID__c);
        wsr2.ACESAPBillingDocumentNumberc = '1020000024788';
        wsr2.ACESAPBillingDatec = date.parse('1/01/2019');
        wsr2.ShipToCustomerNbrc ='56789';
        lstReimburse.add(wsr2);
        ws_Reimbursements.Reimbursements_crud(lstReimburse);
        Test.stopTest();
            
        }

    }
    
}