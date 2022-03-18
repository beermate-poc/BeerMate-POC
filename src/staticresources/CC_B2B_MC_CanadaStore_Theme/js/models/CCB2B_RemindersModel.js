jQuery(function($){
    CCRZ.models.CCB2B_RemindersModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_MyAccountController',
        getOrderReminder: function(callback) {
            this.invokeCtx('getOrderReminder', function(resp) {
                if(callback != null) {
                    callback(resp);
                }
            },
            {
                buffer : false,
                escape: false,
                nmsp : false
            });
        },
        setOrderReminder: function(reminderMap, callback) {
            this.invokeCtx('setOrderReminder', reminderMap, function(resp) {
                if(callback != null) {
                    callback(resp);
                }
            },
            {
                buffer : false,
                escape: false,
                nmsp : false
            });
        }
    });
});