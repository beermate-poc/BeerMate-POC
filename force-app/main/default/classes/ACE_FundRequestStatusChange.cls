/**
@Author Accenture
@name: ACE_FundRequestStatusChange
@CreateDate  08/05/2019
@Description Includes methods for Fund request Status Change Functionality
@Version <1.0>
*/
public class ACE_FundRequestStatusChange {
    /**
*  @description: Returns the details of Fund Request records. 
*  @name: getFundRequestRecords
*  @param: accountId:Channel Partner Record Id , esdate : End date start date ,eedate end date end date , channel Co-Op event value
*  @return: PartnerFundRequest - Process all records of provided filter condition changing status from Approved to Closed
*/
    @AuraEnabled
    public static void processFundRequestRecords(list<Id> statusChangeList){
        
        list<PartnerFundRequest> lstFRStatusToUpdate = new list<PartnerFundRequest>();
        for(Id fundreq: statusChangeList){
            lstFRStatusToUpdate.add(new PartnerFundRequest(Id = fundreq,ACE_Status__c  ='Closed'));
        }
        if(!lstFRStatusToUpdate.isEmpty()){
            update lstFRStatusToUpdate;
        }
    }
    /**
*  @description: Returns the details of Fund Request records. 
*  @name: displayFundRequestRecords
*  @param: accountId:Channel Partner Record Id , esdate : End date start date ,eedate end date end date , channel Co-Op event value
*  @return: PartnerFundRequest - Returns records of provided filter conditions
*/
    @auraenabled
    public static List<FundRequest> displayFundRequestRecords(Id accountId ,Id allocationId ,date esdate, date eedate , boolean channel){
        System.debug('accountId'+accountId);
        System.debug('allocationId'+allocationId);
        System.debug('esdate'+esdate);
        System.debug('eedate'+eedate);
        System.debug('channel'+channel);
        List<PartnerFundRequest> funds = new  List<PartnerFundRequest>();
        List<FundRequest> allfunds = new  List<FundRequest>();
        if((accountId != null) && (allocationId != null)){
             System.debug('1');
            funds = [SELECT  Id, ChannelPartner.Name, Allocation.Title, Account_Ship_To__r.Name, Title, Description, ACE_Start_Date__c, ACE_End_Date__c, ACE_Status__c, Amount, ACE_Co_Op_Event__c FROM PartnerFundRequest where ACE_Status__c = 'Approved' and ChannelPartnerId =: accountId and AllocationId =: allocationId  and ACE_End_Date__c >=:esdate and ACE_End_Date__c <=: eedate and ACE_Co_Op_Event__c =:channel];
        }
        else if((accountId != null) && (allocationId == null)){
             System.debug('2');
            funds = [SELECT Id, ChannelPartner.Name,Allocation.Title, Account_Ship_To__r.Name, Title, Description, ACE_Start_Date__c, ACE_End_Date__c, ACE_Status__c, Amount, ACE_Co_Op_Event__c FROM PartnerFundRequest where ACE_Status__c = 'Approved' and  ChannelPartnerId =: accountId and ACE_End_Date__c >=:esdate and ACE_End_Date__c <=: eedate and ACE_Co_Op_Event__c =:channel];
        }
        else if((accountId == null) && (allocationId != null)){
             System.debug('3');
            funds = [SELECT Id, ChannelPartner.Name,Allocation.Title, Account_Ship_To__r.Name, Title, Description, ACE_Start_Date__c, ACE_End_Date__c, ACE_Status__c, Amount, ACE_Co_Op_Event__c FROM PartnerFundRequest where ACE_Status__c = 'Approved' and AllocationId =: allocationId  and ACE_End_Date__c >=:esdate and ACE_End_Date__c <=: eedate and ACE_Co_Op_Event__c =:channel];
        }
        else{
             System.debug('4');
            funds = [SELECT Id, ChannelPartner.Name,Allocation.Title, Account_Ship_To__r.Name, Title, Description, ACE_Start_Date__c, ACE_End_Date__c, ACE_Status__c, Amount, ACE_Co_Op_Event__c FROM PartnerFundRequest where  ACE_Status__c = 'Approved' and ACE_End_Date__c >=:esdate and ACE_End_Date__c <=: eedate and ACE_Co_Op_Event__c =:channel];
        }
        for(PartnerFundRequest fund: funds){
            allfunds.add(new FundRequest(fund.Id, fund.ChannelPartner.Name, fund.Allocation.Title,fund.Account_Ship_To__r.Name, fund.Title, fund.Description, fund.ACE_Start_Date__c, fund.ACE_End_Date__c, fund.ACE_Status__c, fund.Amount,  string.valueOf(fund.ACE_Co_Op_Event__c )));
        }
         System.debug('allfunds'+allfunds);
        return allfunds;
    }
    public class FundRequest {
        @AuraEnabled public Boolean selected {get;set;}
        @AuraEnabled public Id fundReqId {get;set;}
        @AuraEnabled public String channelPartner { get; set; }
        @AuraEnabled public String allocation { get; set; }
        @AuraEnabled public String accountShipTo { get; set; }
        @AuraEnabled public String title { get; set; }
        @AuraEnabled public String description { get; set; }
        @AuraEnabled public Date startDate { get; set; }
        @AuraEnabled public Date endDate { get; set; }
        @AuraEnabled public String status { get; set; }
        @AuraEnabled public Decimal amount { get; set; }
        @AuraEnabled public String coopevent { get; set; }
        public FundRequest (Id fundReqId, String channelName ,String allocationTitle ,String accountName ,String partnerTitle ,String partnerDescription,date partnersDate, date partnereDate , String partnerStatus , Decimal partnerAmount , String partnerCoop){
            this.selected = false;
            this.fundReqId = fundReqId;
            this.channelPartner = channelName; 
            this.allocation = allocationTitle;
            this.accountShipTo = accountName;
            this.title = partnerTitle;
            this.description = partnerDescription;
            this.startDate = partnersDate;
            this.endDate = partnereDate;
            this.status = partnerStatus;
            this.amount = partnerAmount;
            this.coopevent = partnerCoop;
        }
    }
}