global class ACE_FundRequestReimburseSchedular implements Schedulable{
//Runs daily at midnight
global static string CRON_EXP='0 0 0 * * ?';

   global void execute(SchedulableContext sc) {
      Integer fundRequestBatchSize = Integer.valueOf(Label.ACE_fundReqSharingBatch_Size);
      database.executebatch(new ACE_FundRequestBatchable(),fundRequestBatchSize);
   }
}