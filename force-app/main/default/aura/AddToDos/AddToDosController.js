({
    /*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   creates another instance of the AddToRow component
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/14/2017    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
    addInput : function(component, event, helper) {
        try{
            var datePickerPosition = component.get("v.datePickerPosition");
            $A.createComponent(
                "c:AddToDoRow",
                {
                    "aura:id" : "addToDoRow",
                    "datePickerPosition" : datePickerPosition
                },
                function(newRow, status, errorMessage){
                    if (status === "SUCCESS") {
                        var body = component.get("v.body");
                        body.push(newRow);
                        component.set("v.body", body);
                    }
                    else if (status === "INCOMPLETE") {
                        console.error("No response from server or client is offline.")
                    }
                    else if (status === "ERROR") {
                        console.error("Error: " + errorMessage);
                    }
                }
            );
        } catch(e){
            console.error(e);
        }
    }
})