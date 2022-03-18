({
	handleCancel :function(component, event) {
        
        //$A.get("e.force:closeQuickAction").fire();
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
          "recordId": component.get("v.EventId")
          
        });
        navEvt.fire();
        var actionAPI = component.find("quickActionAPI");
        var args = {actionName: "Event.C360_Objectives"};
        actionAPI.selectAction(args).then(function(result){
            //Action selected; show data and set field values
        }).catch(function(e){
            if(e.errors){
                //If the specified action isn't found on the page, show an error message in the my component
            }
        });
        $A.get('e.force:refreshView').fire();
        
        
    },
    defaultValues : function(component, event,helper) {
        //alert('default')
        var action = component.get("c.getObjectiveInfo"); 
        	action.setParams({
            	"objectiveId": (component.get("v.objectives"))[0].Id
            }); 
        action.setCallback(this, function(data){
            var state = data.getState(); 
            if(state === "SUCCESS"){
                var response = data.getReturnValue();
                //alert(response.RecordType.Name);
                    if (response.Account__c && ((response.Account__r.RecordType.DeveloperName == 'Off_Premise') || (response.Account__r.RecordType.DeveloperName == 'Chain_Off_Premise'))) {
                        component.set("v.isOffPrem", true);
                    } else {
                        component.set("v.isOffPrem", false);
                    }
                     component.set('v.newObjective', response);
                    
                	 component.set("v.RecordTypeName",response.RecordTypeId+'_'+response.RecordType.Name);
                if(response.Sub_Type__c != null && response.Sub_Type__c != ''){
                        if(response.Sub_Type__r.Sub_Type_Values__c != null && response.Sub_Type__r.Sub_Type_Values__c != ''){
                            var subTypes = response.Sub_Type__r.Sub_Type_Values__c.split(",").map(function(item) {
                                return item.trim();
                            });
                            //alert(subTypes);
                            component.set("v.subTypeValues", subTypes);
                            
                        }
                    }
                
               
            }
            else if(state === "ERROR"){
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg","Error Occured While fetching Objective Info, Please reach out to your admin.");
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Error Occured While fetching Objective Info, Please reach out to your admin.",
                    "type": "error"
                });
                toastEvent.fire();               
                
            }else{
                
                $A.get('e.force:refreshView').fire(); // refresh the component               
            }
        });
        $A.enqueueAction(action);
        
    },
    setFormFieldsFromTemplate : function(component, template,helper) {
        try{
            var emptyArray = [];
            var recordTypeName = (component.get("v.RecordTypeName")).split("_")[1];
            if(template != null){
                $A.util.removeClass(component.find("divspn") , "slds-hide");
                //alert('template=='+JSON.stringify(template));
                component.set("v.newObjective.Name", template.Name);
                component.set("v.newObjective.Description__c", template.Description__c);
                component.find("EngbrandSearch").set("v.searchValue", template.Brand_Name__c);
                if(template.Product_Quantity__c){
                    component.set("v.newObjective.Product_Quantity__c", template.Product_Quantity__c);
                }
                if(recordTypeName == 'Feature' || recordTypeName == 'Display'){
                    //helper.retrivePackageForMBO(component,template.MC_Product__c ,event);
                    component.find("EngbrandSearch").initPackage(template.MC_Product__c);
                    
                    window.setTimeout(
                    $A.getCallback(function() {
                        helper.retrivePackageForMBO(component,template.MC_Product__c ,event);
                    }), 1000
                    );
                    
                    
                }
                component.find("inputInfo").forEach(function callback(currentComp){
                    if(currentComp.get("v.fieldName")=='Name'){
                        //alert('Set NAme to View=='+template.Name);
                        currentComp.set("v.value",template.Name);
                    }
                    if(currentComp.get("v.fieldName")=='Description__c'){
                        
                        currentComp.set("v.value",template.Description__c);
                    }
                    if( currentComp.get("v.fieldName")=='Product_Quantity__c' && template.Product_Quantity__c){
                        
                        currentComp.set("v.value",template.Product_Quantity__c);
                    }
                });
                
                //alert('Sub Type Values: '+template.Sub_Type__r.Sub_Type_Values__c);
                if(template.Planned_Objective__c != null && template.Planned_Objective__c != ''){
                    if(template.Sub_Type__c != null && template.Sub_Type__c != ''){
                        if(template.Sub_Type__r.Sub_Type_Values__c != null && template.Sub_Type__r.Sub_Type_Values__c != ''){
                            var subTypes = template.Sub_Type__r.Sub_Type_Values__c.split(",").map(function(item) {
                                return item.trim();
                            });
                            //alert('subTypes======'+subTypes);
                            component.set("v.subTypeValues", subTypes);
                            component.set("v.newObjective.Sub_Type__r.Sub_Type_Values__c", template.Sub_Type__r.Sub_Type_Values__c); 
                            // MC:1701- Subtypes should be added on objectives instead of planned objectives
                            component.set("v.newObjective.Sub_Type__c",template.Sub_Type__c);
                        }
                    } else {
                        component.set("v.newObjective.Sub_Type__c","");
                        component.set("v.newObjective.Sub_Type_Selection__c","");
                		component.set("v.subTypeValues", emptyArray);
                    }
                    component.set("v.newObjective.Planned_Objective__c", template.Planned_Objective__c);
                }
               window.setTimeout(
                $A.getCallback(function() {
                    $A.util.addClass(component.find("divspn") , "slds-hide");
                }), 1300
                ); 
            } else {
                //alert('on Mbo remove');
                component.set("v.newObjective.Sub_Type__r", "");
                component.set("v.newObjective.Sub_Type_Selection__c","");
                
                component.set("v.newObjective.Sub_Type__c","");
                component.set("v.subTypeValues", emptyArray);
                component.set("v.newObjective.MC_Product__c",null);
                component.set("v.newObjective.Brands__c","");
                component.set("v.newObjective.Description__c","");
                component.set("v.newObjective.Name","");
                component.find("inputInfo").forEach(function callback(currentComp){
                    if(currentComp.get("v.fieldName")=='Name'){
                        //alert('Set NAme to View=='+template.Name);
                        currentComp.set("v.value","");
                    }
                    if(currentComp.get("v.fieldName")=='Description__c'){
                        
                        currentComp.set("v.value","");
                    }
                    
                });
                
            }
            
        } catch(e){
            console.error(e);
            
        }
    },
    
    onSaveHelper : function(component, event){
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        component.set("v.ErrorMsg","");
        $A.util.removeClass(component.find("divspn") , "slds-hide");
        var error = false;
        var missingFields = "";
        var reqFieldsMap = component.get("v.reqfieldsMap");
    	if(component.find("inputInfo") != null)
        {
            component.find("inputInfo").forEach(function callback(currentComp){
                
                 component.set("v.newObjective."+currentComp.get("v.fieldName"),currentComp.get("v.value")); 
			
            });
            
            if(reqFieldsMap){
                for(var i in reqFieldsMap){
                    //alert(JSON.stringify(reqFieldsMap[i])+'===='+reqFieldsMap[i]);
                    //alert('Field Values '+component.get("v.newObjective."+reqFieldsMap[i].key)+' Name'+reqFieldsMap[i].key+' Value'+reqFieldsMap[i].value);
                    if((reqFieldsMap[i].value != undefined && reqFieldsMap[i].value != null) && (component.get("v.newObjective."+reqFieldsMap[i].key)==undefined || component.get("v.newObjective."+reqFieldsMap[i].key)=="" || component.get("v.newObjective."+reqFieldsMap[i].key)== null )){
                        if(reqFieldsMap[i].key == 'Brands__c' && (component.get("v.newObjective.Status__c") == 'Committed' || component.get("v.newObjective.Status__c") == 'Executed' || component.get("v.newObjective.Status__c") == 'In Progress' || component.get("v.newObjective.Status__c") == 'Not Started')){
                            error = true;
                        	missingFields = missingFields + reqFieldsMap[i].value +" ,";
                        }else if(reqFieldsMap[i].key != 'Brands__c'){
                            error = true;
                        	missingFields = missingFields + reqFieldsMap[i].value +" ,";
                        }
                        
                    }
            	}
            }
            if(error){
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Required fields \'"+missingFields.slice(0, -1)+"\' must be completed.");
                $A.util.addClass(component.find("divspn") , "slds-hide");
                return;
            }
            
            
        }
        var objective = component.get("v.newObjective");
            //alert(JSON.stringify(objective));
            if(!component.get("v.isCreate")){
                objective.Account__r = null;
                objective.Sub_Type__r = null;
                objective.RecordType = null;
                //alert('is not create=='+JSON.stringify(objective));
            }else{
                objective.Sub_Type__r = null; 
            }
        //alert(JSON.stringify(objective));
        var action = component.get("c.saveObjectiveInfo"); 
        	action.setParams({
            	"objectiveinfo": objective,
                "recordType" : (component.get("v.RecordTypeName")).split("_")[1],
                "isOffPrem" : component.get("v.isOffPrem")
            }); 
        action.setCallback(this, function(data){
            var state = data.getState();
            window.setTimeout(
                $A.getCallback(function() {
                    $A.util.addClass(component.find("divspn") , "slds-hide");
                }), 1200
                );
            //alert(state);
            if(state === "SUCCESS"){
                var response = data.getReturnValue();
                //alert(response);
                if(response.startsWith('Success')){
                    component.set("v.newObjective.Id",response.split("_")[1]);
                    objective.Id = response.split("_")[1];
                    component.find('notifLib').showToast({
                        "variant": "success",
                        "title": "Objective",
                        "message": "Record Updated Successfully"
                    });
                    var cmpEvent = component.getEvent("EditPageResetEvent"); 
                        //Set event attribute value
                    // Setting RecordtypeName
                    objective.RecordtypeName = (component.get("v.RecordTypeName")).split("_")[1];
                    cmpEvent.setParams({"ResetEditPage" : true,"savedObjective":objective,"isCreate":component.get("v.isCreate")}); 
                    cmpEvent.fire();
                }else{
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                	component.set("v.ErrorMsg",response);
                    /*
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": response,
                        "type": "error",
                        "mode": "sticky"
                    });
                    toastEvent.fire();*/
                }
            }
            else if(state === "ERROR"){
                //var errors = response.getError();
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Error Occured While Saving Objective Info, Please reach out to your admin.");
                /*
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Error Occured While Saving Objective Info, Please reach out to your admin.",
                    "type": "error"
                });
                toastEvent.fire();
                */
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Unknown Error. Please reach out to your admin.");
                /*
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Unknown Error. Please reach out to your admin.",
                    "type": "error"
                });
                toastEvent.fire();
                */
            }
        });
        $A.enqueueAction(action);
	},
    
    retrivePackageForMBO : function(component,packageId ,event){
        var brandSearch = component.find("EngbrandSearch");
        var action = component.get("c.retrievePackage");
        if(action){
        	action.setParams({
            	"selectedPkgId": packageId,
                
                "isOffPrem" : component.get("v.isOffPrem")
            }); 
            action.setCallback(this, function(data){
                var state = data.getState();
                
                //alert(state);
                if(state === "SUCCESS"){
                    var response = data.getReturnValue();
                    //alert(response);
                    if(response.length > 0){
                        var results = response.map(function(property) {
                                        return JSON.parse(property);
                        });
                        brandSearch.set("v.isDisablePkg", false);
                        var presentPackages = brandSearch.get("v.packages");
                        //alert('Empty Check---'+presentPackages);
                        if(presentPackages && presentPackages!= '' && presentPackages != null){
                            presentPackages.push(results[0]);
                        }else{
                            presentPackages = results;
                        }
                        
                        brandSearch.set("v.packages", presentPackages);
                           
                    }
                }
                else if(state === "ERROR"){
                    //var errors = response.getError();
                    
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    component.set("v.ErrorMsg","Error Occured While retrieving package Info, Please reach out to your admin.");
                    /*
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Error Occured While retrieving package Info, Please reach out to your admin.",
                        "type": "error"
                    });
                    toastEvent.fire();
                    */              
                    
                }else{
                    $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    component.set("v.ErrorMsg","Unknown Error. Please reach out to your admin.");
                    /*
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unknown Error. Please reach out to your admin.",
                        "type": "error"
                    });
                    toastEvent.fire();
                    */               
                }
            });
            var presentPackages = brandSearch.get("v.packages");
            var noMatch = true;
            if(packageId && packageId != null && packageId != ''){
            
                if(presentPackages && presentPackages!= '' && presentPackages != null){
                    presentPackages.some(function callback(item){
                        //alert('Match found -317 helper='+(item.id == packageId));
                        if(item.id == packageId ){
                            //alert('Match found -317 helper');
                            noMatch = false;
                            
                        }
                    });
                    
                }
            }else{
                noMatch = false;
            }
            if(noMatch){
                $A.enqueueAction(action);
            }
        }
    },
    
    populateSubTypeValues : function(component,plannedObjectiveId,type,event){
        
        var action = component.get("c.queryTemplate"); 
        	action.setParams({
            	"plannedObjectiveId": plannedObjectiveId,
                
                "type" : type
            }); 
        action.setCallback(this, function(data){
            var state = data.getState();
            
            //alert(state);
            if(state === "SUCCESS"){
                var response = data.getReturnValue();
                //alert(response);
                if(response != null && (response.Sub_Type__c != null && response.Sub_Type__c != '' && response.Sub_Type__c != undefined)){
                    component.set("v.newObjective.Sub_Type__r.Sub_Type_Values__c", response.Sub_Type__r.Sub_Type_Values__c); 
                            
                    component.set("v.newObjective.Sub_Type__c",response.Sub_Type__c);
                    
                    var subTypes = response.Sub_Type__r.Sub_Type_Values__c.split(",").map(function(item) {
                                return item.trim();
                    });
                    //alert(subTypes);
                    component.set("v.subTypeValues", subTypes);
                       
                }
            }
            else if(state === "ERROR"){
                //var errors = response.getError();
                
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Error Occured While fetching SubType Info, Please reach out to your admin.");
                /*
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Error Occured While fetching SubType Info, Please reach out to your admin.",
                    "type": "error"
                });
                toastEvent.fire();
                */              
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                component.set("v.ErrorMsg","Unknown Error. Please reach out to your admin.");
                /*
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Error!",
                    "message": "Unknown Error. Please reach out to your admin.",
                    "type": "error"
                });
                toastEvent.fire();
                */               
            }
        });
        
        $A.enqueueAction(action);
        
        
    }
})