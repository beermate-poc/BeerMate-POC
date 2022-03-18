global class BMC_DistributorCongaPurgeScheduler implements Schedulable {
    global void execute(SchedulableContext sc) {
        BMC_DistributorCongaPurge be = new BMC_DistributorCongaPurge();
        database.executeBatch(be,200);
    }
}