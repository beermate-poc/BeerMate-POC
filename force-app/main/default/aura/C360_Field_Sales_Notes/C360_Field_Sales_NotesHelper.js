({
	fetchFeildSales : function(component, event, helper) {
       var record = component.get("v.recordId");
        var action = component.get("c.fetchFieldSalesNotesValue");
        action.setParams({"recordId" : record });
    	action.setCallback(this, function(response) {
         component.set("{!v.fieldSales}",response.getReturnValue());   
        });
        $A.enqueueAction(action);
		
	},
    checkC360User : function(component, event, helper) {
        helper.showSpinner(component);
        var action = component.get("c.checkC360Profile");
        action.setCallback(this, function(response) {
          var state = response.getState();
            helper.hideSpinner(component);
            if (state === "SUCCESS" && response.getReturnValue() == false ) 
            {
         	component.set("{!v.isC360User}",false);
            }
            
		 });
        $A.enqueueAction(action);
    },
    showSpinner:function(component){
  	component.set("v.IsSpinner",true);
},
	hideSpinner:function(component){
  	component.set("v.IsSpinner",false);
	}    
    })