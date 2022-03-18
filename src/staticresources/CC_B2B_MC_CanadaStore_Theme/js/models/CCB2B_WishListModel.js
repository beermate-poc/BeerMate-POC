jQuery(function($){
    CCRZ.models.CCB2B_WishlistModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_ProductListController',
        addMultipleToWishlist: function(skus, val, wlName, callback) {
            this.invokeCtx('addMultipleSkusToWishlist', skus, val, wlName, function(resp) {
                if(callback != null) {
                    callback(resp);
                }
            },
            {
                buffer: false,
                escape: false,
                nmsp: false

            });
        },
        addMultipleSkusToNewWishlist: function(skus, wlName, callback) {
            this.invokeCtx('addMultipleSkusToNewWishlist', skus, wlName, function(resp) {
                if(callback != null) {
                    callback(resp);
                }
            },
            {
                buffer: false,
                escape: false,
                nmsp: false

            });
        },
    });
});