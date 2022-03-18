@isTest
public class ACE_FundClaimBatchTest {
    @testSetup
    public static void testDataSetup(){
        User user =ACE_TestDataFactory.createPortalUser();
        //insert user;
        PartnerMarketingBudget appSpend = ACE_TestDataFactory.createBudget(50);
        insert appSpend;
        
        Account prtnrAcc = new Account();
        prtnrAcc.Name = 'MU - IL IA';
        insert(prtnrAcc);
        prtnrAcc.IsPartner = true;
        update(prtnrAcc);
        
        List<Account> mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
        insert mgmtUnits;
        List<Account> shipToAcc;
        system.runAs(user){ 
            shipToAcc = ACE_TestDataFactory.createShipTos(1,mgmtUnits);
            insert shipToAcc;
        }
        PartnerFundAllocation allocation=ACE_TestDataFactory.createPromotion(appSpend.Id, prtnrAcc.Id, 'MU - IL IA');
        insert allocation;
         List<PartnerFundRequest> fundRequest = ACE_TestDataFactory.createFundRequests(allocation,1);
        insert fundRequest;
        List<PartnerFundClaim> ptfList=ACE_TestDataFactory.createReimbursement(fundRequest, 1);
        insert ptfList;
    }
    public static  testMethod void executeTest(){
        List<PartnerFundClaim> claimList = [SELECT ACE_Invoice_Number__c, ACE_Invoice_Date__c, ACE_Invoice_Description__c, ACE_Reimbursement_Status__c, ACE_Reason_Code_Disqualify__c, Reimbursement_Approver__r.Name, Account_Ship_To__r.Name,Account_Ship_To__r.AccountNumber, Account_Ship_To__r.C360_Cust_Hierarchy_Lvl3_Code__c,ACE_Debit__c, ACE_SAP_Billing_Document_Number__c, ACE_Paid_Date__c, ACE_Approval_Date__c, ACE_Submit_Date__c, Request.ACE_FY_Fund_Request_ID__c, ACE_Header_Record_ID__c, Related_Header_ID__c, ACE_Requested_Reimbursement__c,ChannelPartner.Accountnumber, ACE_Total_Expenditure__c, Title, ACE_Spend_Category__c, ACE_Vendors_Used__c, ACE_Tax_Pd__c, ACE_Comments__c, ACE_Reimbursement_Percent__c, ACE_Reason_Code__c, Internal_Order__r.ACE_Internal_Order_Nbr__c, ACE_Spend_Type__r.ACE_Spend_Type_ID__c, Line_Item__c FROM PartnerFundClaim];
        System.debug('claimList'+claimList.size());
        ACE_FundClaimBatch BFC = new ACE_FundClaimBatch();
        Database.BatchableContext BC; 
        Test.startTest();
        Test.setMock(WebServiceMock.class, new ACE_TestClaimWebServiceMock());
        BFC.execute(BC, claimList);
        BFC.finish(BC);
        Test.stopTest();
    }
}