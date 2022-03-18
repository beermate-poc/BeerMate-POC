({
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Fetches and returns line items, header attributes, tax paid picklist values, and spend category picklist values 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    getReimbursementLineItems : function(component, event, helper) {
        var action = component.get("c.getReimbursementLineItems");     
        action.setParams({PartnerFundClaimId : component.get("v.recordId")});
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.spendCategory", response.getReturnValue().spendCategoryVals);
                component.set("v.taxPaid", response.getReturnValue().taxPaidVals);
                component.set("v.reimbursementHeader", response.getReturnValue().theReimbursement);
                component.set("v.reimbursementLines", response.getReturnValue().reimbursementLines);                
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
    saveLineItemsOnServer : function(component, event, helper){
        var action=component.get("c.updateLineItems");
        action.setParams({
            wrapperString : JSON.stringify(component.get("v.reimbursementLines"))

        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if( state == "SUCCESS")
            {
                component.set("v.reimbursementLines", response.getReturnValue());
                helper.showToast({
                    "title": "Success!",
                    "type": "success",
                    "message": "Line items were saved."
                });
                window.location.reload();
            } else{
                helper.showToast({
                    "title": "Error",
                    "type": "error",
                    "message": "Line items were not saved."
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
    }
     
})