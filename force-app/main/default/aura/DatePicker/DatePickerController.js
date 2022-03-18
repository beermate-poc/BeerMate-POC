({
	doInit: function (component, event, helper) {
		helper.initialSetup(component);
	},
	chooseDate: function (component) {
		component.set('v.hidePick', !component.get('v.hidePick'));
	},
	changeMonths: function (component, event, helper) {
		helper.changeMonths(component, event);
	},
	returnClear: function (component) {
		component.set('v.value', null);
		component.set('v.hidePick', true);
	},
	setToday: function (component, event, helper) {
		var newDate = $A.localizationService.parseDateTime(new Date());
		component.set('v.value', newDate);
		component.set('v.hidePick', true);
		component.set('v.internalValue', newDate);
		helper.generateDays(component, newDate);
	},
	handleDaySelect: function (component, event, helper) {
		helper.handleDaySelect(component, event);
	},
	closeWindow: function (component) {
		component.set('v.hidePick', true);
	}
})