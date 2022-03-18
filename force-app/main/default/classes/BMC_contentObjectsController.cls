/**
@Author Accenture
@name BMC_contentObjectsController
@CreateDate  7/15/2019
@Description Trigger handler to update all the attachments public url in a single field on chain exceution .
@Version <1.0>
*/
public without sharing class BMC_contentObjectsController {
    
    /**
*  @description: Generate public URL for the added attachments an add these into a field on a Chain Execution record. 
*  @name: generateLinks
*  @param: mapContentDocIdsToChainExecution: Content document record with the related chain Execution record.
*  @return: void
*/
    public static void generateLinks(map<Id, BMC_Chain_Activity__c> mapContentDocIdsToChainExecution)
    {
        list<ContentDistribution> contentDistList = new list<ContentDistribution>();
        ContentDistribution contentDistObj;
        try{
            for(ContentVersion contentVersionVar : [select id,Title from contentversion where contentdocumentid IN: mapContentDocIdsToChainExecution.keyset() 
                                                    LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())])
            {
                contentDistObj = new ContentDistribution();
                contentDistObj.name = contentVersionVar.Title;
                contentDistObj.ContentVersionId = contentVersionVar.id;
                contentDistObj.PreferencesAllowOriginalDownload = true;
                contentDistObj.PreferencesAllowPDFDownload = true;
                contentDistObj.PreferencesAllowViewInBrowser = true;
                contentDistObj.PreferencesNotifyOnVisit = false;
                contentDistList.add(contentDistObj); 
            }             
            database.insert(contentDistList);
            
            list<BMC_Chain_Activity__c> lstBMCChainActivityToUpdate = new list<BMC_Chain_Activity__c>();
            
            for(ContentDistribution contentDistVar : [select DistributionPublicUrl, name, ContentVersionId, PreferencesAllowOriginalDownload,ContentDocumentId from ContentDistribution 
                                                      where Id IN: contentDistList LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())])
            {
                
                if(mapContentDocIdsToChainExecution.containskey(contentDistVar.contentdocumentid)){
                    BMC_Chain_Activity__c oChainExecutions = mapContentDocIdsToChainExecution.get(contentDistVar.contentdocumentid);
                    if( oChainExecutions.BMC_Attachment_Links__c == null)
                    {
                        oChainExecutions.BMC_Attachment_Links__c =  contentDistVar.DistributionPublicUrl;
                    }
                    else
                    {
                        oChainExecutions.BMC_Attachment_Links__c =oChainExecutions.BMC_Attachment_Links__c + Constants.NEW_LINE + contentDistVar.DistributionPublicUrl;
                    }
                    lstBMCChainActivityToUpdate.add(oChainExecutions);
                }
            }
            
            if(!lstBMCChainActivityToUpdate.isEmpty()){
                database.update(lstBMCChainActivityToUpdate);
            }
        }
        catch(Exception e){
            throw new DMLException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
        
    }
    
    /**
*  @description: Delete attachment public url from a field when that attachment is deleted on Chain Execution record
*  @name: deleteLinks
*  @param: contentDocumentList : Attachment records that are deleted.
*  @return: void
*/
    public static void deleteLinks(List<ContentDocument> contentDocumentList)
    {
        list<Id> lstContentDocumentId = new list<Id>();
        list<BMC_Chain_Activity__c> chainExecutionListToUpdate  = new List<BMC_Chain_Activity__c>();
        
        map<Id, ContentDocumentLink> mapContentDocumentToContentDocLink = new map<Id, ContentDocumentLink>();
        map<ContentDocumentLink,contentDistribution> mapContentDocLinkToContentDistribution = new map<ContentDocumentLink,contentDistribution>();
        
        for(ContentDocument oContDoc : contentDocumentList){
            lstContentDocumentId.add(oContDoc.Id);
        }
        
        for(ContentDocumentLink objContentDocLink : [select  id,ContentDocumentId,LinkedEntityId from ContentDocumentLink where ContentDocumentId IN : lstContentDocumentId
                                                     LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                         if(objContentDocLink.LinkedEntityId.getsobjecttype() == BMC_Chain_Activity__c.sObjectType) {
                                                             mapContentDocumentToContentDocLink.put(objContentDocLink.ContentDocumentId,objContentDocLink);
                                                         }
                                                     }
        list<Id> lstLinkedEntityIds = new list<Id>();
        map<Id,BMC_Chain_Activity__c> mapLinkEntityIdsToRecord = new map<Id,BMC_Chain_Activity__c>();
        for(ContentDistribution objContentDistribution : [select DistributionPublicUrl, name,ContentDocumentId, ContentVersionId, PreferencesAllowOriginalDownload from ContentDistribution 
                                                          where ContentDocumentId IN : lstContentDocumentId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                              
                                                              if(mapContentDocumentToContentDocLink.containsKey(objContentDistribution.ContentDocumentId)){
                                                                  mapContentDocLinkToContentDistribution.put(mapContentDocumentToContentDocLink.get(objContentDistribution.ContentDocumentId),objContentDistribution);
                                                                  lstLinkedEntityIds.add(mapContentDocumentToContentDocLink.get(objContentDistribution.ContentDocumentId).LinkedEntityId);
                                                              }
                                                          }
        if(!lstLinkedEntityIds.isEmpty()){
            for(BMC_Chain_Activity__c oChainExecutions : [select Id,BMC_Attachment_Links__c from BMC_Chain_Activity__c
                                                          where id IN: lstLinkedEntityIds LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                              mapLinkEntityIdsToRecord.put(oChainExecutions.Id,oChainExecutions);
                                                          }
        }
        if(!mapContentDocLinkToContentDistribution.isEmpty()){
            BMC_Chain_Activity__c oChainExecutions;
            list<ID> lstCA = new  list<ID>();
            
            for(ContentDocumentLink oContentDocLink : mapContentDocLinkToContentDistribution.keyset()){                
                
                if(mapLinkEntityIdsToRecord.containsKey(oContentDocLink.LinkedEntityId) && !lstCA.contains(oContentDocLink.LinkedEntityId)){
                    oChainExecutions = mapLinkEntityIdsToRecord.get(oContentDocLink.LinkedEntityId);
                }
                lstCA.add(oContentDocLink.LinkedEntityId);
                
                if((oChainExecutions.BMC_Attachment_Links__c).contains(((mapContentDocLinkToContentDistribution.get(oContentDocLink)).DistributionPublicUrl))){
                    oChainExecutions.BMC_Attachment_Links__c = oChainExecutions.BMC_Attachment_Links__c.replace(((mapContentDocLinkToContentDistribution.get(oContentDocLink)).DistributionPublicUrl), constants.BLANK_WITHOUTSPACE);
                    if(!chainExecutionListToUpdate.contains(oChainExecutions))
                    chainExecutionListToUpdate.add(oChainExecutions);
                    
                }
                
            }
        }
        if(!chainExecutionListToUpdate.isEmpty()){
            try{
                database.update(chainExecutionListToUpdate);
            }
            catch(Exception e){
                throw new DMLException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
            }
        }
    }
}