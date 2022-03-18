({
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   queries for the current list of notes on the server based on the passed in accountId
    <Date>      <Authors Name>     <Brief Description of Change>
    5/07/2017     Brian Mansfield     Initial Creation
    ------------------------------------------------------------*/
    refreshNotes : function(component, event){
        var action = component.get("c.getRecentNotes");
        action.setParams({ accountId : component.get("v.accountId") });
        action.setCallback(this, function(data) {
            var notes = data.getReturnValue();
            component.set("v.recentNotes", notes);
            component.set("v.numOfNotes", notes.length);
            component.set("v.lastIndexCurrentlyShown", 4);
            var spinner = component.find('spinner');
            $A.util.addClass(spinner, 'slds-hide');
        });
        $A.enqueueAction(action);
    }
})