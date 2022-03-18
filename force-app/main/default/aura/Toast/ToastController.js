({
	/*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   closes toast message for mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/12/17    Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
	closeToast : function(component, event, helper) {
		var toast = component.find("toast");
		$A.util.addClass(toast, 'slds-hide');
	}
})