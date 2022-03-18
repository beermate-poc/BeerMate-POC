({
    doInit : function(component, event, helper) {
        component.set("v.hasNextPressed",false);
        var value =null;		
        var url = window.location.href;         
        
        var regex = new RegExp("[?&]recordId(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results)
            value = null;
        else if (!results[2])
            value = '';
            else
                value = decodeURIComponent(results[2].replace(/\+/g, " "));		
        if(value != null)
        {        	
            component.set("v.recordId",value);
        }
        
        var actiongetUser = component.get("c.fetchUser");
        actiongetUser.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
             
                //if(storeResponse.Profile.Name == "CTS SP Partner Profile" || storeResponse.Profile.Name == "System Administrator")
                if(storeResponse.Profile.Name == "CTS SP Partner Profile")
                {
                    component.set("v.iscommunityUser",true);
                    
                }else
                {
                    //component.set("v.iscommunityUser",true);
                    component.set("v.userErrorMessage","Sorry, this action button is designed for Partner Community users only. Please add new requirements to the Technician Tasks object in the related tab.");
                }
                
            }
        });
        $A.enqueueAction(actiongetUser);
        
        var actionCall = component.get("c.rslRecordType");
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var rslRecTypeMap = response.getReturnValue();                    
                component.set("v.recordTypeLabel",response.getReturnValue());
                
            }
        });
        $A.enqueueAction(actionCall);
        
        var actionCall2 = component.get("c.workOrderInfo");
        actionCall2.setParams({
                "woid":component.get("v.recordId")
            });
        actionCall2.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var returnWOvalue = response.getReturnValue();                    
                component.set("v.isROIorNI",returnWOvalue.CTS_ROI_NI__c);                 
            }
        });
        $A.enqueueAction(actionCall2);
        
       
        
    },
    onSelection :function(component, event, helper)
    {	
        component.set("v.selectedRecordTypeID", event.getSource().get("v.value"));
        component.set("v.selectedRecordTypeLabel", event.getSource().get("v.label"));
    },
    showNextScreen :function(component, event, helper)
    {
        component.set("v.hasNextPressed",true); 
        //alert(v.recordId);
        console.log("Has REcord Id Value>>"+component.get("v.recordId"));
        component.set("v.parentRecordId",component.get("v.recordId"));
        
        
        $A.createComponent("c:CTS_BrandSelection_Community",{"aura:id": "cmp","recordTypeId":component.getReference("v.selectedRecordTypeID"),"parentRecordId":component.getReference("v.parentRecordId"),"selectedRecordTypeLabel":component.getReference("v.selectedRecordTypeLabel"),"isROIorNI":component.getReference("v.isROIorNI")} ,
                           function( components,status, errorMessage){
                               if (status === "SUCCESS") { 
                                   var body = component.get("v.body");			
                                   body.push(components);
                                   component.set("v.body", body);
                               }
                               else if (status === "INCOMPLETE") {
                                   console.log("No response from server or client is offline.")
                                   // Show offline error
                               }
                                   else if (status === "ERROR") {
                                       console.log("Error: " + errorMessage);
                                       // Show error message
                                   }
                           });   
    },
    handleCancel :function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToRelatedList");
        urlEvent.setParams({
            "parentRecordId": (component.get("v.recordId")),
            "relatedListId": "WorkOrderLineItems"
        });
        urlEvent.fire();
        $A.get('e.force:refreshView').fire();
    },
    showSpinner : function(component, event, helper) {	
        $A.util.removeClass(component.find("spn") , "slds-hide");  
    },
    
    hideSpinner : function(component, event, helper) {	
        $A.util.addClass(component.find("spn") , "slds-hide");
    }
})