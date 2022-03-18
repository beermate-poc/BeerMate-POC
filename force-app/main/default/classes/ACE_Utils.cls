public class ACE_Utils {
    public final static RecordType fundReqCoOpRecordType= [SELECT id FROM RecordType WHERE sObjectType='PartnerFundRequest' AND DeveloperName='Co_Op' Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    public static final id currentUserId = UserInfo.getUserId();
    
    public static User[] getCommunityUsers(Set<Id> contactIds){
        return [SELECT id, ContactId FROM User WHERE ContactId IN :contactIds AND IsPortalEnabled=TRUE AND IsActive=TRUE Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static Contact[] getContactsFromAccountIds(Set<Id> acctIds){
        return [SELECT id, AccountId FROM Contact where AccountId IN :acctIds];  
    }
    
    public static PartnerFundAllocation getPromotion(Id promotionId){
        return [SELECT id, ACE_MU__c, ACE_Spend_Type__c,ACE_Internal_Order__r.ACE_Internal_Order_Nbr__c, Title, Description, BudgetId, Amount,
                ACE_Co_op_Event__c,ACE_Start_Date__c, ACE_End_Date__c, ACE_Status__c,ChannelPartner.Name, 
                (SELECT id,RequestedAmount FROM PartnerFundRequests) FROM PartnerFundAllocation WHERE id=:promotionId Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static Spend_Type__c[] getSpendTypeOptions(){
        //should only be about 30 records
        // return [SELECT id, ACE_Spend_Type_Name__c FROM Spend_Type__c WHERE ACE_Spend_Type_Name__c != null ORDER BY ACE_Spend_Type_Name__c];
        return [SELECT id, ACE_Spend_Type_Name__c FROM Spend_Type__c WHERE ACE_Spend_Type_Name__c != null and ACE_Deletion_Indicator__c != true ORDER BY ACE_Spend_Type_Name__c Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        
    }
    
    public static PartnerFundClaim getReimbursementHeader(Id recordId){
        return [SELECT id, Line_Item__c, Reimbursement_Approver__r.Spend_Limit__c, Reimbursement_Approver__r.DelegatedApproverId, 
                ACE_Invoice_Number__c,ACE_Header_Record_Read__c,Account_Ship_To__r.Cust_Hierarchy_lvl4_link__r.AccountNumber, Request.Amount, 
                Request.Account_Ship_To__r.Cust_Hierarchy_lvl4_link__r.AccountNumber, ACE_Invoice_Description__c, ACE_Invoice_Date__c, ACE_Requested_Reimbursement__c ,
                ACE_Total_Requested_Reimbursement_Read__c, Request.Allocation.ACE_MU__c,ACE_Debit__c, ACE_Reimbursement_Status__c, Related_Header_Id__c,
                ACE_Submit_Date__c, ACE_Approval_Date__c
                FROM PartnerFundClaim WHERE id=:recordId Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static PartnerFundClaim getReimbursementHeaderByExtId(String relatedHeaderId){
        return [SELECT id, Line_Item__c, Reimbursement_Approver__r.Spend_Limit__c, Reimbursement_Approver__r.DelegatedApproverId, 
                ACE_Invoice_Number__c,ACE_Header_Record_Read__c,Account_Ship_To__r.Cust_Hierarchy_lvl4_link__r.AccountNumber, Request.Amount, 
                Request.Account_Ship_To__r.Cust_Hierarchy_lvl4_link__r.AccountNumber, ACE_Invoice_Description__c, ACE_Invoice_Date__c, 
                ACE_Total_Requested_Reimbursement_Read__c, Request.Allocation.ACE_MU__c,ACE_Debit__c,ACE_Submit_Date__c, ACE_Approval_Date__c
                FROM PartnerFundClaim WHERE Related_Header_ID__c = :relatedHeaderId AND Line_Item__c=FALSE Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static PartnerFundClaim[] getReimbursementLineItems(String relatedHeaderId){
        return [SELECT id, Internal_Order__r.ACE_Order_Status__c, 
                Internal_Order__r.ACE_Budget_Owner__c, Internal_Order__r.ACE_MgmtUnitCd__c, 
                ACE_Reimbursement_Percent__c, ACE_Reason_Code__c,ACE_Line_Item_Index__c,Title, 
                ACE_Spend_Category__c, ACE_Line_Item_Expense_Description__c, ACE_Total_Expenditure__c,
                ACE_Requested_Reimbursement__c, ACE_Tax_Pd__c, ACE_Vendors_Used__c, ACE_Comments__c, 
                Request.ACE_Spend_Type__c,Request.ACE_Internal_Order__c,ACE_Debit__c, Related_Header_Id__c,
                ACE_Spend_Type__r.Name, Internal_Order__r.ACE_Internal_Order_Nbr__c, Internal_Order__r.ACE_Brand_Cd__c,Internal_Order__r.Brand_WC__c
                FROM PartnerFundClaim WHERE Related_Header_ID__c =: relatedHeaderId AND Line_Item__c=TRUE
                ORDER BY ACE_Line_Item_Index__c ASC NULLS LAST Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static PartnerFundClaim[] getRelatedReimbursements(Id fundRequestId, Id reimbursementId){
        return [Select id, ACE_Total_Requested_Reimbursement_Read__c,Request.Amount 
                from PartnerFundClaim 
                where RequestId =:fundRequestId AND ACE_Reimbursement_Status__c != 'Open' 
                AND ACE_Reimbursement_Status__c != 'Denied' AND Id != :reimbursementId Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static Set<Id> getLookupIdsPartnerFundClaim(PartnerFundClaim[] reimbursements, String lookupField){
        Set<Id> lookupIds = new Set<Id>{};
            for(PartnerFundClaim r : reimbursements){
                lookupIds.add((Id)r.get(lookupField));
            }
        return lookupIds;
    }
    
    public static Map<Id, Id[]> getAndSortDistObjectIdsByCommunityUser(Map<Id, Id[]> shipToIdToSObjectIds, Map<Id, Id[]> contactIdToShipToIds, User[] communityUsers){
        Map<Id, Id[]> userIdTosObjectIds = new Map<Id, Id[]>();
        
        for(User cu : communityUsers){
            if(!userIdTosObjectIds.containsKey(cu.id)){
                userIdTosObjectIds.put(cu.id, new Id[]{});
            }
            Id[] shipToIds = contactIdToShipToIds.get(cu.ContactId);
            Set<Id> sObjectIds = new Set<Id>();
            for(Id shipToId : shipToIds){
                if(shipToIdTosObjectIds.containsKey(shipToId)){
                    sObjectIds.addAll(shipToIdTosObjectIds.get(shipToId));
                }
            }
            userIdTosObjectIds.get(cu.Id).addAll(sObjectIds);
        }
        return userIdTosObjectIds;
    } 
    
    public static Map<Id, Id[]> getAndSortContactByShipTos(Set<Id> acctIds){
        Map<Id, Id[]> contactIdToShipToIds = new Map<Id, Id[]>();
        AccountContactRelation[] shipToAccts = [SELECT id, ContactId,AccountId FROM AccountContactRelation WHERE 
                                                AccountId IN :acctIds Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        
        
        for(AccountContactRelation ac : shipToAccts){
            if(!contactIdToShipToIds.containsKey(ac.ContactId)){
                contactIdToShipToIds.put(ac.ContactId, new Id[]{});
            }
            contactIdToShipToIds.get(ac.ContactId).add(ac.AccountId);
        }
        return contactIdToShipToIds;
    }
    
    public static  Map<Id, Spend_Type__c> getSpendType(Set<Id> spendTypeIds){
        return new Map<Id, Spend_Type__c>([select Name,Id,Internal_Order__c,ACE_Order_Type__c from Spend_Type__c 
                                           where Id IN :spendTypeIds Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()]); 
    }
    
    public static Map<Id, ACE_Internal_Order__c> getInternalOrders(Set<Id> internalOrderIds){
        return new Map<Id, ACE_Internal_Order__c> ([select ACE_Internal_Order_Type__c,ACE_Budget_Owner__c,ACE_MgmtUnitCd__c,
                                                    ACE_Order_Status__c  from ACE_Internal_Order__c where 
                                                    Id IN :internalOrderIds Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()]);
    }
    
    public static Decimal calculateLineRequestedReimbursement(Decimal percent, Decimal expenditure){
        return percent*expenditure;
    }
    
    public static Decimal calculateLineReimbursementPercent(Decimal requestedReimbursement, Decimal expenditure){
        return (requestedReimbursement/expenditure)*100;
    }
    
    public Static String getStringDate(Date dateToConvert)
    {
        try{
            String sMonth = String.valueof(dateToConvert.month());
            String sDay = String.valueof(dateToConvert.day());
            if(sMonth.length()==1){
                sMonth = '0' + sMonth;
            }
            if(sDay.length()==1){
                sDay = '0' + sDay;
            }
            return String.valueof(dateToConvert.year()) + sMonth + sDay ;
        }
        Catch(Exception ex)
        {
            System.debug(ex.getMessage());
            return null;
        }
    }
    public static Id getRecordtypeIdByName(String name){
        List<recordtype> rectype= new List<recordtype>();
        try {
            rectype= [select Id, DeveloperName,SObjectType from Recordtype where DeveloperName=:name limit 1];
            if(!rectype.isEmpty()){
                return rectype[0].id; 
            }
        }catch(Exception e) {
            
        }
        
        return null;
    }
    
    public static List<String> getSpendCategoryValues(){
        List<String> SpendCategories = new List<String>();
        
        Schema.DescribeFieldResult spendCategoryField = PartnerFundClaim.ACE_Spend_Category__c.getDescribe();
        List<Schema.PicklistEntry> spendCategoryOptions = spendCategoryField.getPicklistValues();
        
        for(Schema.PicklistEntry SpendOption : spendCategoryOptions)
        {
            SpendCategories.add(SpendOption.getLabel());
        }
        return SpendCategories;
    }
    
    public static List<String> getTaxPaidValues(){
        List<String> taxPaidOpts = new List<String>();
        
        Schema.DescribeFieldResult taxPaidField = PartnerFundClaim.ACE_Tax_Pd__c.getDescribe();
        List<Schema.PicklistEntry> taxPaidOptions = taxPaidField.getPicklistValues();
        
        for(Schema.PicklistEntry taxPaid : taxPaidOptions){
            taxPaidOpts.add(taxPaid.getLabel());
        }
        return taxPaidOpts;
    }
    
    public static List<String> getReasonCodeOptions(){
        List<String> reasonCodes = new List<String>();
        
        Schema.DescribeFieldResult reasonCodeField = PartnerFundClaim.ACE_Reason_Code__c.getDescribe();
        List<Schema.PicklistEntry> reasonCodeOptions = reasonCodeField.getPicklistValues();
        
        for(Schema.PicklistEntry reasonCode : reasonCodeOptions){
            reasonCodes.add(reasonCode.getLabel());
        }
        return reasonCodes;
    }
    public static List<String> getReasonCodeDisqualifyOptions(){
        List<String> reasonCodesDisqualify = new List<String>();
        
        Schema.DescribeFieldResult reasonCodeDisqField = PartnerFundClaim.ACE_Reason_Code_Disqualify__c.getDescribe();
        List<Schema.PicklistEntry> reasonCodeDisqOptions = reasonCodeDisqField.getPicklistValues();
        
        for(Schema.PicklistEntry reasonCodeDisqualify : reasonCodeDisqOptions){
            reasonCodesDisqualify.add(reasonCodeDisqualify.getLabel());
        }
        return reasonCodesDisqualify;
    }
    public static List<String> getMUOptions(){
        List<String> managementUnits = new List<String>();
        
        Schema.DescribeFieldResult managementUnitField = PartnerMarketingBudget.Management_Units__c.getDescribe();
        List<Schema.PicklistEntry> managementUnitOptions = managementUnitField.getPicklistValues();
        
        for(Schema.PicklistEntry managementUnit : managementUnitOptions){
            managementUnits.add(managementUnit.getLabel());
        }
        return managementUnits;
    }
    
    public static Decimal getSpendCategoryPercent(String SpendVal){
        Decimal spendCategoryPercent;
        Spend_Category__mdt[] spendCategories = [SELECT id, Reimbursement_Percent__c FROM Spend_Category__mdt WHERE 
                                                 Label=:SpendVal Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
        return spendCategories.size() > 0 ? spendCategories[0].Reimbursement_Percent__c/100 : .5;
    }
    /*------------------------------------------------------------
Author:        Maneesha Gudisay
Company:       Accenture
Description:   Returns related lookup Ids of the ContentDocumentLinks.
<Date>      <Authors Name>     <Brief Description of Change>
03/25/2019  Maneesha Gudisay
------------------------------------------------------------*/
    public static Set<Id> getLookupIdsContentDocumentLink(ContentDocumentLink[] contentDocumentLinks, String lookupField){
        Set<Id> lookupIds = new Set<Id>{};
            for(ContentDocumentLink  eachCDL : contentDocumentLinks){ 
                lookupIds.add((Id)eachCDL.get(lookupField));
            }
        return lookupIds;
    }
    /*------------------------------------------------------------
Author:        Maneesha Gudisay
Company:       Accenture
Description:   Returns  Ids of the reimbursements.
<Date>      <Authors Name>     <Brief Description of Change>
03/29/2019  Maneesha Gudisay
------------------------------------------------------------*/
    public static List<Id> getIDsFromPartnerFundClaims(List<PartnerFundClaim> reimbursements){
        List<id> partnerFundClaimIDs=new List<id>();
        for(PartnerFundClaim eachPartnerFundClaim:reimbursements){
            partnerFundClaimIDs.add(eachPartnerFundClaim.Id);          
        } 
        return partnerFundClaimIDs;
    }
    
    public static Map<Id, AccountContactRelation[]> sortAccountContactRelationByLookupId(AccountContactRelation[] relations, String lookupId){
        Map<Id, AccountContactRelation[]> lookupIdToAccountContactRelations = new Map<Id, AccountContactRelation[]>();
        for(AccountContactRelation acr : relations){
            if(!lookupIdToAccountContactRelations.containsKey((Id)acr.get(lookupId))){
                lookupIdToAccountContactRelations.put((Id)acr.get(lookupId),new AccountContactRelation[]{});
            }
            lookupIdToAccountContactRelations.get((Id)acr.get(lookupId)).add(acr);
        }
        return lookupIdToAccountContactRelations;
    }
    
    public static AccountContactRelation[] getAccountContactRelationsFromAccountIds(Set<Id> acctIds){
        return [
            SELECT id,Contact.Name,Account.AccountNumber,Account.BillingCity, Account.BillingState,Account.Owner.Name,Contact.MailingCity,Contact.MailingState,Contact.Role__c,Account.Name,Account.ParentId
            FROM AccountContactRelation WHERE AccountId IN :acctIds Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static PartnerFundRequest[] filterPartnerFundRequestsByNullFieldVal(PartnerFundRequest[] fundRequests, String filter){
        PartnerFundRequest[] filtered = new PartnerFundRequest[]{};
            for(PartnerFundRequest fr : fundRequests){
                if(fr.get(filter) == null){
                    filtered.add(fr);
                }
            }
        return filtered;
    }
    
    public static Account[] getShipTosByMU(Set<Id> muIds){
        return [SELECT id, Cust_Hierarchy_lvl4_link__c from Account where Cust_Hierarchy_lvl4_link__c IN :muIds AND 
                RecordType.DeveloperName='Ship_To' Limit :Limits.getLimitQueryRows() - Limits.getQueryRows()];
    }
    
    public static Boolean isReimbursementEditable(Id reimbursementId){
        try{
            PartnerFundClaim reimbursement= ACE_Utils.getReimbursementHeader(reimbursementId);
            System.debug(reimbursement.ACE_Reimbursement_Status__c);
            return reimbursement.ACE_Reimbursement_Status__c == 'Open' || reimbursement.ACE_Reimbursement_Status__c == 'AwaitingAdditionalData';
        } catch (Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }
}