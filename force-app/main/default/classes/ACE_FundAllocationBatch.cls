/**
  * @author        Accenture 
  * @Created date  01/12/2018
  * @description   Handles Batch Processing of Allocation to PI.
  * @Version       1.0
**/
global class ACE_FundAllocationBatch implements Database.Batchable<sobject>,Database.AllowsCallouts {
    global ACE_FundAllocationBatch()
    {}
    global Database.Querylocator start (Database.BatchableContext BC) {
        String query = 'SELECT Id, Title, ACE_FY_Promotion_ID__c, Description, Amount, ACE_Start_Date__c, ACE_End_Date__c, ACE_Co_Op_Event__c, ChannelPartner.Accountnumber, ACE_Status__c, ACE_Promo_Counter__c, RecordType.Name FROM PartnerFundAllocation';
        return Database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext bc, List<PartnerFundAllocation> all){
        List<ACE_FundAllocationStub.FundAllocation_element> allocationList = new List<ACE_FundAllocationStub.FundAllocation_element>();
        List<ACE_FundAllocationStub.Response_element> response = new List<ACE_FundAllocationStub.Response_element>();
        List<String> fundAllocationList = new List<String>();
        try{
            System.debug('all'+all.size());
            for(PartnerFundAllocation ptf:all){
                ACE_FundAllocationStub.FundAllocation_element fall = new ACE_FundAllocationStub.FundAllocation_element();
                fall.Title = ptf.Title;
                fall.ACE_FY_Promotion_ID_c = ptf.ACE_FY_Promotion_ID__c;
                fall.Description = ptf.Description;
                fall.Amount = String.valueOf(ptf.Amount);
                fall.ACE_Start_Date_c = String.valueOf(ptf.ACE_Start_Date__c);
                fall.ACE_End_Date_c = String.valueOf(ptf.ACE_End_Date__c);
                fall.ACE_Co_Op_Event_c = String.valueOf(ptf.ACE_Co_Op_Event__c);
                fall.ChannelPartnerId = ptf.ChannelPartner.Accountnumber;
                fall.ACE_Status_c = ptf.ACE_Status__c;
                fall.RecordType = ptf.RecordType.Name;
                allocationList.add(fall);
                fundAllocationList.add(ptf.ACE_FY_Promotion_ID__c);
            }
            System.debug('allocationList.size()'+allocationList.size());
            for(integer i=0;i<allocationList.size();i++){
                system.debug(i+':'+allocationList[i]);
            }
            /*Authenticate the callout*/
            ACE_FundAllocationStub.HTTPS_Port stub = new ACE_FundAllocationStub.HTTPS_Port();
            stub.inputHttpHeaders_x = new Map<String, String>();
            stub.inputHttpHeaders_x.put(ACE_Util_Constants.AUTHORIZATION,ACE_Util_Constants.HANA_ALLOCATION);
            stub.timeout_x =120000;
            /*Make callout using allocationList*/
            response =stub.SI_FundAllocation_SFDC_Sync(allocationList);
            system.debug(response);
        }
        catch(Exception ex){
            ACE_FundAllocationStub.Response_element res = new ACE_FundAllocationStub.Response_element();
            res.Status = 'EXCEPTION';
            response.add(res);
            System.debug('response'+ex.getMessage());
            ErrorLog.insertLogs(fundAllocationList,'ACE_FundAllocationBatch','execute',ex.getMessage(),ex.getLineNumber());
            
        }        
    }
    global void finish(Database.BatchableContext bc){
        database.executebatch(new ACE_FundRequestBatch());
    }    
}