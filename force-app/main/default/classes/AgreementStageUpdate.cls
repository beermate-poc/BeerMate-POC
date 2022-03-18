global class AgreementStageUpdate implements schedulable
{
    global void execute(SchedulableContext sc)
    {
     C360_AgreementStageChangeBatch stageBatchClass = new C360_AgreementStageChangeBatch();
      database.executebatch(stageBatchClass,200);
    }
}