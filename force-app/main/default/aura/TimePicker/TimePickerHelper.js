({
	initialSetup: function (component) {
		// Checks if passed in date is empty, if so it uses todays date.
		var getDate = component.get('v.value');
		var internalValue = $A.util.isEmpty(getDate) ? new Date() : getDate;
		this.updateSelections(component, internalValue);
		component.set('v.internalValue', internalValue);
	},
	updateSelections: function(component, internalValue) {
		component.set('v.selectedMinute', internalValue.getMinutes());
		component.set('v.selectedHour', internalValue.getHours());
	},
	chooseTime: function(component) {
		var hideHours = component.get('v.hideHours');
		var hideMinutes = component.get('v.hideMinutes');
		if (!hideHours || !hideMinutes) {
			component.set('v.hideHours', true);
			component.set('v.hideMinutes', true);
		} else {
			component.set('v.hideHours', false);
		}
	},
	setHour: function(component, event) {
		if (event.target.outerText.indexOf('Set Hour') > -1 || event.target.outerText.indexOf('Clear') > -1) {
			return;
		}
		var getHour = parseInt(event.target.outerText);
		var getInternalTime = component.get('v.internalValue');
		getInternalTime.setHours(getHour);
		component.set('v.internalValue', getInternalTime);
		component.set('v.hideHours', true);
		component.set('v.hideMinutes', false);
	},
	setMinutes: function(component, event) {
		if (event.target.outerText.indexOf('Set Minutes') > -1 || event.target.outerText.indexOf('Clear') > -1) {
			return;
		}
		var getMinutes = parseInt(event.target.outerText);
		var getInternalTime = component.get('v.internalValue');
		getInternalTime.setMinutes(getMinutes);
		component.set('v.internalValue', getInternalTime);
		component.set('v.value', getInternalTime);
		component.set('v.selectedMinute', getMinutes);
		component.set('v.selectedHour', getInternalTime.getHours());
		component.set('v.hideMinutes', true);
	}
})