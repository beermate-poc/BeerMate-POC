({
	objectiveCallSummaryFun : function(component) {
        //console.log('called ');
        var objeciveIdValue = component.get("v.objeciveId");
        var eventId = component.get("v.recordId");
        //alert('objeciveIdValue - '+ objeciveIdValue);
        //alert('eventId - '+ eventId);
        var action = component.get("c.objectiveCallSummaryFun"); 
        action.setParams({
            "eventId": eventId,
            "objectiveId":objeciveIdValue
        });
        action.setCallback(this, function(response){
            var responseMsg = response.getReturnValue().success;                        
            if (responseMsg != null && responseMsg == false) {
                
            	component.set('v.objeciveId', ''); // set the object id empty if we get the error message
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": response.getReturnValue().message,
                    "type": "error"
                });
                toastEvent.fire();               
                  
            }else{
              
              $A.get('e.force:refreshView').fire(); // refresh the component               
            }
		});
        $A.enqueueAction(action);
	},
    toggleObjectiveDropdown : function(component, event, helper) {
        try{
            var ddDiv = component.find('dropdownMenu');
            $A.util.toggleClass(ddDiv,'slds-is-open');
        } catch(e){
            console.error(e);
           
        }
    },
    getAcc:function(component, event, helper,recordId) {
        var action = component.get("c.getAccount"); 
        	action.setParams({
            	"Ids": recordId
            }); 
        action.setCallback(this, function(data){
            var state = data.getState(); 
            if(state === "SUCCESS"){
                var response = data.getReturnValue();
                //alert(response.RecordType.Name);
                    if ((response.RecordType.Name == 'Off-Premise') || (response.RecordType.Name == 'Chain Off-Premise')) {
                        component.set("v.isOffPrem", true);
                    } else {
                        component.set("v.isOffPrem", false);
                    }
                     component.set('v.accId', response.Id);
                 if((response.RecordType.DeveloperName== $A.get("$Label.c.Sales_UKI_Account")) || (response.RecordType.DeveloperName== $A.get("$Label.c.Sales_CA_Account"))){
                        component.set('v.usObj', false);
                    }
                    else{
                        component.set('v.usObj', true);
                    }
                
            }
            else if(state === "ERROR"){
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Error Occured",
                    "type": "error"
                });
                toastEvent.fire();               
                
            }else{
                
                $A.get('e.force:refreshView').fire(); // refresh the component               
            }
        });
        $A.enqueueAction(action);
    },
    
    createUS : function (component, event, helper,recrdtype) {
        var action = component.get("c.getRecTypeId"); 
        	action.setParams({
            	"recordName": recrdtype
        	}); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            //alert(state);
            if (state === "SUCCESS") { 
                //alert('hh');
                var RecTypeID = response.getReturnValue();
                 component.set("v.RecTypeID", RecTypeID);
                if(recrdtype !='Engagement' && recrdtype !='Feature' && recrdtype !='Display' && recrdtype !='Placement' && recrdtype !='Merchandise'){
                 this.createComponent(component, event, helper,RecTypeID);
                }else if(recrdtype =='Placement'){
                    //alert('isOffPrem-----'+component.get("v.isOffPrem"));
                var objList=[];
                    //objList.push(item);
                    $A.createComponent("c:PlacementCreate_EditView",{
                        	"aura:id": "editMode",
                        	"objectives" : objList,
                            "isOffPrem" : component.get("v.isOffPrem"),
                            "accountId" : component.get('v.accId'),
                            "RecordTypeName" : RecTypeID+'_'+recrdtype,
                            "EventId" : component.get("v.recordId"),
                        	"isCreate": true
                    } ,
                           function( components,status, errorMessage){
                               if (status === "SUCCESS") { 
                                   //alert('Body1');
                                   var body = component.get("v.body");
                                   //alert('Body2');
                                   body.push(components);
                                   component.set("v.body", body);
                                   window.setTimeout(
                                        $A.getCallback(function() {
                                            component.set("v.isEdit",true);
                                        }), 1000
                                    );
                                   
                               }
                               else if (status === "INCOMPLETE") {
                                   console.log("No response from server or client is offline.")
                                   var evnT = $A.get("event.force:showToast");
                                        evnT.setParams({
                                            "title": "Error",
                                            "message":"No response from server or client is offline.",
                                            "type":"error"
                                            
                                        });
                                        evnT.fire();
                               }
                                   else if (status === "ERROR") {
                                       console.log("Error: " + errorMessage);
                                       var evnT = $A.get("event.force:showToast");
                                        evnT.setParams({
                                            "title":"Error",
                                            "message":errorMessage,
                                            "type":"error"
                                            
                                        });
                                        evnT.fire();
                                   }
                           });
                }else{
                    //alert('isOffPrem-----'+component.get("v.isOffPrem"));
                var objList=[];
                    //objList.push(item);
                    $A.createComponent("c:ObjectivesCreate_EditView",{
                        	"aura:id": "editMode",
                        	"objectives" : objList,
                            "isOffPrem" : component.get("v.isOffPrem"),
                            "accountId" : component.get('v.accId'),
                            "RecordTypeName" : RecTypeID+'_'+recrdtype,
                            "EventId" : component.get("v.recordId"),
                        	"isCreate": true
                    } ,
                           function( components,status, errorMessage){
                               if (status === "SUCCESS") { 
                                   //alert('Body1');
                                   var body = component.get("v.body");
                                   //alert('Body2');
                                   body.push(components);
                                   component.set("v.body", body);
                                   window.setTimeout(
                                        $A.getCallback(function() {
                                            component.set("v.isEdit",true);
                                        }), 1000
                                    );
                                   
                               }
                               else if (status === "INCOMPLETE") {
                                   console.log("No response from server or client is offline.")
                                   var evnT = $A.get("event.force:showToast");
                                        evnT.setParams({
                                            "title": "Error",
                                            "message":"No response from server or client is offline.",
                                            "type":"error"
                                            
                                        });
                                        evnT.fire();
                               }
                                   else if (status === "ERROR") {
                                       console.log("Error: " + errorMessage);
                                       var evnT = $A.get("event.force:showToast");
                                        evnT.setParams({
                                            "title":"Error",
                                            "message":errorMessage,
                                            "type":"error"
                                            
                                        });
                                        evnT.fire();
                                   }
                           });
                }
                                    
            }
        }); 
        $A.enqueueAction(action);
      
    },
    createComponent : function (component, event, helper,RecTypeID) {
        var createRecordEvent = $A.get("e.force:createRecord");
				createRecordEvent.setParams({
        			"entityApiName": "Objective__c",
                    "recordTypeId": RecTypeID,
            		"defaultFieldValues": {
        				'Account__c' : component.get("v.accId")
                        
    				}
        		});
                  
        	createRecordEvent.fire();
    }
})