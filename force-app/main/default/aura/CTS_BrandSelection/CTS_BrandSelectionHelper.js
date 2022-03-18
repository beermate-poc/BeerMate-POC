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
    onSaveHelper : function(component, event,helper,isSaveAndNew,isRecommendParts) {   
        var error = false;
        var buttonSAve1 = component.find('saverslButton');
        let ifbuttonAlreadyhidden = $A.util.hasClass(buttonSAve1, "slds-hide");
        var buttonSaveN2 = component.find('saveNewrslButton');
        
        
        if(!ifbuttonAlreadyhidden){
            buttonSAve1.set('v.disabled',true);
            buttonSaveN2.set('v.disabled',true);
        }
        
        
        if(component.get("v.selectedProductLookUp") != null && component.get("v.selectedProductLookUp") != undefined)
        {            
            //alert(component.get("v.selectedProductLookUp.Id"));                 
            component.set("v.taskinfo.CEA_Product__c",component.get("v.selectedProductLookUp.Id"));            
            
        }
        if(component.get("v.selectedPartItemLookUp") != null && component.get("v.selectedPartItemLookUp") != undefined)
        {            
            //alert(component.get("v.selectedPartItemLookUp.Id"));                 
            component.set("v.taskinfo.CEA_Part_Item__c",component.get("v.selectedPartItemLookUp.Id"));            
            
        }
        
        if(component.find("inputInfo") != null)
        {
            component.find("inputInfo").forEach(function callback(currentComp){ 
                if(currentComp.get("v.class")!=undefined && currentComp.get("v.class").includes("fieldrequired") && (currentComp.get("v.value")==undefined || currentComp.get("v.value")==""))
                {
                    //alert("inputInfo"+currentComp.get("v.value"));
                    $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    component.set("v.ErrorMsg","Required fields must be completed"); 
                    error=true;
                    helper.enableAllTheButtonsOnError(component, event);
                    return;
                }
                if( (currentComp.get("v.fieldName")!='CTS_Brand_IN__c') && (currentComp.get("v.fieldName")!='CTS_Brand_OUT__c') )
                    component.set("v.taskinfo."+currentComp.get("v.fieldName"),currentComp.get("v.value"));          
            });
        }
        if(error)
        {
            helper.enableAllTheButtonsOnError(component, event);
            return;
        }
        if(component.find("customInputInfo") != null)
        {            
            component.find("customInputInfo").forEach(function callback(currentComp){                 
                component.set("v.taskinfo."+currentComp.get("v.name"),currentComp.get("v.value"));            
            }); 
        }   
        
        if(component.get("v.parentRecordId")!=undefined)
        {
            component.set("v.taskinfo.WorkOrderId", component.get("v.parentRecordId"));
            if(component.get("v.isAssetLines"))
            { 
            	component.set("v.taskinfo.CEA_Work_Order__c", component.get("v.parentRecordId"));
            }
        }
        if(component.get("v.recordTypeId")!=undefined)
            component.set("v.taskinfo.RecordTypeId", component.get("v.recordTypeId"));        
        
        //check for required field
        component.get("v.PriorBrandSectionInfoMap").forEach(
            function sectionLoop(sectionItem){
                sectionItem.value.forEach(
                    function requireCheck(item){
                        if(item.FieldRequired && (component.get("v.taskinfo."+item.FieldName) == undefined || component.get("v.taskinfo."+item.FieldName) == "") )
                        {
                            //alert("PriorBrandSectionInfoMap"+component.get("v.taskinfo."+item.FieldName)+item.FieldName);
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                            component.set("v.ErrorMsg","Required fields must be completed"); 
                            error=true;
                            helper.enableAllTheButtonsOnError(component, event);
                            return;
                        }
                    }
                );
            }
        );
        component.get("v.BrandSectionInfoMap").forEach(
            function sectionLoop(sectionItem){
                sectionItem.value.forEach(
                    function requireCheck(item){
                        if(item.FieldRequired && (component.get("v.taskinfo."+item.FieldName) == undefined || component.get("v.taskinfo."+item.FieldName) == "") )
                        {
                            //alert("BrandSectionInfoMap"+component.get("v.taskinfo."+item.FieldName));
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                            component.set("v.ErrorMsg","Required fields must be completed"); 
                            error=true;
                            helper.enableAllTheButtonsOnError(component, event);
                            return;
                        }
                    }
                );
            }
        );
        component.get("v.PostBrandSectionInfoMap").forEach(
            function sectionLoop(sectionItem){
                sectionItem.value.forEach(
                    function requireCheck(item){
                        if(item.FieldRequired && (component.get("v.taskinfo."+item.FieldName) == undefined || component.get("v.taskinfo."+item.FieldName) == "") )
                        {
                            //alert("PostBrandSectionInfoMap"+component.get("v.taskinfo."+item.FieldName));
                            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                            component.set("v.ErrorMsg","Required fields must be completed"); 
                            error=true;
                            helper.enableAllTheButtonsOnError(component, event);
                            return;
                        }
                    }
                );
            }
        );
        
        //Find if any Changes on Edit mode for CTS
        if(!component.get("v.isAssetLines")){
        	helper.lookForAnyChanges(component, event);
        }
        
        
        var taskToUpsert;
        var jsonTask;
        var wol;
        //jsonTask.sobjectType = 'WorkOrderLineItem';
        if(component.get("v.isEditMode"))
        {
        	wol = component.get("v.taskinfo");
            wol.CTS_Brand_IN__r = null;
                wol.CTS_Brand_OUT__r = null;
                wol.CEA_Destination_Location__r = null;
                wol.CEA_Part_Item__r = null;
                wol.CEA_Product__r = null;
            
            jsonTask = JSON.stringify(wol);
            //alert(jsonTask);
            taskToUpsert = component.get("v.taskinfo");
        }else{
             taskToUpsert = component.get("v.taskinfo");
             jsonTask = null;
        }
        
        var actionCall = component.get("c.rslUpdate");
        actionCall.setParams({
            taskRecord:jsonTask,
            rslRecord:taskToUpsert
            
                              });
        //alert('Params---'+actionCall.getParams('taskRecord'));
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var resultInfo = response.getReturnValue();
                if(resultInfo.split("_")[0] === "success")
                {
                    component.set("v.taskinfo.Id",resultInfo.split("_")[1]);
                    if((component.get("v.runRecommendation")) || isRecommendParts){
                    	helper.getRecommendedParts(component, event,helper,resultInfo.split("_")[1],isRecommendParts);
                    }
                    if(!isRecommendParts){
                        setTimeout(
                        $A.getCallback(function() {
                    	helper.closeQuickActionAndRedirect(component, event,isSaveAndNew);}),3000);
                    	//helper.closeQuickActionAndRedirect(component, event,isSaveAndNew);
                    }
                    var evnT = $A.get("event.force:showToast");
                    evnT.setParams({
                        "title":component.get("v.isAssetLines") ? "WorkOrderLineItem:":"Technician Task:",
                        "message":"Record Saved Successfully !",
                        "type":"success"
                        
                    });
                    evnT.fire();
                    
                }
                else{
                    $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                    component.set("v.ErrorMsg",response.getReturnValue()); 
                } 
            }else
            {
                //alert(stateValue);
                $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                var errors = response.getError();
                
                component.set("v.ErrorMsg",errors[0].message+" Please Contact Admin For Support.");
            } 
            helper.enableAllTheButtonsOnError(component, event);
        });
        if(!(component.get("v.runRecommendation")) && isRecommendParts){
            error = true;
            $A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
            component.set("v.ErrorMsg","No changes found in the record to perform the action.");
            helper.enableAllTheButtonsOnError(component, event);
            //component.set("v.runRecommendation",false);
        }
        if(!error)
        {
        	$A.enqueueAction(actionCall);
        }
        
    },
    closeQuickActionAndRedirect :function(component, event,isSaveAndNew) {
        var urlEvent;
        /*
        if((component.get("v.recordId")).startsWith("1WL"))
        {
            component.set("v.recordId",null); 
        }
        */
        if($A.get("$Browser.isDesktop"))
        {
            //alert(isSaveAndNew);
            if(isSaveAndNew)                    
            {
                
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:CTS_RSLRecordTypeSelection",
                    componentAttributes: {
                        parentRecordId : component.get("v.parentRecordId")
                    },
                    isredirect : true
                });
                $A.get('e.force:refreshView').fire();
                evt.fire();
            }
            else
            {
                //window.parent.location = '/' +  ($A.util.isEmpty(component.get("v.parentRecordId"))? (component.get("v.recordId")) : (component.get("v.parentRecordId")));
                urlEvent = $A.get("e.force:navigateToRelatedList");
                urlEvent.setParams({
                    "parentRecordId": component.get("v.parentRecordId"),
                    "relatedListId": component.get("v.isAssetLines") ? "CEAWork_Order_Line_Items__r":"WorkOrderLineItems"
                });
                urlEvent.fire();
                $A.get('e.force:refreshView').fire();
            }
        }
        else
        {
            
              //alert(isSaveAndNew);
            if(isSaveAndNew)                    
            {
                
                var evt = $A.get("e.force:navigateToComponent");
                evt.setParams({
                    componentDef : "c:CTS_RSLRecordTypeSelection",
                    componentAttributes: {
                        parentRecordId : component.get("v.parentRecordId")
                    },
                    isredirect : true
                });
                $A.get('e.force:refreshView').fire();
                evt.fire();
            }
            else
            {
                //window.parent.location = '/' +  ($A.util.isEmpty(component.get("v.parentRecordId"))? (component.get("v.recordId")) : (component.get("v.parentRecordId")));
                urlEvent = $A.get("e.force:navigateToRelatedList");
                urlEvent.setParams({
                    "parentRecordId": ($A.util.isEmpty(component.get("v.parentRecordId"))? (component.get("v.recordId")) : (component.get("v.parentRecordId"))),
                    "relatedListId": component.get("v.isAssetLines") ? "CEAWork_Order_Line_Items__r":"WorkOrderLineItems"
                });
                urlEvent.fire();
                var cmpEvent = component.getEvent("RecordSavedEvent"); 
                //Set event attribute value
                cmpEvent.setParams({"RecordSaved" : true}); 
                cmpEvent.fire();
                setTimeout(
                    $A.getCallback(function() { $A.get('e.force:refreshView').fire(); }), 1000); 
            }
            
            
            /*
            urlEvent = $A.get("e.force:navigateToRelatedList");
            urlEvent.setParams({
                "parentRecordId": ($A.util.isEmpty(component.get("v.parentRecordId"))? (component.get("v.recordId")) : (component.get("v.parentRecordId"))),
                "relatedListId": "WorkOrderLineItems"
            });
             urlEvent.fire();
            setTimeout(
                $A.getCallback(function() { $A.get('e.force:refreshView').fire(); }), 1000); 
        //$A.get('e.force:refreshView').fire();
        //*/
        //
            
        }
        
    },
    fetchWorkOrder :function(component, event) {
    	var actionCall = component.get("c.workOrderInfo");
        actionCall.setParams({woid:component.get("v.parentRecordId")});
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                var parentWO = response.getReturnValue();
                 
                component.set("v.taskinfo.CEA_Outlet__c",parentWO.AccountId);
                component.set("v.taskinfo.CEA_Asset_Family__c",parentWO.RecordType.Name);
                //alert("Outlet ID----"+component.get("v.taskinfo.CEA_Outlet__c"));
                
                if(component.find("inputInfo") != null)
                {
                    //alert("inputInfo loop1"); 
                    component.find("inputInfo").forEach(function callback(currentComp){ 
                        //alert("inputInfo loop2");
                        if( (currentComp.get("v.fieldName")=="CEA_Asset_Family__c"))
                        {
                            currentComp.set("v.value",parentWO.RecordType.Name); 
                            //alert("parentWO.RecordType.Name----"+ currentComp.get("v.value"));
                            
                        }
                    });
                }
               
            }
        });
        $A.enqueueAction(actionCall);
        
    },
    getRecommendedParts : function(component, event, helper,taskid,isOnParts) {
        if(isOnParts){
            $A.util.removeClass(component.find("partsView"), "slds-hide");
            $A.util.addClass(component.find("editForm"), "slds-hide");
        }
        component.find("partsScreen").callInit(component.get("v.Oldtaskinfo"),taskid,isOnParts);
    
    },
    onSavePartsHelper : function(component, event, helper,isSaveAndNew) {
        
        component.find("partsScreen").processResult(isSaveAndNew);
 
    },
    lookForAnyChanges : function(component, event) {
        //alert('recomendation check parentRecordId'+component.get("v.parentRecordId"));
        //alert('recomendation check Oldtaskinfo'+component.get("v.Oldtaskinfo"));
        if(component.get("v.Oldtaskinfo") != undefined && component.get("v.Oldtaskinfo") != null)
        {
            //alert('recomendation check loop123');
            
            let oldCmpIn =component.get("v.Oldtaskinfo.CTS_Component_IN__c") ;
            let oldCmpOut =component.get("v.Oldtaskinfo.CTS_Component_OUT__c") ;  
            let CmpIn =component.get("v.taskinfo.CTS_Component_IN__c") ;  
            let CmpOut =component.get("v.taskinfo.CTS_Component_OUT__c") ;
            let oldCmpSubIn =component.get("v.Oldtaskinfo.CTS_Component_Sub_Type_IN__c") ;
            let oldCmpSubOut =component.get("v.Oldtaskinfo.CTS_Component_Sub_Type_OUT__c") ;  
            let CmpSubIn =component.get("v.taskinfo.CTS_Component_Sub_Type_IN__c") ;  
            let CmpSubOut =component.get("v.taskinfo.CTS_Component_Sub_Type_OUT__c") ;
            let oldBrandIn =component.get("v.Oldtaskinfo.CTS_Brand_IN__c") ;
            let oldBrandOut =component.get("v.Oldtaskinfo.CTS_Brand_OUT__c") ;
            let oldDisplayIn =component.get("v.Oldtaskinfo.CTS_Brand_Display_IN__c") ;
            let oldDisplayOut =component.get("v.Oldtaskinfo.CTS_Brand_Display_OUT__c") ;
            let oldDispenseIn =component.get("v.Oldtaskinfo.CTS_Brand_Dispense_IN__c") ;
            let oldDispenseOut =component.get("v.Oldtaskinfo.CTS_Brand_Dispense_OUT__c") ;
            let oldHandle =component.get("v.Oldtaskinfo.CTS_Handle_Type__c") ;
            let oldQuantity =component.get("v.Oldtaskinfo.CTS_Quantity__c") ;
            let newQuantity =component.get("v.taskinfo.CTS_Quantity__c") ;
            //alert('oldQuantity--'+oldQuantity+'--newQuantity--'+newQuantity);
            
            if((oldBrandIn != component.get("v.taskinfo.CTS_Brand_IN__c") && oldBrandIn != undefined) || (oldBrandOut != component.get("v.taskinfo.CTS_Brand_OUT__c") && oldBrandOut != undefined) || (oldDispenseIn != component.get("v.taskinfo.CTS_Brand_Dispense_IN__c") && oldDispenseIn != undefined) || (oldDispenseOut != component.get("v.taskinfo.CTS_Brand_Dispense_OUT__c") && oldDispenseOut != undefined) || (oldDisplayIn != component.get("v.taskinfo.CTS_Brand_Display_IN__c") && oldDisplayIn != undefined) || (oldDisplayOut != component.get("v.taskinfo.CTS_Brand_Display_OUT__c") && oldDisplayOut != undefined) || (oldHandle != component.get("v.taskinfo.CTS_Handle_Type__c") && oldHandle != undefined) || (oldCmpIn != CmpIn && oldCmpIn != undefined) || (oldCmpOut != CmpOut && oldCmpOut != undefined) || (oldCmpSubIn != CmpSubIn && oldCmpSubIn != undefined) || (oldCmpSubOut != CmpSubOut && oldCmpSubOut != undefined) || (oldQuantity != newQuantity && oldQuantity != undefined)){
                component.set("v.runRecommendation",true);
                //alert('recomendation is true');
                $A.util.addClass(component.find("ErrorMsg"), "slds-hide");
            	component.set("v.ErrorMsg","");
            }else{
                component.set("v.runRecommendation",false);
                //alert('recomendation is false');
                
            }
            
            
        }
 
    },
    enableAllTheButtonsOnError : function(component, event) {
        
        	let button1 = component.find('saverslButton');
            button1.set('v.disabled',false);
            let button2 = component.find('saveNewrslButton');
            button2.set('v.disabled',false);
            let recommendbutton = component.find('recommendPartsButtonTaskPage');
            let backToPartsbutton = component.find('backTorecommendPartsPage');
            let savePartsbutton = component.find('saverslButtonTask');
            let saveNewPartsbutton = component.find('saveNewrslButtonTask');
            savePartsbutton.set('v.disabled',false);
            saveNewPartsbutton.set('v.disabled',false);
            recommendbutton.set('v.disabled',false);
            backToPartsbutton.set('v.disabled',false);
        
        var saverslButtonTask = component.find('saverslButtonTask');
        var saveNewrslButtonTask = component.find('saveNewrslButtonTask');
        var ifSavebuttonAlreadyhidden = $A.util.hasClass(saverslButtonTask, "slds-hide");
        var ifSaveNbuttonAlrdyhidden = $A.util.hasClass(saveNewrslButtonTask, "slds-hide");
        var device = $A.get("$Browser.isDesktop");
        //alert('ifSavebuttonAlreadyhidden'+ifSavebuttonAlreadyhidden);
        //alert('ifSaveNbuttonAlrdyhidden'+ifSaveNbuttonAlrdyhidden);
        if(!ifSavebuttonAlreadyhidden){ 
            $A.util.addClass(component.find("saverslButtonTask"), "slds-hide");
        }
        if(!ifSaveNbuttonAlrdyhidden){
            $A.util.addClass(component.find("saveNewrslButtonTask"), "slds-hide");
        }
        
        var saverslButton = component.find('saverslButton');
        var saveNewrslButton = component.find('saveNewrslButton');
        var ifSavebuttonAlreadyhiddenOld = $A.util.hasClass(saverslButton, "slds-hide");
        var ifSaveNbuttonAlrdyhiddenOld = $A.util.hasClass(saveNewrslButton, "slds-hide");
        //alert('ifSavebuttonAlreadyhidden'+ifSavebuttonAlreadyhidden);
        //alert('ifSaveNbuttonAlrdyhidden'+ifSaveNbuttonAlrdyhidden);
        if(ifSavebuttonAlreadyhiddenOld){
            
            $A.util.removeClass(component.find("saverslButton"), "slds-hide");
        }
        
        //alert('Device===='+device);
        if(ifSaveNbuttonAlrdyhiddenOld && device){
            $A.util.removeClass(component.find("saveNewrslButton"), "slds-hide");
        }
 
    }
})