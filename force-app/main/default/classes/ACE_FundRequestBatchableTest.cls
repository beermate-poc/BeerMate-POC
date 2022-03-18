/**
 * Created by alexandria.sanborn on 2/20/2019.
 */

@isTest
private with sharing class ACE_FundRequestBatchableTest {
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

            Account portalMUAcct = [SELECT id,Name FROM Account WHERE Name='MU - AZ NV NM' LIMIT 1];

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
        }
    }

    @isTest
    private static void itShouldShareInsertedFundRequestRecordsWithCommunityUser(){
        User commShipTo1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM0' LIMIT 1];

        System.runAs(commShipTo1User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(0, fundReqShared);
        }

        System.runAs(portalUser){
            PartnerFundRequest fundRequest = ACE_TestDataFactory.createFundRequestByShipTo([SELECT id, Amount, Title,ACE_Spend_Type__c,ACE_Internal_Order__c,ACE_Co_Op_Event__c,ACE_Start_Date__c,ACE_End_Date__c, BudgetId, ChannelPartnerId FROM PartnerFundAllocation WHERE ACE_MU__c = 'MU - AZ NV NM' LIMIT 1], [select id from account where name='Ship toMU - AZ NV NM0' LIMIT 1]);
            insert fundRequest;
        }

        Test.startTest();
        Database.executeBatch(new ACE_FundRequestBatchable(), 20);
        Test.stopTest();

        System.runAs(commShipTo1User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(1, fundReqShared);
        }
    }

    @isTest
    private static void itShouldUnshareFundRequestsWhenUserIsNoLongerRelatedToShipTo(){
        User commShipTo1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM0' LIMIT 1];
        User commShipTo2User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM1' LIMIT 1];

        Account shipTo2Acct = [SELECT id FROM Account WHERE Name = 'Ship toMU - AZ NV NM1' LIMIT 1];
        Contact shipTo1Contact = [SELECT id FROM Contact WHERE Name='Ship toMU - AZ NV NM0' LIMIT 1];
        AccountContactRelation newACR = new AccountContactRelation(AccountId=shipTo2Acct.id, ContactId=shipTo1Contact.id);

        System.runAs(portalUser){
            insert newACR;
            PartnerFundRequest fundRequest1 = ACE_TestDataFactory.createFundRequestByShipTo([SELECT id, Amount, Title,ACE_Spend_Type__c,ACE_Internal_Order__c,ACE_Co_Op_Event__c,ACE_Start_Date__c,ACE_End_Date__c, BudgetId, ChannelPartnerId FROM PartnerFundAllocation WHERE ACE_MU__c = 'MU - AZ NV NM' LIMIT 1], [select id from account where name='Ship toMU - AZ NV NM0' LIMIT 1]);
            PartnerFundRequest fundRequest2 = ACE_TestDataFactory.createFundRequestByShipTo([SELECT id, Amount, Title,ACE_Spend_Type__c,ACE_Internal_Order__c,ACE_Co_Op_Event__c,ACE_Start_Date__c,ACE_End_Date__c, BudgetId, ChannelPartnerId FROM PartnerFundAllocation WHERE ACE_MU__c = 'MU - AZ NV NM' LIMIT 1], [select id from account where name='Ship toMU - AZ NV NM1' LIMIT 1]);
            insert new PartnerFundRequest[]{fundRequest1, fundRequest2};
        }

        Database.executeBatch(new ACE_FundRequestBatchable(), 20);


        System.runAs(portalUser){
            delete newACR;
        }

        Test.startTest();
        Database.executeBatch(new ACE_FundRequestBatchable(), 20);
        Test.stopTest();

        System.runAs(commShipTo1User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(1, fundReqShared);
        }
    }
    
    @isTest
    private static void itShouldShareMUFundRequests(){
        User commShipTo1User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM0' LIMIT 1];
		User commShipTo2User = [SELECT id, ContactId FROM User where ProfileId=:ACE_TestDataFactory.commUserProfile.id AND Contact.LastName='Ship toMU - AZ NV NM1' LIMIT 1];

        System.runAs(commShipTo1User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(0, fundReqShared);
        }
        
        System.runAs(commShipTo2User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(0, fundReqShared);
        }

        System.runAs(portalUser){
            PartnerFundRequest fundRequest = ACE_TestDataFactory.createFundRequestByMU([SELECT id, Amount, Title,ACE_Spend_Type__c,ACE_Internal_Order__c,ACE_Co_Op_Event__c,ACE_Start_Date__c,ACE_End_Date__c, BudgetId, ChannelPartnerId FROM PartnerFundAllocation WHERE ChannelPartner.Name = 'MU - AZ NV NM' LIMIT 1]);
            insert fundRequest;
        }
        
      
        Test.startTest();
        Database.executeBatch(new ACE_FundRequestBatchable(), 20);
        Test.stopTest();
      
        
        System.runAs(commShipTo1User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(1, fundReqShared);
        }
        
        System.runAs(commShipTo2User){
            Integer fundReqShared = [SELECT count() FROM PartnerFundRequest];
            System.assertEquals(1, fundReqShared);
        }
        
    }
}