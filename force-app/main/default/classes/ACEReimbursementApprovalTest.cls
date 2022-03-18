@isTest
private class ACEReimbursementApprovalTest {
    private static User portalUser = ACE_TestDataFactory.createPortalUser();
    
    @testSetup
    private static void setup(){
        portalUser.ACE_Approver__c = TRUE;
        update portalUser;
        
        System.runAs(portalUser) {
            String[] muOpts = ACE_Utils.getMUOptions();
            Id recordType = ACE_Utils.getRecordtypeIdByName('');
            Account[] mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
            insert mgmtUnits;
            Account[] shipTos = ACE_TestDataFactory.createShipTos(2, mgmtUnits);
            insert shipTos;
            PartnerMarketingBudget budget = ACE_TestDataFactory.createBudget(30000, 'MU - AZ NV NM');
            insert budget;
            ACE_Internal_Order__c[] internalOrders = ACE_TestDataFactory.createInternalOrders();
            insert internalOrders;
            Spend_Type__c[] spendTypes = ACE_TestDataFactory.createSpendTypes();
            insert spendTypes;
            Account portalAcct = ACE_TestDataFactory.createAccount('MU - AZ NV NM', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id);
            insert portalAcct;
            portalAcct.IsPartner = true;
            update portalAcct;
            Contact commContact = ACE_TestDataFactory.createContact(portalAcct.id);
            insert commContact;
            User commUser = ACE_TestDataFactory.createChannelPartner(commContact.id);
            insert commUser;
            PartnerFundAllocation promotion = ACE_TestDataFactory.createPromotion(budget.id, portalAcct.id, 'MU - AZ NV NM');
            insert promotion;
            PartnerFundRequest[] fundRequests = ACE_TestDataFactory.createFundRequests(promotion, 1);
            insert fundRequests;
            PartnerFundClaim[] reimburseHeaders = ACE_TestDataFactory.createReimbursement(fundRequests, 2);
            insert reimburseHeaders;
            PartnerFundClaim[] reimburseLines = ACE_TestDataFactory.createLineItems(reimburseHeaders);
            insert reimburseLines;
            PartnerFundClaim reimbursementObj = [SELECT id, ACE_Reimbursement_Status__c, ACE_Submit_Date__c FROM PartnerFundClaim where Title=:'Approve dec 200'];
            ACE_TestDataFactory.createFile(reimbursementObj.Id);
            
        }
    }
    
    @isTest
    private static void itThrowsInternalUserErrors(){
       Test.startTest();
        PartnerFundClaim header = [SELECT id, Account_Ship_To__c, Reimbursement_Approver__c, ACE_Header_Record_Read__c  FROM PartnerFundClaim LIMIT 1];
        
        PartnerFundClaim[] lineItems = [
            SELECT id, ACE_Spend_Type__c, Internal_Order__r.ACE_Order_Status__c, Internal_Order__r.ACE_Budget_Owner__c, Internal_Order__r.ACE_MgmtUnitCd__c, ACE_Reimbursement_Percent__c, ACE_Reason_Code__c,ACE_Line_Item_Index__c
            FROM PartnerFundClaim
            WHERE Related_Header_ID__c =: header.ACE_Header_Record_Read__c AND Line_Item__c=TRUE];
        
        ACE_Internal_Order__c io = [SELECT id FROM ACE_Internal_Order__c WHERE ACE_Internal_Order_Type__c='SLMA' LIMIT 1];
        Spend_Type__c spendType = [SELECT id FROM Spend_Type__c WHERE ACE_Order_Type__c='NotSLMA' LIMIT 1];
        
        User newApprover = ACE_TestDataFactory.createACEApprover(0.00);
        insert newApprover;
        
        header.Reimbursement_Approver__c=newApprover.id;
        update header;        
        
        lineItems[0].Internal_Order__c = io.id;
        lineItems[0].ACE_Spend_Type__c = spendType.id;
        update lineItems;
        
        
        ACE_Internal_Order__c closedIO = new ACE_Internal_Order__c(id=io.id, ACE_Order_Status__c='CLSD', ACE_MgmtUnitCd__c='1233');
        update closedIO;
        
       String[] errorMessages = ACEReimbursementApproval.validate(header.id);
        Test.stopTest();
        System.assert(errorMessages.contains('User not authorized to update the Reimbursement Approver'));
        System.assert(errorMessages.contains('The Reimbursement total exceeds your approval limit. Please change Approver to your manager, add comments and save.'));
        System.assert(errorMessages.contains('Please enter spend type for the line item: 2'));
        System.assert(errorMessages.contains('Please enter internal order for the line item: 2'));
        System.assert(errorMessages.contains('Reason code must be provided if reimbursement percent is greater than 50%: 1'));
        System.assert(errorMessages.contains('Please select a valid Spend Type-IO Combination for line: 1'));
        System.assert(errorMessages.contains('Internal Order\'s Management Unit must match Customer\'s Management Unit: 1'));
        System.assert(errorMessages.contains('Selected internal order is closed. Please select open order for line item: 1'));
    }
    
