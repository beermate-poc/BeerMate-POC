({
        /*------------------------------------------------------------
    Author:        Ankita Shanbhag
    Company:       Accenture
    Description:   Method for retrieving the Customer Accounts
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
	fecthRelatedContacts : function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                var actionVal = component.get("c.getContacts");
                actionVal.setParams({accountId : AccountId});
                actionVal.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                        component.set('v.contactcolumns', [
                            {label: $A.get("$Label.c.BMC_GSName"), fieldName: $A.get("$Label.c.BMC_GSName"), type: 'text'},
                            {label: $A.get("$Label.c.BMC_GSPosition"), fieldName: $A.get("$Label.c.BMC_GSRole"), type: 'Picklist'},
                            {label: $A.get("$Label.c.BMC_GSEmail"), fieldName: $A.get("$Label.c.BMC_GSEmail"), type: 'email'},
                            {label: $A.get("$Label.c.BMC_GSMobile"), fieldName: $A.get("$Label.c.BMC_GSPhone"), type: 'phone'}
                        ]);     
                            component.set("v.refershContacts",false);
                            component.set("v.contactdata",response.getReturnValue());
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
                $A.enqueueAction(actionVal);
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
    Description:   Method for retrieving the Distributor Accounts
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    fetchRelatedDistributorOwners : function(component, event, helper,AccountId) {
        try{
            if(navigator.onLine){
                var actionOwner = component.get("c.getDistributorUser");
                actionOwner.setParams({accountId : AccountId});
                actionOwner.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                        component.set('v.distContactsownercolumn',[ 
                            {label: $A.get("$Label.c.BMC_GSName"), fieldName: $A.get("$Label.c.BMC_GSPrimaryDistSalesPersonNmec"), type: 'text'},
                            {label: $A.get("$Label.c.BMC_GSDistributor"), fieldName: $A.get("$Label.c.BMC_GSDistributor"), type: 'text'}
                        ]);
                        component.set("v.refershContacts",false);
                        var rowsData = response.getReturnValue();
                        var acctId = [];
                        for (var i = 0; i < rowsData.length; i++) {
                            var rowVal = rowsData[i];                   
                            if (rowVal.DistributorAccount__c) 
                                rowVal.Distributor = rowVal.DistributorAccount__r.Name;
                            	acctId.push(rowVal.DistributorAccount__c);
                        }
                        component.set("v.distAccountId",acctId);
                        component.set("v.callFectchacctOwner",true);
                        component.set("v.distContactsownerData",rowsData);
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
                $A.enqueueAction(actionOwner);
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
    Description:   Method for retrieving the MillerCoors Owners
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Ankita Shanbhag     Initial Creation
    ------------------------------------------------------------*/
    fecthRelatedAccountOwners : function(component, event, helper,AccountIds) {
        try{
            if(navigator.onLine){
                var actionAccount = component.get("c.getAccountOwner");
                actionAccount.setParams({accountIds : AccountIds});
                actionAccount.setCallback(this, function(response) {
                    var stateVal = response.getState();
                    if (stateVal === "SUCCESS") {
                        component.set('v.mcContactcolumn',[ 
                            {label: $A.get("$Label.c.BMC_GSName"), fieldName: $A.get("$Label.c.BMC_GSOwnerName"), type: 'text'},
                            {label: $A.get("$Label.c.BMC_GSTitle"), fieldName: $A.get("$Label.c.BMC_GSTitle"), type: 'text'},
                            {label: $A.get("$Label.c.BMC_GSEmail"), fieldName: $A.get("$Label.c.BMC_GSOwnerEmail"), type: 'email'},
                            {label: $A.get("$Label.c.BMC_GSMobile"), fieldName: $A.get("$Label.c.BMC_GSPhone"), type: 'phone'}
                        ]);
                        component.set("v.refershContacts",false);
                        component.set("v.callFectchacctOwner",false);
                         var rowsData = response.getReturnValue();
                        
                        /*var rows=component.get("v.distContactsownerData");
                        var finaldata = [];
                        //var data1 = [];
                        //var newArray = [];
                        finaldata = rows.concat(rows1);
                        for (var i = 0; i < finaldata.length; i++) {
                            var row = finaldata[i];
                            row.OwnerName = row.Owner.Name;
                            row.OwnerTitle = row.Owner.Title;
                            row.OwnerEmail = row.Owner.Email;
                            row.Phone = row.Owner.Phone;
                            //finaldata.push(row);
                        } 
                        */
                        //alldata.push(rows1);
                        
                        for (var i = 0; i < rowsData.length; i++) {
                           var rowVal = rowsData[i];
                            rowVal.OwnerName = rowVal.Name;
                            rowVal.OwnerTitle = rowVal.Title;
                            //row.OwnerEmail = row.Email;
                            rowVal.Phone = rowVal.Phone;
                        }
                        component.set("v.mcContactdata",rowsData);
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
                $A.enqueueAction(actionAccount);
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
    }
    
    
})