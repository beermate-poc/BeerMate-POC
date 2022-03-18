@isTest
public class ACE_approveAndReleaseTest {
    private final static User sysAdminRoleUser = ACE_TestDataFactory.getPortalUser();

    @testSetup
    private static void setup(){ 
        sysAdminRoleUser.ACE_Approver__c = TRUE;
        update sysAdminRoleUser;

        System.runAs(sysAdminRoleUser){
            Account[] mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
            insert mgmtUnits;

            Account[] shipTos = ACE_TestDataFactory.createShipTos(4, mgmtUnits);
            insert shipTos;

            PartnerMarketingBudget budget = ACE_TestDataFactory.createBudget(30000, 'MU - IL IA');
            insert budget;

            ACE_Internal_Order__c[] internalOrders = ACE_TestDataFactory.createInternalOrders();
            insert internalOrders;

            Spend_Type__c[] spendTypes = ACE_TestDataFactory.createSpendTypes();
            insert spendTypes;
            Account portalAcct = ACE_TestDataFactory.createAccount('MU - IL IA', sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id);
            insert portalAcct;
            System.debug(portalAcct);
            portalAcct.IsPartner = true;
            update portalAcct;
            Contact commContact = ACE_TestDataFactory.createContact(portalAcct.id);
            insert commContact;
            User commUser = ACE_TestDataFactory.createChannelPartner(commContact.id);
            insert commUser;
            PartnerFundAllocation promo =  ACE_TestDataFactory.createPromotion(budget.id, portalAcct.id, 'MU - IL IA');
            insert promo;
        }
    }
    
    @isTest
    private static void itShouldReturnAListOfStatesByMU(){
        PartnerFundAllocation promo = [SELECT id FROM PartnerFundAllocation];   
        ACE_ApproveandReleaseClass.initPromoAndStates wrapper = ACE_approveAndReleaseClass.getStates(promo.id);
        System.assertEquals('IL', wrapper.states[0]);
    }


    @isTest
    public static void itShouldGenerateFundRequestsFromShipToAccts(){
        PartnerFundAllocation promotion = [SELECT id, ACE_MU__c FROM PartnerFundAllocation WHERE ACE_MU__c='MU - IL IA' LIMIT 1];
        ACE_approveAndReleaseClass.FundReqWrapper fundReqs = ACE_approveAndReleaseClass.getShipTo(promotion.id, 'IL');
        System.assertEquals(4, fundReqs.fundRequests.size());
        System.assertEquals(4, fundReqs.spendTypeOptions.size());
    }

    @isTest
    public static void itShouldCreateNewFundRequests(){
        System.runAs(sysAdminRoleUser){
            Integer fundReqCount = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(0, fundReqCount);
            PartnerFundAllocation promotion = [SELECT id, ACE_MU__c FROM PartnerFundAllocation WHERE ACE_MU__c='MU - IL IA'  LIMIT 1];
            String fundReqsToCreate = ACE_TestDataFactory.updateFundRequests(promotion.id, 'IL');
            ACE_approveAndReleaseClass.createFundRequestRec(fundReqsToCreate);
            fundReqCount = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(4, fundReqCount);
        }
    }
}