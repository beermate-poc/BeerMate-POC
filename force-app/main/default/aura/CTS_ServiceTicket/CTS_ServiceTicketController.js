({
    init: function(cmp, event, helper)
    {
        cmp.set('v.spinnerSpinning', false);
        var effectiveAccountId = helper.getParameterByName(cmp, event, 'effectiveAccount');
        cmp.set('v.effectiveAccountId', effectiveAccountId);
    },
    showModal: function(cmp, event, helper)
    {
        cmp.set('v.showModal', true);
        var inputVariables = [
            { name : 'effectiveAccountId', type : 'String', value: cmp.get('v.effectiveAccountId') }
        ];
        var flow = cmp.find('flowData');
        flow.startFlow('CTS_ServiceTicket', inputVariables);
    },
    closeModal: function(cmp, event, helper)
    {
        if(String(event.getParam('actionType')) === 'CLOSE')
        {
            cmp.set('v.showTable', false);
            cmp.set('v.showTable', true);
        }
        cmp.set('v.showModal', false);
    }
})