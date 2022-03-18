/*------------------------------------------------------------
Author:       Larry A. Cardenas
Company:       Accenture
Description:   Method that creates line items from Reimbursement header record page
				and recalculates header amount.
<Date>      <Authors Name>     <Brief Description of Change>
11/10/2018   Larry A. Cardenas   
------------------------------------------------------------*/

public without sharing class ACE_LineItemCreate {
    @AuraEnabled
    public static PartnerFundClaim createLineItemServer(String PartnerFundClaimId,
            String titleStr,
            String SpendVal,
            String TotalExp,
            String TaxPaid,
            String LineItem,
            String Comments,
            String VendorsUsed, 
            String lineIdxStr){

         try{
             TotalExp = TotalExp.remove(',');
             Decimal TotalExpDec = Decimal.valueOf(TotalExp);
             Integer lineIdx = Integer.valueOf(lineIdxStr);
             PartnerFundClaim reimbursementHeader=ACE_Utils.getReimbursementHeader(PartnerFundClaimId);
    
              Decimal perSpendType = ACE_Utils.getSpendCategoryPercent(SpendVal);
              Decimal requestedReimbursement= ACE_Utils.calculateLineRequestedReimbursement(perSpendType,TotalExpDec);
              Decimal perReimbursement=ACE_Utils.calculateLineReimbursementPercent(requestedReimbursement,TotalExpDec);
             
              PartnerFundClaim newPartnerFundClaim = new PartnerFundClaim(Title =titleStr,
                                                                          RequestId=reimbursementHeader.RequestId,
                                                                          Reimbursement_Approver__c=reimbursementHeader.Reimbursement_Approver__c,
                                                                          Amount=0.00,
                                                                          ACE_Spend_Category__c=SpendVal,
                                                                          ACE_Spend_Category_Percentage__c=perSpendType,
                                                                          ACE_Total_Expenditure__c=TotalExpDec,
                                                                          ACE_Tax_Pd__c=taxPaid,
                                                                          ACE_Vendors_Used__c=VendorsUsed,
                                                                          ACE_Reimbursement_Percent__c=perReimbursement,
                                                                          Line_Item__c=TRUE,
                                                                          ACE_Comments__c=Comments,
                                                                          ACE_Requested_Reimbursement__c =requestedReimbursement,
                                                                          Related_Header_ID__c=reimbursementHeader.Related_Header_ID__c,
                                                                           ACE_Line_Item_Index__c = lineIdx,
                                                                            ACE_Invoice_Date__c=reimbursementHeader.ACE_Invoice_Date__c,
                                                                            ACE_Invoice_Number__c=reimbursementHeader.ACE_Invoice_Number__c,
                                                                            Account_Ship_To__c = reimbursementHeader.Account_Ship_To__c
                                                                         );

              insert newPartnerFundClaim;

              AggregateResult[] TotalRe=[select SUM(ACE_Requested_Reimbursement__c)totalexp FROM PartnerFundClaim where Related_Header_ID__c =: reimbursementHeader.ACE_Header_Record_Read__c];
              reimbursementHeader.ACE_Total_Requested_Reimbursement__c =((decimal)TotalRe[0].get('totalexp'));
             update reimbursementHeader;

              return newPartnerFundClaim;

          } catch(Exception e){
                  ErrorLog.insertErrorLog('HH','linkBrandRecord',e.getMessage(), e.getLineNumber());
        
              SYstem.debug(e.getLineNumber() + e.getMessage());
              throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
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
    public static List<String> getSpendCategoryValues(){
        return ACE_Utils.getSpendCategoryValues();
    }
    
/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns values for Tax Paid
<Date>      <Authors Name>     <Brief Description of Change>
1/08/2019   Alexandria Sanborn   
------------------------------------------------------------*/
    @AuraEnabled
    public static List<String> getTaxPaidValues(){

        Schema.DescribeFieldResult taxPaidField = PartnerFundClaim.ACE_Tax_Pd__c.getDescribe();
        List<Schema.PicklistEntry> taxPaidOptions = taxPaidField.getPicklistValues();

        List<String> taxPaidVals = new List<String>();
        for(Schema.PicklistEntry taxPaidOpt : taxPaidOptions){
            taxPaidVals.add(taxPaidOpt.getLabel());
        }
        System.debug(taxPaidVals);
        return taxPaidVals;
    }
    
/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Generates Line Item Index when new Line Item form is initialized.
<Date>      <Authors Name>     <Brief Description of Change>
1/08/2019   Alexandria Sanborn   
------------------------------------------------------------*/
    @AuraEnabled
    public static Decimal getLineItemIndex(Id reimbursementId){
        try{
            PartnerFundClaim reimbursement= ACE_Utils.getReimbursementHeader(reimbursementId);
            PartnerFundClaim[] lines = [
                    SELECT id, ACE_Line_Item_Index__c
                    FROM PartnerFundClaim
                    WHERE Related_Header_ID__c=:reimbursement.Related_Header_Id__c AND ACE_Line_Item_Index__c != null
                    ORDER BY ACE_Line_Item_Index__c DESC];

            return lines.size() > 0 ? lines[0].ACE_Line_Item_Index__c + 1 : 1;

        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
 
/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Returns Boolean for whether or not Reimbursement is editable based on status
<Date>      <Authors Name>     <Brief Description of Change>
08/13/2019   Alexandria Sanborn   
------------------------------------------------------------*/
    @AuraEnabled
    public static Boolean isReimbursementEditable(Id reimbursementId){
        return ACE_Utils.isReimbursementEditable(reimbursementId);
    }
}