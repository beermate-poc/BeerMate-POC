({	
    /**Helper method for the init method**/
	initHandler : function(component, event, helper) {
        console.log('ON PAGE LOAD-----');
        //getting the list of territory mapping records from apex controller's method 
		var action = component.get('c.getChildTerLsts');
        //setting up the value to page variable to display
        action.setCallback(this, function(data) {
	        //getting the state of response
    	    var state = data.getState(); 
            if(state === "SUCCESS"){
                //getting the response and storing variable
                var response = data.getReturnValue();
                //setting response to terrRec
                component.set('v.terrRec', response);
            }
            else if(state === "ERROR"){
                console.log(event.target.value);
                console.log("Errors");
            }
        });
        $A.enqueueAction(action); 
	},
    selAllRec : function(component, event, helper) {
        console.log('-----------After ON PAGE LOAD-----');
        //get the header checkbox value  
        var selectedHeaderCheck = event.getSource().get("v.value");
        // get all checkbox on table with "selectedIds" aura id (all iterate value have same Id)
        // return the List of all checkboxs element 
        var recSize = component.get('v.terrRec');
        var getAllId = component.find("selectedIds");
        //alert('-----getAllId----'+getAllId);
        //alert('!Array.isArray(getAllId)'+!Array.isArray(getAllId));
        // If the local ID is unique[in single record case], find() returns the component. not array   
        if(!Array.isArray(getAllId)  && recSize.length != 0){
            //alert('If part');
                if(selectedHeaderCheck == true){ 
                    //alert('Inside if select header');
                    component.find("selectedIds").set("v.value", true);
                }
                else{
                    //alert('Inside else select header');
                    component.find("selectedIds").set("v.value", false);
                }
        }
        else{
        	// check if select all (header checkbox) is true then true all checkboxes on table in a for loop  
            // and set the all selected checkbox length in selectedCount attribute.
            // if value is false then make all checkboxes false in else part with play for loop 
            // and select count as 0 
            if (selectedHeaderCheck == true && recSize.length != 0){
                //alert('else part');
            	for (var i = 0; i < recSize.length; i++) {
                	component.find("selectedIds")[i].set("v.value", true);
                }
            }
            else {
               for (var i = 0; i < recSize.length; i++){
                   component.find("selectedIds")[i].set("v.value", false);
               }
            } 
		}
    },
    //This is used for redirection to the record detail page once clicking on the save button
    canceled : function (component, event) {
        var recordId=component.get("v.recordId");
        var redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
          "recordId": recordId,
          "slideDevName": "related"
        });
        redirect.fire();
    },
    //this would pass the parameter to apex controller to create the objective with selected user
    objHelper : function(component, event, recordsIds) {
        //to get the objective record id
        var recordId=component.get("v.recordId");
        //call apex class method
        var action = component.get('c.createObjective');
       // pass the all selected record's Id's to apex method 
        action.setParams({
            "recIdsLst": recordsIds,
            "objId" : recordId
        });
        action.setCallback(this, function(response) {
            //store state of response
            var gtState = response.getState();
            if (gtState === "SUCCESS") {
                console.log(gtState);
                if (response.getReturnValue() != '') {
                    // if getting any error while creating the records , then displaying a alert msg
                    //alert('The following error has occurred. while creating record-->' + response.getReturnValue());
                } 
                else {
                    console.log('check it--> created successful');
                }
                
            }
        });
        $A.enqueueAction(action);
    }
})