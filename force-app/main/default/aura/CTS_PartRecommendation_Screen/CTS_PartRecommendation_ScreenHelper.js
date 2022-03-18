({
	getSelectedProducts: function(component, event, helper,isSaveAndNew) {
    	// create var for store record id's for selected checkboxes  
    	if(component.get("v.displayResult") != null && component.get("v.displayResult") != undefined && (component.get("v.displayResult")).length > 0){
            var selectedQuantity = [];
            // get all checkboxes 
            var getAllSelectedRows = component.find("selectedProduct");
            var getAllQtys = [];
                        
            if(component.find("Quant") != null && component.find("Quant") != undefined ){
                if(Array.isArray(component.find("Quant"))){
                    component.find("Quant").forEach(function(entry) {
                        var quantObj = {};
                        quantObj['Id'] = entry.get("v.name");
                        quantObj['value'] = entry.get("v.value");
                        getAllQtys.push(quantObj);
                    });
                }else{
                    var quantObj1 = {};
                    //alert('Quant sig name==='+component.find("Quant").get("v.name"));
                    quantObj1['Id'] = component.find("Quant").get("v.name");
                    quantObj1['value'] = component.find("Quant").get("v.value");
                    getAllQtys.push(quantObj1);
                }
            }
            
            var getAllRequiredPrdsList =[];
            if(component.find("requiredProduct") != null && component.find("requiredProduct") != undefined){
                if(Array.isArray(component.find("requiredProduct"))){
                    component.find("requiredProduct").forEach(function(entry) {
                        var singleObj = {};
                        singleObj['Id'] = entry.get("v.name");
                        singleObj['value'] = entry.get("v.checked");
                        getAllRequiredPrdsList.push(singleObj);
                    });
                }else{
                    var singleObj1 = {};
                    
                    singleObj1['Id'] = component.find("requiredProduct").get("v.name");
                    singleObj1['value'] = component.find("requiredProduct").get("v.checked");
                    getAllRequiredPrdsList.push(singleObj1);
                }
            }
            var originalPartsMap = component.get("v.partsMap");
            //alert(originalPartsMap);
            //alert(JSON.stringify(originalPartsMap));
            var partsListToRemove = [];
            //alert('Map===type---'+Array.isArray(originalPartsMap['Add']));
            //alert('selected row===type---'+Array.isArray(getAllSelectedRows));
            if(Array.isArray(getAllSelectedRows)){
            	getAllSelectedRows.forEach(function(element){
                    //alert("Value==="+element.get("v.value"));
                    //alert(element.get("v.checked"));
                    if(element.get("v.checked") == false){
                        (originalPartsMap['Add']).forEach(function(part,index){
                            if(part.Product2Id ==element.get("v.name")){
                                (originalPartsMap['Add']).splice(index,1);
                            }
                        });
                    }
                });    
            }else{
                if(getAllSelectedRows.get("v.checked") == false){
                    (originalPartsMap['Add']).forEach(function(part,index){
                            if(part.Product2Id ==getAllSelectedRows.get("v.name")){
                                (originalPartsMap['Add']).splice(index,1);
                            }
                        });
                }
            }
            //alert('Map===type222---'+originalPartsMap['Add']);
            //alert('1======'+JSON.stringify(originalPartsMap));
            var originalPartsMap2 = component.get("v.partsMap");
            //alert('2======'+originalPartsMap2);
            //alert('2======'+JSON.stringify(originalPartsMap2));
            
        }
        helper.saveParts(component, event,isSaveAndNew);
   		
	},
    saveParts: function(component, event,isSaveAndNew) {
        component.set("v.errorMsg",'');
        $A.util.addClass(component.find("ErrorMsg"), "slds-hide");
        var cmpEvent = component.getEvent("PartsSavedEvent"); 
                //Set event attribute value
        cmpEvent.setParams({"RecordSaved" : true,"isSaveAndNew":isSaveAndNew}); 
        var originalPartsMap = component.get("v.partsMap");
        //alert('from save helper==='+JSON.stringify(originalPartsMap));
        var actionCall = component.get("c.upsertPartOrderReturnOrderLines");
        actionCall.setParams({
            newTaskPartsMapstr:JSON.stringify(originalPartsMap),
            workOrderId:component.get("v.workOrderId"),
            wolstr:JSON.stringify(component.get("v.newtaskinfo"))
        });
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            //alert('On Save from parts screen=='+ stateValue);
            if (stateValue === "SUCCESS") {
                var responseFromServer = response.getReturnValue();
                if(responseFromServer == "Success"){
                    cmpEvent.fire();
                    if((component.get("v.isOnParts"))){
                        var evnT = $A.get("event.force:showToast");
                        evnT.setParams({
                            "title":"Parts:",
                            "message":"Parts Suggested Successfully !",
                            "type":"success"
                            
                        });
                        evnT.fire();
                        $A.util.addClass(component.find("Id_spinner"), "slds-hide");
                    }
                }else if(responseFromServer.startsWith("Error")){
                    $A.util.addClass(component.find("Id_spinner"), "slds-hide");
                    if((component.get("v.isOnParts"))){
                        component.set("v.errorMsg",responseFromServer);
                        $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    }else{
                        var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                        //Set event attribute value
                        cmponErrorEvent.setParams({"ErrorMsg":responseFromServer});
                        cmponErrorEvent.fire();
                    }
                }
                
                
               
            }else if (stateValue === "INCOMPLETE") {
                $A.util.addClass(component.find("Id_spinner"), "slds-hide");
                if((component.get("v.isOnParts"))){
                        component.set("v.errorMsg","Response is Incomplete. Please Contact Admin.");
                        $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    }else{
                        var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                        //Set event attribute value
                        cmponErrorEvent.setParams({"ErrorMsg":"Response is Incomplete. Please Contact Admin."});
                        cmponErrorEvent.fire();
                    }
            }else if (stateValue === "ERROR") {
                $A.util.addClass(component.find("Id_spinner"), "slds-hide");
                var errors = response.getError();
                
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        if((component.get("v.isOnParts"))){
                            console.log("Error message: " + errors[0].message);
                            component.set("v.errorMsg",errors[0].message);
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                        }else{
                            var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                            //Set event attribute value
                            cmponErrorEvent.setParams({"ErrorMsg":errors[0].message});
                            cmponErrorEvent.fire();
                        }
                    }
                } else {
                    if((component.get("v.isOnParts"))){
                            
                            component.set("v.errorMsg","Unknown Error Occured. Please contact Admin.");
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                        }else{
                            var cmponErrorEvent = component.getEvent("ErrorOnPartsSavedEvent"); 
                            //Set event attribute value
                            cmponErrorEvent.setParams({"ErrorMsg":"Unknown Error Occured. Please contact Admin."});
                            cmponErrorEvent.fire();
                        }
                }
            }
        });
        
        if(component.get("v.partsMap")){
            //alert(component.get("v.partsMap"));
            $A.enqueueAction(actionCall);
        }else{
        	
            var cmpEvent = component.getEvent("PartsSavedEvent"); 
                //Set event attribute value
        	cmpEvent.setParams({"RecordSaved" : true,"isSaveAndNew":isSaveAndNew});
            cmpEvent.fire();
            $A.util.addClass(component.find("Id_spinner"), "slds-hide");
        }
        
    }
})