/**
 * Created by alexandria.sanborn on 4/23/2019.
 */
({
    updateApproverOnServer : function(component, event, helper){
        var approverRecord = event.getParams().data
        var approverName = approverRecord.find(function(field){
            return field.fieldName === 'Full Name';
        });
        
        var confirmSave = confirm("Are you sure you want to assign this reimbursement to " + approverName.value + "?");
        
        if(confirmSave){
            var reimbursementId = component.get("v.recordId");
        	var approverId = approverRecord.find(function(field){
            	return field.fieldName === 'id';
        	});

        var approverAction = component.get("c.updateReimbursementApprover");
        approverAction.setParams({headerId : reimbursementId, approverId : approverId.value});

        approverAction.setCallback(this, function(response) {
            if(response.getState() === "SUCCESS"){
                component.set("v.success", true);
                location.reload();
            } else {
                component.set("v.error", true);
                component.set("v.errorMessage", response.getError()[0].message);
            }
        });

        $A.enqueueAction(approverAction);
            
        }
        
    }

})