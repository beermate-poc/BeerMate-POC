({
	initialSetup: function (component) {
		// Checks if passed in date is empty, if so it uses todays date.
		var getDate = component.get('v.value');
		if ($A.util.isEmpty(getDate)) {
			component.set('v.formattedDate', null);
			var internalValue = $A.localizationService.parseDateTime(new Date());
		} else {
			var parsedDate = $A.localizationService.parseDateTime(getDate);
			var internalValue = $A.localizationService.parseDateTime(getDate);
			component.set('v.formattedDate', parsedDate);
		}
		component.set('v.internalValue', internalValue);
		this.generateDays(component, internalValue);
	},
	generateDays: function (component, internalValue) {
		try{
			var selectedDate = component.get('v.formattedDate');
			var selectedMonth = -1,
				selectedDay = -1;
			if (selectedDate) {
				selectedMonth = selectedDate.getMonth();
				selectedDay = selectedDate.getDate();
			}
			var getInternalDate = internalValue == null ? internalValue : component.get('v.internalValue');
			var getInternalMonth = getInternalDate.getMonth();
			var cloneDate = $A.localizationService.parseDateTime(getInternalDate);
			cloneDate.setDate(1);
			var getDayOfWeek = cloneDate.getDay();

			if (getDayOfWeek != 0) {
				cloneDate.setDate(-getDayOfWeek);
			} else {
	            cloneDate.setDate(getDayOfWeek);
	        }
			var daysPerWeek = [],
				days = [],
				cloneDatePerDay = $A.localizationService.parseDateTime(cloneDate);
			for (var i = 0; i < 42; i++) {
				cloneDatePerDay.setDate(cloneDatePerDay.getDate() + 1);
				var getPerDayMonth = cloneDatePerDay.getMonth(),
					getPerDayDay = cloneDatePerDay.getDate();
				days.push({
					day: getPerDayDay,
					sameMonth: getInternalMonth == getPerDayMonth,
					selected: selectedMonth == getPerDayMonth && selectedDay == getPerDayDay
				});
				if (days.length == 7) {
					daysPerWeek.push(days);
					days = [];
				}
			}
			component.set('v.days', daysPerWeek);
		} catch(e){
			console.error(e);
		}
	},
	changeMonths: function (component, event) {
		try{
			var getInternalDate = component.get('v.internalValue');
			var getInternalMonth = getInternalDate.getMonth();
			if (event.getSource().get('v.name') == 'Next') {
				getInternalDate.setMonth(getInternalMonth + 1);
			} else {
				getInternalDate.setMonth(getInternalMonth - 1);
			}
			component.set('v.internalValue', getInternalDate);
			this.generateDays(component, getInternalDate);
		} catch(e){
			console.error(e);
		}
	},
	handleDaySelect: function (component, event) {
		try{
			var getDay = event.currentTarget.id;
			var getInternalValue = component.get('v.internalValue');
			if(event.currentTarget.getAttribute("aria-disabled") == 'true'){
				if(getDay < 15){
					var month = getInternalValue.getMonth();
					getInternalValue.setMonth(month + 1);
				} else {
					var month = getInternalValue.getMonth();
					getInternalValue.setMonth(month - 1);
				}
			}
			getInternalValue.setDate(getDay);
			component.set("v.value", getInternalValue);
			component.set('v.hidePick', true);
		} catch(e){
			console.error(e);
		}
	}
})