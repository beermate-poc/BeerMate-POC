({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   gets notes related to the current account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    refreshNotes : function(component, event){
        try{
            if(navigator.onLine){
                var action = component.get("c.getRecentNotes");
                action.setParams({ accountId : component.get("v.accountId") });
                action.setCallback(this, function(data) {
                    if(data.getState() === "SUCCESS"){
                        var notes = data.getReturnValue();
                        component.set("v.recentNotes", notes);
                        component.set("v.numOfNotes", notes.length);
                        component.set("v.lastIndexCurrentlyShown", 4);
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                    } else {
                        var spinner = component.find('spinner');
                        $A.util.addClass(spinner, 'slds-hide');
                        $A.log("Errors", data.getError());
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