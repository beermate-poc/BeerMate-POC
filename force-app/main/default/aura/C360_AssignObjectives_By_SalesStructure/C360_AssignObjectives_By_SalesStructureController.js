({
	/**On loading of page this will display list of territory mapping records**/
    doInit : function(component, event, helper) {
    	helper.initHandler(component, event, helper);
    },
    //Select all Territory Mapping records
    hselRec : function(component, event, helper) {
    	// get the selected checkbox value  
    	//alert(component.find("allIds"));
  		component.find("allIds").set("v.value",false);	
    },
    //Select all Territory Mapping records
    hselAllRec : function(component, event, helper) {
    	helper.selAllRec(component, event, helper);
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
    },
    //For selected records create objective and return to record detail page
    hCreateObj: function(component, event, helper) {
        // create var for store record id's for selected checkboxes  
        var createObjId = [];
        // get size of selected records 
        var recSize = (component.get('v.terrRec')).length;
        // get all the selected checkboxes 
        var getAllId = component.find("selectedIds");
        // If the local ID is unique[in single record case], find() returns the component. not array
        if(!Array.isArray(getAllId) && recSize != 0){
            if (getAllId.get("v.value") == true) {
                createObjId.push(getAllId.get("v.text"));
            }
        }
        else{
            // play a for loop and check every checkbox values 
            // if value is checked(true) then add those Id (store in Text attribute on checkbox) in createObjId var.
            for (var i = 0; i < recSize; i++) {
                if (getAllId[i].get("v.value") == true) {
                    createObjId.push(getAllId[i].get("v.text"));
                }
            }
        }
        if(createObjId.length == 0){
            alert("Please select at least one record to proceed!");
        }
        else{
            // call the helper function and pass all selected record id's.    
            helper.objHelper(component, event, createObjId);
            //once record is selected to create the objective,return to parent record detail page 
            helper.canceled(component,event);
        }  
    },
    //For selected records create objective and return to lightning page
    handleCor: function(component, event, helper) {
        // create var for store record id's for selected checkboxes  
        var createObjId = [];
        // get size of selected records 
        var recSize = (component.get('v.terrRec')).length;
        // get all the selected checkboxes 
        var getAllId = component.find("selectedIds");
        // If the local ID is unique[in single record case], find() returns the component. not array
        if(!Array.isArray(getAllId) && recSize != 0){
        	if (getAllId.get("v.value") == true) {
            	createObjId.push(getAllId.get("v.text"));
            }
      	}
        else{
        	// play a for loop and check every checkbox values 
            // if value is checked(true) then add those Id (store in Text attribute on checkbox) in createObjId var.
            for (var i = 0; i < recSize; i++) {
            	if (getAllId[i].get("v.value") == true) {
                	createObjId.push(getAllId[i].get("v.text"));
              	}
          	}
        }
        if(createObjId.length == 0){
        	alert("Please select at least one record to proceed!");
        }
        else{
        	// call the helper function and pass all selected record id's.    
            helper.objHelper(component, event, createObjId);
        	//loading back to the lightning page
        	helper.initHandler(component, event, helper);
      	} 
        //unchecking the select all option
        component.find("allIds").set("v.value",false);
    }
})