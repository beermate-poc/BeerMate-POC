/**
@Author Accenture
@name: BMC_RetailQualityController
@CreateDate  9/13/2018
@Description Includes methods for Audit Functionality
@Version <1.0>
*/
public with sharing class BMC_RetailQualityController {
    /**
*  @description: Returns the details of Retail Quality Audit record. 
*  @name: getRetailQualityAuditinfo
*  @param: recordId: Retail Quality Audit Record Id
*  @return: BMC_Retail_Quality_Audit__c - Returns Retail Quality Audit Record
*/
    @AuraEnabled
    public static BMC_Retail_Quality_Audit__c getRetailQualityAuditinfo(Id recordId){
        try{
            return [SELECT Id,BMC_Outlet__r.RecordType.Name,BMC_Audit_DateTime__c,BMC_RQA_QOOC_percent__c,BMC_RQA_QOOR_percent__c,BMC_RQA_QCE__c,BMC_RQA_QOOC__c FROM BMC_Retail_Quality_Audit__c WHERE Id =:recordId LIMIT 1];
            
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns the details of Account record. 
*  @name: getAccountRecord
*  @param: recordId:Account Record Id
*  @return: Account - Returns Account Record
*/
    @AuraEnabled
    public static Account getAccountRecord(Id recordId){
        try{
            return [SELECT Id, Name  FROM Account WHERE Id =:recordId LIMIT 1];
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns the list of distributors associated with Retail Account Record. 
*  @name: getAllDistributor
*  @param: recordId:Reatil Account Record Id
*  @return: List<String> - Returns Distributor List
*/
    @AuraEnabled
    public static List<String> getAllDistributor(Id recordId){
        try{
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            Map<string, String> lstResult = new Map<string, String>();
            for(Distributor_Retail_Outlet__c distributorObj: [SELECT Id, Name, DistributorAccount__r.Name,DistributorAccount__c, RetailOutlet__c FROM Distributor_Retail_Outlet__c where RetailOutlet__c=:recordId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                AutoCompleteResults pakAge = new AutoCompleteResults();
                pakAge.name = distributorObj.DistributorAccount__r.Name;
                pakAge.id = distributorObj.DistributorAccount__c;
                lstResult.put(pakAge.name, JSON.serialize(pakAge));
            }
            return lstResult.values();
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns the list of brand pack items for Retail Quality Audit Record. 
*  @name: fetchBrandpacks
*  @param: recordId:Retail Quality Audit Record Id,auditDate: Audit Date
*  @return: List<BMC_Retail_Quality_Audit_Brand_Pack__c> - Returns list of brand pack items.
*/
    @AuraEnabled
    public static List<BMC_Retail_Quality_Audit_Brand_Pack__c> fetchBrandpacks(Id recordId, DateTime auditDate){
        try{
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return [SELECT Id,BMC_Brand_Package__r.TrademarkBrandPackageLongDesc__c,BMC_Brand_Package_Audit_Pack__c ,BMC_Total_Number_Of_Audits__c,(SELECT ID,BMC_Code_Date__c from Audit_Items1__r where BMC_Code_Date__c <: auditDate limit 1) from BMC_Retail_Quality_Audit_Brand_Pack__c where BMC_Retail_Quality_Audit__c=: recordId ORDER BY BMC_Brand_Package__r.TrademarkBrandPackageLongDesc__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns the list of Brand Family for Retail Quality Audit Record. 
*  @name: retrieveBrandFamily
*  @param: recordId:Retail Quality Audit Record Id
*  @return: List<String> - Returns list of brand family.
*/
    @AuraEnabled
    public static List<String> retrieveBrandFamily(Id recordId){
        try{
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            Map<string, String> lstResult = new Map<string, String>();
            for(BMC_Retail_Quality_Audit_Brand_Pack__c bp : [SELECT Id, BMC_Brand_Package__r.TrademarkBrandFamilyNme__c FROM BMC_Retail_Quality_Audit_Brand_Pack__c where BMC_Retail_Quality_Audit__c=:recordId  ORDER BY BMC_Brand_Package__r.TrademarkBrandFamilyNme__c ASC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                AutoCompleteResults pakAge = new AutoCompleteResults();
                pakAge.name = bp.BMC_Brand_Package__r.TrademarkBrandFamilyNme__c;
                pakAge.id = bp.id;
                lstResult.put(pakAge.name, JSON.serialize(pakAge));
            }
            return lstResult.values();
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns the list of brand pack items for Retail Quality Audit Record for selected Brand Family. 
*  @name: retrieveBrandFamily
*  @param: recordId:Retail Quality Audit Record Id, brandFamily: Brand Family selected, auditDate: Audit Date
*  @return: List<BMC_Retail_Quality_Audit_Brand_Pack__c> - Returns list of brand pack items.
*/
    @AuraEnabled
    public static List<BMC_Retail_Quality_Audit_Brand_Pack__c> fetchBrandselected(Id recordId,String brandFamily,DateTime auditDate){
        try{
            if(Test.isRunningTest()&& Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            
            return [SELECT Id,BMC_Brand_Package__r.TrademarkBrandPackageLongDesc__c,BMC_Total_Number_Of_Audits__c,BMC_Brand_Package_Audit_Pack__c ,(SELECT ID,BMC_Code_Date__c from Audit_Items1__r where BMC_Code_Date__c <: auditDate limit 1) from BMC_Retail_Quality_Audit_Brand_Pack__c where BMC_Retail_Quality_Audit__c=: recordId and BMC_Brand_Package__r.TrademarkBrandFamilyNme__c=:brandFamily ORDER BY BMC_Brand_Package__r.TrademarkBrandPackageLongDesc__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Wrapper class. 
*  @name: AutoCompleteResults
*/
    public with sharing class AutoCompleteResults {
        public String name {get; set;}
        public String id {get; set;}
    }
    /**
*  @description: Returns the list of audit items for brand pack item record. 
*  @name: getpreviousAudit
*  @param: recordId:Brand Pack Item Record Id
*  @return:  List<BMC_Audit_Item__c> - Returns list audit items for brand pack item record.
*/
    @AuraEnabled
    public static  List<BMC_Audit_Item__c> getpreviousAudit(Id recordId){
        try{
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            
            List<BMC_Audit_Item__c> auditItemlst = [SELECT Id,BMC_Location__c,BMC_UOM__c from BMC_Audit_Item__c where BMC_STR_Brand_Package_Audit_Item__r.BMC_Retail_Quality_Audit__c =: recordId order by createdDate DESC LIMIT 1];
            return auditItemlst;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns the Reatil Audit Item record for Account and Distributor. 
*  @name: findRetailAudit
*  @param: accountId:Account Id,distributorId: Distributor Id, auditDate: Audit Date
*  @return:  List<BMC_Retail_Quality_Audit__c> - Returns the Retail Audit Record.
*/
    @AuraEnabled
    public static  List<BMC_Retail_Quality_Audit__c> findRetailAudit(Id accountId,Id distributorId,DateTime auditDate){
        try{
            Date myDate = date.newinstance(auditDate.year(), auditDate.month(), auditDate.day());
            List<BMC_Retail_Quality_Audit__c> retailObj = [Select Id, BMC_Outlet__c, BMC_Audit_DateTime__c , BMC_Distributor__c, Name FROM BMC_Retail_Quality_Audit__c where BMC_Outlet__c=:accountId AND BMC_Distributor__c=: distributorId AND BMC_Audit_DateTime__c  =: myDate LIMIT 1];
            return retailObj;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
        
    }
    /**
*  @description: Saves the Retail Audit Item record for Account and Distributor. 
*  @name: saveRetailAudit
*  @param: accountId:Account Id,distributorId: Distributor Id, auditDate: Audit Date
*  @return:  BMC_Retail_Quality_Audit__c - Returns the Retail Audit Record.
*/
    @AuraEnabled
    public static  BMC_Retail_Quality_Audit__c saveRetailAudit(Id accountId,Id distributorId,DateTime auditDate){
        try{            
            BMC_Retail_Quality_Audit__c retailObj= new BMC_Retail_Quality_Audit__c();
            retailObj.BMC_Audit_Date__c= date.newinstance(auditDate.year(), auditDate.month(), auditDate.day());
            retailObj.BMC_Outlet__c=accountId;
            retailObj.BMC_Distributor__c=distributorId;
            database.insert(retailObj);
            return retailObj;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Deletes the Audit Item. 
*  @name: deleteRetailAudit
*  @param: deleteAuditObj:Audit Item Record
*  @return:  void
*/
    @AuraEnabled
    public static void deleteRetailAudit(BMC_Audit_Item__c deleteAuditObj){
        try{
            database.delete(deleteAuditObj);
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Saves the Audit Item record. 
*  @name: saveAuditItem
*  @param: location:location of Audited Product,codeDate: Expiry date, maufactureDate: Manufature Date,quantity: Quantity of Audited Product,uom: unit of Measure
* 				   oor: Out of Rotation,repackValue: Repack Values,damageValue: Damage Values, brandPackId: Brand Pack Item record
*  @return: void.
*/
    @AuraEnabled
    public static void saveAuditItem(String location,DateTime codeDate,Boolean maufactureDate,String quantity , String uom,Boolean oor,String repackValue,String damageValue, Id brandPackId){
        try{
            BMC_Retail_Quality_Audit_Brand_Pack__c brandPackItem=[SELECT BMC_Brand_Package__c, BMC_Retail_Quality_Audit__r.BMC_Outlet__c,BMC_Retail_Quality_Audit__r.BMC_Distributor__c from BMC_Retail_Quality_Audit_Brand_Pack__c where Id =:brandPackId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            BMC_Audit_Item__c auditObj= new BMC_Audit_Item__c();
            auditObj.BMC_STR_Brand_Package_Audit_Item__c=brandPackId;
            auditObj.BMC_Code_Date__c=codeDate;//date.newinstance(codeDate.year(), codeDate.month(), codeDate.day());
            auditObj.BMC_Location__c=location;
            auditObj.BMC_Out_of_Rotation__c= oor;
            auditObj.BMC_UI_Quantity__c=quantity;
            auditObj.BMC_Quantity__c=Integer.valueof(quantity.trim());
            auditObj.BMC_UOM__c=uom;
            auditObj.BMC_No_Manufacture_Date__c= maufactureDate;
            auditObj.BMC_Repack__c=repackValue;
            auditObj.BMC_Damaged__c=damageValue;
            auditObj.BMC_Outlet__c=brandPackItem.BMC_Retail_Quality_Audit__r.BMC_Outlet__c;
            auditObj.BMC_Distributor__c =brandPackItem.BMC_Retail_Quality_Audit__r.BMC_Distributor__c;
            auditObj.BMC_Product__c=brandPackItem.BMC_Brand_Package__c;
            database.insert(auditObj);
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    /**
*  @description: Creates the Brand Pack Item. 
*  @name: saveRetailAudit
*  @param: recordId:Retail quality Audit record Id,brandValue: Brand Name, selectedPkgId: Product Id
*  @return:  BMC_Retail_Quality_Audit_Brand_Pack__c - Returns the Brand Pack Item Record.
*/
    @AuraEnabled
    public static BMC_Retail_Quality_Audit_Brand_Pack__c createAuditproduts(Id recordId,String brandValue,String selectedPkgId){
        try{
            
            BMC_Retail_Quality_Audit_Brand_Pack__c retailQualitybrandpack= new BMC_Retail_Quality_Audit_Brand_Pack__c();
            retailQualitybrandpack.BMC_Retail_Quality_Audit__c=recordId;
            
            if (selectedPkgId != null) {
                retailQualitybrandpack.BMC_Brand_Package__c = selectedPkgId;
                Product__c productPkg = [SELECT OnPremisePackageDesc__c, PackageDesc__c FROM Product__c WHERE Id = :selectedPkgId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
                BMC_Retail_Quality_Audit__c relatedAccount = [SELECT Id, BMC_Outlet__r.PremiseTypeNme__c  FROM BMC_Retail_Quality_Audit__c WHERE Id =:recordId LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
                if (relatedAccount.BMC_Outlet__r.PremiseTypeNme__c == Constants.OFF_PREMISE) {
                    retailQualitybrandpack.BMC_Brand_Package_Audit_Pack__c = brandValue + Constants.BLANK_WITHSPACE + productPkg.PackageDesc__c;
                }
                else {
                    retailQualitybrandpack.BMC_Brand_Package_Audit_Pack__c = brandValue + Constants.BLANK_WITHSPACE + productPkg.OnPremisePackageDesc__c;
                }                
            }           
            database.insert(retailQualitybrandpack); 
            
            BMC_Retail_Quality_Audit_Brand_Pack__c rqbObj=[SELECT ID,BMC_Brand_Package__r.ContainerTypeCd__c,BMC_Brand_Package_Audit_Pack__c,BMC_Retail_Quality_Audit__c,Name,BMC_Brand_Package__c,BMC_Brand_Package__r.BMC_Inner_Pack_UPC__c,BMC_Brand_Package__r.BMC_Primary_UPC_Container__c,BMC_Brand_Package__r.BMC_Primary_UPC_Short_Container__c, BMC_Brand_Package__r.BMC_Secondary_UPC_Retail_Unit__c,BMC_Brand_Package__r.BMC_Tertiary_UPC_Case_Unit__c from BMC_Retail_Quality_Audit_Brand_Pack__c where Id=:retailQualitybrandpack.Id limit 1];
            return rqbObj;
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns picklist values.
*  @name: getValues
*  @param: objName:Object Name,fieldName: Field Name
*  @return:  List<String> - List of picklist values.
*/
    @AuraEnabled
    public static List<String> getValues(String objName, string fieldName) {
        try{
            List <String> allOpts = new list <String>();
            sObject obj = Schema.getGlobalDescribe().get(objName).newSObject();
            Schema.sObjectType objType = obj.getSObjectType();
            Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
            map <String, Schema.SObjectField> fieldMap = objDescribe.fields.getMap();
            list <Schema.PicklistEntry> values = fieldMap.get(fieldName).getDescribe().getPickListValues();
            for (Schema.PicklistEntry a: values) {
                allOpts.add(a.getValue());
            }
            return allOpts;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns all Audit Items for Reatil Quality Audit Record.
*  @name: getallAudititems
*  @param: brandPackId:Brand Pack Item Record
*  @return: List<BMC_Audit_Item__c>- List of Audit Items.
*/
    @AuraEnabled
    public static List<BMC_Audit_Item__c> getallAudititems(Id brandPackId){
        try{
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return [SELECT Id,BMC_UI_Quantity__c,BMC_Location__c,BMC_Product__r.TrademarkBrandPackageLongDesc__c,BMC_Code_Date__c,BMC_Quantity__c,LastModifiedDate,BMC_UOM__c FROM BMC_Audit_Item__c WHERE BMC_STR_Brand_Package_Audit_Item__c =:brandPackId ORDER BY LastModifiedDate DESC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns all Audit Items which are Out of Code.
*  @name: getcodeAudititems
*  @param: brandPackId:Brand Pack Item Record, auditDate: Audit Date
*  @return: List<BMC_Audit_Item__c>- List of Audit Items.
*/
    @AuraEnabled
    public static List<BMC_Audit_Item__c> getcodeAudititems(List<BMC_Retail_Quality_Audit_Brand_Pack__c> brandpackList,DateTime auditDate){
        try{    
            Set<Id> brandPackId= new set<Id>();
            for(BMC_Retail_Quality_Audit_Brand_Pack__c retailObj:brandpackList){
                brandPackId.add(retailObj.Id);
            }
            return [SELECT Id,BMC_UI_Quantity__c,BMC_STR_Brand_Package_Audit_Item__r.BMC_Brand_Package_Audit_Pack__c,BMC_Location__c,BMC_Code_Date__c,BMC_Quantity__c,LastModifiedDate,BMC_UOM__c FROM BMC_Audit_Item__c WHERE BMC_Code_Date__c <: auditDate AND BMC_STR_Brand_Package_Audit_Item__r.Id IN : brandPackId ORDER BY LastModifiedDate DESC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns Deatils of Audit Item Record
*  @name: getAuditItem
*  @param: auditId:Audit Item Id
*  @return: BMC_Audit_Item__c- Audit Item Record.
*/
    @AuraEnabled
    public static BMC_Audit_Item__c getAuditItem(ID auditId){
        try{
            
            return [SELECT Id,BMC_STR_Brand_Package_Audit_Item__r.BMC_Brand_Package_Audit_Pack__c,BMC_STR_Brand_Package_Audit_Item__c, BMC_Code_Date__c, BMC_Location__c, BMC_Out_of_Rotation__c, BMC_Quantity__c, BMC_UOM__c, BMC_No_Manufacture_Date__c, BMC_UI_Quantity__c, BMC_Damaged__c, BMC_Outlet__c, BMC_Distributor__c, BMC_Product__c, BMC_Repack__c FROM BMC_Audit_Item__c WHERE ID =: auditId LIMIT 1];
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Update Deatils of Audit Item Record
*  @name: updateAuditrecord
*  @param: editAuditObj:Audit Item Id
*  @return: null
*/
    @AuraEnabled
    public static void updateAuditrecord(BMC_Audit_Item__c editAuditObj){
        try{
            DateTime codeDate=editAuditObj.BMC_Code_Date__c; 
            String quantity=editAuditObj.BMC_UI_Quantity__c;
            BMC_Audit_Item__c auditObj= [SELECT Id,BMC_Product__r.TrademarkBrandPackageLongDesc__c,BMC_STR_Brand_Package_Audit_Item__c, BMC_Code_Date__c, BMC_Location__c, BMC_Out_of_Rotation__c, BMC_Quantity__c, BMC_UOM__c, BMC_No_Manufacture_Date__c, BMC_UI_Quantity__c, BMC_Damaged__c, BMC_Outlet__c, BMC_Distributor__c, BMC_Product__c, BMC_Repack__c FROM BMC_Audit_Item__c WHERE ID =: editAuditObj.Id LIMIT 1];
            auditObj.BMC_Code_Date__c=editAuditObj.BMC_Code_Date__c;
            auditObj.BMC_Location__c= editAuditObj.BMC_Location__c;
            auditObj.BMC_Out_of_Rotation__c= editAuditObj.BMC_Out_of_Rotation__c;
            auditObj.BMC_UI_Quantity__c=editAuditObj.BMC_UI_Quantity__c;
            auditObj.BMC_Quantity__c=Integer.valueof(quantity.trim());
            auditObj.BMC_UOM__c=editAuditObj.BMC_UOM__c;
            auditObj.BMC_No_Manufacture_Date__c= editAuditObj.BMC_No_Manufacture_Date__c;
            auditObj.BMC_Repack__c=editAuditObj.BMC_Repack__c;
            auditObj.BMC_Damaged__c=editAuditObj.BMC_Damaged__c;
            database.update(auditObj);
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns Scanned Product Details
*  @name: searchScannedProduct
*  @param: searchKeyWord:Barcode
*  @return: Product__c: Product Details
*/
    @AuraEnabled
    public static Product__c searchScannedProduct(String searchKeyWord) {
        try{
            Product__c prodObj=[SELECT Id, Name, BMC_Primary_UPC_Short_Container__c, BMC_Secondary_UPC_Retail_Unit__c, BMC_Tertiary_UPC_Case_Unit__c, ContainerTypeCd__c, ContainerTypeNme__c, RetailBrandFlag__c, OrderableSKULifecycleStatusNme__c, TrademarkBrandLongNme__c, TrademarkBrandFamilyCd__c, BMC_Inner_Pack_UPC__c FROM Product__c where RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) AND (BMC_Inner_Pack_UPC__c=: searchKeyWord OR BMC_Primary_UPC_Container__c=: searchKeyWord OR BMC_Primary_UPC_Short_Container__c=: searchKeyWord OR BMC_Secondary_UPC_Retail_Unit__c=: searchKeyWord OR BMC_Tertiary_UPC_Case_Unit__c=: searchKeyWord)  LIMIT 1];
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return prodObj;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Returns list of On-Premise Package
*  @name: retrievePackageOffPremise
*  @param: searchKeyWord:Barcode
*  @return: List<String>: On-Premise Package details
*/
    @AuraEnabled
    public static List<String> retrievePackage(String searchKeyWord){
        try{
            Map<string, String> lstResult = new Map<string, String>();
            for(Product__c pk : [SELECT Id, OnPremisePackageDesc__c FROM Product__c WHERE TrademarkBrandLongNme__c !=: Constants.BLANK_WITHOUTSPACE AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) AND (BMC_Inner_Pack_UPC__c=: searchKeyWord OR BMC_Primary_UPC_Container__c=: searchKeyWord OR BMC_Primary_UPC_Short_Container__c=: searchKeyWord OR BMC_Secondary_UPC_Retail_Unit__c=: searchKeyWord OR BMC_Tertiary_UPC_Case_Unit__c=: searchKeyWord) ORDER BY OnPremisePackageDesc__c ASC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                AutoCompleteResults pakAge = new AutoCompleteResults();
                pakAge.name = pk.OnPremisePackageDesc__c;
                pakAge.id = pk.id;
                lstResult.put(pakAge.name, JSON.serialize(pakAge));
            }
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return lstResult.values();
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE+ e.getMessage());
        }
    }
    /**
*  @description:Returns list of Off-Premise Package
*  @name: retrievePackageOffPremise
*  @param: searchKeyWord:Barcode
*  @return: List<String>: Off-Premise Package details
*/
    @AuraEnabled
    public static List<String> retrievePackageOffPremise(String searchKeyWord){
        try{
            Map<string, String> lstResult = new Map<string, String>();
            for(Product__c pk : [SELECT Id, PackageDesc__c FROM Product__c WHERE TrademarkBrandLongNme__c !=: Constants.BLANK_WITHOUTSPACE  AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) AND (BMC_Inner_Pack_UPC__c=: searchKeyWord OR BMC_Primary_UPC_Container__c=: searchKeyWord OR BMC_Primary_UPC_Short_Container__c=: searchKeyWord OR BMC_Secondary_UPC_Retail_Unit__c=: searchKeyWord OR BMC_Tertiary_UPC_Case_Unit__c=: searchKeyWord ) ORDER BY PackageDesc__c ASC LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                AutoCompleteResults pakAge = new AutoCompleteResults();
                pakAge.name = pk.PackageDesc__c ;
                pakAge.id = pk.id;
                lstResult.put(pakAge.name, JSON.serialize(pakAge));
            }
            if(Test.isRunningTest() && Constants.coverExceptionScenario)
            {
                throw (new NullPointerException());
            }
            return lstResult.values();
        } catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }    
}