/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
12/14/2017    Nick Serafin       Initial Creation
------------------------------------------------------------*/
({
    /*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Calls the setCheckboxForCongaGeneration method in the apex controller
				   to check the Generate_Conga_Document__c field which starts the 
				   Generate Conga Document Workflow to attach a Conga document

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	12/14/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
    startGeneration : function(component) {
        var action = component.get("c.setCheckboxForCongaGeneration");
        var recordId = component.get('v.recordId');
        action.setParams({ recordId: recordId });
        action.setCallback(this, function (response) {
            if (response.getState() === "SUCCESS") {
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                dismissActionPanel.fire();
            } else {
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    
    /*------------------------------------------------------------
	Author:        Shruti Garg
	Company:       Accenture
	Description:   Calls the stampPDFDetails method in the apex controller
				   to update the PDF_Creation_Geolocation__c field with the User's
				   current location and stamp the PDF_Distance_from_Account__c 
                   field with the caluclated distance
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	05/26/2020   Shruti Garg       Initial Creation as part of GB-10311
	------------------------------------------------------------*/
    stampPDFDetails : function(component){
        
        var geoCode = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function showPosition(position) {
                geoCode = position.coords.latitude+';'+position.coords.longitude;
                var action = component.get("c.stampPDFDetails");
                action.setParams({ 
                    recId : component.get('v.recordId'), 
                    geoCodes: geoCode                    
                });
                action.setCallback(this, function(response) {
                    var state = response.getState();                    
                    if (state === "SUCCESS") {
                        // $A.get('e.force:refreshView').fire();
                    } else if (state === "ERROR") {
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log("Error message: " + 
                                            errors[0].message);	
                            }
                        } else {
                            console.log("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            });
        }
    }
})