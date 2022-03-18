public class ACE_FundClaimBatch implements Database.Batchable<sobject>,Database.AllowsCallouts {
    public ACE_FundClaimBatch()
    {}
    
    public Database.Querylocator start (Database.BatchableContext BC) {
        String query = 'SELECT ACE_Invoice_Number__c, ACE_Invoice_Date__c, ACE_Invoice_Description__c, ACE_Reimbursement_Status__c, ACE_Reason_Code_Disqualify__c, Reimbursement_Approver__r.Name, Account_Ship_To__r.Name,Account_Ship_To__r.AccountNumber, Account_Ship_To__r.C360_Cust_Hierarchy_Lvl3_Code__c,ACE_Debit__c, ACE_SAP_Billing_Document_Number__c, ACE_Paid_Date__c, ACE_Approval_Date__c, ACE_Submit_Date__c, Request.ACE_FY_Fund_Request_ID__c, ACE_Header_Record_ID__c, Related_Header_ID__c, ACE_Requested_Reimbursement__c,ChannelPartner.Accountnumber, ACE_Total_Expenditure__c, Title, ACE_Spend_Category__c, ACE_Vendors_Used__c, ACE_Tax_Pd__c, ACE_Comments__c, ACE_Reimbursement_Percent__c, ACE_Reason_Code__c, Internal_Order__r.ACE_Internal_Order_Nbr__c, ACE_Spend_Type__r.ACE_Spend_Type_ID__c, Line_Item__c FROM PartnerFundClaim';
        return Database.getQueryLocator(query);
    }
    
    public void execute(Database.BatchableContext bc, List<PartnerFundClaim> all){
        List<ACE_FundClaimStub.Reimbursement_element> claimList = new List<ACE_FundClaimStub.Reimbursement_element>();
        List<ACE_FundClaimStub.Response_element> response = new List<ACE_FundClaimStub.Response_element>();
        List<String> fundClaimList = new List<String>();
        try{
            for(PartnerFundClaim ptf:all){
                System.debug('all'+all.size());
                ACE_FundClaimStub.Reimbursement_element claim = new ACE_FundClaimStub.Reimbursement_element();
                claim.ACE_Invoice_Number_c = ptf.ACE_Invoice_Number__c;
                claim.ACE_Invoice_Date_c = String.valueOf(ptf.ACE_Invoice_Date__c);
                //claim.ACE_Invoice_Description_c = ptf.ACE_Invoice_Description__c;
                claim.ACE_Reimbursement_Status_c = ptf.ACE_Reimbursement_Status__c;
                claim.ACE_Reason_Code_Disqualify_c = ptf.ACE_Reason_Code_Disqualify__c;
                claim.Reimbursement_Approver_c = ptf.Reimbursement_Approver__r.Name;
                claim.Name = ptf.Account_Ship_To__r.Name;
                claim.Account_Ship_To_c_AccountNumber = ptf.Account_Ship_To__r.AccountNumber;
                claim.C360_Region_c = ptf.Account_Ship_To__r.C360_Cust_Hierarchy_Lvl3_Code__c;
                claim.PrimaryMgmtUnitDesc_c = ptf.ChannelPartner.Accountnumber;
                claim.ACE_Debit_c = String.valueOf(ptf.ACE_Debit__c);
                claim.ACE_SAP_Billing_Document_Number_c = ptf.ACE_SAP_Billing_Document_Number__c;
                claim.ACE_Billing_Date_c = String.valueOf(ptf.ACE_Paid_Date__c);
                claim.ACE_Approval_Date_c = String.valueOf(ptf.ACE_Approval_Date__c);
                claim.ACE_Submit_Date_c = String.valueOf(ptf.ACE_Submit_Date__c);
                claim.RequestId = ptf.Request.ACE_FY_Fund_Request_ID__c;
                claim.ACE_Header_Record_ID_c = String.valueOf(ptf.ACE_Header_Record_ID__c);
                claim.Related_Header_ID_c = ptf.Related_Header_ID__c;
                claim.ACE_Requested_Reimbursement_c = String.valueOf(ptf.ACE_Requested_Reimbursement__c);
                claim.ACE_Total_Expenditure_c = String.valueOf(ptf.ACE_Total_Expenditure__c);
                claim.Title = ptf.Title;
                claim.ACE_Spend_Category_c = ptf.ACE_Spend_Category__c;
                claim.ACE_Vendors_Used_c = ptf.ACE_Vendors_Used__c;
                claim.ACE_Tax_Pd_c = ptf.ACE_Tax_Pd__c;
                //claim.ACE_Comments_c = ptf.ACE_Comments__c;
                claim.ACE_Reimbursement_Percent_c = String.valueOf(ptf.ACE_Reimbursement_Percent__c);
                claim.Reason_Code = ptf.ACE_Reason_Code__c;
                claim.ACE_Internal_Order_Number_Reimb_c = ptf.Internal_Order__r.ACE_Internal_Order_Nbr__c;
                claim.ACE_Spend_Type_c = ptf.ACE_Spend_Type__r.ACE_Spend_Type_ID__c;
                claimList.add(claim);
                fundClaimList.add(ptf.Title);
            }
            System.debug('claimList.size()'+claimList.size());
            for(integer i=0;i<claimList.size();i++){
                system.debug(i+':'+claimList[i]);
            }
            
            /*Authenticate the callout*/
            ACE_FundClaimStub.HTTPS_Port stub = new ACE_FundClaimStub.HTTPS_Port();
            stub.inputHttpHeaders_x = new Map<String, String>();
            stub.inputHttpHeaders_x.put(ACE_Util_Constants.AUTHORIZATION,ACE_Util_Constants.HANA_CLAIM);
            stub.timeout_x =120000;
            /*Make callout using claimList*/
            response=stub.SI_FundReimbursement_SFDC_Sync(claimList);
            system.debug(response);
            
        }
        catch(Exception ex){
            ACE_FundClaimStub.Response_element res = new ACE_FundClaimStub.Response_element();
            res.Status = 'EXCEPTION';
            response.add(res);
            System.debug('response'+ex.getMessage());
            ErrorLog.insertLogs(fundClaimList,'ACE_FundClaimBatch','Execute',ex.getMessage(),ex.getLineNumber());
        }
    }
    public void finish(Database.BatchableContext bc){
    }
}