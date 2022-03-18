({
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:	 Updates status on reimbursement headers and line items to Approved.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/     
	 Approve : function(component, event, helper) {
		 var action = component.get("c.ApproveRecord");
        action.setParams({ recordID : component.get("v.recordId") });
        action.setCallback(this, function(response) {
            var state = response.getState();
           
            if (state === "SUCCESS") {
                if(response.getReturnValue() && response.getReturnValue().length != 0)
                {
                    component.set("v.ShowClose",false);
                    component.set("v.HeaderMessage",'Review the following errors:');
                    component.set("v.ErrorCount",true);
                    component.set("v.ErrorMessage",response.getReturnValue());
                }
               else
               {
                   var toastEvent = $A.get("e.force:showToast");
                   toastEvent.fire({
                       "title": "Success!",
                       "type": "success",
                       "message": "Reimbursement was approved."
                   });
                 $A.get('e.force:refreshView').fire();
                   $A.get("e.force:closeQuickAction").fire();
               }
                 
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
        var action = cmp.get("c.validate");
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
                        cmp.set("v.HeaderMessage","Line Items Data Error");
                        cmp.set("v.ShowClose",false);
                    }
                    else{
                       // alert("Inside");
                        cmp.set("v.ErrorCount",false);
                        cmp.set("v.HeaderMessage","Approve Reimbursement");
                        cmp.set("v.ShowClose",true);
                    }
                }
            } else {
                cmp.set("v.ErrorCount",true);
                cmp.set("v.HeaderMessage",response.getError()[0].message);
                cmp.set("v.ShowClose",false);

            }
        });
        $A.enqueueAction(action);
    },
     Close : function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    Cancel: function(component, event, helper) {
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    }
   
})