/**
@Author Accenture
@name: BMC_CopyChainExecutionController
@CreateDate   10/17/2019 
@Description Includes methods for Copy of Chain Execution records
@Version <1.0>
*/public without sharing class BMC_CopyChainExecutionController {
    
    /**
*  @description: Returns the details of Chain Activity. 
*  @name: getRelatedCE
*  @param: executionId: BMC_Chain_Activity__c Id
*  @return: chainActivity : Returns BMC_Chain_Activity__c record
*/ 
    @auraenabled
    public static BMC_Chain_Activity__c getRelatedCE(Id executionId){
        //try{
           // System.debug('executionId-->'+executionId);
            BMC_Chain_Activity__c chainActivity = [SELECT Id, Name,BMC_Chain_Activity_Name__c, recordTypeId,recordType.Name, BMC_Mandate_Type__c, BMC_Chain_Parent_Account__c,BMC_Chain_Parent_Account__r.Name, BMC_Total_Products_Possible__c,BMC_Start_Date__c, BMC_Status__c, BMC_Notes__c, BMC_Gap_Calculation_Status__c, BMC_End_Date__c, BMC_Total_Outlets_Selected__c, BMC_Mobile_Restriction__c, BMC_Monthly_Business_Objectives__c, BMC_Happy_Hour_Specials__c, BMC_Weekly_Features__c, BMC_LTO_BOM__c, BMC_Ad_Feature__c, BMC_Display__c, BMC_Event__c, BMC_POS__c, BMC_Other__c, BMC_Electronic_Funds_Transfer__c, BMC_Program_Cost_Estimate__c,BMC_Distributor_Option_Minimum_Products__c, BMC_Seasonal_Brand_Group__c   FROM BMC_Chain_Activity__c WHERE Id = :executionId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
           // System.debug('BMC_Monthly_Business_Objectives__c-->'+chainActivity.BMC_Monthly_Business_Objectives__c);
            return chainActivity;
        /*}catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }*/
    }
    
    /**
*  @description: Returns the details of User. 
*  @name: getUserName
*  @param: null
*  @return: userRecord : Returns User details
*/ 
    @AuraEnabled 
    public static user getUserName(){
        try{
            User userRecord = [select id,Name from User where id =: userInfo.getUserId()];
            return userRecord;
        }catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    /**
*  @description: Saves and returns the Chain Activity record. 
*  @name: checkandsave
*  @param: executionId-BMC_Chain_Activity__c Id, executionname-Name, MandateType-BMC_Mandate_Type__c, status-BMC_Status__c, startDate-BMC_Start_Date__c, endDate-BMC_End_Date__c, MBO-BMC_Monthly_Business_Objectives__c, Notes-BMC_Notes__c, happyhr-BMC_Happy_Hour_Specials__c, weekly-BMC_Weekly_Features__c, adfeature-BMC_Ad_Feature__c, display-BMC_Display__c, event-BMC_Event__c, pos-BMC_POS__c, other-BMC_Other__c, eft-BMC_Electronic_Funds_Transfer__c, costest-BMC_Program_Cost_Estimate__c
*  @return: newexecution : Returns cloned Chain Activity record
*/ 
    @AuraEnabled
    public static BMC_Chain_Activity__c checkandsave(Id executionId, String executionname, String MandateType, String status, Date startDate, Date endDate, String MBO, String Notes, Boolean happyhr, Boolean ltobom, Boolean weekly, Boolean adfeature, Boolean display, Boolean event, Boolean pos, Boolean other, Boolean eft, String costest) {
        try{
            BMC_Chain_Activity__c oldChainExecution =[SELECT id, Name, BMC_Mandate_Type__c, RecordTypeId,BMC_End_Date__c,BMC_Start_Date__c,BMC_Chain_Parent_Account__c FROM BMC_Chain_Activity__c WHERE Id =:executionId];
            BMC_Chain_Activity__c newexecution = new BMC_Chain_Activity__c();
            newexecution.RecordTypeId=oldChainExecution.RecordTypeId;
            newexecution.BMC_Chain_Activity_Name__c =executionname;
            newexecution.BMC_Status__c='Pending';
            newexecution.BMC_Mandate_Type__c= oldChainExecution.BMC_Mandate_Type__c;
            newexecution.BMC_Start_Date__c= startDate;
            newexecution.BMC_End_Date__c = endDate;
            newexecution.BMC_Monthly_Business_Objectives__c =MBO;
            newexecution.BMC_Notes__c =Notes;
            newexecution.BMC_Happy_Hour_Specials__c =happyhr;
            newexecution.BMC_LTO_BOM__c =ltobom;
            newexecution.BMC_Weekly_Features__c =weekly;
            newexecution.BMC_Ad_Feature__c =adfeature;
            newexecution.BMC_Display__c=display;
            newexecution.BMC_Event__c=event;
            newexecution.BMC_POS__c=pos;
            newexecution.BMC_Other__c=other;
            newexecution.BMC_Electronic_Funds_Transfer__c=eft;
            newexecution.BMC_Program_Cost_Estimate__c=costest;
            newexecution.BMC_Chain_Parent_Account__c=oldChainExecution.BMC_Chain_Parent_Account__c;
            newexecution.BMC_Cloned__c=true;
            Insert newexecution;
            if(oldChainExecution.BMC_Chain_Parent_Account__c==newexecution.BMC_Chain_Parent_Account__c){
               
                BMC_Chain_Activity__c insertedCE =[SELECT id,Name,BMC_Chain_Parent_Account__c,BMC_Gap_Calculation_Status__c FROM BMC_Chain_Activity__c WHERE Id =:newexecution.Id];
               // system.debug('Before whereToHuntCE executionId---------'+executionId);
                Where_to_Hunt__c whereToHuntCE = [SELECT id ,BMC_Chain_Activity_Favorite__c,List_Status__c FROM Where_to_Hunt__c  WHERE BMC_Chain_Activity_ID__c=:executionId and BMC_Chain_Activity_Favorite__c=false ];
               // system.debug('whereToHuntCE---------'+whereToHuntCE);
                Where_to_Hunt__c clonedWhereToHunt = whereToHuntCE.clone( false, true, false, false );
                clonedWhereToHunt.Name= insertedCE.Name;
                clonedWhereToHunt.BMC_Chain_Activity_ID__c = insertedCE.Id;
                if(insertedCE.BMC_Gap_Calculation_Status__c =='Current' || insertedCE.BMC_Gap_Calculation_Status__c =='Future'){
                    clonedWhereToHunt.List_Status__c=Constants.ACTIVE;
                }
                else{
                    clonedWhereToHunt.List_Status__c='Inactive';
                }
                //clonedWhereToHunt.List_Status__c=Constants.ACTIVE;
                clonedWhereToHunt.BMC_Source__c=Constants.CHAIN_EXECUTION;
                clonedWhereToHunt.BMC_ChainParent__c= insertedCE.BMC_Chain_Parent_Account__c;
                insert clonedWhereToHunt;
                Target_Account__c[] targetAccountsToInsert = new Target_Account__c[]{};
                    List<Id> selectedAcctIds = new List<Id>{};
                        for(Target_Account__c targetAcct : [select id, Account_Name__c,Target_List__c from target_account__c where Target_List__r.BMC_Chain_Activity_ID__c = :executionId AND Target_List__r.BMC_Chain_Activity_Favorite__c = FALSE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                            selectedAcctIds.add(targetAcct.Account_Name__c);            
                        }  
                for(Id acctId :selectedAcctIds){
                    Target_Account__c targetAcct = new Target_Account__c();
                    targetAcct.Account_Name__c = acctId;
                    targetAcct.Target_List__c=clonedWhereToHunt.id;
                    targetAcct.BMC_Chain_Activity_ID__c = insertedCE.Id;
                    targetAccountsToInsert.add(targetAcct);
                    
                }
                Database.insert(targetAccountsToInsert);
                insertedCE.BMC_Where_to_Hunt_List__c=clonedWhereToHunt.Id;
                database.update(insertedCE); 
                
                BMC_Chain_Activity_Product__c[] ChainProductsToInsert = new BMC_Chain_Activity_Product__c[]{};
                    
                    List<BMC_Chain_Activity_Product__c> oldChainProducts = [SELECT Id,BMC_Chain_Activity_Product__r.BMC_OnPremiseContainerCd__c,BMC_Chain_Activity_Product__r.BMC_OffPremisePackageDesc__c,BMC_Chain_Activity_ID__r.BMC_Seasonal_Brand_Group__c, BMC_PremisePackage_Code__c  ,BMC_Brand_Package__c, BMC_Brand__c, BMC_Package__c  FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_ID__c =: executionId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]; 
                for(BMC_Chain_Activity_Product__c chainproducts :oldChainProducts){
                    BMC_Chain_Activity_Product__c  clonedchainproduct = chainproducts.clone( false, true, false, false );
                    clonedchainproduct.BMC_Chain_Activity_ID__c=insertedCE.Id;
                    ChainProductsToInsert.add(clonedchainproduct);
                    
                }    
                Database.insert(ChainProductsToInsert);
            }
            return newexecution; 
            
        }
        catch(DMLException e)
        {
            throw new AuraHandledException( e.getDMLMessage(0) );
        }
    }
    
    /**
*  @description: Saves and returns the Chain Mandate record. 
*  @name: checkAndSaveMandate
*  @param: executionId-BMC_Chain_Activity__c Id, executionname-Name, MandateType-BMC_Mandate_Type__c, status-BMC_Status__c, startDate-BMC_Start_Date__c, endDate-BMC_End_Date__c, Notes-BMC_Notes__c, MinProducts-BMC_Distributor_Option_Minimum_Products__c, SeasonalBg-BMC_Seasonal_Brand_Group__c
*  @return: newexecution : Returns cloned Chain Mandate record
*/ 
    @AuraEnabled
    public static BMC_Chain_Activity__c checkAndSaveMandate(Id executionId, String executionname, String MandateType, String status, Date startDate, Date endDate, String Notes, String MinProducts, String SeasonalBg) {
        try{
            BMC_Chain_Activity__c oldChainExecution =[SELECT id, Name, BMC_Mandate_Type__c, RecordTypeId,BMC_End_Date__c,BMC_Start_Date__c,BMC_Chain_Parent_Account__c FROM BMC_Chain_Activity__c WHERE Id =:executionId];
            BMC_Chain_Activity__c newexecution = new BMC_Chain_Activity__c();
            newexecution.RecordTypeId=oldChainExecution.RecordTypeId;
            newexecution.BMC_Chain_Activity_Name__c =executionname;
            newexecution.BMC_Status__c='Pending';
            newexecution.BMC_Mandate_Type__c= MandateType;
            newexecution.BMC_Start_Date__c= startDate;
            newexecution.BMC_End_Date__c = endDate;
            newexecution.BMC_Notes__c =Notes;
            newexecution.BMC_Distributor_Option_Minimum_Products__c =MinProducts;
            newexecution.BMC_Seasonal_Brand_Group__c =SeasonalBg;
            newexecution.BMC_Chain_Parent_Account__c=oldChainExecution.BMC_Chain_Parent_Account__c;
            newexecution.BMC_Cloned__c=true;
            Insert newexecution;
            if(oldChainExecution.BMC_Chain_Parent_Account__c==newexecution.BMC_Chain_Parent_Account__c){
                BMC_Chain_Activity__c insertedCE =[SELECT id,Name,BMC_Chain_Parent_Account__c,BMC_Gap_Calculation_Status__c FROM BMC_Chain_Activity__c WHERE Id =:newexecution.Id];
               // system.debug('Before whereToHuntCE executionId---------'+executionId);
                Where_to_Hunt__c whereToHuntCE = [SELECT id FROM Where_to_Hunt__c WHERE BMC_Chain_Activity_ID__c=:executionId and BMC_Chain_Activity_Favorite__c=false];
               // system.debug('whereToHuntCE---------'+whereToHuntCE);
                Where_to_Hunt__c clonedWhereToHunt = whereToHuntCE.clone( false, true, false, false );
                clonedWhereToHunt.Name= insertedCE.Name;
                clonedWhereToHunt.BMC_Chain_Activity_ID__c = insertedCE.Id;
                
                if(insertedCE.BMC_Gap_Calculation_Status__c =='Current' || insertedCE.BMC_Gap_Calculation_Status__c =='Future'){
                    clonedWhereToHunt.List_Status__c=Constants.ACTIVE;
                }
                else{
                    clonedWhereToHunt.List_Status__c='Inactive';
                }
                //clonedWhereToHunt.List_Status__c=Constants.ACTIVE;
                clonedWhereToHunt.BMC_Source__c=Constants.CHAIN_EXECUTION;
                clonedWhereToHunt.BMC_ChainParent__c= insertedCE.BMC_Chain_Parent_Account__c;
                insert clonedWhereToHunt;
                Target_Account__c[] targetAccountsToInsert = new Target_Account__c[]{};
                    List<Id> selectedAcctIds = new List<Id>{};
                        for(Target_Account__c targetAcct : [select id, Account_Name__c,Target_List__c from target_account__c where Target_List__r.BMC_Chain_Activity_ID__c = :executionId AND Target_List__r.BMC_Chain_Activity_Favorite__c = FALSE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows()) ]){
                            selectedAcctIds.add(targetAcct.Account_Name__c);            
                        }  
                for(Id acctId :selectedAcctIds){
                    Target_Account__c targetAcct = new Target_Account__c();
                    targetAcct.Account_Name__c = acctId;
                    targetAcct.Target_List__c=clonedWhereToHunt.id;
                    targetAcct.BMC_Chain_Activity_ID__c = insertedCE.Id;
                    targetAccountsToInsert.add(targetAcct);
                    
                }
                Database.insert(targetAccountsToInsert);
                insertedCE.BMC_Where_to_Hunt_List__c=clonedWhereToHunt.Id;
                insertedCE.BMC_Restrict_Deletion_Of_Seasonal_Prodct__c=True;
                database.update(insertedCE); 
                
                BMC_Chain_Activity_Product__c[] ChainProductsToInsert = new BMC_Chain_Activity_Product__c[]{};
                    
                    List<BMC_Chain_Activity_Product__c> oldChainProducts = [SELECT Id,BMC_Chain_Activity_Product__r.BMC_OnPremiseContainerCd__c,BMC_Chain_Activity_Product__r.BMC_OffPremisePackageDesc__c,BMC_Chain_Activity_ID__r.BMC_Seasonal_Brand_Group__c, BMC_PremisePackage_Code__c  ,BMC_Brand_Package__c, BMC_Brand__c, BMC_Package__c  FROM BMC_Chain_Activity_Product__c where BMC_Chain_Activity_ID__c =: executionId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]; 
                for(BMC_Chain_Activity_Product__c chainproducts :oldChainProducts){
                    BMC_Chain_Activity_Product__c  clonedchainproduct = chainproducts.clone( false, true, false, false );
                    clonedchainproduct.BMC_Chain_Activity_ID__c=insertedCE.Id;
                    ChainProductsToInsert.add(clonedchainproduct);
                    
                }    
                Database.insert(ChainProductsToInsert);
                insertedCE.BMC_Restrict_Deletion_Of_Seasonal_Prodct__c=True;
                database.update(insertedCE);
            }
             
            
            return newexecution;
        }
        catch(DMLException e)
        {
            //return e.getDMLMessage(0);
            throw new AuraHandledException( e.getDMLMessage(0) );
        }
    }
}