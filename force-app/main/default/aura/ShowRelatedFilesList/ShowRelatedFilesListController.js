({
	doInit : function(component, event, helper) {
        debugger;
        helper.getContentDocs(component, event, helper);
       
          
	},
    goBackToParent : function(component, event, helper) {
		var showFilesEvent = component.getEvent("OnClickShowFilesEvent"); 
                        //Set event attribute value
        showFilesEvent.setParams({"typeOfEvent" : "Back To Parent","sobjectedId" : "","isFromShowRelatedFilesCMP":true}); 
        showFilesEvent.fire();
	},
    gotoEditPage : function(component, event, helper) {
		var editPageEvent = component.getEvent("OnClickEditPageEvent"); 
                        //Set event attribute value
        editPageEvent.setParams({"clickedEdit" : true,"selectedObjectiveId":component.get("v.sObjectId")}); 
        editPageEvent.fire();
	},/*
    gotoURL : function (component, event, helper) {
        event.preventDefault();
        var action = component.get("c.downloadAttachment");
        action.setParams({
            	"downloadAttachmentID": event.target.getAttribute("data-key")
        	});
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state === "SUCCESS"){
                //alert('Server Call--');
                //alert('out--'+(response.getReturnValue()));
                if(response.getReturnValue() != null && response.getReturnValue() != ''){
                	var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                      "url": response.getReturnValue(),
                        "navigationLocation": "LOOKUP"
                        
                    });
                    //+"?operationContext=S1"
                    urlEvent.fire();
                }else{
                    
                }
            }
            else if(state === "ERROR"){
                //$A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                //component.set("v.ErrorMsg","Unexpected Error on getting Status values. Please try reloading the page.");
                console.log('error');
            }else{
                //$A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                //component.set("v.ErrorMsg","Unexpected Error on getting Status values. Please contact admin.");
            }
        });
        $A.enqueueAction(action);
        
	},
    previewFile : function(component, event, helper) {
		var selectedPillId = event.getSource().get("v.name");
        $A.get('e.lightning:openFiles').fire({
                recordIds: [selectedPillId]
                });
	}*/
})