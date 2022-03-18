jQuery(function($) {
    CCRZ.models.CCB2B_PaymentTokensModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_PaymentTokenController',
        getPaymentTokens: function(callback) {
            this.invokeCtx('getPaymentTokens', function(resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                });
        },
        removePaymentTokens: function(paymentIds, callback) {
            this.invokeCtx('removePaymentTokens', paymentIds, function(resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                });
        },
        saveSelectedToken: function (tokenId, orderId, callback) {
            this.invokeCtx('saveSelectedCardOnOrder', tokenId, orderId, function(resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                });
        },
        getSelectedToken : function (orderId, callback) {
            this.invokeCtx('getSelectedToken', orderId, function (resp) {
                    if (callback) {
                        callback(resp);
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