({
	objectiveCallSummaryFun : function(component) {
        console.log('called ');
        var objeciveIdValue = component.get("v.objeciveId");
        var eventId = component.get("v.recordId");
        
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
    getObjectiveId : function(component,ObjName,helper) {
		var action = component.get("c.getObjectiveId"); 
        var eventId = component.get("v.recordId");
        console.log(ObjName);
        action.setParams({
            "ObjName":ObjName,
            "eventId": eventId
        }); 
         action.setCallback(this, function(response){
             
            var responseMsg = response.getReturnValue().success;                        
            if (response != null) {
               	 component.set("v.objeciveId",response.getReturnValue());
                console.log(response); 
             	console.log(response.getReturnValue());
                  helper.objectiveCallSummaryFun(component);
                 //$A.get('e.force:refreshView').fire();
            }else{
              
            //  $A.get('e.force:refreshView').fire(); // refresh the component               
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
                $A.util.addClass(component.find("Spnner"), "slds-hide");
                var response = data.getReturnValue();
                //alert(response.RecordType.Name);
                    if ((response.RecordType.Name == 'Off-Premise') || (response.RecordType.Name == 'Chain Off-Premise')) {
                        component.set("v.isOffPrem", true);
                    } else {
                        component.set("v.isOffPrem", false);
                    }
                //Added this country logic as part of Gb-12202
                if(response.BillingCountry && (response.BillingCountry === "United Kingdom" || response.BillingCountry === "Ireland" || response.BillingCountry === "UK" || response.BillingCountry === "UKI")){
                    component.set("v.accCountry", 'UKI');
                }else if(response.BillingCountry && (response.BillingCountry === "United States" || response.BillingCountry === "US")){
                    component.set("v.accCountry", 'United States');
                }else if(response.BillingCountry && (response.BillingCountry === "Canada")){
                    component.set("v.accCountry", 'Canada');
                }
                     component.set('v.accId', response.Id);
                 if((response.RecordType.DeveloperName== $A.get("$Label.c.Sales_UKI_Account")) || (response.RecordType.DeveloperName== $A.get("$Label.c.Sales_CA_Account"))){
                        component.set('v.usObj', false);
                    }
                    else{
                        component.set('v.usObj', true);
                    }
                helper.getObjectives(component, event, helper);
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
      //  console.log('Ravi Test helper.js createUS --->');
        var action = component.get("c.getRecTypeId"); 
        	action.setParams({
            	"recordName": recrdtype
        	}); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            //alert(state);
            if (state === "SUCCESS") { 
               	component.set('v.newObj', true); 
                var RecTypeID = response.getReturnValue();
                
                helper.createComponent(component, event, helper,RecTypeID);
                       
            }else{
                
            }
        }); 
        $A.enqueueAction(action);
      
    },
    createComponent : function (component, event, helper,RecTypeID) {
        //alert(component.get("v.accId"));
      //  alert("Ravi New Objective Id"+v.accId);
       // console.log('Ravi Test helper.js createComponent --->');
       //alert(component.get("v.recordId"));
        var a = component.get("v.recordId");
       var createRecordEvent = $A.get("e.force:createRecord");
				createRecordEvent.setParams({
        			"entityApiName": "Objective__c",
                    "recordTypeId": RecTypeID,
                    "navigationLocation": "LOOKUP",
            		"defaultFieldValues": {
        				'Account__c' : component.get("v.accId"),
                        'C360_Country__c':component.get("v.accCountry"),
                        'Event_Id__c':a
    				}
                     
        		});
           
            var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
        	 createRecordEvent.fire();     
       		//alert('fired');
       
    },
    getObjectives : function (component, event, helper) {
        $A.util.removeClass(component.find("Spnner"), "slds-hide");
        var action = component.get('c.getAllRelatedObjRec');
        //alert(component.get("v.accId"));
        
        action.setParams({
            	"accId": component.get('v.accId')
        	});
        //setting up the value to page variable to display
        action.setCallback(this, function(data) {
            $A.util.addClass(component.find("Spnner"), "slds-hide");
	        //getting the state of response
    	    var state = data.getState(); 
            //alert(state);
            if(state === "SUCCESS"){
                //getting the response and storing variable
                var response = data.getReturnValue();
                //console.log(JSON.stringify(response));
                var allObjectives = [];
                if(response['AccActive']){
                	component.set('v.objRec', response['AccActive']);
                    (response['AccActive']).forEach(function loopObjs(item){
                        allObjectives.push(item);
                    });
                    
                    //console.log('Loop 1--'+JSON.stringify(allObjectives));
                }else{
                   component.set('v.objRec', []); 
                }
                if(response['AccUpcoming']){
                    component.set('v.objRecUpcoming', response['AccUpcoming']);
                    (response['AccUpcoming']).forEach(function loopObjs(item){
                        allObjectives.push(item);
                    });
                    
                    //console.log('Loop 2--'+JSON.stringify(allObjectives));
                }else{
                    component.set('v.objRecUpcoming', []);
                }
                if(response['UsrActive']){
                	component.set('v.objUsrActive', response['UsrActive']);
                    (response['UsrActive']).forEach(function loopObjs(item){
                        allObjectives.push(item);
                    });
                    
                    //console.log('Loop 3--'+JSON.stringify(allObjectives));
                }else{
                    component.set('v.objUsrActive', []);
                }
                if(response['UsrUpcoming']){
                    component.set('v.objUsrUpcoming', response['UsrUpcoming']);
                    (response['UsrUpcoming']).forEach(function loopObjs(item){
                        allObjectives.push(item);
                    });
                    
                    //console.log('Loop 4--'+JSON.stringify(allObjectives));
                }else{
                    component.set('v.objUsrUpcoming', []);
                }
                if(allObjectives){
                    component.set('v.combinedObjList', allObjectives);
                    //console.log(JSON.stringify(allObjectives));
                }else{
                    component.set('v.combinedObjList', []);
                }
                
                
            }
            else if(state === "ERROR"){
                //console.log(event.target.value);
                //console.log("Errors");
            }
        });
        $A.enqueueAction(action);
    },
    
    updateObjectiveClicked: function(component,event,helper){
        var action = component.get("c.updateObjectiveCheckbox");
        action.setParams({
            "evntId" : component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state === "SUCCESS"){
                
            }
            else if(state === "ERROR"){
                console.log('error');
            }
        });
        $A.enqueueAction(action); 
    },
    editObjectiveRecord:function(component,event,helper){
        
        var objId = event.getParam("selectedObjectiveId");
       
         
       
        //alert(event.getParam("sobjectedId")+'----'+event.getParam("isFromShowRelatedFilesCMP"));
       
            
        	$A.createComponent("c:CreateNewObjective",{
                        	"aura:id": "EditObjectiveRec",
               				 "recordId":objId
                            
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
})