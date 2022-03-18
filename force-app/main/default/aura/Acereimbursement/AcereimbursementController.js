({
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:	 Updates status on reimbursement headers and line items to Pending Approval.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/    
    Send: function(component, event, helper) {
        var action = component.get("c.SendApproval");
        action.setParams({ recordId : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                alert("Your reimbursement has been successfully submitted for approval.");
                var result = response.getReturnValue();
                $A.get('e.force:refreshView').fire();
                $A.get("e.force:closeQuickAction").fire();
            }else{
                 alert("Error");
            }
        });
        $A.enqueueAction(action);
    },
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:	 Sends server call to Apex method to validate header and line items.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/       
    doInit:function(cmp, event, helper) {
        var action = cmp.get("c.validateCommunity");
        action.setParams({
            "recordID" : cmp.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.ErrorMessage",response.getReturnValue());
                if (response.getReturnValue()!= null) {
                    if(response.getReturnValue().length!=0){
                        cmp.set("v.ErrorCount",true);
                        cmp.set("v.HeaderMessage","Data Check");
                        cmp.set("v.ShowClose",false);
                    }
                    else{
                        cmp.set("v.ErrorCount",false);
                        cmp.set("v.HeaderMessage","Submit for Approval");
                        cmp.set("v.ShowClose",true);
                    }
                }
            } else {
                cmp.set("v.ErrorMessage",response.getError()[0]);
            }
        });
        $A.enqueueAction(action);
    },
    Cancel: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    Close : function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    }
})