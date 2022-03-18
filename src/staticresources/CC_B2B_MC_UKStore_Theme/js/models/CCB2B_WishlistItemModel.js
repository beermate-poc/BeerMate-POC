jQuery(function($){
    CCRZ.models.CCB2B_WishlistItemModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_MyAccountController',
        getWishlistItemsSequence: function(wishlistItemId, callback) {
            this.invokeCtx('getWishlistItemsSequence', wishlistItemId, function(resp) {
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