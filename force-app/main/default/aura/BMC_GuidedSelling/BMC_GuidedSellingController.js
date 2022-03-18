({
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:  method to load initial data
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    doInit : function(component, event, helper) {
        try{
            if(navigator.onLine){ 
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.getAllSurveys(component, event, helper,component.get("v.recordId"));
                    helper.fetchToDo(component, event, helper,component.get("v.recordId")); 
                    helper.fetchCallSummary(component, event, helper,component.get("v.recordId"), component.get("v.callogId"));
                    helper.fetchDistributionAtRisk(component, event, helper,component.get("v.recordId"));
                    helper.Calllog(component, event, helper,component.get("v.recordId"),component.get("v.callogId"));
                    helper.getAccountInformation(helper, component, event, component.get("v.recordId"));
                }else{
                    component.set("v.showSpinner",true);
                    helper.startCall(component, event, helper,component.get("v.recordId")); 
                }
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
            
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
        window.addEventListener("message", function(event) {
            component.set("v.showGuidedSellingComponent",true);
            component.set("v.showDashboard",false);          
        }, false);
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to fetch all Surveys
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    getAllSurveys : function(component, event, helper) {
        try{
            component.set("v.newToDo",false);
            component.set("v.newContact",false);
            component.set('v.showNewObjective',false);
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to fetch all objectives
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    fetchAllObjectives : function(component, event, helper) {
        try{
            component.set("v.newToDo",false);
            component.set("v.newContact",false);
            component.set('v.showNewObjective',true);
            //helper.fetchObjectives(component, event, helper,component.get("v.recordId"),component.get("v.callogId"));
            if(navigator.onLine){	
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to create contact
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    createContact : function(component, event, helper) {
        try{
            if(navigator.onLine){
                helper.newContact(component, event, helper);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to create ToDo
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    createNewToDo : function(component, event, helper) {
        try{
            if(navigator.onLine){
                helper.newToDo(component, event, helper); 
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to navigate CallLog
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    navigatetoCallLog : function(component, event, helper) {
        try{
            if(navigator.onLine){
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.navigatetoCallLog(component, event, helper); 
                }else{
                    component.set("v.showCallLogMob",true);
                }
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to fetch all contacts
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    fecthContacts : function(component, event, helper) {
        try{
            component.set("v.newToDo",false);
            component.set("v.newContact",true);
            component.set('v.showNewObjective',false);
            if(navigator.onLine){
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to save the to DO
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    handleSaveToDo : function(component, event, helper){
        try{
            var loadToDo = component.get("v.gsloadToDos");
            if(loadToDo){
                helper.fetchToDo(component, event, helper,component.get("v.recordId"));    
                component.set("v.refreshTabset",false);
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   methodto go back detail page
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    checkOut : function(component, event, helper){
        try{
            if(navigator.onLine){
                component.set("v.showSpinner",true);
                helper.Calllog(component, event, helper,component.get("v.recordId"),component.get("v.callogId"));
                component.set("v.showSummary",true);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }		
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to show quick action on Mobile
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    dontShowQuickAction : function(component, event, helper) {
        try{
            component.set("v.newToDo",false);
            component.set("v.newContact",false);
            component.set('v.showNewObjective',false);
            
            if(navigator.onLine){
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
            
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   method to show quick action on Mobile
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    showNewToDoQuick : function(component, event, helper) {
        try{
            component.set("v.newToDo",true);
            component.set("v.newContact",false);
            component.set('v.showNewObjective',false);
            
            if(navigator.onLine){
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
        
    },
    getEditContact : function(component, event, helper) {
        //component.set("v.contactToEdit",component.get("v.contactToGS"));
    },
    
    /*------------------------------------------------------------
	Author:        Francesca Fong-Choy
	Company:       Accenture
	Description:   
	<Date>      <Authors Name>     <Brief Description of Change>
	06/19/18    Francesca Fong-Choy     Initial Creation
	------------------------------------------------------------*/
    copyRecord : function(component, event, helper){
        try{
            var offPrem = component.get("v.isOffPrem");   
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   calls the updateAccessBuildingWithBeer() apex method

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/14/2017   Nick Serafin      Inital Creation
    ------------------------------------------------------------*/
    bwbClicked: function (component, event, helper){
        try{
            if(navigator.onLine){
                var action = component.get("c.updateAccessBuildingWithBeer");
                action.setParams({ callLogId: component.get("v.callogId")});
                action.setCallback(this, function (data) {
                    if (data.getState() === "ERROR") {
                        var errorsVal = data.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'info');
                            } else {
                                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_info');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
                } else {
                    helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_error');
                }
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    navigateToOnPremDashboard : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var DashboardUrl  = '/apex/BMC_On_Premise_Dashboard_Full?id=' + recordId;
        component.set("v.DashboardLink",DashboardUrl);
        component.set("v.showGuidedSellingComponent",false);
        component.set("v.showDashboard",true);	
    },
    navigateToOffPremDashboard : function(component, event, helper) {
        var recordId = component.get("v.recordId");
        var DashboardUrl  = '/apex/BMC_Off_Premise_Dashboard_Full?id=' + recordId;
        component.set("v.DashboardLink",DashboardUrl);
        component.set("v.showGuidedSellingComponent",false);
        component.set("v.showDashboard",true);	
        
    },
    //navigateToDashboard : function(component, event, helper) {
    //var url = '/apex/AccountPageTheNumbersDashboard?';
    //if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
    //var urlEvent = $A.get("e.force:navigateToURL");
    //urlEvent.setParams({
    //    "url": url,
    //});
    //urlEvent.fire();
    //}
    
    //},
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   navigates the user to the account detail page

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    5/22/2017   Nick Serafin      Inital Creation
    11/1/2017   Nick Serafin      added logic to handle desktop and mobile navigation to the account
    ------------------------------------------------------------*/
    navigateToAccount: function (component, event, helper) {
        helper.updateObjectives(component,event);
        if($A.get("$Browser.formFactor") == 'DESKTOP'){
            var navEvt = $A.get("e.force:navigateToSObject");
            navEvt.setParams({
                "recordId": component.get("v.recordId"),
                "slideDevName": "detail",
                "isredirect": false
            });
            navEvt.fire();
        } else {
            var dismissActionPanel = $A.get("e.force:closeQuickAction");
            dismissActionPanel.fire();
        }
    },
    
    saveCallSummary : function(component, event, helper) {
        helper.recordCallLogGeolocation(component, helper, 'end');
        helper.saveSummary(component, event, true,helper,component.find("userSummary").get("v.value"));
    },
    
    createChatterPost : function(component, event, helper) {
        helper.postChatterOnAccount(component, event, helper);        
    },
    closePostChatter : function(component, event, helper) {
        component.set("v.createPost",false);
        component.set("v.showPostChatter",false);
    },
    refreshSurveyTab : function(component, event, helper) {
        component.set("v.refreshTabset",false);        
        helper.getAllSurveys(component, event, helper,component.get("v.recordId"));
        component.set("v.refresh",false);
    },
    handleApplicationEvent : function(component, event, helper){
        var showModal = event.getParam("showCreateObj");
        component.set("v.objectName",event.getParam("objectName"));
        if(event.getParam("objectName").includes($A.get("$Label.c.BMC_GSSKUObjectName"))){
            component.set("v.smartSkuOpp",event.getParam("smartSkuOpp"));
        } 
        if(event.getParam("objectName")==$A.get("$Label.c.BMC_GSChainObjectName")){
            component.set("v.chainMandate",event.getParam("chainMandate"));   
        }
        component.set("v.isOffPrem",event.getParam("isOffPrem"));
        if(showModal){
            component.set("v.showCreateObj", showModal);
        }
    },
    selectTab : function(component, event, helper) { 
        var selected = component.get("v.selectedTab");
        component.find("tabs").set("v.selectedTabId",selected);
    },
    showLiveDate : function(component, event , helper) {
        var planoDate =  event.getParam("getLiveDate");
        var planoStatus =  event.getParam("getLiveStatus");
        component.set("v.displayPlanoLive",planoStatus);
        component.set("v.getLiveDate",planoDate );
    },
    saveSummaryNotes : function(component, event, helper) {
        component.set("v.showSpinner",true);  
        helper.saveSummaryNotes(component, event, true,  helper,component.find("summaryText").get("v.value"));
    }
})