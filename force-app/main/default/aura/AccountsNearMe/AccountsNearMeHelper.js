({
    callInit : function(component,event,helper){   
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
                        var latUser = position.coords.latitude;
                         if(!$A.util.isEmpty(latUser)){
                        component.set("v.userLatitude",latUser);                             
                        userLat = latUser;
                         }
                        var longUser = position.coords.longitude;
                        if(!$A.util.isEmpty(longUser)){
                        component.set("v.userLongitude",longUser);
                        userLong = longUser;                            
                        } //alert("user lat="+userLat+"\nuser long="+userLong);
                    }
                    function errorCallback(error) {
                        helper.callInit(component,event,helper);
                        var spinnerComp = component.find("spinner");
                        $A.util.removeClass(spinnerComp, "slds-show");
                        $A.util.addClass(spinnerComp, "slds-hide");
                      // helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Account_Near_Me_Geolocation_Error"), 'error');
                    }
                } else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Accounts_Near_Me_Geolocation_Not_Supported"), 'error');
                }                
                var actionTrade = component.get("c.tradeChannelValues");
        		actionTrade.setCallback(this, function(a) {
                var stateTrade = a.getState();
                if (stateTrade === "SUCCESS") {
                    component.set("v.tradeChennelValues",a.getReturnValue());
                }
        });
        $A.enqueueAction(actionTrade);  
                
            } else {
                var spinnerComp = component.find("spinner");
                $A.util.removeClass(spinnerComp, "slds-show");
                $A.util.addClass(spinnerComp, "slds-hide");
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
	/*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   displays toast
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	9/14/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
	displayToast: function (title, message, type, duration) {
		try{
			var toastDisplay = $A.get("e.force:showToast");
			// For lightning1 show the toast
			if (toastDisplay) {
				//fire the toast event in Salesforce1
				var toastParams = {
					"title": title,
					"message": message,
					"type": type
				}
				toastDisplay.setParams(toastParams);
				toastDisplay.fire();
			} 
		} catch(e){
		}
	},
/*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   Returns the list of accounts based on searched Account Name
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    searchAccountTerm : function(component, event, helper){        
            var searchAccountName = component.find("accountName").get("v.value");  
            var actionAccountSearch = component.get("c.searchAccountName");
		actionAccountSearch.setParams({
		   accountName: searchAccountName,
           latitude : component.get("v.userLatitude"),
           longitude: component.get("v.userLongitude")
		});
		actionAccountSearch.setCallback(this, function(a) {
			var stateAccountSearch = a.getState();
			if (stateAccountSearch === "SUCCESS") {
				var acctResponse = a.getReturnValue();
				var eventValue = $A.get("e.c:AccountsLoaded");
				eventValue.setParams({"accounts": acctResponse,"filetrby":$A.get("$Label.c.BMC_AccountName")});
				eventValue.fire();
			}
		});
		$A.enqueueAction(actionAccountSearch);
        },
/*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   Returns List of accounts based on Premise Type.
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    searchPremiseType : function(component, event, helper){
        var premiseType = component.find("premiseType").get("v.value");  
        var actionPremiseSearch = component.get("c.accountPremisetype");
        actionPremiseSearch.setParams({
            premiseType: premiseType,
            latitude : component.get("v.userLatitude"),
            longitude: component.get("v.userLongitude")    
        });
       
        actionPremiseSearch.setCallback(this, function(a) {
            var statePremiseSearch = a.getState();
            if (statePremiseSearch === "SUCCESS") {
                var acctPremiseSearch = a.getReturnValue();
                var eventVal = $A.get("e.c:AccountsLoaded");
                eventVal.setParams({"accounts": acctPremiseSearch,"filetrby":$A.get("$Label.c.BMC_PremiseType")});
                eventVal.fire();
            }
        });
        $A.enqueueAction(actionPremiseSearch);        
    },
    

    

    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   Returns List of accounts based on Trade Channel.
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    searchTradeChannel : function(component, event, helper){
        var tradeChannel = component.find("tradeChannel").get("v.value");  
        var actiontradeChannel = component.get("c.accountTradeChannel");
        actiontradeChannel.setParams({
            tradeChannel: tradeChannel,
            latitude : component.get("v.userLatitude"),
            longitude: component.get("v.userLongitude")
        });
        actiontradeChannel.setCallback(this, function(a) {
            var statetradeChannel = a.getState();
            if (statetradeChannel === "SUCCESS") {
                var accttradeChannel = a.getReturnValue();
                var eventVal = $A.get("e.c:AccountsLoaded");
                eventVal.setParams({"accounts": accttradeChannel,"filetrby":$A.get("$Label.c.BMC_TradeChannel")});
                eventVal.fire();
            }
        });
        $A.enqueueAction(actiontradeChannel);        
    },
    /*------------------------------------------------------------
Author:       Agrata Dhanuka
Company:       Accenture
Description:   Returns List of accounts based on Called on Accounts.
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/
        searchCalledOnAcccounts :  function(component, event, helper){
        var calledOnAcc = component.find("calledOnAcc").get("v.value");  
        var actionCOA = component.get("c.calledOnAccounts");
           
        actionCOA.setParams({
            calledOnAcc: calledOnAcc,
            latitude : component.get("v.userLatitude"),
            longitude: component.get("v.userLongitude")
        });          
        actionCOA.setCallback(this, function(a) {            
            var state = a.getState();            
            if (state === "SUCCESS") {                
                var acct = a.getReturnValue();               
                var eventVal = $A.get("e.c:AccountsLoaded");                
                eventVal.setParams({"accounts": acct,"filetrby":$A.get("$Label.c.C360_CalledOnAccounts")});
                eventVal.fire();            
                
            }
        });
        $A.enqueueAction(actionCOA);        
    },
/*------------------------------------------------------------
Author:       Agrata Dhanuka
Company:       Accenture
Description:   Returns List of accounts based on Sales Channel Description
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/    
    searchSalesChannelDes :  function(component, event, helper){
        var salesChannelDes = component.find("salesChannelDes").get("v.value");  
        var action = component.get("c.salesChannelDesc");
           
        action.setParams({
            salesChannelDes: salesChannelDes,
            latitude : component.get("v.userLatitude"),
            longitude: component.get("v.userLongitude")
        });           
        action.setCallback(this, function(a) {          
            var state = a.getState();

            if (state === "SUCCESS") {                
                var acct = a.getReturnValue();             
                var eventVal = $A.get("e.c:AccountsLoaded");
                eventVal.setParams({"accounts": acct,"filetrby":$A.get("$Label.c.C360_SalesChannelDescription")});
                eventVal.fire();
            }
        });
        $A.enqueueAction(action);        
    },
/*------------------------------------------------------------
Author:       Agrata Dhanuka
Company:       Accenture
Description:   Returns List of accounts based on Accounts Status
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/    
    searchAccountStatus :  function(component, event, helper){
        var accStatus = component.find("accStatus").get("v.value");  
        var action = component.get("c.accountStatus");
           
        action.setParams({
            accStatus: accStatus,
            latitude : component.get("v.userLatitude"),
            longitude: component.get("v.userLongitude")
        });            
        	action.setCallback(this, function(a) {        
            var state = a.getState();         
            if (state === "SUCCESS") {                
                var acct = a.getReturnValue();           
                var eventVal = $A.get("e.c:AccountsLoaded");
                eventVal.setParams({"accounts": acct,"filetrby":$A.get("$Label.c.C360_AccountStatus")});
                eventVal.fire();
            }
        });
        $A.enqueueAction(action);        
    },
    /*------------------------------------------------------------
Author:       Agrata Dhanuka
Company:       Accenture
Description:   Returns List of accounts based on Accounts Status
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Agrata Dhanuka    Initial Creation
------------------------------------------------------------*/    
    searchMyAccounts :  function(component, event, helper){
     //   var myAcc = component.find("myAcc").get("v.value");  
     	var myAcc=true;
        var action = component.get("c.filterByMyAccounts");
           
        action.setParams({
            myAcc: myAcc,
            latitude : component.get("v.userLatitude"),
            longitude: component.get("v.userLongitude")
        });            
        	action.setCallback(this, function(a) {        
            var state = a.getState();         
            if (state === "SUCCESS") {                
                var acct = a.getReturnValue();           
                var eventVal = $A.get("e.c:AccountsLoaded");
                eventVal.setParams({"accounts": acct,"filetrby":$A.get("$Label.c.C360_MyAccounts")});
                eventVal.fire();
            }
        });
        $A.enqueueAction(action);        
    },
    
    doInititem : function(component,event,helper){
        console.log('init');
		    var action = component.get("c.profileName");
        console.log('init2');
        		action.setCallback(this, function(a) {
                var stateTrade = a.getState();
                if (stateTrade === "SUCCESS") {
                    console.log('init3');
                    var acct = a.getReturnValue();
                    console.log(acct);
                    
                    component.set("v.checkProfile",acct);
                    //console.log(a.s());
                   
                }
                     
        });
        $A.enqueueAction(action);  
    },
    
    
})