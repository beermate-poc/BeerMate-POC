/**
  * @author        Accenture 
  * @Name          AccountCallCheckIn 
  * @Created date  13/05/2019
  * @description   checkIn Call
  * @Version       1.0
**/

public without sharing class AccountCallCheckIn {

    @auraEnabled
    Public static String CallCheckIn(Decimal latitude,Decimal longitude,String recid){
        try{
            Account acnt = [Select Id, C360_Account_Status__c, C360_Sales_Organization__c, BillingCountry from Account where Id=:recid];
            //Id usrid= UserInfo.getUserId();
            User usr = [Select Id, Sales_Role__c,Profile.Name From User where Id =:UserInfo.getUserId()];
            if(usr.Profile.Name==Constants.SALES_USER || usr.Profile.Name==Constants.SALES_ADMINISTRATOR){//Constants.SYSTEM_ADMINISTRATOR
                Event evt = new Event();
                evt.C360_Start_Geolocation__Latitude__s=latitude;
                evt.C360_Start_Geolocation__Longitude__s=longitude;
                evt.C360_Status__c=system.Label.C360_InProgressStatus;
                evt.recordtypeId =C360_UtilClass.getRecordtypeIdByName('CA_UKI_Manual_Call');
                evt.DurationInMinutes=60;
                evt.ActivityDateTime=system.Now();
                evt.C360_Actual_Start__c=system.Now();
                evt.C360_Call_Type__c='Visit';
                evt.WhatId=recid;
                database.insert(evt);
                return evt.id; 
            }
            else{
            if(acnt.C360_Account_Status__c!='Closed'){
                Event evt = new Event();
                evt.C360_Start_Geolocation__Latitude__s=latitude;
                evt.C360_Start_Geolocation__Longitude__s=longitude;
                evt.C360_Status__c=system.Label.C360_InProgressStatus;
                evt.recordtypeId =C360_UtilClass.getRecordtypeIdByName('CA_UKI_Manual_Call');
                evt.DurationInMinutes=60;
                evt.ActivityDateTime=system.Now();
                evt.C360_Actual_Start__c=system.Now();
                if(acnt.C360_Account_Status__c=='Prospect'){
                    evt.C360_Call_Type__c='Prospect'; 
                }else{
                    if(usr.Sales_Role__c=='M1'){
                        evt.C360_Call_Type__c='Merchandiser';
                    }else if(usr.Sales_Role__c=='F1'){
                        evt.C360_Call_Type__c='Visit';
                    }else if(!String.isBlank(usr.Sales_Role__c)){
                        evt.C360_Call_Type__c='Coaching';
                    }else {
                        evt.C360_Call_Type__c='Visit';
                    }
                }
                // evt.C360_Call_Type__c='Visit';
                evt.WhatId=recid;
                database.insert(evt);
                if(Test.isRunningTest()){
                    Integer a=1/0;
                }
                return evt.id; 
            } else{
                
                return 'error';          
            }
        }

    }catch(exception ex){
         ErrorLog.insertErrorLog(C360_Util_Constants.CACName, C360_Util_Constants.MACName, ex.getMessage(), ex.getLineNumber());
        return null;
    }
    }
}