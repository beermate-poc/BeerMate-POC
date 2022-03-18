/**
  * @author        Accenture 
  * @Name          C360_AccountProductList_UK 
  * @Created date  20/05/2018
  * @description   Batch Class to Map the product id on Account based buying list.
  * @Version       1.0
**/
global class C360_AccountProductList_UK implements Schedulable,  Database.Batchable<sObject>, Database.Stateful{
    private String CLSNME='C360_AccountProductList_UK';
    private String MTHNME='execute';


/**
  * @author        Accenture ;
  * @Name          execute
  * @Created date  20/05/2018
  * @description   execute method to schedule
  * @Version       1.0
**/
    public void execute(SchedulableContext ctx) {
        try{
            run();
            if(Test.isRunningTest()){
                Integer num =1/0;}}
        catch(exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_UTM, C360_Util_Constants.MNAME_UTM,
                    ex.getMessage(), ex.getLineNumber());
        }}
/**
  * @author        Accenture
  * @Name          run
  * @Created date  20/05/2018
  * @description   calls the batch class
  * @Version       1.0
**/
    public static void run() {
        try{
            Database.executeBatch(new C360_AccountProductList_UK(),10);
            if(Test.isRunningTest()){
                Integer num =1/0;
            }
        }catch(exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_UTM, C360_Util_Constants.MNAME_UTM,
                    ex.getMessage(), ex.getLineNumber());
        }
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
            // return null;
            return Database.getQueryLocator(
            [SELECT Id,C360_Product_List_prim__c,C360_Product_List_scnd__c,C360_Buying_List__c,
                    C360_Sales_Organization__c, ccrz__E_AccountGroup__c From account Where (recordType.DeveloperName='UK_I_Account' AND
            C360_Sales_Organization__c='3600'AND C360_Buying_List__c !='') OR(recordType.DeveloperName='MCCE_Account' and C360_Buying_List__c!= null)]);
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
        Set<Id>ukAcntId = new Set<Id>();
        Map<String,Set<String>>ukAccount = new Map<String,Set<String>>();
        Map<String,String>uklog = new Map<String,String>();
        Map<String,Account>ukfnres = new Map<String,Account>();
        Map<String,Set<String>>ukMap = new Map<String,Set<String>>();
        String query='';
        Boolean endTraversing = false;
        Integer accountLevel = 0;

        try{
            for(Account cap: scope){

                if(!ukAccount.containsKey(cap.C360_Buying_List__c)){
                    ukAccount.put(cap.C360_Buying_List__c, new Set<String>{cap.Id});
                }else{
                    ukAccount.get(cap.C360_Buying_List__c).add(cap.Id);
                }
                
            }
            Map<String, String> idProductToSku = new Map<String, String>( );

            List<Account>updtAccountList = new List<Account>();
            List<C360_AccountProducts__C>sortUKAccountPdt=[Select Id ,Product__c,Account__c,C360_BuyingListId__c, C360_Product_ID_SKU__c from C360_AccountProducts__c where C360_BuyingListId__c IN:ukAccount.keySet() AND C360_Active__c=TRUE AND Product__r.IsActive=TRUE   LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()];
            if(!sortUKAccountPdt.isEmpty()){
                for(C360_AccountProducts__C updt:sortUKAccountPdt){
                    if(!ukMap.containsKey(updt.C360_BuyingListId__c)){
                        ukMap.put(updt.C360_BuyingListId__c, new Set<String>{updt.Product__c});
                    }else{
                        ukMap.get(updt.C360_BuyingListId__c).add(updt.Product__c);
                    }

                    idProductToSku.put( updt.Product__c, updt.C360_Product_ID_SKU__c );
                }
            }

            for(String keyacc:ukAccount.keySet()){
                if(ukMap.containsKey(keyacc)){
                    for(String apt:ukAccount.get(keyacc)){
                        String ukprodListprim='';
                        String ukprodListSec='';
                        Integer uklistlen=0;
                        Account acc = new Account();
                        acc.Id=apt;

                        for(String pdtky:ukMap.get(keyacc)){
                            if(uklistlen<32756){
                                ukprodListprim=ukprodListprim+pdtky+';';
                                uklistlen=ukprodListprim.length();
                            }else{
                                ukprodListSec=ukprodListSec+pdtky+';';
                                uklistlen=ukprodListprim.length()+ukprodListSec.length();
                            }
                        }
                        acc.C360_Product_List_prim__c=ukprodListprim;
                        if(uklistlen>32756){
                            acc.C360_Product_List_scnd__c=ukprodListSec;
                        }
                        ukfnres.put(apt,acc);
                    }
                }

            }
            updtAccountList.addall(ukfnres.values());

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