({
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   returns list of contacts based on the passed in accountId
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	getContacts : function(component,event,helper) {
		try{
			if(navigator.onLine){
				var contacts= component.get("c.getContacts");
				var recordId = component.get('v.recordId');
				contacts.setParams({accountId : recordId});
				var contact = component.get('v.selectedContact');
				var index = 0 ;
				var foundDuplicate = false;
				contacts.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						var contactsArray = a.getReturnValue();
						var newArray = [];
						for (var i of contactsArray) {
							if(contact == i.Name){
								newArray =contactsArray.splice( index, 1 );
								component.set("v.contacts", contactsArray);
								foundDuplicate= true;
							}
							index++;
						}
						if(foundDuplicate == false){
							component.set('v.contacts',a.getReturnValue());
						}
					} else {
						var errors = a.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.error("Error message: " + 
										errors[0].message);
							}
							if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
								this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
							} else {
								this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
							}
						} else {
							console.error("Unknown error");
						}
					}
				});
				$A.enqueueAction(contacts);
			} else {
				if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
					this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
				} else {
					this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
				}
			}
		} catch(e){
			console.error(e);
			if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
			} else {
				this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
			}
		}
	},
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   closes the contact modal
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	cancelModal : function(component,event,helper) {
		if($A.get("$Browser.formFactor") == "DESKTOP"){
			component.set("v.showContact", false);
		} else {
			component.set("v.showContact", false);
			component.set("v.showObjView", true);
		}
	},
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   validates the contact modal input fields
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	validateNames:function(component,event,helper) {
		try{
			var toastEvent = $A.get("e.force:showToast");
			var firstName = component.find('firstName').get('v.value');
			var lastName = component.find('lastName').get('v.value');
			if((firstName != null && firstName != '')  && (lastName == '' || lastName == null)){
				var lastNameInput = component.find('lastName');
				lastNameInput.set('v.value', 'N/A');
				lastName = component.find('lastName').get('v.value');
			}
			if(firstName == null || lastName == null || firstName == '' || lastName == ''){
				var spinner = component.find("spinner");
				$A.util.addClass(spinner, "slds-hide");
				if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
					this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Contact_Required_Fields_Error"), 'warning');
				} else {
					this.displayToastMobile(component, $A.get("$Label.c.Warning"), $A.get("$Label.c.Contact_Required_Fields_Error"), 'slds-theme_warning');
				}
			} else { 
				var createContact = component.get('v.createContact');
				if(createContact == 'true' ){
					this.createNewContact(component,event,helper,firstName,lastName);
				}
			}
		} catch(e){
			console.error(e);
			if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
			} else {
				this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
			}
		}
	},
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   creates new contact for the account
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	createNewContact:function(component,event,helper,firstName,lastName) {
		try{
			if(navigator.onLine){
				var createContactCall = component.get('c.createContact');
				var recordId = component.get('v.recordId');
				var contact = component.get('v.newContact');
				createContactCall.setParams({'contact' : contact ,'accountId' : recordId});
				createContactCall.setCallback(this, function(a) {
					var state = a.getState();
					if (state === "SUCCESS") {
						if(firstName != '' && lastName != ''){
							component.set('v.selectedContact',firstName + ' ' + lastName);
						}
						if(a.getReturnValue() != null){
							component.set('v.nextMeetingContactId',a.getReturnValue().Id);
						}
						if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
							this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Contact_Created"), 'success');
						} else {
							this.displayToastMobile(component, $A.get("$Label.c.Success"), $A.get("$Label.c.Contact_Created"), 'slds-theme_sucess');
						}
						this.cancelModal(component,event,helper);
					} else {
						var errors = a.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.error("Error message: " + 
										errors[0].message);
							}
							if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
								this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
							} else {
								this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
							}
						} else {
							console.error("Unknown error");
						}
					}
					var spinner = component.find("spinner");
					$A.util.addClass(spinner, "slds-hide");
				});
				$A.enqueueAction(createContactCall);
			} else {
				if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
					this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
				} else {
					this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
				}
			}
		} catch(e){
			console.error(e);
			if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
				this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
			} else {
				this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
			}
		}
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   displays toast on mobile
    <Date>      <Authors Name>     <Brief Description of Change>
    9/07/2017     Nick Serafin     Initial Creation
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
	},
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   displays toast on desktop
    <Date>      <Authors Name>     <Brief Description of Change>
    9/07/2017     Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	displayToast: function (title, message, type, duration) {
		try{
			var toast = $A.get("e.force:showToast");
			// For lightning1 show the toast
			if (toast) {
				//fire the toast event in Salesforce1
				var toastParams = {
					"title": title,
					"message": message,
					"type": type
				}
				toast.setParams(toastParams);
				toast.fire();
			} else {
				// otherwise throw an alert
				alert(title + ': ' + message);
			}
		} catch(e){
			console.error(e);
		}
	}
})