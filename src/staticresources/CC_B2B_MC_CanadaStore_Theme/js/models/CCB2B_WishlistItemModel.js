jQuery(function($){
    CCRZ.models.CCB2B_WishlistItemModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_MyAccountController',
        getWishlistItemsCategorizedMap: function(items, callback) {
            this.invokeContainerLoadingCtx($('.deskLayout'),'getWishlistItemsCategorizedMapCA', items, function(resp) {
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