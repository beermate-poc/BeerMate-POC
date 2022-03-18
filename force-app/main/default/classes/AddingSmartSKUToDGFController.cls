/**
* @author        Accenture 
* @Name          AddingSmartSKUToDGFController
* @Created date  07/13/2020
* @description   Controller for lightning cmp "AddingSmartSKUToDGF", it fetches list of associated SKU records based on calculator's Account or DRO for Distribution Gap Finder type.
* @Version       1.0
* JIRA LINK      GB-11615
**/
public with sharing class AddingSmartSKUToDGFController {
	Public static Final String  SUCCESSSTR = 'Success';
    Public static Final String  COMMASTR = ', ';
    Public static Final String  SEMICOLONSTR = ': ';
    
    
    /*
    * @author         Accenture                                       
    * @version        1.0                                    
    * @date           07/13/2020                                                  
    * @description    It fetches the Calculator record
    * @param          Id
    * @return         Calculations__c
    * @throws         NA
    */
    @AuraEnabled
    public static Calculations__c getCalculator(ID calId){
        
        return [Select Id, recordtypeId,SmartSKU_Projections__c,Units_per_Case__c,Case_Cost__c,Listed_Retail_Price__c,Account__c,Distributor_Retail_Outlet__c,CE_s_90_Days__c from Calculations__c Where Id =: calId LIMIT 1];
        
    }
    
    /*
    * @author         Accenture                                       
    * @version        1.0                                    
    * @date           07/13/2020                                                  
    * @description    It fetches the SKU records record
    * @param          ID accId,Id skuId
    * @return         List<SmartSKUResults>
    * @throws         NA
    */
    @AuraEnabled
    public static List<SmartSKUResults> getSKUsForAccount(ID accId,Id skuId){
        List<SmartSKUResults> smartSKUList = new List<SmartSKUResults>();
        //system.debug('acc--'+accId+'--SKUID---'+skuId);
        if(accId != null){
            for(SmartSKUs__c ssku : [Select id,Name,Retail_Outlet__c,Distributor_Retail_Outlet__c,Projected90Days__c from SmartSKUs__c where Retail_Outlet__c = :accId LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
            	SmartSKUResults sku = new SmartSKUResults();
                //system.debug('ssku==='+ssku);
                sku.id = ssku.id;
                if(ssku.Projected90Days__c != null){
                    sku.label = ssku.Name+COMMASTR+System.Label.Projected90Days+SEMICOLONSTR+ssku.Projected90Days__c;
                }else{
                	sku.label = ssku.Name ;
                }
                if(skuId == ssku.id){
                    sku.selected = true;
                }else{
                    sku.selected = false;
                }
                smartSKUList.add(sku);
            }
        }
        return smartSKUList;
        
    }
    
    /*
    * @author         Accenture                                       
    * @version        1.0                                    
    * @date           07/13/2020                                                  
    * @description    It fetches the SKU records record
    * @param          ID droId,Id skuId
    * @return         List<SmartSKUResults>
    * @throws         NA
    */
    @AuraEnabled
    public static List<SmartSKUResults> getSKUsForDRO(ID droId,Id skuId){
        List<SmartSKUResults> smartSKUList = new List<SmartSKUResults>();
        if(droId != null){
            for(SmartSKUs__c ssku : [Select id,Name,Retail_Outlet__c,Distributor_Retail_Outlet__c,Projected90Days__c from SmartSKUs__c where Distributor_Retail_Outlet__c = :droId LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]){
            	SmartSKUResults sku = new SmartSKUResults();
                sku.id = ssku.id;
                if(ssku.Projected90Days__c != null){
                    sku.label = ssku.Name+COMMASTR+System.Label.Projected90Days+SEMICOLONSTR+ssku.Projected90Days__c;
                }else{
                	sku.label = ssku.Name ;
                }
                if(skuId == ssku.id){
                    sku.selected = true;
                }else{
                    sku.selected = false;
                }
                smartSKUList.add(sku);    
            }
        }
        return smartSKUList;
        
    }
    
    /*
    * @author         Accenture                                       
    * @version        1.0                                    
    * @date           07/13/2020                                                  
    * @description    Wrapper class
    * @param          ID droId,Id skuId
    * @return         SmartSKUResults
    * @throws         NA
    */
    public class SmartSKUResults {
        @AuraEnabled
        public String label {get; set;}
        @AuraEnabled
        public String id {get; set;}
        @AuraEnabled
        public boolean selected {get; set;}
    }
    
    /*
    * @author         Accenture                                       
    * @version        1.0                                    
    * @date           07/13/2020                                                  
    * @description    It saves the passed Calculations__c record
    * @param          Calculations__c
    * @return         String
    * @throws         When DML fails
    */
    @AuraEnabled
    public static String saveCalculator(Calculations__c cal){
        
        try{
            Database.update(cal);
            return SUCCESSSTR;
        }catch(DMLException ex){
            //System.debug('<<<<<<<<e.getDMLMessage(0)>>>>>>'+e.getDMLMessage(0));
            return ex.getDMLMessage(0);
        }
        
    }
}