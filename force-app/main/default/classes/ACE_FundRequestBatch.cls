/**
* @author        Accenture 
* @Created date  01/12/2018
* @description   Handles Batch Processing of Allocation to PI.
* @Version       1.0
**/
global class ACE_FundRequestBatch implements Database.Batchable<sobject>,Database.AllowsCallouts {
    global ACE_FundRequestBatch()
    {}
    global Database.Querylocator start (Database.BatchableContext BC) {
        String query = 'SELECT Id, ACE_FY_Fund_Request_ID__c, Title, Amount, ACE_Start_Date__c, ACE_End_Date__c, ACE_Internal_Order__r.ACE_Internal_Order_Nbr__c, ACE_Co_Op_Event__c, RecordType.Name, ChannelPartner.Accountnumber, Account_Ship_To__r.Name, Account_Ship_To__r.AccountNumber, Account_Ship_To__r.C360_Cust_Hierarchy_Lvl3_Code__c, Account_Ship_To__r.PrimaryMgmtUnitDesc__c, ACE_Status__c, Allocation.ACE_FY_Promotion_ID__c, ACE_Spend_Type__r.ACE_Spend_Type_ID__c FROM PartnerFundRequest';
        return Database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext bc, List<PartnerFundRequest> all){
        List<ACE_FundRequestStub.FundRequest_element> requestList = new List<ACE_FundRequestStub.FundRequest_element>();
        List<ACE_FundRequestStub.Response_element> response = new List<ACE_FundRequestStub.Response_element>();
        List<String> fundRequestList = new List<String>();
        try{	
            for(PartnerFundRequest ptf:all){
                System.debug('all'+all.size());
                ACE_FundRequestStub.FundRequest_element freq = new ACE_FundRequestStub.FundRequest_element();
                freq.ACE_FY_Fund_Request_ID_c = ptf.ACE_FY_Fund_Request_ID__c;
                freq.Title = ptf.Title;
                freq.Amount =  String.valueOf(ptf.Amount);
                freq.ACE_Start_Date_c =  String.valueOf(ptf.ACE_Start_Date__c);
                freq.ACE_End_Date_c =  String.valueOf(ptf.ACE_End_Date__c);
                freq.ACE_Internal_Order_c = ptf.ACE_Internal_Order__r.ACE_Internal_Order_Nbr__c;
                freq.ACE_Co_Op_Event_c =  String.valueOf(ptf.ACE_Co_Op_Event__c);
                freq.RecordType = ptf.RecordType.Name;
                freq.ChannelPartnerId = ptf.ChannelPartner.Accountnumber;
                freq.Name = ptf.Account_Ship_To__r.Name;
                freq.Account_Ship_To_c = ptf.Account_Ship_To__r.AccountNumber;
                freq.C360_Region_c = ptf.Account_Ship_To__r.C360_Cust_Hierarchy_Lvl3_Code__c;
                freq.ACE_Status_c = ptf.ACE_Status__c;
                freq.AllocationID = ptf.Allocation.ACE_FY_Promotion_ID__c;
                freq.ACE_Spend_Type_c = ptf.ACE_Spend_Type__r.ACE_Spend_Type_ID__c;
                requestList.add(freq);
                fundRequestList.add(ptf.ACE_FY_Fund_Request_ID__c);
            }
            System.debug('requestList.size()'+requestList.size());
            for(integer i=0;i<requestList.size();i++){
                system.debug(i+':'+requestList[i]);
            }
            /*Authenticate the callout*/
            ACE_FundRequestStub.HTTPS_Port stub = new ACE_FundRequestStub.HTTPS_Port();
            stub.inputHttpHeaders_x = new Map<String, String>();
            stub.inputHttpHeaders_x.put(ACE_Util_Constants.AUTHORIZATION,ACE_Util_Constants.HANA_REQUEST);
            stub.timeout_x =120000;
            /*Make callout using requestList*/
            response=stub.SI_FundRequest_SFDC_Sync(requestList);
        }
        catch(Exception ex){
            ACE_FundRequestStub.Response_element res = new ACE_FundRequestStub.Response_element();
            res.Status = 'EXCEPTION';
            response.add(res);
            System.debug('response'+ex.getMessage());
            ErrorLog.insertLogs(fundRequestList,'ACE_FundRequestBatch','execute',ex.getMessage(),ex.getLineNumber());
        }        
    }
    global void finish(Database.BatchableContext bc){
        //call the new batch job of fund req
        database.executebatch(new ACE_FundClaimBatch());        
    }    
}