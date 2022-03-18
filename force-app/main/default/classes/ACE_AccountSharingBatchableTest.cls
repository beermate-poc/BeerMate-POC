/**
 * Created by alexandria.sanborn on 2/22/2019.
 */

@isTest
private class ACE_AccountSharingBatchableTest {
    private static User portalUser = ACE_TestDataFactory.getPortalUser();
    
    @testSetup
    private static void setup(){
        portalUser.ACE_Approver__c = TRUE;
        update portalUser;
        
        System.runAs(portalUser) {
            Account[] mgmtUnits = ACE_TestDataFactory.createMUCustLvl4Links();
            insert mgmtUnits;

            PartnerMarketingBudget budget = ACE_TestDataFactory.createBudget(30000, 'MU - IL IA');
            insert budget;
            ACE_Internal_Order__c[] internalOrders = ACE_TestDataFactory.createInternalOrders();
            insert internalOrders;
            Spend_Type__c[] spendTypes = ACE_TestDataFactory.createSpendTypes();
            insert spendTypes;
            Account portalMUAcct = ACE_TestDataFactory.createAccount('MU - IL IA', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id);
            insert portalMUAcct;

            Account portalGREAcct= ACE_TestDataFactory.createAccount('GRE', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.hierarchyAcctRecordType.id);
            insert portalGREAcct;

            Account portalDist1Acct= ACE_TestDataFactory.createAccountWithHierarchy('Dist 1', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id, portalGREAcct.id);
            Account portalDist2Acct= ACE_TestDataFactory.createAccountWithHierarchy('Dist 2', ACE_TestDataFactory.sysAdminRoleUser.id, ACE_TestDataFactory.distAcctRecordType.id, portalGREAcct.id);
            Account[] distributors = new Account[]{portalDist1Acct, portalDist2Acct};
            insert distributors;

            Account[] shipTos = ACE_TestDataFactory.createShipTosWithHierarchy(distributors.size(), mgmtUnits, distributors); //with hierarchy
            insert shipTos;

            Account[] allAccts = new Account[]{portalMUAcct, portalGREAcct, portalDist1Acct, portalDist2Acct, shipTos[0], shipTos[1]};
            update ACE_TestDataFactory.updatePortalAccounts(allAccts);

            Contact commMUContact = ACE_TestDataFactory.createContactHierarchy(portalMUAcct.id, portalMUAcct.Name);
            Contact commGREContact = ACE_TestDataFactory.createContactHierarchy(portalGREAcct.id, portalGREAcct.Name);
            Contact commPortalDist1Contact = ACE_TestDataFactory.createContactHierarchy(portalDist1Acct.id, portalDist1Acct.Name);
            Contact commPortalDist2Contact = ACE_TestDataFactory.createContactHierarchy(portalDist2Acct.id, portalDist2Acct.Name);
            Contact commShipTo1Contact = ACE_TestDataFactory.createContactHierarchy(shipTos[0].id, shipTos[0].Name);
            Contact commShipTo2Contact = ACE_TestDataFactory.createContactHierarchy(shipTos[1].id, shipTos[1].Name);
            insert new Contact[]{commMUContact, commGREContact, commPortalDist1Contact, commPortalDist2Contact, commShipTo1Contact, commShipTo2Contact};
			AccountContactRelation accCon = new AccountContactRelation(AccountId = shipTos[0].id,Contactid =commPortalDist2Contact.id);
            insert accCon;
            User commMUUser = ACE_TestDataFactory.createChannelPartner(commMUContact.id);
            User commGREUser = ACE_TestDataFactory.createChannelPartner(commGREContact.id);
            User commDist1User = ACE_TestDataFactory.createChannelPartner(commPortalDist1Contact.id);
            User commDist2User = ACE_TestDataFactory.createChannelPartner(commPortalDist2Contact.id);
            User commShipTo1User = ACE_TestDataFactory.createChannelPartner(commShipTo1Contact.id);
            User commShipTo2User = ACE_TestDataFactory.createChannelPartner(commShipTo2Contact.id);
            insert new User[]{commMUUser, commGREUser, commDist1User, commDist2User, commShipTo1User, commShipTo2User};

            PartnerFundAllocation promotion = ACE_TestDataFactory.createPromotion(budget.id, portalMUAcct.id, 'MU - IL IA');
            insert promotion;
            PartnerFundRequest[] fundRequests = ACE_TestDataFactory.createFundRequests(promotion, 1);
            insert fundRequests;
        }
    }

    @isTest
    private static void itShouldCreateAccountContactRelationshipsAndShareAccountsWithCommunityUsersInHierarchy(){
        User commGREUser = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='GRE' LIMIT 1];
        User commDist1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Dist 1' LIMIT 1];
        User commDist2User  = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Dist 2' LIMIT 1];
        User commShipTo1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='MU - IL IA' LIMIT 1];

        Test.startTest();
        Database.executeBatch(new ACE_AccountSharingBatchable(), 20);
        Test.stopTest();
		/*
        Integer accountContactRelationsGRE = [SELECT count() FROM AccountContactRelation WHERE Contact.LastName='GRE'];
        //System.assertEquals(21, accountContactRelationsGRE);

        Integer accountContactRelationsDist1 = [SELECT count() FROM AccountContactRelation WHERE Contact.Name='Dist 1'];
        //System.assertEquals(10, accountContactRelationsDist1);

        Integer accountContactRelationsShipTo = [SELECT count() FROM AccountContactRelation WHERE Contact.Name='Ship toMU - AZ LAS VEGAS AND NM0'];
        //System.assertEquals(3, accountContactRelationsShipTo);

        System.runAs(commGREUser){
            Integer accountsShared = [SELECT count() FROM Account];
            //System.assertEquals(19, accountsShared);
            
            Contact dist1 = [SELECT id, AccountId FROM Contact WHERE name = 'Dist 1' LIMIT 1];
            Account shipTo = [SELECT id FROM Account WHERE name='Ship toMU - IL IA0' LIMIT 1];
            
            dist1.AccountId=shipTo.id;
           // update dist1;
        }

        System.runAs(commDist1User){
            Integer accountsShared = [SELECT count() FROM Account];
            //System.assertEquals(10, accountsShared);
        }

        System.runAs(commShipTo1User){
            Integer accountsShared = [SELECT count() FROM Account];
            //System.assertEquals(3, accountsShared);
        }*/
    }
}