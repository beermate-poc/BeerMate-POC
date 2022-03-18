({
   	onSearchChange : function(component, event, helper) {
		component.get('v.searchValue').length >= 2 ? helper.onSearchChange(component) : helper.clearOut(component);
	},
	onSelectOption: function(component, event, helper) {
		try{
			var getElement = event.target;
			if (getElement.parentElement.parentElement.className.indexOf('lookupPlaceholder') > -1) {
				getElement = getElement.parentElement.parentElement;
			}
			helper.onSelectOption(component, getElement);
		} catch(e){
			console.error(e);
		}
	},
    setPackage : function(component, event, helper){
		helper.populatePackages(component, event);
	},
	initializePackageFromTemplate : function(component, event, helper){
        var params = event.getParam('arguments');
        if (params) {
            var productId = params.productId;
        }
        //alert(productId);
		helper.populatePackages(component, event);
		component.set("v.selectedPkgId", productId);
	}
})