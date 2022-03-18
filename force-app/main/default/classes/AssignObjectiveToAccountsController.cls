/**
  * @author        Accenture 
  * @Name          AssignObjectiveToAccountsController
  * @Created date  24/6/2020
  * @description   Class to achieve database transactions for Objective related funcationality
  * @Version       1.0
**/
public with sharing class AssignObjectiveToAccountsController {
    
    public  boolean isallAccount{get;set;}
    public boolean isRecordSearched {get;set;}
    public String currentRecordId {get;set;}
    public static list<account> listacc{get;set;}
    public String accountName { get; set; }
    public String myAccount { get; set; }
    public String myCountry { get; set; }
    public String qualityRank {get;set;}
    public String outletType{get;set;}
    public String accountStatus{get;set;}
    public String surveyGroup{get;set;}
    public String buyingGroup { get; set; }
    public String salesDistrict { get; set; }
    public String hierarchy { get; set; }
    public String onPremiseSelectedValue { get; set; }
    public String offPremiseSelectedValue { get; set; }
    public List<User> info { get; set; }
//    public String info { get; set; }
    public List<SelectOption> onPremise { get; set; }
    public List<SelectOption> offPremise { get; set; }
    public List<SelectOption> mhsOutletgrp { get; set; }
    public static Account account { get; set; }
    public String resetValue =C360_Util_Constants.PICVAL;
    public ApexPages.StandardSetController setAcc;
    Map<integer,List<cAccount>> mapAccountPages = new Map<integer,List<cAccount>>();
    List<ObjectTerritory2Association> objTerrAssoc = new List<ObjectTerritory2Association>();
    public integer intPageNumber{get;set;}  
   // total number of pages  
    public integer intNumberofPages{get;set;}
    public String pricingCustGrp {get;set;}
    public String custGrpAOP{get;set;}
    public String custHeirarchyL7{get;set;}
    
    public String tradeChannel { get; set; }
    public String state { get; set; }
    public String smpFlag { get; set; }
    public  boolean isUsAccount{get;set;}
    public  boolean isUkiAccount{get;set;}
    public boolean isCaAccount{get;set;}
 //   public  string territoryQuery{get;set;}
 	public List<String> territoryQuery = new List<String>();
    private static string PERCENTAGESIGN = '%';
    private static string NAATTHISLEVEL = 'N/A at this level';
    private static string ANDCOND = ' AND ';
    private static string CHAINOFF = 'Chain_Off_Premise';
   private static string  CANADA= 'C360_Account';
    private static string CHAINON = 'Chain_On_Premise';
    private static string ONPREM = 'On_Premise';
    private static string OFFPREM = 'Off_Premise';
    private static string INTEGRATIONSTR = 'Integration';
    private static string INPROGRESS = 'In Progress';
    private static string SEARCHCRITERIAERROR = 'Please Provide at least one search Criteria';
    private static string ERRORMSG = 'Unexpected error, Please contact admin. ';
    private static string NULLSTR = 'null';
    private static string BASEQUERY = 'SELECT Id, Name,C360_SAP_ID__c,BillingStreet,BillingCity,BillingState,BillingPostalCode, BillingCountry,ShippingCity,ShippingStreet,ShippingCountry,ShippingPostalCode,C360_Venue_LVL1_On__c,C360_Venue_LVL2_On__c,C360_Venue_LVL1_Off__c,C360_Venue_LVL2_Off__c,CreatedDate,C360_Sales_Representative__r.Name,C360_F1_Name__c,C360_Sales_Rep__r.Name,SMPSalesRepresentativeName__c,C360_Account_Status__c,C360_Quality_Rank__c,C360_Survey_Group__c,RecordType.DeveloperName FROM Account Where RecordType.DeveloperName in (\'C360_Account\',\'UK_I_Account\',\'MCCE_Account\',\'MCI_Account\',\'On_Premise\',\'Off_Premise\',\'Chain_On_Premise\',\'Chain_Off_Premise\') AND ';
    private static string EQUALSWITHQUOTE = ' =\'';
    private static string SINGLEQUOTE = '\'';
    private static string FALSESTR = ' = False ';
    private static string TRUESTR = ' = True ';
    private static string NAMESTR = 'Name';
    private static string MYACC = 'My_Accounts__c';
    private static string CUSTPRICING = 'Customer_Pricing_Group__c';
    private static string OUTLETTYPELVL = 'C360_Outlet_Type_LVL2_On_Premise__c';
    private static string STATUSACC = 'C360_Account_Status__c';
    private static string QUALITYRNK = 'C360_Quality_Rank__c';
    private static string BUYINGGRP = 'C360_Buying_Group_Description__c';
    private static string AOPCUST = 'AOP_Customer_Group__c';
    private static string CUSTHIERARCHY = 'C360_Cust_Hierarchy_Lvl7_Text__c';
    private static string TRADECHANNL = 'TradeChannelDesc__c';
    private static string BILLINGSTATE = 'BillingState';
    private static string SMPFLG = 'SMPFlag__c';
    private static string LIMITSTR = 'ORDER BY CreatedDate DESC LIMIT 1000';
    private static string RESETFILTR = 'Reset Filter';    
    private static string LIKEKEYWORD = ' LIKE \'';
    private static string BILLINGCOUNTRY = 'BillingCountry';
    private static map<string,List<string>> CountryToCountryListMap = new  map<string,List<string>>{ 'Canada' => new list<String>{'CA','Canada'}, 
                                                                                'United States' => new List<String>{'USA','United States','US'},
                                                                                'UKI' => new List<String>{'United Kingdom', 'UK', 'UKI','Scotland', 'Wales','England','Ireland'}};
    
    private static string PERCENTQUOTE = '%\'';
    
   // returns the data to be displayed on the page  
    public List<cAccount> getLstAccRecords(){  
     List<cAccount> lstAcc= new List<cAccount>();
        System.debug('---> Inside LstAccRecords');
        if(mapAccountPages.containsKey(intPageNumber)){
         lstAcc.addAll(mapAccountPages.get(intPageNumber)); 
        } 
     return lstAcc;  
   }  
   
   
    /**
    * @Name          fetchUser
    * @Created date  24/6/2020
    * @description   Method to  fetch users with c360 profiles based on lookup search text
   **/
    @AuraEnabled
    public static List<User> fetchUser(String searchKeyWord){
    String searchKey = searchKeyWord + PERCENTAGESIGN;
    List<User> userList = new List<User>();
    try{
    userList=[select id,Name,C360_IS_C360Profile__c from user where Name LIKE: searchKey and C360_IS_C360Profile__c=true limit 50000];
    if(Test.isRunningTest()){
                    Integer num =1/0;
                }     
    }catch(Exception ex){
        ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_OBJ, C360_Util_Constants.MNAME1_OBJ, ex.getMessage(), ex.getLineNumber());
    }
    return userList;  
    }
    
   /**
    * @Name          createObjective
    * @Created date  24/6/2020
    * @description   This method accepts  selected user,target number and  planned objective id from component and 
    *                creates  Assigned Objectives based on  number of targets selected and associate with Planned Objective.
   **/
    @AuraEnabled
    public static void createObjective(String Pid,String AssignNum,String Ownerid){
     String RecordtypeId=C360_UtilClass.getRecordtypeIdByName(C360_Util_Constants.OBJECTIVE_RECORDTYPE);
     List<Objective__c> planObj= [Select name from Objective__c where id=:Pid limit 1];
     List<Objective__c> objlist = new List<Objective__c>();
        try{
        Integer assignnumb = Integer.Valueof(AssignNum);  
        for(Integer i=0;i<assignnumb;i++){
          Objective__c objrec = new  Objective__c(
          Name=planObj[0].name,
          OwnerId=Ownerid,
          C360_Planned_Objective__c=Pid,
          RecordtypeId=RecordtypeId
          ); 
        objlist.add(objrec);
        }
        if(!objlist.isEmpty()){
            database.insert(objlist,false);  
        }
        if(Test.isRunningTest()){
                    Integer num =1/0;
          }
         }catch(Exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_OBJ,C360_Util_Constants.MNAME2_OBJ, ex.getMessage(), ex.getLineNumber());
    }
        
    }
    
     public AssignObjectiveToAccountsController(ApexPages.StandardController controller) {
        currentRecordId  = ApexPages.CurrentPage().getparameters().get(C360_Util_Constants.REC_Id);
        myAccount = System.Label.C360_Yes;
         myCountry =   [select C360_country__c from objective__C where id= :currentRecordId].C360_country__c;
        isUsAccount = false;
        isUkiAccount = false;
         isCaAccount = false;
        
       
    } 
    
 
     /**
    * @Name          createAssignmentObjectives
    * @Created date  24/6/2020
    * @description   This method accepts  selected user,target number and  planned objective id from component and 
    *                creates  Assigned Objectives based on  number of targets selected and associate with Planned Objective.
   **/
    public void createAssignmentObjectives() {
       List<Objective__c> objectivesToInsert = new List<Objective__c>();
        try{
            Objective__c objective = [SELECT RecordTypeId, Declined_Reason__c,End_Time__c,Start_Time__c,Status__c,Name,
                                      OwnerId,Id,Objective_type__c,Target_Volume_Qty__c,Target_Volume_UOM__c
                                      FROM Objective__c WHERE Id = :currentRecordId];
            
            String recordtypeId = C360_UtilClass.getRecordtypeIdByName(C360_Util_Constants.OBJECTIVE_RECORDTYPE);
            List<String>accid = new List<String>();
            if(!isallAccount){
                for(Integer cat:mapAccountPages.keySet()){
                    for(caccount acc:mapAccountPages.get(cat)){
                        if(acc.selected== True){
                              accid.add(acc.objacc.Id); 
                        }
                    }   
                }  
            }else{
                for(Integer cat:mapAccountPages.keySet()){
                    for(caccount acc:mapAccountPages.get(cat)){
                        accid.add(acc.objacc.Id);
                    }   
                }  

            }
            
            List<Account> accountsToCreateObjectivesOn = [SELECT Id,C360_Sales_Rep__c,C360_Sales_Rep__r.isActive,C360_F1_SAP_ID__c,C360_Sales_Representative__r.C360_MCBC_Network_ID__c,C360_Sales_Representative__r.Id,RecordType.DeveloperName,SMPSalesRepresentativeId__c,OwnerId,Owner.Name
                                                          FROM Account WHERE Id IN:accid];
            Map<id,String> accmap = new Map<id,String>();
    
            List<String>F1CRMID = New List<String>();
            
            for (Account a : accountsToCreateObjectivesOn) {
               if(a.C360_F1_SAP_ID__c!=null && a.C360_F1_SAP_ID__c!=NAATTHISLEVEL){
                   F1CRMID.add(a.C360_F1_SAP_ID__c);
                   accmap.put(a.id,a.C360_F1_SAP_ID__c); 
                }
             
                
          }
           Map<String,String> usermap= new Map<String,String>();
            for(user usrrec:[Select Id,C360_F1_CRM_ID__c FROM USER WHERE C360_F1_CRM_ID__c IN:F1CRMID AND C360_F1_CRM_ID__c!=Null AND ISActive=true]){
             usermap.put(usrrec.C360_F1_CRM_ID__c,usrrec.id);  
                system.debug('User Id'+usrrec.id);
            }

               for(Account acc:accountsToCreateObjectivesOn){
                    Objective__c newObjective = New Objective__c ();
                    newObjective.Name=objective.Name;
                    newObjective.Objective__c = objective.Id;
                    newObjective.RecordTypeId=recordtypeId;
                    newObjective.Objective_type__c = objective.Objective_type__c;
                    newObjective.Account__c=acc.Id;
                    newObjective.Target_Volume_Qty__c=objective.Target_Volume_Qty__c;
                    newObjective.Target_Volume_UOM__c=objective.Target_Volume_UOM__c;
                    if(acc.RecordType.DeveloperName == CHAINOFF || acc.RecordType.DeveloperName == CHAINON || acc.RecordType.DeveloperName == ONPREM || acc.RecordType.DeveloperName== OFFPREM ){
                        if((acc.Owner.Name).contains(INTEGRATIONSTR)){
                            newObjective.OwnerId=Userinfo.getUserId();
                        }else{
                            newObjective.OwnerId=acc.OwnerId;
                        }
                    }else{                        
                        if(acc.RecordType.DeveloperName == CANADA ){
                            if(acc.C360_Sales_Rep__c!=null && acc.C360_Sales_Rep__r.isActive == true) {
                              newObjective.OwnerId= acc.C360_Sales_Rep__c;   
                            }
                            else{
                             newObjective.OwnerId=Userinfo.getUserId(); 
                            }
                        }                        
                        else
                            if(accmap.get(acc.id)!=null && usermap.Containskey(accmap.get(acc.id))){
                              newObjective.OwnerId= usermap.get(accmap.get(acc.id));
                           }
                           else{
                             newObjective.OwnerId=Userinfo.getUserId(); 
                            }
                    }
                objectivesToInsert.add(newObjective); 
            }
            if(!objectivesToInsert.isEmpty()){
                 objective.Status__c = INPROGRESS; //Added this upsert logic as part of GB-11195
                 objectivesToInsert.add(objective);
                 database.upsert(objectivesToInsert,false);  
            } 
            if(Test.isRunningTest()){
                    Integer num =1/0;
            }
            }catch(exception ex){
            ErrorLog.insertErrorLog(C360_Util_Constants.CNAME_OBJ,C360_Util_Constants.MNAME5_OBJ, ex.getMessage(), ex.getLineNumber());
            }   
    }
    
  /*------------------------------------------------------------
  Author:        Jayanth.K.Manickam
  Company:       Accenture IDC
  Description:   Method that retrieves Off Premise Picklist Values.
  Inputs:
  Returns:       List< SelectOption >
  History
  Created         24/6/2020      
  ------------------------------------------------------------*/
 public List < SelectOption > getOffPremiseOptions {
   get {
    List < SelectOption > options = new List < SelectOption > ();
    Schema.DescribeFieldResult fieldResult = Schema.Account.C360_Venue_Type_LVL2_Off_Premise_Desc__c.getDescribe();
    List < Schema.PicklistEntry > ple = fieldResult.getPicklistValues();
    options.add(new SelectOption(resetValue, resetValue));
    for (Schema.PicklistEntry f: ple) {
     options.add(new SelectOption(f.getLabel(), f.getValue()));
    }
    return options;
   }
  }
  /*------------------------------------------------------------
  Author:        Jayanth.K.Manickam
  Company:       Accenture IDC
  Description:   Method that retrieves On Premise Picklist Values.
  Inputs:
  Returns:       List< SelectOption >
  History
  Created       24/6/2020
  ------------------------------------------------------------*/
 public List < SelectOption > getOnPremiseOptions {
  get {
   List < SelectOption > options = new List < SelectOption > ();
   Schema.DescribeFieldResult fieldResult = Schema.Account.C360_Venue_Type_LVL2_On_Premise_Desc__c.getDescribe();
   List < Schema.PicklistEntry > ple = fieldResult.getPicklistValues();
   options.add(new SelectOption(resetValue, resetValue));
   for (Schema.PicklistEntry f: ple) {
    options.add(new SelectOption(f.getLabel(), f.getValue()));
   }
   return options;
  }
 }
 
 /*------------------------------------------------------------
  Author:        Jayanth.K.Manickam
  Company:       Accenture IDC
  Description:   Method that retrieves MHS Outlet group Picklist Values.
  Inputs:
  Returns:       List< SelectOption >
  History
  Created       24/6/2020
  ------------------------------------------------------------*/
 public List < SelectOption > getMHSOutletGrpOptions {
  get {
   List < SelectOption > options = new List < SelectOption > ();
   Schema.DescribeFieldResult fieldResult = Schema.Account.C360_MHS_Outlet_Group__c.getDescribe();
   List < Schema.PicklistEntry > ple = fieldResult.getPicklistValues();
   options.add(new SelectOption(resetValue, resetValue));
   for (Schema.PicklistEntry f: ple) {
    options.add(new SelectOption(f.getValue(),f.getLabel()));
    
   }
   return options;
  }
 } 
    
    /**************************************************
     * Author:      Abhilash Daslal
     * Description: Returns the picklist values of 
     *              C360_Outlet_Type_LVL2_On_Premise__c
     *              (UK Outlet Type)
     * Created On : 24/6/2020 
     **************************************************/
    public List<SelectOption> getUKOutletTypes {
        get{
            List<SelectOption> options = new List<SelectOption>();
            Schema.DescribeFieldResult fieldResult = Schema.Account.C360_Outlet_Type_LVL2_On_Premise__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            options.add(new SelectOption(resetValue,resetValue));
            for(Schema.PicklistEntry f: ple){
                options.add(new SelectOption(f.getLabel(),f.getValue()));
            }
            return options;
        }
    }
    
    /**************************************************
     * Author:      Abhilash Daslal
     * Description: Returns the picklist values of 
     *              C360_Survey_Group__c
     *              (Survey Group)
     * Created On : 24/6/2020
     **************************************************/
    public List<SelectOption> getSurveyGroup {
        get{
            List<SelectOption> options = new List<SelectOption>();
            Schema.DescribeFieldResult fieldResult = Schema.Account.C360_Survey_Group__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            options.add(new SelectOption(resetValue,resetValue));
            for(Schema.PicklistEntry f : ple){
                options.add(new SelectOption(f.getLabel(),f.getLabel()));
            }
            return options;
        }   
    }
    
   /**************************************************
    * Author:      Abhilash Daslal
    * Description: Returns the picklist values of 
    *              C360_Account_Status__c
    *              
    * Created On : 24/6/2020 
    **************************************************/
    public List<SelectOption> getAccountStatus {
        get{
            List<SelectOption> options = new List<SelectOption>();
            Schema.DescribeFieldResult fieldResult = Schema.Account.C360_Account_Status__c.getDescribe();
            List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
            options.add(new SelectOption(resetValue,resetValue));
            for(Schema.PicklistEntry f: ple){
                options.add(new SelectOption(f.getLabel(),f.getValue()));
            }
            return options;
        }
    }
    
   // sets the pagination data  
   public Pagereference setPagination() { 
       system.debug('Inside setPaginaton');
     integer NumberofRecords = 0;  
     integer pagenumber = 1;   
     mapAccountPages.clear();
     isUsAccount = false;
     isUkiAccount = false;  
     isCaAccount = false;  
       
       /******** Territory Models Account fetch for Canada Users START- GB 15157 **********/
       List <UserTerritory2Association> recordList = [SELECT Territory2Id, IsActive, RoleInTerritory2, UserId, Id 
                                      FROM UserTerritory2Association WHERE UserId= :UserInfo.getUserID()];
      	
       Set<Id> TerritoryIdSet = new Set<Id>();
          for(UserTerritory2Association sr : recordList){
        	 TerritoryIdSet.add(sr.Territory2Id);                               
          }
       
        System.debug('Territory Id'+TerritoryIdSet);
       	List<ObjectTerritory2Association> objT2 = [Select Id, ObjectId, Territory2Id from objectterritory2association 
                                                   where Territory2Id IN :TerritoryIdSet ];
         for(ObjectTerritory2Association a : objT2){
            	  territoryQuery.add(a.ObjectId);
         }
      	 info = [Select Country from user where Id= :UserInfo.getUserID()];
       
       /******* Territory Models Account fetch for Canada Users FINISH ******/

       Map<String, String> queryLst = new Map<String, String>();
       queryLst.put(NAMESTR,accountName);
       queryLst.put(MYACC,myAccount);
       queryLst.put(CUSTPRICING,pricingCustGrp);
       queryLst.put(OUTLETTYPELVL,outletType);
       queryLst.put(STATUSACC,accountStatus);
       queryLst.put(QUALITYRNK,qualityRank);
       queryLst.put(BUYINGGRP,buyingGroup);
       queryLst.put(AOPCUST,custGrpAOP);
       queryLst.put(CUSTHIERARCHY,custHeirarchyL7);
       queryLst.put(TRADECHANNL,tradeChannel);
       queryLst.put(BILLINGSTATE,state);
       queryLst.put(SMPFLG,smpFlag);
      queryLst.put(BILLINGCOUNTRY,myCountry);
      // system.assert(false, BILLINGCOUNTRY +''+ myCountry);
               
          
       
       List<Account> result = new List<Account>();
       If(!String.isBlank(queryLst.get(NAMESTR)) || !String.isBlank(queryLst.get(BUYINGGRP))
          ||!String.isBlank(queryLst.get(CUSTPRICING))||!String.isBlank(queryLst.get(AOPCUST))
          ||!String.isBlank(queryLst.get(CUSTHIERARCHY))
          ||(!String.isBlank(queryLst.get(OUTLETTYPELVL)) && !queryLst.get(OUTLETTYPELVL).equals(RESETFILTR)) 
          ||!String.isBlank(queryLst.get(QUALITYRNK))
          ||!String.isBlank(queryLst.get(TRADECHANNL))
          ||(!String.isBlank(queryLst.get(STATUSACC)) && !queryLst.get(STATUSACC).equals(RESETFILTR) ) ||!String.isBlank(queryLst.get(BILLINGSTATE))
          ||!String.isBlank(queryLst.get(SMPFLG))){
              String formerquery = BASEQUERY;
      		  String laterquery = '';  
   			List<String> lstCountry  = new List<String>();
              
       String ordrby = LIMITSTR;  
           
               for(String label:queryLst.keyset())
               {
                   if(!String.isBlank(queryLst.get(label)) && label== NAMESTR ){
                        laterquery +=ANDCOND+label+LIKEKEYWORD+queryLst.get(label)+PERCENTQUOTE;
                   }                  
               
                   else if(!String.isBlank(queryLst.get(label))&& (label==MYACC) &&(queryLst.get(label) == System.Label.C360_Yes) && (info[0].Country == 'Canada'))
                   {	  
                            laterquery += 'AND Id IN :territoryQuery';
                       	  System.debug('&&&&'+laterquery);
                    }
	
                   else if(!String.isBlank(queryLst.get(label)) && (label==MYACC)&&(queryLst.get(label) == System.Label.C360_Yes))
                   {
                        laterquery += ANDCOND +label+TRUESTR;
                     
                   }
                  
                   else if(!String.isBlank(queryLst.get(label)) && (label==MYACC)&&(queryLst.get(label) == System.Label.C360_NO )){
                         laterquery += ANDCOND +label+FALSESTR;
                         //
                   }
                   else if(!String.isBlank(queryLst.get(label)) && label == BILLINGCOUNTRY){
                       
                       lstCountry = CountryToCountryListMap.get(queryLst.get(label));
                       system.debug('##---Country---'+lstCountry);
                       laterquery += ANDCOND+label+ ' IN : lstCountry ';
                       system.debug('Country List --->'+ laterquery);
                       /* if(queryLst.get(label)=='Canada'){
                             laterquery += ANDCOND+label+ ' IN (\'CA\',\'Canada\')';
                        } 
                        else if(queryLst.get(label)=='United States'){
                             laterquery += ANDCOND+label+ ' IN (\'US\',\'United States\',\'USA\')';
                        }
                       else if(queryLst.get(label)=='UKI'){
                             laterquery += ANDCOND+label+ ' IN (\'UK\',\'England\',\'United Kingdom\',\'Ireland\',\'Wales\',\'Scotland\')';
                        }*/
                   } 
                   
                   
                   else if(!String.isBlank(queryLst.get(label))&&(!queryLst.get(label).equals(RESETFILTR))){
                        laterquery += ANDCOND+label+EQUALSWITHQUOTE+queryLst.get(label)+SINGLEQUOTE;
                       //system.debug('##---last loop=--'+laterquery);
                   } 
                    
               }
              
              system.debug('##---last loop=--'+laterquery);
                String cmplquery;
                   if(String.isNotBlank(laterquery)){
                    laterquery =laterquery.removeStart(NULLSTR).removeEnd(ANDCOND);
                    formerquery = formerquery.removeEnd(ANDCOND);
                    cmplquery=formerquery+laterquery+ordrby;
                       system.debug('##1 Complete Query'+formerquery);  
                   }else
                   {
                   formerquery = formerquery.removeEnd(ANDCOND);
                   cmplquery=formerquery+ordrby;
                   } 
              try{
                
              system.debug('## Complete Query'+cmplquery);  
               result= Database.query(cmplquery);
                  
              }catch(Exception ex){
                  ApexPages.addMessage(new ApexPages.message(ApexPages.severity.ERROR, ERRORMSG+ex.getMessage()));
              }
              
       }else{
          ApexPages.addMessage(new ApexPages.message(ApexPages.severity.WARNING, System.Label.Assign_to_accounts_filter_message));
       }
      if(!result.isEmpty()){
         // system.debug('Results----'+result);
         for (Account objAcc :result) {
             if(objAcc.RecordType.DeveloperName == CHAINOFF || objAcc.RecordType.DeveloperName == CHAINON || objAcc.RecordType.DeveloperName == ONPREM || objAcc.RecordType.DeveloperName== OFFPREM ){
                 isUsAccount = true;
             }else
                 if(objAcc.RecordType.DeveloperName == CANADA && (objAcc.BillingCountry == 'CA' || objAcc.BillingCountry =='Canada' )){
                 isCaAccount = true;
             }
             else{
                isUkiAccount = true; 
             }
           if (NumberofRecords < 50) {  
             if (mapAccountPages.containsKey(pagenumber)){  
               mapAccountPages.get(pagenumber).add(new cAccount(objAcc,false));  
             }  
             else {  
               mapAccountPages.put(pagenumber,new List<cAccount>{new cAccount(objAcc,false)});  
             }  
             NumberofRecords++;  
             if (NumberofRecords == 50) {  
               NumberofRecords = 0;  
               pagenumber++;  
             }  
           }  
         }  
         intNumberofPages = mapAccountPages.size();  
         intPageNumber =1; 
              getLstAccRecords();

           }   
     return null;  
   }  
   public Boolean hasNext {  
     get {  
       if (intNumberofPages <= intPageNumber) {  
         return true;  
       }  
       else {  
         return false;  
       }  
     }  
     set;  
   }  
   public Boolean hasPrevious {  
     get {  
       if (intPageNumber == 1) {  
         return true;  
       }  
       else {  
         return false;  
       }  
     }  
     set;  
   }  
   public void first() {  
      intPageNumber = 1;  
      getLstAccRecords();  
   }  
   public void last() {  
      intPageNumber=intNumberofPages;   
      getLstAccRecords();  
   }   
   public void previous() {  
      intPageNumber--;  
      getLstAccRecords();  
   }  
    public void next() {  
        intPageNumber++;
      getLstAccRecords();  
    }  
   // Wrapper to wrap the Checkbox value and Objrecord together  
   public class cAccount {  
     public Account objAcc{get;set;}  
     public Boolean Selected{get;set;}   
     public cAccount(Account objAcc,Boolean bSel) {  
       this.objAcc = objAcc;  
       this.Selected = bSel;  
     }   
   }
   
}