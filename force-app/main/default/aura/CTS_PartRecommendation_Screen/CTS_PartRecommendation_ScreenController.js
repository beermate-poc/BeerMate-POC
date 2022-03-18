({
    /** Client-side Controller **/
    doInit : function(component, event, helper) {
        // REset Values
        $A.util.removeClass(component.find("Id_spinner"), "slds-hide");
        component.set("v.displayMessage","");
        component.set("v.Message",false);
        component.set("v.partsMap","");            
        component.set("v.displayResult",[]);
        component.set("v.newtaskinfo","");
        component.set("v.errorMsg","");
        $A.util.addClass(component.find("ErrorMsg"), "slds-hide");
        //Get Values from Parent cmp
        var params = event.getParam('arguments');
        if (params) {
            
            var oldTask = params.oldtaskparam;
            var taskId = params.taskId;
            var isOnPart = params.isOnPart;
            //console.log('--by aura method--'+oldTask+'===Id==='+taskId);
            component.set("v.isOnParts",isOnPart);
			        
        // show spinner messag
        //component.find("Id_spinner").set("v.class" , 'slds-show');
        	var oldwol;
            if(oldTask != null && oldTask.Id != null){
                oldwol = oldTask;
                
                oldwol.CTS_Brand_IN__r = null;
                oldwol.CTS_Brand_OUT__r = null;
                oldwol.CEA_Destination_Location__r = null;
                oldwol.CEA_Part_Item__r = null;
                oldwol.CEA_Product__r = null;
                component.set("v.oldtaskinfo",oldwol);
            }
            
        //alert('old task from screen cmp json'+JSON.stringify(oldwol));
        //alert('old task from screen cmp'+JSON.stringify(component.get("v.oldtaskinfo")));
        if(taskId != null && taskId != undefined){
        var action = component.get("c.recommedTaskSpecificParts");
        action.setParams({
            //'newTaskStr': JSON.stringify(wol),
            'oldTaskStr': JSON.stringify(oldwol),
            'isONParts': component.get("v.isOnParts"),
            'taskId': taskId
        });
        action.setCallback(this, function(response) {
           // hide spinner when response coming from server 
            $A.util.addClass(component.find("Id_spinner"), "slds-hide");
            var stateValue = response.getState();
            //alert("State+=="+stateValue);
            if (stateValue === "SUCCESS") {
                var returnvalue = response.getReturnValue();
                if(returnvalue == "Success"){
                    
                    if(!isOnPart){
                        helper.getSelectedProducts(component, event, helper,false);
                    }
                    
                }else if(returnvalue == "No Parts For This Type"){
                    component.set("v.displayMessage","No parts found for this Task!");
                    component.set("v.Message",true);
                }else if(returnvalue.startsWith("Error")){
                    
                    	if((component.get("v.isOnParts"))){
                            
                            component.set("v.errorMsg",returnvalue);
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                        }else{
                            /*var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                            //Set event attribute value
                            cmponErrorEvent.setParams({"ErrorMsg":returnvalue});
                            cmponErrorEvent.fire();*/
                            var evnT = $A.get("event.force:showToast");
                            evnT.setParams({
                                "title":"Parts:",
                                "message":returnvalue,
                                "type":"error",
                                "mode":"sticky"
                                
                            });
                            evnT.fire();
                        }
                }else{
                    var storeResponse = JSON.parse(returnvalue);
                    component.set("v.partsMap",storeResponse.newTaskPartsMap);
                    var listOfParts = (storeResponse.newTaskPartsMap)['Add'];
                    //alert("Add="+JSON.stringify(listOfParts));
                    //alert("Remove="+JSON.stringify(storeResponse.newTaskPartsMap['Remove']));
                    if(listOfParts != null && listOfParts != undefined){
                        
                        listOfParts.forEach(function(item){
                            if(item.ProductName){
                               item.ProductName = item.ProductName; 
                            }else{
                                item.ProductName = item.CTS_Product_Name__c
                            }
                            //alert('inside loop=='+item.ProductName);
                            
                            //resultList.push(obj);
                        });
                        
                        component.set("v.displayResult",listOfParts);
                        
                    }else{
                        component.set("v.displayMessage","No parts found for this Task!");
                    	component.set("v.Message",true);
                    }
                    component.set("v.newtaskinfo",storeResponse.wol);
                    //alert('newtask from apex===='+storeResponse.wol+JSON.stringify(component.get("v.newtaskinfo")));
                    component.set("v.workOrderId",storeResponse.workOrderId);
                    //alert(response.getReturnValue());
                }
                $A.util.addClass(component.find("Id_spinner"), "slds-hide");
            }else if (stateValue === "INCOMPLETE") {
                 if((component.get("v.isOnParts"))){
                        component.set("v.errorMsg","Response is Incomplete. Please Contact Admin.");
                        $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    }else{
                        var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                        //Set event attribute value
                        cmponErrorEvent.setParams({"ErrorMsg":"Response is Incomplete. Please Contact Admin."});
                        cmponErrorEvent.fire();
                    }
            }else if (stateValue === "ERROR") {
                var errors = response.getError();
                
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        if((component.get("v.isOnParts"))){
                            console.log("Error message: " + errors[0].message);
                            component.set("v.errorMsg",errors[0].message);
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                        }else{
                            var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                            //Set event attribute value
                            cmponErrorEvent.setParams({"ErrorMsg":errors[0].message});
                            cmponErrorEvent.fire();
                        }                       
                    }
                } else {
                    if((component.get("v.isOnParts"))){
                            
                            component.set("v.errorMsg","Unknown Error Occured. Please contact Admin.");
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                        }else{
                            var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                            //Set event attribute value
                            cmponErrorEvent.setParams({"ErrorMsg":"Unknown Error Occured. Please contact Admin."});
                            cmponErrorEvent.fire();
                        }
                }
            }
        });
        $A.enqueueAction(action);
        }
        }
    },
    processResult : function(component, event, helper) {
        $A.util.removeClass(component.find("Id_spinner"), "slds-hide");
        var params = event.getParam('arguments');
        if (params) {
            
            var isSaveAndNew = params.isSaveAndNew;
        }
        helper.getSelectedProducts(component, event, helper,isSaveAndNew);
        
    },
    hideErrorOnLoad : function(component, event, helper) {
    	component.set("v.errorMsg","");
        $A.util.addClass(component.find("ErrorMsg"), "slds-hide");
	},
    resetIsOnParts : function(component, event, helper) {
        var params = event.getParam('arguments');
        if (params) {
            
            var onBackToTaskPage = params.onBackToTaskPage;
        }
        if(onBackToTaskPage){
    		component.set("v.isOnParts",false);
        }else{
            component.set("v.isOnParts",true);
        }
        
	}
})