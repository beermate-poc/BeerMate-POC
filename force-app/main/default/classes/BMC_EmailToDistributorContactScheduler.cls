global class BMC_EmailToDistributorContactScheduler implements Schedulable {
    public static string CRON_EXP='0 0 0 * * ?';

    global void execute(SchedulableContext sc) {
        BMC_SendEmailToDistributorContact accountBatch = new BMC_SendEmailToDistributorContact();
        database.executebatch(accountBatch,200);
    }
}