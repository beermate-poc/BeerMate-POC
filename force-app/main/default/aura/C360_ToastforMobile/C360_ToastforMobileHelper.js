({
    /*------------------------------------------------------------
    Author:       Accenture IDC
    Description:  Navigate back to record page when  toast is closed.
    History
   <Date(DMY)> <Authors Name>   <Brief Description of Change>
   12/6/2018    Madhavi         Initial Creation
    ------------------------------------------------------------*/
    navigatetoURL : function (component, event) {
    var recordid=component.get("v.recordId");
    var navEvt = $A.get("e.force:navigateToSObject");
    navEvt.setParams({
      "recordId": recordid,
      "slideDevName": "related"
    });
    navEvt.fire();
    }
})