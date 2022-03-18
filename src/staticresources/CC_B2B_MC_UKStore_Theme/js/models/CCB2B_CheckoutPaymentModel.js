jQuery(function($) {
    CCRZ.models.CCB2B_CheckoutPaymentModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_CartController',
        getPaymentLink : function(orderId, paymentToken, callback) {
            if (paymentToken === "newToken") paymentToken = null;
            this.invokeCtx(
                'getPaymentLink', orderId, paymentToken,
                function (response) {
                    if (callback) {
                        callback(response);
                    }
                },
                {
                    buffer : false,
                    escape: false,
                    nmsp : false
                }
            );
        },
    });
});