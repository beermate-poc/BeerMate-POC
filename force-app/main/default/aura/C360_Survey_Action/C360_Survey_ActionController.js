({
	/**On loading of page this will display list of territory mapping records**/
    doInit : function(component, event, helper) {
    	helper.initHandler(component, event, helper);
        helper.initHelper(component, event, helper);
    },
    //navigating to survey page
    GoToURL : function(component, event, helper) {
        helper.GoToURL(component,event);
    },
    //This is used for redirection to the record detail page once clicking on the cancel button
    hCancel : function (component, event) {
    	var recordId = component.get("v.recordId");
        var redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
          "recordId": recordId,
          "slideDevName": "related"
        });
        redirect.fire();
    }
})