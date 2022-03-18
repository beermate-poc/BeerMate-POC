({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   navigates to account record
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    navigateToDetailsView : function(component, event, helper) {
        var event = $A.get("e.force:navigateToSObject");
        event.setParams({
            "recordId": component.get("v.account").Id
        });
        event.fire();
    },
    
    
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:  fires event that contains selected account
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    AccountSelected : function(component) {
        var event = $A.get("e.c:AccountSelected");
        event.setParams({"account": component.get("v.account")});
        event.fire();
    }
})