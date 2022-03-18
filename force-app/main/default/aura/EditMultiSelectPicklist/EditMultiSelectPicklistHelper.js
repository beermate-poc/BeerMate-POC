({
    fetchPickListVal: function(component,event, helper,fieldName) { 
        var action = component.get("c.getselectOptions");
        action.setParams({
            "objObject": {sobjectType : 'OpportunityLineItem'},
            "fld": fieldName
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                var options = allValues.map(record=>({label:record,value:record}));
                component.set("v.picklistOptsList", options);
                var opplineID = component.get("v.OppLineItemID");
                console.log('opplineID'+opplineID);
                if(opplineID !== 'undefined'){
                    helper.fetchselectval(component, opplineID);
                }
            }
        });
        $A.enqueueAction(action);
    },
    fetchselectval: function(component, opplineID) { 
        var action = component.get("c.fetchExecSupp");
        action.setParams({
            "OppLineItemID": opplineID
        });
        var opts = [];
        action.setCallback(this, function(response) {
            console.log('response.getState()'+response.getState());
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue(); 
                if(allValues.length != 0){
                    if (allValues[0].Execution_Support__c.includes(';')){
                        var optionlist = allValues[0].Execution_Support__c.split(';');                
                        component.set("v.selectedVal", optionlist);
                        component.set("v.ExecutionSupport",allValues[0].Execution_Support__c);
                    }
                    else if (allValues[0].Execution_Support__c.includes('Other')){
                        if(allValues[0].Execution_Support__c.includes('-')){
                        var optionlist = allValues[0].Execution_Support__c.split(/-(.+)/); 
                        var exec = optionlist[0].split(" ");
                        component.set("v.selectedVal", exec[0]); 
                        component.find("userinput").set("v.value",optionlist[1]);
                        component.set("v.ExecutionSupport",allValues[0].Execution_Support__c);
                        }
                        else
                        {
                            var optionlist = allValues[0].Execution_Support__c; 
                            console.log('optionlist'+optionlist);
                            component.set("v.selectedVal", optionlist);
                            component.set("v.ExecutionSupport",allValues[0].Execution_Support__c);
                        }
                    }
                        else
                        {
                            var optionlist = allValues[0].Execution_Support__c; 
                            console.log('optionlist'+optionlist);
                            component.set("v.selectedVal", optionlist);
                            component.set("v.ExecutionSupport",allValues[0].Execution_Support__c);
                        }
                }
            }
        });
        $A.enqueueAction(action);
    }
})