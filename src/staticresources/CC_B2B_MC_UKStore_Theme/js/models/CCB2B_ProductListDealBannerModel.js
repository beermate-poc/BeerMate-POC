jQuery(function($) {
        CCRZ.models.CCB2B_ProductListDealBannerModel = CCRZ.CloudCrazeModel.extend({
            getCategoryInfo: function() {
                if(CCRZ.productListPageView && CCRZ.productListPageView.headerView){
                    return CCRZ.productListPageView.headerView.model.get('category')
                }
            }
        });
});