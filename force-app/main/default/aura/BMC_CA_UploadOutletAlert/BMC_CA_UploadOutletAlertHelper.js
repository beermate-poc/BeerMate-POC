({
    getAccountInfo : function(component , event) {
        try{
            if(navigator.onLine){
                component.set("v.showspinner", true);
                var actionAccount=component.get("c.getAccountDetails");
                actionAccount.setParams({recordId: component.get("v.recordId")}); 
                actionAccount.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var chainActivityobj = response.getReturnValue(); 
                        if(chainActivityobj.chainActivity.BMC_Status__c==='Pending'){
                            component.set("v.addOutlet", true);
                        }
                        else if(chainActivityobj.chainActivity.BMC_Status__c==='Final'){
                            component.set("v.finalOutlet", true);
                        }
                            else if(chainActivityobj.chainActivity.BMC_Status__c===$A.get("$Label.c.BMC_CACancelled")){
                                component.set("v.cancelOutlet", true);
                            }
                        component.set("v.showspinner", false);
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
    uploadCAOutlet : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var chainActivityName =  component.get("v.chainName");
        var url = "/apex/BMC_CA_Upload?id="+recordId+"&chainName="+chainActivityName;
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": url
        });
        urlEvent.fire();
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