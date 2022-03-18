({
    doInit: function(component, event, helper) {
        helper.getChannelList(component);
        helper.getCustomValue(component);
    },
    getAccountDetails: function(component, event, helper) {
        helper.getAccount(component);
    }
})