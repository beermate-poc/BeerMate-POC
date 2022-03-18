({
    getStatusValues: function(component,event,helper){
        
        var action = component.get("c.objectiveStatusValues");
        
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state === "SUCCESS"){
                //alert('Server Call--');
                component.set("v.options",response.getReturnValue());
            }
            else if(state === "ERROR"){
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Unexpected Error on getting Status values. Please try reloading the page.");
                console.log('error');
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Unexpected Error on getting Status values. Please contact admin.");
            }
        });
        $A.enqueueAction(action); 
    },
	saveStatusChanges: function(component,event,helper){
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        component.set("v.ErrorMsg",'');
        console.log('Helper--'+JSON.stringify(Object.values(component.get("v.statusChangesMap"))));
        var action = component.get("c.saveStatusChanges");
        action.setParams({
            "eventId":component.get("v.eventId"),
            "objWithStatusMap" : Object.values(component.get("v.statusChangesMap"))
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            
            if(state === "SUCCESS"){
                let responseMessage = response.getReturnValue();
                console.log('responseMessage----'+responseMessage);
                if(responseMessage === "SUCCESS"){
                let mapStored = component.get("v.statusChangesMap");
                component.set("v.optionChanged",false);
                let objs = component.get("v.objRec");
                objs.forEach(function loopr(item){
                    //alert('Out if--'+mapStored[item.Id]);
                    if(mapStored[item.Id] && mapStored[item.Id].Status__c != item.Status__c){
                        item.Status__c = mapStored[item.Id].Status__c;
                    }
                    
                });
                				
                component.set("v.objRec",objs);
                
                component.set("v.statusChangesMap",{});
                }else if(responseMessage.startsWith('Summary Creation Failed')){
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    component.set("v.ErrorMsg",responseMessage);
                    component.set("v.optionChanged",false);
                }else if(responseMessage.startsWith('You cannot change the status')){
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    var validationErrorMsg = $A.get("$Label.c.Validation_Error_Msg");
                    component.set('v.ErrorMsg', validationErrorMsg);
                }
                else if(responseMessage.startsWith('Vous ne pouvez pas modifier')){
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    var frenchvalidationErrorMsg = $A.get("$Label.c.Validation_Error_Msg");
        component.set('v.ErrorMsg', frenchvalidationErrorMsg);
                }
                    else{                   
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    component.set("v.ErrorMsg",responseMessage);
                }                
            }
            else if(state === "ERROR"){
                component.set("v.optionChanged",false);
                component.set("v.statusChangesMap",{});
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg",responseMessage);
                console.log('error');
            }
        });
        $A.enqueueAction(action); 
    }
    
})