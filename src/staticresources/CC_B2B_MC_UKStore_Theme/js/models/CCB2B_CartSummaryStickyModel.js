jQuery(function ($) {
    CCRZ.models.CCB2B_CartSummaryStickyModel = CCRZ.CloudCrazeModel.extend({
        getCartInfo: function () {
            var total = 0,
                subtotal = 0,
                miniCartData = CCRZ.CCB2B_MiniCartModel.get('data');

            if (miniCartData && miniCartData.cartItems) {
                miniCartData.cartItems.forEach(function (val, index) {
                    if (val.ccrz__Quantity__c > 0) total++;
                });

                subtotal = miniCartData.cart ? miniCartData.cart.ccrz__SubtotalAmount__c : 0;
            }

            return {
                totalSavings: miniCartData.totalSavings,
                totalItems: total,
                subtotal: subtotal
            };
        }
    });
});