/*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   A custom controller for the AccountsList component
Inputs:        none
Test Class:    AccountsNearMeApexControllerTest
History
9/14/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
public without sharing class AccountsNearMeApexController {
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Method that returns a list of accounts based of the geolocation of the user
Inputs:        none
History
9/14/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
    /* MC:MC:1776- Update Accounts Near Me Logic to pull in only US based Accounts */
    @AuraEnabled
    public static List<Account> findNearbyAccounts(Decimal latitude, decimal longitude){
        try{
           	// updateUser(latitude, longitude);
            Id profileId= userinfo.getProfileId();
    		String profileName=[Select Id,Name from Profile where Id=:profileId Limit 1].Name;
            List<Account> accountList = new List<Account>();           
            if(!profileName.startsWith(C360_Util_Constants.C360) && (profileName != C360_Util_Constants.SYSTEM_ADMIN)){
            accountList = [Select Id,Name,BillingLatitude,BillingLongitude, Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance,Distance_From_Current_User__c ,BillingStreet,
                                         My_Accounts__c,TradeChannelDesc__c, PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            }else if(profileName.startsWith(C360_Util_Constants.C360)){
            accountList = [Select Id,Name,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,C360_SAP_ID__c,C360_Owner__c,C360_Account_Status__c,
                                         My_Accounts__c,TradeChannelDesc__c, PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                        AND RecordType.DeveloperName IN (:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            }else if(profileName == C360_Util_Constants.SYSTEM_ADMIN){
            
                accountList = [Select Id,Name,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,BillingStreet,BillingPostalCode,C360_SAP_ID__c,C360_Owner__c,C360_Account_Status__c,
                                         My_Accounts__c,TradeChannelDesc__c, PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            
            } 
            return accountList; 
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Private method to update the users geolocation on the user object
Inputs:        none
History
9/14/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
    private static void updateUser(Decimal latitude, decimal longitude ){
        User currUser = new User(Id=UserInfo.getUserId());
        currUser.Last_Recorded_Location__latitude__s = latitude;
        currUser.Last_Recorded_Location__longitude__s = longitude;
        Database.update(currUser);
    }
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   Method that returns a list of accounts based of the geolocation of the user as well as the users target accounts
Inputs:        none
History
9/14/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
    @AuraEnabled
    public static List<Account> findNearbyWhereToHuntAccount(List<Target_Account__c> accts, Decimal latitude, decimal longitude){
        try{
           // updateUser(latitude, longitude);
            Set<Id> temp = new Set<Id>();
            for(Target_Account__c a : accts){
                temp.add(a.Account_Name__c);
            }
            List<Account> accountList = [Select Id,Name,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,
                                         TradeChannelDesc__c,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND Id IN: temp AND StatusNme__c != :Constants.INACTIVE ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT :Constants.FIRST_30_ACCOUNTS];
            return accountList;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE+ e.getMessage());
        }
    }
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  Searches accounts based on serachTerm enteerd by Rep
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/    
    @AuraEnabled
    public static List<Account> searchAccountName(String accountName,Decimal latitude, decimal longitude){
        try{
            //updateUser(latitude, longitude);
            System.debug('---latitude---'+latitude);
            System.debug('--longitud---'+longitude);
             Id profileId= userinfo.getProfileId();
    		String profileName=[Select Id,Name from Profile where Id=:profileId Limit 1].Name;
            List<Account> accountList = new List<Account>();
            String searchName=Constants.PERCENTAGE+accountName+Constants.PERCENTAGE;
           if(!profileName.startsWith(C360_Util_Constants.C360) && (profileName != C360_Util_Constants.SYSTEM_ADMIN)){
            accountList = [Select Id,Name,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,My_Accounts__c,
                                         TradeChannelDesc__c, PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND Name LIKE :searchName AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            }else if(profileName.startsWith(C360_Util_Constants.C360)){
                accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,C360_Account_Status__c,C360_Owner__c,My_Accounts__c,
                                         TradeChannelDesc__c, PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND Name LIKE :searchName AND RecordType.DeveloperName IN (:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            	System.debug('accountList--='+accountList);
            }else if(profileName == C360_Util_Constants.SYSTEM_ADMIN){
                accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance  ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,C360_Account_Status__c,C360_Owner__c,My_Accounts__c,
                                         TradeChannelDesc__c, PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND Name LIKE :searchName AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            	System.debug('accountList--='+accountList);
            }
            return accountList;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  Returns List of accounts searched based on Premise Types
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    @AuraEnabled
    public static List<Account> accountPremisetype(String premiseType,Decimal latitude, decimal longitude){
        try{
            //updateUser(latitude, longitude);
            List<Account> accountList = [Select Id,Name,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance, Distance_From_Current_User__c ,BillingStreet,
                                         TradeChannelDesc__c, PremiseTypeNme__c ,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND PremiseTypeNme__c =:premiseType 
                                         AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT)
                                         ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi')  LIMIT 30];
            return accountList;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
        /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  Returns List of Trade Channel values
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    @AuraEnabled
    public static List<String> tradeChannelValues(){
        try{
             String tradeChannel=Label.BMC_TradeValues;
             List<String> listofTradeChannelvalues = tradeChannel.split(Constants.SEMI_COLON);
             return listofTradeChannelvalues;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
        /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  Returns List of accounts searched based on Premise Types
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    @AuraEnabled
    public static List<Account> accountTradeChannel(String tradeChannel,Decimal latitude, decimal longitude){
        try{
            //updateUser(latitude, longitude);
            List<Account> accountList = [Select Id,Name,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,
                                        TradeChannelDesc__c ,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where StatusNme__c != :Constants.INACTIVE AND Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND TradeChannelDesc__c =:tradeChannel AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
             return accountList;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    @AuraEnabled 
    public static user fetchUser(){
     // query current user information  
      User oUser = [select id,Name,TimeZoneSidKey,Username,Alias,Country,Email,FirstName,LastName,IsActive,Profile.Name 
                 FROM User Where id =: userInfo.getUserId()];
        return oUser;
    }

/*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  Returns List of accounts searched based on Called on Accounts
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/
@AuraEnabled
    public static List<Account> calledOnAccounts(String calledOnAcc,Decimal latitude, decimal longitude){
        try{
           
            //updateUser(latitude, longitude);
            List<Account> accountList;
          
             if(calledOnAcc==C360_Util_Constants.No || calledOnAcc==C360_Util_Constants.Blank || calledOnAcc==C360_Util_Constants.NUL)
             {
                accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,
                                         TradeChannelDesc__c,C360_Owner__c, PremiseTypeNme__c,C360_TOP_INDEPENDENT__c ,C360_Account_Status__c,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND (C360_TOP_INDEPENDENT__c =:C360_Util_Constants.No  OR C360_TOP_INDEPENDENT__c =:C360_Util_Constants.BLANK) 
 AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
            }
            else{
                accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,
                                         TradeChannelDesc__c,C360_Owner__c, PremiseTypeNme__c,C360_TOP_INDEPENDENT__c,C360_Account_Status__c ,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND C360_TOP_INDEPENDENT__c =:calledOnAcc AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY 
                               			Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
           	
            }
           
            return accountList;
        } catch(Exception e){
           
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  Returns List of accounts searched based on Sales Channel Description
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/
@AuraEnabled
    public static List<Account> salesChannelDesc(String salesChannelDes,Decimal latitude, decimal longitude){
        try{
           
            //updateUser(latitude, longitude);
           List<Account> accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,
                                         TradeChannelDesc__c,C360_Owner__c, PremiseTypeNme__c,C360_Account_Status__c,C360_TOP_INDEPENDENT__c,C360_Sales_Channel_Description__c ,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND C360_Sales_Channel_Description__c =:salesChannelDes AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
           
            return accountList;
        } catch(Exception e){
          
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
/*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  Returns List of accounts searched based on Account Status
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/

@AuraEnabled
    public static List<Account> accountStatus(String accStatus,Decimal latitude, decimal longitude){
        try{
           
            //updateUser(latitude, longitude);
            List<Account> accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,ShippingPostalCode,
                                         TradeChannelDesc__c,C360_Owner__c, PremiseTypeNme__c,C360_TOP_INDEPENDENT__c ,C360_Account_Status__c,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND C360_Account_Status__c =:accStatus AND RecordType.DeveloperName  IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.C360ACCOUNT,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') LIMIT 30];
          
            return accountList;
        } catch(Exception e){
            
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
       /*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  Returns List of accounts searched based on My Accounts
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/

@AuraEnabled
    public static List<Account> filterByMyAccounts(boolean myAcc,Decimal latitude, decimal longitude){
      	List<String> territoryQuery = new List<String>();
        try{
           	/************** Changes for Canada Account fetch from New Territory - GB-15155 - Ravi *******************/
            
            List <UserTerritory2Association> recordList = [SELECT Territory2Id, IsActive, RoleInTerritory2, UserId, Id 
                                      FROM UserTerritory2Association WHERE UserId= :UserInfo.getUserID()];
            Set<Id> TerritoryIdSet = new Set<Id>();
              for(UserTerritory2Association sr : recordList){
                 TerritoryIdSet.add(sr.Territory2Id);                               
              }

       	List<ObjectTerritory2Association> objT2 = [Select Id, ObjectId, Territory2Id from objectterritory2association 
                                                   where Territory2Id IN :TerritoryIdSet ];
         for(ObjectTerritory2Association a : objT2){
            	territoryQuery.add(a.ObjectId);
         }
            
            List<Account> CanadaaccountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,ShippingPostalCode,
                                         TradeChannelDesc__c,C360_Owner__c,My_Accounts__c,PremiseTypeNme__c,C360_TOP_INDEPENDENT__c ,C360_Account_Status__c,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND RecordType.DeveloperName IN (:C360_Util_Constants.C360ACCOUNT) AND Id IN :territoryQuery ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi')  LIMIT 30];

            /********************************************************************************************************/
            
            List<Account> accountList = [Select Id,Name,C360_SAP_ID__c,BillingLatitude,BillingLongitude,Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') calculatedDistance ,Distance_From_Current_User__c ,BillingStreet,BillingPostalCode,ShippingPostalCode,
                                         TradeChannelDesc__c,C360_Owner__c,My_Accounts__c,PremiseTypeNme__c,C360_TOP_INDEPENDENT__c ,C360_Account_Status__c,PhotoUrl,Total_13_Wk_Volume__c,Number_of_Brand_Packages_13_Wk__c,Number_of_Brands_13_Wk__c  From Account Where Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi') < 25
                                         AND My_Accounts__c =:myAcc AND RecordType.DeveloperName IN (:Constants.OFFPREMISE,:Constants.ONPREMISE,:Constants.DISTRIBUTOR,:Constants.CHAINPARENT,:Constants.CHAINONPREMISE,:Constants.CHAINOFFPREMISE,:C360_Util_Constants.MCCE_RECORDTYPE,:C360_Util_Constants.UKI_RECORDTYPE,:C360_Util_Constants.MCI_RECORDTYPE) ORDER BY Distance(BillingAddress,GeoLocation(:latitude, :longitude), 'mi')  LIMIT 30];
            if(CanadaaccountList.size()>0){
                return CanadaaccountList;
            }
            else
                return accountList;

        } catch(Exception e){
            
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    /*Apex method to check loggedin userProfile*/
    @AuraEnabled
    public static String profileName(){
        
            
            Id profileId= userinfo.getProfileId();
    		String profileName=[Select Id,Name from Profile where Id=:profileId Limit 1].Name;
        
        return profileName;
    }
}