    @isTest
    private static void itThrowsCommunityErrors() {
        PartnerFundClaim header = [SELECT id, RequestId, ACE_Total_Requested_Reimbursement__c FROM PartnerFundClaim LIMIT 1];
        header.ACE_Total_Requested_Reimbursement__c = 1000000000;
        header.ACE_Reimbursement_Status__c = 'PendingApprovals';
        update header;
        
        String[] errorMessages = ACEReimbursementApproval.validateCommunity(header.id);
        System.assert(errorMessages.contains('The assigned Fund Request’s allocation dollars have been exceeded. Please reach out to your region finance contact for assistance. The link to the region finance contact list is located under the Help Me tab. Thank you.'));
    }
    @isTest
    private static void itThrowsZeroCommunityErrors() {
        PartnerFundClaim header = [SELECT id, RequestId, ACE_Total_Requested_Reimbursement__c FROM PartnerFundClaim LIMIT 1];
        header.ACE_Total_Requested_Reimbursement__c = 0;
        header.ACE_Reimbursement_Status__c = 'PendingApprovals';
        update header;
        
        String[] errorMessages = ACEReimbursementApproval.validateCommunity(header.id);
        System.assert(errorMessages.contains('The total requested reimbursement is $0.00 and cannot be submitted for approval.'));
    }
    @isTest
    private static void itSubmitsForApproval(){
        PartnerFundRequest[] fundRequestOBJ = [SELECT Id from PartnerFundRequest LIMIT 1];
        PartnerFundClaim header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Submit_Date__c FROM PartnerFundClaim LIMIT 1];
        PartnerFundClaim reimbursements = [SELECT id, ACE_Reimbursement_Status__c, ACE_Submit_Date__c FROM PartnerFundClaim where Title=:'Approve dec 200'];
        ACE_TestDataFactory.createFile(reimbursements.Id);
        Test.startTest();
        ACEReimbursementApproval.SendApproval(reimbursements.id);
        ContentDocumentLink cdl = [SELECT Id, ContentDocumentId FROM ContentDocumentLink where LinkedEntityId =:reimbursements.id LIMIT 1];
        ContentVersion contentVersion=[select Id,C360_Do_Not_Delete__c from ContentVersion  where ContentDocumentId  =:  cdl.ContentDocumentId ];
        Test.stopTest();
        System.assertEquals('Open', header.ACE_Reimbursement_Status__c);
        System.assertEquals(null, header.ACE_Submit_Date__c);
        header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Submit_Date__c FROM PartnerFundClaim LIMIT 1];
        System.assertEquals('PendingApprovals', header.ACE_Reimbursement_Status__c);
        System.assertNotEquals(null, header.ACE_Submit_Date__c);
        System.assertEquals(true, contentVersion.C360_Do_Not_Delete__c);
    }
    
    @isTest
    private static void itApprovesReimbursementAndLineItems(){
        Test.startTest();
        PartnerFundClaim header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        System.assertEquals('Open', header.ACE_Reimbursement_Status__c);
        System.assertEquals(null, header.ACE_Approval_Date__c);
        ACEReimbursementApproval.ApproveRecord(header.id);
        header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        Test.stopTest();
        System.assertEquals('Approved', header.ACE_Reimbursement_Status__c);
        System.assertNotEquals(null, header.ACE_Approval_Date__c);
        
    }
    
    @isTest
    private static void itNeedsInfoReimbursementAndLineItems(){
        PartnerFundClaim header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        
        ACEReimbursementApproval.needInfoReimbursementAndLines(header.id, 'comments');
        header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c, ACE_Comments__c FROM PartnerFundClaim LIMIT 1];
        System.assertEquals('AwaitingAdditionalData', header.ACE_Reimbursement_Status__c);
        System.assertEquals('comments', header.ACE_Comments__c);
        System.assertEquals(null, header.ACE_Approval_Date__c);
        
    }
    
    @isTest
    private static void itDeniesReimbursementAndLineItems(){
        PartnerFundClaim header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        
        ACEReimbursementApproval.denyReimbursementAndLines(header.id, 'comments');
        header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c, ACE_Comments__c FROM PartnerFundClaim LIMIT 1];
        System.assertEquals('Denied', header.ACE_Reimbursement_Status__c);
        System.assertEquals('comments', header.ACE_Comments__c);
        System.assertEquals(null, header.ACE_Approval_Date__c);
    }
    
    @isTest
    private static void itRecallsReimbursementAndLineItems(){
        PartnerFundClaim header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        ACEReimbursementApproval.ApproveRecord(header.id);
        header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        System.assertEquals('Approved', header.ACE_Reimbursement_Status__c);
        System.assertNotEquals(null, header.ACE_Approval_Date__c);
        
        ACEReimbursementApproval.recallReimbursementAndLines(header.id);
        header = [SELECT id, ACE_Reimbursement_Status__c, ACE_Approval_Date__c FROM PartnerFundClaim LIMIT 1];
        System.assertEquals('PendingApprovals', header.ACE_Reimbursement_Status__c);
        System.assertEquals(null, header.ACE_Approval_Date__c);
        
    }
}