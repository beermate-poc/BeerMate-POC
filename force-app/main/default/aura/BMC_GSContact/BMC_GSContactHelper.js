({
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method to close the Model
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    cancelModal : function(component,event,helper) {
        if($A.get("$Browser.formFactor") == "DESKTOP"){
            component.set("v.showCreateContact ", false);
        } else {
            component.set("v.showCreateContact ", false);
        }
    },
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method to validate the fields
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    validateNames:function(component,event,helper) {
        try{
            var firstName = component.find("firstName").get("v.value");
            var lastName = component.find("lastName").get("v.value");
            var roleVal = component.find("role").get("v.value");
            if((firstName != null && firstName != '')  && (lastName == '' || lastName == null)){
                var lastNameInput = component.find("lastName");
                lastNameInput.set("v.value", 'N/A');
                lastName = component.find("lastName").get("v.value");
            }
            if(firstName == null || lastName == null || firstName == '' || lastName == ''){
				if($A.get("$Browser.formFactor") == "DESKTOP"){
					this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Contact_Required_Fields_Error"), 'warning');
				}
				else{
                this.displayToastMobile(component,$A.get("$Label.c.Warning"),$A.get("$Label.c.Contact_Required_Fields_Error"), 'slds-theme_warning');
				}
                    
            } else { 
                this.createNewContact(component,event,helper);
            }
        } catch(e){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:  Method to Create New Contact
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    createNewContact:function(component,event,helper) {
        try{
            if(navigator.onLine){
                component.set("v.newContact.Active__c",component.get("v.activeContact"));
                var createContactCall = component.get("c.createContact");
                var accountId = component.get("v.accountId");
                var contactVal = component.get("v.newContact");
                createContactCall.setParams({'contact' : contactVal ,'accountId' : accountId});
                createContactCall.setCallback(this, function(a) {
                    var stateVal = a.getState();
                    if (stateVal === "SUCCESS") {
                            this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Contact_Created"), 'success');
                        component.set("v.refershContacts",true);
                        this.cancelModal(component,event,helper);
                    } else {
                        var errorsVal = a.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
                            }
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            
                        }
                    }
                    var spinner = component.find("spinner");
                    $A.util.addClass(spinner, "slds-hide");
                });
                $A.enqueueAction(createContactCall);
            } else {
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                
            }
        } catch(e){
            
                this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error'); 
            
        }
    },
    /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method for Display Toast on Desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toastMsg) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
        } catch(e){
            
        }
    },
      /*------------------------------------------------------------
    Author:        Gopal Neeluru
    Company:       Accenture
    Description:   display toast on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopal Neeluru     Initial Creation
    ------------------------------------------------------------*/
    displayToastMobile: function(component, title, message, type){
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
            console.error(e);
        }
    }
})