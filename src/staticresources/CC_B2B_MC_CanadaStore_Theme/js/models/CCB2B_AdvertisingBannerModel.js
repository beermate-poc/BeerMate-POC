jQuery(function($){
    CCRZ.models.CCB2B_AdvertisingBannerModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_AdvertisingController',
        fetchPromos: function(callback) {
            this.invokeCtx('fetchPromos', function(resp) {
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