({
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   calls the helper to return the contacts for the account and gets the contact roles to populate a picklist
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	doInit : function(component, event, helper) {
		try{
			var contact = component.get('v.selectedContact');
			component.set('v.contactOption',contact);
			component.set('v.headerLabel',$A.get("$Label.c.Select_Contact"));
			helper.getContacts(component,event,helper);	
			var contactRoles= component.get("c.getContactRoleOptions");
			contactRoles.setCallback(this, function(a) {
				if(a.getState() === "SUCCESS"){
					var roles = a.getReturnValue();
					//'Distributor Sales Rep' should not be shown to users in the Call Log
					var index = roles.indexOf('Distributor Sales Rep');
					if (index > -1) {
						roles.splice(index, 1);
					}
					component.set("v.roles", roles);
				} else {
					$A.log("Errors", a.getError());
				}
			});
	  		$A.enqueueAction(contactRoles);
	  	} catch(e){
	  		console.error(e);
	  		if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
	  	}
	},
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   closes contact modal
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	 cancelModal:function(component,event,helper){
    	helper.cancelModal(component,event,helper);
    },
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   saves created contact
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	saveContact:function(component,event,helper){
		try{
			component.set('v.newContact.role__c',component.find("role").get("v.value"));
			var contacts = component.get('v.contacts');
			var pickContact=component.get('v.pickContact');
			if(pickContact == true){
				if(component.get('v.changedContact') == true){
					var contact = contacts[component.find('pickedContact').get('v.value')];
					component.set('v.contact',contact);
					component.set('v.selectedContact',contact.Name);
					component.set('v.nextMeetingContactId',contact.Id);
				}
				if($A.get("$Browser.formFactor") == "DESKTOP"){
				    component.set("v.showContact", false);
		        } else {
		            component.set("v.showContact", false);
		            component.set("v.showObjView", true);
		        }
			} else {
				var spinner = component.find("spinner");
	        	$A.util.removeClass(spinner, "slds-hide");
				helper.validateNames(component,event,helper);
			}
		} catch(e){
			console.error(e);
			if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
		}
    },
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:  sets attributes when a new contact is selected
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	createNewContact:function(component,event,helper){
		try{
			var createNewButton = component.find('createNewButton');
			$A.util.addClass(createNewButton, 'slds-hide');
			component.set('v.headerLabel',$A.get("$Label.c.Create_New_Contact"));
			component.set('v.createContact','true');
			component.set('v.pickContact','false');
		} catch(e){
			console.error(e);
			if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
		}
	},
	/*------------------------------------------------------------
    Author:        Al-Que Quiachon
    Company:       Slalom, LLC
    Description:   existing contact record is selected
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2017     Al-Que Quiachon     Initial Creation
    ------------------------------------------------------------*/
	selectedContact:function (component,event,helper) {
		component.set('v.changedContact',true);
	}
})