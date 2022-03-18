({
    initialize: function (component, event, helper) {
        helper.initHelper(component, event, helper);
    },
    handleChange: function (component, event) {
        var selectedOptionValues = event.getParam("value");
        var targetName = event.getSource().get("v.name");

        if (targetName === 'payers') {
            component.set("v.selectedOptions", selectedOptionValues);
        }
    },
    getSelectedItems: function (component, event, helper) {
        helper.setPayers(component, event, helper);
        component.set('v.showModal', false);
    },
    openModal: function(component, event, helper)
    {
        component.set('v.showModal', true);
    },
    closeModal: function(component, event, helper)
    {
        component.set('v.showModal', false);
    }
});