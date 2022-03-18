/*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Clone Reimbursement records with Line items.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	29/01/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/

public class ACE_CloneReimburseController {
    
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Get reimbursement record details to clone.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	29/01/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    @AuraEnabled public static PartnerFundclaim getClaimDetails(Id reimburseId){
        try{ 
            return [select id,Request.Id,Account_Ship_To__r.Name,Request.Title,Account_Ship_To__r.Id,ACE_Reimbursement_Status__c,Title,ACE_Distributors_Contact_Email__c,
                    ACE_Invoice_Date__c,Amount,ACE_Invoice_Description__c,ACE_Additional_Email_1__c,ACE_Total_Requested_Reimbursement_Read__c,
                    ACE_Additional_Email_2__c,Reimbursement_Approver__r.Id,Reimbursement_Approver__r.Name,Owner.Name,ACE_Invoice_Number__c,ACE_Submit_Date__c,ACE_Primary_Contact_Email__c,
                    ACE_Approval_Date__c,ACE_Debit__c,ACE_Reimbursement_Percent__c,ACE_Header_Record_Id__c,ChannelPartner.Name,ChannelPartnerId,ACE_Header_Record_Read__c,ACE_Total_Requested_Reimbursement__c
                    from PartnerFundclaim where Id =:reimburseId limit 1];
        }
        catch(Exception ex){ 
            return null;
        }
    }
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Clone reimbursement record.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	29/01/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    @AuraEnabled public static string cloneReimbursement(PartnerFundclaim claim,Id reimburseId){
        
        List<PartnerFundclaim> lstClaimsToUpdate= new List<PartnerFundclaim>();
        PartnerFundclaim cloneHeader = new PartnerFundclaim();
        try{ 
            user user =[select id,ACE_Approver__c from user where id =:UserInfo.getUserId()];
           // if(!user.ACE_Approver__c) return 'NotValidApprover';
            String headerorg = claim.ACE_Header_Record_Id__c;
        	String idorg = claim.Id;
        	if(claim!= null)
                cloneHeader = clonerecord(claim,false);
            if(cloneHeader != null)
                insert cloneHeader;
            PartnerFundclaim newHeader = [select id,ACE_Header_Record_Read__c,ACE_Header_Record_ID__c from PartnerFundclaim where id=:cloneHeader.id limit 1];
            List<PartnerFundclaim> lstLineItems = [select id,RequestId,ACE_Line_Item_Index__c,Account_Ship_To__c,Amount,Title,ACE_Invoice_Number__c,
                                                   ACE_Reimbursement_Status__c,ACE_Invoice_Date__c,ACE_Additional_Email_1__c,
                                                   ACE_Debit__c,ACE_Invoice_Description__c,ACE_Additional_Email_2__c,
                                                   ACE_Spend_Category__c,ACE_Total_Expenditure__c,ACE_Requested_Reimbursement__c,
                                                   ACE_Tax_Pd__c,ACE_Vendors_Used__c,ACE_Comments__c,ACE_Reason_Code__c,
                                                   ACE_Spend_Type__c,Internal_Order__c,ACE_Total_Requested_Reimbursement__c,
                                                   ACE_Approval_Date__c,ACE_Submit_Date__c,ACE_Reimbursement_Percent__c,
                                                   ACE_Header_Record_Id__c
                                                  from PartnerFundclaim where Related_Header_ID__c =:headerorg and id!=:idorg and Related_Header_ID__c != null];
            for(PartnerFundclaim pfc :lstLineItems){
                PartnerFundclaim lineItem = clonerecord(pfc,true);
                lineItem.Related_Header_ID__c = newHeader.ACE_Header_Record_Id__c;
                lstClaimsToUpdate.add(lineItem);
            }
            if(!lstClaimsToUpdate.isEmpty())
                insert lstClaimsToUpdate;
            return 'Success'+':'+newHeader.Id;
        }
        catch(Exception ex){
            System.debug('Ex'+ex);
            return 'Error';
        }
    }
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Prepopulate the reimbursement record.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	29/01/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    public static Partnerfundclaim clonerecord(Partnerfundclaim claim,Boolean isLineItem)
    {
        Partnerfundclaim newClaim = new Partnerfundclaim();
        newClaim.RequestId = claim.RequestId;
        newClaim.Account_Ship_To__c=claim.Account_Ship_To__c;
        newClaim.Amount= claim.Amount;
        newClaim.Title=claim.Title;
        newClaim.ACE_Invoice_Number__c=claim.ACE_Invoice_Number__c;
        newClaim.ACE_Reimbursement_Status__c= claim.ACE_Reimbursement_Status__c;
        newClaim.ACE_Invoice_Date__c= claim.ACE_Invoice_Date__c;
        newClaim.ACE_Debit__c= claim.ACE_Debit__c;
        newClaim.ACE_Additional_Email_1__c = claim.ACE_Additional_Email_1__c;
        newClaim.ACE_Additional_Email_2__c = claim.ACE_Additional_Email_2__c;
        newClaim.ACE_Invoice_Description__c= claim.ACE_Invoice_Description__c;
        newClaim.ACE_Reimbursement_Status__c = 'Open';
        newClaim.ACE_Is_Cloned__c = true;
        newClaim.Reimbursement_Approver__c = UserInfo.getUserId();
        if(isLineItem == true){ 
            newClaim.Line_Item__c = true;
            newClaim.ACE_Spend_Category__c = claim.ACE_Spend_Category__c;
            newClaim.ACE_Line_Item_Index__c = claim.ACE_Line_Item_Index__c;
            newClaim.ACE_Total_Expenditure__c = claim.ACE_Total_Expenditure__c;
            newClaim.ACE_Requested_Reimbursement__c = claim.ACE_Requested_Reimbursement__c;
            newClaim.ACE_Reimbursement_Percent__c = claim.ACE_Reimbursement_Percent__c;
            newClaim.ACE_Tax_Pd__c = claim.ACE_Tax_Pd__c;
            newClaim.ACE_Vendors_Used__c = claim.ACE_Vendors_Used__c;
            newClaim.ACE_Comments__c = claim.ACE_Comments__c;
            newClaim.ACE_Reason_Code__c = claim.ACE_Reason_Code__c;
            newClaim.ACE_Spend_Type__c = claim.ACE_Spend_Type__c;
            newClaim.Internal_Order__c = claim.Internal_Order__c;
        }
        else
            newClaim.ACE_Total_Requested_Reimbursement__c = claim.ACE_Total_Requested_Reimbursement__c;
        return newClaim;
    }
}