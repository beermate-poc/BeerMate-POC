({
    redirectToUrl : function(component,event,url) {
        debugger;
        var urlEvt = $A.get("e.force:navigateToURL");
        urlEvt.setParams({
            "url" :url
        })
        urlEvt.fire();	
	}
})