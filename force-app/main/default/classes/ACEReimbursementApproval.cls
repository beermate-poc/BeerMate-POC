/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Contains methods that handle PartnerFundClaim (header and line item) status changes in approval process.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
public without sharing class ACEReimbursementApproval  {
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Validates Reimbursement(PartnerFundClaim) Header and Line Items for ASM/DSM approver 
                    (internal Salesforce Users, usually Sales User profile). 
                    Returns a string list of error messages if error(s) were found.             
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    @AuraEnabled
    public static List<String> validate (String recordID) {
        try {
            List<String> errorMessages=new List<String>();
            PartnerFundClaim reimbursement= ACE_Utils.getReimbursementHeader(recordID);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(reimbursement.Related_Header_Id__c);
            PartnerFundClaim[] relatedReimbursements = ACE_Utils.getRelatedReimbursements(reimbursement.RequestId, reimbursement.id);
            
            Map<Id, Spend_Type__c> spendTypeById = ACE_Utils.getSpendType(ACE_Utils.getLookupIdsPartnerFundClaim(lineItems, 'ACE_Spend_Type__c'));
            Map<Id, ACE_Internal_Order__c> internalOrderById = ACE_Utils.getInternalOrders(ACE_Utils.getLookupIdsPartnerFundClaim(lineItems, 'Internal_Order__c'));
            
            errorMessages.addAll(validateHeaderApprove(reimbursement));
            errorMessages.addAll(validateLineItems(reimbursement, lineItems, spendTypeById, internalOrderById));
            errorMessages.addAll(validateRelatedReimbursements(relatedReimbursements, reimbursement));

            return errorMessages;
        } catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Validates Reimbursement(PartnerFundClaim) Header and Line Items for Distributor
                    (Community Salesforce Users, usually Community Finance Analyst profile). 
                    Returns a string list of error messages if error(s) were found.         
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    @AuraEnabled
    public static String[] validateCommunity(String recordID){
        try {
            List<String> errorMessages=new List<String>();

            PartnerFundClaim reimbursement= ACE_Utils.getReimbursementHeader(recordID);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(reimbursement.Related_Header_Id__c);
            PartnerFundClaim[] relatedReimbursements = ACE_Utils.getRelatedReimbursements(reimbursement.RequestId, reimbursement.id);
             
            updateLinesApproverWithHeaderApprover(reimbursement, lineItems);
            
            errorMessages.addAll(validateHeaderCommunitySend(reimbursement));
            errorMessages.addAll(validateRelatedReimbursements(relatedReimbursements, reimbursement));
           
            return errorMessages;
        }
        catch(Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates statuses to Pending Approval and populates submitted dates on header and all related line items.
                        Called by Community User (distributor) to submit claim to Internal User (ASM/DSM) for approval. 
                    
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    @Auraenabled
    public static void SendApproval (String recordId){
        try{
            PartnerFundClaim[] headerAndLinesToUpdate = new PartnerFundClaim[]{};
            PartnerFundClaim header = ACE_Utils.getReimbursementHeader(recordID);
            headerAndLinesToUpdate.add(header);
            headerAndLinesToUpdate.addAll(ACE_Utils.getReimbursementLineItems(header.Related_Header_Id__c));
            ACEReimbursementApproval.flagDoNotDeleteReimbursementAttachments(headerAndLinesToUpdate);
            updateReimbursementStatus('PendingApprovals',DateTime.now(),null, headerAndLinesToUpdate);
        }
        catch(Exception e) {
            System.debug(e.getLineNumber() + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }

/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates statuses to Approved and populates approved dates on header and all related line items.
                        Invoked by Internal User (ASM/DSM) to approve claim submitted by Community User (distributor). 
                    
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    @AuraEnabled
    public static void ApproveRecord (Id recordID){       
        PartnerFundClaim[] headerAndLinesToUpdate = new PartnerFundClaim[]{};
            PartnerFundClaim header = ACE_Utils.getReimbursementHeader(recordId);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(header.Related_Header_Id__c);
            headerAndLinesToUpdate.add(header);
            headerAndLinesToUpdate.addAll(lineItems);
        
            preventUserFromUpdatingFromLineItemPage(header.Line_Item__c);
            
            updateLinesApproverWithHeaderApprover(header, lineItems);
            updateReimbursementStatus('Approved',header.ACE_Submit_Date__c,Datetime.now(), headerAndLinesToUpdate);
    }
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates statuses to Pending Approval and removes approved date on header and all related line items.
                        Invoked by Internal User (ASM/DSM) to recall reimbursement after it has been approved.
                    
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    @AuraEnabled
    public static void recallReimbursementAndLines(Id headerId){
        try{
            PartnerFundClaim[] headerAndLinesToUpdate = new PartnerFundClaim[]{};
            PartnerFundClaim header = ACE_Utils.getReimbursementHeader(headerId);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(header.Related_Header_Id__c);
            headerAndLinesToUpdate.add(header);
            headerAndLinesToUpdate.addAll(lineItems);
            
            preventUserFromUpdatingFromLineItemPage(header.Line_Item__c);
            
            updateLinesApproverWithHeaderApprover(header, lineItems);
            updateReimbursementStatus('PendingApprovals',header.ACE_Submit_Date__c,null, headerAndLinesToUpdate);
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates statuses to AwaitingAdditionalData and populates approved dates on header and all related line items.
                        Invoked by Internal User (ASM/DSM) to send reimbursement back for Community User (Distributor) to update.   
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    
    @AuraEnabled
    public static void needInfoReimbursementAndLines(Id headerId, String comments){
        try{
            PartnerFundClaim[] headerAndLinesToUpdate = new PartnerFundClaim[]{};
            PartnerFundClaim header = ACE_Utils.getReimbursementHeader(headerId);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(header.Related_Header_Id__c);
            headerAndLinesToUpdate.add(header);
            headerAndLinesToUpdate.addAll(lineItems);
            
            preventUserFromUpdatingFromLineItemPage(header.Line_Item__c);
            
            updateLinesApproverWithHeaderApprover(header, lineItems);
            updateReimbursementComments(comments, header);
            updateReimbursementStatus('AwaitingAdditionalData',null,null, headerAndLinesToUpdate);
            
        } catch (Exception e){
            System.debug(e.getLineNumber());
            System.debug(e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates statuses to Denied and populates approved dates on header and all related line items.
                        Invoked by Internal User (ASM/DSM) to send reimbursement back for Community User (Distributor).     
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    
    @AuraEnabled
    public static void denyReimbursementAndLines(Id headerId, String comments){
        try{
            PartnerFundClaim[] headerAndLinesToUpdate = new PartnerFundClaim[]{};
            PartnerFundClaim header = ACE_Utils.getReimbursementHeader(headerId);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(header.Related_Header_Id__c);
            headerAndLinesToUpdate.add(header);
            headerAndLinesToUpdate.addAll(lineItems);
            
            preventUserFromUpdatingFromLineItemPage(header.Line_Item__c);
            
            updateLinesApproverWithHeaderApprover(header, lineItems);
            updateReimbursementComments(comments, header);
            updateReimbursementStatus('Denied',null,null, headerAndLinesToUpdate);
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
    /*------------------------------------------------------------
       Author:        Larry A. Cardenas
       Company:       Accenture
       Description:   Updates statuses to Denied and populates approved dates on header and all related line items.
                        Invoked by Internal User (ASM/DSM) to send reimbursement back for Community User (Distributor) to update.   
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  
------------------------------------------------------------*/
    
    @AuraEnabled
    public static void disqualifyReimbursement(Id headerId, String reasonCode){
        String errorMsg = '';
        try{
            if(String.isBlank(reasonCode)){
                errorMsg = 'Reason Code is required.';
                throw new CustomApprovalException();
            }
            PartnerFundClaim[] headerAndLinesToUpdate = new PartnerFundClaim[]{};
            PartnerFundClaim header = ACE_Utils.getReimbursementHeader(headerId);
            PartnerFundClaim[] lineItems = ACE_Utils.getReimbursementLineItems(header.Related_Header_Id__c);
            headerAndLinesToUpdate.add(header);
            headerAndLinesToUpdate.addAll(lineItems);
            
            preventUserFromUpdatingFromLineItemPage(header.Line_Item__c);
            
            updateLinesApproverWithHeaderApprover(header, lineItems);
            headerAndLinesToUpdate = setDisqualifyReasonCode(headerAndLinesToUpdate, reasonCode);
            updateReimbursementStatus('Denied',null,null, headerAndLinesToUpdate);
            
        } catch (Exception e){
            errorMsg = String.isBlank(errorMsg) ? e.getMessage() : errorMsg;
            throw new AuraHandledException(errorMsg);
        }
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Utility method containing header-specific validations for when ASM/DSM (Internal) attempts to approve reimbursement.          
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    private static String[] validateHeaderApprove(PartnerFundClaim header){
        String[] errorMessages = new String[]{};
        userCannotApproveLineItem(header.Line_Item__c, errorMessages);
        userCannotUpdateApprover(header, errorMessages);        
        userSpendLimitTooLow(header, errorMessages);
        shipToisNull(header.Account_Ship_To__c, errorMessages);
        return errorMessages;  
    }
      
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Utility method containing header-specific validations for when Community User (Distributor) attempts 
                        to send reimbursement to ASM/DSM (Internal) for approval.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    
    private static String[] validateHeaderCommunitySend(PartnerFundClaim header){
        String[] errorMessages = new String[]{};
        userCannotApproveLineItem(header.Line_Item__c, errorMessages);
        validateTotalRequestedReimbursement(header.ACE_Total_Requested_Reimbursement_Read__c, errorMessages); 
        shipToisNull(header.Account_Ship_To__c, errorMessages); 
        return errorMessages;  
    }
 /**
@Author Accenture
@name: BMC_RetailQualityController
@CreateDate  1/16/2020
@Description Method to Validate if User submits a Record with 0 Dollars.
@Version <1.0>
*/
    private static String[] validateTotalRequestedReimbursement (Decimal reimbursement, String[] errorMessages){
    if (reimbursement == 0){
           errorMessages.add('The total requested reimbursement is $0.00 and cannot be submitted for approval.');
        }
        return errorMessages;
    }

    private static String[] userCannotApproveLineItem(Boolean recordIsLineItem, String[] errorMessages){
        if(recordIsLineItem){
            errorMessages.add('Line items cannot be approved.');
        }
        return errorMessages;
    }
    
    private static String[] userCannotUpdateApprover(PartnerFundClaim header, String[] errorMessages){
        if(ACE_Utils.currentUserId !=header.Reimbursement_Approver__c && ACE_Utils.currentUserId != header.Reimbursement_Approver__r.DelegatedApproverId){
            errorMessages.add('User not authorized to update the Reimbursement Approver');
         }
        return errorMessages;
    }
    
    private static String[] userSpendLimitTooLow(PartnerFundClaim header, String[] errorMessages){
        if(header.Reimbursement_Approver__r.Spend_Limit__c < header.ACE_Total_Requested_Reimbursement_Read__c) {
            errorMessages.add('The Reimbursement total exceeds your approval limit. Please change Approver to your manager, add comments and save.');
         }
        return errorMessages;
    }
    
    private static String[] shipToisNull(Id shipTo, String[] errorMessages){
        if (shipTo == Null){
           errorMessages.add('Ship To is not specified, Please fill in the correct Ship To.');
        }
        return errorMessages;
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Utility method containing line item specific validations for when
                        ASM/DSM (Internal) attempts to approve reimbursement.   
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    
    public static String[] validateLineItems(PartnerFundClaim header, PartnerFundClaim[] lineItems,Map<Id, Spend_Type__c> spendTypeById, Map<Id, ACE_Internal_Order__c> internalOrderById){
        String[] errorMessages = new String[]{};
            For(Integer lineIdx = 0;lineIdx < lineItems.size();lineIdx++){
                PartnerFundClaim line = lineItems[lineIdx];
                if(line.ACE_Spend_Type__c == null  || String.isEmpty(line.ACE_Spend_Type__c)){
                    errorMessages.add('Please enter spend type for the line item: '+line.ACE_Line_Item_Index__c);
                }

                if(line.Internal_Order__c == null || String.isEmpty(line.Internal_Order__c)){
                    errorMessages.add('Please enter internal order for the line item: '+line.ACE_Line_Item_Index__c);
                }
             
                if(line.ACE_Reimbursement_Percent__c > 50.05 && line.ACE_Reason_Code__c == null){
                    errorMessages.add('Reason code must be provided if reimbursement percent is greater than 50%: '+line.ACE_Line_Item_Index__c);
                }

                if(line.ACE_Spend_Type__c != null && line.Internal_Order__c != null && !String.isEmpty(line.ACE_Spend_Type__c) && !String.isEmpty(line.Internal_Order__c)){
                    if(internalOrderById.get(line.Internal_Order__c).ACE_Internal_Order_Type__c != spendTypeById.get(line.ACE_Spend_Type__c).ACE_Order_Type__c) {
                        errorMessages.add('Please select a valid Spend Type-IO Combination for line: '+line.ACE_Line_Item_Index__c);
                    }
                }
                if(internalOrderById.containsKey(line.Internal_Order__c) && internalOrderById.get(line.Internal_Order__c).ACE_Order_Status__c == 'CLSD'){
                    errorMessages.add('Selected internal order is closed. Please select open order for line item: '+line.ACE_Line_Item_Index__c);
                }

                if(internalOrderById.containsKey(line.Internal_Order__c) && internalOrderById.get(line.Internal_Order__c).ACE_Budget_Owner__c == 'GM' && internalOrderById.get(line.Internal_Order__c).ACE_MgmtUnitCd__c != header.Request.Account_Ship_To__r.Cust_Hierarchy_lvl4_link__r.AccountNumber){
                    errorMessages.add('Internal Order\'s Management Unit must match Customer\'s Management Unit: ' + line.ACE_Line_Item_Index__c);
                }
            } 
        return errorMessages; 
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Utility method containing validations specific to validating
                        against reimbursements belonging to the same Fund Request.      
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    
    private static String[] validateRelatedReimbursements(PartnerFundClaim[] relatedReimbursements, PartnerFundClaim reimbursement){
        String[] errorMessages = new String[]{};
            
        if (totalReimbursementAndRelatedReimbursement(relatedReimbursements, reimbursement) > reimbursement.Request.Amount) {
           errorMessages.add('The assigned Fund Request’s allocation dollars have been exceeded. Please reach out to your region finance contact for assistance. The link to the region finance contact list is located under the Help Me tab. Thank you.');
        }
        return errorMessages; 
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Returns sum of all Reimbursement header totals for all Reimbursements on a Fund Request.          
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/  
    private static Decimal totalReimbursementAndRelatedReimbursement(PartnerFundClaim[] relatedReimbursements, PartnerFundClaim reimbursement){
        Decimal claimTotalAmt=0;
        for(PartnerFundClaim rr : relatedReimbursements){
             claimTotalAmt += rr.ACE_Total_Requested_Reimbursement_Read__c;
        }
        claimTotalAmt += reimbursement.ACE_Total_Requested_Reimbursement_Read__c;
        return claimTotalAmt; 
    }
      /*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates Line Item Approver from Header Approver.                  
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
       ------------------------------------------------------------*/ 
    private static void updateLinesApproverWithHeaderApprover(PartnerFundClaim header, PartnerFundClaim[] lineItems){
        for(PartnerFundClaim line : lineItems){
          line.Reimbursement_Approver__c = header.Reimbursement_Approver__c;
        }
            update lineItems;
    }
    
      /*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Utility method to update status change. 
                        Changes status field and any dates that need to be updated.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
       ------------------------------------------------------------*/   
    private static void updateReimbursementStatus(String status, Datetime submitDate, Datetime approvalDate, PartnerFundClaim[] headerAndLineRecords){
        for(PartnerFundClaim record : headerAndLineRecords){
            record.ACE_Reimbursement_Status__c=status;
            record.ACE_Submit_Date__c = submitDate;
            record.ACE_Approval_Date__c = approvalDate;
        }    
        update headerAndLineRecords;
    }
      /*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Utility method to update comment field on Reimbursement.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
       ------------------------------------------------------------*/
    private static void updateReimbursementComments(String comments, PartnerFundClaim reimbursement){
        reimbursement.ACE_Comments__c = comments;
        update reimbursement;
    }

   
      /*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Throws error to prevent user from making updates to line item on the line item record page.       
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
       ------------------------------------------------------------*/
    private static void preventUserFromUpdatingFromLineItemPage(Boolean isLineItem){
        if(isLineItem){
           throw new AuraHandledException('Line items cannot be updated from this page. Use the header to make updates.');  
        } 
    }
     /*------------------------------------------------------------
Author:       Larry A. Cardenas
Company:       Accenture
Description:   Returns values for Spend Category
<Date>      <Authors Name>     <Brief Description of Change>
11/5/2018   Larry A. Cardenas   
------------------------------------------------------------*/
    @AuraEnabled
    public static List<String> getReasonCodeDisqualifyOptions(){
        return ACE_Utils.getReasonCodeDisqualifyOptions();
    }
    
       
     /*------------------------------------------------------------
       Author:        Maneesha Gudisay
       Company:       Accenture
       Description:   This method prevents user from deleting the attachments if the reimbursement is submitted for approval.       
       <Date>      <Authors Name>     <Brief Description of Change>
       03/25/2019  Maneesha Gudisay
       ------------------------------------------------------------*/
    private static void flagDoNotDeleteReimbursementAttachments(List<PartnerFundClaim> headerAndLines){
        try{
            List<Id> headerAndLineIds = ACE_Utils.getIDsFromPartnerFundClaims(headerAndLines);
            list<ContentDocumentLink> contentDocumentLinkObj=[select Id,ContentDocumentId,LinkedEntityId from ContentDocumentLink where LinkedEntityId in : headerAndLineIds];
            Set<Id> contentDocumentIds  = ACE_Utils.getLookupIdsContentDocumentLink(contentDocumentLinkObj,'ContentDocumentId');
            list<ContentVersion> contentVersionObj=[select Id,C360_Do_Not_Delete__c from ContentVersion  where IsLatest = TRUE and ContentDocumentId  in : contentDocumentIds];
              
            for(ContentVersion cV:contentVersionObj)
            {
                if(!cV.C360_Do_Not_Delete__c)
                {
                    cV.C360_Do_Not_Delete__c = true;
                }
            }
            update contentVersionObj;
        }
        catch(Exception e) {
            System.debug(e.getLineNumber() + e.getMessage());
            throw new AuraHandledException(e.getMessage());
        }
    }
        /*------------------------------------------------------------
       Author:        Larry A. Cardenas
       Company:       Accenture
       Description:   Utility method to set reason code field on Reimbursement and Lines.
       <Date>      <Authors Name>     <Brief Description of Change>
       06/07/09  
       ------------------------------------------------------------*/
    
    private static PartnerFundClaim[] setDisqualifyReasonCode(PartnerFundClaim[] headerAndLines, String reasonCode){
        for(PartnerFundClaim pfc : headerAndLines){
            pfc.ACE_Reason_Code_Disqualify__c = reasonCode;
        }
        return headerAndLines;
    }
    
    public class CustomApprovalException extends Exception {}
}