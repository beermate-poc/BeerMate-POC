/*
@Author Mihai Badescu
@name ADBP_CalcObjOnOppProductScheduler
@CreateDate  4/26/2021
@Description Scheduler class for ADBP_CalculateObjectivesOnOppProduct batch class
@Version <1.0>
*/
global class ADBP_CalcObjOnOppProductScheduler implements Schedulable{
    global void execute(SchedulableContext sc) {
        ADBP_CalculateObjectivesOnOppProduct batch = new ADBP_CalculateObjectivesOnOppProduct();
        database.executeBatch(batch,200);
    }
}