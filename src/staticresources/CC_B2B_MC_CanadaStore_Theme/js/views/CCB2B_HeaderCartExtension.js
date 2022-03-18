jQuery( function($){

    CCRZ.uiProperties.cartHeaderView.desktop.tmpl = CCRZ.templates.CCB2B_HeaderCartTemplate;
    CCRZ.pubSub.once("view:cartHeaderView:refresh", function(headerView){
        (CCRZ.CCB2B_HeaderMiniBasketView) ? CCRZ.CCB2B_HeaderMiniBasketView.render() : CCRZ.CCB2B_HeaderMiniBasketView = new CCRZ.views.CCB2B_HeaderMiniBasketView;
    });

    //Definition of Mini Basket view
    CCRZ.views.CCB2B_HeaderMiniBasketView = CCRZ.CloudCrazeView.extend({
        elem : '.CCB2B_HeaderMiniBasketComponent',
        viewName : 'CCB2B_HeaderMiniBasketView',
        templateDesktop : CCRZ.templates.CCB2B_HeaderMiniBasketTemplate,
        init : function() {
            this.fetchCartInfo(false);
        },
        preRender : function() {
            Handlebars.registerPartial('progressTracker', CCRZ.templates.CCB2B_Order_VolumeTrackerProgressTemplate);
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
             $('[data-toggle="popover"]').popover('show');
        },
        renderView : function(currTemplate) {
            this.setElement(this.elem);
            this.$el.html(currTemplate(this.model.toJSON()));
        },
        postRender : function(){
            showOverlay();
            CCRZ.headerView.cartHeaderView.render();
            hideOverlay();

        },
        events: {
            'click .removeItem' : 'confirmRemoveItem',
            'click .goToCart' : 'goToCart',
            'click .removeCartItem': 'removeItems',
            'click .isPromoBadge':'goToOffer',
        },
        fetchCartInfo : function(isAfterRemove, callback){
            showOverlay();
            let view = this;
            let cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : CCRZ.CCB2B_CartModel = new CCRZ.models.CCB2B_CartModel;
            if(!view.model){
                view.model = (CCRZ.CCB2B_MiniCartModel) ? CCRZ.CCB2B_MiniCartModel : CCRZ.CCB2B_MiniCartModel = new CCRZ.models.CCB2B_MiniCartModel;
            }
            cartModel.getCartData(function(resp) {
                 if(resp.data){
                     let left = resp.data.trackerProgress;
                     resp.data.ddate = resp.data.requestedDate;
                     resp.data.test = `${left}%`;
                     resp.data.testval = `${left}%`;
                     resp.data.testcir = left<50 ? `left:${left}%`: `right:${100-left}%`;
                     resp.data.testlen = `${left}%`.length;
                 }
                 if(resp.data.productMedia && resp.data.cartItems){
                     $.each(resp.data.cartItems, function( index, item ){
                        var sku = item.ccrz__Product__r.ccrz__SKU__c;
                        if(Object.keys(resp.data.productMedia).length > 0){
                             var matchingImage;
                             _.find(resp.data.productMedia, function(v, k) {
                                  if (k === sku) {
                                      matchingImage = v;
                                      return true;
                                  }
                             });
                             item['EProductMediasS'] = matchingImage;
                        }
                     });
                 }
                 view.model.set(resp);
                 cartModel.set('cart', resp.data.cart);
                 view.render();
                 CCRZ.headerView.update();
                 hideOverlay();
             });
             if (callback) {
                 callback();
             }
        },
        removeItems: function (event) {
            $("#confirmRemoveCartItem").modal("hide");
            showOverlay();
            var objLink = $(event.currentTarget),
                cartItemIds = [],
                cartItemId = objLink.data("sfid"),
                view = this,
                cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : CCRZ.CCB2B_CartModel = new CCRZ.models.CCB2B_CartModel;
            cartItemIds.push(cartItemId);
            cartModel.removeCartItems(cartItemIds, function(resp){
                if (resp && resp.success) {
                    if(CCRZ.pagevars.currentPageName.toLowerCase() === 'ccrz__cart'){
                          var cartView = CCRZ.cartDetailView;
                          fetchCartItems(true, function(){
                               cartView.attrQtyChanged = false;
                               cartView.params.hasChanged = false;
                               cartView.render();
                               verifyStock();
                               view.fetchCartInfo(true);
                          });
                } else{
                     var parentElem = $(".miniBasketSection"). find(".cartItem[data-id='"+cartItemId+"']" );
                     parentElem.fadeOut(1500, function(){
                         view.fetchCartInfo(true);
                     });
                }
                } else {
                    hideOverlay();
                    $(".errorSection").show();
                }
            });
        },
        confirmRemoveItem: function(event) {
             var elem = $(event.currentTarget),
                productId = elem.data("id"),
                price = elem.data("price"),
                confirmModal = $("#confirmRemoveCartItem");
             confirmModal.find(".removeCartItem").attr("data-sfid", productId);
             confirmModal.find(".removeCartItem").attr("data-price", price);
             confirmModal.modal('show');
        },
        goToCart : function(e){
            if(CCRZ.pagevars.currentPageName!=="ccrz__Cart"){
                showOverlay();
                $(".miniBasketSection").slideUp();
                goToCart(CCRZ.pagevars.currentCartID);
            }
        },
        goToOffer: function(event){
            goToOffer(event);
        },
    });

    //hide miniBasket after click outside
    $(document).click(function (event) {
        if ($(event.target).parents(".modal").length === 0 && $(event.target).parents(".cc_my_chead").length === 0 && $(event.target).parents(".miniBasketSection").length === 0){
            $(".miniBasketSection").slideUp();
        }
    });

    //update mini Basket after change cart
    CCRZ.pubSub.on("cartChange", function(e){
        if(CCRZ.CCB2B_HeaderMiniBasketView){
            CCRZ.CCB2B_HeaderMiniBasketView.fetchCartInfo(true);
        } else {
            CCRZ.CCB2B_HeaderMiniBasketView = new CCRZ.views.CCB2B_HeaderMiniBasketView;
        }
    })

});
