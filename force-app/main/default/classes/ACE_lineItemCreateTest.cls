/********************************************************************************************************************************************************************************************
# Class Name  = "ACE_lineItemCreateTest"
# Author      = Maneesha Gudisay
# Date : Jan 04 2019
# Description = This Class Covers All the methods/functions of ACE_lineItemCreate.
**************************************************************************************************************************************************/

@isTest
public class ACE_lineItemCreateTest {
    private static User portalUser = ACE_TestDataFactory.createPortalUser();
    
    @testSetup
    public static void setup(){
        portalUser.ACE_Approver__c = TRUE;
        update portalUser;
        
        System.runAs(portalUser) {
            Account[] mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
            insert mgmtUnits;
            Account[] shipTos = ACE_TestDataFactory.createShipTos(2, mgmtUnits);
            insert shipTos;
            PartnerMarketingBudget budget = ACE_TestDataFactory.createBudget(30000, 'MU - IL IA');
            insert budget;
            ACE_Internal_Order__c[] internalOrders = ACE_TestDataFactory.createInternalOrders();
            insert internalOrders;
            Spend_Type__c[] spendTypes = ACE_TestDataFactory.createSpendTypes();
            insert spendTypes;
            Account portalAcct = ACE_TestDataFactory.createAccount('MU - IL IA', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id);
            insert portalAcct;
            portalAcct.IsPartner = true;
            update portalAcct;
            Contact commContact = ACE_TestDataFactory.createContact(portalAcct.id);
            insert commContact;
            User commUser = ACE_TestDataFactory.createChannelPartner(commContact.id);
            insert commUser;
            PartnerFundAllocation promotion = ACE_TestDataFactory.createPromotion(budget.id, portalAcct.id, 'MU - IL IA');
            insert promotion;
            PartnerFundRequest[] fundRequests = ACE_TestDataFactory.createFundRequests(promotion, 1);
            insert fundRequests;
            PartnerFundClaim[] reimburseHeaders = ACE_TestDataFactory.createReimbursement(fundRequests, 1);
            insert reimburseHeaders;
        }
    }
     /*
     * @description: This method runs test coverage for createLineItemServer
     * */
   
    public static testMethod void testCreateLineItemServer()
    {
        System.runAs(portalUser){
            PartnerFundClaim reimbursement=[SELECT Id, title,ACE_Header_Record_Read__c,ACE_Reimbursement_Status__c from PartnerFundClaim Limit 1];
            ACE_LineItemCreate.createLineItemServer(reimbursement.Id, 'titleTest', 'Beer Samples', '1', 'Yes', 'True', 'Comments', 'VendorsUsed','2');
            system.assertEquals(1, [select Title from PartnerFundClaim where Title=: 'titleTest'].size());
        }
    }  
     /*
     * @description: This method runs test coverage for getSpendCategoryValues
     */
    public static testMethod void testGetSpendCategoryValues()
    {
        System.runAs(portalUser){
            PartnerFundClaim reimbursement=[SELECT Id, title,ACE_Header_Record_Read__c,ACE_Reimbursement_Status__c from PartnerFundClaim Limit 1];
            List<String> spendCategoryValues=new List<String>{'Co-op Event', 'Incentive','General Tactical','Mtgs/Entmt', 'Truck Decals','Beer Samples'};
            system.assertEquals(ACE_LineItemCreate.getSpendCategoryValues(),spendCategoryValues); 
        }
    }
     /*
     * @description: This method runs test coverage for getTaxPaidValues
     */
    public static testMethod void testGetTaxPaidValues() {
            List<String> taxPaidValue=new List<String>{ 'Yes','No'};
                system.assertEquals(ACE_LineItemCreate.getTaxPaidValues(),taxPaidValue);
    }
   /*
     * @description: This method runs test coverage for getLineItemIndex
     */
    public static testMethod void testGetLineItemIndex()
    {
            PartnerFundClaim reimbursement=[SELECT Id, title,ACE_Header_Record_Read__c,ACE_Reimbursement_Status__c from PartnerFundClaim Limit 1];
            system.assertEquals(ACE_LineItemCreate.getLineItemIndex(reimbursement.Id),1);

    }
    
    public static testMethod void testisReimbursementEditable()
    {
            PartnerFundClaim reimbursement=[SELECT Id, title,ACE_Header_Record_Read__c,ACE_Reimbursement_Status__c from PartnerFundClaim Limit 1];
        	system.assertEquals(ACE_LineItemCreate.isReimbursementEditable(reimbursement.Id),true);
        	reimbursement.ACE_Reimbursement_Status__c='PendingApprovals';
        	update reimbursement;
            system.assertEquals(ACE_LineItemCreate.isReimbursementEditable(reimbursement.Id),false);

    }
    
    
}