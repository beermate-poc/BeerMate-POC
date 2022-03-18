({    
    doInit: function(component, event, helper) { 
        helper.fetchPickListVal(component,event,helper,'Execution_Support__c');
    },
    
    addPickListValue: function (component, event, helper) {
        var PicklistValue = component.get('v.selectedVal');
        if(PicklistValue.includes("Other")){
            var selectedsupport = PicklistValue[0];
            component.set("v.selectedVal","Other");
            component.set("v.objOpp.Execution_Support__c","Other");
            component.set("v.ExecutionSupport","Other");
        }
        else{
            var text = '';
            if (PicklistValue.length > 0) {
                for (var i = 0; i < PicklistValue.length; i++) {
                    if (i == 0) {
                        text = PicklistValue[i];
                    }
                    else {
                        text = text + ';' + PicklistValue[i];
                    }
                }
            }
            
            var selectedsupport = text;
            component.set("v.objOpp.Execution_Support__c",selectedsupport);
            component.set("v.ExecutionSupport",selectedsupport);
            console.log('selectedVal'+component.get("v.ExecutionSupport"));
        }},
    
    changeinput: function (component, event, helper) {
        var currentText = event.getSource().get("v.value");
        var text = '';
        var PicklistSel = component.get('v.selectedVal'); 
        if(currentText !== null && currentText !== '') {
            text= PicklistSel + ' - ' + currentText;
        }
        else 
        {
            text= PicklistSel;
        }
        var selectedsupport = text;
        component.set("v.objOpp.Execution_Support__c",selectedsupport);
        component.set("v.ExecutionSupport",selectedsupport);
    }
    
})