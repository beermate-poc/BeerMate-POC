/********************************************************************************************************************************************************************************************
# Class Name  = "BMC_WTHInsertTargetAccounts"
# Date : July 11th 2018
# Description = This batch class creates Target Accounts for the Where to Hunt Object.
**************************************************************************************************************************************************/ 
global class BMC_WTHInsertTargetAccounts implements Database.Batchable<sObject>, Database.Stateful {
    private List<String> targetIDs=new List<String>();
    private List<String> errorIDs=new List<String>();
    private List<String> outletIds=new List<String>();
    private List<String> notProcessedids=new List<String>();
    private List<String> processedids=new List<String>();
     private List<String>inactiveIDS=new List<String>();
    private Boolean check=true;
    private String allstirng=Constants.BLANK_WITHOUTSPACE;
    private String allinactive=Constants.BLANK_WITHOUTSPACE;
    private Where_to_Hunt__c wthObj;  
    private Id wthListId;
    private string nonChainParent;
    private string inactiveOutlet;
    private Id chainActivityId;
    private Static final String CLASSNAME='BMC_WTHInsertTargetAccounts';
    private Static final String METHODNAME='finish';
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   Constructor method to recieve the Outlet Ids and Where to hunt object.
<Date>      <Authors Name>     <Brief Description of Change>
11/07/2018  Ankita Shanbhag     
------------------------------------------------------------*/
    public BMC_WTHInsertTargetAccounts(List<String> inputvalues ,Where_to_Hunt__c whereToHuntObj,  Id wthId , Id chainId , List<String> errorchildOutlet,List<String> inactiveOutletList) {
        targetIDs = inputvalues;        
        wthObj = whereToHuntObj;
        wthListId = wthId ;
        chainActivityId =  chainId;
        errorIDs = errorchildOutlet;
        inactiveIDS =inactiveOutletList;
    }
    
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  start method to fetch details of accounts for passed outlet Ids
<Date>      <Authors Name>     <Brief Description of Change>
11/07/2018  Ankita Shanbhag     
------------------------------------------------------------*/
    global Database.QueryLocator start(Database.BatchableContext BC) {
        String query = 'SELECT Id FROM Account WHERE OutletCd__c IN :targetIDs  AND RecordType.Name != \''+Label.Account_Record_Type_Distributor+'\''+' AND RecordType.Name != \''+Label.Account_Record_Type_Chain_Parent+'\'';
        return Database.getQueryLocator(query);
    }
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  Exceute method to create Target Accounts for retail outlet Ids
<Date>      <Authors Name>     <Brief Description of Change>
11/07/2018  Ankita Shanbhag     
------------------------------------------------------------*/
    global void execute(Database.BatchableContext BC, List<Account> accountIDS) {
        List<Target_Account__c> targetAccounts = new List<Target_Account__c>();
        for (Account account : accountIDS) {
            Target_Account__c taObj= new Target_Account__c();
            taObj.Account_Name__c=account.Id;
            taObj.Target_List__c=wthListId;
            if(chainActivityId != null){
                taObj.BMC_Chain_Activity_ID__c = chainActivityId;
            }
            targetAccounts.add(taObj);
        }
        Database.insert(targetAccounts); 
    }   
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  Finish method of the batch class
<Date>      <Authors Name>     <Brief Description of Change>
11/07/2018  Ankita Shanbhag     
------------------------------------------------------------*/
    global void finish(Database.BatchableContext BC) {
        try{
            AsyncApexJob a = [SELECT Id, Status, NumberOfErrors, JobItemsProcessed,
                              TotalJobItems, CreatedBy.Email,CreatedBy.Name
                              FROM AsyncApexJob WHERE Id =
                              :BC.getJobId() LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            for(Account accObj: [SELECT ID,OutletCd__c FROM Account WHERE OutletCd__c IN :targetIDs AND RecordType.DeveloperName IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE) and OutletCd__c!=null  LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                outletIds.add(accObj.OutletCd__c);
            }
            
            for(integer i = 0; i<targetIDs.size(); i++)
            {
                if(!outletIds.contains(targetIDs[i]))
                {
                    notProcessedids.add(targetIDs[i]);
                }
                else{
                    processedids.add(targetIDs[i]);
                }
            }
           if(wthObj == null){
                notProcessedids.addAll(errorIDs);
                notProcessedids.addAll(inactiveIDS);
            }
            if(wthObj != null){
                for(String s: notProcessedids){
                    if(!check){
                        allstirng +=Constants.NEW_LINE;
                    }
                    allstirng += s;
                    check = false;
                }
            }
            if(wthObj == null){
                for(String s: errorIDs){
                    if(!check){
                        allstirng +=Constants.NEW_LINE;
                    }
                    allstirng += s;
                    check = false;
                }
                if(!String.isBlank(allstirng)){
                     nonChainParent = Label.BMC_NonChainParent_Hierarchy +Constants.NEW_LINE+allstirng;
                }else{
                    nonChainParent ='';
                }
                for(String s: inactiveIDS){
                    if(!check){
                        allinactive +=Constants.NEW_LINE;
                    }
                    allinactive += s;
                    check = false;
                }
               // System.debug('allinactive'+allinactive);
                if(!String.isBlank(allinactive)){
                     inactiveOutlet = Label.BMC_InactiveOutlets + allinactive;
                }
                else{
                    inactiveOutlet ='';
                }

            }
            if(notProcessedids.size()>0){
                OrgWideEmailAddress[] owea = [select Id from OrgWideEmailAddress where Address =:Label.BMC_WTHOWA_Address LIMIT 1];
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                String[] toAddresses = new String[] {a.CreatedBy.Email};
                    mail.setToAddresses(toAddresses);
                if(wthObj != null){
                    mail.setSubject(Label.BMC_WTH_list+Constants.BLANK_WITHSPACE+wthObj.Name+Constants.BLANK_WITHSPACE+Label.BMC_Created+Constants.BLANK_WITHSPACE+processedids.size()+Constants.BLANK_WITHSPACE+Label.BMC_Success+Constants.BLANK_WITHSPACE+notProcessedids.size()+Constants.BLANK_WITHSPACE+Label.BMC_Errors);
                    mail.setPlainTextBody(Label.BMC_Hi+Constants.BLANK_WITHSPACE+a.CreatedBy.Name+Constants.COMMA+Constants.NEW_LINE+Constants.NEW_LINE+Label.BMC_WTHCreated+Constants.NEW_LINE+Label.BMC_OutOf+Constants.BLANK_WITHSPACE+targetIDs.size()+Constants.BLANK_WITHSPACE+Label.BMC_Following+Constants.BLANK_WITHSPACE+notProcessedids.size()+Constants.BLANK_WITHSPACE+Label.BMC_NotProcessed+Constants.NEW_LINE+allstirng+Constants.NEW_LINE+Constants.NEW_LINE+Label.BMC_Regards+Constants.NEW_LINE+Label.BMC_SystemAdmin+Constants.NEW_LINE+Constants.NEW_LINE+Label.BMC_DoNotReply);
                }
                else{
                    mail.setSubject(Label.BMC_CE_list+Constants.BLANK_WITHSPACE+Label.BMC_Created+Constants.BLANK_WITHSPACE+processedids.size()+Constants.BLANK_WITHSPACE+Label.BMC_Success+Constants.BLANK_WITHSPACE+notProcessedids.size()+Constants.BLANK_WITHSPACE+Label.BMC_Errors);  
                    mail.setPlainTextBody(Label.BMC_Hi+Constants.BLANK_WITHSPACE+a.CreatedBy.Name+Constants.COMMA+Constants.NEW_LINE+Constants.NEW_LINE+Label.BMC_CEOCreated+Constants.NEW_LINE+Label.BMC_OutOf+Constants.BLANK_WITHSPACE+(processedids.size()+notProcessedids.size())+Constants.BLANK_WITHSPACE+Label.BMC_Following+Constants.BLANK_WITHSPACE+notProcessedids.size()+Constants.BLANK_WITHSPACE+Label.BMC_NotProcessed+Constants.NEW_LINE+inactiveOutlet+Constants.NEW_LINE+nonChainParent+Constants.NEW_LINE+Constants.NEW_LINE+Label.BMC_Regards+Constants.NEW_LINE+Label.BMC_SystemAdmin+Constants.NEW_LINE+Constants.NEW_LINE+Label.BMC_DoNotReply);
                }
                if ( owea.size() > 0 ) {
                    mail.setOrgWideEmailAddressId(owea.get(0).Id);
                }   
                Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail },false);
            }
        }
        catch(Exception e){
            ErrorLog.insertErrorLog(CLASSNAME, METHODNAME, e.getMessage(), e.getLineNumber());
        } 
    }
}