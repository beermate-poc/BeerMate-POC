/*
@Author RDC Team
@name ADBP_ArchiveBrandFilesScheduler
@CreateDate  1/13/2021
@Description  Schedule Method for ADBP_ArchiveBrandFiles class.
@Version <1.0>
*/

global class ADBP_ArchiveBrandFilesScheduler implements Schedulable{
    global void execute(SchedulableContext sc) {
        ADBP_ArchiveBrandFiles abf = new ADBP_ArchiveBrandFiles();
        database.executeBatch(abf,200);
    }
}