({
	getWorkOrderLineItems : function(component, helper) {
    	var action = component.get("c.getWorkOrderLineItems");
        var wolReference = component.get("v.wolReference");
        action.setParams({"WOLReference":wolReference})
        action.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //console.log(response.getReturnValue());  // <-- Works as expected...  
                var result = response.getReturnValue();
                if((!$A.util.isEmpty(result) && !$A.util.isUndefined(result)))
                {
                    $A.util.removeClass(component.find("tasktable"),"slds-hide");
                    /*
                    var cols = [
                        {label: 'Task', fieldName: 'LineItemNumber', type: 'Number',initialWidth:100},
                        {label: 'Brand IN', fieldName: 'CTS_Brand_IN_Name__c', type: 'text',initialWidth:200},
                        {label: 'Brand Display IN', fieldName: 'CTS_Brand_Display_IN__c', type: 'text',initialWidth:200},
                        {label: 'Brand Dispense IN', fieldName: 'CTS_Brand_Dispense_IN__c', type: 'text',initialWidth:200},
                        {label: 'Handle Type', fieldName: 'CTS_Handle_Type__c', type: 'text',initialWidth:200},
                        {label: 'Component IN', fieldName: 'CTS_Component_IN__c', type: 'text',initialWidth:200},
                        {label: 'Component Sub Type IN', fieldName: 'CTS_Component_Sub_Type_IN__c', type: 'text',initialWidth:200},
                        {label: 'Quantity', fieldName: 'CTS_Quantity__c', type: 'text',initialWidth:200}
                        
                        
                    ];
                    component.set("v.columns", cols);
                    */
                	component.set("v.data", response.getReturnValue());
                }else
                {
                    $A.util.addClass(component.find("tasktable"),"slds-hide");
                	$A.util.removeClass(component.find("tasktableNoRec"),"slds-hide");
                }
            }
        }));
        if((!$A.util.isEmpty(wolReference) && !$A.util.isUndefined(wolReference)))
        {
        	$A.enqueueAction(action);
        }else
        {
            $A.util.addClass(component.find("tasktable"),"slds-hide");
            $A.util.removeClass(component.find("tasktableNoRec"),"slds-hide");
        }
	}
})