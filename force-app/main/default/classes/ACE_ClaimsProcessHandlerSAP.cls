/**
* @author        Accenture 
* @Created date  12/12/2018
* @description   Handles Adhoc Processing of reimbursement claims to SAP.
* @Version       1.0
**/
public without sharing class ACE_ClaimsProcessHandlerSAP {
    public static DateTime currentTimeStamp;
    /**
    * @author        Accenture 
    * @description   Fetches Last Batch Run date Based on Timestamp.
    * @Version       1.0
    * @Params     	 NA
    **/
    @AuraEnabled public static String getClaimProcessDetails()
    {
        try{
            List<PartnerFundClaim> ptfm = [select id,ACE_Timestamp__c from PartnerFundClaim where ACE_Reimbursement_Status__c='PaymentPending' 
                                           and ACE_Timestamp__c!= null order by ACE_Timestamp__c desc limit 1];
            if(!ptfm.isEmpty() && ptfm[0].ACE_Timestamp__c != null )
                currentTimeStamp = ptfm[0].ACE_Timestamp__c;
            List<error_log__c> error = [select id,createddate from error_log__c where Class_Name__c = 'ACE_BatchApprovedClaimsToSAP' and 
                                        Method_Name__c = 'Execute' order by createddate desc limit 1];
            if(!error.isEmpty() && (currentTimeStamp < error[0].createddate || currentTimeStamp == null))
                currentTimeStamp = error[0].createddate;
            return String.valueOf(currentTimeStamp);
        }
        catch(Exception ex){
            return null;
        }
    }
        /**
    * @author        Accenture 
    * @description   Fetches Reimbursement Claims based on Filter Criteria.
    * @Version       1.0
    * @Params     	 requestId - Fund request custom Id, allocId - Approve and release custom Id, headerId - Unique 
    				 header Id,startdate - Start approved Date ,endDate- End Approved Date,shipToId- ShipTo Name.
    **/
    @AuraEnabled public static List<PartnerFundClaim> getClaims(string requestId,String allocId,string headerId,
                                                                string startdate,string endDate,string shipToId)
    {
        String query;
        Date strtAppDate; 
        Date endAppDate;
        List<PartnerFundClaim> claimList = new List<PartnerFundClaim>();
        try{
            if(!String.isBlank(startdate))
                strtAppDate = Date.valueOf(startdate);
            if(!String.isBlank(endDate))
                endAppDate = Date.valueOf(endDate);
            
            query = 'select id,Title,Request.ACE_FY_Fund_Request_ID__c,Record_URL__c,ACE_Header_Record_Read__c,ACE_Tax_Pd__c,Allocation.ACE_FY_Promotion_ID__c,ACE_Approval_Date__c,Amount,ACE_Invoice_Date__c, ACE_Spend_Type__r.ACE_Spend_Type_ID__c,Internal_Order__r.Brand_WC__c, '+
                ' Account_Ship_To__r.name,Account_Ship_To__r.AccountNumber,Internal_Order__r.ACE_Internal_Order_Nbr__c,Line_Item__c,ACE_Reimbursement_Status__c,Related_Header_ID__c,Internal_Order__r.Name,ACE_Total_Requested_Reimbursement_Read__c,ACE_Spend_Type__c,ACE_Requested_Reimbursement__c'+
                ' from PartnerFundClaim where line_item__c = false and (ACE_Reimbursement_Status__c = \'PaymentPending\' OR ACE_Reimbursement_Status__c = \'Approved\')';
            if(!String.isBlank(requestId))
                query = query+' and Request.ACE_FY_Fund_Request_ID__c=:requestId';
            if(!String.isBlank(allocId))
                query = query+' and Allocation.ACE_FY_Promotion_ID__c=:allocId';
            if(!String.isBlank(shipToId))
                query = query+' and Account_Ship_To__r.name=:shipToId';
            if(!String.isBlank(headerId))
                query = query+' and ACE_Header_Record_Read__c =:headerId ';
            if( strtAppDate != null)
                query = query+' and ACE_Approval_Date__c >=:strtAppDate and ACE_Approval_Date__c <=:endAppDate';
            
            System.debug('Query::'+query);
            claimList = database.query(query);
            return claimList;
        }
        Catch(Exception ex){
            return null;
        }
    }
    
    /**
    * @author        Accenture 
    * @description   Send Claims to SAP for Normal adhoc Processing.
    * @Version       1.0
    * @Params     	 startDate - send Claims approved after this date
    **/
    @AuraEnabled public static string sendClaimsNormal(String startDate)
    {
        if(startDate.contains('T'))
            startDate = startDate.replace('T', ' ');
        DateTime srtDate = DateTime.valueOf(startDate);
        System.debug('DateTime::'+srtDate);
        Integer batchsize = Integer.valueOf(System.Label.ACE_Batch_size_Claims) ;
        try{
            Id batchJobId = Database.executeBatch(new ACE_BatchApprovedClaimsToSAP(srtDate), batchsize);
        }
        Catch(Exception ex){
            return 'Error in Executing Batch Class.';
        }
        return 'Success';
    }
    /**
    * @author        Accenture 
    * @description   Callout to SAP for proceesing approved Reimbursement Claims.
    * @Version       1.0
    * @Params     	 listClaims - Approved Reimbursement Claims
    **/
    public static List<ACE_ClaimApprovalStub.Response_element> sendClaimsToSAP(List<PartnerFundClaim> listClaims)
    {
        List<ACE_ClaimApprovalStub.Header_element> reqList = new List<ACE_ClaimApprovalStub.Header_element>();
        List<ACE_ClaimApprovalStub.Response_element> response = new List<ACE_ClaimApprovalStub.Response_element>();
        List<String> headersList = new List<String>();
        try{
            for(PartnerFundClaim ptf:listClaims){
                ACE_ClaimApprovalStub.Header_element req = new ACE_ClaimApprovalStub.Header_element();
                req.AllocationId = ptf.Allocation.ACE_FY_Promotion_ID__c;
                req.RequestId = ptf.Request.ACE_FY_Fund_Request_ID__c;
                req.Account_Ship_To_xc = ptf.Account_Ship_To__r.AccountNumber;
                req.ACE_Header_Record_ID_c = ptf.ACE_Header_Record_Read__c;
                req.ACE_Line_Item_ID_c = String.valueOf(ptf.Line_Item__c);
                req.Related_Header_Id_xc = ptf.Related_Header_ID__c;
                req.Title = ptf.Title;
                req.ACE_Invoice_Number_c = ptf.ACE_Invoice_Number__c;
                if(ptf.Line_Item__c == true){ 
                    req.ACE_Requested_Reimbursement_xc = String.valueOf(ptf.ACE_Requested_Reimbursement__c);
                    req.ACE_Tax_Paid = String.valueOf(ptf.ACE_Tax_Pd__c);
                    if(ptf.Internal_Order__r.Brand_WC__c == null)
                        req.ACE_Brand_c = ptf.Internal_Order__r.ACE_Brand_Cd__c;
                    else req.ACE_Brand_c = /*ptf.ACE_Brand__r.ACE_Profit_Center_ID__c*/ ptf.Internal_Order__r.Brand_WC__c ;
                    req.Internal_Order_c = ptf.Internal_Order__r.ACE_Internal_Order_Nbr__c;
                    req.ACE_Spend_Type_c = ptf.ACE_Spend_Type__r.ACE_Spend_Type_ID__c;
                }
                else 
                    req.ACE_Requested_Reimbursement_xc = String.valueOf(ptf.ACE_Total_Requested_Reimbursement_Read__c);
                if(ptf.ACE_Approval_Date__c != null)
                    req.ACE_Approval_Date_c = String.valueOf(ptf.ACE_Approval_Date__c.date()) ;
                if(ptf.ACE_Invoice_Date__c != null)
                    req.ACE_Invoice_Date_c = String.valueOf(ptf.ACE_Invoice_Date__c);
                reqList.add(req);
                headersList.add(ptf.ACE_Header_Record_Read__c);
            }
            for(integer i=0;i<reqList.size();i++){
                system.debug(i+':'+reqList[i]);
            }
            /*Authenticate the callout*/
            ACE_ClaimApprovalStub.HTTPS_Port stub = new ACE_ClaimApprovalStub.HTTPS_Port();
            stub.inputHttpHeaders_x = new Map<String, String>();
            stub.inputHttpHeaders_x.put(ACE_Util_Constants.AUTHORIZATION,ACE_Util_Constants.ECC_NAMED_CREDENTIAL);
            stub.timeout_x =120000;
            /*Make callout using reqList*/
            response=stub.SI_ApprovedClaims_SFDC_Send(reqList);
        }
        catch(Exception ex){
            ACE_ClaimApprovalStub.Response_element res = new ACE_ClaimApprovalStub.Response_element();
            res.Status = 'EXCEPTION';
            response.add(res);
            ErrorLog.insertLogs(headersList,'ACE_BatchApprovedClaimsToSAP','Execute',ex.getMessage(),ex.getLineNumber());
        }
        return response;
    }
    
        /**
    * @author        Accenture 
    * @description   Repeat processing approved Reimbursement Claims to SAP.
    * @Version       1.0
    * @Params     	 listClaims - Approved Reimbursement Claims for repeat processing
    **/
    @AuraEnabled
    public static String sendClaimsOnRepeat(List<PartnerFundClaim> listClaims)
    {
        List<String> headerIds = new List<String>();
        List<ACE_ClaimApprovalStub.Response_element> response = new List<ACE_ClaimApprovalStub.Response_element>();
        List<String> headersList = new List<String>();
        List<PartnerFundClaim> updateClaims = new List<PartnerFundClaim>();
        
        for(PartnerFundClaim ptf:listClaims){
            headerIds.add(ptf.ACE_Header_Record_Read__c);
        }
        
        List<PartnerFundClaim> allClaims = [select id,Related_Header_ID__c,Internal_Order__r.ACE_Brand_Cd__c,ACE_Total_Requested_Reimbursement_Read__c,
                                                Line_Item__c,Internal_Order__r.Brand_WC__c,Account_Ship_To__r.AccountNumber,Request.ACE_FY_Fund_Request_ID__c,Allocation.ACE_FY_Promotion_ID__c,
                                                ACE_Header_Record_Read__c,Title,ACE_Invoice_Number__c,Internal_Order__r.ACE_Internal_Order_Nbr__c,ACE_Spend_Type__r.ACE_Spend_Type_ID__c,/*ACE_Brand__r.ACE_Profit_Center_ID__c,*/
                                                ACE_Requested_Reimbursement__c,ACE_Approval_Date__c,ACE_Tax_Pd__c,ACE_Invoice_Date__c,ACE_Reimbursement_Status__c
                                                from PartnerFundClaim where Related_Header_ID__c =:headerIds or 
                                                ACE_Header_Record_Read__c=:headerIds];
        for(PartnerFundClaim ptf:allClaims){ 
        	headersList.add(ptf.ACE_Header_Record_Read__c);
        }
        try{
            /*Callout to SAP*/
            response = sendClaimsToSAP(allClaims);
            if(!response.isEmpty() && response[0].Status == 'SUCCESS'){
                for(PartnerFundClaim pfc:allClaims){ 
                    /*Update status to approved(payment pending)*/
                    if(pfc.ACE_Reimbursement_Status__c != 'PaymentPending'){ 
                        pfc.ACE_Reimbursement_Status__c = 'PaymentPending';
                        updateClaims.add(pfc);
                    }
                }
                if(!updateClaims.isEmpty())
                Database.update(updateClaims);
                ErrorLog.insertLogs(headersList,'ACE_BatchApprovedClaimsToSAP','Execute','Success.',0);
            }
            else if(response.isEmpty() || (!response.isEmpty() && response[0].Status != 'EXCEPTION')){
                string errorMsg;
                if(!response.isEmpty())
                    errorMsg = response[0].Status;
                ErrorLog.insertLogs(headersList,'ACE_BatchApprovedClaimsToSAP','Execute','Callout returned Invalid Response.'+' '+errorMsg,0);
            }
            return 'Success';
    	}
        catch(Exception ex){
            return 'Callout Failed.';
        }
    }
    
     /**
    * @author        Accenture 
    * @description   Gets Total count of claims selected for repeat processing(Header and line items).
    * @Version       1.0
    * @Params     	 listClaims - Approved Reimbursement Claims selected
    **/
    @AuraEnabled public static integer getTotalClaims(List<PartnerFundClaim> listClaims)
    {
        List<String> listClaimheader = new List<String>();
        try{
            for(PartnerFundClaim ptf:listClaims){
                listClaimheader.add(ptf.ACE_Header_Record_Read__c);
            }
            Integer countItems=[select count() from PartnerfundClaim where line_item__c=true and 
                                Related_Header_ID__c =:listClaimheader];
            System.debug('listClaims2:'+countItems);
            return countItems + listClaims.size();
        }
        catch(Exception ex){
            return 0;
        }
    }
}