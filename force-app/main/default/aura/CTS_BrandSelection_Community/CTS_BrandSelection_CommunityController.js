({       
    doInit :function(component, event, helper) { 
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        var actionCall = component.get("c.getLayoutInfo");
        var actionCallgetRecTypeAndIDS = component.get("c.rslInfo");
        var recordTypeID;
        if(component.get("v.recordTypeId")==undefined)
        {
            recordTypeID = component.get("v.recordId");            
            
            actionCallgetRecTypeAndIDS.setParams({
                "rslId":recordTypeID
            });
            actionCallgetRecTypeAndIDS.setCallback(this, function(response) {
                var stateValue = response.getState();
                if (stateValue === "SUCCESS") {
                    var rslRec = response.getReturnValue();
                    component.set("v.isROIorNI",rslRec.WorkOrder.CTS_ROI_NI__c);
                    component.set("v.recordTypeId",rslRec.RecordTypeId);
                    component.set("v.selectedRecordTypeLabel",rslRec.RecordType.Name);
                    component.set("v.parentRecordId",rslRec.WorkOrderId);
                    component.set("v.taskinfo.Id",recordTypeID);                    
                    component.set("v.taskinfo.CTS_Brand_IN__c",rslRec.CTS_Brand_IN__c);
                    if(rslRec.CTS_Brand_IN__c!=undefined)
                    {
                        component.set("v.taskinfo.CTS_Brand_IN__r.Name",rslRec.CTS_Brand_IN__r.Name);
                        component.set("v.isFromInit",component.get("v.isFromInit")-1);
                        $A.util.removeClass(component.find("divtag1"), "slds-hide");
                        $A.util.addClass(component.find("divtag2"), "slds-hide");
                    }
                    component.set("v.taskinfo.CTS_Brand_OUT__c",rslRec.CTS_Brand_OUT__c);
                    if(rslRec.CTS_Brand_OUT__c!=undefined)
                    {
                        component.set("v.taskinfo.CTS_Brand_OUT__r.Name",rslRec.CTS_Brand_OUT__r.Name);
                        component.set("v.isFromInit",component.get("v.isFromInit")-1);
                        $A.util.removeClass(component.find("divtag1OUT"), "slds-hide");
                        $A.util.addClass(component.find("divtag2OUT"), "slds-hide");
                        
                    }
                    component.set("v.taskinfo.CTS_Brand_Dispense_IN__c",rslRec.CTS_Brand_Dispense_IN__c);
                    component.set("v.taskinfo.CTS_Brand_Dispense_OUT__c",rslRec.CTS_Brand_Dispense_OUT__c);
                    component.set("v.taskinfo.CTS_Brand_Display_IN__c",rslRec.CTS_Brand_Display_IN__c);
                    component.set("v.taskinfo.CTS_Brand_Display_OUT__c",rslRec.CTS_Brand_Display_OUT__c);
                    component.set("v.taskinfo.CTS_Cooling_Type_IN__c",rslRec.CTS_Cooling_Type_IN__c);
                    component.set("v.taskinfo.CTS_Cooling_Type_OUT__c",rslRec.CTS_Cooling_Type_OUT__c);
                    component.set("v.taskinfo.CTS_Handle_Type__c",rslRec.CTS_Handle_Type__c);    
                    component.set("v.defaultBrandDispenseIN",rslRec.CTS_Brand_Dispense_IN__c);
                    component.set("v.defaultBrandDispenseOUT",rslRec.CTS_Brand_Dispense_OUT__c);
                    component.set("v.defaultDisplayIN",rslRec.CTS_Brand_Display_IN__c);
                    component.set("v.defaultDisplayOUT",rslRec.CTS_Brand_Display_OUT__c);
                    component.set("v.defaultCoolingIN",rslRec.CTS_Cooling_Type_IN__c);
                    component.set("v.defaultCoolingOUT",rslRec.CTS_Cooling_Type_OUT__c);
                    component.set("v.defaultHandleType",rslRec.CTS_Handle_Type__c);  
                    
                }                
            });
        }
        else
        {
            recordTypeID = component.get("v.recordTypeId");            
        }        
        actionCall.setParams({recordTypeID:recordTypeID});
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();               
            if (stateValue === "SUCCESS") {
                //var resultInfo = response.getReturnValue() 
                var result = response.getReturnValue();  
                var BrandCovered = false;
                var BrandInfocount=0;
                var arrayMapKeys1 = [];
                var arrayMapKeys2 = [];
                var arrayMapKeys3 = [];
                for(var key in result){  
                    //To support hardcoded brand section as force:inputfield is not supported with iteration or can be created dynamically
                    if(key == 'Brand')
                    {
                        arrayMapKeys2.push({key: key, value: result[key]}); 
                        for(var fieldkey in result[key])
                        {
                            var field =result[key][fieldkey];
                            
                            if(field.FieldName == 'CTS_Brand_IN__c')
                            {
                                component.set("v.BrandInInfo",field);
                                //alert('Here') ;
                                BrandInfocount++;
                            }
                            else if(field.FieldName == 'CTS_Brand_OUT__c')
                            {
                                component.set("v.BrandOutInfo",field);
                                BrandInfocount++
                            }
                            if(BrandInfocount==2)
                            {
                                break;
                            }
                        }
                        BrandCovered = true;
                    }
                    else if(!BrandCovered)
                    {
                        arrayMapKeys1.push({key: key, value: result[key]});                        
                    }
                    else
                    {
                        arrayMapKeys3.push({key: key, value: result[key]});
                    }
                }
                component.set("v.PriorBrandSectionInfoMap",arrayMapKeys1); 
                component.set("v.BrandSectionInfoMap",arrayMapKeys2);  
                component.set("v.PostBrandSectionInfoMap",arrayMapKeys3);
            }});
        $A.enqueueAction(actionCall);         
        $A.enqueueAction(actionCallgetRecTypeAndIDS);  
    },
    handleCancel :function(component, event, helper) {        
        helper.closeQuickActionAndRedirect(component, event);
    },    
    onSave : function(component, event, helper) {              
        helper.onSaveHelper(component, event, helper,false);        
    },    
    onSaveNew : function(component, event, helper) {  
        helper.onSaveHelper(component, event, helper,true);         
    },
    getAllowableBrandInPicklistValues :function(component, event, helper) {         
        if(!$A.util.isEmpty(component.find("Brand_IN")))
            helper.getSetAllowableBrandPicklistValues(component, event, helper,'IN');        
    },
    getAllowableBrandOutPicklistValues :function(component, event, helper) {        
        if(!$A.util.isEmpty(component.find("Brand_OUT")))
            helper.getSetAllowableBrandPicklistValues(component, event, helper,'OUT');
    },
    setDisplayTypeIN :function(component, event, helper) {	  
        if( component.find("Brand_Display_IN_Custom")!=undefined)
        {
            component.find("Brand_Display_IN_Custom").set("v.value", event.getSource().get("v.value"));  
            if(component.find("inputInfoDisplaySubTypeIn")!=undefined)
            {
                component.find("inputInfoDisplaySubTypeIn").set("v.value","");
            }
            setTimeout(function(){ 
                component.set("v.refreshFlag",false);
                component.set("v.refreshFlag",true); 
            }, 10);
        }        
    },
    setDisplayTypeOUT :function(component, event, helper) {	    
        if(component.find("Brand_Display_OUT_Custom")!=undefined)
        {
            component.find("Brand_Display_OUT_Custom").set("v.value", event.getSource().get("v.value"));  
            if(component.find("inputInfoDisplaySubTypeOut")!=undefined)
            {
                component.find("inputInfoDisplaySubTypeOut").set("v.value","");
            }
            setTimeout(function(){ 
                component.set("v.refreshOutFlag",false);
                component.set("v.refreshOutFlag",true); 
            }, 10);
        }        
    },
    showSpinner : function(component, event, helper) {	
        $A.util.removeClass(component.find("spn") , "slds-hide");  
    },	
    hideSpinner : function(component, event, helper) {	
        $A.util.addClass(component.find("spn") , "slds-hide");
    },
    //This fuction is to switch the display of Brand Field in Component
    toggleDisplay :function(component, event, helper) {
        $A.util.addClass(component.find("divtag1"), "slds-hide");
        $A.util.removeClass(component.find("divtag2"), "slds-hide");
        component.find("Brand_IN").set("v.value",null);
        
    },
    //This fuction is to switch the display of Brand Field in Component
    toggleDisplayOUT :function(component, event, helper) {
        $A.util.addClass(component.find("divtag1OUT"), "slds-hide");
        $A.util.removeClass(component.find("divtag2OUT"), "slds-hide");
        component.find("Brand_OUT").set("v.value",null);
        
    },
    CompSubTypeCheck :function(component, event, helper) {
        if(component.find("inputInfo") != null)
        {
            component.find("inputInfo").forEach(function callback(currentComp){ 
                if( (currentComp.get("v.fieldName") =='CTS_Component_Sub_Type_IN__c'))
                {
                    var componentSubTypeValues = $A.get("$Label.c.CTS_Python_Length_Warning");
                    
                    //if((currentComp.get("v.value") == '10 plus 2 Beer Python' || currentComp.get("v.value") == '14 plus 2 Beer Python' || currentComp.get("v.value") == '18 plus 2 Beer Python' || currentComp.get("v.value") == 'Coil/Foil 10 plus 4' || currentComp.get("v.value") == 'Coil/Foil 14 plus 4'))
                    if( !$A.util.isEmpty(currentComp.get("v.value")) && componentSubTypeValues.includes(currentComp.get("v.value"))) 
                    {
                        
                        component.set("v.NoteMsg","Note : Please confirm the required python length in your Part Order");
                    	
                        $A.util.removeClass(component.find("NoteMsg"), "slds-hide");
                    }else
                    {
                        $A.util.addClass(component.find("NoteMsg"), "slds-hide");
                        component.set("v.NoteMsg","");
                    }
                }
            });
        }
    
    }
})