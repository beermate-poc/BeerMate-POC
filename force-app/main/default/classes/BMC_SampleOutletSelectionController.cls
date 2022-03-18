/********************************************************************************************************************************************************************************************
# Class Name  = "BMC_SampleOutletSelectionController"
# Date : June 18th 2018
# Description = This class holds all methods called from Lightning components for Sample Outlet Selection .
**************************************************************************************************************************************************/
public with sharing class BMC_SampleOutletSelectionController {
    /*------------------------------------------------------------
Author:        Rajiv krishnan
Company:       Accenture
Description:   Returns the all channel values stored in the label. 
Inputs:        none
<Date>      <Authors Name>     <Brief Description of Change>
06/20/2018  Rajiv krishnan     
------------------------------------------------------------*/
    @AuraEnabled
    public static List <String> getLabel() {
        try{
            String labelValue = System.Label.BMC_TradeValues ;
            List<String> splitLabel = labelValue.split(';');
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return splitLabel; 
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
        
    }
     /*------------------------------------------------------------
Author:       Rajiv krishnan
Company:       Accenture
Description:   Returns the custom settings value stored.
Inputs:        none
<Date>      <Authors Name>     <Brief Description of Change>
06/20/2018 Rajiv krishnan     
------------------------------------------------------------*/
    @AuraEnabled
    public static BMC_SOSStartingPoint__c getinitValue(){
        try{
            BMC_SOSStartingPoint__c spoint = [select  BMC_SOS_InitValue__c from BMC_SOSStartingPoint__c limit 1 ];
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return spoint;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
        
    }
     /*------------------------------------------------------------
Author:       Rajiv krishnan
Company:       Accenture
Description:   Creation of  Where to Hunt List as per the user input values.
Inputs:      BMC_SOSStartingPoint__c -  Custom Setting Value 
Id accountId - id of selected Distributor account 
String Account Name  - name of selected Distributor account 
Integer onPremiseOutlet - Number of On Premise Locations value  inputed by user
Integer offPremiseOutlet - Number of Off Premise Locations value  inputed by user
Integer annualVolume - Minimal Annual Volume value inputed by user
String selectedPremise - user selected Chain/All Type value
String selectedChannel - user selected Channel value 
<Date>      <Authors Name>     <Brief Description of Change>
06/20/2018  Rajiv krishnan     
------------------------------------------------------------*/
    @AuraEnabled
    public static  List<Integer> getAllRetailAccounts(BMC_SOSStartingPoint__c spoint ,ID accountId ,String accountName, Integer onPremiseOutlet,Integer offPremiseOutlet ,Integer annualVolume,String selectedPremise , String selectedChannel) {
        try{
            List<Distributor_Retail_Outlet__c> listBrand = new List<Distributor_Retail_Outlet__c>();
            List<Integer> sizeList= new List<Integer>();
            String labelValue = System.Label.BMC_TradeValues ;
            List<String> splitLabel = labelValue.split(';');
            Date pdate = Date.Today();
            pdate = pdate.addDays(-364);
            Integer limit_account=(Limits.getLimitQueryRows()-Limits.getQueryRows());
            String query =  'SELECT' +' DistributorAccount__c, Id,RetailOutlet__r.RecordType.Name,RetailOutlet__r.PremiseTypeNme__c,RetailOutlet__r.Total_52_Wk_Volume__c ,RetailOutlet__r.TradeChannelDesc__c'
                + ' FROM '
                + 'Distributor_Retail_Outlet__c ' 
                + 'where DistributorAccount__c=:accountId '
                //+ ' and Last_Purchase_Date__c >=: pdate '
                +  'and   RetailOutlet__r.Total_52_Wk_Volume__c >=: annualVolume ';
            
            if (selectedChannel == Constants.SOS_ALL)
            {
                query += ' AND (RetailOutlet__r.TradeChannelDesc__c IN: splitLabel) ';
            }
            else  if (selectedChannel != Constants.SOS_ALL)
            {
                query += ' AND (RetailOutlet__r.TradeChannelDesc__c =: selectedChannel) ';
            }
            
            if(selectedPremise == Constants.SOS_INDEPENDENT)
            {
                query +=  ' AND ( RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_ONPREMISE +'\'' + 
                    ' OR RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_OffPREMISE +'\''+ ')';
            }      
            else if(selectedPremise ==Constants.SOS_CHAIN)
            {
                query +=  ' AND ( RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_CHAINONPREMISE +'\'' + 
                    ' OR RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_CHAINOFFPREMISE +'\''+ ')';
            }
            else if(selectedPremise == Constants.SOS_ALL)
            {
                query +=  ' AND ( RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_CHAINONPREMISE +'\'' + 
                    ' OR RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_CHAINOFFPREMISE +'\'' +
                    ' OR RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_ONPREMISE +'\'' + 
                    ' OR RetailOutlet__r.RecordType.Name = ' + ' \''+ Constants.SOS_OffPREMISE +'\''+ ')' ;
            }
            query += ' ORDER BY RetailOutlet__r.Total_52_Wk_Volume__c DESC limit: limit_account '; 
            listBrand=(List<Distributor_Retail_Outlet__c>)Database.query(query);
              
            Set<ID> onAccountSet= new Set<ID>();
            Set<ID> offAccountSet= new Set<ID>();
            for (Distributor_Retail_Outlet__c disObj : listBrand){
                if((disObj.RetailOutlet__r.PremiseTypeNme__c==Constants.SOS_ON) && (onPremiseOutlet != 0 ) ){
                    onAccountSet.add(disObj.RetailOutlet__r.ID);
                }
                if((disObj.RetailOutlet__r.PremiseTypeNme__c==Constants.SOS_OFF) && (offPremiseOutlet != 0 )){
                    offAccountSet.add(disObj.RetailOutlet__r.ID);
                }
            } 
            List<Id> onAccountList = new List<Id>(onAccountSet); 
            List<Id> offAccountList = new List<Id>(offAccountSet);
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            if((onAccountList.size() >= onPremiseOutlet ) && (offAccountList.size() >= offPremiseOutlet )){    
                getSampleData(spoint, accountName,onAccountList,offAccountList, onPremiseOutlet, offPremiseOutlet ,accountId);
                return sizeList;
            }
            else{
                sizeList.add(onAccountList.size());
                sizeList.add(offAccountList.size());
                return sizeList;
            }
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }   
    }
    public static void getSampleData(BMC_SOSStartingPoint__c spoint,String accountName ,List<Id> onAccountList, List<Id> offAccountList,Integer onPremiseOutlet , Integer offPremiseOutlet , Id accountId){
        try{
            List<ID> finalaccountList = new  List<ID>();
            List<ID> finalonaccountList = new  List<ID>();
            List<ID> finaloffaccountList = new  List<ID>();
            Integer incron;
            Integer incroff;
            if(spoint.BMC_SOS_InitValue__c > 9)
            {
                spoint.BMC_SOS_InitValue__c =0;
            } 
          //  System.debug('spoint'+spoint);
            Integer startPoint =  integer.valueOf(spoint.BMC_SOS_InitValue__c );
          //  System.debug('startPoint'+startPoint);
            if(offPremiseOutlet != 0){
                if((offAccountList.size() - startPoint) >= offPremiseOutlet){
                    incroff =  integer.valueOf((offAccountList.size() - startPoint) / offPremiseOutlet);
                }
                else if((offAccountList.size() - startPoint) <= offPremiseOutlet){
                    incroff =  integer.valueOf((offAccountList.size() ) / offPremiseOutlet);
                }
            }
            if(onPremiseOutlet != 0){
                if((onAccountList.size() - startPoint) >= onPremiseOutlet){
                    incron =  integer.valueOf((onAccountList.size() - startPoint) / onPremiseOutlet);
                }
                else if((onAccountList.size() - startPoint) <= onPremiseOutlet){
                    incron =  integer.valueOf((onAccountList.size() ) / onPremiseOutlet);
                } 
            }
            if((onAccountList.size() - startPoint) < onPremiseOutlet){
                startPoint =0;
            } 
            if(onPremiseOutlet == 0) {
                for(integer i=startPoint;i<=offAccountList.size(); i+=incroff){
                    if((finaloffaccountList.size() != offPremiseOutlet)){
                        finaloffaccountList.add(offAccountList[i]);
                    } 
                }
                finalaccountList.addAll(finaloffaccountList);
            }
            else if (offPremiseOutlet == 0 ){
                for(integer j=startPoint;j<=onAccountList.size(); j+=incron){
                    if((finalonaccountList.size() != onPremiseOutlet)){
                        finalonaccountList.add(onAccountList[j]);
                    }
                }  
                finalaccountList.addAll(finalonaccountList);
            }
            else if((onPremiseOutlet != 0) && (offPremiseOutlet != 0 ))  {
                for(integer j=startPoint;j<=onAccountList.size(); j+=incron){
                    if((finalonaccountList.size() != onPremiseOutlet)){
                        finalonaccountList.add(onAccountList[j]); 
                    }  
                }
                for(integer i=startPoint;i<=offAccountList.size(); i+=incroff){
                    if((finaloffaccountList.size() != offPremiseOutlet)){
                        finaloffaccountList.add(offAccountList[i]);
                    }                
                }
                finalaccountList.addAll(finalonaccountList);
                finalaccountList.addAll(finaloffaccountList);
            }
            
            Id currentUserId = UserInfo.getUserId();
            Datetime myDT =System.now();
            String myDate = myDT.format(Constants.SOS_DATEFORMAT);
            String wthListName=accountName + ' '+myDate;
            Where_to_Hunt__c currTargetList = new Where_to_Hunt__c(Name=wthListName, OwnerId=currentUserId, List_Status__c = Constants.SOS_ACTIVE);
            database.insert(currTargetList);
            
            List<Target_Account__c> newTargetAccounts = new List<Target_Account__c>();
            for(Id accountId1: finalaccountList){
                newTargetAccounts.add(new Target_Account__c(Account_Name__c=accountId1, Target_List__c=currTargetList.Id));
            }
            if(newTargetAccounts.size() > 0){
                database.insert(newTargetAccounts);
                spoint.BMC_SOS_InitValue__c  = spoint.BMC_SOS_InitValue__c + 1 ;
                database.update(spoint);
            }
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        } 
        
    }  
}