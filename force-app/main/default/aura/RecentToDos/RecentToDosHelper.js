({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets todos related to the current account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    refreshToDos : function(component, event){
        try{
            if(navigator.onLine){
                var action = component.get("c.getRecentTasks");
                action.setParams({ accountId : component.get("v.accountId") });
                action.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var toDos = data.getReturnValue();
                        component.set("v.recentTasks", toDos);
                        component.set("v.lastIndexCurrentlyShown", 4);
                        component.set("v.gsloadToDos",true);
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                    } else {
                        $A.log("Errors", data.getError());
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
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
    }
})