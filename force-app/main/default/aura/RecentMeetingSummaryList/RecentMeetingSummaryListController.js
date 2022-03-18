({
	doInit: function (component, event, helper) {
		var action = component.get("c.getMeetingSummary");
		action.setStorable();
		action.setParams({
			accountId: component.get("v.recordId")
		});
		action.setCallback(this, function (response) {
			var state = response.getState();
			if (state === 'SUCCESS') {
				component.set("v.callLogs", response.getReturnValue());
				var data = response.getReturnValue();
			} else if (state === 'ERROR') {
				console.log('Error', state);
			}
		});
		$A.enqueueAction(action);
	},
	cancelCall: function (component, event, helper) {
		var dismissActionPanel = $A.get("e.force:closeQuickAction");
		dismissActionPanel.fire();
	},
	startCall: function (component, event, helper) {
		component.set('v.isDisabled', true);
		var recordId = component.get('v.recordId');
		var callLogId = '';
		var action = component.get("c.startACall");
		action.setParams({ accountId : recordId });
		action.setCallback(this, function(data) {
			var callLog = data.getReturnValue();
			callLogId = callLog.Id;
			var evt = $A.get("e.force:navigateToComponent");
			evt.setParams({
				componentDef: "c:CallLog",
				componentAttributes: {
					recordId : recordId,
					callLogId : callLogId,
					desktopCall : true
				}
			});
			evt.fire();
		});
		$A.enqueueAction(action);
	}
})