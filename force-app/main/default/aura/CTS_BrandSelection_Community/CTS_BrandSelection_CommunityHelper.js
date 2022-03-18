({
    getSetAllowableBrandPicklistValues :function(component, event, helper,INorOUT) {        
        var brandId = component.find("Brand_"+INorOUT).get("v.value");
        component.set("v.Brand"+INorOUT,brandId );
        var actionCall = component.get("c.brandInfo");
        actionCall.setParams({
            "brand":brandId
        });
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var brandRec = response.getReturnValue();   
                if(brandRec!=undefined)
                {
                    component.find("inputInfo").forEach(function callback(currentComp){ 
                        if(currentComp.get("v.fieldName")=='CTS_Gas_Type_'+INorOUT+'__c')
                        {	
                            currentComp.set("v.value",brandRec.CTS_Primary_Gas_Type__c);            
                        }
                        else if(currentComp.get("v.fieldName")=='CTS_Coupler_'+INorOUT+'__c')
                        {	                        
                            currentComp.set("v.value",brandRec.CTS_Coupler_Default__c);
                        }
                    });
                    if(component.get("v.isFromInit")==0)
                    {
                        if(brandRec.CTS_Lineset_Default__c == ""|| brandRec.CTS_Lineset_Default__c == undefined)
                        {
                            if(brandRec.CTS_Container__c == "Keg")
                            {
                                component.set("v.defaultBrandDispense"+INorOUT,"Free Flow Gas Pump Assisted");
                            }
                            else if(brandRec.CTS_Container__c == "Cask")
                            {
                                component.set("v.defaultBrandDispense"+INorOUT,"Cask Gas Pump Assisted");
                            }
                                else
                                {
                                    component.set("v.defaultBrandDispense"+INorOUT,brandRec.CTS_Lineset_Default__c);
                                }	
                        }
                        else
                        {
                            component.set("v.defaultBrandDispense"+INorOUT,brandRec.CTS_Lineset_Default__c);
                        }
                        if(component.find("customInputInfo") != null)
                        {            
                            component.find("customInputInfo").forEach(function callback(currentComp){   
                                if(currentComp.get("v.name") == "CTS_Brand_Dispense_"+INorOUT+"__c")
                                    component.set("v.taskinfo."+currentComp.get("v.name"),component.get("v.defaultBrandDispense"+INorOUT));            
                            }); 
                        }  
                        //component.set("v.taskinfo.CTS_Brand_Dispense_"+INorOUT+"__c",component.get("v.defaultBrandDispense"+INorOUT));
                        if(INorOUT=='IN')
                        {
                            if(component.find("inputInfoDisplaySubTypeIn")!=undefined)
                            {
                                component.find("Brand_Display_IN_Custom").set("v.value","");
                                component.find("inputInfoDisplaySubTypeIn").set("v.value","");
                            }
                            setTimeout(function(){ 
                                component.set("v.refreshFlag",false);
                                component.set("v.refreshFlag",true); 
                            }, 10);
                        }
                        else
                        {
                            if(component.find("inputInfoDisplaySubTypeOut")!=undefined)
                            {
                                component.find("Brand_Display_OUT_Custom").set("v.value","");
                                component.find("inputInfoDisplaySubTypeOut").set("v.value","");
                            }
                            setTimeout(function(){ 
                                component.set("v.refreshOutFlag",false);
                                component.set("v.refreshOutFlag",true); 
                            }, 10);
                        }
                        
                        
                    }  
                    else
                    {
                        component.set("v.isFromInit",component.get("v.isFromInit")+1);
                    }
                    
                    var Allowable_Display = component.get("v.isROIorNI") ? brandRec.CTS_Allowable_Display_Ireland__c : brandRec.CTS_Allowable_Display__c;
                    var Allowable_Dispense = component.get("v.isROIorNI") ? brandRec.CTS_Allowable_Dispense_Ireland__c : brandRec.CTS_Allowable_Dispense__c;
                    var Allowable_Cooling = component.get("v.isROIorNI") ? brandRec.CTS_Allowable_Cooling_Ireland__c : brandRec.CTS_Allowable_Cooling__c;
                    var Allowable_Handle = component.get("v.isROIorNI") ? brandRec.CTS_Allowable_Handle_Ireland__c : brandRec.CTS_Allowable_Handle__c;
                    
                    if(Allowable_Display != undefined)
                    {
                        var picklistValueList = [];
                        for (var key of Allowable_Display.split(';')) {
                            picklistValueList.push(key);
                        }
                        picklistValueList.sort();
                        component.set("v.allowableDisplayType"+INorOUT,picklistValueList);                        
                    }
                    
                    if(Allowable_Dispense != undefined)
                    {
                        var dispensepicklistList = [];
                        for (var key of Allowable_Dispense.split(';')) {
                            dispensepicklistList.push(key);
                        }
                        dispensepicklistList.sort();
                        component.set("v.allowableBrandDispense"+INorOUT,dispensepicklistList);
                    }
                    
                    if(Allowable_Cooling != undefined)
                    {						
                        var coolingpicklistList = [];
                        for (var key of Allowable_Cooling.split(';')) {
                            coolingpicklistList.push(key);
                        }
                        coolingpicklistList.sort();
                        component.set("v.allowableCooling"+INorOUT,coolingpicklistList);
                    }
                    
                    if((INorOUT=='IN' || component.get("v.selectedRecordTypeLabel")=='Removal')&& Allowable_Handle!=undefined)
                    {
                        var handlepicklistList = [];
                        for (var key of Allowable_Handle.split(';')) {
                            handlepicklistList.push(key);
                        }
                        handlepicklistList.sort();
                        component.set("v.allowableHandle",handlepicklistList);
                    }
                } 
                
            }                
        });
        $A.enqueueAction(actionCall); 			
    },    
    onSaveHelper : function(component, event,helper,isSaveAndNew) {   
        var error = false;
        let button1 = component.find('saverslButton');
        button1.set('v.disabled',true);
        /*
        let button2 = component.find('saveNewrslButton');
        button2.set('v.disabled',true);
        */
        if(component.find("inputInfo") != null)
        {
            component.find("inputInfo").forEach(function callback(currentComp){ 
                if(currentComp.get("v.class")!=undefined && currentComp.get("v.class").includes("fieldrequired") && (currentComp.get("v.value")==undefined || currentComp.get("v.value")==""))
                {
                    $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    component.set("v.ErrorMsg","Required fields must be completed"); 
                    error=true;
                    let button1 = component.find('saverslButton');
                    button1.set('v.disabled',false);
                    /*
                    let button2 = component.find('saveNewrslButton');
                    button2.set('v.disabled',false);
                    */
                    return;
                }
                if( (currentComp.get("v.fieldName")!='CTS_Brand_IN__c') && (currentComp.get("v.fieldName")!='CTS_Brand_OUT__c') )
                    component.set("v.taskinfo."+currentComp.get("v.fieldName"),currentComp.get("v.value"));          
            });
        }
        if(error)
        {
            let button1 = component.find('saverslButton');
            button1.set('v.disabled',false);
            /*
            let button2 = component.find('saveNewrslButton');
            button2.set('v.disabled',false);
            */
            return;
        }
        if(component.find("customInputInfo") != null)
        {            
            component.find("customInputInfo").forEach(function callback(currentComp){                 
                component.set("v.taskinfo."+currentComp.get("v.name"),currentComp.get("v.value"));            
            }); 
        }   
        
        if(component.get("v.parentRecordId")!=undefined)
            component.set("v.taskinfo.WorkOrderId", component.get("v.parentRecordId"));
        if(component.get("v.recordTypeId")!=undefined)
            component.set("v.taskinfo.RecordTypeId", component.get("v.recordTypeId"));        
        
        var actionCall = component.get("c.rslUpdate");
        actionCall.setParams({rslRecord:component.get("v.taskinfo")});
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var resultInfo = response.getReturnValue();
                if(resultInfo.split("_")[0] === "success")
                {
                    helper.closeQuickActionAndRedirect(component, event);
                    var evnT = $A.get("event.force:showToast");
                    evnT.setParams({
                        "title":"Technician Task:",
                        "message":"Record Saved Successfully !",
                        "type":"success"
                        
                    });
                    evnT.fire();
                    /*if(isSaveAndNew)                    
                    {
                        
                        var evt = $A.get("e.force:navigateToComponent");
                        evt.setParams({
                            componentDef : "c:CTS_TaskRecordTypeSelection_Community",
                            componentAttributes: {
                                recordId : component.get("v.parentRecordId")
                            }
                        });
                        console.log('>>>>>is Save and new');
                        evt.fire();
                        console.log('>>>>>is Save and new fire');
                       
                        	
                         
                        
                    } */
                }
                else{
                    $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    component.set("v.ErrorMsg",response.getReturnValue()); 
                } 
            }else{
                    $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    var errors = response.getError();
                	//console.log('Error==='+errors);
                    //console.log('Error==='+errors[0].message);
                	component.set("v.ErrorMsg",errors[0].message+" Please Contact Admin For Support."); 
                } 
            let button1 = component.find('saverslButton');
            button1.set('v.disabled',false);
            /*
            let button2 = component.find('saveNewrslButton');
            button2.set('v.disabled',false);
            */
        });
        $A.enqueueAction(actionCall); 
        
    },
    closeQuickActionAndRedirect :function(component, event) {
        //$A.get("e.force:closeQuickAction").fire();
        var urlEvent;
        urlEvent = $A.get("e.force:navigateToRelatedList");
        urlEvent.setParams({
            "parentRecordId": (component.get("v.parentRecordId")),
            "relatedListId": "WorkOrderLineItems"
        });
        urlEvent.fire();            
        $A.get('e.force:refreshView').fire();
    }
})