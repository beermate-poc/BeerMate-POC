({
	
    SearchHelper: function(component, event) {
        // show spinner message
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.getProducts");
        action.setParams({
            'searchKeyWord': component.get("v.searchKeyword")
        });
        action.setCallback(this, function(response) {
           // hide spinner when response coming from server 
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                
                // if storeResponse size is 0 ,display no record found message on screen.
                if (storeResponse.length == 0 ) {
                    component.set("v.Message", true);
                    component.set("v.errorMsg", "No Records Found!");
                    component.set("v.searchResult", []);
                    component.set("v.TotalNumberOfRecord",0);
                    $A.util.addClass(component.find("saveButton"),"slds-hide");
                } else {
                    $A.util.removeClass(component.find("saveButton"),"slds-hide");
                    component.set("v.Message", false);
                    component.set("v.errorMsg", "");
                    // set numberOfRecord attribute value with length of return value from server
                	component.set("v.TotalNumberOfRecord", storeResponse.length);
                    component.set("v.searchResult", storeResponse); 
                }
            }else if (state === "INCOMPLETE") {
                console.log('Response is Incompleted');
            }else if (state === "ERROR") {
                var errors = response.getError();
                
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);                       
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    
    savePartOrders : function(component, event,selectedQuantity){
        component.set("v.Message", false);
        component.set("v.errorMsg", "");
        component.find("Id_spinner").set("v.class" , 'slds-show');
        var action = component.get("c.createPartOrderLineItems");
        action.setParams({
            'partOrderId': component.get("v.parentRecordId"),
            'selectedProductList': selectedQuantity
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            component.find("Id_spinner").set("v.class" , 'slds-hide');
            if (state === "SUCCESS") {
                var resultInfo = response.getReturnValue();
                //alert(resultInfo);
                if(resultInfo === "Success")
                {
                    var evnT = $A.get("event.force:showToast");
                        evnT.setParams({
                            "title":"Part Order Lines:",
                            "message":"Parts Added Successfully !",
                            "type":"success"
                        });
                        evnT.fire();
                    component.set("v.searchResult", []);
                    component.set("v.TotalNumberOfRecord",0);
                    component.set("v.searchKeyword","");
                    $A.util.addClass(component.find("saveButton"),"slds-hide");
                }else
                {
                    component.set("v.Message", true);
                    component.set("v.errorMsg", resultInfo);
                }
            } else if (state === "ERROR"){
                var errors = response.getError();
                component.set("v.Message", true);
                component.set("v.errorMsg", "Something went wrong! No response from Server.");
            }
        });
        $A.enqueueAction(action);
    },
    // Funciton logs any errors to the js browser console.
   	counselLogErrors : function(errors) {
        if (errors) {
            if (errors[0] && errors[0].message) {
                console.log("Error message: " + errors[0].message);
            }
        } else {
            console.log("Unknown error");
        }
	}
})