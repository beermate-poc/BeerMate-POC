({
    /** Client-side Controller **/
    doInit : function(component, event, helper) {
        component.set("v.searchResult", []);
        component.set("v.TotalNumberOfRecord",0);
        component.set("v.searchKeyword","");
    },
    // For count the selected checkboxes. 
	checkboxSelect: function(component, event, helper) {
        // get the selected checkbox value
        
        var selectedRec = event.getSource().get("v.checked");
        var selectedRowId = event.getSource().get("v.name");
        var getAllQty = component.find("Quant");
        //alert(selectedRowId);
        //alert("Checked: "+selectedRec);
        if (selectedRec == false) {
 
            for (var j = 0; j < getAllQty.length; j++) {
                    
                    if(getAllQty[j].get("v.name") == selectedRowId)
                    {
                        getAllQty[j].set("v.value","");
                    }
                    //alert("Test"+selectedQuantity);
                }
        }else if(selectedRec == true)
        {
            for (var j = 0; j < getAllQty.length; j++) {
                    
                    if(getAllQty[j].get("v.name") == selectedRowId)
                    {
                        getAllQty[j].set("v.value",1);
                    }
                    //alert("Record ID "+getAllQty[j].get("v.name") +'==='+selectedRowId );
                }
        }
   
	},
    
    getSelectedProducts: function(component, event, helper) {
    	// create var for store record id's for selected checkboxes  
    	
        var selectedQuantity = [];
    	// get all checkboxes 
    	var getAllId = component.find("selectedProduct");
        var getAllQty = component.find("Quant");
        var error = false;
        for (var i = 0; i < getAllId.length; i++) {
            if (getAllId[i].get("v.checked") == true) {
                for (var j = 0; j < getAllQty.length; j++) {
                    
                    if(getAllId[i].get("v.name") == getAllQty[j].get("v.name"))
                    {
                        if(getAllQty[j].get("v.value") > 0){
                            //alert("Cmp-----"+getAllQty[j].get("v.value")+"text--"+getAllId[i].get("v.name"));
                            selectedQuantity.push(getAllQty[j].get("v.value")+"_"+getAllId[i].get("v.name"));
                        }else{
                            error = true;
                        }
                    }
                    //alert("Test"+selectedQuantity);
                }
                
            }
        }
        
        //alert('selectedQuantity--->'+selectedQuantity);
        if(!error){
        	helper.savePartOrders(component, event,selectedQuantity);
        }else{
           component.set("v.Message", true);
           component.set("v.errorMsg", "Please add a valid quantity value to the selected products."); 
        }
   		
	},
    
    Search: function(component, event, helper) {
        var searchField = component.find('searchField');
        var isValueMissing = searchField.get('v.validity').valueMissing;
        var novaluefound = false;
        if(!component.get("v.searchKeyword")){
            novaluefound = true;
        }
        // if value is missing show error message and focus on field
        if(isValueMissing || novaluefound) {
            searchField.showHelpMessageIfInvalid();
            searchField.focus();
        }else{
          // else call helper function 
            helper.SearchHelper(component, event);
        }
    },
    
    handleCancel: function(component, event, helper){
        //$A.util.removeClass(component.get("v.overlayLib"),'slds-modal__container');
        /*component.get("v.overlayLib").then(
    	function (modal) {
        	modal.close();
    	});*/
        //component.find("v.overlayLib").notifyClose();
        $A.get("e.force:closeQuickAction").fire();
    }
})