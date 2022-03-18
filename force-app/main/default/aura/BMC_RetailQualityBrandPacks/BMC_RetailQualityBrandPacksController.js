({
    /**
   @Author Accenture
   @name doInit
   @CreateDate  9/13/2018
   @Description Function calls the helper to get Account information.
  */
    doInit : function(component, event, helper) {
        component.set("v.showSpinner", true);
        if($A.get("$Browser.formFactor") !== 'DESKTOP'){
            helper.getAccountinfo(component, event, helper);
        }
    },
    /**
   @Author Accenture
   @name onsetAuditDate
   @CreateDate  9/13/2018
   @Description Function calls helper when the Audit date in changed.
  */
    onsetAuditDate : function(component, event, helper) {
        if($A.get("$Browser.formFactor") !== 'DESKTOP'){
            component.set("v.showSpinner", true);
            helper.initialzeBrdfam(component, event, helper);
            helper.intialloadBrdpk(component, event, helper);            
            helper.getloclstValues(component, event, helper, 'BMC_Audit_Item__c','BMC_Location__c');
            helper.getuomlstValues(component, event, helper, 'BMC_Audit_Item__c','BMC_UOM__c');
            helper.gtdamgelstValue(component, event, helper, 'BMC_Audit_Item__c','BMC_Damaged__c');
            helper.getrepackValues(component, event, helper, 'BMC_Audit_Item__c','BMC_Repack__c');             
        }
    },
    /**
   @Author Accenture
   @name showAuditpage
   @CreateDate  9/13/2018
   @Description Function closes the Audit Screen.
  */ 
    showAuditpage:function(component, event, helper) {
        if(component.get("v.showAudit")===true)
            component.set("v.showAuditscreen", true);
        else
            component.set("v.showAuditscreen", false)        
            },
    /**
   @Author Accenture
   @name initializeBrand
   @CreateDate  9/13/2018
   @Description Function gets the Brand family once user chooses it.
  */
    initializeBrand : function(component, event, helper) {
        var brandFamily =component.find("brandFamily").get("v.value");
        component.set("v.selectedBrandfamily", brandFamily);        
        if(brandFamily!==$A.get("$Label.c.BMC_BrandFamilyFilter") || !$A.util.isEmpty(component.find("brandFamily").get("v.value"))) 
            helper.initialBrdslctd(component, event, helper);
        if(brandFamily === $A.get("$Label.c.BMC_BrandFamilyFilter")) 
            helper.intialloadBrdpk(component, event, helper);
    },
    /**
   @Author Accenture
   @name gobcktoRcrdpage
   @CreateDate  9/13/2018
   @Description Function navigates back to the record page.
  */
    gobcktoRcrdpage: function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire() ;
    },
    /**
   @Author Accenture
   @name addPackage
   @CreateDate  9/13/2018
   @Description Function creates new package from Add Package Button.
  */
    addPackage: function(component, event, helper) {
        component.set("v.addpackage",true);
    },
    /**
   @Author Accenture
   @name createPackage
   @CreateDate  9/13/2018
   @Description Function creates new package.
  */
    createPackage: function(component, event, helper) {
        if (component.get('v.openAddPackage')) {
            component.set("v.openAddPackage", false);
            component.set("v.createPack", true);
            try{
                    if(navigator.onLine){
                        var acTion=component.get("c.searchScannedProduct");
                        acTion.setParams({
                            searchKeyWord: component.get("v.searchKeyWord")
                        }); 
                        acTion.setCallback(this, function(response) {
                            if (response.getState() === "SUCCESS") {
                                var prodObj=response.getReturnValue();
                                component.set("v.scannedBrand", prodObj.TrademarkBrandLongNme__c);
                                helper.getPackage(component, event, helper);
                                
                            } else if (response.getState() === "ERROR") {
                                helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_Product_Not_Found"), 'slds-theme_error');           
                                component.set("v.createPack", false);
                                component.set("v.searchKeyWord",'');
                            }
                        });
                        $A.enqueueAction(acTion);            
                    } else {
                        helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
                    }
            } catch(e){
                helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
            }
        }
    },
    /**
   @Author Accenture
   @name refreshBrndpck
   @CreateDate  9/13/2018
   @Description Function fetches the related brand packages.
  */
    refreshBrndpck:function(component, event, helper) {
        component.set("v.fromRetail", true);
        if(component.get("v.refreshBrandPack")===true){
            component.set("v.showSpinner", true);
            helper.initialzeBrdfam(component, event, helper);
            if(component.get("v.selectedBrandfamily") === $A.get("$Label.c.BMC_BrandFamilyFilter") || $A.util.isEmpty(component.get("v.selectedBrandfamily"))) {
                helper.intialloadBrdpk(component, event, helper);
                component.set("v.refreshBrandPack", false);
            }
            else{
                helper.initialBrdslctd(component, event, helper);
                component.set("v.refreshBrandPack", false)
            }
        }
    },
    /**
   @Author Accenture
   @name goBacktolist
   @CreateDate  9/13/2018
   @Description Function navigates back when cancel button is clicked.
  */
    goBacktolist:function(component, event, helper) {
        component.set("v.createPack", false);
        component.set("v.addpackage", false);
        component.set("v.searchKeyWord", '');
        component.set("v.scannedBrand",'');
        component.set("v.packages",'');
        component.set("v.selectedPkgId",'');
        component.set("v.refreshBrandPack", true);
    },
    /**
   @Author Accenture
   @name saveBrand
   @CreateDate  9/13/2018
   @Description Function creates new brand pack item when save button is clicked.
  */
    saveBrand:function(component, event, helper) {
        component.set("v.showSpinner", true);
         component.set("v.fromRetail", false);
        helper.createRqaprdt(component, event, helper);
    },
    /**
   @Author Accenture
   @name gotoReviewpage
   @CreateDate  9/13/2018
   @Description Function navigates to the review page when review button is clicked.
  */
    gotoReviewpage:function(component, event, helper) {
        component.set("v.showSpinner", true);
        component.set("v.reviewScreen", true);
        helper.shwcodeAuditItm(component, event, helper);
        helper.getAccountinfo(component, event, helper);
    },
    /**
   @Author Accenture
   @name gotoBrandList
   @CreateDate  9/13/2018
   @Description Function navigates to audit page when continue is clicked.
  */
    gotoBrandList:function(component, event, helper) {
        component.set("v.reviewScreen", false);
        component.set("v.refreshBrandPack", true);
    },
    /**
   @Author Accenture
   @name refrshcodeBrdpk
   @CreateDate  9/13/2018
   @Description Function refreshes the audit items after editing is done.
  */
    refrshcodeBrdpk:function(component, event, helper) {
        if(component.get("v.showEditaudit")===false){
            component.set("v.showSpinner", true);
            helper.shwcodeAuditItm(component, event, helper);
            helper.getAccountinfo(component,event, helper);        }
    }
})