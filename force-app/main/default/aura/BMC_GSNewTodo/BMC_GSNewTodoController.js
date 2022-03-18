({
    /*------------------------------------------------------------
    Author:        Gopala Neeluru
    Company:       Accenture,
    Description:   calls helper to validate inputs
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopala Neeluru     Initial Creation
    ------------------------------------------------------------*/
    addToDo: function (component, event, helper) {
        helper.validatePage(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Gopala Neeluru
    Company:       Accenture,
    Description:   method to close new ToDo Modal on Desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopala Neeluru     Initial Creation
    ------------------------------------------------------------*/
    closeNewToDoModal: function (component, event, helper) {
        component.set("v.showNewToDo", false);
    },
    /*------------------------------------------------------------
    Author:        Gopala Neeluru
    Company:       Accenture,
    Description:   method to close new ToDo Modal on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopala Neeluru     Initial Creation
    ------------------------------------------------------------*/
    closeNewToDoModalMobile: function (component, event, helper) {
        component.set("v.showNewToDo", false);
    }
})