global class BMC_GenerateConga_Account implements Database.Batchable<sObject>{
    String ACTIVE='ACTIVE';
    global Database.QueryLocator start(Database.BatchableContext bc)
    {
        String query='select id,Generate_Conga_Document__c from Account where   statusNme__c =: ACTIVE and RecordType.Name = \''+Label.Account_Record_Type_Distributor+'\' ORDER BY ID';
        return Database.getQueryLocator(query); 
    }
    
    global void execute(Database.BatchableContext bc, List<Account> accList)
    {
        for(Account accObj: accList)
        {
            accObj.Generate_Conga_Document__c =true;
        }
        update accList;
    }
    
    global void finish(Database.BatchableContext bc)
    {
        
    }
}