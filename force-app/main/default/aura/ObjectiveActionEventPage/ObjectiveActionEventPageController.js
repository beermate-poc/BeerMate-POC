({
	/**this method is caled on load of the page**/
    doInit : function(component, event, helper) {
        //alert('Again')
        $A.util.removeClass(component.find("Spnner"), "slds-hide");

        var pageReference = component.get("v.pageReference");
        if(pageReference){
        
            component.set("v.recordId",pageReference.state.c__evntId);
        }
        var evtId =component.get("v.recordId");
        
        //getting the list of objective records from apex controller's method 
        helper.getAcc(component, event, helper,evtId);
        helper.updateObjectiveClicked(component,event,helper);
		 
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
        //helper.createUS(component, event, helper,'Personal Objective',true);
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
    hNewRecord : function (component, event,helper) {
        helper.createUS(component, event, helper,'Personal Objective');
        /*
        var evt = $A.get("e.force:navigateToComponent");
        var recordId = component.get("v.recordId");
        evt.setParams({
            componentDef  : "c:C360_NewObjective" ,
            componentAttributes : { 
                recId : recordId
            }
        });
        evt.fire();*/
    },    
     
    editClick : function (component, event,helper) {
         helper.editObjectiveRecord(component,event,helper);
        /*
        var objId = event.getParam("selectedObjectiveId");
        //var objId = event.target.getAttribute("data-key");
		var objrecs = component.get("v.combinedObjList");
        //alert('isOffPrem-----'+component.get("v.isOffPrem"));
        component.set('v.objeciveId', objId);
        component.set('v.newObj', false);
        console.log(objId);
        
        var editRecordEvent = $A.get("e.force:editRecord");
        editRecordEvent.setParams({     
                    "recordId": objId
            			
        });
        
        editRecordEvent.fire();*/
        

    },
    navigateTosellingstoryLink : function(component, event, helper) {
        var device = $A.get("$Browser.formFactor");
        var key =event.getParam("externalKey");
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
    reInit : function(component, event, helper) {
 			$A.get('e.force:refreshView').fire();
	},
        
    saveSuccessHandle : function(component, event,helper) { // call method upon save record
        var objeciveIdValue = component.get("v.objeciveId");
        var a =JSON.parse(JSON.stringify(event.getParams()));
       // alert(a.messageTemplate); 
        var Objname ='';
        if(a != undefined && a.messageTemplate != undefined && a.messageTemplate !== ""){
            if( a.messageTemplate.toLowerCase().indexOf('created')  > 1){
           		 $A.get('e.force:refreshView').fire();
        	} 
        }
        
    },
    getUpcomingObj:function(component,event,helper){
        var checkCmp = component.find("tglUpcomingbtn").get("v.checked");
        
        if(checkCmp){
            component.set("v.showUpcoming",checkCmp);
            //alert('In progress!');
        }else{
            component.set("v.showUpcoming",checkCmp);
            //$A.get('e.force:refreshView').fire();
        }
        
    },
    /*
    updateObjectivesList : function (component, event) {
        var objList = event.getParam("updatedObjList");
        var tableName = event.getParam("typeOfTable");
        if(tableName == $A.get("$Label.c.Assigned_to_Account_Upcoming")){
            component.set("v.objRecUpcoming",objList);
        }else if(tableName == $A.get("$Label.c.Assigned_to_me_Upcoming")){
            component.set("v.objUsrUpcoming",objList);
        }else if(tableName == $A.get("$Label.c.Assigned_to_Account_Active")){
            alert(JSON.stringify(objList));
            component.set("v.objRec",objList);
            alert(JSON.stringify(component.get("v.objRec")));
        }else if(tableName == $A.get("$Label.c.Assigned_to_me_Active")){
            component.set("v.objUsrActive",objList);
        }

    }*/
    showFilesSection:function(component,event,helper){
        //alert(event.getParam("sobjectedId")+'----'+event.getParam("isFromShowRelatedFilesCMP"));
        if(event.getParam("isFromShowRelatedFilesCMP")){
            component.set("v.isEdit",false);
            component.set("v.body", []);
        }else{
            
        	$A.createComponent("c:ShowRelatedFilesList",{
                        	"aura:id": "ShowRelatedList",
                        	"sObjectId" : event.getParam("sobjectedId"),
                			"eventId" : component.get("v.recordId"),
                            "contentDocs" : []
                            
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
            $A.get('e.force:refreshView').fire();
            //alert('Rest  '+savedObjective.Id);
            
            $A.util.addClass(component.find("Spnner"), "slds-hide");
            if(savedObjective && savedObjective.Id){
                component.set('v.objeciveId', savedObjective.Id);
                helper.objectiveCallSummaryFun(component);
            }
        }
        
        
    },
    
    refershComponent : function(component, event, helper) {
        //var spinner = component.find("Spnner");
        console.log('Event Fired');
        var savedObjective = event.getParam("selectedObjectiveId");
        var isSaved = event.getParam("isSaved");
        console.log(isSaved);
        
            $A.util.removeClass(component.find("Spnner"), "slds-hide");
            //alert();
            component.set("v.isEdit",false);
            component.set("v.body", []);
            $A.get('e.force:refreshView').fire();            
            $A.util.addClass(component.find("Spnner"), "slds-hide");
           
               
                component.set('v.objeciveId', savedObjective);
                if(isSaved== true){
                    helper.objectiveCallSummaryFun(component);
                }
    },
    handleClick: function(component, event, helper) {
        var navService = component.find("navService");
        var pageReference = {
            type: 'standard__component',
            attributes: {
                "componentName": "c__ObjectiveActionEventPage"
            },    
            state: {
                "c__evntId": component.get("v.recordId")       
            }
        };
        component.set("v.pageReference", pageReference);
        
        event.preventDefault();
        navService.generateUrl(pageReference)
            .then($A.getCallback(function(url) {
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                  "url": url
                });
                urlEvent.fire();
                //window.open(url, '_blank');
            }), $A.getCallback(function(error) {
               
            }));
        // Uses the pageReference definition in the init handler
        //var pageReference = component.get("v.pageReference");
        
        //navService.navigate(pageReference);
    }

    
})