({
    updatePageNumber : function(component, helper) {
        var offset = (component.get("v.pageNumber")-1)*component.get("v.pageSize");
        var updateLookup = component.getEvent('updatePage');
        updateLookup.setParams({data:offset});
        updateLookup.fire();
    },
})