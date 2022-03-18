/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Contains methods related to creating PartnerFundRequests 
						from custom lightning component on PartnerFundAllocation record page.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/
public class ACE_approveAndReleaseClass {   
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description: Called when lightning cmp initializes; returns Promotion Status and list of states. 
					If Promotion status is closed, users should not have access to functionality. Otherwise, they 
					have dropdown list of states associated with the Promotion's MU. Potential states are determined
					by querying all Ship-Tos that belong to that MU and then parsing the state abbreviation from 
					the Ship-To's Cust_Hierarchy_Lvl5_Text__c field, which will always be the last 2 letters. 
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/
    @AuraEnabled
    public static initPromoAndStates getStates(Id promotionId){
        PartnerFundAllocation promotion = ACE_Utils.getPromotion(promotionId);
        Account[] states = [SELECT id, Name,Cust_Hierarchy_Lvl5_Text__c FROM Account WHERE Cust_Hierarchy_lvl4_link__r.Name = :promotion.ChannelPartner.Name AND RecordType.DeveloperName='Ship_To'];
        Set<String> statesPL = new Set<String>();
            for(Account state : states){
                if(state.Cust_Hierarchy_Lvl5_Text__c != null){
                    statesPL.add(state.Cust_Hierarchy_Lvl5_Text__c.right(2));   
                }           
            }
        String[] statesPLList = new String[]{};
        statesPLList.addAll(statesPL);
        return new initPromoAndStates(promotion.ACE_Status__c, statesPLList);
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Queries all Ship-Tos associated with state input (user selects state from dropdown).
					Initializes new potential new PartnerFundRequests from Ship-Tos (1:1) to be displayed for a user 
					to edit and choose to create.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/
    @AuraEnabled
    public static FundReqWrapper getShipTo(Id promotionId, String state) {
        try{
            PartnerFundAllocation promotion = ACE_Utils.getPromotion(promotionId);   
            list<Account> shipList = [select Id,Name,BillingState,AccountNumber,ACE_Primary_Contact__c from Account 
                                      where BillingState = :state 
                                      AND Cust_Hierarchy_lvl4_link__r.Name = :promotion.ChannelPartner.Name 
                                      AND RecordType.DeveloperName='Ship_To' 
                                      AND Type='Ship-To' AND Primary_Ship_To__c=TRUE AND C360_Account_Status__c='Active' Order By Name];

            FundReqWrapper fundReqWrapper =new FundReqWrapper(calculateRemainingDollars(promotion), ACE_Utils.getSpendTypeOptions());

            for(Account shipToRec:shipList) {
                FundReqCustom newFR = new FundReqCustom(promotion, shipToRec);
                fundReqWrapper.fundRequests.add(newFR);
            }
            return fundReqWrapper;
        }
        catch(Exception e){
            System.debug(e.getLineNumber());
            System.debug(e.getMessage());
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Creates new PartnerFundRequests if user has checked box to create and has entered amount.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/

    @AuraEnabled
    public static PartnerFundRequest[] createFundRequestRec(String fundReqsString) {
        try{
            List<PartnerFundRequest> fundRequestsToInsert=new List<PartnerFundRequest>();
            FundReqCustom[] fundReqs = (FundReqCustom[])JSON.deserialize(fundReqsString,FundReqCustom[].class);
            for(FundReqCustom fr: fundReqs) {
                if(fr.fundRequestCheck && fr.fundRequestSF.RequestedAmount != null && fr.fundRequestSF.RequestedAmount > 0){
                    fundRequestsToInsert.add(fr.fundRequestSF);
                }
            }

            Database.insert(fundRequestsToInsert);
            return fundRequestsToInsert;
        }
        catch(Exception e){
            System.debug(e.getLineNumber());
            System.debug(e.getMessage());
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Calculates remaining dollars on Promotion to display based on Fund Requests already generated.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/
    private static Decimal calculateRemainingDollars(PartnerFundAllocation promotion){
        Decimal remainingDollars = 0;
            for(PartnerFundRequest fr : promotion.PartnerFundRequests){
                remainingDollars += fr.RequestedAmount;
            }
            remainingDollars = promotion.Amount - remainingDollars;
        return remainingDollars;
    }
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Custom inner class to bundle potential Fund Requests and custom attributes.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/
    public with sharing class FundReqWrapper {
        @AuraEnabled public Decimal budgetAmount;
        @AuraEnabled public ACE_approveAndReleaseClass.FundReqCustom[] fundRequests;
        @AuraEnabled public Spend_Type__c[] spendTypeOptions;

        public FundReqWrapper(Decimal budgetAmt, Spend_Type__c[] spendTypes){
            this.fundRequests = new ACE_approveAndReleaseClass.FundReqCustom[]{};
            this.budgetAmount = budgetAmt;
            this.spendTypeOptions = spendTypes;
        }
    }

    public class FundReqCustom {
        @AuraEnabled public Boolean fundRequestCheck;
        @AuraEnabled public PartnerFundRequest fundRequestSF;
        @AuraEnabled public String name;
        @AuraEnabled public String accountNumber;
        @AuraEnabled public String internalOrderNumber;
        @AuraEnabled public String spendTypeName;

        public FundReqCustom(PartnerFundAllocation promotion, Account shipTo){
            this.fundRequestSF = new PartnerFundRequest();
            this.fundRequestSF.Title = promotion.Title;
            this.fundRequestSF.ACE_Event_Organizer__c = 'eventOrg';
            this.fundRequestSF.RequestedAmount = 0;
            this.fundRequestSF.ACE_Spend_Type__c = promotion.ACE_Spend_Type__c;
            this.fundRequestSF.ACE_Internal_Order__c = promotion.ACE_Internal_Order__c;
            this.fundRequestSF.ACE_Co_Op_Event__c = promotion.ACE_Co_Op_Event__c;
            this.fundRequestSF.ACE_Start_Date__c = promotion.ACE_Start_Date__c;
            this.fundRequestSF.ACE_End_Date__c = promotion.ACE_End_Date__c;
            this.fundRequestSF.BudgetId = promotion.BudgetId;
            this.fundRequestSF.AllocationId = promotion.id;
            this.fundRequestSF.Account_Ship_To__c = shipTo.id;
            this.fundRequestSF.ChannelPartnerId = promotion.channelPartnerId;
            this.fundRequestSF.ACE_Status__c = promotion.ACE_Co_Op_Event__c ? 'Open' : 'Approved';
            this.accountNumber=shipTo.AccountNumber;
            this.name = shipTo.name;
            this.fundRequestCheck = false;
            this.internalOrderNumber = promotion.ACE_Internal_Order__c == null || promotion.ACE_Internal_Order__r.ACE_Internal_Order_Nbr__c == null ? 'Enter IO' : promotion.ACE_Internal_Order__r.ACE_Internal_Order_Nbr__c;

        }
    }
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Custom inner class to bundle data needed to initialize Fund Request component.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2018  Alexandria Sanborn
------------------------------------------------------------*/
    public class initPromoAndStates {
        @AuraEnabled
        public String currentPromoStatus;
        @AuraEnabled
        public String[] states;

        public initPromoAndStates(String status, String[] states){
            this.currentPromoStatus = status;
            this.states = states;         
        }
    }
}