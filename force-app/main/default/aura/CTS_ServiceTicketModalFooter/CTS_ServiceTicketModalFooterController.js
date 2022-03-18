({
    init : function(cmp, event, helper) {
        // Figure out which buttons to display
        var availableActions = cmp.get('v.availableActions');
        for (var i = 0; i < availableActions.length; i++) {
            if (availableActions[i] == 'NEXT') {
                cmp.set('v.canNext', true);
            } else if (availableActions[i] == 'FINISH') {
                cmp.set('v.canFinish', true);
            }
        }
    },
    onButtonSubmitPressed: function(cmp, event, helper) {
        // Figure out which action was called
        var actionClicked = event.getSource().getLocalId();
        // Fire that action
        var navigate = cmp.get('v.navigateFlow');
        navigate(actionClicked);
    },
    onButtonCancelPressed: function(cmp, event, helper) {
        //fire event to close modal
        var modalEvent = cmp.getEvent('ModalCloseEvent');
        modalEvent.setParam('actionType', 'CANCEL');
        modalEvent.fire();
    },
    onButtonClosePressed: function(cmp, event, helper) {
        //fire event to close modal
        var modalEvent = cmp.getEvent('ModalCloseEvent');
        modalEvent.setParam('actionType', 'CLOSE');
        modalEvent.fire();
    }
})