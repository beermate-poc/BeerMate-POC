({   
    getUser : function(component, event, helper) {
       	helper.fetchProfile(component, event, helper);
        //alert(component.get("v.currentUserProfileName"));
    },
    
    getProductsList :function(component, event, helper){
        
        helper.fetchProducts(component, event, helper);
        
    },
    handleExit : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire() 
    },
    handleConfirmDialog : function(component, event, helper) {
        var productsToDelete = component.find("deleteProduct");
        //alert(productsToDelete.length);
        var validateLengthFlag = 0;
        if(productsToDelete.length!=undefined)
        {
            for(var i=0;i<productsToDelete.length;i++) {
                // If product has delete checkbox checked, set flag as 1
                if(productsToDelete[i].get("v.checked"))            
                    validateLengthFlag = 1;
            }
        }
        else
        {
            if(productsToDelete.get("v.checked"))            
                validateLengthFlag = 1;
        }
        if(validateLengthFlag === 0)
        {
            alert('You must select atleast one product to delete');
            return false;
        }
        var selectedEventId = event.target.id;
        var msg ="Are you sure you want to delete the item(s)?";
        if (!confirm(msg)) {
            console.log('No');
            return false;
        } else {
            console.log('Yes');
            helper.removeProducts(component, event, helper);
        }
      }
})