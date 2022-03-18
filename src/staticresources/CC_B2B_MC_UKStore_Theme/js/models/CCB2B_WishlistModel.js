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
        moveMultipleToWishlist: function(skus, val, wlIds, callback) {
            this.invokeCtx('moveMultipleSkusToWishlist', skus, val, wlIds, function(resp) {
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
        moveMultipleToNewWishlist: function(skus, wlName, wlIds, callback) {
            this.invokeCtx('moveMultipleSkusToNewWishlist', skus, wlName, wlIds, function(resp) {
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
        updateSequenceWishlist: function(wishlistItemsIds, callback) {
            this.invokeCtx('updateSequenceWishlist', wishlistItemsIds, function(resp) {
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