/*
@Author RDC Team
@name ADBP_ArchiveBrandFiles
@CreateDate  1/13/2021
@Description Method that move all expired files from Brand Files to a new ArchiveFolder
@Version <1.0>
*/

global class ADBP_ArchiveBrandFiles implements Database.Batchable<SObject>, Database.Stateful {
    private static final string archive='Archived Files';
    private static final string brand='Brand Files';
    
    global ADBP_ArchiveBrandFiles(){
    }
    global  Database.QueryLocator start(Database.BatchableContext BC) {
        date currDate = system.today();
        List<ContentWorkspace> brandFolderId = new List<ContentWorkspace>([Select Id from ContentWorkspace where Name =:brand]);
        Id brandId = brandFolderId[0].Id;
        Set<Id> cdIds = new Set<Id>();
        for(ContentDocumentLink c : [SELECT Id,ContentDocumentId,LinkedEntityId FROM ContentDocumentLink WHERE LinkedEntityId =:brandId]){
            cdIds.add(c.ContentDocumentId);
        }
        return Database.getQueryLocator('SELECT Id,ContentDocumentId,ContentDocument.ParentId FROM ContentVersion WHERE PDE_End_Date__c<:currDate AND ContentDocumentId IN: cdIds AND IsLatest=True');
    }
    global void execute(Database.BatchableContext BC, List<ContentVersion> cvList) {
        List<ContentWorkspace> archiveFolderId = new List<ContentWorkspace>([Select Id from ContentWorkspace where Name =:archive]);
        Id archiveId = archiveFolderId[0].Id;
        List<ContentDocument> cdList = new List<ContentDocument>();
        for(ContentVersion cv : cvList){
            ContentDocument cd = new ContentDocument();
            cd.Id = cv.ContentDocumentId;
            cd.ParentId = archiveId;
            cdList.add(cd);
        }
        update cdList;
    }
    
    global void finish(Database.BatchableContext BC) {
        
    }
}