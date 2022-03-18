jQuery(function($) {
        CCRZ.models.CCB2B_FetchCartModel = CCRZ.CloudCrazeModel.extend({
            className: 'cc_ctrl_Cart3',
            /* function to fetch cart items */
            fetchCart: function ( callback) {
                    var model = this;
                    model.invokeCtx('fetchCart', function (response, event) {
                        var model = CCRZ.cartDetailModel;
                        model.set('messages', (response && response.messages)?response.messages:[]);
                        if (response.success && event.status) {
                            response.data['hasCoupon'] =
                                (response.data.couponList && response.data.couponList.length > 0);
                            response.data['couponName'] =
                                (response.data['hasCoupon'])? response.data.couponList[0]['couponName'] : null;
                            var cartModelData = response.data;
                            model.processData(cartModelData, model);
                        }
                        callback(response);
                        CCRZ.pubSub.trigger("pageMessage", response);
                    }, {escape: false, timeout: 120000});
                },
            });
});