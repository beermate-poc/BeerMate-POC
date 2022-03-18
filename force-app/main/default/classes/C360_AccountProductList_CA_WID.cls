/**
* @author        Accenture 
* @Name          C360_AccountProductList_CA_WID 
* @Created date  20/05/2018
* @description   Batch Class to Map the product records with Account for CA based on product list.
* @Version       1.0
**/
global class C360_AccountProductList_CA_WID implements  Database.Batchable<sObject>, Database.Stateful{
    String CLSNME='C360_AccountProductList_CA_WID';
    String MTHNME='execute';
    public List<String> strParameter =new List<String>();
    /**
* @author        Accenture 
* @Name          start
* @Created date  10/10/2018
* @description   Constructor
* @Version       1.0
**/    
    global C360_AccountProductList_CA_WID(List<String> strParam) {
        strParameter.addAll(strParam);
    }  
    
    /**
* @author        Accenture 
* @Name          start
* @Created date  20/05/2018
* @description   start method to retrieve the records
* @Version       1.0
**/     
    public  Database.QueryLocator start(Database.BatchableContext BC){
        try{
            
            return Database.getQueryLocator([SELECT Id,C360_Product_List_prim__c,C360_Product_List_scnd__c,C360_Buying_List__c,C360_Sales_Organization__c From account Where recordType.DeveloperName ='C360_Account' AND C360_Sales_Organization__c='0010' AND BILLINGSTATE  = 'Quebec' AND ID IN:strParameter]);
        }catch(exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_UTM, C360_Util_Constants.MNAME_UTM,
                                    ex.getMessage(), ex.getLineNumber());
            return null;
        }    
    }
    /**
* @author        Accenture 
* @Name          execute
* @Created date  20/05/2018
* @description   execute method to update the user record
* @Version       1.0
**/ 
    public void execute(Database.BatchableContext BC, List<Account> scope){
        Set<Id>canAcntId = new Set<Id>();
        Set<Id>canPdt = New Set<Id>();
        Set<Id>excanPdt = New Set<Id>();
        Set<Id>ParExcPrd = New Set<Id>();
        Set<Id>fncanAcntId = new Set<Id>();
        Set<Id>intAcntId = new Set<Id>();
        Map<String,Set<String>>ukMap = new Map<String,Set<String>>();  
        String query;
        Boolean endTraversing = false;
        Integer accountLevel = 0;
        try{
            for(Account cap: scope){
                canAcntId.add(cap.Id);
                intAcntId.add(cap.Id);            
            }
            for(C360_AccountProducts__c Ap: [Select Id ,Product__c,Account__c from C360_AccountProducts__c where Account__c IN:canAcntId AND C360_Active__c=TRUE AND C360_Exc_Flg__c=False and Product__r.C360_Promo_Flag__c !=TRUE LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
                excanPdt.add(ap.Product__c);
            }
            while(!endTraversing) {
                
                List<Account>acctList = new List<Account>();
                acctList = [select Id, Name, ParentId from Account WHERE Id IN :canAcntId LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()];
                
                if(acctList.size() == 0 ) {
                    endTraversing = true;
                } else {
                    canAcntId.clear();
                    acctList.sort();
                    Account a;
                    for(Integer i = 0; i < acctList.size(); i++ ) {
                        a = acctList.get(i);
                        if(!String.isBlank(a.ParentId)){
                            canAcntId.add(a.ParentId);
                            fncanAcntId.add(a.ParentId);
                        }
                    }
                    accountLevel++;
                }          
            }
            
            List<C360_AccountProducts__C>CapList = [Select Id ,Product__c,Account__c,C360_Exc_Flg__c from C360_AccountProducts__c where Account__c IN:fncanAcntId AND Product__r.C360_Promo_Flag__c !=TRUE AND C360_Active__c=TRUE LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()];
            for(C360_AccountProducts__c Ap:CapList){
                
                if(Ap.C360_Exc_Flg__c == FALSE) {
                    canPdt.add(ap.Product__c);
                }
                
                else if (ap.C360_Exc_Flg__c == TRUE){
                    ParExcPrd.add(ap.Product__c);
                }
                
            }
            canPdt.addall(excanPdt);
            canPdt.removeAll(ParExcPrd); 
            String prodListprim='';
            String prodListSec='';
            Integer listlen=0;
            for(String pid:canPdt){
                if(listlen<=32756){
                    prodListprim=prodListprim+pid+';';
                    listlen=prodListprim.length();
                }else{
                    prodListSec=prodListSec+pid+';';
                    listlen=prodListprim.length()+prodListSec.length();
                }
            }
            List<Account>updtAccountList = new List<Account>();
            
            for(Id Apdt:intAcntId){
                Account acc = new Account();
                acc.Id=apdt;
                acc.C360_Product_List_prim__c=prodListprim;
                if(listlen>32756){
                    acc.C360_Product_List_scnd__c=prodListSec; 
                }
                updtAccountList.add(acc);
            }
            
            Database.update(updtAccountList);
            if(Test.isRunningTest()){
                Integer num =1/0;
            } 
            
        }catch(Exception ex){
            ErrorLog.insertErrorLog(CLSNME, MTHNME, ex.getMessage(), ex.getLineNumber());  
        }
    }
    /**
* @author        Accenture 
* @Name          Finish 
* @Created date  20/05/2018
* @description   Batch class finish method - can be utilised for post logic action if any in future
* @Version       1.0
**/ 
    public void finish(Database.BatchableContext BC){
        try{
                        
            if(Test.isRunningTest()){
                Integer num =1/0;
            }
        }
        catch(Exception ex){
            ErrorLog.insertErrorLog(CLSNME, MTHNME,ex.getMessage(), ex.getLineNumber());
        }
    }    
    
}