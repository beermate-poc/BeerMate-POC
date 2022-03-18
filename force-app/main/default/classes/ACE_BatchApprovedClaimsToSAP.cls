/**
  * @author        Accenture 
  * @Created date  12/12/2018
  * @description   Handles Batch Processing of reimbursement claims to SAP.
  * @Version       1.0
**/
global without sharing class ACE_BatchApprovedClaimsToSAP implements  Database.Batchable<sobject>,Database.AllowsCallouts {
    
    global static boolean isBatchLimit = false;
    global static boolean batchSize = false;
    global static string query;
    global dateTime startDate;
    public ACE_BatchApprovedClaimsToSAP(DateTime startDate){
        this.startDate = startDate;
        System.debug('strtDate:'+startDate);
    }
    public ACE_BatchApprovedClaimsToSAP()
    {}
    global Database.Querylocator start (Database.BatchableContext BC) {
        
        query = 'SELECT id,Related_Header_ID__c,ACE_Total_Requested_Reimbursement_Read__c,Internal_Order__r.Brand_WC__c,Internal_Order__r.ACE_Brand_Cd__c,'+
            'Line_Item__c,Account_Ship_To__r.AccountNumber,Request.ACE_FY_Fund_Request_ID__c,Allocation.ACE_FY_Promotion_ID__c,'+  
            'ACE_Header_Record_Read__c,Title,ACE_Invoice_Number__c,Internal_Order__r.ACE_Internal_Order_Nbr__c,ACE_Spend_Type__r.ACE_Spend_Type_ID__c,'+
            'ACE_Requested_Reimbursement__c,ACE_Approval_Date__c,ACE_Tax_Pd__c,ACE_Invoice_Date__c FROM PartnerFundClaim'+
            ' where ACE_Reimbursement_Status__c=\'Approved\'';
        
        if(startDate !=  null)
            query=query+' AND ACE_Approval_Date__c >=:startDate';
        System.debug('query:'+query);
        return Database.getQueryLocator(query);         
    }
    global void execute(Database.BatchableContext bc, List<PartnerFundClaim> records){
        
        if(records.size() >0){
            List<ACE_ClaimApprovalStub.Response_element> response = new List<ACE_ClaimApprovalStub.Response_element>(); 
            List<PartnerFundClaim> updateClaims = new List<PartnerFundClaim>();
            List<String> headersList = new List<String>();
            String errorMsg;
            
            System.debug('Execute method scope:'+records);
            for(integer i=0;i<records.size();i++){
                system.debug(i+':'+records[i]);
            }
            
            for(PartnerFundClaim pfc:records){
            	headersList.add(pfc.ACE_Header_Record_Read__c);
            }
            
            try{
                /*Callout To SAP*/
                response=ACE_ClaimsProcessHandlerSAP.sendClaimsToSAP(records);
                if(!response.isEmpty() && response[0].Status == 'SUCCESS'){
                    for(PartnerFundClaim pfc:records){
                        /*Update status to approved(payment pending)*/
                        pfc.ACE_Reimbursement_Status__c = 'PaymentPending';
                        /*Update Timestamp*/
                        pfc.ACE_Timestamp__c = System.now();
                        updateClaims.add(pfc);
                    }
                    if(!updateClaims.isEmpty())
                        Database.update(updateClaims);
                    ErrorLog.insertLogs(headersList,'ACE_BatchApprovedClaimsToSAP','Execute','Success.',0);
                }
                else if(response.isEmpty() || (!response.isEmpty() && response[0].Status != 'EXCEPTION')){
                    if(!response.isEmpty())
                    errorMsg = response[0].Status;
                    ErrorLog.insertLogs(headersList,'ACE_BatchApprovedClaimsToSAP','Execute','Callout returned Invalid Response.'+' '+errorMsg,0);
               }
            }
            catch(Exception ex){
                System.debug(ex.getMessage()+' '+ex.getStackTraceString());
                //ErrorLog.insertLogs(headersList,'ACE_BatchProcessClaims','Execute',ex.getMessage(),ex.getLineNumber());
            }
        }
    }    
    global void finish(Database.BatchableContext bc){
    }    
}