/*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:   Schedulable class to share records based on GRE/DSM/Ship-To Account Hierarchy
			To schedule via Anonymous Apex, copy/paste the following: 
			System.schedule('ACE Hierarchy Sharing', '0 0 0 * * ?', new ACE_HierarchySharingScheduled());
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Alexandria Sanborn
------------------------------------------------------------*/
global class ACE_HierarchySharingScheduled implements Schedulable {

//Runs daily at midnight
public static string CRON_EXP='0 0 0 * * ?';

   global void execute(SchedulableContext sc) {
      Integer accHerarchyReqBatchSize = Integer.valueOf(Label.ACE_AccountSharingBatch_size);
      database.executebatch(new ACE_AccountSharingBatchable(),accHerarchyReqBatchSize);
   }
}