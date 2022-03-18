({    
    
    doInit :function(component, event, helper) { 
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        //To get the focus on the page so that user can scroll the page with arrow key
         window.setTimeout(
            $A.getCallback(function () {
                component.find("close").focus();
            }), 1
        );
        if(component.get("v.selectedRecordTypeLabel") != undefined && component.get("v.selectedRecordTypeLabel") != "Install" && component.get("v.selectedRecordTypeLabel") != "Swap" && component.get("v.selectedRecordTypeLabel") != "Removal"){
        	component.set("v.hideRecommendation", true);
            //alert('Hide Button1  '+component.get("v.selectedRecordTypeLabel"));
        }
        var actionCall = component.get("c.getLayoutInfo");
        var actionCallgetRecTypeAndIDS = component.get("c.rslInfo");
        var recordTypeID;
        //console.log("Record Id"+component.get("v.recordId"));
        //console.log("Parent Record Id"+component.get("v.parentRecordId"));
       if(component.get("v.recordTypeId")==undefined)
        {
            recordTypeID = component.get("v.recordId");            
            component.set("v.isEditMode",true);
            actionCallgetRecTypeAndIDS.setParams({
                "rslId":recordTypeID
            });
            actionCallgetRecTypeAndIDS.setCallback(this, function(response) {
                var stateValue = response.getState();
                //alert("Not Success");
                if (stateValue === "SUCCESS") {
                    var rslRec = response.getReturnValue();
                    //alert("in callback"+rslRec);
                    if(rslRec != null && !$A.util.isEmpty(rslRec.RecordType) && (rslRec.RecordType.DeveloperName).startsWith("CTS"))
                    {
                        //Populate Old Task Value
                        component.set("v.Oldtaskinfo",rslRec);                    
                        
                        
                        //alert("CTS Type----"+rslRec.RecordType.Name);
                        component.set("v.isROIorNI",rslRec.WorkOrder.CTS_ROI_NI__c);
                        component.set("v.recordTypeId",rslRec.RecordTypeId);
                        component.set("v.selectedRecordTypeLabel",rslRec.RecordType.Name);
                        if(component.get("v.selectedRecordTypeLabel") != "Install" && component.get("v.selectedRecordTypeLabel") != "Swap" && component.get("v.selectedRecordTypeLabel") != "Removal"){
                            component.set("v.hideRecommendation", true);
                            //alert('Hide Button2  '+component.get("v.selectedRecordTypeLabel"));
                        }
                        //Added to hide Save and new for asset line item edit
                        component.set("v.isAssetLines",false);
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
                        
                        component.set("v.couplerIN",rslRec.CTS_Coupler_IN__c);
                        component.set("v.couplerOUT",rslRec.CTS_Coupler_OUT__c);
                        component.set("v.gasIN",rslRec.CTS_Gas_Type_IN__c);
                        component.set("v.gasOUT",rslRec.CTS_Gas_Type_OUT__c);
                    }else if(rslRec != null && !$A.util.isEmpty(rslRec.RecordType) && (rslRec.RecordType.DeveloperName).startsWith("CEA"))
                    {
                        //alert("CEA Type---"+rslRec.RecordType.Name);
                        component.set("v.recordTypeId",rslRec.RecordTypeId);
                        component.set("v.Oldtaskinfo",null);
                        component.set("v.selectedRecordTypeLabel",rslRec.RecordType.Name);
                        //Added to hide Save and new for asset line item edit
                        component.set("v.isAssetLines",true);
                        component.set("v.parentRecordId",rslRec.WorkOrderId);
                        component.set("v.taskinfo.Id",recordTypeID);
                        component.set("v.taskinfo.CEA_Part_Item__c",rslRec.CEA_Part_Item__c);
                        component.set("v.taskinfo.CEA_Product__c",rslRec.CEA_Product__c);
                        component.set("v.taskinfo.CEA_Destination_Location__c",rslRec.CEA_Destination_Location__c);
                        
                        if(rslRec.CEA_Part_Item__c!=undefined)
                        {
                        	
                            var selectedPartItemLookUp = {
                                'Id': rslRec.CEA_Part_Item__c,
                                'Name':rslRec.CEA_Part_Item__r.Name,
                                'CEA_Product__r.Name':rslRec.CEA_Part_Item__r.CEA_Product__r.Name 
                            };
                            component.set("v.selectedPartItemLookUp",selectedPartItemLookUp);
                            //component.set("v.taskinfo.CEA_Part_Item__r.Name",rslRec.CEA_Part_Item__r.Name);
                            //$A.util.removeClass(component.find("divAsset1"), "slds-hide");
                            //$A.util.addClass(component.find("divAsset2"), "slds-hide");
                        }
                        if(rslRec.CEA_Destination_Location__c!=undefined)
                        {
                        	component.set("v.taskinfo.CEA_Destination_Location__r.Name",rslRec.CEA_Destination_Location__r.Name);
                            $A.util.removeClass(component.find("divLoc1"), "slds-hide");
                            $A.util.addClass(component.find("divLoc2"), "slds-hide");
                        }
                        if(rslRec.CEA_Product__c!=undefined)
                        {
                            var selectedProductLookUp = {
                                'Id': rslRec.CEA_Product__c,
                                'Name':rslRec.CEA_Product__r.Name
                            };
                            component.set("v.selectedProductLookUp",selectedProductLookUp);
                            //component.set("v.taskinfo.CEA_Product__r.Name",rslRec.CEA_Product__r.Name);
                            //$A.util.removeClass(component.find("divPrd1"), "slds-hide");
                            //$A.util.addClass(component.find("divPrd2"), "slds-hide");
                        }
                        component.set("v.taskinfo.CEA_Machine_Type__c",rslRec.CEA_Machine_Type__c);
                        component.set("v.taskinfo.CEA_Model__c",rslRec.CEA_Model__c);
                        component.set("v.taskinfo.CEA_Movement_Type__c",rslRec.CEA_Movement_Type__c);
                        component.set("v.taskinfo.CEA_Outlet__c",rslRec.CEA_Outlet__c);
                        component.set("v.taskinfo.CEA_Service_Reason__c",rslRec.CEA_Service_Reason__c);
                        component.set("v.taskinfo.CEA_Tower_Type__c",rslRec.CEA_Tower_Type__c);
                        component.set("v.taskinfo.CEA_Type__c",rslRec.CEA_Type__c);
                        component.set("v.taskinfo.CEA_Work_Order__c",rslRec.CEA_Work_Order__c);
                        component.set("v.taskinfo.CEA_Asset_Family__c",rslRec.CEA_Asset_Family__c);
                        component.set("v.taskinfo.CEA_Brand__c ",rslRec.CEA_Brand__c);
                        component.set("v.taskinfo.CTS_Cancellation_Reason__c",rslRec.CTS_Cancellation_Reason__c);
                        component.set("v.taskinfo.Status",rslRec.Status);
                    }
                }else{
					console.log(stateValue);
					//alert("in callback error"+stateValue);
				}
            });
        }
        else
        {
            recordTypeID = component.get("v.recordTypeId");
			component.set("v.Oldtaskinfo",null);
        }   
        actionCall.setParams({recordTypeID:recordTypeID});
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();               
            if (stateValue === "SUCCESS") {
                //var resultInfo = response.getReturnValue() 
                var result = response.getReturnValue();  
                var BrandCovered = false;
                var BrandInfocount=0;
                var ceaRefrenceFieldInfocount=0;
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
                        for(var fieldkey in result[key])
                        {
                            var field =result[key][fieldkey];
                            
                            if(field.FieldName == 'CEA_Part_Item__c')
                            {
                                component.set("v.ceaAssetInfo",field);
                                //alert('Here') ;
                                ceaRefrenceFieldInfocount++;
                            }
                            else if(field.FieldName == 'CEA_Destination_Location__c')
                            {
                                component.set("v.ceaDestinationInfo",field);
                                ceaRefrenceFieldInfocount++
                            }
                            else if(field.FieldName == 'CEA_Product__c')
                            {
                                component.set("v.ceaAssetProductInfo",field);
                                
                                ceaRefrenceFieldInfocount++
                            }
                            if(ceaRefrenceFieldInfocount==3)
                            {
                                break;
                            }
                        }
						//alert("PriorBrandSectionInfoMap");                        
                    }
                    else
                    {
                        arrayMapKeys3.push({key: key, value: result[key]});
                        //alert("PostBrandSectionInfoMap");
                    }
                }
                component.set("v.PriorBrandSectionInfoMap",arrayMapKeys1); 
                component.set("v.BrandSectionInfoMap",arrayMapKeys2);  
                component.set("v.PostBrandSectionInfoMap",arrayMapKeys3);
                
                if(component.get("v.isAssetLines") && component.get("v.recordTypeId")!=undefined)
                { 
                    helper.fetchWorkOrder(component, event);
                }
                
            }});
        $A.enqueueAction(actionCall);
        
        $A.enqueueAction(actionCallgetRecTypeAndIDS); 
       
    },
    handleCancel :function(component, event, helper) {        
        helper.closeQuickActionAndRedirect(component, event);
    },    
    onSave : function(component, event, helper) {              
        helper.onSaveHelper(component, event, helper,false,false);
		if(!component.get("v.isAssetLines")){
            let recommendbutton = component.find('recommendPartsButtonTaskPage');
            
            let ifrecommendbuttonAlrdyhidden = $A.util.hasClass(recommendbutton, "slds-hide");
            
            if(!ifrecommendbuttonAlrdyhidden){
                recommendbutton.set('v.disabled',true);
            }
        }       
    },    
    onSaveNew : function(component, event, helper) {  
        helper.onSaveHelper(component, event, helper,true,false);
        if(!component.get("v.isAssetLines")){
            let recommendbutton = component.find('recommendPartsButtonTaskPage');
            
            let ifrecommendbuttonAlrdyhidden = $A.util.hasClass(recommendbutton, "slds-hide");
            
            if(!ifrecommendbuttonAlrdyhidden){
                recommendbutton.set('v.disabled',true);
            }
        }
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
        
        //helper.fetchWorkOrder2(component, event);
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
    //This fuction is to switch the display of CEA_Asset__c Field in Component
    toggleDisplayAsset :function(component, event, helper) {
        $A.util.addClass(component.find("divAsset1"), "slds-hide");
        $A.util.removeClass(component.find("divAsset2"), "slds-hide");
        component.find("CEA_Asset").set("v.value",null);
        
    },
    //This fuction is to switch the display of CEA_Destination_Location__c Field in Component
    toggleDisplayDestination :function(component, event, helper) {
        $A.util.addClass(component.find("divLoc1"), "slds-hide");
        $A.util.removeClass(component.find("divLoc2"), "slds-hide");
        component.find("CEA_Destination_Location").set("v.value",null);
        
    },
    //This fuction is to switch the display of CEA_Product__c Field in Component
    toggleAssetProduct :function(component, event, helper) {
        $A.util.addClass(component.find("divPrd1"), "slds-hide");
        $A.util.removeClass(component.find("divPrd2"), "slds-hide");
        component.find("CEA_Product").set("v.value",null);
        
    },
    CompSubTypeCheck :function(component, event, helper) {
        if(component.find("inputInfo") != null)
        {
            component.find("inputInfo").forEach(function callback(currentComp){ 
                if( (currentComp.get("v.fieldName") =='CTS_Component_Sub_Type_IN__c'))
                {
                    var componentSubTypeValues= $A.get("$Label.c.CTS_Python_Length_Warning");
                    
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
    
    },
    AssetFamilyCheck :function(component, event, helper) {
        var assetFamilyNew = event.getSource().get("v.value");
        var assetFamilyOld = component.get("v.taskinfo.CEA_Asset_Family__c");
        if(assetFamilyOld != assetFamilyNew)
        {
            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
            component.set("v.ErrorMsg",$A.get("$Label.c.CEA_Asset_Family_Change_Error"));
            let button1 = component.find('saverslButton');
            button1.set('v.disabled',true);
            let button2 = component.find('saveNewrslButton');
            button2.set('v.disabled',true);
            
        }else if (assetFamilyOld == assetFamilyNew)
        {
            $A.util.addClass(component.find("ErrorMsg"), "slds-hide");
            component.set("v.ErrorMsg","");
            let button1 = component.find('saverslButton');
            button1.set('v.disabled',false);
            let button2 = component.find('saveNewrslButton');
            button2.set('v.disabled',false);
        }
        
        
    
    },
    getPartsRecommendation :function(component, event, helper) {
        // Disabling the buttons while processing
    	let recommendbutton = component.find('recommendPartsButtonTaskPage');
        var backToPartsbutton1 = component.find('backTorecommendPartsPage');
        var ifbackbuttonAlrdyhidden1 = $A.util.hasClass(backToPartsbutton1, "slds-hide");
        recommendbutton.set('v.disabled',true);
        if(!ifbackbuttonAlrdyhidden1){
        	backToPartsbutton1.set('v.disabled',true);
        }
        var savePartsbutton = component.find('saverslButtonTask');
        var saveNewPartsbutton = component.find('saveNewrslButtonTask');
        var ifSavebuttonAlreadyhidden = $A.util.hasClass(savePartsbutton, "slds-hide");
        var ifSaveNbuttonAlrdyhidden = $A.util.hasClass(saveNewPartsbutton, "slds-hide");
        //alert('ifSavebuttonAlreadyhidden'+ifSavebuttonAlreadyhidden);
        //alert('ifSaveNbuttonAlrdyhidden'+ifSaveNbuttonAlrdyhidden);
        if(!ifSavebuttonAlreadyhidden){
            
            savePartsbutton.set('v.disabled',true);
        }
        if(!ifSaveNbuttonAlrdyhidden){
            saveNewPartsbutton.set('v.disabled',true);
        }
        
        
        // call helper to save the changes
    	helper.onSaveHelper(component, event, helper,false,true);
    },
    getBackToTaskPage :function(component, event, helper) {
        $A.util.removeClass(component.find("spn") , "slds-hide");
        
        //To set Initial rate card values:
        var actionCallgetrslInfo = component.get("c.rslRateCardInfo");
    	actionCallgetrslInfo.setParams({
                "rslId":component.get("v.taskinfo.Id")
            });
            actionCallgetrslInfo.setCallback(this, function(response) {
                var stateValue = response.getState();
                //alert("Not Success");
                if (stateValue === "SUCCESS") {
                    $A.util.addClass(component.find("spn") , "slds-hide");
                    var rslRec = response.getReturnValue();
                    if(component.find("inputInfo") != null)
                    {            
                        component.find("inputInfo").forEach(function callback(currentComp){                 
                            if( (currentComp.get("v.fieldName")=="CTS_Initial_Rate_Card__c"))
                        	{
                                
                                currentComp.set("v.value",rslRec.CTS_Initial_Rate_Card__c);
                            }
                            if( (currentComp.get("v.fieldName")=="CTS_Final_Rate_Card__c"))
                        	{
                                currentComp.set("v.value",rslRec.CTS_Final_Rate_Card__c);
                            }
                            if( (currentComp.get("v.fieldName")=="CTS_Total_Rate_Card_Initial__c"))
                        	{
                                currentComp.set("v.value",rslRec.CTS_Total_Rate_Card_Initial__c);
                            }
                            if( (currentComp.get("v.fieldName")=="CTS_Total_Rate_Card_Final__c"))
                        	{
                                currentComp.set("v.value",rslRec.CTS_Total_Rate_Card_Final__c);
                            }
            
                        }); 
                    } 
                }else{
                    console.log("Error: "+stateValue);
                }
            });
        if(!component.get("v.isEditMode"))
        {
        	
            $A.enqueueAction(actionCallgetrslInfo);
        }else{
            $A.util.addClass(component.find("spn") , "slds-hide");
        }
        component.find("partsScreen").resetisOnPartsFlag(true);
    	$A.util.removeClass(component.find("editForm"), "slds-hide");
        $A.util.addClass(component.find("partsView"), "slds-hide");
        
        //These two buttons are to save the parts directly when user navigates from parts page to Task page
        $A.util.removeClass(component.find("saveNewrslButtonTask"), "slds-hide"); 
        $A.util.removeClass(component.find("saverslButtonTask"), "slds-hide");
        
        //These two Task save buttons are hidden when user navigates from parts page to Task page
        $A.util.addClass(component.find("saveNewrslButton"), "slds-hide");
        $A.util.addClass(component.find("saverslButton"), "slds-hide");
        
        //$A.util.addClass(component.find("recommendPartsButtonTaskPage"), "slds-hide");
        
        $A.util.removeClass(component.find("backTorecommendPartsPage"), "slds-hide");
        
        let recommendbutton = component.find('recommendPartsButtonTaskPage');
        let backToPartsbutton = component.find('backTorecommendPartsPage');
        recommendbutton.set('v.disabled',false);
        backToPartsbutton.set('v.disabled',false);
        let savePartsbutton = component.find('saverslButtonTask');
        let saveNewPartsbutton = component.find('saveNewrslButtonTask');
        savePartsbutton.set('v.disabled',false);
        saveNewPartsbutton.set('v.disabled',false);
        
    },    
    onSaveParts : function(component, event, helper) {
        //
        let recommendbutton = component.find('recommendPartsButtonTaskPage');
        let backToPartsbutton = component.find('backTorecommendPartsPage');
        recommendbutton.set('v.disabled',true);
        backToPartsbutton.set('v.disabled',true);
        let savePartsbutton = component.find('saverslButtonTask');
        let saveNewPartsbutton = component.find('saveNewrslButtonTask');
        savePartsbutton.set('v.disabled',true);
        let ifSaveNbuttonAlrdyhidden = $A.util.hasClass(saveNewPartsbutton, "slds-hide");
        
        if(!ifSaveNbuttonAlrdyhidden){
            saveNewPartsbutton.set('v.disabled',true);
        }
        
        helper.onSavePartsHelper(component, event, helper,false);        
    },    
    onSaveNewParts : function(component, event, helper) { 
        let recommendbutton = component.find('recommendPartsButtonTaskPage');
        let backToPartsbutton = component.find('backTorecommendPartsPage');
        recommendbutton.set('v.disabled',true);
        backToPartsbutton.set('v.disabled',true);
        let savePartsbutton = component.find('saverslButtonTask');
        let saveNewPartsbutton = component.find('saveNewrslButtonTask');
        savePartsbutton.set('v.disabled',true);
        saveNewPartsbutton.set('v.disabled',true);
        
        helper.onSavePartsHelper(component, event, helper,true);
        
    },    
    closeComponent : function(component, event, helper) {  
        
        var recordSaved = event.getParam("RecordSaved");
        var isSaveAndNew = event.getParam("isSaveAndNew");
        if(recordSaved){
        	helper.closeQuickActionAndRedirect(component, event,isSaveAndNew);
        }
    },
    getbackToPartsPage :function(component, event, helper) {
        component.find("partsScreen").resetisOnPartsFlag(false);
    	$A.util.addClass(component.find("editForm"), "slds-hide");
        $A.util.removeClass(component.find("partsView"), "slds-hide");
            
    },
    displayErrorsFromPartsScreen : function(component, event, helper,isSaveAndNew) {
		alert('From Parts error;;;'+event.getParam("ErrorMsg"));
        var ErrorMsg = event.getParam("ErrorMsg");
        $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
		component.set("v.ErrorMsg",ErrorMsg);
        let recommendbutton = component.find('recommendPartsButtonTaskPage');
        let backToPartsbutton = component.find('backTorecommendPartsPage');
        recommendbutton.set('v.disabled',false);
        backToPartsbutton.set('v.disabled',false);
        let savePartsbutton = component.find('saverslButtonTask');
        let saveNewPartsbutton = component.find('saveNewrslButtonTask');
        savePartsbutton.set('v.disabled',false);
        saveNewPartsbutton.set('v.disabled',false);
                
        var saverslButtonTask = component.find('saverslButtonTask');
        var saveNewrslButtonTask = component.find('saveNewrslButtonTask');
        var ifSavebuttonAlreadyhidden = $A.util.hasClass(saverslButtonTask, "slds-hide");
        var ifSaveNbuttonAlrdyhidden = $A.util.hasClass(saveNewrslButtonTask, "slds-hide");
        //alert('ifSavebuttonAlreadyhidden'+ifSavebuttonAlreadyhidden);
        //alert('ifSaveNbuttonAlrdyhidden'+ifSaveNbuttonAlrdyhidden);
        if(ifSavebuttonAlreadyhidden){
            
            $A.util.removeClass(component.find("saverslButtonTask"), "slds-hide");
        }
        if(ifSaveNbuttonAlrdyhidden){
            $A.util.removeClass(component.find("saveNewrslButtonTask"), "slds-hide");
        }
        
        
 
    }
})