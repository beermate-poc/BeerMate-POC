/**
@Author Accenture
@name BMC_CA_ProductTriggerHandler
@CreateDate  9/13/2018
@Description Trigger handler to concatenate all products added or deleted for a chain exceution .
@Version <1.0>
*/
public without sharing class BMC_CA_ProductTriggerHandler {
    private static final String INSERT_ACTION ='INSERT';
    private static final String DELETE_ACTION ='DELETE';
    private static final String COMMA_SPACE =', ';
    
    /**
*  @description: Concatenates all the barnd pack for Chain Execution. 
*  @name: concatenateBrandPack
*  @param: caProdmap:inserted or updated products, caList: Chain execution record for which products are added
*  @return: void
*/
    
    public static void concatenateBrandPack(Map<ID,List<BMC_Chain_Activity_Product__c>> caProdmap, List<BMC_Chain_Activity__c> caList){
        try{
            List<BMC_Chain_Activity__c>  updateCaList= new  List<BMC_Chain_Activity__c> ();         
            for(BMC_Chain_Activity__c caObj:caList){
                for(BMC_Chain_Activity_Product__c chainprodObj: caProdMap.get(caObj.Id) ){
                    if(String.IsBlank(caObj.BMC_All_Brand_Packages__c)){
                        caObj.BMC_All_Brand_Packages__c=chainprodObj.BMC_Brand_Package__c;
                    }                    
                    else{
                        caObj.BMC_All_Brand_Packages__c= caObj.BMC_All_Brand_Packages__c+COMMA_SPACE+chainprodObj.BMC_Brand_Package__c; 
                    }
                }
                
                updateCaList.add(caObj);
            }
            database.update(updateCaList);
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    /**
*  @description: Removes the product from concatenated field if product is deleted. 
*  @name: updateBrandPack
*  @param: caProdmap:deleted products, caList: Chain execution record for which products are deleted.
*  @return: void
*/
    public static void updateBrandPack(Map<ID,List<BMC_Chain_Activity_Product__c>> caProdmap,List<BMC_Chain_Activity__c> caList){
        try{
            List<BMC_Chain_Activity__c>  updateCaList= new  List<BMC_Chain_Activity__c> ();         
            for(BMC_Chain_Activity__c caObj:caList){
                for(BMC_Chain_Activity_Product__c chainprodObj: caProdMap.get(caObj.Id) ){                
                    if(caObj.BMC_All_Brand_Packages__c.contains(COMMA_SPACE+chainprodObj.BMC_Brand_Package__c+COMMA_SPACE)){
                        caObj.BMC_All_Brand_Packages__c=caObj.BMC_All_Brand_Packages__c.replace(chainprodObj.BMC_Brand_Package__c+COMMA_SPACE,constants.BLANK_WITHOUTSPACE);
                    }                    
                    else if(caObj.BMC_All_Brand_Packages__c.contains(chainprodObj.BMC_Brand_Package__c+COMMA_SPACE)){  
                        caObj.BMC_All_Brand_Packages__c=caObj.BMC_All_Brand_Packages__c.replace(chainprodObj.BMC_Brand_Package__c+COMMA_SPACE,constants.BLANK_WITHOUTSPACE);
                    }
                    else if(caObj.BMC_All_Brand_Packages__c.contains(COMMA_SPACE+chainprodObj.BMC_Brand_Package__c)){
                        caObj.BMC_All_Brand_Packages__c=caObj.BMC_All_Brand_Packages__c.replace(COMMA_SPACE+chainprodObj.BMC_Brand_Package__c,constants.BLANK_WITHOUTSPACE);
                    }
                    else if (caObj.BMC_All_Brand_Packages__c.contains(chainprodObj.BMC_Brand_Package__c)){
                        caObj.BMC_All_Brand_Packages__c=caObj.BMC_All_Brand_Packages__c.replace(chainprodObj.BMC_Brand_Package__c,constants.BLANK_WITHOUTSPACE);
                    }                    
                }
                updateCaList.add(caObj);
            }
            database.update(updateCaList);
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: method to fetch the details about products and chain exceutions. 
*  @name: caPoductMapping
*  @param: caProdlist:inserted/updated/deleted products, action: insert or deleted.
*  @return: void
*/   
    public static void caPoductMapping(List<BMC_Chain_Activity_Product__c> caProdlist,String action){
        try{
            Map<ID,List<BMC_Chain_Activity_Product__c>> caProdmap= new  Map<ID,List<BMC_Chain_Activity_Product__c>>();
            for(BMC_Chain_Activity_Product__c caProdobj:[SELECT Id,BMC_Brand_Package__c,BMC_Chain_Activity_ID__c from BMC_Chain_Activity_Product__c 
                                                         where Id IN: caProdlist LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                             if(caProdMap.containsKey(caProdobj.BMC_Chain_Activity_ID__c)){
                                                                 List<BMC_Chain_Activity_Product__c> prodList= caProdMap.get(caProdobj.BMC_Chain_Activity_ID__c);
                                                                 prodList.add(caProdobj);
                                                                 caProdMap.put(caProdobj.BMC_Chain_Activity_ID__c,prodList);
                                                             }
                                                             else{
                                                                 caProdMap.put(caProdobj.BMC_Chain_Activity_ID__c,new List<BMC_Chain_Activity_Product__c> {caProdobj});
                                                             }
                                                         }
            if(!caProdmap.isEmpty()){
                List<BMC_Chain_Activity__c> caList=[select Id,BMC_All_Brand_Packages__c from BMC_Chain_Activity__c where Id IN:caProdMap.keyset() LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];            
                if(action.equals(INSERT_ACTION)){
                    concatenateBrandPack(caProdmap,caList);
                }
                else if(action.equals(DELETE_ACTION)){
                    updateBrandPack(caProdmap,caList);
                }
            }
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
}