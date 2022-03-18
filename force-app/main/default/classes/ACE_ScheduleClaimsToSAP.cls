global Class ACE_ScheduleClaimsToSAP implements Schedulable
{
global dateTime currentTimeStamp;
//Call Batch Class
global void execute(SchedulableContext sc) { 
    try
	{
        List<PartnerFundClaim> ptfm = [select id,ACE_Timestamp__c from PartnerFundClaim where ACE_Reimbursement_Status__c='PaymentPending' 
                             and ACE_Timestamp__c!=null order by ACE_Timestamp__c desc limit 1];
       if(!ptfm.isEmpty()){
            currentTimeStamp = ptfm[0].ACE_Timestamp__c;
            
        }
        Integer batchsize = Integer.valueOf(System.Label.ACE_Batch_size_Claims) ;
    	Id batchJobId = Database.executeBatch(new ACE_BatchApprovedClaimsToSAP(currentTimeStamp), batchsize);
    }
    catch(Exception ex)
    {
        System.debug(ex.getMessage());
    }
	
}


//Handle Error 
}