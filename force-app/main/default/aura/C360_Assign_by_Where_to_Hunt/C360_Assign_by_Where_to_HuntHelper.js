({
    initHandler : function(component, event, helper) {
        var action = component.get("c.fetchAccountsFromWhereToHunt");
        action.setCallback(this, function(data) {
            var state = data.getState(); 
            if(state === "SUCCESS")
            {
                var response = data.getReturnValue();
                component.set('v.targetAcc', response);
            }
            
        });
        $A.enqueueAction(action); 
    },
    selAllRec : function(component, event, helper) {
        var selectedHeaderCheck = event.getSource().get("v.value");
        var recSize = component.get("v.targetAcc");
        var getAllId = component.find("selectedIds");
        if(!Array.isArray(getAllId)  && recSize.length != 0)
        {
            if(selectedHeaderCheck == true)
            { 
                component.find("selectedIds").set("v.value", true);
            }
            else
            {
                component.find("selectedIds").set("v.value", false);
            }
        }
        else
        {
            if (selectedHeaderCheck == true && recSize.length != 0)
            {
                for (var i = 0; i < recSize.length; i++) 
                {
                    component.find("selectedIds")[i].set("v.value", true);
                }
            }
            else {
                for (var i = 0; i < recSize.length; i++)
                {
                    component.find("selectedIds")[i].set("v.value", false);
                }
            } 
        }
    },
    canceled : function (component, event) {
        var recordId=component.get("v.recordId");
        var redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
            "recordId": recordId,
            "slideDevName": "related"
        });
        redirect.fire();
    },
    objHelper : function(component, event, recordsIds) {
        var recordId=component.get("v.recordId");
        var action = component.get("c.createObjective");
        action.setParams({
            "recIdsLst": recordsIds,
            "objrecId" : recordId
        });
        action.setCallback(this, function(response) {
            var gtState = response.getState();
            if (gtState === "SUCCESS") 
            {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":"Warning",
                    "title": "Success!",
                    "message": "The record has been updated successfully."
                });
                toastEvent.fire();   
            }
        });
        $A.enqueueAction(action);
    }
    
})