({
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Load reimbursement record details to clone.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	29/01/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
	loadRecordData : function(cmp) {
        debugger;
		var action = cmp.get("c.getClaimDetails");
                    action.setParams({
                        reimburseId: cmp.get("v.recordId")
                    });
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            cmp.set("v.newReimbursement", response.getReturnValue());
                            
                        }
                    });
		  $A.enqueueAction(action);                             
	},
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Save the cloned reimbursement record.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	29/01/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    saveReimbursement : function(cmp,helper) {
        debugger;
        var action = cmp.get("c.cloneReimbursement");
                    action.setParams({
                        claim:cmp.get("v.newReimbursement"),
                        reimburseId: cmp.get("v.recordId")
                    });
        action.setCallback(this, function(response) {
                        var state = response.getState();
            			var response = response.getReturnValue();
            			var values;
            			if(response.indexOf(':') != -1)
            			values= response.split(':');
                        if (state === "SUCCESS") {
                            if(values != undefined &&values[0] == 'Success'){
                                helper.showtoastMessage(cmp,helper,"Success","success","Reimbursement was saved succesfully.");
                                var dismissActionPanel = $A.get("e.force:closeQuickAction"); 
                                dismissActionPanel.fire(); 
                                var recordId = values[1];
                                var sObectEvent = $A.get("e.force:navigateToSObject");
                                sObectEvent .setParams({
                                    "recordId": recordId  ,
                                    "slideDevName": "detail"
                                });
                                sObectEvent.fire();
                            }
                            else if(response =='NotValidApprover')
                            {
                                helper.showtoastMessage(cmp,helper,"Error!","error","Failed to create Reimbursement record.You are not a valid approver.");
                            	var dismissActionPanel = $A.get("e.force:closeQuickAction"); 
                                dismissActionPanel.fire();
                            } 
                            else{
                                helper.showtoastMessage(cmp,helper,"Error!","error","Failed to create Reimbursement record.");
                            	var dismissActionPanel = $A.get("e.force:closeQuickAction"); 
                                dismissActionPanel.fire(); 
                            }
                        }
        });
		  $A.enqueueAction(action);  
    },
    showtoastMessage : function(component, helper,title,type,msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type": type,
            "message":msg
        });
        toastEvent.fire();
    }
})