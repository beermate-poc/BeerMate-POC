({
    /*------------------------------------------------------------
Author:        Gopal Neeluru
Company:       Accenture
Description:   Method to fetch objectives 
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018    Gopal Neeluru     Initial Creation
6/14/2018	 Francesca Fong-Choy Removed Brand column and moved code to Guided Selling Objectives
------------------------------------------------------------*/
    fetchObjectives : function(component, event, helper,AccountId,CalllogId) {
        try{
            if(navigator.onLine){
                var actionObj = component.get("c.getInitialObjectiveRecords");
                actionObj.setParams({ accountId : AccountId, callLogId : CalllogId});
                actionObj.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {                       
                        component.set('v.objectiveColumns', [
                            {label: $A.get("$Label.c.Name"), fieldName: $A.get("$Label.c.Name"), type: $A.get("$Label.c.BMC_GSDataTypeText")},
                            {label: $A.get("$Label.c.BMC_GSType"), fieldName: $A.get("$Label.c.BMC_GSRecordTypeName"), type: $A.get("$Label.c.BMC_GSDataTypeText")},
                            {label: $A.get("$Label.c.BMC_GSObjectiveStatus"), fieldName: $A.get("$Label.c.BMC_GSObjectiveStatusapi"), type: $A.get("$Label.c.BMC_GSDataTypeText")}
                            
                        ]);
                        var rowsData = response.getReturnValue();
                        for (var i = 0; i < rowsData.length; i++) {
                            var rowVal = rowsData[i];    
                            if (rowVal.RecordType) 
                                rowVal.RecordTypeName = rowVal.RecordType.Name;
                        }
                        component.set("v.objectiveData",rowsData);  
                        var objectiveLength=$A.get("$Label.c.BMC_GSObjectives");
                        objectiveLength=objectiveLength.concat(rowsData.length);                        
                        component.set('v.objectiveLength',objectiveLength.concat(')'));   
                        component.set("v.refreshObj",false);
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
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
                $A.enqueueAction(actionObj);
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
Author:        Francesca Fong-Choy
Company:       Accenture
Description:   Method to fetch gaps 
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018  Francesca Fong-Choy    Initial Creation
------------------------------------------------------------*/
    
    fetchGaps : function(component, event,helper,AccountId) {
        try{
            if(navigator.onLine){
                var actionGap = component.get("c.getInitialGapRecords");
                actionGap.setParams({accountId : AccountId});
                actionGap.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                        component.set('v.gapsColumns', [
                            {label: $A.get("$Label.c.BMC_GSBrandPackage"), fieldName: $A.get("$Label.c.BMC_BrandPackageAPI"), type: 'text'},
                            {label:$A.get("$Label.c.BMC_Chain"), fieldName:$A.get("$Label.c.BMC_GapAPI"), type: 'text'},
                            {label: $A.get("$Label.c.BMC_Plano"), fieldName: $A.get("$Label.c.BMC_PlanoAPI"), type: 'text'},
                            {label:$A.get("$Label.c.BMC_GSLastPurchaseDate"), fieldName:$A.get("$Label.c.BMC_GSLastPurchaseDatec"), type: 'date'},
                             {label:$A.get("$Label.c.BMC_GSType"), fieldName:$A.get("$Label.c.BMC_GSType"), type: 'text'}
                        ]);
                        component.set("v.gapsData",response.getReturnValue());
                        var allDate =response.getReturnValue();
                        var livedate = '';
                        if(!$A.util.isEmpty(allDate)){
                            for(var i =0; i < allDate.length; i++ ){
                                if(allDate[i].planogram == true){
                                    livedate = allDate[i].liveDate;
                                    break;
                                }
                            }
                        }
                        if(!$A.util.isUndefinedOrNull(livedate)){
                            var evEnt = component.getEvent("planoLiveEvent");
                            evEnt.setParams({"getLiveDate" : livedate,"getLiveStatus" : true });
                            evEnt.fire();
                        }
                        var gapsLength=$A.get("$Label.c.BMC_GSGaps");
                        console.log(response.getReturnValue());
                        gapsLength=gapsLength.concat(response.getReturnValue().length);  
                        component.set('v.gapsLength',gapsLength.concat(')')); 
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
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
                $A.enqueueAction(actionGap);
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
Description:   Method to display SmartSKU opportunities 
<Date>      <Authors Name>     <Brief Description of Change>
08/06/2018  Francesca Fong-Choy    Initial Creation
------------------------------------------------------------*/
    fetchOpportunities : function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                var actionOpp = component.get("c.getSmartSKUs");
                actionOpp.setParams({accountId : AccountId});
                actionOpp.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                        if(component.get("v.isOffPrem")){
                            component.set('v.opportunitiesColumns', [
                                {label: 'Brand', fieldName: 'Brand__c', type: 'text'},
                                {label: 'Package', fieldName: 'Package__c', type: 'text'},
                                {label: $A.get("$Label.c.BMC_GSProjected90DayVolume"), fieldName: $A.get("$Label.c.BMC_GSProjected90DayVolumec"), type: 'number'}
                                
                            ]); 
                        }else{
                            component.set('v.opportunitiesColumns', [
                                {label: $A.get("$Label.c.BMC_GSBrandPackage"), fieldName: $A.get("$Label.c.BMC_GSBrandPackName"), type: 'text'},
                                {label: $A.get("$Label.c.BMC_GSProjected90DayVolume"), fieldName: $A.get("$Label.c.BMC_GSProjected90DayVolumec"), type: 'number'}
                                
                            ]);                
                        }   
                        component.set("v.opportunitiesData",response.getReturnValue());    
                        var skuLength=$A.get("$Label.c.BMC_GSOpportunities");
                        skuLength=skuLength.concat(response.getReturnValue().length);                        
                        component.set('v.skuLength',skuLength.concat(')')); 
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
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
                $A.enqueueAction(actionOpp);
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
    
    fetchChainActivities : function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                
                var actionAct = component.get("c.getChainActivities");
                actionAct.setParams({accountId : AccountId});
                actionAct.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                        component.set('v.chainActivitiesColumns', [
                            {label: 'Chain Execution Name', fieldName: 'Name', type: 'text'},
                            {label: 'Product(s)', fieldName: 'BMC_All_Brand_Packages__c', type: 'text'},
                            {label: 'Element(s)', fieldName: 'BMC_Elements__c', type: 'text'},
                            {label: 'Start Date', fieldName: 'BMC_Start_Date__c', type: 'Date'},
                            {label: 'End Date', fieldName: 'BMC_End_Date__c', type: 'Date'}
                            
                        ]);        
                       
                    component.set("v.chainActivitiesData",response.getReturnValue()); 
                    var actLength=$A.get("$Label.c.BMC_ChainActivities");
                    actLength=actLength.concat(response.getReturnValue().length);                        
                    component.set('v.actLength',actLength.concat(')')); 
                        
                    }
                    else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
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
                $A.enqueueAction(actionAct);
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
Author:        Ankita Shanbhag
Company:       Accenture
Description:   Method for showing toast for desktop
History
<Date>      <Authors Name>     <Brief Description of Change>
6/07/2018    Ankita Shanbhag     Initial Creation
------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
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
        } catch(e){
            
        }
    },
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description: Method for showing toast for mobile
History
<Date>      <Authors Name>     <Brief Description of Change>
6/07/2018    Ankita Shanbhag     Initial Creation
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
    
    /*getCallLog: function (component, event, helper,recordId){
        try{
            if(navigator.onLine){
                var recordId = component.get("v.recordId");
                var callLogId = '';
                var actionCall = component.get("c.fetchCallLogObj");
                actionCall.setParams({ acctId : recordId });
                actionCall.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var callLog = data.getReturnValue();
                        callLogId = callLog.Id;
                        component.set("v.callogId",callLogId);
                        var recordId = component.get("v.recordId");
                        var getCallLogId = callLogId;
                        var getAccountRec = recordId;
                        this.fetchObjectives(component, event, helper,getAccountRec,callLogId);
                    } else {
                        var errorsVal = data.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
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
                $A.enqueueAction(actionCall);
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
        
    },*/
    getAccountInformation: function (helper, component, event, getAccountRec) {
        try{
            if(navigator.onLine){
                var actionCall = component.get("c.getRelatedAccount");
                actionCall.setParams({accountId: getAccountRec});
                actionCall.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var account = data.getReturnValue();
                        if ((account.RecordType.Name == 'Off-Premise') || (account.RecordType.Name == 'Chain Off-Premise')) {
                            component.set("v.isOffPrem", true);
                        } else {
                            component.set("v.isOffPrem", false);
                        }
                    } else {
                        var errorsVal = data.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
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
                $A.enqueueAction(actionCall);
                
            }else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    }
})