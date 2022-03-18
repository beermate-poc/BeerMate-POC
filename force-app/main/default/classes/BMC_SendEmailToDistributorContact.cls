/**
@Author Accenture
@name BMC_SendEmailToDistributorContact
@CreateDate  2019-06-28
@Description Schedular class to send chain exceution report to Distributor Contacts.
@Version <1.0>
*/
global without sharing class BMC_SendEmailToDistributorContact  implements Database.Batchable<sObject>
{
    private Static final String DISTRIBUTOR_CONTACT='Distributor Contact';
    private Static final String CLASSNAME='BMC_SendEmailToDistributorContact';
    private Static final String METHODNAME='execute';
    private Static final String ACTIVE_STATUS='ACTIVE';
    private Static final String SHIPTO_TYPE='Ship_To';
    private Static final String HIERARCHY_TYPE='Hierarchy';
    global Database.QueryLocator start(Database.BatchableContext bc) {        
        
        String query='select id,BMC_Last_Distributor_Communication_Date__c,Name from Account where  statusNme__c=: ACTIVE_STATUS AND RecordType.Name = \''+Label.Account_Record_Type_Distributor+'\''+'ORDER By Name';
        return Database.getQueryLocator(query);
    } 
    /**
*  @description: method to fetch the document and email it to distributor contact. 
*  @name: execute
*  @param: null
*  @return: void
*/
    global static void execute(Database.BatchableContext BC, List<Account> accList){
        try{
            Map<id,Account> accountMap= new Map<id,Account>();
            Map<id,Id> accconMap= new Map<id,Id>();
            Map<id,id> parentaccMap= new Map<id,id>();
            for(Account accObj:[select id,ParentId,BMC_Last_Distributor_Communication_Date__c from Account where  ID IN: accList LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                accountMap.put(accObj.Id,accObj);
                parentaccMap.put(accObj.Id,accObj.ParentId);
            }
          //  system.debug('accountMap---->'+accountMap);
          //  system.debug('accountMap size---->'+accountMap.size());
          //  system.debug('parentaccMap---->'+parentaccMap);
          //  system.debug('parentaccMap size---->'+parentaccMap.size());
            List<Contact> conList = new List<Contact>();
            Map<Id,List<String>> accContactMap= new  Map<Id,List<String>>();
            
            for(AccountContactRelation acConObj:[Select ID,AccountId,Contact.Email,Account.ParentId,Account.RecordType.Developername,
                                                 Account.Parent.RecordType.DeveloperName from AccountContactRelation where Contact.Active__c=true 
                                                 and Contact.Email != null and BMC_Chain_Execution_Communications__c= true 
                                                 and Contact.recordtype.name=:DISTRIBUTOR_CONTACT and 
                                                 (AccountId IN: accountMap.keySet() OR Account.ParentId IN:accountMap.keySet() OR AccountId IN:parentaccMap.values())
                                                 ORDER By Contact.Email ASC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                     Id accId;
                                                     if(acConObj.Account.RecordType.Developername==Label.Account_Record_Type_Distributor){
                                                         accId=acConObj.AccountId;
                                                     }
                                                     else if(acConObj.Account.RecordType.DeveloperName==SHIPTO_TYPE){
                                                         accId=acConObj.Account.ParentId;
                                                     }
                                                     else if(acConObj.Account.RecordType.DeveloperName==HIERARCHY_TYPE){
                                                         for(Id recordId: parentaccMap.keyset()){
                                                             if(parentaccMap.get(recordId) == acConObj.AccountId){
                                                                 accId=recordId;
                                                             }
                                                         }
                                                         
                                                     }
                                                   //  system.debug('accId---->'+accId);
                                                     if(accContactMap.containsKey(accId)) {
                                                         List<String> emailList=accContactMap.get(accId);
                                                         emailList.add(acConObj.Contact.Email);
                                                         accContactMap.put(accId,emailList);
                                                     }  
                                                     else{
                                                         accContactMap.put(accId, new List<String> {acConObj.Contact.Email});
                                                     }
                                                     
                                                 }
            
            if(!accContactMap.isEmpty()){
                Map<Id,ContentDocumentLink> documentLinkobjs= new  Map<Id,ContentDocumentLink>();
                for(ContentDocumentLink cdLinkobj: [SELECT ID,LinkedEntityId,ContentDocumentId from ContentDocumentLink where LinkedEntityId IN:accountMap.keyset() LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())  ]){
                    documentLinkobjs.put(cdLinkobj.ContentDocumentId,cdLinkobj);
                }
              //  System.debug('documentLinkobjs---->'+documentLinkobjs);
              //  System.debug('documentLinkobjs size---->'+documentLinkobjs.size());
                Map<Id,ContentVersion> attachmentsmap= new Map<Id,ContentVersion>();
                
                if(!documentLinkobjs.isEmpty()){
                    for(ContentVersion contentversionObj: [SELECT Id, Title, FileType,CreatedDate, ContentSize, Origin, FileExtension,VersionData , ContentBodyId, 
                                                           ContentDocumentId FROM ContentVersion where Title LIKE :Label.BMC_ReportName and 
                                                           FileType=:Label.BMC_FileType and ContentDocumentId IN : documentLinkobjs.keySet() LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                                                               if(documentLinkobjs.containsKey(contentversionObj.ContentDocumentId) && 
                                                                  documentLinkobjs.get(contentversionObj.ContentDocumentId).ContentDocumentId == contentversionObj.ContentDocumentId && contentversionObj.CreatedDate.date() ==  date.today() ){ 
                                                                      attachmentsmap.put(documentLinkobjs.get(contentversionObj.ContentDocumentId).LinkedEntityId,contentversionObj);
                                                                  }   
                                                           }   
                }
              //  system.debug('attachmentsmap---->'+attachmentsmap);
              //  system.debug('attachmentsmap size---->'+attachmentsmap.size());
                List<Account> updateLastmodifiedDate= new  List<Account>();
                
                OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address =:Label.BMC_OWD_Address LIMIT 1];
             //   system.debug('owea---->'+owea);
                EmailTemplate template = [select Id from EmailTemplate where Name =:Label.BMC_VF_Template];
             //   System.debug('template---->'+template);
                List<Messaging.SingleEmailMessage> mails = new List<Messaging.SingleEmailMessage> ();
                if(!attachmentsmap.isEmpty()){ 
                    for(Id recordId:accContactMap.keySet()){
                        if(attachmentsmap.containsKey(recordId)){
                          //  System.debug('recordId---->'+recordId);
                            List<Messaging.Emailfileattachment> fileAttachments = new List<Messaging.Emailfileattachment>();               
                            Messaging.Emailfileattachment emailfileattchObj = new Messaging.Emailfileattachment();
                            ContentVersion cvObj =  attachmentsmap.get(recordId)  ;
                          //  System.debug('cvObj---->'+cvObj);
                            emailfileattchObj.setFileName(cvObj.Title);
                            emailfileattchObj.setBody(cvObj.VersionData);
                          //  System.debug('emailfileattchObj---->'+emailfileattchObj);
                            fileAttachments.add(emailfileattchObj);
                            Messaging.SingleEmailMessage mail = Messaging.renderStoredEmailTemplate(template.Id, null,recordId);
                            List<String> toAddressess= new List<String>();
                            mail.setBccAddresses(accContactMap.get(recordId));
                            mail.setFileAttachments(fileAttachments); 
                            mail.saveAsActivity = false;                                        
                            mail.setSubject(Label.BMC_Email_Subject);
                                                    //email exception
                          Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {mail};
                           
                            if ( owea.size() > 0 ) {
                                mail.setOrgWideEmailAddressId(owea.get(0).Id);
                            }                     
                            mails.add(mail);
                          //  System.debug('mails---->'+mails);
                            Account accObj= accountMap.get(recordId);
                            accObj.BMC_Last_Distributor_Communication_Date__c=System.Today();
                            updateLastmodifiedDate.add(accObj);
                        }
                    }
                    // System.debug('mails---->'+mails.size());
                   
                    if(!mails.isEmpty())
                    {
                        //System.debug('mails---->'+mails.size());
                     // Messaging.sendEmail(mails,false);
                          //email exception
                        Messaging.SendEmailResult[] resultMail = Messaging.sendEmail(mails,false);
                        database.update(updateLastmodifiedDate);
                                                //email exception
                        if(resultMail[0].isSuccess()){
                        //System.debug('The email was sent successfully.');

                    }
                                     //email exception
                    else{
                       
                      // System.debug('The email failed to send: ' + resultMail[0].errors[0].message);

                    }
                    
                    }
                   
                } 
            }        
        }
        catch(Exception e){
            ErrorLog.insertErrorLog(CLASSNAME, METHODNAME, e.getMessage(), e.getLineNumber());
        }
    }
    global void finish(Database.BatchableContext BC){
        
    }
}