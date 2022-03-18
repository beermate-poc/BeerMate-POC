/*------------------------------------------------------------
Author:       Monique Rondeau
Company:       Accenture
Description:   
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Monique Rondeau
------------------------------------------------------------*/
public without sharing class BMC_ChainActivityController {
    private static Final String ALL_OTHER  ='All Other';
    private static Final String UNKNOWN  ='Unknown';    
    private static Final String CHAIN_PARENT  ='Chain_Parent';
    /*------------------------------------------------------------
Author:       Monique Rondeau
Company:       Accenture
Description:   
<Date>      <Author Name>     <Brief Description of Change>
3/20/2019   Monique Rondeau
------------------------------------------------------------*/
    @auraenabled
    public static AccountWrapper fetchOutletsFromServer (Id chainActivityId){
        try{
            Account[] allAccounts = new Account[]{};
            
            BMC_Chain_Activity__c chainActivity = [SELECT Id, BMC_Chain_Parent_Account__c, BMC_Where_to_Hunt_List__c, (SELECT id FROM Where_to_Hunt__r WHERE BMC_Chain_Activity_Favorite__c = false) FROM BMC_Chain_Activity__c WHERE Id = :chainActivityId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            Map<Id, Account> accountById = new Map<Id, Account> ([SELECT Id, recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c, ChainStoreNbr__c, Total_13_Wk_Volume__c, StatusNme__c FROM Account WHERE Id = :chainActivity.BMC_Chain_Parent_Account__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]);
            accountById = ACE_AccountHierarchy.getAllChildAccts(accountById, 'recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c, ChainStoreNbr__c, Total_13_Wk_Volume__c, StatusNme__c, BeerFlag__c', null,null);
            accountById = new Map<Id, Account> ([SELECT Id, recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c, ChainStoreNbr__c, Total_13_Wk_Volume__c, StatusNme__c FROM Account WHERE Id =: accountById.values() AND StatusNme__c = 'Active' AND recordType.developerName !=: CHAIN_PARENT AND BeerFlag__c = 'Y' ORDER BY BillingState, ChainStoreNbr__c, OutletCd__c]);
            List<Id> selectedAcctIds = new List<Id>{};
                for(Target_Account__c targetAcct : [select id, Account_Name__c,Target_List__c from target_account__c where Target_List__r.BMC_Chain_Activity_ID__c = :chainActivityId AND Target_List__r.BMC_Chain_Activity_Favorite__c = FALSE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                    selectedAcctIds.add(targetAcct.Account_Name__c);            
                }  
            /*
            for(account acct:accountById.values()){
                if (acct.recordType.developerName <> CHAIN_PARENT){
                    allAccounts.add(acct); 
                }
            }

			*/
            if(!accountById.isEmpty()){
                allAccounts.addAll(accountById.values());
            
            }
                
            
        
            /*    
            BMC_Chain_Activity__c chainActivity = [SELECT Id, BMC_Chain_Parent_Account__c, BMC_Where_to_Hunt_List__c, (SELECT id FROM Where_to_Hunt__r WHERE BMC_Chain_Activity_Favorite__c = false) FROM BMC_Chain_Activity__c WHERE Id = :chainActivityId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            Map<Id, Account> accountById = new Map<Id, Account> ([SELECT Id, recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c, ChainStoreNbr__c, Total_13_Wk_Volume__c FROM Account WHERE Id = :chainActivity.BMC_Chain_Parent_Account__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]);
            list<string> sWhereClause = new list<string>{'recordType.developerName != \'Chain_Parent\''};          
            accountById = ACE_AccountHierarchy.getAllChildAccts(accountById, 'recordType.developerName, Name, BillingStreet, BillingCity, BillingState, OutletCd__c, Distributor_Sales_Regions__c, ParentId, ChainLevelNbr__c, ChainStoreNbr__c, Total_13_Wk_Volume__c',sWhereClause,null);
            
            if(!accountById.isEmpty()){
                allAccounts.addAll(accountById.values());
            }
 
            
            List<Id> selectedAcctIds = new List<Id>{};
            for(Target_Account__c targetAcct : [select id, Account_Name__c,Target_List__c from target_account__c where Target_List__r.BMC_Chain_Activity_ID__c = :chainActivityId AND Target_List__r.BMC_Chain_Activity_Favorite__c = FALSE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                selectedAcctIds.add(targetAcct.Account_Name__c);            
            }  
            */
            if(chainActivity.BMC_Where_to_Hunt_List__c == NULL){
                chainActivity.BMC_Where_to_Hunt_List__c = chainActivity.Where_To_Hunt__r[0].id;
                update chainActivity; 
            }
            
            AccountWrapper accountWrapper = new AccountWrapper(selectedAcctIds, allAccounts);
            return accountWrapper;
        }
        catch(Exception e){
            System.debug(e.getLineNumber());
            System.debug(e.getMessage()); 
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    @auraenabled
    public static void updateRecord(Id chainActivityId){
        BMC_Chain_Activity__c chainActivity = [SELECT Id FROM BMC_Chain_Activity__c WHERE Id = :chainActivityId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        database.update(chainActivity); 
    }
    @auraenabled
    public static Account[] fetchChainLevels (Id chainActivityId){
        try{
            Account[] chainParents = new Account[]{};
                
            BMC_Chain_Activity__c chainActivity = [SELECT Id, BMC_Chain_Parent_Account__c FROM BMC_Chain_Activity__c WHERE Id = :chainActivityId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            Map<Id, Account> accountById = new Map<Id, Account> ([SELECT Id, recordType.developerName, Name, ParentId, ChainLevelNbr__c FROM Account WHERE Id = :chainActivity.BMC_Chain_Parent_Account__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]);
            accountById = ACE_AccountHierarchy.getAllChildAccts(accountById, 'Id, recordType.developerName, Name, ParentId, ChainLevelNbr__c', null,null);
            accountById = new Map<Id, Account> ([SELECT Id, recordType.developerName, Name, ParentId, ChainLevelNbr__c FROM Account WHERE Id =: accountById.values() AND Id <> :chainActivity.BMC_Chain_Parent_Account__c ORDER BY ChainLevelNbr__c, Name]);
            for(account acct:accountById.values()){
                if (acct.recordType.developerName == CHAIN_PARENT){
                    chainParents.add(acct);
                }
            }  
            System.debug('chainParents'+chainParents);
            return chainParents;
        }
        catch(Exception e){
            System.debug(e.getLineNumber());
            System.debug(e.getMessage());
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    @auraenabled
    public static List<FavoriteListWrapper> fetchfavoriteList (Id chainActivityId){
        try{
            User loggedinUser=[Select Id,Name,Email from User where Id=:userinfo.getuserId() limit 1];
            Id chainParentId = [SELECT BMC_Chain_Parent_Account__c FROM BMC_Chain_Activity__c where Id=: chainActivityId limit 1].BMC_Chain_Parent_Account__c ;
            List<Where_to_Hunt__c> listWTH= [select id,Name,Count_Target_Accounts__c,BMC_ChainParent__c ,BMC_Chain_Activity_ID__c  from Where_to_Hunt__c where     BMC_ChainParent__c=: chainParentId and Count_Target_Accounts__c > 0   and BMC_Source__c = : Constants.CA_FAVORITE and (OwnerId =: loggedinUser.Id or CreatedById =: loggedinUser.Id) LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            Boolean check= false;
            List<FavoriteListWrapper> favoriteList = new List<FavoriteListWrapper>();
            for(Where_to_Hunt__c eachWTH : listWTH)
            {
                FavoriteListWrapper favoriteListWrapper = new FavoriteListWrapper(check,eachWTH);
                favoriteList.add(favoriteListWrapper);
            }
            
            return favoriteList;
        }
        catch(Exception e){
            System.debug(e.getLineNumber());
            System.debug(e.getMessage());
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    @auraenabled
    public static void applyTargetAccounts(Id wthID,Id chainActivityId)
    {   
        try{
            Where_to_Hunt__c whereToHunt= [select Id,Name,Count_Target_Accounts__c,BMC_Chain_Activity_ID__c  from Where_to_Hunt__c where BMC_Chain_Activity_ID__c=:chainActivityId and BMC_Source__c = : Constants.CHAIN_EXECUTION Limit 1];
            List<Target_Account__c> relatedTargetAcnts= [select Id from Target_Account__c where Target_List__c =:whereToHunt.Id LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            List<Target_Account__c> selectedTargetAcnts= [select Id,Target_List__c,BMC_Chain_Activity_ID__c,Account_Name__c from Target_Account__c where Target_List__c =:wthID LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            delete relatedTargetAcnts;
            List<Target_Account__c> applyTargetAcnts = new List<Target_Account__c>();
            for(Target_Account__c eachTargetAcnt : selectedTargetAcnts)
            {
                Target_Account__c targetAcct = new Target_Account__c();
                targetAcct.Account_Name__c = eachTargetAcnt.Account_Name__c;
                targetAcct.Target_List__c=whereToHunt.id;
                targetAcct.BMC_Chain_Activity_ID__c = chainActivityId;
                
                applyTargetAcnts.add(targetAcct);
            }
            database.insert(applyTargetAcnts);
            updateRecord(chainActivityId);
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /*------------------------------------------------------------
Author:       Alexandria Sanborn
Company:       Accenture
Description:  1) Deletes and recreates new Target_Account__c on Where_To_Hunt__c non-favorite (update) and 
2) creates new favorite Where_to_Hunt__c list with new Target_Account__c records if isFavorite is true. 
Generated from user input on Lightning Component BMC_CA_Outlet_Selection_Table.
<Date>      <Author Name>     <Brief Description of Change>
4/1/2019   Alexandria Sanborn
------------------------------------------------------------*/
    @auraenabled
    public static void generateWhereToHuntList (String chainActivityId, String acctsSelectedString, Boolean isFavorite, String whereToHuntName){ 
        try{
          BMC_Chain_Activity__c chainObj = [SELECT BMC_Chain_Parent_Account__c FROM BMC_Chain_Activity__c where Id=: chainActivityId limit 1] ;

            
            String[] acctsSelected = (List<String>)System.JSON.deserializeStrict(acctsSelectedString, List<String>.Class);
            Target_Account__c[] targetAccountsToInsert = new Target_Account__c[]{};
                Where_to_Hunt__c whereToHuntFavorite;
            if (isFavorite){
                whereToHuntFavorite = new Where_to_Hunt__c();
                whereToHuntFavorite.Name = whereToHuntName;
                whereToHuntFavorite.BMC_Chain_Activity_Favorite__c =true;
                whereToHuntFavorite.BMC_Chain_Activity_ID__c = chainActivityId;
                whereToHuntFavorite.List_Status__c=Constants.ACTIVE;
                whereToHuntFavorite.BMC_Source__c=Constants.CA_FAVORITE;
                whereToHuntFavorite.BMC_ChainParent__c= chainObj.BMC_Chain_Parent_Account__c;
                Database.insert(whereToHuntFavorite);
            }     
            
            Target_Account__c[] targetAccounts = [SELECT id FROM Target_Account__c WHERE Target_List__r.BMC_Chain_Activity_ID__c=:chainActivityId AND Target_List__r.BMC_Chain_Activity_Favorite__c =false LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ];
            Where_to_Hunt__c whereToHuntMaster = [SELECT id FROM Where_to_Hunt__c WHERE BMC_Chain_Activity_ID__c=:chainActivityId AND BMC_Chain_Activity_Favorite__c=false LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ];
            Database.delete(targetAccounts);
            
            for(Id acctId :acctsSelected){
                Target_Account__c targetAcct = new Target_Account__c();
                targetAcct.Account_Name__c = acctId;
                targetAcct.Target_List__c=whereToHuntMaster.id;
                targetAcct.BMC_Chain_Activity_ID__c = chainActivityId;
                targetAccountsToInsert.add(targetAcct);
                
                if(isFavorite){
                    Target_Account__c targetAcctFav = new Target_Account__c();
                    targetAcctFav.Account_Name__c = acctId;
                    targetAcctFav.Target_List__c=whereToHuntFavorite.id;
                    targetAccountsToInsert.add(targetAcctFav);
                }
                
            }
            System.debug(targetAccountsToInsert);
            Database.insert(targetAccountsToInsert);
            updateRecord(chainObj.Id);
        }
        catch(Exception e){
            System.debug(e.getMessage());
            System.debug(e.getLineNumber());
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    @AuraEnabled
    public static Boolean checkDuplicatWTHName(String wthName){
        try{
            Boolean dupCheck=WhereToHuntDashboardController.checkDuplicateListName(wthName);
            return dupCheck;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description:  Method that gives  current Chain Execution details and Seasonal Brand Group names.
*  @name: getAccountDetails
*  @param: Id recordId, Record Id of Chain Execution
*  @return: ChainActivityWrapper - current Chain Execution details and List of Seasonal Brand Group names.
*/
    @AuraEnabled
    public static ChainActivityWrapper getAccountDetails(Id recordId){
        try{
            BMC_Chain_Activity__c currentChainActivity =[SELECT Id,Name,BMC_Chain_Parent_Account__c,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c,BMC_Mandate_Type__c,BMC_Status__c FROM BMC_Chain_Activity__c WHERE Id =:recordId LIMIT 1];
            List<String> seasonalGroupList = new List<String>();
            Set<String> seasonalGroupSet = new Set<String>();
            
            for(Product__c eachProduct:[SELECT Id, BMC_Seasonal_Brand_Group_Name__c FROM Product__c where BMC_Seasonal_Brand_Group_Name__c!=:Constants.BLANK_WITHOUTSPACE AND BMC_Seasonal_Brand_Group_Name__c !=: ALL_OTHER AND BMC_Seasonal_Brand_Group_Name__c !=: UNKNOWN AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT)  LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ] )
            {
                    seasonalGroupSet.add(eachProduct.BMC_Seasonal_Brand_Group_Name__c);
            }
              seasonalGroupList.addAll(seasonalGroupSet);
            ChainActivityWrapper chainActivityObj=new ChainActivityWrapper(currentChainActivity,seasonalGroupList);
            return chainActivityObj;
            
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    @AuraEnabled
    public static void createChainProducts(Id recordId,String brandValue, Id selectedPkgId){
        try{            
            BMC_Chain_Activity_Product__c caProductobj= new BMC_Chain_Activity_Product__c();
            caProductobj.BMC_Chain_Activity_ID__c=recordId;
            if (selectedPkgId != null) {
                caProductobj.BMC_Chain_Activity_Product__c = selectedPkgId;                
            }
            Database.insert(caProductobj);            
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description:  Method to retrive  Off Premise Package Description/On Premise container code based on Seasonal Brand Group name and Premise type.
*  @name: getPackageNames
*  @param: String seasonalBrandGroupName, Selected Seasonal brand group name
Boolean isOffPremise, Premise type of the current Chain Execution.
*  @return: List of String containing information about BMC_OnPremiseContainerCd__c/ BMC_OffPremisePackageDesc__c field.
*/
    @auraEnabled
    public static List<string> getPackageNames(String seasonalBrandGroupName,Boolean isOffPremise){
        try{
            List<String> packageList = new List<String>();
            Set<String> packageSet = new Set<String>();
            if(!isOffPremise)
            {
                for(Product__c eachProduct :[SELECT Id,OnPremisePackageDesc__c ,BMC_OnPremiseContainerCd__c from Product__c where BMC_Seasonal_Brand_Group_Name__c!=:Constants.BLANK_WITHOUTSPACE AND BMC_Seasonal_Brand_Group_Name__c =:seasonalBrandGroupName AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) ORDER BY BMC_OnPremiseContainerCd__c ASC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())] )
                {
                    packageSet.add(eachProduct.BMC_OnPremiseContainerCd__c);
                }
            }
            else if(isOffPremise)
            {
                for(Product__c eachProduct :[SELECT Id,BMC_OffPremisePackageCd__c ,BMC_OffPremisePackageDesc__c from Product__c where BMC_Seasonal_Brand_Group_Name__c!=:Constants.BLANK_WITHOUTSPACE AND BMC_Seasonal_Brand_Group_Name__c =:seasonalBrandGroupName AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) ORDER BY BMC_OffPremisePackageDesc__c ASC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ] )
                {
                    packageSet.add(eachProduct.BMC_OffPremisePackageDesc__c);
                }
            }
            
            packageList.addAll(packageSet);
            return packageList;
        }catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
        
    }
    /**
*  @description:  Method to insert Chain Execution Proucts.
*  @name: getPackageNames
*  @param: String recordID, Record Id of current Chain Execution.
String seasonalBrandGroupName,Selected Seasonal brand group name.
String packageName, Selected Package name. 
Boolean isOffPremise, Premise type of the current Chain Execution.
*  @return:none
*/
    @auraEnabled
    public static void insertCAProduct(String recordID, String seasonalBrandGroupName , String packageName,Boolean isOffPremise)
    {        
        try{
            Boolean existingCAPCheck = false;
            BMC_Chain_Activity__c chainActivity= [select Id,BMC_Seasonal_Brand_Group__c,BMC_Parent_Premise_Type__c from BMC_Chain_Activity__c  where Id=:recordID  Limit 1];
            List<BMC_Chain_Activity_Product__c> chainActivityProducts= new List<BMC_Chain_Activity_Product__c>();
            BMC_Chain_Activity_Product__c eachCAProduct = new BMC_Chain_Activity_Product__c();
            List<BMC_Chain_Activity_Product__c> oldChainProducts = [SELECT Id,BMC_Chain_Activity_Product__r.BMC_OnPremiseContainerCd__c,BMC_Chain_Activity_Product__r.BMC_OffPremisePackageDesc__c,BMC_Chain_Activity_ID__r.BMC_Seasonal_Brand_Group__c, BMC_PremisePackage_Code__c  ,BMC_Brand_Package__c, BMC_Brand__c, BMC_Package__c  FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_ID__c =: recordID LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]; 
            chainActivity.BMC_Restrict_Deletion_Of_Seasonal_Prodct__c=True;
            if(!oldChainProducts.isEmpty()){
                if(isOffPremise){
                    if(oldChainProducts[0].BMC_Chain_Activity_Product__r.BMC_OffPremisePackageDesc__c == packageName && chainActivity.BMC_Seasonal_Brand_Group__c == seasonalBrandGroupName){
                        existingCAPCheck = true;
                    }
                }
                else{
                    if(chainActivity.BMC_Seasonal_Brand_Group__c == seasonalBrandGroupName && oldChainProducts[0].BMC_Chain_Activity_Product__r.BMC_OnPremiseContainerCd__c == packageName){
                        existingCAPCheck = true;
                    }
                }
                
            }
            if(!existingCAPCheck){
                Map<String,Product__c> productMap= new Map<String,Product__c>();
                for(Product__c eachProduct : [select Id,BMC_OffPremisePackageCd__c,TrademarkBrandLongNme__c,BMC_OnPremiseContainerCd__c,TrademarkBrandCd__c from Product__c
                                              where BMC_Seasonal_Brand_Group_Name__c =: seasonalBrandGroupName AND
                                              (BMC_OnPremiseContainerCd__c = :packageName OR BMC_OffPremisePackageDesc__c =:packageName) AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) LIMIT :(Limits.getLimitQueryRows()-Limits.getQueryRows()) ])
                {
                    productMap.put(eachProduct.TrademarkBrandLongNme__c ,eachProduct);
                }
                
                for(Product__c eachProduct: productMap.values()){
                    eachCAProduct = new BMC_Chain_Activity_Product__c();
                    eachCAProduct.BMC_Chain_Activity_ID__c = chainActivity.Id; 
                    eachCAProduct.BMC_Chain_Activity_Product__c = eachProduct.Id;
                    chainActivityProducts.add(eachCAProduct);
                }
                chainActivity.BMC_Seasonal_Brand_Group__c =seasonalBrandGroupName;
                database.update(chainActivity) ;
                database.insert(chainActivityProducts) ;
                if(!oldChainProducts.isEmpty()){
                    database.delete(oldChainProducts);
                }          
                chainActivity.BMC_Restrict_Deletion_Of_Seasonal_Prodct__c=False;
                database.update(chainActivity) ; 
            }
        }catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        } 
    }
    /**
*  @description:  Wrapper Class that holds Chain Execution Details and Seasonal Brand Group Names.
*  @name: ChainActivityWrapper
*  @param: none
*  @return:none
*/
    
    public without sharing class ChainActivityWrapper{
        @auraEnabled
        public BMC_Chain_Activity__c chainActivity;
        @auraEnabled
        public List<String> seasonalGroupList;
        public ChainActivityWrapper(BMC_Chain_Activity__c chainActivity,List<String> seasonalGroupList)
        {
            this.chainActivity = chainActivity;
            this.seasonalGroupList =seasonalGroupList;
        }
        
    }
    public without sharing class FavoriteListWrapper{
        @auraEnabled
        public boolean checkbox;
        @auraEnabled
        public Where_to_Hunt__c favList;
        public FavoriteListWrapper(boolean checkbox, Where_to_Hunt__c favList){
            this.checkbox = checkbox;
            this.favList = favList;
        }
    }
    
    public without sharing class AccountWrapper{
        @auraEnabled
        public Id[] selectedAccounts; 
        @auraEnabled        
        public Account[] allAccounts; 
        public AccountWrapper(Id[] selectedAccounts, Account[] allAccounts){
            this.selectedAccounts = selectedAccounts;
            this.allAccounts = allAccounts;
        }
    }
}