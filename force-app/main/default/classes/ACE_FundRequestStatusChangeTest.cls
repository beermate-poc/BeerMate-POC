/**
@Author Accenture
@name ACE_FundRequestStatusChangeTest
@CreateDate  05/08/2019
@Description Includes methods for testing ACE_FundRequestStatusChange.
@Version <1.0>
*/
@isTest(SeeAllData= false)
public class ACE_FundRequestStatusChangeTest {
    /**
*  @description: Method for initialDataSetup. 
*  @name: initialDataSetup
*  @param: null
*  @return: null
*/ 
    @testSetup
    private static void setup(){
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
    }
    /**
@Author Accenture
@name getFundRequestRecordsTest
@CreateDate  05/08/2019
@Description Method tests the getFundRequestRecords method.
*/
    @isTest
    private static void getFundRequestRecordsTest(){
      // PartnerFundAllocation testpromotion = [SELECT id FROM PartnerFundAllocation];
        List<Account> testaccount = [SELECT id FROM Account];
        Date startDate = Date.parse('10/5/2018');
        Date endDate = Date.parse('10/31/2019');
        List<PartnerFundRequest>  fundrequest = [Select id from PartnerFundRequest];
        ACE_FundRequestStatusChange.displayFundRequestRecords(testaccount[0].id ,null,startDate ,endDate,null);
        ACE_FundRequestStatusChange.displayFundRequestRecords(null ,null,startDate ,endDate,null);
        //ACE_FundRequestStatusChange.processFundRequestRecords(fundrequest);
    }
    
}