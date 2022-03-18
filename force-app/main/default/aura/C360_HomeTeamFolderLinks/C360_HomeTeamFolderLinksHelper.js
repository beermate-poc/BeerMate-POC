({
	 /* Method to redirect user to teamfolder url selected by user on homepage */
    redirectToUrl : function(component,event,url) {
        var urlEvt = $A.get("e.force:navigateToURL");
        urlEvt.setParams({
            "url" :url
        })
        urlEvt.fire();
		
	}
})