({
	initHandler : function(component, event, helper) {
		//getting the list of territory mapping records from apex controller's method 
		var ActionMthd = component.get("c.getAvailabeSurvey");
        // pass the all selected record's Id's to apex method 
        ActionMthd.setParams({
            "evtId" : component.get("v.recordId")
        });
        //setting up the value to page variable to display
        ActionMthd.setCallback(this, function(data) {
	        //getting the state of response
    	    var StateRes = data.getState();
            if(StateRes === "SUCCESS"){
                //getting the response and storing variable
                var ResPonse = data.getReturnValue();
                //setting response to surRec
                component.set('v.surRec', ResPonse);
            }
            else if(StateRes === "ERROR"){
                //console.log("Errors");
            }
        });
        $A.enqueueAction(ActionMthd); 	
	},
    initHelper : function(component, event, helper) {
		//getting the list of territory mapping records from apex controller's method 
		var ActionMthd = component.get("c.getSurveyTaken");
        console.log(component.get("v.recordId"));
        // pass the all selected record's Id's to apex method 
        ActionMthd.setParams({
            "evtId" : component.get("v.recordId")
        });
        //setting up the value to page variable to display
        ActionMthd.setCallback(this, function(data) {
	        //getting the state of response
    	    var StateRes = data.getState();
            if(StateRes === "SUCCESS"){
                //getting the response and storing variable
                var ResPonse = data.getReturnValue();
                //setting response to surTakRec
                component.set('v.surTakRec', ResPonse);
            }
            else if(StateRes === "ERROR"){
                //console.log("Errors");
            }
            console.log('Survey Taken===='+'{!v.surTakRec}');
        });
        $A.enqueueAction(ActionMthd); 	
	},
    GoToURL : function (component,event) {
        var urlEvent = $A.get("e.force:navigateToURL");
        var getId= event.currentTarget.getAttribute("data-attriVal");
        var getUrl = getId.substr(getId.indexOf("=")+1,getId.lastIndexOf(" target="));
        var finalUrl = getUrl.substr(0,getUrl.indexOf(" target="));
        var recordId = component.get('v.recordId');
        var url =finalUrl.replace('"','')+'&availSurvey='+event.currentTarget.getAttribute('data-id')+'&accountId='+event.currentTarget.getAttribute('data-accId')+'&clone='+event.currentTarget.getAttribute('data-clone')+'&eventId='+recordId;
        /**if(getId == 'Not Applicable'){
            alert('This survey link is not applicable');
        } 
        else if(getId =='Survey Completed' ){
        	alert('The survey is completed');    
        }**/
       // else{
            urlEvent.setParams({
                //"url": finalUrl.replace('"','')+'&availSurvey='+event.currentTarget.getAttribute('data-id')+'&accountId='+event.currentTarget.getAttribute('data-accId')
                "url": url
            });
            urlEvent.fire();
       // }            
    }
})