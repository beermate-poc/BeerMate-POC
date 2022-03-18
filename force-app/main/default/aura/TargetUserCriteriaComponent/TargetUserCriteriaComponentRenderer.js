({
	afterRender : function(component, helper) {
		this.superAfterRender();
		var didScroll = false;
		var tableElement = component.find('existingTableScroll');
		if(!$A.util.isEmpty(tableElement)){
			tableElement = tableElement.getElement();
			tableElement.onscroll = function(){
				didScroll = true;
			}
			// periodically attach the scroll event listener
			// so that we aren't taking action for all events
			var scrollCheckIntervalId = setInterval($A.getCallback(function(){
				// since this function is called asynchronously outside the component's lifecycle
				// we need to check if the component still exists before trying to do anything else
				if (didScroll && component.isValid()){
					didScroll = false;
					if(Math.ceil(tableElement.scrollHeight - tableElement.scrollTop) === tableElement.clientHeight){
						helper.getNextPage(component);
					}
				}
			}), 750);
			component.set('v.scrollCheckIntervalId', scrollCheckIntervalId);
		}
	},
	unrender : function(component, helper) {
		this.superUnrender();
		var scrollCheckIntervalId = component.get('v.scrollCheckIntervalId');
		if (!$A.util.isUndefinedOrNull(scrollCheckIntervalId)){
			window.clearInterval(scrollCheckIntervalId);
		}
	}
})