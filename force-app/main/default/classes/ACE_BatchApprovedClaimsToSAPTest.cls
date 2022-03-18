@isTest
public class ACE_BatchApprovedClaimsToSAPTest {
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
                              //ACE_Reimbursement_Status__c='PaymentPending',
                              Related_Header_ID__c=ptfList[0].ACE_Header_Record_Read__c,
                              Requestid = fundRequest[0].Id,ACE_Total_Expenditure__c = 1,Amount=1,
                              ACE_Timestamp__c = system.today(), 
                              Account_Ship_To__c=fundRequest[0].Account_Ship_To__c,                   
                              ACE_Invoice_Date__c=System.today(),Line_Item__c=true,
                              ACE_Approval_Date__c=System.Today());
        insert ptf;
        ptf.ACE_Reimbursement_Status__c='PaymentPending';
        update ptf;
    }
    public static testMethod void testBatchClaims() {
        List<PartnerFundClaim> ptfList=[select id,Related_Header_ID__c,Internal_Order__r.ACE_Brand_Cd__c,ACE_Total_Requested_Reimbursement_Read__c,
                                                Line_Item__c,Internal_Order__r.Brand_WC__c,Account_Ship_To__r.AccountNumber,Request.ACE_FY_Fund_Request_ID__c,Allocation.ACE_FY_Promotion_ID__c,
                                                ACE_Header_Record_Read__c,Title,ACE_Invoice_Number__c,Internal_Order__r.ACE_Internal_Order_Nbr__c,ACE_Spend_Type__r.ACE_Spend_Type_ID__c,/*ACE_Brand__r.ACE_Profit_Center_ID__c*/
                                                ACE_Requested_Reimbursement__c,ACE_Approval_Date__c,ACE_Tax_Pd__c,ACE_Invoice_Date__c from PartnerFundClaim limit 1];//ACE_TestDataFactory.createReimbursement(fundRequest, 1);
        ACE_BatchApprovedClaimsToSAP AU = new ACE_BatchApprovedClaimsToSAP();
        ACE_BatchApprovedClaimsToSAP AUB = new ACE_BatchApprovedClaimsToSAP(system.today()-1);
        Database.BatchableContext BC;
        Database.BatchableContext BCB;
        Test.startTest();
        Test.setMock(WebServiceMock.class, new ACE_TestApproveWebServiceMock());
        AU.execute(BC, ptfList);
        AU.finish(BC);
        AUB.execute(BCB, ptfList);
        AUB.finish(BCB);
        Test.stopTest();
        
    }
    public static testMethod void testScheduleClaims(){
        Test.StartTest();
        ACE_ScheduleClaimsToSAP shedule = new ACE_ScheduleClaimsToSAP();
        String sch = '0 0 23 * * ?'; 
        system.schedule('Test approval claims schdular', sch, shedule); 
        Test.stopTest(); 
        //ACE_Utils.getRecordtypeIdByName('Distributor');
    }
    
    public static testMethod void testprocessClaims(){
        List<PartnerFundClaim> ptfList=[select id,Related_Header_ID__c,Internal_Order__r.ACE_Brand_Cd__c,ACE_Total_Requested_Reimbursement_Read__c,
                                                Line_Item__c,Internal_Order__r.Brand_WC__c,Account_Ship_To__r.AccountNumber,Request.ACE_FY_Fund_Request_ID__c,Allocation.ACE_FY_Promotion_ID__c,
                                                ACE_Header_Record_Read__c,Title,ACE_Invoice_Number__c,Internal_Order__r.ACE_Internal_Order_Nbr__c,ACE_Spend_Type__r.ACE_Spend_Type_ID__c,/*ACE_Brand__r.ACE_Profit_Center_ID__c,*/
                                                ACE_Requested_Reimbursement__c,ACE_Approval_Date__c,ACE_Tax_Pd__c,ACE_Invoice_Date__c from PartnerFundClaim limit 5];
        Test.startTest();
        ACE_ClaimsProcessHandlerSAP.getClaimProcessDetails();
        ACE_ClaimsProcessHandlerSAP.sendClaimsNormal('2018-12-25T18:30:00.000Z');
        ACE_ClaimsProcessHandlerSAP.sendClaimsToSAP(ptfList);
        List<PartnerFundClaim> lst = ACE_ClaimsProcessHandlerSAP.getClaims('Test','test','Test','2018-12-25 18:30:00.000Z','2018-12-25T18:30:00.000Z','Test');
        ACE_ClaimsProcessHandlerSAP.sendClaimsOnRepeat(ptfList);
        Integer count = ACE_ClaimsProcessHandlerSAP.getTotalClaims(ptfList);
        System.assertEquals(count, 2);
        Test.stopTest();
    }
    
}