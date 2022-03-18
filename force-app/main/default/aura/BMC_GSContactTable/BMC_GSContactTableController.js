({
	handleSelect : function(component, event, helper) {
		try{
            if(navigator.onLine){
                var parcedValue = event.getParam("value").split(',');
                var rowId = parcedValue[0];
                var actionVal = parcedValue[1];
                switch (actionVal) {
                    case $A.get("$Label.c.BMC_GSEdit"):
                        helper.getEditContact(component, event, helper,rowId);
                        break;
                    case $A.get("$Label.c.BMC_GSDelete"):
                        var flowCmp = component.find("flowData");
                        $A.util.addClass(flowCmp, 'slds-hide');
                        helper.deleteRec(component,event,helper,rowId);
                        break;
                }
            } else {
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');      
            }
        } catch(e){
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }	
	},
    /*------------------------------------------------------------
Author:        Gopal
Company:       Accenture
Description:   refresh datatable when user perform edit and Delete action on contact record
History
<Date>      <Authors Name>     <Brief Description of Change>
06/14/2018    Gopal                                         Initial Creation
------------------------------------------------------------*/
    refresh: function(component, event, helper){
        try{
            if(navigator.onLine){
                if(event.getParam($A.get("$Label.c.BMC_GSStatus")) === $A.get("$Label.c.BMC_GSFINISHED_SCREEN")){
                    helper.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.BMC_GSContactDeletionSuccess"), 'success', '5000');
                }else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.BMC_GSContactDeletionFailed"), 'error','5000');
                }
                component.set("v.refershContacts",true);
            } else {
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    }
})