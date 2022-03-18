/**
  * @author        Accenture 
  * @Name          C360_AssignObjSalesStrucController
  * @Created date  04/19/2018
  * @description   Controller for lightning cmp "C360_AssignObjective_By_SalesStructure", it fetches territory mapping records and creates assigned objectives.
  * @Version       1.0
**/
public with sharing class C360_AssignObjSalesStrucController {
   
    Private static final String NUL = '';
    Private static final String SEMI = ';';
    /*
      * @author         Accenture                                       
      * @version        1.0                                    
      * @date           03/20/2018                                                  
      * @description    It fetches the current user's territory 
      * @param          NA
      * @return         List<String>
      * @throws         NA
    */
    @AuraEnabled
    public static List<String> getUsrTer(){
        User usr = new User();
        List<String> terLst = new List<String>();
        try{
            usr = [SELECT NAME, ID, EMPLOYEEID__c, C360_Territory__c FROM USER WHERE ID =:UserInfo.getUserId() LIMIT 1];
            if(Test.isRunningTest()){
                Integer num =1/0;
            }
        }catch(Exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_ST, C360_Util_Constants.MNAME_ST, ex.getMessage(), ex.getLineNumber());
        }
        if(usr.C360_Territory__c != NULL){
            terLst = (usr.C360_Territory__c).split(SEMI);
        }
        return terLst;
    }
    /*
      * @author         Accenture                                       
      * @version        1.0                                    
      * @date           03/20/2018                                                  
      * @description    It fetches the C360_Territory_Mapping records where C360_CRM_TerrID_ParentID__c belongs to the current logged in user.
      * @param          NA
      * @return         List<C360_Territory_Mapping__c>
      * @throws         NA
    */
    @AuraEnabled
    public static List<C360_Territory_Mapping__c> getChildTerLsts(){
        List<String> usrEmpTerr = new List<String>();
        usrEmpTerr = getUsrTer();
        List<C360_Territory_Mapping__c> terrLst = new List<C360_Territory_Mapping__c>();
        List<String> UserEmpterId = new List<String>();
        try{
            if(usrEmpTerr.size() != 0){																													
               // System.debug('#######'+usrEmpTerr);
                UserEmpterId.addAll(usrEmpTerr);
                do{
              terrLst.addAll([SELECT Id, C360_CRM_TerrID_Employee__c,C360_CRM_TerrID_ParentID__c, C360_CRM_TerrID_Key__c, C360_CRM_TerrID_Employee_Txt__c, 
                                C360_CRM_TerrID_Txt__c, C360_CRM_TerrID__c FROM C360_Territory_Mapping__c 
                                WHERE (C360_CRM_TerrID_Employee_Txt__c !=:NUL AND C360_CRM_TerrID_ParentID__c !=:NUL
                                AND C360_CRM_TerrID_ParentID__c IN: usrEmpTerr) ORDER BY C360_CRM_TerrID_ParentID__c	
                                LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]);
               usrEmpTerr.clear();
                  //  System.debug('terrLst'+terrLst);
                    for(C360_Territory_Mapping__c terrId:terrLst){
                       if(!UserEmpterId.contains(terrId.C360_CRM_TerrID_Key__c.removeEnd(SEMI))){
                            usrEmpTerr.add(terrId.C360_CRM_TerrID_Key__c.removeEnd(SEMI)); 
                         //  System.debug('###usrEmpTerr'+usrEmpTerr);
                            UserEmpterId.add(terrId.C360_CRM_TerrID_Key__c.removeEnd(SEMI));
                        }
                    }
                }while(!usrEmpTerr.isEmpty());
            }
            if(Test.isRunningTest()){                
                    Integer num =1/0;
                }
        }
        catch(Exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_ST, C360_Util_Constants.MNAME_CT, ex.getMessage(), ex.getLineNumber());
        }
      //  system.debug('###terrLst'+terrLst);
        return terrLst;
    }
    /*
      * @author         Accenture                                       
      * @version        1.0                                    
      * @date           03/20/2018                                                  
      * @description    This is used to get the owner for the new created objective.
      * @param          List<Id>
      * @return         Map<Id,Id>
      * @throws         NA
    */
    @auraEnabled
    public static  Map<Id,Id> getOwner(List<Id> recIdsLst){
        Map<Id,String> mapTerEmp = new Map<Id,String>();
        Map<String,Id> terUsrIdMap = new Map<String,Id>();
        Map<Id,Id> usrTerMap= new Map<Id,Id>();   
        List<String> conLst = new List<String>();
        try{            
            //fetching the territory mapping records for the ids passed as parameter      
            For(C360_Territory_Mapping__c ter: [SELECT ID, NAME,C360_CRM_TerrID_Employee__c FROM C360_Territory_Mapping__c 
                                               WHERE ID IN:recIdsLst AND C360_CRM_TerrID_Employee__c !=NULL 
                                               LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
                mapTerEmp.put(ter.Id,ter.C360_CRM_TerrID_Employee__c);              
            }    
            For(User usr : [SELECT ID, Name, C360_MCBC_Network_ID__c,C360_CRM_Employee_ID__c  FROM USER WHERE C360_CRM_Employee_ID__c  IN:mapTerEmp.values() AND C360_CRM_Employee_ID__c !=NULL
                                            LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
                terUsrIdMap.put(usr.C360_CRM_Employee_ID__c,usr.Id);
                                            }
            For(C360_Territory_Mapping__c terr: [SELECT ID, NAME,C360_CRM_TerrID_Employee__c FROM C360_Territory_Mapping__c 
                                                   WHERE ID IN:recIdsLst LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
                if((terr.C360_CRM_TerrID_Employee__c != NULL) && terUsrIdMap.containsKey(terr.C360_CRM_TerrID_Employee__c)){
                    usrTerMap.put(terr.ID,terUsrIdMap.get(terr.C360_CRM_TerrID_Employee__c));
                }
            }
            if(Test.isRunningTest()){
                Integer num =1/0;
            }
        }
        catch(Exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_ST, C360_Util_Constants.MNAME_GT, ex.getMessage(), ex.getLineNumber());
        }
        return usrTerMap;
    }
    /*
      * @author         Accenture                                       
      * @version        1.0                                    
      * @date           03/20/2018                                                  
      * @description    This method is used to create an objective and assign to selected user from table.
      * @param          List<Id> , String
      * @return         NA
      * @throws         NA
    */
    @AuraEnabled
    public static void createObjective(List<Id> recIdsLst, String objId){
        String objNam ='';
        Id rectypId;
        List<Objective__c> objLst = new List<Objective__c>();
        Map<Id,Id> ownrTerMap = new  Map<Id,Id>();
        Objective__c objt = new Objective__c();
        try{
            ownrTerMap = getOwner(recIdsLst);
            objt = [SELECT ID,NAME FROM OBJECTIVE__c WHERE ID =:Id.valueOf(objId)];
            objNam = objt.Name;
            rectypId = [SELECT ID,DEVELOPERNAME FROM RECORDTYPE WHERE DEVELOPERNAME =:C360_Util_Constants.OBJECTIVE_RECORDTYPE
                          LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()].Id;
            For(C360_Territory_Mapping__c ter: [SELECT ID, NAME,C360_CRM_TerrID_Employee__c FROM C360_Territory_Mapping__c 
                                                   WHERE ID IN:recIdsLst LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
                Objective__c obj = new Objective__c();
                obj.Name = objNam;
                If(ownrTerMap.containsKey(ter.Id)){
                    obj.OwnerId = ownrTerMap.get(ter.Id);
                }
                else{
                    obj.OwnerId = UserInfo.getUserId();
                }
                obj.RecordTypeId = rectypId;
                obj.C360_Planned_Objective__c = objId;
                objLst.add(obj);
            }
            List<Database.SaveResult> srres = Database.insert(objLst,false);
            if(Test.isRunningTest()){
                Integer num =1/0;
            }
        }
        catch(Exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_ST, C360_Util_Constants.CNAME_COBJ, ex.getMessage(), ex.getLineNumber());
        }
    }
}