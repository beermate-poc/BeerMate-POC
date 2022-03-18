/*------------------------------------------------------------
Author:        Gopal
Company:       Accenture
Description:   deleteRec helper method to delete record from lightnig flow 
History
<Date>      <Authors Name>     <Brief Description of Change>
06/14/2018    Gopal                                         Initial Creation
------------------------------------------------------------*/
({
    deleteRec : function(component, event, helper,recId){
        var flowVal = component.find("flowData");
        var inputVariables = [
            {
                name : $A.get("$Label.c.BMC_GSContactID"),
                type : $A.get("$Label.c.BMC_GSString"),
                value : recId
            }
        ];
        flowVal.startFlow("BMC_GSDeleteContact", inputVariables);
    },
    
     /*------------------------------------------------------------
              Author:        Bryant Daniels
              Company:       Slalom, LLC
              Description:   displays toast for dekstop
              <Date>      <Authors Name>     <Brief Description of Change>
              5/07/2017    Bryant Daniels     Initial Creation
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
    getEditContact : function(component, event, helper,recId){
        try{
            if(navigator.onLine){
                var actionEdit = component.get("c.editableContact");
                actionEdit.setParams({contactId : recId});
                actionEdit.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                       component.set("v.showCreateContact",true);
                       component.set("v.contactToEdit",response.getReturnValue()); 
                    }
                    else if (response.getState() === "ERROR") {
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                            }
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                  
                        }
                    }
                });
                $A.enqueueAction(actionEdit);
            }
            else {
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        }
        catch(e){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
        }
    }
})