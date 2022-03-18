({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets the users geolocation
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    doInit : function(component,event,helper){
        try{
            if(navigator.onLine){
                var userLat;
                var userLong;
                var options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                };    
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(success, errorCallback);
                    function success(position) {
                        var lat = position.coords.latitude;
                        component.set("v.userLatitude",lat);
                        userLat = lat;
                        var long = position.coords.longitude;
                        component.set("v.userLongitude",long);
                        userLong = long;
                    }
                    function errorCallback(error) {
                        var spinner = component.find('spinner');
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                        helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Account_Near_Me_Geolocation_Error"), 'error');
                    }
                } else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Accounts_Near_Me_Geolocation_Not_Supported"), 'error');
                }
            } else {
                var spinner = component.find('spinner');
                $A.util.removeClass(spinner, "slds-show");
                $A.util.addClass(spinner, "slds-hide");
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   returns a list of accounts based off of the logged in users geolocation
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    handleValueChange : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                var action = component.get("c.findNearbyAccounts");
                action.setParams({
                    latitude : component.get("v.userLatitude"),
                    longitude: component.get("v.userLongitude")
                });
                action.setCallback(this,function(response){
                    var state = response.getState();
                    if(state === 'SUCCESS'){
                        component.set("v.accounts",response.getReturnValue());
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                    } else {
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                var spinner = component.find('spinner');
                $A.util.removeClass(spinner, "slds-show");
                $A.util.addClass(spinner, "slds-hide");
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e) {
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets the accounts from a where to hunt list that are near the users geolocation
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    handleFilterValueChange : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                var acct = $A.get("e.c:AccountsLoaded");
                var filetrby = event.getParam("filetrby");
                var paramAcct = event.getParam("accounts");
                if(filetrby==$A.get("$Label.c.BMC_AccountName") || filetrby==$A.get("$Label.c.BMC_PremiseType") || filetrby==$A.get("$Label.c.BMC_TradeChannel")
                   || filetrby==$A.get("$Label.c.C360_CalledOnAccounts") || filetrby==$A.get("$Label.c.C360_SalesChannelDescription") 
                   || filetrby==$A.get("$Label.c.C360_AccountStatus") || filetrby==$A.get("$Label.c.C360_MyAccounts"))
                {
                    //alert("filterby");
                    component.set("v.accounts", paramAcct);
                }
                if(filetrby==$A.get("$Label.c.BMC_WhereToHunt")){
                var action = component.get("c.findNearbyWhereToHuntAccount"); 
                action.setParams({
                    latitude : component.get("v.userLatitude"),
                    longitude: component.get("v.userLongitude"),
                    accts: paramAcct
                });
                action.setCallback(this,function(response){
                    var state = response.getState();
                    if(state === 'SUCCESS'){
                        component.set("v.accounts",response.getReturnValue());
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                    } else {
                        $A.util.removeClass(spinner, "slds-show");
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                                errors[0].message);
                            }
                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
                }
            } else {
                var spinner = component.find('spinner');
                $A.util.removeClass(spinner, "slds-show");
                $A.util.addClass(spinner, "slds-hide");
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    }
})