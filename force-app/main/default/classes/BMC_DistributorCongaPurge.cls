global class BMC_DistributorCongaPurge implements Database.Batchable<SObject>, Database.Stateful {
	private static final string CNAME='BMC_DistributorCongaPurge';
     private static final string MNAME='execute';
    private Static final String ACTIVE_STATUS='ACTIVE';
    global boolean bReRun = false;
    
    global BMC_DistributorCongaPurge(){
    }
    global  Database.QueryLocator start(Database.BatchableContext BC) {
        string query1='SELECT Id from Account where  statusNme__c=: ACTIVE_STATUS  AND RecordType.Name = \''+Label.Account_Record_Type_Distributor+'\'';
        return Database.getQueryLocator(query1);
    }
    global void execute(Database.BatchableContext BC, List<Account> accList) {
        Set<Id> accountMap= new Set<Id>();
            for(Account acct : accList ){
                accountMap.add(acct.Id);
            }
        Set<Id> documentLinkobjs= new  Set<Id>();
        for(ContentDocumentLink cdLinkobj: [SELECT ID,LinkedEntityId,ContentDocumentId from ContentDocumentLink where LinkedEntityId IN: accountMap LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())  ]){
            documentLinkobjs.add(cdLinkobj.ContentDocumentId);
        }
         Set<Id> attachmentsmap= new Set<Id>();
               if(!documentLinkobjs.isEmpty()){
                    for(ContentVersion contentversionObj: [SELECT Id, Title, FileType,CreatedDate, ContentSize, Origin, FileExtension,VersionData , ContentBodyId, 
                                                           ContentDocumentId FROM ContentVersion where Title LIKE :Label.BMC_ReportName and 
                                                           FileType=:Label.BMC_FileType and ContentDocumentId IN : documentLinkobjs LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                                                               if(contentversionObj.CreatedDate.date() <=  date.today()-30 ){
                                                                      attachmentsmap.add(contentversionObj.Id);
                                                                  }   
                                                           }   
                }
        List<ContentDocument> ContentDocumentList= new List<ContentDocument>();
        List < ContentDocument > listFiles = new List < ContentDocument >();
        if(!attachmentsmap.isEmpty()){
        for ( ContentVersion CV : [ SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id IN: attachmentsmap LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())] )
            listFiles.add(new ContentDocument(Id = CV.ContentDocumentId));
        }
        try{
        if ( listFiles.size() > 0 ){
            delete listFiles;
            Database.emptyRecycleBin(listFiles);
        }
        }catch(Exception ex){
          ErrorLog.insertErrorLog(CNAME,MNAME,ex.getMessage(), ex.getLineNumber()); 
        }
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
}