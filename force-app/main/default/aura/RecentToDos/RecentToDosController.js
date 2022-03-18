({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets todos related to the current account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    init : function(component, event, helper) {
        try{
            if(navigator.onLine){
                // for conditional highlighting based on dates - JS requires the dates to be literally
                // identical for comparators to properly function
                var today = new Date();
                var monthDigit = today.getMonth() + 1;
                if (monthDigit <= 9) {
                    monthDigit = '0' + monthDigit;
                }
                component.set('v.today', today.getFullYear() + "-" + monthDigit + "-" + today.getDate());
                var action = component.get("c.getRecentTasks");
                action.setParams({ accountId : component.get("v.accountId") });
                action.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var tasks = data.getReturnValue();
                        component.set("v.recentTasks", tasks);
                        component.set("v.lastIndexCurrentlyShown", 4);
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                    } else {
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                        $A.log("Errors", data.getError());
                        console.error(data.getError())
                    }
                });
                $A.enqueueAction(action);
            } else {
                var spinner = component.find('spinner');
                $A.util.addClass(spinner, 'slds-hide');
                console.error('No Internet Connection');
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   sets todo to a status of completed
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    doneWithTask : function(component, event, helper) {
        try{
            if(navigator.onLine){
                var spinner = component.find('spinner');
                $A.util.removeClass(spinner, 'slds-hide');
                var recId = event.currentTarget.dataset.record;
                var action = component.get("c.completeTaskServerSide");
                action.setParams({
                    "recId" : recId
                });
                action.setCallback(this, function(a) {
                    if (a.getState() === "SUCCESS") {
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');                        
                    }
                    else if (a.getState() === "ERROR") {
                        $A.log("Errors", a.getError());
                    }
                });
                $A.enqueueAction(action);
                helper.refreshToDos(component, event);
            } else {
                console.error('No Internet Connection');
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   opens edit modal for todo
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    edit : function(component, event, helper) {
        try{
            var c = component.find("taskEditOverlay");
            var recId = event.currentTarget.dataset.record;
            component.set("v.showToDos", false);
            c.open(recId);
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets todos related to the current account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    refresh : function(component, event, helper) {
        helper.refreshToDos(component, event);
    }
})