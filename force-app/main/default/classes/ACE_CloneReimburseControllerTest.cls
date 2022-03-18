@isTest
public class ACE_CloneReimburseControllerTest {
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
        PartnerFundClaim ptf = new PartnerFundClaim(Title='LineItem-1234',
                              /*ACE_Reimbursement_Status__c='PaymentPending',*/
                              Related_Header_ID__c=ptfList[0].ACE_Header_Record_Read__c,
                              Requestid = fundRequest[0].Id,ACE_Total_Expenditure__c = 1,Amount=1,
                              ACE_Timestamp__c = system.today(), 
                              Account_Ship_To__c=fundRequest[0].Account_Ship_To__c,                   
                              ACE_Invoice_Date__c=System.today(),Line_Item__c=true,
                              ACE_Approval_Date__c=System.Today());
        insert ptf;
        ptf.ACE_Reimbursement_Status__c = 'PaymentPending';
        update ptf;
    }
    public static testMethod void testCloneReimbursement() {
         PartnerFundClaim ptf=[select id,Request.Id,Account_Ship_To__r.Name,Request.Title,Account_Ship_To__r.Id,ACE_Line_Item_Index__c,Amount,Title,ACE_Invoice_Number__c,
                                                   ACE_Reimbursement_Status__c,ACE_Invoice_Date__c,ACE_Additional_Email_1__c,
                                                   ACE_Debit__c,ACE_Invoice_Description__c,ACE_Additional_Email_2__c,
                                                   ACE_Spend_Category__c,ACE_Total_Expenditure__c,ACE_Requested_Reimbursement__c,
                                                   ACE_Tax_Pd__c,ACE_Vendors_Used__c,ACE_Comments__c,ACE_Reason_Code__c,
                                                   ACE_Spend_Type__c,Internal_Order__c,ACE_Total_Requested_Reimbursement__c,
                                                   ACE_Approval_Date__c,ACE_Submit_Date__c,ACE_Reimbursement_Percent__c,
                                                   ACE_Header_Record_Id__c from PartnerFundclaim limit 1];
        PartnerFundClaim ptf1=[select id from PartnerFundclaim limit 1];
        Test.startTest();
        ACE_CloneReimburseController.getClaimDetails(ptf.id);
        ACE_CloneReimburseController.cloneReimbursement(ptf,ptf.Id);
        ACE_CloneReimburseController.cloneReimbursement(ptf1,ptf1.Id);
        ACE_CloneReimburseController.clonerecord(ptf,true);
        Test.stopTest();
    }
}