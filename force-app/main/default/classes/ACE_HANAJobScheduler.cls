global class ACE_HANAJobScheduler  implements Schedulable {
    global void execute(SchedulableContext sc) {
        ACE_FundAllocationBatch allocationBatch = new ACE_FundAllocationBatch();
        database.executebatch(allocationBatch,200);
    }
}