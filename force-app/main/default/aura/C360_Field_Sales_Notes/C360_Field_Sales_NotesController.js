({
  doInit: function(component, event, helper) {
     
     helper.checkC360User(component, event, helper);
   	 helper.fetchFeildSales(component, event, helper);
      },
   cancelClick: function(component, event, helper) {
 // Close the action panel
        var dismissActionPanel = $A.get("e.force:closeQuickAction");
        dismissActionPanel.fire();
    },
    saveClick: function(component, event, helper) {
        var fieldSalesNotes1 = component.get("v.fieldSales");
        var record = component.get("v.recordId");
        
        var action = component.get("c.saveAccount");
        action.setParams({ "fieldSalesNotes1" : fieldSalesNotes1,"recordId" : record });
    action.setCallback(this, function(response) {
            
            if(response.getReturnValue() != 'Success'){
              component.set("{!v.errorMessage}",response.getReturnValue());
              component.set("{!v.errorMessageCheck}","True");
            }else{
                var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
            }    
        });
        
        $A.enqueueAction(action);
        
        
    }
    
    
})