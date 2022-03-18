jQuery(function($){
    CCRZ.models.CCB2B_DeliveryInfoModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_MyAccountController',
        getDeliveryInfo: function(callback) {
            this.invokeCtx('getDeliveryInfo', function(resp) {
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