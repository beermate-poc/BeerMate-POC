({
	myAction : function(component, event, helper) {
		
	},
    save : function(component, event, helper) {
        component.find("edit").get("e.recordSave").fire();
        
    },
    handleSaveSuccess : function(component, event, helper) {
       // component.find("edit").get("e.recordSave").fire();
       helper.resetPage(component, event, helper) ;
        
    },
    cancel : function(component, event, helper) {
        
 		helper.cancelPage(component, event, helper) ;        
    },
    
})