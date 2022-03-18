global class AssignObjectiveBatchSourceUI implements Database.Batchable<sObject>, Database.Stateful{
    private static string NAATTHISLEVEL = 'N/A at this level';
    private static string CANADAACC = 'C360_Account';
    private static string UKIACC = 'UK_I_Account';
    private static string INTEGRATIONSTR = 'Integration';
    private final string q;
    private final Objective__c ObjectiveRec;
    private final string UserInfo;
    Map<id,String> traccmap = new Map<id,String>();
    List<String>F1CRMID = New List<String>();
     Id rectypId;
    private List<Id>  recIdsLst;
    private Set<string> accountSet= new Set<string>();
    global AssignObjectiveBatchSourceUI(String query,Objective__c ObjectiveRec,id userInfo, List<Id> recIdsLst){
     	this.q=query;
        this.ObjectiveRec= ObjectiveRec;
        this.UserInfo= userInfo;
        this.recIdsLst = recIdsLst;
        system.debug('##'+this.recIdsLst);
        rectypId = [SELECT ID,DEVELOPERNAME FROM RECORDTYPE WHERE DEVELOPERNAME =:C360_Util_Constants.OBJECTIVE_RECORDTYPE
                        LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()].Id;
    }
     global  Database.QueryLocator start(Database.BatchableContext BC){
        	
           return Database.getQueryLocator(q);
        
    }
    global void execute(Database.BatchableContext bc, List<sObject> scope){
        Objective__c obj ;
        List<Objective__c> listToinsert = new  List<Objective__c>();
        List<Target_Account__c> targetList = (List<Target_Account__c>)scope;
        
       /******* User Map of to check if F1 of Territory is Inactive OR Null - CA *********/
        
        List<Id> canadaSalesRepList = new List<Id>();
        List<User> salesRepActive = new List<User>();
        Set<Id> usersetCanada= new set<Id>();

        for(Target_Account__c tac : targetList){
           canadaSalesRepList.add(tac.Account_Name__r.C360_Sales_Rep__c);
        }
        
        for(User u : [Select Id, ISActive from user where ID IN :canadaSalesRepList  AND ISActive=true]){
            usersetCanada.add(u.id);   
        }

        /**********************************************************************/ 

         for (Target_Account__c a : targetList) {
               if(a.Account_Name__r.C360_F1_SAP_ID__c!=null && a.Account_Name__r.C360_F1_SAP_ID__c!=NAATTHISLEVEL){
                   F1CRMID.add(a.Account_Name__r.C360_F1_SAP_ID__c);
                   traccmap.put(a.id,a.Account_Name__r.C360_F1_SAP_ID__c); 
                }
         }
       
         	Map<String,String> usermap= new Map<String,String>();
            for(user usrrec:[Select Id,C360_F1_CRM_ID__c,isactive FROM USER WHERE C360_F1_CRM_ID__c IN:F1CRMID AND C360_F1_CRM_ID__c!=Null AND ISActive=true]){
                if(usrrec.isactive==true){
                    usermap.put(usrrec.C360_F1_CRM_ID__c,usrrec.id);  
                }
            }
        
           
          for(Target_Account__c trAc : targetList ){
                                             if(!accountSet.contains(trAc.Account_Name__c)){
                                                 obj = new Objective__c();
                                                 obj.Name = ObjectiveRec.Name;
                                                 obj.Objective_type__c = ObjectiveRec.Objective_type__c;
                                                 obj.RecordTypeId = rectypId;
                                                 //obj.C360_Planned_Objective__c = objrecId;
                                                 obj.Objective__c=ObjectiveRec.Id;/*Part of gb-11134*/
                                                 obj.Account__c=  trAc.Account_Name__c;
                                                 obj.Target_Volume_Qty__c = ObjectiveRec.Target_Volume_Qty__c;
                                                 obj.Target_Volume_UOM__c = ObjectiveRec.Target_Volume_UOM__c;
                                                 if(trAc.Account_Name__r.RecordType.DeveloperName == UKIACC ){
                                                        if(traccmap.get(trAc.id)!=null && usermap.Containskey(traccmap.get(trAc.id))){
                                                              obj.OwnerId= usermap.get(traccmap.get(trAc.id));
                                                           }
                                                        else{
                                                            obj.OwnerId=UserInfo;
                                                        }
                                                    }
                                                 /*** Fetching F1 from new Territory2 using Sales Rep field on Account  ***/
                                                 else if(trAc.Account_Name__r.RecordType.DeveloperName == CANADAACC){
                                                     if(trAc.Account_Name__r.C360_Sales_Rep__c!=null && usersetCanada.contains(trAc.Account_Name__r.C360_Sales_Rep__c)){
                                                              obj.OwnerId= trAc.Account_Name__r.C360_Sales_Rep__c;	
                                                           }

                                                }
                                                 
                                                	else{
                                                        if((trAc.Account_Name__r.Owner.Name).contains(INTEGRATIONSTR)){
                                                            obj.OwnerId=UserInfo;
                                                        }else{
                                                            if(trAc.Account_Name__r.owner.isactive){
                                                                  obj.OwnerId=trAc.Account_Name__r.OwnerId;
                                                            }
                                                          
                                                        }
                                                    }
                                                 listToinsert.add(obj);
                                                 accountSet.add(trAc.Account_Name__c); 
                                             }
                                         }
        if(listToinsert.size() >0){
            database.insert(listToinsert,false);
        }
   }
    
    global void finish(Database.BatchableContext BC){
    
    }
    

}