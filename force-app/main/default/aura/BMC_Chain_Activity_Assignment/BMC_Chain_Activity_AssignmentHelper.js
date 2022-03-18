({
    
    getAccountInfo : function(component , event, helper) {
        try{
            if(navigator.onLine){                
                var actionAccount=component.get("c.getAccountDetails");
                actionAccount.setParams({recordId: component.get("v.recordId")}); 
                actionAccount.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var chainActivityobj = response.getReturnValue(); 
                        component.set("v.chainName",chainActivityobj.chainActivity.Name);
                        // component.set("v.seasonalBrand",chainActivityobj.chainActivity.BMC_Seasonal_Brand_Group__c);
                       // component.set("v.chainStatus",chainActivityobj.chainActivity.BMC_Status__c);
                        if(chainActivityobj.chainActivity.BMC_Status__c===$A.get("$Label.c.BMC_CACancelled")){
                            component.set("v.chainStatus", true); 
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
    
    openOutletSelection : function(component, event, helper){
        var pageReference = {
            type: 'standard__component',
            attributes: {
                componentName: 'c__BMC_CA_Outlet_Selection_Table'
            },
            state: {
                "c__recordId": component.get("v.recordId")
            }
        }
        component.set("v.pageReference", pageReference);
        
        var navService = component.find("navService");
        var pageReference = component.get("v.pageReference");
        event.preventDefault();
        navService.navigate(pageReference);
    },
    openProdSelection : function(component, event, helper){
        $A.createComponent("c:BMC_CA_ProductSelection", {
            "recordId":component.get("v.recordId")
        },
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   component.find('overlayLib').showCustomModal({
                                       body: content
                                   }) 
                               }
                           }); 
    },
    uploadCAOutlet: function(component, event, helper){
        $A.createComponent("c:BMC_CA_UploadOutletAlert", {
            "recordId":component.get("v.recordId"),
            "chainName":component.get("v.chainName")            
        },
                           function(content, status) {
                               if (status === "SUCCESS") {
                                   component.find('overlayLib').showCustomModal({
                                       body: content
                                   }) 
                               }
                           });
    },
    displayToastMob: function(component, title, message, type){
        try{
            component.set("v.showerrortoast", true);
            component.set("v.toasttype", type);
            component.set("v.toasttitle", title);
            component.set("v.toastmsg", message);
            setTimeout(function(){
                component.set("v.showerrortoast", false);
                component.set("v.toasttitle", "");
                component.set("v.toasttype", "");
                component.set("v.toastmsg", "");
            }, 3000);
        } catch(e){
            system.debug(e);
        }
    }
})