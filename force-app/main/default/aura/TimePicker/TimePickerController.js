({
	doInit : function(component, event, helper) {
		helper.initialSetup(component, event);
	},
	updateSelection: function(component, event, helper) {
		helper.updateSelections(component, component.get('v.internalValue'));
	},
	chooseTime: function(component, event, helper) {
		helper.chooseTime(component);
	},
	closeWindow: function(component) {
		component.set('v.hideHours', true);
		component.set('v.hideMinutes', true);
	},
	setHour: function(component, event, helper) {
		helper.setHour(component, event);
	},
	setMinutes: function(component, event, helper) {
		helper.setMinutes(component, event);
	},
	returnClear: function (component) {
		component.set('v.value', null);
		component.set('v.hideHours', true);
		component.set('v.hideMinutes', true);
	}
})