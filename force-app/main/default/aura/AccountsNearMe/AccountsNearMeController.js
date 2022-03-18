({
    /*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   returns where to hunt lists to be selected by the user
History
<Date>      <Authors Name>     <Brief Description of Change>
9/14/2017    Bryant Daniels     Initial Creation
------------------------------------------------------------*/
    /*getWhereToHuntList : function(component, event, helper) {
try{
if (navigator.geolocation) {
navigator.geolocation.getCurrentPosition(success, errorCallback);
function success(position) {
var filterView = component.get('v.showWhereToHuntList');
if(filterView){
component.set("v.showWhereToHuntList", false);
$A.get('e.force:refreshView').fire();
} else {
component.set("v.showWhereToHuntList", true);
}
}
function errorCallback(error) {
helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Account_Near_Me_Geolocation_Error"), 'error');
}
} else {
helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Accounts_Near_Me_Geolocation_Not_Supported"), 'error');
}
} catch(e){
console.error(e);
helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
}
}*/
/*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   initialises the user latitude and longitude
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    doInit : function(component,event,helper){
		helper.callInit(component,event,helper);
       helper.doInititem(component,event,helper);
    },
/*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   initialises options fro filtering account
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    showFilteroptions: function(component, event, helper) {
        try{
            if(navigator.onLine){
                var selectedValue = component.find("filteroptions").get("v.value");
                if(selectedValue==$A.get("$Label.c.BMC_AccountName")){
                    component.set("v.showAccountName",true);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",false);
                     component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",false);
                    component.set("v.showMyAccounts",false);
                }
                else if(selectedValue==$A.get("$Label.c.BMC_PremiseType")){           
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",true);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",false);
                     component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",false);
                      component.set("v.showMyAccounts",false);
                }
                else if(selectedValue==$A.get("$Label.c.BMC_TradeChannel")){
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",true);
                    component.set("v.showWhereToHuntList",false);
                     component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",false);
                      component.set("v.showMyAccounts",false);
                 }
                else if(selectedValue==$A.get("$Label.c.BMC_WhereToHunt")){
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",true);
                     component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",false);
                      component.set("v.showMyAccounts",false);
                }
                else if(selectedValue==$A.get("$Label.c.C360_CalledOnAccounts")){
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",false);
                    component.set("v.showCalledOnAcc",true);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",false);
                      component.set("v.showMyAccounts",false);
                }
                else if(selectedValue==$A.get("$Label.c.C360_SalesChannelDescription")){
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",false);
                    component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",true);
                    component.set("v.showAccountStatus",false);
                      component.set("v.showMyAccounts",false);
                }
                else if(selectedValue==$A.get("$Label.c.C360_AccountStatus")){
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",false);
                    component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",true);
                    component.set("v.showMyAccounts",false);
                    
                }
                    else if(selectedValue==$A.get("$Label.c.C360_MyAccounts")){
                    component.set("v.showAccountName",false);
                    component.set("v.showPremiseType",false);
                    component.set("v.showTradeChannel",false);
                    component.set("v.showWhereToHuntList",false);
                    component.set("v.showCalledOnAcc",false);
                    component.set("v.showSalesChannelDes",false);
                    component.set("v.showAccountStatus",false);
                    component.set("v.showMyAccounts",true);
                    helper.searchMyAccounts(component, event,helper);
                //    this.selectedMyAccounts(component,event,helper);
                        
                    }
            }
            else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
                 }
        }
        catch(e){
         
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
/*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   calls search account method present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    searchAccount: function (component, event,helper) {
        try{
            if(navigator.onLine){
                helper.searchAccountTerm(component, event,helper);
            }
            else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } 
    },
/*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  calls serachPremiseType function present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    selectedPremiseType: function (component, event,helper) {
        try{
            if(navigator.onLine){
                helper.searchPremiseType(component, event,helper);
            }
            else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
    }
    },
/*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  calls searchCalledOnAcccounts function present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka   Initial Creation
------------------------------------------------------------*/
    
     selectedcallOnAcc: function (component, event,helper) {
        try{
            if(navigator.onLine){
               // alert("If");
                helper.searchCalledOnAcccounts(component, event,helper);
                
            }
            else {
               //  alert("else");
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
    }
    },
/*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  calls searchSalesChannelDes function present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka   Initial Creation
------------------------------------------------------------*/   
    selectedSalesChannelDes: function (component, event,helper) {
        try{
            if(navigator.onLine){
             //   alert("If");
                helper.searchSalesChannelDes(component, event,helper);
                
            }
            else {
               //  alert("else");
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
    }
    },
    /*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  calls searchAccountStatus function present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka   Initial Creation
------------------------------------------------------------*/   
    selectedAccountStatus: function (component, event,helper) {
        try{
            if(navigator.onLine){
              //  alert("If selectedAccountStatus");
                helper.searchAccountStatus(component, event,helper);
                
            }
            else {
                // alert("else");
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
    }
    },
    /*------------------------------------------------------------
Author:        Agrata Dhanuka
Company:       Accenture
Description:  calls searchMyAccounts function present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka   Initial Creation
------------------------------------------------------------*/   
 /*   selectedMyAccounts: function (component, event,helper) {
         alert("in selectedMy accounts");
        try{
           
            if(navigator.onLine){
                alert("If searchMyAccounts");
                helper.searchMyAccounts(component, event,helper);
                
            }
            else {
                // alert("else");
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
    }
    },
    */
        
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:  calls searchTradeChannel function present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    selectedTradeChannel: function (component, event,helper) {
        try{
            if(navigator.onLine){
                helper.searchTradeChannel(component, event,helper);
            }
            else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
    }
    },

 

})