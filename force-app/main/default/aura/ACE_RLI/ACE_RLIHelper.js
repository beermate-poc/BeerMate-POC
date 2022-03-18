({
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Fetches and returns line items, header attributes, 
       					reason code picklist values, and spend type picklist values. 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    getReimbursementLineItems : function(component, event, helper) {
        var action = component.get("c.getReimbursementLineItems");
        action.setParams({PartnerFundClaimId : component.get("v.recordId")});
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.reimbursementLines", response.getReturnValue().lines);
                component.set("v.spendTypeOptions", response.getReturnValue().spendTypePicklistValues);
                component.set("v.reasonCodeOptions", response.getReturnValue().reasonCodePicklistValues);
            } else {
                helper.showToast({
                    "title": "Error",
                    "message": response.getError()[0].message,
                    "type" : "error"
                });

            }
        });
        $A.enqueueAction(action);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Sends updated line item records to Apex method to be updated on server.  		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    sendRecordsToServer : function(component, event, helper){
        var action=component.get("c.updateLineItems");
        action.setParams({
            wrapperString : JSON.stringify(component.get("v.reimbursementLines"))
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if( state == "SUCCESS"){
                if(response.getReturnValue().length === 0){
                    helper.showToast({
                        "title": "Success!",
                        "type": "success",
                        "message": "Line items were saved."
                    });
                } else {
                    component.set("v.errorMessages", response.getReturnValue());
                    component.find("errorMessages").set("v.showModal", true);
                }
            } else {
                helper.showToast({
                    "title": "Error",
                    "message": response.getError()[0].message,
                    "type" : "error"
                });
                
            }
        });
        $A.enqueueAction(action);
    },
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Shows toast based on object params. 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    showToast : function(params){
        var toastEvent = $A.get("e.force:showToast");
        if(toastEvent){
            toastEvent.setParams(params);
            toastEvent.fire();
        } else{
            alert(params.message);
        }
    },


})