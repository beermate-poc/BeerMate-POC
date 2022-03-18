({
	/**this method is caled on load of the page**/
    doInit : function(component, event, helper) {
        //alert('Again')
        $A.util.removeClass(component.find("Spnner"), "slds-hide");
        var evtId =component.get("v.recordId");
        //getting the list of objective records from apex controller's method 
        helper.getAcc(component, event, helper,evtId);
		var action = component.get('c.getRelatedObjRec');
        //alert(component.get("v.recordId"));
        // pass the all selected record's Id's to apex method 
        action.setParams({
            "evntId" : component.get("v.recordId")
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
                if(response.length>0){
                    if((response[0].Account__r.RecordType.DeveloperName== $A.get("$Label.c.Sales_UKI_Account")) || (response[0].Account__r.RecordType.DeveloperName== $A.get("$Label.c.Sales_CA_Account"))){
                        component.set('v.usObj', false);
                    }
                    else{
                        component.set('v.usObj', true);
                    }
                }
                
                //setting response to objRec
                component.set('v.objRec', response);
                // alert(response.length);
                
            }
            else if(state === "ERROR"){
                //console.log(event.target.value);
                //console.log("Errors");
            }
        });
        $A.enqueueAction(action); 
	},
    /**this give the selected record id **/
    handleClick : function (component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": event.target.getAttribute("data-key")
        });
        navEvt.fire();
    },
    /**create method called on click of new button**/
    hCreateRec : function (component, event, helper) {
        var action = component.get("c.getAccId"); 
        	action.setParams({
            	"Ids": component.get("v.recordId")
        	}); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") { 
                var acnt = response.getReturnValue();
                component.set("v.accId",acnt);
                //var windowHash = window.location.hash;
                var createRecordEvent = $A.get("e.force:createRecord");
				createRecordEvent.setParams({
        			"entityApiName": "Objective__c",
                    //"recordTypeId": RecTypeID,
            		"defaultFieldValues": {
        				'Account__c' : component.get("v.accId"),
                        /*"panelOnDestroyCallback": function(event) {
            				window.location.hash = windowHash;
        				}*/
                		//'RecordTypeId' : component.get("v.recTypeIds")
    				}
        		});
                  //var evnt = component.getEvent("sampleComponentEvent");
                //evnt.fire();
        	createRecordEvent.fire();
                
                /*setTimeout(function(){
				 $A.get('e.force:refreshView').fire(); 
			}, 45000);*/
              
                  
            } 
        });
    	$A.enqueueAction(action);
    },
    /**cancel method called on click of cancel button**/
    hCancel : function (component, event) {
    	var recordId = component.get("v.recordId");
        var redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
          "recordId": recordId,
          "slideDevName": "related"
        });
        redirect.fire();
    }, 
    hNewRecord : function (component, event) {
        var evt = $A.get("e.force:navigateToComponent");
        var recordId = component.get("v.recordId");
        evt.setParams({
            componentDef  : "c:C360_NewObjective" ,
            componentAttributes : { 
                recId : recordId
            }
        });
        evt.fire();
    },    
     
    editClick : function (component, event) {
        var objId = event.target.getAttribute("data-key");
		var objrecs = component.get("v.objRec");
        //alert('isOffPrem-----'+component.get("v.isOffPrem"));
        component.set('v.objeciveId', event.target.getAttribute("data-key"));
        objrecs.forEach(function loopObjs(item){
            if(item.Id == objId){
                if(item.RecordType.Name == 'Engagement' || item.RecordType.Name == 'Feature' || item.RecordType.Name == 'Display' || item.RecordType.Name == 'Merchandise' ){
                    component.set('v.newObj', true);
                    var objList=[];
                    objList.push(item);
                    //alert('From List cmp line 124 '+component.get("v.isOffPrem"));
                    $A.createComponent("c:ObjectivesCreate_EditView",{
                        	"aura:id": "editMode",
                        	"objectives" : objList,
                            "isOffPrem" : component.get("v.isOffPrem"),
                            "accountId" : item.Account__c,
              
                            "EventId" : component.get("v.recordId")
                    } ,
                           function( components,status, errorMessage){
                               if (status === "SUCCESS") {
                                   $A.util.removeClass(component.find("Spnner"), "slds-hide");
                                   //alert('Body1');
                                   var body = component.get("v.body");
                                   //alert('Body2');
                                   body.push(components);
                                   component.set("v.body", body);
                                   window.setTimeout(
                                        $A.getCallback(function() {
                                            $A.util.addClass(component.find("Spnner"), "slds-hide");
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
                    
                }else if(item.RecordType.Name == 'Placement'){
                    component.set('v.newObj', true);
                    var objList=[];
                    objList.push(item);
                    $A.createComponent("c:PlacementCreate_EditView",{
                        	"aura:id": "editMode",
                        	"objectives" : objList,
                            "isOffPrem" : component.get("v.isOffPrem"),
                            "accountId" : item.Account__c,
              
                            "EventId" : component.get("v.recordId")
                    } ,
                           function( components,status, errorMessage){
                               if (status === "SUCCESS") {
                                   $A.util.removeClass(component.find("Spnner"), "slds-hide");
                                   //alert('Body1');
                                   var body = component.get("v.body");
                                   //alert('Body2');
                                   body.push(components);
                                   component.set("v.body", body);
                                   window.setTimeout(
                                        $A.getCallback(function() {
                                            $A.util.addClass(component.find("Spnner"), "slds-hide");
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
                    component.set('v.newObj', false);
                    var editRecordEvent = $A.get("e.force:editRecord");
                    editRecordEvent.setParams({
                         "recordId": event.target.getAttribute("data-key")
                   });
                    editRecordEvent.fire();
                }
            }
        });        
        

    },
    navigateTosellingstoryLink : function(component, event, helper) {
        var device = $A.get("$Browser.formFactor");
        var key =event.getSource().get("v.value");
        if(device=='DESKTOP'){
          var surv =$A.get("$Label.c.GS_Selling_Story_Browser");  
        }else{
          var surv =$A.get("$Label.c.GS_Selling_Story");  
        }
        var recordId = component.get("v.recordId");
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": surv+key
        });
        urlEvent.fire();  
    },
    handleObjectiveMenuClick : function(component, event, helper) {
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    newDisplay: function (component, event, helper) {
        component.set('v.recordName', 'Display');
        //component.set('v.showNewDisplay', true);
        var recrdtype=component.get('v.recordName');
        helper.createUS(component, event, helper,recrdtype);
        component.set('v.newObj', true);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    newFeature: function (component, event, helper) {
        //component.set('v.showNewFeature', true);
        component.set('v.recordName', 'Feature');
        var recrdtype=component.get('v.recordName');
        helper.createUS(component, event, helper,recrdtype);
        component.set('v.newObj', true);
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    newEngagement: function (component, event, helper) {
        // this.hCreateRec(component, event, helper);
        //  component.set('v.showNewEngagement', true);
        component.set('v.newObj', true);
        component.set('v.recordName', 'Engagement');
        var recrdtype=component.get('v.recordName');
        helper.createUS(component, event, helper,recrdtype);
        
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    newPlacement: function (component, event, helper) {
       // component.set('v.showNewPlacement', true);
       component.set('v.newObj', true);
       
      component.set('v.recordName', 'Placement');
        var recrdtype=component.get('v.recordName');
        helper.createUS(component, event, helper,recrdtype);
           helper.toggleObjectiveDropdown(component, event, helper);
    },
    newSpace: function (component, event, helper) {
        //component.set('v.showNewSpace', true);
       component.set('v.newObj', true);
       
       component.set('v.recordName', 'Space');
        var recrdtype=component.get('v.recordName');
        /* Commented below lines as part of Gb-10486
        helper.createUS(component, event, helper,recrdtype);
        helper.toggleObjectiveDropdown(component, event, helper);
        */
    },
    newMerchandise: function (component, event, helper) {
     //   component.set('v.showNewMerchandise', true);
      component.set('v.newObj', true);
      component.set('v.recordName', 'Merchandise');
        var recrdtype=component.get('v.recordName');
        helper.createUS(component, event, helper,recrdtype);
         
        helper.toggleObjectiveDropdown(component, event, helper);
    },
    
    saveSuccessHandle : function(component, event,helper) { // call method upon save record
       // alert('Inside Save Success'); 
        var objeciveIdValue = component.get("v.objeciveId");
       // alert(objeciveIdValue);
        var newObj = component.get("v.newObj");
        //alert('newObj'+newObj);

       if (objeciveIdValue != '' && !newObj){ 
        //if (objeciveIdValue != ''){ // call this method only objective id not equal string 
        	helper.objectiveCallSummaryFun(component);
    	}
    },
    resetEditComponent : function(component, event, helper) {
        //var spinner = component.find("Spnner");
        
        var savedObjective = event.getParam("savedObjective");
        var reset = event.getParam("ResetEditPage");
        var isCreate = event.getParam("isCreate");
        if(reset){
            $A.util.removeClass(component.find("Spnner"), "slds-hide");
            //alert();
            component.set("v.isEdit",false);
            component.set("v.body", []);
            //alert('Rest  '+savedObjective.Id);
            if((!isCreate) && savedObjective && savedObjective.Id){
                var obList = component.get("v.objRec");
                component.set("v.objRec",[]);
                obList.forEach(function callback(obj){
                    
                    if(obj.Id == savedObjective.Id){
                        //alert('Obj  '+obj.Name);
                        //obj = savedObjective;
                        if(savedObjective.Name){
                            obj.Name = savedObjective.Name;
                        }
                        obj.Status__c = savedObjective.Status__c;
                        obj.C360_Execution_Type__c = savedObjective.C360_Execution_Type__c;
                        if(savedObjective.End_Time__c){
                            obj.End_Time__c = savedObjective.End_Time__c;
                        }
                        //alert('Obj  '+obj.Name);
                    }
                });
                setTimeout(
                    $A.getCallback(function() {
                        component.set("v.objRec",obList);
                        $A.get('e.force:refreshView').fire(); // refresh the component
                    }), 1100);
            }else if(isCreate){
                //alert(savedObjective.Id);
                var obList2 = component.get("v.objRec");
                component.set("v.objRec",[]);
                if(savedObjective && savedObjective.Id){
                    var nobj = {
                        "Id" : savedObjective.Id,
                        "Name":savedObjective.Name,
                        "Status__c":savedObjective.Status__c,
                        "RecordType":{"Name":savedObjective.RecordtypeName},
                        
                    };
                    if(savedObjective.End_Time__c){
                            nobj.End_Time__c = savedObjective.End_Time__c;
                    }
                    obList2.push(nobj);
                    
                }
                setTimeout(
                    $A.getCallback(function() {
                        component.set("v.objRec",obList2);
                        $A.get('e.force:refreshView').fire(); // refresh the component
                    }), 1100);
            }
            $A.util.addClass(component.find("Spnner"), "slds-hide");
            if(savedObjective && savedObjective.Id){
                component.set('v.objeciveId', savedObjective.Id);
                helper.objectiveCallSummaryFun(component);
            }
        }
        
        
    }
    
})