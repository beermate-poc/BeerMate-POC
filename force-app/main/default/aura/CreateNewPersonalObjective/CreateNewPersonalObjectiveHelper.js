/*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
6/21/2017    Nick Serafin       Initial Creation
------------------------------------------------------------*/
({
    /*------------------------------------------------------------
	Author:        Jacqueline Passehl	
	Company:       Slalom, LLC
	Description:   Uses the selected MBO Planned Objective id from the SearchValueChange event in
				   Product Search component to return the object.

	History
	<Date>      <Authors Name>     	 <Brief Description of Change>
	4/3/2018    Jacqueline Passehl    Initial Creation
	------------------------------------------------------------*/
    getObjectFromId : function(component,event,helper){
        var action = component.get("c.getPlannedObjective");
        //for re-querying in edit mode
        if(!component.get("v.selectedMBOId")){
            action.setParams({
                "objectId" :component.get("v.newObjective.Planned_Objective__r.Id"),
            });
        } else {
            action.setParams({
                "objectId" : component.get("v.selectedMBOId"),
            });
        }
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                component.set("v.MBOobject",a.getReturnValue());
                component.set("v.selectedMBOId",a.getReturnValue().Id)
            } else {
                var errors = a.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + 
                                      errors[0].message);
                    }
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    /*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Validates the inputs on the page and displays error messages if there are issues found.
				   If no issues are found the apex controller method insertRecords() is called to insert the 
				   planned objective and objective records.

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       Initial Creation
	2/22/2018	Jacqueline Passehl	Seperated validate methods into two- one for editing and oen for adding new objective
	------------------------------------------------------------*/
    validateObjective : function(component, ignoreDuplicateCheck) {
        //if we are adding a new objective
        if(component.get("v.editingObjective") == false){
            this.createNewObjective(component,ignoreDuplicateCheck);
        }
        // we are editng an existing objective
        if(component.get("v.editingObjective")==true){
            this.editingExistingObjective(component);
        }
    },
    createNewObjective : function (component,ignoreDuplicateCheck) {
        try{
            if(navigator.onLine){
                if(ignoreDuplicateCheck && $A.get("$Browser.formFactor") != 'DESKTOP'){
                    component.set("v.showCreatePersonal", true);
                    component.set("v.showDuplicate", false);
                }
                var MBOSelected = false;
                var errorsFound = false;
                var objectiveType = component.get("v.objectiveType");
                if(objectiveType == 'Placement' && (component.get("v.objectiveSubType")==$A.get("$Label.c.Default_Picklist_Select") ||  (component.get("v.objectiveSubType"))=="")){
                    this.displayToast($A.get("$Label.c.Warning"),$A.get("$Label.c.BMC_Create_Objectives_ProductLevel_Error"), 'warning'); 
                    component.set("v.errorsFound",true);
                    errorsFound=true;
                    return;
                }
                var isOffPrem = component.get("v.isOffPrem");
                if ((component.find("objectiveTypePicklist").get("v.value") == null) || (component.find("objectiveTypePicklist").get("v.value") == "")) {
                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Type_Error"), 'warning');
                    component.set("v.errorsFound",true);
                    errorsFound=true;
                    return;
                }
                if ((component.find("objectiveName").get("v.value") == null) || (component.find("objectiveName").get("v.value") == "")) {
                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Name_Error"), 'warning');
                    component.set("v.errorsFound",true);
                    errorsFound=true;
                    return;
                }
                if(component.find("MBOPlannedObj")){
                    if(component.find("MBOPlannedObj").get("v.selectedId") != null
                       && component.find("MBOPlannedObj").get("v.searchValue")){
                        MBOSelected = true;
                        var selectedId = component.find("MBOPlannedObj").get("v.selectedId");
                        component.set("v.selectedMBOId",selectedId);
                    }
                    else{
                        MBOSelected=false;
                    }
                }
                if(MBOSelected==false){
                    if ((component.find("startDate").get("v.value") == null) || (component.find("endDate").get("v.value") == null)) {
                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Date_Error"), 'warning');
                        component.set("v.errorsFound",true);
                        errorsFound=true;
                        return;
                    }
                    if(component.find("startDate").get("v.value") > component.find("endDate").get("v.value")){
                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Start_Date_After_End_Date"), 'warning');
                        component.set("v.errorsFound",true);
                        errorsFound=true;
                        return;
                    }
                }
                if(component.find(objectiveType + "goal") != null){
                    var goalLength = component.find(objectiveType + "goal");
                    var index = goalLength.length - 1;
                    if(goalLength.length > 0){
                        if((component.find(objectiveType + "goal")[index].get("v.value") != null) && (isNaN(component.find(objectiveType + "goal")[index].get("v.value")))){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_New_Personal_Obj_Goal_Error"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    } else {
                        if((component.find(objectiveType + "goal").get("v.value") != null) && (isNaN(component.find(objectiveType + "goal").get("v.value")))){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_New_Personal_Obj_Goal_Error"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    }
                }
                if(component.find(objectiveType + "brandSearch") != null){
                    var brandComp = component.find(objectiveType + "brandSearch");
                    var index = brandComp.length - 1;
                    if(brandComp.length > 0){
                        if ((component.find(objectiveType + "brandSearch")[index].get("v.searchValue") == null) || (component.find(objectiveType + "brandSearch")[index].get("v.searchValue") == "")) {
                            if(objectiveType == 'Placement' && (component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroupPackage") || component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroup"))){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_Create_Objectives_BrandGroup_Error"), 'warning');
                            }
                            else if(objectiveType == 'Placement' && (component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Brand_Family_Package"))){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_Create_Objectives_BrandFamily_Error"), 'warning');
                            }
                                else{
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Brand_Error"), 'warning');
                                }
                            component.set("v.errorsFound",true);
                            errorsFound=true
                            return;
                        }
                    } else {
                        if ((component.find(objectiveType + "brandSearch").get("v.searchValue") == null) || (component.find(objectiveType + "brandSearch").get("v.searchValue") == "")) {
                            if(objectiveType == 'Placement' && (component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroupPackage") || component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroup"))){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_Create_Objectives_BrandGroup_Error"), 'warning');
                            }
                            else if(objectiveType == 'Placement' && (component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Brand_Family_Package"))){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_Create_Objectives_BrandFamily_Error"), 'warning');
                            }
                                else{
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Brand_Error"), 'warning');
                                }							
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    }
                }
                if(objectiveType == 'Display' || (objectiveType == 'Feature' && isOffPrem)){
                    if(component.find(objectiveType + "brandSearch") != null){
                        var brandComp = component.find(objectiveType + "brandSearch");
                        var index = brandComp.length - 1;
                        if(brandComp.length > 0){
                            if(component.find(objectiveType + "brandSearch")[index].find("selectOptions") != null){
                                if((component.find(objectiveType + "brandSearch")[index].get("v.searchValue") != null) || (component.find(objectiveType + "brandSearch")[index].get("v.searchValue") != "")){
                                    if((component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value") == null) || (component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value") == "")){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error"), 'warning');
                                        component.set("v.errorsFound",true);
                                        errorsFound=true;
                                        return;
                                    }
                                }
                            }
                        } else {
                            if(component.find(objectiveType + "brandSearch").find("selectOptions") != null){
                                if((component.find(objectiveType + "brandSearch").get("v.searchValue") != null) || (component.find(objectiveType + "brandSearch").get("v.searchValue") != "")){
                                    if((component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value") == null) || (component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value") == "")){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error"), 'warning');
                                        component.set("v.errorsFound",true);
                                        errorsFound=true;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                if(objectiveType == 'Placement' && (component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroupPackage") || component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandPackage") || component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Brand_Family_Package"))){
                    if(component.find(objectiveType + "brandSearch") != null){
                        var brandComp = component.find(objectiveType + "brandSearch");
                        var index = brandComp.length - 1;
                        if(brandComp.length > 0){
                            if(component.find(objectiveType + "brandSearch")[index].find("selectOptions") != null){
                                if((component.find(objectiveType + "brandSearch")[index].get("v.searchValue") != null) || (component.find(objectiveType + "brandSearch")[index].get("v.searchValue") != "")){
                                    if((component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value") == null) || (component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value") == "")){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error"), 'warning');
                                        component.set("v.errorsFound",true);
                                        errorsFound=true;
                                        return;
                                    }
                                }
                            }
                        } else {
                            if(component.find(objectiveType + "brandSearch").find("selectOptions") != null){
                                if((component.find(objectiveType + "brandSearch").get("v.searchValue") != null) || (component.find(objectiveType + "brandSearch").get("v.searchValue") != "")){
                                    if((component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value") == null) || (component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value") == "")){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error"), 'warning');
                                        component.set("v.errorsFound",true);
                                        errorsFound=true;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
                   if(objectiveType == 'Sampling'){
                   /* if(component.find(objectiveType + "brandSearch") != null){
                        var brandComp = component.find(objectiveType + "brandSearch");
                        var index = brandComp.length - 1;
                        if(brandComp.length > 0){
                            if(component.find(objectiveType + "brandSearch")[index].find("selectOptions") != null){
                                if((component.find(objectiveType + "brandSearch")[index].get("v.searchValue") != null) || (component.find(objectiveType + "brandSearch")[index].get("v.searchValue") != "")){
                                    if((component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value") == null) || (component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value") == "")){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error"), 'warning');
                                        component.set("v.errorsFound",true);
                                        errorsFound=true;
                                        return;
                                    }
                                }
                            }
                        } else {
                            if(component.find(objectiveType + "brandSearch").find("selectOptions") != null){
                                if((component.find(objectiveType + "brandSearch").get("v.searchValue") != null) || (component.find(objectiveType + "brandSearch").get("v.searchValue") != "")){
                                    if((component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value") == null) || (component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value") == "")){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error"), 'warning');
                                        component.set("v.errorsFound",true);
                                        errorsFound=true;
                                        return;
                                    }
                                }
                            }
                        }
                    }*/
                /* if(component.find("SamplingDol") != null){
                    var quantityLength = component.find("SamplingDol");
                    var index = quantityLength.length - 1;
                    if(quantityLength.length > 0){
                        if((component.find("SamplingDol")[index].get("v.value") == null) || (component.find("SamplingDol")[index].get("v.value") <= 0) || (isNaN(component.find("SamplingDol")[index].get("v.value")))){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Quantity_Error"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    } else {
                        if((component.find("SamplingDol").get("v.value") == null) || (component.find("SamplingDol").get("v.value") <= 0) || (isNaN(component.find("SamplingDol").get("v.value")))){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Quantity_Error"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    }
                }*/
                       
                }
                if(component.find(objectiveType + "draftCbox") != null && (objectiveType == 'Feature' && !isOffPrem)){
                    var checkBox = component.find(objectiveType + "draftCbox");
                    var index = checkBox.length - 1;
                    if(checkBox.length > 0){
                        var dCbox = component.find(objectiveType + "draftCbox")[index].get("v.checked");
                        var cCbox = component.find(objectiveType + "canCbox")[index].get("v.checked");
                        var gCbox = component.find(objectiveType + "glassCbox")[index].get("v.checked");
                        var aCbox = component.find(objectiveType + "alumCbox")[index].get("v.checked");
                        if (!dCbox && !cCbox && !gCbox && !aCbox) {
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error_Multi"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    } else {
                        var dCbox = component.find(objectiveType + "draftCbox").get("v.checked");
                        var cCbox = component.find(objectiveType + "canCbox").get("v.checked");
                        var gCbox = component.find(objectiveType + "glassCbox").get("v.checked");
                        var aCbox = component.find(objectiveType + "alumCbox").get("v.checked");
                        if (!dCbox && !cCbox && !gCbox && !aCbox) {
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Package_Error_Multi"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    }
                }
                if(component.find(objectiveType + "quantity") != null){
                    var quantityLength = component.find(objectiveType + "quantity");
                    var index = quantityLength.length - 1;
                    if(quantityLength.length > 0){
                        if((component.find(objectiveType + "quantity")[index].get("v.value") == null) || (component.find(objectiveType + "quantity")[index].get("v.value") <= 0) || (isNaN(component.find(objectiveType + "quantity")[index].get("v.value")))){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Quantity_Error"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    } else {
                        if((component.find(objectiveType + "quantity").get("v.value") == null) || (component.find(objectiveType + "quantity").get("v.value") <= 0) || (isNaN(component.find(objectiveType + "quantity").get("v.value")))){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Quantity_Error"), 'warning');
                            component.set("v.errorsFound",true);
                            errorsFound=true;
                            return;
                        }
                    }
                }
                
                if (!errorsFound) {
                    component.set("v.errorsFound",false);
                    var spinner = component.find("spinner");
                    $A.util.removeClass(spinner, "slds-hide");
                    var brandField = '';
                    var packageField = '';
                    if(component.find(objectiveType + "brandSearch") != null){
                        var brandComp = component.find(objectiveType + "brandSearch");
                        var index = brandComp.length - 1;
                        if(brandComp.length > 0){
                            brandField = component.find(objectiveType + "brandSearch")[index].get("v.searchValue");
                            if(objectiveType == 'Placement' || objectiveType == 'Display' || (objectiveType == 'Feature' && isOffPrem)){
                                if(component.find(objectiveType + "brandSearch")[index].find("selectOptions") != null){
                                    packageField = component.find(objectiveType + "brandSearch")[index].find("selectOptions").get("v.value");
                                }
                            }
                        } else {
                            brandField = component.find(objectiveType + "brandSearch").get("v.searchValue");
                            if(objectiveType == 'Placement' || objectiveType == 'Display' || (objectiveType == 'Feature' && isOffPrem)){
                                if(component.find(objectiveType + "brandSearch").find("selectOptions") != null){
                                    packageField = component.find(objectiveType + "brandSearch").find("selectOptions").get("v.value");
                                }
                            }
                        }
                    }
                    var objective = component.get("v.newObjective");
                    if(component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroupPackage") || component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Objectives_BrandGroup")){
                        objective.BMC_Brand_Group__c=brandField.trim();
                    }                   
                    if(component.get("v.objectiveSubType")==$A.get("$Label.c.BMC_Brand_Family_Package")){
                        objective.BMC_Brand_Family__c = brandField.trim(); 
                    }                    
                    else{
                        objective.Brands__c = brandField.trim(); 
                    }
                    
                    if(objectiveType == 'Placement'){
                        objective.BMC_Product_Level__c=component.get("v.objectiveSubType");
                    }
                    if(objectiveType == 'Sampling'){
                     objective.Sampling_Dollar__c=component.find("Samplingdol").get("v.value");
                    }
                    
                    objective.MC_Product__c = packageField;
                    objective.Is_Template__c = true;
                    objective.Planned_Objective__c = component.get("v.plannedObjective");
                    objective.Objectives_Premise_Type__c = component.get("v.objectivePremiseType");
                    component.set("v.newObjective", objective);
                    var action = component.get("c.checkDuplicates");
                    action.setParams({
                        "objective": component.get("v.newObjective"),
                        "parent": component.get("v.plannedObjective"),
                        "objectiveType" : component.get("v.objectiveType"),
                        "ignoreDuplicateCheck" : ignoreDuplicateCheck
                    });
                    action.setCallback(this, function(a) {
                        if (a.getState() === "SUCCESS") {
                            $A.util.addClass(spinner, "slds-hide");
                            // the return value of the action is a Planned_Objective__c if a duplicate was found, so that we can
                            // display the duplicate's details on the client side, otherwise it's null
                            var duplicate = a.getReturnValue();
                            if(duplicate != null){
                                component.set("v.duplicateFound",true);
                                this.displayToast($A.get("$Label.c.Information"),$A.get("$Label.c.Create_Objectives_Duplicate_Found"), 'info')
                                component.set("v.duplicatePlannedObjective", duplicate);
                            } else {
                                component.set("v.duplicateFound",false);
                            }
                        } 
                        else if (a.getState() === "ERROR") {
                            $A.util.addClass(spinner, "slds-hide");
                            var errors = a.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.log("Error message: " + 
                                                errors[0].message);
                                }
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                console.log("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                }
            } else {
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    editingExistingObjective: function(component)
    {
        var errorsFound = false;
        if ((component.find("objectiveNameEdit").get("v.value") == null) || (component.find("objectiveNameEdit").get("v.value") == "")) {
            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Name_Error"), 'warning');
            component.set("v.errorsFound",true);
            errorsFound = true;
            return;
        }
        if(component.get("v.selectedMBOId")==''){
            if ((component.find("startDateEdit").get("v.value") == null) || (component.find("endDateEdit").get("v.value") == null)) {
                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objectives_Date_Error"), 'warning');
                component.set("v.errorsFound",true);
                errorsFound = true;
                return;
            }
            if(component.find("startDateEdit").get("v.value") > component.find("endDateEdit").get("v.value")){
                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Start_Date_After_End_Date"), 'warning');
                component.set("v.errorsFound",true);
                errorsFound=true;
                return;
            }
            //if user removed selectedMBO field-name field will be gone
            if(component.get("v.newObjective.Planned_Objective__r.Name")==''){
                var userInputPlannedObj = component.get("v.plannedObjective");
                var objective = component.get("v.newObjective");
                component.set("v.plannedObjective.Name",objective.Name);
            }
        }
        if(!errorsFound)
        {
            component.set("v.errorsFound",false);
        }
    },
    /*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   Creates a toast msg on the page

	History
	<Date>      <Authors Name>     <Brief Description of Change>
	6/21/2017    Nick Serafin       Initial Creation
	------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['duration'] = duration
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    }
})