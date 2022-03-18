({
    initHelper: function (component, event, helper) {
        let action = component.get('c.getSelectOptions');
        action.setParams({contactId: component.get('v.recordId')});
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                let result = response.getReturnValue();
                component.set('v.options', result);
            } else {

            }
        });

        $A.enqueueAction(action);
    },
    setPayers: function (component, event, helper) {
        let selectedOptions = component.get('v.selectedOptions');
        if (selectedOptions.length > 0) {
            let action = component.get('c.setPayerRelations');
            action.setParams({
                contactId: component.get('v.recordId'),
                selectedOptionsJSON: JSON.stringify(selectedOptions)
            });
            action.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var toastRef = $A.get("e.force:showToast");
                    if (response.getReturnValue() == null) {
                        toastRef.setParams({
                            "type": "Success",
                            "title": "Success",
                            "message": "Relations have been created",
                            "mode": "pester",
                            "duration": '1000'
                        });
                    } else {
                        toastRef.setParams({
                            "type": "Error",
                            "title": "Error",
                            "message": "There was a problem when creating relationships",
                            "mode": "dismissible",
                            "duration": '1000'
                        });
                    }
                    toastRef.fire();

                    $A.get("e.force:refreshView").fire();
                } else {
                    console.log('Server error during saving ' + response.getError());
                }
            });

            $A.enqueueAction(action);
        }
    }
});