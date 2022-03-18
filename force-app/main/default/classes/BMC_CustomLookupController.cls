/**
@Author Accenture
@name: BMC_CustomLookupController
@CreateDate  11/12/2018
@Description Includes methods for returning the distributor name for Sample Outlet Selection and Brand Pack Items for Retail Quality Audit scanning
@Version <1.0>
*/
public with sharing class  BMC_CustomLookupController {
    /**
*  @Description: Returns the sObject record. 
*  @name: fetchLookUpValues
*  @param: searchKeyWord:Barcode or Name,ObjectName: sObject Name, recordId: Record Id
*  @return:  List<sObject> - Returns the sObject details.
*/
    @AuraEnabled
    public static List < sObject > fetchLookUpValues(String searchKeyWord, String ObjectName,Id recordId , Id channelid) {
        try{
            String searchKey =Constants.PERCENTAGE +searchKeyWord+ Constants.PERCENTAGE;
            List < sObject > returnList = new List < sObject > (); 
            
            if(ObjectName.equals(Constants.ACCOUNT)){
                returnList=[SELECT ID,Name from Account where  RecordType.Name =:Constants.SOS_DISTRIBUTOR and Name LIKE :searchKey order by createdDate DESC LIMIT : (Limits.getLimitQueryRows()-Limits.getQueryRows())];
            }
            if(ObjectName.equals(Constants.PARTNERFUNDREQUEST) ){
                returnList=[SELECT ID,Name from Account where RecordType.Name =: 'Hierarchy' and C360_Node_Type__c  = 'MU' and   Name LIKE :searchKey order by createdDate DESC LIMIT : (Limits.getLimitQueryRows()-Limits.getQueryRows())];
            }
            if(ObjectName.equals(Constants.PARTNERFUNDALLOCATION) && channelid == null){
                returnList=[SELECT Id, Title, ChannelPartnerId FROM PartnerFundAllocation  LIMIT : (Limits.getLimitQueryRows()-Limits.getQueryRows())];
                
            }
            if(ObjectName.equals(Constants.PARTNERFUNDALLOCATION) && channelid != null){
                returnList=[SELECT Id, Title, ChannelPartnerId FROM PartnerFundAllocation where ChannelPartnerId  =: channelid LIMIT : (Limits.getLimitQueryRows()-Limits.getQueryRows())];
            }
            if(ObjectName.equals(CONSTANTS.RETAIL_QUALITY_AUDIT_BRAND_PACK)){  
                returnList=[SELECT ID,BMC_Brand_Package__r.ContainerTypeCd__c,BMC_Brand_Package_Audit_Pack__c,BMC_Retail_Quality_Audit__c,Name,
                            BMC_Brand_Package__c,BMC_Brand_Package__r.BMC_Inner_Pack_UPC__c,BMC_Brand_Package__r.BMC_Primary_UPC_Container__c,
                            BMC_Brand_Package__r.BMC_Primary_UPC_Short_Container__c, BMC_Brand_Package__r.BMC_Secondary_UPC_Retail_Unit__c,
                            BMC_Brand_Package__r.BMC_Tertiary_UPC_Case_Unit__c from BMC_Retail_Quality_Audit_Brand_Pack__c where 
                            BMC_Retail_Quality_Audit__c=:recordId AND (BMC_Brand_Package__r.BMC_Inner_Pack_UPC__c =: searchKeyWord OR 
                                                                       BMC_Brand_Package__r.BMC_Primary_UPC_Container__c =: searchKeyWord 
                                                                       OR BMC_Brand_Package__r.BMC_Primary_UPC_Short_Container__c =: searchKeyWord
                                                                       OR BMC_Brand_Package__r.BMC_Secondary_UPC_Retail_Unit__c =: searchKeyWord 
                                                                       OR BMC_Brand_Package__r.BMC_Tertiary_UPC_Case_Unit__c =: searchKeyWord) order by createdDate LIMIT 1];
            }
            
            return returnList;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
}