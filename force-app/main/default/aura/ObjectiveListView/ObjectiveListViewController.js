/*------------------------------------------------------------
Author:        Brian Mansfield
Company:       Slalom, LLC
History
<Date>      <Authors Name>     <Brief Description of Change>
6/26/2017    Nick Serafin       updated createNewObjective() function
------------------------------------------------------------*/
({  
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   calls the helper to set where to hunt flag and the intial objective lists

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
    doInit : function(component, event, helper) {
        helper.getObjectiveList(component,event,helper,'current');
        helper.setManagerFlag(component, event, helper);
        helper.getCurrentUserRole(component,event,helper);
        if(component.get("v.calledFromVF")==true){
            try{
            if($A.get("$Browser.formFactor") == 'DESKTOP'){
                component.set("v.showCreatePersonal", true);
                component.set("v.editingObjective",false);
                var personalModal = component.find("addObjective").find("addObjectiveModal");
                var personalBackDrop = component.find("addObjective").find("addObjectiveModalBackdrop");
                $A.util.addClass(personalModal, "slds-fade-in-open");
                $A.util.addClass(personalBackDrop, "slds-backdrop--open");
            } else {
                component.set("v.showCreatePersonal", true);
                component.set("v.showMyObjectives", false);
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
        }
    },
    // MC-1738: Added to close and modal and Retain User State
    retainState : function(component, event, helper) {
        var tabvalue= component.get("v.tabvalue");
        helper.getObjectiveList(component, event, helper, tabvalue);
    } ,
    showClass: function(component, event, helper) {
        try{
            var showclass=event.getParam("showObjective");
            if(showclass){
                $A.util.removeClass(component.find("showObjectiveList"), "slds-show");
                $A.util.addClass(component.find("showObjectiveList"), "slds-hide");
            }
            else
            {
                $A.util.addClass(component.find("showObjectiveList"), "slds-show");
                $A.util.removeClass(component.find("showObjectiveList"), "slds-hide");
                component.set("v.showApplyObjectives", false);
            }
        }
        catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   displays the assign objective page

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
    navigateToComponent : function(component, event, helper){
        try{
            var objectiveId = event.currentTarget.dataset.record;
            if(objectiveId.indexOf('share') > -1 && objectiveId != null){
                objectiveId = objectiveId.substring(0, objectiveId.length - 5);
                component.set("v.sharedObjective", true);
                component.set("v.objectiveId", objectiveId);
                // MC-1738 Make showMyObjectives true for desktop
                if($A.get("$Browser.formFactor") == 'DESKTOP'){
                    component.set("v.showMyObjectives", true);
                }
                else{
                    component.set("v.showMyObjectives", false);
                }
                component.set("v.showApplyObjectives", true);
            } else {
                if(objectiveId != null){
                    component.set("v.objectiveId", objectiveId);
                    // MC-1738 Make showMyObjectives true for desktop
                    if($A.get("$Browser.formFactor") == 'DESKTOP'){
                        component.set("v.showMyObjectives", true);
                    }
                    else{
                        component.set("v.showMyObjectives", false);
                    }
                    component.set("v.showApplyObjectives", true);
                }
            }
            if (component.get("v.hasManagerRole")) {
                component.set("v.isTargetListComponent", true);
                component.find("targetListComponent").initializeObjectiveId(objectiveId);
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   opens external window for sway pages with contextual help
                   for the Objectives page.
    History
    <Date>        <Authors Name>         <Brief Description of Change>
    3/9/2018     Jacqueline Passehl       Inital Creation
    ------------------------------------------------------------*/
    openHelpMeUrl : function (component){
        window.open($A.get("$Label.c.Objective_Sway_Link")); 
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   displays the create new planned objective modal

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/26/2017   Nick Serafin        Inital Creation
    ------------------------------------------------------------*/
    createNewObjective : function(component, event, helper) {
        try{
            if($A.get("$Browser.formFactor") == 'DESKTOP'){
                component.set("v.showCreatePersonal", true);
                component.set("v.editingObjective",false);
                var personalModal = component.find("addObjective").find("addObjectiveModal");
                var personalBackDrop = component.find("addObjective").find("addObjectiveModalBackdrop");
                $A.util.addClass(personalModal, "slds-fade-in-open");
                $A.util.addClass(personalBackDrop, "slds-backdrop--open");
            } else {
                component.set("v.showCreatePersonal", true);
                component.set("v.showMyObjectives", false);
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   displays the current objective tab

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
    assignToMeClick : function(component, event, helper) {
        try{
            $A.util.addClass(component.find("assignToMeTab"), "slds-active");
            $A.util.removeClass(component.find("assignByMeTab"), "slds-active");
            $A.util.addClass(component.find("assignToMeContent"), "slds-show");
            $A.util.removeClass(component.find("assignToMeContent"), "slds-hide");
            $A.util.removeClass(component.find("assignedByMeContent"), "slds-show");
            $A.util.addClass(component.find("assignedByMeContent"), "slds-hide");
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   displays the shared objective tab

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/26/2017   Nick Serafin        Inital Creation
    ------------------------------------------------------------*/
    assignByMeClick : function(component, event, helper) {
        try{
            $A.util.addClass(component.find("assignByMeTab"), "slds-active");
            $A.util.removeClass(component.find("assignToMeTab"), "slds-active");
            $A.util.addClass(component.find("assignedByMeContent"), "slds-show");
            $A.util.removeClass(component.find("assignedByMeContent"), "slds-hide");
            $A.util.addClass(component.find("assignToMeContent"), "slds-hide");
            $A.util.removeClass(component.find("assignToMeContent"), "slds-show");
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   closes the apply objective page

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
    closeApplyObjectiveModal : function(component) {
        component.set("v.showMyObjectives", true);
        component.set("v.showApplyObjectives", false);
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   displays the edit objective template modal

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/11/2017   Nick Serafin        Inital Creation
    3/29/2018   Jacqueline Passehl  Added added check for if the dropdown edit was clicked (shouldOpenEdit)
    ------------------------------------------------------------*/
    openObjectiveEditModal : function(component, event, helper){
        try{
            var objectiveId;
            if(component.get("v.shouldOpenEdit")==false && event.currentTarget!=null){
                objectiveId = event.currentTarget.dataset.record;
            }
            else{
                //if this method is called when shouldOpenEdit=true then we already have the Id
                objectiveId= component.get("v.objectiveId");    
            }
            var objectiveRecord = '';
            if(objectiveId != null){
                if(objectiveId.indexOf('coe') > -1){
                    objectiveId = objectiveId.substring(0, objectiveId.length - 3);
                    var objectiveList = component.get("v.coeObjectivesList");
                    for (var i = 0; i < objectiveList.length; i++){
                        if(objectiveList[i].objective.Id == objectiveId){
                            objectiveRecord = objectiveList[i].objective;
                        }
                    }
                } else if(objectiveId.indexOf('manager') > -1){
                    objectiveId = objectiveId.substring(0, objectiveId.length - 7);
                    var objectiveList = component.get("v.managerObjectivesList");
                    for (var i = 0; i < objectiveList.length; i++){
                        if(objectiveList[i].objective.Id == objectiveId){
                            objectiveRecord = objectiveList[i].objective;
                        }
                    }
                } else if(objectiveId.indexOf('personal') > -1){
                    objectiveId = objectiveId.substring(0, objectiveId.length - 8);
                    var objectiveList = component.get("v.personalObjectivesList");
                    for (var i = 0; i < objectiveList.length; i++){
                        if(objectiveList[i].objective.Id == objectiveId){
                            objectiveRecord = objectiveList[i].objective;
                        }
                    }
                } else if(objectiveId.indexOf('assignByMe') > -1){
                    objectiveId = objectiveId.substring(0, objectiveId.length - 10);
                    var objectiveList = component.get("v.assignByMeObjectivesList");
                    for (var i = 0; i < objectiveList.length; i++){
                        if(objectiveList[i].objective.Id == objectiveId){
                            objectiveRecord = objectiveList[i].objective;
                        }
                    }
                }
                if(objectiveRecord != '' && objectiveRecord != null){
                    component.set("v.objectiveObj", objectiveRecord);
                    component.set("v.showCreatePersonal", true);
                    if($A.get("$Browser.formFactor") == 'DESKTOP'){
                        var editObjectiveModal = component.find("addObjective").find("addObjectiveModal");
                        var editObjectiveModalBackDrop = component.find("addObjective").find("addObjectiveModalBackdrop");
                        component.set("v.editingObjective",true);
                        $A.util.addClass(editObjectiveModal, "slds-fade-in-open");
                        $A.util.addClass(editObjectiveModalBackDrop, "slds-backdrop--open");
                    } else {
                        component.set("v.editingObjective",true);
                        component.set("v.showMyObjectives", false);
                    }
                }
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Dan Zebrowski
    Company:       Slalom, LLC
    Description:   closes open apply objective dropdowns

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    3/29/18     Jacqueline Passehl  Changed to also close open objective edit/delete dropdowns
    ------------------------------------------------------------*/
    closeApplyMenus : function (component, event, helper){
        try{
            var objListItem = [];
            var objEditDropdown = [];
            objListItem = component.find("objCmp");
            objEditDropdown = component.find("objEditCmp");
            var c;

            if(objListItem && objEditDropdown){
                c = objListItem.concat(objEditDropdown);
            }
            else if(objListItem){
                c = objListItem;
            }
            else if (objEditDropdown){
                c = objEditDropdown;
            }
            if(c){
                if(c.length > 0){
                    c.forEach(function(comp) {
                        comp.closeAllMenus();
                    }, this);
                } else {
                    c.closeAllMenus();
                }
                component.set("v.selectedRecord", '');
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   sets the selected row in the table to open the dropdown menu to apply objectives

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    ------------------------------------------------------------*/
    setSelectedAttribute : function(component, event, helper){
        try{
            var record = event.currentTarget.dataset.record;
            component.set("v.selectedRecord", record);

        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   expands or collapses sections on the page

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/31/2018    Nick Serafin        Initial Creation
    ------------------------------------------------------------*/
    handleAccordionClick : function(component, event, helper){
        try{
            var buttonVal = event.currentTarget.dataset.record;
            var section = component.find(buttonVal + 'Section');
            var button = component.find(buttonVal + 'Switch');
            $A.util.toggleClass(section, 'slds-is-open');
            for(var cmp in button) {
                $A.util.toggleClass(button[cmp], 'slds-show');
                $A.util.toggleClass(button[cmp], 'slds-hide');
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls sortBy helper method for the COE table and resets the other table sorting variables

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/31/2018    Nick Serafin        Initial Creation
    ------------------------------------------------------------*/
    coeSortColumn : function(component, event, helper){
        try{
            var fieldVal = event.currentTarget.dataset.record;
            component.set("v.upcomingSortField", '');
            component.set("v.upcomingSortAsc", false);
            component.set("v.sharedSortField", '');
            component.set("v.sharedSortAsc", false);
            component.set("v.assignByMeSortField", '');
            component.set("v.assignByMeSortAsc", false);
            helper.sortBy(component, event, helper, fieldVal);
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls sortBy helper method for the Manager table and resets the other table sorting variables

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/31/2018    Nick Serafin        Initial Creation
    ------------------------------------------------------------*/
    managerSortColumn : function(component, event, helper){
        try{
            var fieldVal = event.currentTarget.dataset.record;
            component.set("v.currentSortField", '');
            component.set("v.currentSortAsc", false);
            component.set("v.sharedSortField", '');
            component.set("v.sharedSortAsc", false);
            component.set("v.assignByMeSortField", '');
            component.set("v.assignByMeSortAsc", false);
            helper.sortBy(component, event, helper, fieldVal);
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls sortBy helper method for the Personal table and resets the other table sorting variables

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/31/2018    Nick Serafin        Initial Creation
    ------------------------------------------------------------*/
    personalSortColumn : function(component, event, helper){
        try{
            var fieldVal = event.currentTarget.dataset.record;
            component.set("v.upcomingSortField", '');
            component.set("v.upcomingSortAsc", false);
            component.set("v.currentSortField", '');
            component.set("v.currentSortAsc", false);
            component.set("v.assignByMeSortField", '');
            component.set("v.assignByMeSortAsc", false);
            helper.sortBy(component, event, helper, fieldVal);
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls sortBy helper method for the AssignedByMe table and resets the other table sorting variables

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/31/2018    Nick Serafin        Initial Creation
    ------------------------------------------------------------*/
    assignByMeSortColumn : function(component, event, helper){
        try{
            var fieldVal = event.currentTarget.dataset.record;
            component.set("v.upcomingSortField", '');
            component.set("v.upcomingSortAsc", false);
            component.set("v.currentSortField", '');
            component.set("v.currentSortAsc", false);
            component.set("v.sharedSortField", '');
            component.set("v.sharedSortAsc", false);
            helper.sortBy(component, event, helper, fieldVal);
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls helper to get correct lists filtered for the clicked on time period

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    1/31/2018    Nick Serafin        Initial Creation
    ------------------------------------------------------------*/
    handleFilterClick : function(component, event, helper){
        try{
            var btnValue = event.getSource().get("v.value");
            component.set('v.tabvalue', btnValue);
            var buttonGroup = component.find("filterBtn");
            for(var i=0; i < buttonGroup.length; i++){
                if(buttonGroup[i].get("v.value") == btnValue){
                    buttonGroup[i].set("v.variant", "brand");
                } else {
                    buttonGroup[i].set("v.variant", "neutral");
                }
            }
            if(btnValue == 'current'){
                component.set("v.expiredFilter", false);
                component.set("v.filterDateColumnDeadline", true);
            } else if(btnValue == 'upcoming'){
                component.set("v.expiredFilter", false);
                component.set("v.filterDateColumnDeadline", false);
            } else {
                component.set("v.expiredFilter", true);
                component.set("v.filterDateColumnDeadline", true);
            }
            helper.getObjectiveList(component, event, helper, btnValue);
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    }
})