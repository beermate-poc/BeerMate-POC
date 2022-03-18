({
    doInit : function(component, event, helper) {
        component.set("v.hasNextPressed",false);
        var pageReference = component.get("v.pageReference");
        var parentRecordId = pageReference.state.c__parentRecordId;
        if(parentRecordId != null)
        {        	
            component.set("v.parentRecordId",parentRecordId.substring(0, 15));
        }
        //alert("parentrec"+parentRecordId);
        var pageReference = component.get("v.pageReference");
        var ROIVal = pageReference.state.c__isROINI;	
        if(ROIVal != null)
        { 
            component.set("v.isROIorNI",ROIVal.startsWith(1));
        }        
        var pageReference = component.get("v.pageReference");
        var RecVal = pageReference.state.recordId;
        if(RecVal != null)
        {        	
            component.set("v.recordId",RecVal);
        }
        var actionCall = component.get("c.rslRecordType");
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var rslRecTypeMap = response.getReturnValue();                    
                //component.set("v.recordTypeLabel",response.getReturnValue());
                var rslRecTypeFilteredMap = [];
                var parentWO = component.get("v.ParentWorkOrder");
                var parentWOPrefix = (parentWO.RecordType.DeveloperName).substring(0,3);
                var parentWORecordTypeName = (parentWO.RecordType.DeveloperName);
                if(parentWOPrefix == "CEA"){
                    component.set("v.isAssetLines", true);
                }
                rslRecTypeMap.forEach(
                    function filterRecordTypes(eachRecType){
                        
                        if(eachRecType.DeveloperName.startsWith(parentWOPrefix))
                        {
                            if(parentWOPrefix == "CEA")
                            {
                                if((parentWORecordTypeName == "CEA_Fridge" || parentWORecordTypeName == "CEA_HVPOCM" ) && eachRecType.DeveloperName != "CEA_Asset_Install_Draught")
                                {
                                    rslRecTypeFilteredMap.push(eachRecType);
                                }else if(parentWORecordTypeName == "CEA_Draught" && eachRecType.DeveloperName != "CEA_Asset_Install") 
                                {
                                    rslRecTypeFilteredMap.push(eachRecType);
                                }
                            }else{
                                rslRecTypeFilteredMap.push(eachRecType);
                            }
                        }
                    }
                );
                component.set("v.recordTypeLabel",rslRecTypeFilteredMap); 
                
            }
        });
        
        var actionCallWO = component.get("c.workOrderInfo");
        actionCallWO.setParams({woid:component.get("v.parentRecordId")});
        actionCallWO.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var parentWO = response.getReturnValue();
                
                component.set("v.ParentWorkOrder",parentWO);
                
                $A.enqueueAction(actionCall);
                
                
            }
        });
        
        
        $A.enqueueAction(actionCallWO);
        
    },
    onSelection :function(component, event, helper)
    {	
        component.set("v.selectedRecordTypeID", event.getSource().get("v.value"));
        component.set("v.selectedRecordTypeLabel", event.getSource().get("v.label"));
        var recTypes = component.get("v.recordTypeLabel");
            
        for (var j = 0; j < recTypes.length; j++) {
                    
            //alert("Inside For----REctYpe"+recTypes[j].Id);        
            if((recTypes[j].Id == event.getSource().get("v.value")) && (recTypes[j].DeveloperName).startsWith("CEA"))
              {
                  component.set("v.isAssetLines", true);
                  //alert("Inside For----REctYpe"+component.get("v.isAssetLines"));
                  break;
              }
                    
        }
        
    },
    showNextScreen :function(component, event, helper)
    {
        var pageReference = component.get("v.pageReference");
        var parentRecordId = pageReference.state.c__parentRecordId;
        if(parentRecordId != null)
        {        	
            component.set("v.parentRecordId",parentRecordId.substring(0, 15));
        }
         var ROIVal = pageReference.state.c__isROINI;
        //alert("ROIVal"+ROIVal);
        if(ROIVal != null)
        { 
            component.set("v.isROIorNI",ROIVal.startsWith(1));
        }  
        var RecVal = pageReference.state.recordId;
        if(RecVal != null)
        {        	
            component.set("v.recordId",RecVal);
        }
        var actionCall = component.get("c.rslRecordType");
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var rslRecTypeMap = response.getReturnValue();                    
                //component.set("v.recordTypeLabel",response.getReturnValue());
                var rslRecTypeFilteredMap = [];
                var parentWO = component.get("v.ParentWorkOrder");
                var parentWOPrefix = (parentWO.RecordType.DeveloperName).substring(0,3);
                var parentWORecordTypeName = (parentWO.RecordType.DeveloperName);
                if(parentWOPrefix == "CEA"){
                    component.set("v.isAssetLines", true);
                }
                rslRecTypeMap.forEach(
                    function filterRecordTypes(eachRecType){
                        
                        if(eachRecType.DeveloperName.startsWith(parentWOPrefix))
                        {
                            if(parentWOPrefix == "CEA")
                            {
                                if((parentWORecordTypeName == "CEA_Fridge" || parentWORecordTypeName == "CEA_HVPOCM" ) && eachRecType.DeveloperName != "CEA_Asset_Install_Draught")
                                {
                                    rslRecTypeFilteredMap.push(eachRecType);
                                }else if(parentWORecordTypeName == "CEA_Draught" && eachRecType.DeveloperName != "CEA_Asset_Install") 
                                {
                                    rslRecTypeFilteredMap.push(eachRecType);
                                }
                            }else{
                                rslRecTypeFilteredMap.push(eachRecType);
                            }
                        }
                    }
                );
                component.set("v.recordTypeLabel",rslRecTypeFilteredMap); 
                
            }
        });
        
        var actionCallWO = component.get("c.workOrderInfo");
        actionCallWO.setParams({woid:component.get("v.parentRecordId")});
        actionCallWO.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var parentWO = response.getReturnValue();
                
                component.set("v.ParentWorkOrder",parentWO);
                
                $A.enqueueAction(actionCall);
                
                
            }
        });
        
        
        $A.enqueueAction(actionCallWO);
        
        //alert(" from next parentrec"+parentRecordId);
        component.set("v.body", []);
        /*
        
        /*
        var evt = $A.get("e.force:navigateToComponent");        
        evt.setParams({
            componentDef: "c:CTS_BrandSelection",
            isredirect:true,
            componentAttributes :{ 
                recordTypeId:component.get("v.selectedRecordTypeID"),
                parentRecordId:component.get("v.parentRecordId"),
                selectedRecordTypeLabel:component.get("v.selectedRecordTypeLabel")
            }
        });
        */
        
        //evt.fire();
        //alert("Next Button----REctYpe"+component.get("v.isAssetLines")); 
        $A.createComponent("c:CTS_BrandSelection",{"aura:id": "cmp","recordTypeId":component.getReference("v.selectedRecordTypeID"),"parentRecordId":component.getReference("v.parentRecordId"),"selectedRecordTypeLabel":component.getReference("v.selectedRecordTypeLabel"),"isROIorNI":component.getReference("v.isROIorNI"),"isAssetLines":component.getReference("v.isAssetLines")} ,
                           function( components,status, errorMessage){
                               if (status === "SUCCESS") { 
                                   var body = component.get("v.body");			
                                   body.push(components);
                                   component.set("v.body", body);
                                   window.setTimeout(
                                        $A.getCallback(function() {
                                            component.set("v.hasNextPressed",true);
                                        }), 2200
                                    );
                                   
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
            "parentRecordId": component.get("v.parentRecordId"),
            "relatedListId": component.get("v.isAssetLines") ? "CEAWork_Order_Line_Items__r":"WorkOrderLineItems"
        });
        
        urlEvent.fire();
        
        $A.get('e.force:refreshView').fire();
        
        
    },
    showSpinner : function(component, event, helper) {	
        $A.util.removeClass(component.find("spn") , "slds-hide");  
    },
    
    hideSpinner : function(component, event, helper) {	
        $A.util.addClass(component.find("spn") , "slds-hide");
    },
    reSetComponent :function(component, event, helper)
    {	
        component.set("v.hasNextPressed",false);
        component.set("v.body", []);
    }
})