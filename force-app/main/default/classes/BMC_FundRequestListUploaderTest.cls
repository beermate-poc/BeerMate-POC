@isTest
public class BMC_FundRequestListUploaderTest {
    private static User portalUser = ACE_TestDataFactory.createPortalUser();
    public static Blob createinvalidCSVfile= ACE_TestDataFactory.createinvalidCSVfile();
    
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
    }
    
    public static testMethod void importCSVFileTest(){
        Account accShipTo = [SELECT id FROM Account where  Type='Ship-To' LIMIT 1];
        Account disAcc = [SELECT id FROM Account where  Type='Distributor' LIMIT 1];
        PartnerFundAllocation allocation = [SELECT id ,ACE_Start_Date__c,ACE_End_Date__c FROM PartnerFundAllocation LIMIT 1];
       // System.debug('allocation'+allocation);
        Blob csvFileBody= ACE_TestDataFactory.createCSV(accShipTo.id ,allocation.id,disAcc.id);
        Test.startTest();  
        BMC_FundRequestListUploader uploadlor= new BMC_FundRequestListUploader();
        uploadlor.contentFile=csvFileBody;
        uploadlor.importCSVFile();
        uploadlor.saveData();
        uploadlor.closePopup();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
    public static testMethod void createinvalidCSVfileTest() {       
        Test.startTest();        
        BMC_FundRequestListUploader uploadlor= new BMC_FundRequestListUploader();
        uploadlor.contentFile=createinvalidCSVfile;
        uploadlor.importCSVFile();
        try{
            Constants.coverExceptionScenario = true;
        }
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
        Test.stopTest();
    }
}