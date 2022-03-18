({  
    fetchProfile : function(component, event, helper) {
        var action = component.get("c.fetchUser");
        //var profileNameGlobal;
        action.setCallback(this, function(response) {
            var state = response.getState();
            var profilename = response.getReturnValue();
 			//component.set("v.currentUserProfileName", profilename);
            //alert('profile name:' + profilename);
            if (profilename === "Data - Read Only") {
             alert('This function is not available for your profile.'); 
             $A.get("e.force:closeQuickAction").fire();

            }
           });
        // Adding the action variable to the global action queue
        $A.enqueueAction(action);
       
    },
    
    fetchProducts : function(component, event, helper) {
        // Assign server method to action variable
        var action = component.get("c.getProductList");
        // Getting the account id from page
        var opportunityId = component.get("v.recordId");
        // Setting parameters for server method
        action.setParams({
            opportunityIds: opportunityId
        });
        // Callback function to get the response
        action.setCallback(this, function(response) {
            // Getting the response state
            var state = response.getState();
            // Check if response state is success
            
            if(state === 'SUCCESS') {
                // Getting the list of products from response and storing in js variable
                var productList = response.getReturnValue();
                // Set the list attribute in component with the value returned by function
                component.set("v.productList",productList);
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }
        });
        // Adding the action variable to the global action queue
        $A.enqueueAction(action);
    },
    removeProducts: function(component, event, helper) {
        // Getting the deleteProduct Component
        var productsToDelete = component.find("deleteProduct");
        // Initialize an empty array
        var idsToDelete = [];
        // Checking if productsToDelete is an array
        if(productsToDelete.length!=undefined) {
            // Iterating the array to get product ids
            for(var i=0;i<productsToDelete.length;i++) {
                // If product has delete checkbox checked, add product id to list of ids to delete
                if(productsToDelete[i].get("v.checked"))            
                    idsToDelete.push(productsToDelete[i].get("v.value"));
            }            
        } else {
            // if productsToDelete is not an array but single object, 
            // check if delete checkbox is checked and push id to list of ids to delete
            if(productsToDelete.get("v.checked"))            
                idsToDelete.push(productsToDelete.get("v.value"));            
        }
        // Initializing the toast event to show toast
        var toastEvent = $A.get('e.force:showToast');
        // Defining the action to delete product List ( will call the deleteProductList apex controller )
        var deleteAction = component.get('c.deleteProductList');
        // setting the params to be passed to apex controller
        deleteAction.setParams({
            productIds: idsToDelete
        });
        // callback action on getting the response from server
        deleteAction.setCallback(this, function(response) {
            // Getting the state from response
            var state = response.getState();
            if(state === 'SUCCESS') {
                // Getting the response from server
                var dataMap = response.getReturnValue();
                // Checking if the status is success
                if(dataMap.status=='success') {
                    // Setting the success toast which is dismissable ( vanish on timeout or on clicking X button )
                    toastEvent.setParams({
                        'title': 'Success!',
                        'type': 'success',
                        'mode': 'dismissable',
                        'message': dataMap.message
                    });
                    // Fire success toast event ( Show toast )
                    toastEvent.fire(); 
                    this.fetchProducts(component, event, helper);
                        window.location.reload();
                        //$A.get('e.force:refreshView').fire();
                        
                }
                // Checking if the status is error 
                else if(dataMap.status=='error') {
                    // Setting the error toast which is dismissable ( vanish on timeout or on clicking X button )
                    toastEvent.setParams({
                        'title': 'Error!',
                        'type': 'error',
                        'mode': 'dismissable',
                        'message': dataMap.message
                    });
                    // Fire error toast event ( Show toast )
                    toastEvent.fire();                
                }
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }            
        });
        $A.enqueueAction(deleteAction);
    }
})