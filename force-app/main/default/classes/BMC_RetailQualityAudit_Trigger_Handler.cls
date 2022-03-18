/**
@Author Accenture
@name BMC_RetailQualityAudit_Trigger_Handler
@CreateDate  9/13/2018
@Description Trigger handler to create brand pack items for Account during Audit.
@Version <1.0>
*/
public  without sharing class BMC_RetailQualityAudit_Trigger_Handler {   
    private static Final String CLASSNAME = 'BMC_RetailQualityAudit_Trigger_Handler';
    private static Final String METHODNAME = 'createBrandpacks';
    /**
    *   @description: Create brand pack items for Account during Audit. 
    *  @name: createBrandpacks
    *  @param: retailQualityList: Retail Quality Audit Records
    *  @return: null
    */    
    public static void createBrandpacks(List<BMC_Retail_Quality_Audit__c> retailQualityList){
        try{    
            set<Id> outletIds= new set<Id>();
            set<Id> distributorIds= new set<Id>();
            
            for(BMC_Retail_Quality_Audit__c rqa : retailQualityList ){
                outletIds.add(rqa.BMC_Outlet__c);
                distributorIds.add(rqa.BMC_Distributor__c ); 
            }
            
            Map<String,Product__c> prodMap= new   Map<String,Product__c>(); 
            Set<String> trademarkCodelist= new Set<String>();
            Set<String> packageDesclist= new Set<String>();
            for(Product__c prodObj:[SELECT Id, TRADEMARKBRANDCD__C,PackageDesc__c,OnPremisePackageDesc__c FROM Product__c where TrademarkBrandLongNme__c !=: Constants.BLANK_WITHOUTSPACE AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                trademarkCodelist.add(prodObj.TRADEMARKBRANDCD__C);
                packageDesclist.add(prodObj.OnPremisePackageDesc__c);
                packageDesclist.add(prodObj.PackageDesc__c);
                String offKey = prodObj.TRADEMARKBRANDCD__C+prodObj.PackageDesc__c;
                String onKey = prodObj.TRADEMARKBRANDCD__C+prodObj.OnPremisePackageDesc__c;
                prodMap.put(offKey,prodObj);
                prodMap.put(onKey,prodObj);
            }   
            
            Map<ID,List<STR_Brand_Package__c>> strMap= new Map<ID,List<STR_Brand_Package__c>>();
            for(STR_Brand_Package__c strObj:[SELECT Id, L13WK__c, Retail_Outlet__c, BMC_TradeMarkBrandcode__c,BMC_PackageDesc__c ,Distributor__c,Last_Purchase_Date__c , Name
                                             FROM STR_Brand_Package__c where Retail_Outlet__c IN :outletIds and Distributor__c IN : distributorIds and BMC_TradeMarkBrandcode__c IN :trademarkCodelist and BMC_PackageDesc__c IN :packageDesclist LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                 {
                                                     for(BMC_Retail_Quality_Audit__c retailObj: retailQualityList)  {
                                                         if(retailObj.BMC_Outlet__c==strObj.Retail_Outlet__c && retailObj.BMC_Distributor__c  == strObj.Distributor__c && 
                                                            (strObj.Last_Purchase_Date__c<=retailObj.BMC_Audit_Date__c && strObj.Last_Purchase_Date__c>= retailObj.BMC_Audit_Date__c.addDays(-91))){
                                                                
                                                                if(strMap.containsKey(retailObj.Id)) {
                                                                    List<STR_Brand_Package__c> strPackList=strMap.get(retailObj.Id);
                                                                    strPackList.add(strObj);
                                                                    strMap.put(retailObj.Id,strPackList);
                                                                }  
                                                                else{
                                                                    strMap.put(retailObj.Id, new List<STR_Brand_Package__c> {strObj});
                                                                }
                                                                trademarkCodelist.add(strObj.BMC_TradeMarkBrandcode__c);
                                                                packageDesclist.add(strObj.BMC_PackageDesc__c);
                                                            }
                                                     }
                                                 }
                                                 
                                             }
            
            
            List<BMC_Retail_Quality_Audit_Brand_Pack__c> brandpackList= new List<BMC_Retail_Quality_Audit_Brand_Pack__c>();
            
            for (Id recordId : strMap.keySet())
            {
                for (STR_Brand_Package__c strPackobj : strMap.get(recordId))
                {
                    String strcodePackage=strPackobj.BMC_TradeMarkBrandcode__c+strPackobj.BMC_PackageDesc__c;                    
                    if(strPackobj.BMC_TradeMarkBrandcode__c==prodMap.get(strcodePackage).TRADEMARKBRANDCD__C && 
                       (strPackobj.BMC_PackageDesc__c==prodMap.get(strcodePackage).PackageDesc__c  || strPackobj.BMC_PackageDesc__c==prodMap.get(strcodePackage).OnPremisePackageDesc__c )){
                           BMC_Retail_Quality_Audit_Brand_Pack__c retailbrandpackObj= new BMC_Retail_Quality_Audit_Brand_Pack__c();
                           retailbrandpackObj.BMC_Retail_Quality_Audit__c=recordId;
                           retailbrandpackObj.BMC_Brand_Package__c=prodMap.get(strcodePackage).Id;
                           retailbrandpackObj.BMC_Brand_Package_Audit_Pack__c=strPackobj.Name;
                           brandpackList.add(retailbrandpackObj);
                       }
                }
            }
            if(!brandpackList.isEmpty()){
                database.insert(brandpackList);
            }                
        }
        catch(Exception e){
            ErrorLog.insertErrorLog(CLASSNAME, METHODNAME, e.getMessage(), e.getLineNumber());
        }  
    }
    
}