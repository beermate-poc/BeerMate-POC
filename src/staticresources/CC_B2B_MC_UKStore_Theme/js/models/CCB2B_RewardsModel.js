jQuery(function($) {
    CCRZ.models.CCB2B_RewardsModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_PromotionController',
        /* function to get promotion details */
        getPromoDetail: function(callback){
                  this.invokeCtx('getAvailablePromotions', function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false
                  });
        },
        /* function to check if promotion is eligible */
        isEligibleForPromotionBySKU : function(productsSku, callback){
                  this.invokeCtx('isEligibleForPromotionBySku', productsSku, function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false
                  });
        },
        /* function to check if promotion is eligible */
        isEligibleForPromotionByProductId : function(productsId, callback){
                  this.invokeCtx('isEligibleForPromotionByProductId', productsId, function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false
                  });
        },
        /* function to add rewards to cart */
        insertDealRewardProducts: function(dealRewardProducts, dealId, callback) {
                  this.invokeCtx('insertDealRewards', dealRewardProducts, dealId, function (resp) {
                        if(callback != null){
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