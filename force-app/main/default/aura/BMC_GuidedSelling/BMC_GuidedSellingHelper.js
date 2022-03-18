({
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to fetch objectives 
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
6/14/2018	 Francesca Fong-Choy Removed Brand column and moved code to Guided Selling Objectives
------------------------------------------------------------*/
    /*fetchObjectives : function(component, event, helper,AccountId,CalllogId) {
        try{
            if(navigator.onLine){
                component.set("v.newToDo",false);
                component.set("v.newContact",false);
                component.set('v.showTodoquick',false);
                component.set('v.createContactquick',false);
                var action = component.get("c.getInitialObjectiveRecords");
                action.setParams({accountId : AccountId, callLogId : CalllogId});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        console.log(response.getReturnValue());
                        component.set('v.objectivecolumns', [
                            {label: $A.get("$Label.c.Name"), fieldName: $A.get("$Label.c.Name"), type: $A.get("$Label.c.BMC_GSDataTypeText")},
                            {label: $A.get("$Label.c.BMC_GSType"), fieldName: $A.get("$Label.c.BMC_GSRecordTypeName"), type: $A.get("$Label.c.BMC_GSDataTypeText")},
                            {label: $A.get("$Label.c.BMC_GSObjectiveStatus"), fieldName: $A.get("$Label.c.BMC_GSObjectiveStatusapi"), type: $A.get("$Label.c.BMC_GSDataTypeText")}
                            
                        ]);
                        var rows = response.getReturnValue();
                        console.log(rows);
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];                    
                            if (row.RecordType) 
                                row.RecordTypeName = row.RecordType.Name;
                        }
                        component.set("v.objectivedata",rows);            
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                              errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },*/
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to fetch Surveys
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    getAllSurveys :function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                component.set("v.newToDo",false);
                component.set("v.newContact",false);
                component.set('v.showTodoquick',false);
                component.set('v.createContactquick',false);
                var action = component.get("c.getAllSurveysforAccount");
                action.setParams({accountId : AccountId});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            component.set('v.surveycolumns', [
                                {label:$A.get("$Label.c.BMC_GSSURVEYNAME") , fieldName: $A.get("$Label.c.Name"), type: $A.get("$Label.c.BMC_GSDataTypeText"),initialWidth: 400},
                                {label:$A.get("$Label.c.BMC_GSSURVEYLINK") , fieldName: 'launchUrl' , type: 'url', typeAttributes: { label: { fieldName: $A.get("$Label.c.BMC_GSSurveyLabel") }, target: '_self' }}
                            ]);
                        }
                        else{
                            component.set('v.surveycolumns', [
                                {label:$A.get("$Label.c.BMC_GSSURVEYNAME") , fieldName: $A.get("$Label.c.Name"), type: $A.get("$Label.c.BMC_GSDataTypeText"),initialWidth: 400},
                                {label:$A.get("$Label.c.BMC_GSSURVEYLINK") , fieldName: 'launchUrlmobile' , type: 'url', typeAttributes: { label: { fieldName: $A.get("$Label.c.BMC_GSSurveyLabel") }, target: '_self' }}
                            ]);
                        }
                        var rows = response.getReturnValue();
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            if(!$A.util.isEmpty(row.Survey_Link__c)){
                                row.surveyLink = row.Survey_Link__c.replace(/amp;/g,'');
                                row.surveyUrl = row.surveyLink.replace(/[""]/g, '');
                                if(row.surveyUrl.includes($A.get("$Label.c.BMC_GSContinuous"))){
                                    row.custom = row.surveyUrl.substr(9, 138);
                                }else if(row.surveyUrl.includes($A.get("$Label.c.BMC_GSSingleExecution"))){
                                    row.custom = row.surveyUrl.substr(9, 144);                                
                                }
                                var link=$A.get("$Label.c.BMC_GSSurevyDomainURL");
                                row.launchUrl = link.concat(row.custom);
                                row.surveylabel = $A.get("$Label.c.BMC_GSLaunchSurvey");
                            }
                            if(!$A.util.isEmpty(row.BMC_GSSurveyLinkMobile__c)){
                                row.surveyLink = row.BMC_GSSurveyLinkMobile__c.replace(/amp;/g,'');
                                row.surveyUrl = row.surveyLink.replace(/[""]/g, '');
                                if(row.surveyUrl.includes($A.get("$Label.c.BMC_GSContinuous"))){
                                    row.custom = row.surveyUrl.substr(9, 150);
                                }else if(row.surveyUrl.includes($A.get("$Label.c.BMC_GSSingleExecution"))){
                                    row.custom = row.surveyUrl.substr(9, 156);                                }
                                var link=$A.get("$Label.c.BMC_GSSurevyDomainURL");
                                row.launchUrlmobile = link.concat(row.custom);
                                row.surveylabel = $A.get("$Label.c.BMC_GSLaunchSurvey");
                            }
                        }    
                        
                        var surveysLabel=$A.get("$Label.c.BMC_GSSurveys");
                        surveysLabel=surveysLabel.concat(response.getReturnValue().length);  
                        component.set("v.refreshTabset",true);
                        component.set('v.surveysLabel',surveysLabel.concat(')'));  
                        
                        component.set("v.surveydata",rows);
                        
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
        
    },
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to fetch ToDo's 
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    fetchToDo : function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                component.set("v.newToDo",true);
                component.set("v.newContact",false);
                component.set('v.showTodoquick',true);
                component.set('v.createContactquick',false);
                var action = component.get("c.getTask");
                action.setParams({accountId : AccountId});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.notescolumns', [
                            {label: $A.get("$Label.c.Description"), fieldName: $A.get("$Label.c.Description"),initialWidth: 400},
                            {label: $A.get("$Label.c.Due_Date"), fieldName: $A.get("$Label.c.BMC_GSActivityDate"), type: 'date',initialWidth: 200},
                            {label: $A.get("$Label.c.BMC_GSAssignedTo"),fieldName: $A.get("$Label.c.BMC_GSOwnerName"), type: $A.get("$Label.c.BMC_GSDataTypeText"),initialWidth: 200}
                        ]);
                        var rows = response.getReturnValue();
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            if (row.Owner) row.OwnerName = row.Owner.Name;
                        }
                        
                        var todosLabel=$A.get("$Label.c.BMC_GSToDos");
                        todosLabel=todosLabel.concat(response.getReturnValue().length);  
                        component.set("v.refreshTabset",true);
                        component.set('v.todosLabel',todosLabel.concat(')'));  
                        component.set("v.notesdata",rows);
                        component.set("v.gsloadToDos",false);
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to create Contact
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    newContact : function(component, event, helper) {
        try{
            component.set("v.showCreateContact",true);
            component.set("v.contactToGS",{'sobjectType': 'Contact' });
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to create toDo 
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    newToDo : function(component, event, helper) {
        try{
            component.set("v.showNewToDo",true);
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to navigate back to CallLog
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    navigatetoCallLog : function(component, event, helper) {
        if(navigator.onLine){
            //var desktopCall = component.get("v.desktop");
            var evt = $A.get("e.force:navigateToComponent");
            evt.setParams({
                componentDef: "c:CallLog",
                componentAttributes: {
                    recordId : component.get("v.recordId"),
                    desktopCall : true,
                    callLogFromGS : true
                }
            });
            evt.fire();
            return;
            // }
        }
    },    
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to record GeoLocation
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    recordCallLogGeolocation: function(component, helper, startOrEnd){
        try{
            if(navigator.onLine){
                //If the user does not have geolocation enabled, this code will not run
                if (navigator.geolocation) {
                    if(navigator.geolocation.getCurrentPosition){
                        navigator.geolocation.getCurrentPosition(function(e) {
                            var action = component.get("c.saveAndEnd");
                            if(action){
                                action.setParams({
                                    "currLat": e.coords.latitude,
                                    "currLong": e.coords.longitude,
                                    "callLogId": component.get("v.callLogRec").Id,
                                    "startOrEnd": startOrEnd
                                });
                                action.setCallback(this, function (response) {
                                    if (response.getState() === "ERROR") {
                                        var errors = response.getError();
                                        if (errors) {
                                            if (errors[0] && errors[0].message) {
                                            }
                                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                            } else {
                                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                            }
                                        } else {
                                        }
                                    }
                                });
                                $A.enqueueAction(action);
                            }
                        }, function(error) {
                        }, {'enableHighAccuracy': false, 'timeout': 5000, 'maximumAge':0});
                    }
                }
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
Author:        Larry A. Cardenas
Company:       Accenture
Description:   Displays list of Recent Call Log Summaries
<Date>      <Authors Name>     <Brief Description of Change>
06/10/2018   Larry A. Cardenas     Initial Creation
------------------------------------------------------------*/
    fetchCallSummary : function(component, event, helper,AccountId,CalllogId) {
        try{
            if(navigator.onLine){
                component.set("v.newToDo",false);
                component.set("v.newContact",false);
                component.set('v.showTodoquick',false);
                component.set('v.createContactquick',false);
                var action = component.get("c.getMeetingSummary");
                action.setParams({accountId : AccountId, callLogId : CalllogId});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.summarycolumns', [ 
                            {label: $A.get("$Label.c.BMC_GSStartDate"), fieldName: $A.get("$Label.c.BMC_GSCallStartDateAPI"), type: 'date',initialWidth: 200},
                            {label: $A.get("$Label.c.BMC_GSCallLogOwner"), fieldName: $A.get("$Label.c.BMC_GSCallLogOwnerField"), type: $A.get("$Label.c.BMC_GSDataTypeText"),initialWidth: 200},
                            {label: $A.get("$Label.c.BMC_GSCallSummaryNotes"),fieldName: $A.get("$Label.c.BMC_GSCallSummaryc"), type: $A.get("$Label.c.BMC_GSDataTypeText"),initialWidth: 900}
                        ]);
                        var rows = response.getReturnValue();
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            row.CallLogOwner=row.BMC_Calllog_Started_By__c;
                        }
                        
                        var priorCallLabel=$A.get("$Label.c.BMC_GSPriorCalls");
                        priorCallLabel=priorCallLabel.concat(response.getReturnValue().length);  
                        component.set("v.refreshTabset",true);
                        component.set('v.priorCallLabel',priorCallLabel.concat(')'));  
                        
                        component.set("v.summarydata",rows);
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
Author:        Larry A. Cardenas
Company:       Accenture
Description:   Displays list of Distribution At Risk
<Date>      <Authors Name>     <Brief Description of Change>
06/11/2018   Larry A. Cardenas     Initial Creation
------------------------------------------------------------*/
    fetchDistributionAtRisk : function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                component.set("v.newToDo",false);
                component.set("v.newContact",false);
                component.set('v.showTodoquick',false);
                component.set('v.createContactquick',false);
                var action = component.get("c.getSTRBrandPackage");
                action.setParams({accountId : AccountId});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        component.set('v.distributionAtRiskColumns', [
                            {label: $A.get("$Label.c.BMC_GSBrandPackage"), fieldName: $A.get("$Label.c.Name"), type: 'text',initialWidth: 400},
                            {label: $A.get("$Label.c.BMC_GSLastPurchaseDate"), fieldName: $A.get("$Label.c.BMC_GSLastPurchaseDatec"), type: 'date',initialWidth: 150},
                            {label: $A.get("$Label.c.BMC_GSL13WK"), fieldName: $A.get("$Label.c.BMC_GSL13WKc"), type: 'number',cellAttributes: { alignment: 'center' },initialWidth: 100},
                            {label: $A.get("$Label.c.BMC_GSL52WK"), fieldName: $A.get("$Label.c.BMC_GSL52WKc"), type: 'number',cellAttributes: { alignment: 'center' },initialWidth: 100}
                            
                        ]);
                        var distributionLabel=$A.get("$Label.c.BMC_GSDistributionAtRisk");
                        distributionLabel=distributionLabel.concat(response.getReturnValue().length);  
                        component.set("v.refreshTabset",true);
                        component.set('v.distributionLabel',distributionLabel.concat(')'));                           
                        component.set("v.distributionAtRiskData",response.getReturnValue()); 
                        
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            
                        }
                    }
                });
                $A.enqueueAction(action);
            }
            else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   displays toast for dekstop
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018   Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        var toastMsg = $A.get("e.force:showToast");
        // For lightning1 show the toast
        if (toastMsg) {
            //fire the toast event in Salesforce1
            var toastParams = {
                "title": title,
                "message": message,
                "type": type
            }
            toastMsg.setParams(toastParams);
            toastMsg.fire();
        } 
    },
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   displays toast for mobile due to neccessary workaround for known issue
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
------------------------------------------------------------*/
    displayToastMobileCallLog: function(component, showToast, title, message, type){
        try{
            if(showToast){
                component.set("v.showToast", true);
            }
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
        }
    },
    
    Calllog : function(component, event, helper,AccountId,CalllogId){
        try{
            if(navigator.onLine){
                var action = component.get("c.fetchCallLog");
                action.setParams({ callLogId : CalllogId,accountId : AccountId});
                action.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        component.set("v.showSpinner",false);
                        var callLog = data.getReturnValue();
                        component.set("v.callLogRec", callLog);
                        
                    }else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                    
                });
                $A.enqueueAction(action);
                
            }else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
        
    },
    /*------------------------------------------------------------
Author:        Nick Serafin
Company:       Slalom, LLC
Description:   returns intial account information, sets contact information, sets dashboard attributes, and filters dashboards based on craft parameters
History
<Date>      <Authors Name>     <Brief Description of Change>
5/07/2017    Nick Serafin     Initial Creation
-----------------------------------------------------------*/
    getAccountInformation: function (helper, component, event, getAccountRec) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getRelatedAccount");
                var recordId = component.get('v.recordId');
                action.setParams({ accountId: getAccountRec } );
                action.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        var account = data.getReturnValue();
                        if ((account.RecordType.Name == 'Off-Premise') || (account.RecordType.Name == 'Chain Off-Premise')) {
                            component.set("v.isOffPrem", true);
                        } else {
                            component.set("v.isOffPrem", false);
                        }
                        component.set("v.accountRec", account);
                        component.set("v.smpFlag", account.SMPFlag__c);
                        var consumerURL = '';
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            consumerURL = $A.get("$Label.c.Consumption_Dashboard") + account.OutletCd__c;
                        } else {
                            consumerURL = $A.get("$Label.c.Consumption_Dashboard_TableauApp") + account.OutletCd__c;
                        }
                        component.set("v.consumerDashboard", consumerURL);
                        if (account.Key_Contact__c != null) {
                            if(account.Contacts != null){
                                for (var j = 0; j < account.Contacts.length; j++) {
                                    if (account.Key_Contact__c == account.Contacts[j].Id) {
                                        component.set("v.contactRec", account.Contacts[j]);
                                        component.set("v.contactMeetingRec", account.Contacts[j].Name);
                                        component.set("v.contactId", account.Contacts[j].Id);
                                        break;
                                    }
                                }
                            }
                        }
                        var craftBrandFamilyAction = component.get("c.getCraftBrandFamilyUserInfo");
                        craftBrandFamilyAction.setCallback(this, function (data) {
                            if (data.getState() === "SUCCESS") {
                                var userObj = data.getReturnValue();
                                var craftBrandFamilyURL = '';
                                if (userObj != null) {
                                    craftBrandFamilyURL = '';
                                    if (userObj.Craft_Brand_Family__c == 'TENTH & BLAKE') {
                                        craftBrandFamilyURL = $A.get("$Label.c.Tenth_Blake_Flag");
                                    }
                                    if (typeof userObj.Craft_Brand_Family__c != 'undefined' && userObj.Craft_Brand_Family__c != null && userObj.Craft_Brand_Family__c != 'TENTH & BLAKE') {
                                        craftBrandFamilyURL = $A.get("$Label.c.Trademark_Brand_Family_Label") + userObj.Craft_Brand_Family__c.replace(/ /g, '%20');
                                    }
                                }
                                var onPremiseOutletURL = $A.get("$Label.c.On_Prem_DB");
                                var offPremiseOutletURL = $A.get("$Label.c.On_Prem_DB");
                                component.set("v.onPremiseOutletDashboard", onPremiseOutletURL);
                                component.set("v.offPremiseOutletDashboard", offPremiseOutletURL);
                                //var onPremiseOutletURL = '';
                                //var offPremiseOutletURL = '';
                                //if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                //onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Desktop") + account.TeraAccountId__c + craftBrandFamilyURL;
                                //offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Desktop") + account.TeraAccountId__c + craftBrandFamilyURL;
                                //} else if($A.get("$Browser.formFactor") == $A.get("$Label.c.TABLET")){
                                //onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Mobile_Tablet_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
                                //offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Mobile_Tablet_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
                                //} else {
                                //onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Mobile_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
                                //offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Mobile_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
                                //}
                                //component.set("v.onPremiseOutletDashboard", onPremiseOutletURL);
                                //component.set("v.offPremiseOutletDashboard", offPremiseOutletURL);
                            } else {
                                var errors = data.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        
                                    }
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                    }
                                } else {
                                }
                            }
                        });
                        $A.enqueueAction(craftBrandFamilyAction);
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }
        
        catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    saveSummary : function(component, event, update, helper,sumTextAreaValue) {
        try{
            if(navigator.onLine){
                var callLog = component.get("v.callLogRec");
                var pageReference = component.get("v.pageReference"); 
                var action = component.get("c.updateMeetingSummary");
                action.setParams({
                    "callLog" : callLog,
                    "accountId": component.get("v.recordId"),
                    "contactId": component.get("v.contactId"),
                    "callLogId": component.get("v.callLogRec").Id,
                    "meetingDate": component.get("v.callDate"),
                    "endCallLog": true,
                    "objectiveRecordsToCompare": component.get("v.objectiveRecordsToCompare"),
                    "offPremise": component.get("v.isOffPrem")});
                action.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        if(update){   
                            this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.BMC_GS_Call_Log_Summary_Success_Msg"), 'success', '5000');
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                var sObjectEvent = $A.get("e.force:navigateToSObject");
                                sObjectEvent.setParams({
                                    "recordId": component.get("v.recordId"),
                                    "slideDevName": "detail",
                                    "isredirect": false
                                })
                                sObjectEvent.fire();	
                                
                            } else {
                                var sObjectEvent = $A.get("e.force:navigateToSObject");
                                sObjectEvent.setParams({
                                    "recordId": component.get("v.recordId"),
                                    "slideDevName": "detail",
                                    "isredirect": false
                                })
                                sObjectEvent.fire();	
                                
                                var dismissActionPanel = $A.get("e.force:closeQuickAction");
                                dismissActionPanel.fire();
                                $A.get('e.force:refreshView').fire();
                                //this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Success"),$A.get("$Label.c.BMC_GS_Call_Log_Summary_Success_Msg"), 'slds-theme_success');
                            }
                            component.set("v.showSummary",false);
                            
                        }else{
                        }
                    } else {
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
                
                
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    startCall: function (component, event, helper,recordId){
        try{
            if(navigator.onLine){
                var recordId = component.get('v.recordId');
                var callLogId = '';
                var action = component.get("c.startingCall");
                action.setParams({ accountId : recordId });
                action.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var callLog = data.getReturnValue();
                        component.set("v.callLogRec",callLog);
                        callLogId = callLog.Id;
                        component.set("v.callogId",callLogId);
                        var recordId = component.get('v.recordId');
                        var getCallLogId = callLogId;
                        var getAccountRec = recordId;
                        component.set("v.showSpinner",false);  
                        if (!getAccountRec) {
                            this.displayToast($A.get("$Label.c.Account_Information_Missing"), $A.get("$Label.c.No_Account_Error"), 'error', '5000');
                            return;
                        } else {
                            if(!$A.util.isEmpty(getCallLogId)){
                                this.fetchCallSummary(component, event, helper,component.get("v.recordId"),getCallLogId);
                                this.Calllog(component, event, helper,component.get("v.recordId"),getCallLogId);
                                component.set("v.showObjectivesMob",true);
                            }
                            this.getAllSurveys(component, event, helper,component.get("v.recordId"));
                            this.fetchToDo(component, event, helper,component.get("v.recordId"));  
                            this.fetchDistributionAtRisk(component, event, helper,component.get("v.recordId"));
                            this.getAccountInformation(helper, component, event, component.get("v.recordId"));
                            this.recordCallLogGeolocation(component, helper, 'start');
                        }
                        
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
        
    },
    
    postChatterOnAccount : function (component, event, helper){
        component.set("v.createPost",true);
    },
    saveSummaryNotes : function(component, event, update, helper,sumTextAreaValue) {
        try{
            if(navigator.onLine){
                        var callLog = component.get("v.callLogRec");
                        var callloguser = component.get("v.callLogsforUser");
                        var action = component.get("c.saveMeetingSummary2");
                        action.setParams({ callLog : callLog });
                        action.setCallback(this, function(response) {
                            if (response.getState() === "SUCCESS") {
                                component.set("v.showSpinner",false);  
                        if(update){
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Call_Log_Summary_Success_Msg"), 'success', '5000');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Success"),$A.get("$Label.c.Call_Log_Summary_Success_Msg"), 'slds-theme_success');
                                    }
                                }else{
                                    console.error('Summary Text Field is not Valid');
                                }
                            } else {
                                var errors = response.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        console.error("Error message: " + 
                                                      errors[0].message);
                                    }
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                    }
                                } else {
                                    console.error("Unknown error");
                                    
                                }
                            }
                        });
                        $A.enqueueAction(action);
                    
                
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    }
    
    
})