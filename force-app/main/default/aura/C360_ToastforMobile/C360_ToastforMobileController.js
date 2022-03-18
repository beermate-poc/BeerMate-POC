({
	/*------------------------------------------------------------
    Author:        Accenture IDC
    Description:   closes toast message for mobile
    History
   <Date(DMY)> <Authors Name>   <Brief Description of Change>
   12/6/2018    Madhavi         Initial Creation
    ------------------------------------------------------------*/
	closeToast : function(component, event, helper) {
		var toast = component.find("toast");
		$A.util.addClass(toast, 'slds-hide');
        helper.navigatetoURL(component,event);
	}
    
   
})