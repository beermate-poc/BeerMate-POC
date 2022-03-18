/**
 * Created by alexandria.sanborn on 3/19/2019.
 */

@isTest
private with sharing class ACE_ReimbursementBatchableTest {
    private static User portalUser = ACE_TestDataFactory.getPortalUser();
    
    @testSetup
    private static void setup(){
        portalUser.ACE_Approver__c = TRUE;
        update portalUser;
        
        System.runAs(portalUser) {
            Account[] mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
            insert mgmtUnits;

            PartnerMarketingBudget budget = ACE_TestDataFactory.createBudget(30000, 'MU - AZ NV NM');
            insert budget;
            ACE_Internal_Order__c[] internalOrders = ACE_TestDataFactory.createInternalOrders();
            insert internalOrders;
            Spend_Type__c[] spendTypes = ACE_TestDataFactory.createSpendTypes();
            insert spendTypes;

            Account portalMUAcct = ACE_TestDataFactory.createAccount('MU - AZ NV NM', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id);
            insert portalMUAcct;

            Account portalGREAcct = ACE_TestDataFactory.createAccount('GRE', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id);
            insert portalGREAcct;

            Account portalDist1Acct = ACE_TestDataFactory.createAccountWithHierarchy('Dist 1', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id, portalGREAcct.id);
            Account portalDist2Acct = ACE_TestDataFactory.createAccountWithHierarchy('Dist 2', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id, portalGREAcct.id);
            Account[] distributors = new Account[]{
                    portalDist1Acct, portalDist2Acct
            };
            insert distributors;

            Account[] shipTos = ACE_TestDataFactory.createShipTosWithHierarchy(distributors.size(), mgmtUnits, distributors); //with hierarchy
            insert shipTos;

            Account[] allAccts = new Account[]{
                    portalMUAcct, portalGREAcct, portalDist1Acct, portalDist2Acct, shipTos[0], shipTos[1]
            };
            update ACE_TestDataFactory.updatePortalAccounts(allAccts);

            Contact commMUContact = ACE_TestDataFactory.createContactHierarchy(portalMUAcct.id, portalMUAcct.Name);
            Contact commGREContact = ACE_TestDataFactory.createContactHierarchy(portalGREAcct.id, portalGREAcct.Name);
            Contact commPortalDist1Contact = ACE_TestDataFactory.createContactHierarchy(portalDist1Acct.id, portalDist1Acct.Name);
            Contact commPortalDist2Contact = ACE_TestDataFactory.createContactHierarchy(portalDist2Acct.id, portalDist2Acct.Name);
            Contact commShipTo1Contact = ACE_TestDataFactory.createContactHierarchy(shipTos[0].id, shipTos[0].Name);
            Contact commShipTo2Contact = ACE_TestDataFactory.createContactHierarchy(shipTos[1].id, shipTos[1].Name);
            insert new Contact[]{
                    commMUContact, commGREContact, commPortalDist1Contact, commPortalDist2Contact, commShipTo1Contact, commShipTo2Contact
            };

            User commGREUser = ACE_TestDataFactory.createChannelPartner(commGREContact.id);
            User commDist1User = ACE_TestDataFactory.createChannelPartner(commPortalDist1Contact.id);
            User commDist2User = ACE_TestDataFactory.createChannelPartner(commPortalDist2Contact.id);
            User commShipTo1User = ACE_TestDataFactory.createChannelPartner(commShipTo1Contact.id);
            User commShipTo2User = ACE_TestDataFactory.createChannelPartner(commShipTo2Contact.id);
            insert new User[]{
                    commGREUser, commDist1User, commDist2User, commShipTo1User, commShipTo2User
            };

            PartnerFundAllocation promotion = ACE_TestDataFactory.createPromotion(budget.id, portalMUAcct.id, 'MU - AZ NV NM');
            insert promotion;

            PartnerFundRequest fundRequest = ACE_TestDataFactory.createFundRequestByShipTo([SELECT id, Amount, Title,ACE_Spend_Type__c,ACE_Internal_Order__c,ACE_Co_Op_Event__c,ACE_Start_Date__c,ACE_End_Date__c, BudgetId, ChannelPartnerId FROM PartnerFundAllocation WHERE ACE_MU__c = 'MU - AZ NV NM' LIMIT 1], [select id from account where name='Ship toMU - AZ NV NM0' LIMIT 1]);
            insert fundRequest;
        }
    }

    @isTest
    private static void itShouldShareReimbursementsWithRelatedContactsBelongingToShipTo(){
        User commShipTo1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM0' LIMIT 1];

        PartnerFundRequest[] fundReqs = [SELECT id, Title, Account_Ship_To__c FROM PartnerFundRequest];
        System.runAs(commShipTo1User){
            Integer reimbursementShared = [SELECT count() FROM PartnerFundClaim];
            System.assertEquals(0, reimbursementShared);
        }

        System.runAs(portalUser){
            PartnerFundClaim[] reimbursements = ACE_TestDataFactory.createReimbursement(fundReqs, 1);
            insert reimbursements;
        }

        Test.startTest();
        Database.executeBatch(new ACE_ReimbursementBatchable(), 20);
        Test.stopTest();

        System.runAs(commShipTo1User){
            Integer reimbursementShared = [SELECT count() FROM PartnerFundClaim];
            System.assertEquals(1, reimbursementShared);
        }

    }

    @isTest
    private static void itShouldShareReimbursementsWithRelatedContactsBelongingToShipToIfOwnerIsRemovedFromHierarchy(){
        User commShipTo1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM0' LIMIT 1];
        User commShipTo2User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM1' LIMIT 1];

        Account shipTo2Acct = [SELECT id FROM Account WHERE Name = 'Ship toMU - AZ NV NM0' LIMIT 1];
        Contact shipTo1Contact = [SELECT id FROM Contact WHERE Name='Ship toMU - AZ NV NM1' LIMIT 1];
        AccountContactRelation newACR = new AccountContactRelation(AccountId=shipTo2Acct.id, ContactId=shipTo1Contact.id);


        PartnerFundRequest[] fundReqs = [SELECT id, Title, Account_Ship_To__c FROM PartnerFundRequest];

        System.runAs(portalUser){
            insert newACR;
            PartnerFundClaim[] reimbursements = ACE_TestDataFactory.createReimbursement(fundReqs, 1);
            insert reimbursements;
        }

        Test.startTest();
        Database.executeBatch(new ACE_ReimbursementBatchable(), 20);
        Test.stopTest();

        System.runAs(commShipTo1User){
            Integer reimbursementShared = [SELECT count() FROM PartnerFundClaim];
            System.assertEquals(1, reimbursementShared);
        }

        System.runAs(commShipTo2User){
            Integer reimbursementShared = [SELECT count() FROM PartnerFundClaim];
            System.assertEquals(1, reimbursementShared);
        }

        System.runAs(portalUser){
            Contact shipTo0Contact = [SELECT id, AccountId FROM Contact WHERE Name='Ship toMU - AZ NV NM0'];
            Account randomPortalAcct = ACE_TestDataFactory.createAccountWithHierarchy('random', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.shipToAcctRecordType.id, null);
            insert randomPortalAcct;
            update ACE_TestDataFactory.updatePortalAccounts(new Account[]{randomPortalAcct});


            shipTo0Contact.AccountId=randomPortalAcct.id;
            update shipTo0Contact;
        }

        System.runAs(commShipTo2User){
            Integer reimbursementShared = [SELECT count() FROM PartnerFundClaim];
            System.assertEquals(1, reimbursementShared);
        }
    }
}