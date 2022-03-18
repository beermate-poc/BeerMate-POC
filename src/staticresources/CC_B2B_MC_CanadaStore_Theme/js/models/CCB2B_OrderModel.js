jQuery(function($){
    CCRZ.models.CCB2B_OrderModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_OrderController',
        reorder: function(orderId, callback) {
            this.invokeCtx('reorder', orderId, function(resp) {
                if(callback != null) {
                    callback(resp);
                }
            },
            {
                buffer: false,
                escape: false,
                nmsp: false

            });
        }
    });
});