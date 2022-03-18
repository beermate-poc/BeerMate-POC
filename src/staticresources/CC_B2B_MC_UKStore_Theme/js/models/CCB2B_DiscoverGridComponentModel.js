jQuery(function($) {
    CCRZ.models.CCB2B_DiscoverGridComponentModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_DiscoverGridController',
        getData: function (callback) {
            this.invokePageLoadingCtx(
                'getMenus',
                function (response) {
                    if (callback) {
                        callback(response);
                    }
                },
                {
                    nmsp: false,
                    escape: false
                }
            );
        }
    });
});