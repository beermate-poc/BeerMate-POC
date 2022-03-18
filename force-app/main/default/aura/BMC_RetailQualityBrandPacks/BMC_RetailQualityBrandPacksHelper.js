({
    /**
   @Author Accenture
   @name getAccountinfo
   @CreateDate  9/13/2018
   @Description Function gets the account information.
  */
    getAccountinfo : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var actionAccount=component.get("c.getRetailQualityAuditinfo");
                actionAccount.setParams({recordId: component.get("v.recordId")}); 
                actionAccount.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var accOunt = response.getReturnValue();
                        component.set("v.showSpinner", false);
                        component.set("v.rqaObj", response.getReturnValue());
                        component.set("v.auditDate", accOunt.BMC_Audit_DateTime__c);
                        if ((accOunt.BMC_Outlet__r.RecordType.Name === $A.get("$Label.c.BMC_GSOffPremise")) || (accOunt.BMC_Outlet__r.RecordType.Name ==  $A.get("$Label.c.BMC_Chain_Off_Premise"))) {
                            component.set("v.isOffPrem", true);
                        } else {
                            component.set("v.isOffPrem", false);                            
                        }
                    } else if (response.getState() === "ERROR") {
                        this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
                    }
                });
                $A.enqueueAction(actionAccount);            
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    /**
   @Author Accenture
   @name initialzeBrdfam
   @CreateDate  9/13/2018
   @Description Function retrieves the related Brand Family.
  */
    initialzeBrdfam : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var acctionBrandfamily=component.get("c.retrieveBrandFamily");
                acctionBrandfamily.setParams({recordId: component.get("v.recordId")});   
                acctionBrandfamily.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        if (response.getReturnValue().length > 0) {
                            var results = response.getReturnValue().map(function(property) {
                                return JSON.parse(property);
                            });
                            component.set('v.brandFamilies', results);
                            component.set("v.selectedBrandfamily", component.find("brandFamily").get("v.value"));
                            // component.set("v.showSpinner", false);
                        }
                    } else if (response.getState() === "ERROR") {
                        this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                    }
                });
                $A.enqueueAction(acctionBrandfamily);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    /**
   @Author Accenture
   @name intialloadBrdpk
   @CreateDate  9/13/2018
   @Description Function fetches related the brand packs.
  */
    intialloadBrdpk: function(component, event, helper) {
        try{
            if(navigator.onLine){
                var acctionBrandpacks=component.get("c.fetchBrandpacks");
                acctionBrandpacks.setParams({recordId: component.get("v.recordId"), auditDate:component.get("v.auditDate")});        
                acctionBrandpacks.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        if (response.getReturnValue().length > 0) {
                            component.set("v.brandpackList", response.getReturnValue());
                        }
                        component.set("v.showSpinner", false);
                    } else if (response.getState() === "ERROR") {
                        component.set("v.showSpinner", false);
                        this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                    }
                });
                $A.enqueueAction(acctionBrandpacks);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    /**
   @Author Accenture
   @name initialBrdslctd
   @CreateDate  9/13/2018
   @Description Function gets the details of the selected brand.
  */
    initialBrdslctd: function(component, event, helper) {
        try{
            if(navigator.onLine){
                var acctionBrandpacks=component.get("c.fetchBrandselected");
                acctionBrandpacks.setParams({recordId: component.get("v.recordId"), brandFamily: component.get("v.selectedBrandfamily"),auditDate:component.get("v.auditDate")});        
                acctionBrandpacks.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        if (response.getReturnValue().length > 0) {
                            component.set("v.brandpackList", response.getReturnValue());
                        }
                        component.set("v.showSpinner", false);
                    } else if (response.getState() === "ERROR") {
                        component.set("v.showSpinner", false);
                    }
                });
                $A.enqueueAction(acctionBrandpacks);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
        
    },
    /**
   @Author Accenture
   @name shwcodeAuditItm
   @CreateDate  9/13/2018
   @Description Function fetches the list of related audit Items.
  */
    shwcodeAuditItm: function(component, event, helper) {
        try{
            if(navigator.onLine){
                var acctionBrandpacks=component.get("c.getcodeAudititems");
                acctionBrandpacks.setParams({brandpackList: component.get("v.brandpackList"), auditDate:component.get("v.auditDate")});        
                acctionBrandpacks.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        component.set("v.auditItemList", response.getReturnValue());
                    } else if (response.getState() === "ERROR") {
                    }
                });
                $A.enqueueAction(acctionBrandpacks);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
        
    },
    /**
   @Author Accenture
   @name getPackage
   @CreateDate  9/13/2018
   @Description Function retrieves the package of the brand scanned.
  */
    getPackage: function(component, event, helper) {
        try{
            if(navigator.onLine){
                if (component.get('v.isOffPrem')) {
                    var acTion = component.get("c.retrievePackageOffPremise");
                }
                else{
                    var acTion = component.get("c.retrievePackage");
                }
                acTion.setParams({
                    searchKeyWord: component.get("v.searchKeyWord")
                });
                acTion.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        if (response.getReturnValue().length > 0) {
                            var results = response.getReturnValue().map(function(property) {
                                return JSON.parse(property);
                            });
                            component.set('v.isDisablePkg', false);
                            component.set('v.packages', results);
                            if(response.getReturnValue().length === 1){
                                component.set('v.selectedPkgId', results[0].id); 
                            }                           
                            
                        } else {
                            component.set('v.isDisablePkg', true);
                            component.set('v.packages', []);
                        }
                    } else if (response.getState() === "ERROR") {
                        helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
                    }
                });
                $A.enqueueAction(acTion);            
            } else {
                helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
        
    },
    /**
   @Author Accenture
   @name displayToast
   @CreateDate  9/13/2018
   @Description Function to display toast messages on Desktop.
  */
    displayToast: function (title, message, type, duration) {
        try{
            var toAst = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toAst) {
                // fire the toast event in Salesforce1
                var toAstParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toAst.setParams(toAstParams);
                toAst.fire();
            } else {
                // otherwise throw an alert
                alert(title + ': ' + message);
            }
        } catch(e){
			component.set("v.showErrorToast", false);      
        }
    },
    /**
   @Author Accenture
   @name createRqaprdt
   @CreateDate  9/13/2018
   @Description Function to create new retail quality brand pack item.
  */
    createRqaprdt: function(component, event, helper) {
        try{
            if(navigator.onLine){  
                var saveAuditrecord=true;
                if(component.get("v.createPack") === true){
                     component.set("v.fromButton",false);
                    if($A.util.isEmpty(component.get("v.scannedBrand")) || $A.util.isEmpty(component.find("selectOptions").get('v.value'))){
                        this.displayToastMob (component, $A.get("$Label.c.Error"),'Please select Brand and Package', 'slds-theme_error'); 
                        component.set("v.showSpinner", false);
                        saveAuditrecord=false;
                    }
                }
                else if(component.get("v.addpackage") === true){
                    component.set("v.fromButton",true);
                    if($A.util.isEmpty(component.find("brandSearch").get("v.searchValue")) || $A.util.isEmpty(component.find("brandSearch").find("selectOptions").get('v.value'))){
                        this.displayToastMob (component,$A.get("$Label.c.Error"),'Please select Brand and Package', 'slds-theme_error'); 
                        component.set("v.showSpinner",false);
                        saveAuditrecord=false;
                    }
                }
                if(saveAuditrecord ===  true){
                    helper.savebrandRec(component, event, helper);
                }         
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    /**
   @Author Accenture
   @name savebrandRec
   @CreateDate  9/13/2018
   @Description Function to create new retail quality brand pack item.
  */
    savebrandRec: function(component, event, helper) {
        try{
            if(navigator.onLine){
               
                var acctionauditProducts=component.get("c.createAuditproduts");
                if(component.get("v.createPack") === true){                        
                    acctionauditProducts.setParams({recordId: component.get("v.recordId"), brandValue:component.get("v.scannedBrand"),selectedPkgId:component.find("selectOptions").get('v.value')});        
                }
                if(component.get("v.addpackage") === true){
                    acctionauditProducts.setParams({recordId: component.get("v.recordId"), 
                                                    brandValue:component.find("brandSearch").get("v.searchValue"),
                                                    selectedPkgId:component.find("brandSearch").find("selectOptions").get('v.value')});        
                }
                acctionauditProducts.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") { 
                         var brandPack=response.getReturnValue();
                       var getInputkeyWord= component.get("v.searchKeyWord");
                        if(component.get("v.isOffPrem") === true)
                        {
                            if(brandPack.BMC_Brand_Package__r.BMC_Tertiary_UPC_Case_Unit__c ===  getInputkeyWord  )
                                component.set("v.initUom","Case (Outer Pack)");
                            else if(brandPack.BMC_Brand_Package__r.BMC_Secondary_UPC_Retail_Unit__c  ===  getInputkeyWord  )
                                component.set("v.initUom","Retail Unit (Inner Pack)");
                                else if(brandPack.BMC_Brand_Package__r.BMC_Primary_UPC_Short_Container__c ===  getInputkeyWord || brandPack.BMC_Brand_Package__r.BMC_Primary_UPC_Container__c ===  getInputkeyWord )
                                    component.set("v.initUom","Single");
                                    else
                                        component.set("v.initUom","Keg");
                        }
                        else
                        {
                            if(brandPack.BMC_Brand_Package__r.ContainerTypeCd__c === "KEG")
                            {
                                component.set("v.initUom","Keg");
                            }
                            else
                            {
                                component.set("v.initUom","Single");
                            }
                        }                        
                        component.set("v.createPack", false);
                        component.set("v.addpackage", false);
                        component.set("v.showSpinner", false);
                        component.set("v.brandPackId", brandPack.Id);
                        component.set("v.brandPackname", brandPack.BMC_Brand_Package_Audit_Pack__c);
                        component.set("v.showAudit", true);
                        component.set("v.showAuditscreen", true);
                        component.set("v.searchKeyWord", '');
                        component.set("v.scannedBrand",'');
                        component.set("v.packages",'');
                    } else if (response.getState() === "ERROR") {
                        this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                    }
                });
                $A.enqueueAction(acctionauditProducts);
                
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    /**
   @Author Accenture
   @name getloclstValues
   @CreateDate  9/13/2018
   @Description Function retrives the location values.
  */
    getloclstValues : function(component, event, helper, obj, fldName) {
        try{
            if(navigator.onLine){
                var acTion = component.get("c.getValues");
                acTion.setParams({
                    objName : obj,
                    fieldName : fldName
                });
                acTion.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var allValues = response.getReturnValue();
                        component.set("v.location", response.getReturnValue());
                    }
                });
                $A.enqueueAction(acTion);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    /**
   @Author Accenture
   @name getuomlstValues
   @CreateDate  9/13/2018
   @Description Function gets the UOM list values.
  */
    getuomlstValues : function(component, event, helper, obj, fldName) {
        try{
            if(navigator.onLine){
                var acTion = component.get("c.getValues");
                acTion.setParams({
                    objName : obj,
                    fieldName : fldName
                });
                acTion.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var allValues = response.getReturnValue();   
                        if(component.get("v.isOffPrem")===false){
                            var onpremValues=["Single", "Keg"];                           
                            component.set("v.uomlst", onpremValues); 
                        }
                        else
                            component.set("v.uomlst", allValues);                        
                    }
                });
                $A.enqueueAction(acTion);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    /**
   @Author Accenture
   @name gtdamgelstValue
   @CreateDate  9/13/2018
   @Description Function gets the damage list values.
  */
    gtdamgelstValue : function(component, event, helper, obj, fldName) {
        try{
            if(navigator.onLine){
                var acTion = component.get("c.getValues");
                acTion.setParams({
                    objName : obj,
                    fieldName : fldName
                });
                acTion.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var allValues = response.getReturnValue();
                        component.set("v.damagelst", response.getReturnValue());
                    }
                });
                $A.enqueueAction(acTion);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    /**
   @Author Accenture
   @name getrepackValues
   @CreateDate  9/13/2018
   @Description Function gets the repack list values.
  */
    getrepackValues : function(component, event, helper, obj, fldName) {
        try{
            if(navigator.onLine){
                var acTion = component.get("c.getValues");
                acTion.setParams({
                    objName : obj,
                    fieldName : fldName
                });
                acTion.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var allValues = response.getReturnValue();
                        component.set("v.repackList", response.getReturnValue());  
                        component.set("v.showSpinner", false);
                    }
                });
                $A.enqueueAction(acTion);
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
        }
    },
    /**
   @Author Accenture
   @name displayToastMob
   @CreateDate  9/13/2018
   @Description Function displays toast message for mobile.
  */
    displayToastMob: function(component, title, message, type){
        try{
            component.set("v.showErrorToast", true);
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showErrorToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
             component.set("v.showErrorToast", false);
        }
    }
})