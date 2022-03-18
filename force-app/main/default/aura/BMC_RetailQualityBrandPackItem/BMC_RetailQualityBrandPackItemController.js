({
    /**
   @Author Accenture
   @name openAuditbutton
   @CreateDate  11/12/2018
   @Description Function to navigate to Audit page on click of Audit Button.
  */
    openAuditbutton : function(component, event, helper) {
        var parcedValue = event.getSource().get("v.value").split(",");
        component.set("v.brandPackId",parcedValue[0]);
        component.set("v.brandPackname",parcedValue[1]);
        component.set("v.showAudit",true);
         component.set("v.fromButton",true);
    },
    /**
   @Author Accenture
   @name openAuditname
   @CreateDate  11/12/2018
   @Description Function to navigate to Audit page on click of Brand Pack Name.
  */
    openAuditname : function(component, event, helper) {
        var parcedValue =  event.target.getAttribute("data-id").split(",");
        component.set("v.brandPackId",parcedValue[0]);
        component.set("v.brandPackname",parcedValue[1]);
        component.set("v.showAudit",true);
         component.set("v.fromButton",true);
    },
    /**
   @Author Accenture
   @name openEditAudit
   @CreateDate  11/12/2018
   @Description Function to open edit audit page on click of edit button.
  */
    openEditAudit: function(component, event, helper) {
        component.set("v.showSpinner",true);
        component.set("v.editAuditId",event.getSource().get("v.value"));
        var acTion = component.get("c.getAuditItem"); 
        acTion.setParams({ 
            auditId:  component.get("v.editAuditId")                                 
        });
        acTion.setCallback(this, function (data) {
            if (data.getState() === "SUCCESS") {
                component.set("v.editAuditObj",data.getReturnValue());
                component.set("v.showSpinner",false); 
                component.set("v.showEditaudit",true);
            }
            else {
                var errorsVal = data.getError();
                if (errorsVal) {
                    this.displayToast(component,$A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                } 
            }
        });
        $A.enqueueAction(acTion);
    },
    /**
   @Author Accenture
   @name displayToast
   @CreateDate  11/12/2018
   @Description Function to display toast in mobile.
  */
    displayToast: function(component, title, message, type){
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