({
	doInit : function(component, event, helper) {
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        
        helper.retrivePartOrderDetails(component, event, helper);
        
    },
    //This handles the button Clicks Save and Cancel
    handleClick : function(component, event, helper) {
    	        
        var row = event.getParam('row');
        var actionName = event.getParam('action').name;
        //alert('Showing Details: ' + row.CTS_WOL_Reference_Long__c);
    	if ( actionName == 'View' ) {
            
            
                $A.util.addClass(component.find("tasktableNoRec"),"slds-hide");
                $A.createComponent("c:CTS_TechnicianTasksTable",{"aura:id": "Taskcmp","wolReference":row.CTS_WOL_Reference_Long__c} ,
                                   function( components,status, errorMessage){
                                       if (status === "SUCCESS") { 
                                           component.find("tasktable").set("v.body",[]);
                                           $A.util.removeClass(component.find("tasktable"),"slds-hide");
                                           var body = component.find("tasktable").get("v.body");			
                                           body.push(components);
                                           component.find("tasktable").set("v.body",body);
                                           
                                       }
                                       else if (status === "INCOMPLETE") {
                                           console.log("No response from server or client is offline.")
                                           //Show offline error
                                       }
                                           else if (status === "ERROR") {
                                               console.log("Error: " + errorMessage);
                                               // Show error message
                                           }
                                   });
            
            
        }
               
    },
    
    handleSaveEdition: function (component, event, helper) {
        var draftValues = event.getParam('draftValues');
		var action1 = component.get("c.updatePartOrderLines");
        //alert(draftValues);
        action1.setParams({"prodReqLineItems":draftValues})
        action1.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var evnT = $A.get("event.force:showToast");
                    evnT.setParams({
                        "title":"Part Order Lines:",
                        "message":"Record Saved Successfully !",
                        "type":"success"
                        
                    });
                 
                 
                 helper.retrivePartOrderDetails(component, event, helper);
                 helper.setDatatableValues(component, event, helper);
                
                 evnT.fire(); 
                 $A.get('e.force:refreshView').fire();
                
            }else{
                component.set("v.errors", returnValue.errors);
            }
        }));
        $A.enqueueAction(action1);
        
    },
    newPartLines: function (component, event, helper) {
        component.set("v.EditForm", false); 
        //helper.setNullValues(component, event, helper);
     },
    
     handleSave: function(component,event,helper){
        
        //component.find("edit").get("e.recordSave").fire();
        var action = component.get("c.savePartOrderDetails");
         //alert(component.get("v.editPartOrder"));
        action.setParams({"proReq" : component.get("v.editPartOrder")});
        action.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var resultInfo = response.getReturnValue();
                if(resultInfo === "Success")
                {
                    var evnT = $A.get("event.force:showToast");
                    evnT.setParams({
                        "title":"Part Order:",
                        "message":"Record Saved Successfully !",
                        "type":"success"
                        
                    });
                    evnT.fire();
                    $A.get("e.force:closeQuickAction").fire();
                    $A.get('e.force:refreshView').fire();
                }
                else{
                    $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    component.set("v.ErrorMsg",response.getReturnValue()); 
                } 
            } 
        });
        //Chack for required fields
        var partOrderRec = component.get("v.editPartOrder");
        var fieldsMissing = false;
         if((($A.util.isEmpty(partOrderRec.CTS_TR__c) || $A.util.isUndefined(partOrderRec.CTS_TR__c)) || ($A.util.isEmpty(partOrderRec.CTS_Delivery_Method__c) || $A.util.isUndefined(partOrderRec.CTS_Delivery_Method__c)) || ($A.util.isEmpty(partOrderRec.CTS_Requested_Delivery_Date__c) || $A.util.isUndefined(partOrderRec.CTS_Requested_Delivery_Date__c))) && (partOrderRec.Status == "Confirmed"))
         {
             $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
             component.set("v.ErrorMsg","Required fields must be completed: Required Delivery Date, TR, Delivery Method");
             fieldsMissing = true;
         }
        if(fieldsMissing == false)
        {
        	$A.enqueueAction(action);
        }

    },
    cancel : function(cmp, event) {
   		$A.get("e.force:closeQuickAction").fire();
    },
    
    goBack : function(component, event, helper) {
        helper.retrivePartOrderDetails(component, event, helper);
        
   		component.set("v.EditForm", true);
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        
    },
    showSpinner : function(component, event, helper) {	
        $A.util.removeClass(component.find("spn") , "slds-hide");  
    },	
    hideSpinner : function(component, event, helper) {	
        $A.util.addClass(component.find("spn") , "slds-hide");
    },
    //This fuction is to switch the display of TR Field in Component
    toggleDisplayTR :function(component, event, helper) {
        $A.util.addClass(component.find("divtag1TR"), "slds-hide");
        $A.util.removeClass(component.find("divtag2TR"), "slds-hide");
        component.find("TR").set("v.value",null);
        component.set("v.editPartOrder.CTS_TR__c",null);
        
        
    },
    //This fuction is to switch the display of SA Field in Component
    toggleDisplaySA :function(component, event, helper) {
        $A.util.addClass(component.find("divtag1SA"), "slds-hide");
        $A.util.removeClass(component.find("divtag2SA"), "slds-hide");
        component.find("ServiceAppointment").set("v.value",null);
        component.set("v.editPartOrder.CTS_Service_Appointment__c",null);
        
    }
})