({
    doInit : function(component, event, helper) {
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        $A.util.removeClass(component.find("divspn") , "slds-hide");
        component.set("v.ErrorMsg","");
        //Map to store DateTime fields
        var datetimeFieldNames = new Map();
        
        var recTypeId;
        
        if((component.get("v.objectives")).length){
            //alert('In If'+ component.get("v.objectives"));
       		helper.defaultValues(component, event); 
            recTypeId = (component.get("v.objectives"))[0].Id;
            
        }else{
            //alert('In else'+ component.get("v.objectives") == '');
            recTypeId = (component.get("v.RecordTypeName")).split("_")[0];
            component.set("v.newObjective.RecordTypeId",recTypeId);
            component.set("v.newObjective.Account__c",component.get("v.accountId"));
            component.set("v.newObjective.Product_Quantity__c", '1');
        }
        
       //Fetch All the fields
       var actionCall = component.get("c.getLayoutInfo");
       // alert(component.get("v.objectives"));
       //alert((component.get("v.objectives"))[0].Id); 
       actionCall.setParams({recordTypeID:recTypeId});
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            window.setTimeout(
                $A.getCallback(function() {
                    $A.util.addClass(component.find("divspn") , "slds-hide");
                }), 1000
            );               
            if (stateValue === "SUCCESS") {
                //var resultInfo = response.getReturnValue() 
                //alert(result);
                var result = response.getReturnValue();  
                if(result){
                    var datefull = new Date();
  					
                    var fieldset = [];
                    var reqFields = [];
                	for(var key in result){  
                    
                        fieldset.push({key: key, value: result[key]});
                        (result[key]).forEach(function itr(item){
                            if(item.FieldRequired){
                                //alert(item.FieldName);
                                reqFields.push({key: item.FieldName, value:item.FieldLabel});
                            }
                            
                            //To set the DateTime field to Current DateTime based on FieldType only on Creation
                            if(component.get("v.isCreate")){
                                if(item.FieldType == 'DATETIME'){
                                    if(item.FieldName == 'Delivery_Date__c'){
                                        var date = datefull;
                                        date.setDate(date.getDate() + 7);
                                        component.set("v.newObjective."+item.FieldName,date.toISOString());
                                    }else{
                                        //alert(datefull.toISOString());
                                        component.set("v.newObjective."+item.FieldName,datefull.toISOString());
                                    }
                                    datetimeFieldNames.set(item.FieldName, item.FieldType);
                                }
                            }
                        });
                    }
                    //alert(fieldset);
                    component.set("v.fieldsetfound",true); 
                	component.set("v.fieldSetSectionInfoMap",fieldset);
                    //alert(reqFields);
                    component.set("v.reqfieldsMap",reqFields);
                }else{
                   component.set("v.fieldsetfound",false);
                   $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                   component.set("v.ErrorMsg","Unable to find the related FieldSet. Please contact admin.");
                }
                
                //To Populate Package on edit mode
                if(!component.get("v.isCreate") && component.find("EngbrandSearch")){
                    component.find("EngbrandSearch").initPackage(component.get("v.newObjective.MC_Product__c"));
                    window.setTimeout(
                    $A.getCallback(function() {
                        helper.retrivePackageForMBO(component,component.get("v.newObjective.MC_Product__c"),event);
                    }), 1000
                    );
                }
                
                //To default the DateTime field to Current DateTime only on creation
                if(component.find("inputInfo") != null && component.get("v.isCreate"))
                {
                    component.find("inputInfo").forEach(function callback(currentComp){
                        
                        //alert(datetimeFieldNames.get(currentComp.get("v.fieldName")));
                        if(datetimeFieldNames.get(currentComp.get("v.fieldName")) == 'DATETIME'){
                            currentComp.set("v.value",component.get("v.newObjective."+currentComp.get("v.fieldName")));
                        }
                        
                        //Defaulting quantity to 1
                        if(currentComp.get("v.fieldName") == 'Product_Quantity__c'){
                            currentComp.set("v.value",'1');
                        }
                    
                    });
                }
                datetimeFieldNames.clear();
                
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg","Unable to find the related FieldSet. Please contact admin.");
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unable to find the related FieldSet. Please contact admin.",
                        "type": "error"
                        
                    });
                    toastEvent.fire();
            }
        });
        $A.enqueueAction(actionCall);
    
    },
    
    handleCancel :function(component, event, helper) {
        //helper.handleCancel(component, event);
        var cmpEvent = component.getEvent("EditPageResetEvent"); 
                        //Set event attribute value
        cmpEvent.setParams({"ResetEditPage" : true,"savedObjective": null,"isCreate":component.get("v.isCreate")}); 
                    cmpEvent.fire();
          
    },
    plannedObjectiveChanged : function(component, event, helper) {
        //alert('PlannedObjective Handler');
        var template = event.getParam("template");
        helper.setFormFieldsFromTemplate(component, template,helper);
    },
    onSave : function(component, event, helper) {              
        helper.onSaveHelper(component, event);
    },
    showSpinner : function(component, event, helper) {	
        $A.util.removeClass(component.find("spn") , "slds-hide");  
    },	
    hideSpinner : function(component, event, helper) {	
        $A.util.addClass(component.find("spn") , "slds-hide");
        
    }
})