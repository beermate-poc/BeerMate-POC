jQuery( function($){
    CCRZ.uiProperties.CartDetailView.desktop.tmpl = CCRZ.templates.CCB2B_CartDetail_Template;
    CCRZ.pagevars.storeSettings.Display_Cart_Coupon__c = false;
    CCRZ.subsc = CCRZ.subsc || {};

    CCRZ.pubSub.on('view:CartDetailView:refresh', function(cartDetailView) {
        var cartItems = [];
            if (CCRZ.currentCart && CCRZ.currentCart.get("cartItems")) {
                $.each(CCRZ.currentCart.get("cartItems").models, function(index, object){
                    cartItems.push(object.get("mockProduct").id);
                });
            } else {
                if (CCRZ.currentCart && CCRZ.currentCart.get("ECartItemsS")) {
                    $.each(CCRZ.currentCart.get("ECartItemsS").models, function (index, object) {
                        cartItems.push(object.get("product").sfid);
                    });
                }
            }
        CCRZ.views.spotView.model.invokeCtx('fetchRelatedProducts',  cartItems, function(response){
            if(response && response.data) {
                var decodedData = parseUnicodeDecimal(JSON.stringify(response.data.Featured));
                var dataAsObject = JSON.parse(decodedData);
                CCRZ.views.spotView.model.set('Featured', dataAsObject);
                CCRZ.views.spotView.render();
            }
        });
    });

    CCRZ.pubSub.once('view:CartDetailView:refresh', function(cartDetailView) {
        if(cartDetailView.model.attributes.ECartItemsS && cartDetailView.model.attributes.ECartItemsS.length != 0){
            cartDetailView.init = CCRZ.subsc.basketItems.init;
            cartDetailView.preRender = CCRZ.subsc.basketItems.preRender;
            cartDetailView.postRender = CCRZ.subsc.basketItems.postRender;
            cartDetailView.processToCheckout = CCRZ.subsc.basketItems.processToCheckout;
            cartDetailView.removeItem = CCRZ.subsc.basketItems.removeItem;
            cartDetailView.changeQuantity = CCRZ.subsc.basketItems.changeQuantity;
            cartDetailView.adjustQty = CCRZ.subsc.basketItems.adjustQty;
            cartDetailView.goToOffer = CCRZ.subsc.basketItems.goToOffer;
            cartDetailView.updateItemComment = CCRZ.subsc.basketItems.updateItemComment;
            cartDetailView.removeItem = CCRZ.subsc.basketItems.confirmRemoveItem;
            cartDetailView.removeCartItem = CCRZ.subsc.basketItems.removeCartItem;
            cartDetailView.clearCartButton = CCRZ.subsc.basketItems.confirmClearCart;
            cartDetailView.clearCart = CCRZ.subsc.basketItems.clearCart;
            cartDetailView.saveCart = CCRZ.subsc.basketItems.saveCart;
            cartDetailView.saveChanges = CCRZ.subsc.basketItems.saveChanges;
            cartDetailView.saveToModel = CCRZ.subsc.basketItems.saveToModel;
            cartDetailView.qtyKeyPress = CCRZ.subsc.basketItems.qtyKeyPress;
            cartDetailView.checkIfHigherTierDealAvailable = CCRZ.subsc.basketItems.checkIfHigherTierDealAvailable;

            cartDetailView.delegateEvents(_.extend(cartDetailView.events,
                 {
                     "click .processToCheckout": "processToCheckout",
                     "click .removeCartItem": "removeCartItem",
                     "click .clearCartButton":"clearCartButton",
                     "click .clearCart":"clearCart",
                     "keyup .input-text.entry":"adjustQty",
                     "click .isPromoBadge": "goToOffer"
                 }
            ));
            cartDetailView.render();
        }
    });

    CCRZ.pubSub.once('view:CartDetailView:postRender', function (cartDetailView) {
        // Force Update the Basket on first load if there are reward items added
        CCRZ.subsc.basketItems.saveCartChanges(false, true, function (response) {
            var steppedQuantityData = CCRZ.cartDetailModel.get('steppedQuantityData');

            if (steppedQuantityData != null && steppedQuantityData.rewardItemRecentlyRemoved) {
                CCRZ.cartDetailView.model.ifShowRewardItemRemovalModal = true;
                CCRZ.cartDetailView.render();
            }
        });
    });

    CCRZ.pubSub.once('view:spotlightView:refresh', function(spotlightView) {
        spotlightView.changeQty = CCRZ.subsc.spotlightView.changeQty;
        spotlightView.addToCart = CCRZ.subsc.spotlightView.addToCart;
        spotlightView.addToCartKey = CCRZ.subsc.spotlightView.addToCartKey;
        spotlightView.delegateEvents(_.extend(spotlightView.events,
            {
                'click .r_minus' : 'changeQty',
                'click .r_plus' : 'changeQty',
                'click .r_addItem' : 'addToCart',
                'keypress .r_entry' : 'addToCartKey',
            }
        ));
        spotlightView.render();
    });

    CCRZ.subsc.spotlightView = {
        changeQty: function(event){
            var elem = $(event.currentTarget),
                qtySingleIncrement = 1,
                sfid = (elem.attr("data-sfid"));
            if(elem.hasClass("r_minus")){
                qtySingleIncrement = -parseInt(qtySingleIncrement);
            }
            CCRZ.subsc.spotlightView.adjustQuantity(qtySingleIncrement,sfid);
        },
        adjustQuantity: function(qty, sfid){
            var elem = $("#ccb2b-pdp-related-" + sfid + "_qtyEntry"),
                prevQty = parseInt(elem.val()),
                newQty = (prevQty + qty)>0 ? prevQty + qty : 0;
            if(newQty > 0){
                $('.messagingSection-Warning-'+sfid).hide();
            } else{
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-"+elem.attr("data-sfid"), 'Invalid_Qty'));
            }
            elem.val(newQty);
        },
        addToCart: function(event){
            var elem = $(event.currentTarget),
                productId = (elem.attr("data-sfid")),
                productName = (elem.attr("data-name")),
                qtyInput = $("#ccb2b-pdp-related-" + productId + "_qtyEntry"),
                qty = qtyInput.val(),
                incr = 1,
                scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
            $('.messagingSection-Warning-'+productId).hide();
                if(qty !== scrubbedQty || qty < 1) {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-"+elem.attr("data-sfid"), 'Invalid_Qty'));
                qtyInput.val(scrubbedQty);
            } else {
                CCRZ.cartDetailView.className = 'cc_RemoteActionController';
                CCRZ.subsc.spotlightView.processAddItem(productId,qty,'',productName);
            }
        },
        addToCartKey : function(event){
            var v = this;
            if (window.event && window.event.keyCode == 13 || event.which == 13) {
                CCRZ.subsc.spotlightView.addToCart(event);
                return false;
            } else {
                return CCRZ.util.isValidNumericInput(event);
            }
        },
        processAddItem: function(productId, qty, sellerId, productName) {
            var v = this,
                cartView = CCRZ.cartDetailView;
            cartView.invokeContainerLoadingCtx(
                $(".deskLayout")
                ,'addItem'
                ,productId ,qty, null, null,sellerId ,null
                ,function(response){
                    var cartId = response.data;

                    showAddToBasketModal(response, productName);

                    if(response && response.success){

                        cartView.model.priceFetch(cartView.params.skipAutoCalc, function (response, event){
                            CCRZ.pubSub.trigger('cartChange', cartId);
                            CCRZ.pubSub.trigger("action:"+cartView.viewName+":cartItemsRefreshed", cartView);
                            cartView.render();
                        });

                        $('#ccb2b-pdp-related-'+productId+'_qtyEntry').val(0);
                    }
                }
            );
        },
    }

    //Rewards definition
    CCRZ.views.CCB2B_RewardsView = CCRZ.CloudCrazeView.extend({
        elem: '.CCB2B_RewardsTarget',
        viewName : 'CCB2B_RewardsView',
        templateDesktop : CCRZ.templates.CCB2B_RewardsTemplate,
        init: function(){
            this.renderDesktop();
        },
        renderDesktop : function() {
            var view = this;
            view.model = (CCRZ.CCB2B_RewardsModel) ? CCRZ.CCB2B_RewardsModel : new CCRZ.models.CCB2B_RewardsModel();
            var dealSpinner =  document.getElementById("deal-spinner-id");
            if (dealSpinner)
               dealSpinner.style.display = "block";
            view.model.getPromoDetail(function(resp){
                if(resp && resp.success && resp.data){
                    var deals = view.setInitialData(resp.data);
                    view.model.set('rewards', deals);
                    if (!CCRZ.CCB2B_CartSummaryStickyView) {
                        CCRZ.CCB2B_CartSummaryStickyView = new CCRZ.views.CCB2B_CartSummaryStickyView();
                    }
                    if (view.model.get('rewards').isAllDealsUsed && CCRZ.cartDetailView.areAllFreeProductsAvailable && !CCRZ.cartDetailView.model.get('preventCheckout')) {
                        manageButtonLocking('processToCheckout', false);
                        CCRZ.CCB2B_CartSummaryStickyView.model.set('checkoutEnabled', true);    // renders stickyBasket with button enabled
                    } else {
                        manageButtonLocking('processToCheckout', true);
                        CCRZ.CCB2B_CartSummaryStickyView.model.set('checkoutEnabled', false);
                    }

                    // Assign used stepped quantity values at first Deals load
                    if (CCRZ.cartDetailModel && CCRZ.cartDetailModel.get('steppedQuantityData') == null) {
                        CCRZ.cartDetailModel.set('steppedQuantityData', {'usedSteppedQuantityMap' : deals.usedSteppedQuantityMap});
                    }
                }else{
                    view.model.set('rewardsError', resp );
                }
                if (dealSpinner)
                     dealSpinner.style.display = "none";
                view.renderView(view.templateDesktop);
                hideOverlay();
            });
        },
        renderView : function(currTemplate) {
            var view = this;
            view.setElement(view.elem);
            view.$el.html(currTemplate(view.model.toJSON()));
            view.setReadonlyBtn();
        },
        //set initial data to model - calculate deal limit and check if deal contains default product
        setInitialData : function(deals){
            var view = this;
            if(!deals.isAllDealsUsed && deals.dealRewardWrappers.length > 0){
                deals.dealRewardWrappers.forEach(function(deal) {
                    if(deal.isAvailableDeal && deal.productRewardList.length > 0){
                        var highestPriceSKU = deal.highestPriceSKU,
                            dealLimit = deal.quantity,
                            dealRewards = deal.productRewardList,
                            sumOfAddedQty = 0,
                            sumOfLimitQty = 0,
                            isDefaultInRewards = false;
                        dealRewards.forEach(function(reward) {
                            var addedQty = reward.resultQuantity || 0;
                            var limitQty = reward.defaultQuantity || 0;
                            sumOfAddedQty += addedQty;
                            sumOfLimitQty += limitQty;
                            if(reward.isDefaultReward){ isDefaultInRewards = true;}
                        });
                        deal.calculatedDealLimit = parseInt(dealLimit - sumOfAddedQty);
                        deal.maxLimit = parseInt(dealLimit);
                        deal.isDefaultInRewards = isDefaultInRewards;
                    }
                });
            }
            return deals;
        },
        events: {
            'click .add_deal_to_cart' : 'addDealToCart',
            'click .reward-plus' : 'addSingleQty',
            'click .reward-minus' : 'removeSingleQty',
            'keypress .input-text.entry-reward' : 'qtyKeyPress',
            'change .input-text.entry-reward' : 'changeQuantity',
            'keyup .input-text.entry-reward' : 'changeQuantity',
        },
        addSingleQty : function(event){
            this.adjustQty(event, 1, '.item_qtyIncrement');
        },
        removeSingleQty : function(event){
            this.adjustQty(event, -1, '.item_qtyIncrement');
        },
        adjustQty: function(event, direction) {
            var p = $(event.currentTarget).closest(".gp_quantity_block"),
                objItems = p.find(".entry-reward");
            if (objItems) {
                var increment = 1,
                    qty = parseInt(objItems.val());
                (direction > 0 || qty >= increment) ?  qty = qty + direction * increment : qty = 0;
                (qty >= 0) ? objItems.val(qty) : objItems.prev().find("input").addClass('readonlyBtn');
                objItems.change();
            }
        },
        qtyKeyPress: function(event) {
            return CCRZ.util.isValidNumericInput(event);
        },
        setReadonlyBtn: function(){
            var inputs = $(".CCB2B_RewardsTarget").find('.entry-reward'),
                errors = $(".CCB2B_RewardsTarget").find(".limit-exceed-msg"),
                view = this;
            errors.hide();
            inputs.each(function (index, value) {
                 var elem = $(this),
                     qty = parseInt(elem.val()),
                     limit = parseInt((elem.data('limit')).trim());
                 view.checkProductQtyLimit(elem, qty, limit);
            });
        },
        changeQuantity: function(event) {
            var objLink = $(event.target),
                matchId = objLink[0].getAttribute("id").replace("entry_reward_", ""),
                qty = parseInt(objLink.val()) || 0,
                limit = (parseInt(objLink.data('limit'))) ? parseInt(objLink.data('limit')) : 'nolimit',
                dealItem = objLink.closest(".deal-section"),
                dealLimit = parseInt(dealItem.data("limit")) || 0;
            this.checkDealQtyLimit(dealItem, dealLimit);
            this.checkProductQtyLimit(objLink, qty, limit);
        },
        checkProductQtyLimit : function(elem, qty, limit){
            var isAvailable = elem.data('available'),
                view = this;
            switch(true) {
               case !isAvailable:
                    view.setQtyBtnAsReadonly(elem, true, true);
                    break;
               case qty == 0:
                    view.setQtyBtnAsReadonly(elem, true, false);
                    break;
               case (qty >= 0 && qty < limit && limit!='nolimit') || (qty > 0 && limit=='nolimit'):
                    view.setQtyBtnAsReadonly(elem, false, false);
                    break;
               case qty == limit && limit!='nolimit':
                    view.setQtyBtnAsReadonly(elem, false, true);
                    break;
               case qty > limit && limit!='nolimit':
                    view.setQtyBtnAsReadonly(elem, true, false);
                    elem.val(0);
                    elem.closest(".deal-section").find(".limit-exceed-msg").show();
                    break;
               default:
                    view.setQtyBtnAsReadonly(elem, false, false);
            }
        },
        setQtyBtnAsReadonly: function(elem, setMinusBtn, setPlusBtn){
            var minusBtn = elem.prev().find("input"),
                plusBtn = elem.next().find("input");
            (setMinusBtn) ? minusBtn.addClass('readonlyBtn') : minusBtn.removeClass('readonlyBtn');
            (setPlusBtn) ? plusBtn.addClass('readonlyBtn') : plusBtn.removeClass('readonlyBtn');
        },
        checkDealQtyLimit : function(dealItem, dealLimit){
            var itemsQty = 0,
                items = dealItem.find(".entry-reward"),
                addButton = dealItem.find(".cc_add_to_btn");
            items.each(function (index, value) {
                var qty = parseInt($(this).val()) || 0;
                itemsQty += qty;
            });
            switch(true) {
               case itemsQty > dealLimit:
                   dealItem.find(".limit-exceed-msg").show();
                   addButton.attr("disabled","true");
                   addButton.removeClass("add_deal_to_cart");
                   break;
               case itemsQty <= dealLimit:
                   dealItem.find(".limit-exceed-msg").hide();
                   addButton.removeAttr("disabled");
                   addButton.addClass("add_deal_to_cart");
                   break;
            }
        },
        createLitOfSkus: function(items){
            var dealRewardProducts = [];
            items.each(function (index, value) {
                var elem = $(this),
                    qty = parseInt(elem.find(".entry-reward").val()) || 0,
                    sku = elem.data("sku");
                    dealRewardId = elem.data("rewardid");
                dealRewardProducts.push({
                    'quantity': qty,
                    'sku' : sku,
                    'dealRewardId' : dealRewardId
                });
            });
            return dealRewardProducts;
        },
        addDealToCart: function(event) {
            manageButtonLocking('add_deal_to_cart', true);
            var dealId = $(event.currentTarget).data("id"),
                items = $(event.currentTarget).closest(".deal-section").find(".reward-item"),
                dealRewardProducts = this.createLitOfSkus(items);
            this.model.insertDealRewardProducts(dealRewardProducts, dealId,  function(resp){
                if(resp && resp.success){
                    var view = CCRZ.cartDetailView;
                    fetchCartItems(function(){
                         view.attrQtyChanged = false;
                         view.params.hasChanged = false;
                         CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
                    });
                }else{
                    $(".rewardSection").find(".errorAddToBasket").show();
                    hideOverlay();
                }
            });
        }
    });

    CCRZ.subsc.basketItems = {
        preRender : function(){
            Handlebars.registerPartial('actionsTotals', CCRZ.templates.CCB2B_CartDetail_ActionTemplate);
            Handlebars.registerPartial('cartItemsQty', CCRZ.templates.CCB2B_CartItemsQtyTemplate);
            Handlebars.registerPartial('cartItemsDesktop', CCRZ.templates.CCB2B_CartDetail_ItemsTemplate);
            Handlebars.registerPartial('headerSection', CCRZ.templates.CCB2B_CartDetail_HeaderTemplate);
            Handlebars.registerPartial('cartItemComment', CCRZ.templates.CCB2B_CartDetail_CommentsTemplate);

            var view = CCRZ.cartDetailView,
                cartItems = view.model.get('ECartItemsS').models,
                categoryMap = view.model.get('productBasketCategories');
                if(cartItems[0].attributes.sfid == CCRZ.CCB2B_HeaderMiniBasketView.model.attributes.data.cartItems[0].Id){
                    cartItems = cartItems.reverse();
                }
            groupECartItemsPerCategory(view, cartItems, categoryMap);
        },
        postRender : function(){
            var view = CCRZ.cartDetailView,
                cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel,
                selectedDeliveryDate = (window.sessionStorage && window.sessionStorage.getItem("dateForMinimumOrder")) ? window.sessionStorage.getItem("dateForMinimumOrder") : null;
            if (CCRZ.cartDetailView && CCRZ.cartDetailView.model.attributes && CCRZ.cartDetailView.model.attributes.ECartItemsS.length > 0){
                //check reward items error
                if(window.sessionStorage && window.sessionStorage.getItem('RewardError') == 'true') {
                    $('.rewardError').show();
                    window.sessionStorage.removeItem('RewardError');
                }
                if(window.sessionStorage && window.sessionStorage.getItem('RemovedRewardMsg') == 'true') {
                    $('.removeRewardMsg').show();
                    window.sessionStorage.removeItem('RemovedRewardMsg');
                }
                //check minimum order value
                cartModel.checkMinimumOrderValue(selectedDeliveryDate, function(resp){
                    var errorSection= $(".minimumOrderWarning");
                    var totalQuantity = CCRZ.cartDetailView.model.get('totalQuantity');
                    (resp && resp.success && !resp.data && (totalQuantity !== 0)) ? errorSection.show() : errorSection.hide();
                });
                //check if all reward items are available
                cartModel.checkFreeProductsAvailability(getFreeProductsSKUs(CCRZ.cartDetailView.model.attributes.ECartItemsS), function (resp) {
                    view.areAllFreeProductsAvailable = true;
                    var errorSection = $(".unavailableRewardItemWarning");
                    if (resp && resp.success && resp.data === true) {
                        errorSection.show();
                        view.areAllFreeProductsAvailable = false;
                    } else {
                        errorSection.hide();
                    }
                    //initialize Rewards view
                    if (!CCRZ.RewardsWidget){
                        CCRZ.RewardsWidget = new CCRZ.views.CCB2B_RewardsView();
                    } else{
                        CCRZ.RewardsWidget.render();
                    }
                });
                // Show Reward Item Removal Modal
                if (view.model.ifShowRewardItemRemovalModal) {
                    var higherTierModal = $('#higherSteppedTierModal');
                    higherTierModal.modal('show');
                    view.model.ifShowRewardItemRemovalModal = false;
                }
                // Trigger message only when there is reward item in the basket
                _.all(CCRZ.cartDetailView.model.attributes.ECartItemsS.models, function (value) {
                    var result = true;
                    if (value.attributes.CCB2BDealRewardOption != null) {
                        CCRZ.pubSub.trigger("view:"+view.viewName+":postRender", view);
                        result = false;
                    }
                    return result;
                });
            } else{
                hideOverlay();
            }

             //Need this for Request for Quote Validation
             view.initValidationDesktop();
             if(view.pickerView){
                 view.pickerView.render();
             }
             if (view.model.attributes && view.model.attributes.messages) {
                  CCRZ.pubSub.trigger("pageMessage", view.model.attributes);
             }
             if($('.cc_invalid').length) {
                  $('.cc_invalid').addClass('alert alert-danger');
             }

            //initialize Sticky Cart Summary
            if (!CCRZ.CCB2B_CartSummaryStickyView){
                CCRZ.CCB2B_CartSummaryStickyView = new CCRZ.views.CCB2B_CartSummaryStickyView();
            } else {
                CCRZ.CCB2B_CartSummaryStickyView.render();
            }
        },
        saveCartChanges: function(skipAutoCalc, forceUpdate, callback) {
             var view = CCRZ.cartDetailView,
                 hasChanged = CCRZ.cartDetailModel.checkForChanges();
             if (hasChanged || forceUpdate) {
                 CCRZ.CCB2B_CartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
                 var messages = ('messages' in view.model.attributes) ? view.model.unset('messages') : [],
                     cartjson = JSON.stringify(view.model.toJSON());
                 CCRZ.CCB2B_CartModel.updateCartItem(cartjson, function(response){
                     CCRZ.cartDetailModel.set('messages', (response && response.messages) ? response.messages:[]);
                     if (response.success) {
                           CCRZ.cartDetailModel.fetch(skipAutoCalc, callback);
                           CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);

                           view.checkIfHigherTierDealAvailable(response);
                     } else {
                           callback(response);
                     }
                 });
             }
        },
        checkIfHigherTierDealAvailable : function(updateResponse) {
            var cartModel = CCRZ.cartDetailModel;

            // Check if higher tier stepped deal has been reached
            var betterDealReached = false;
            if (cartModel && cartModel.get('steppedQuantityData') != null && updateResponse.data != null) {

                _.each(cartModel.get('steppedQuantityData').usedSteppedQuantityMap, function (value, key) {
                    var newUsedQuantity = updateResponse.data.usedSteppedQuantityMap[key];

                    if (newUsedQuantity != null && value < newUsedQuantity) {
                        betterDealReached = true;
                    }
                });
                if (betterDealReached && updateResponse.data.rewardItemRecentlyRemoved) {
                    // Show Reward Item Removal Modal (Qualified for a higher tier Stepped Deal)
                    cartModel.ifShowRewardItemRemovalModal = true;
                }
            }
            cartModel.set('steppedQuantityData', updateResponse.data);
        },
        saveToModel : function(event){
             var view = CCRZ.cartDetailView;
             if (view.params.hasChanged) {
                  showOverlay();
                  CCRZ.subsc.basketItems.saveCartChanges(view.params.skipAutoCalc, false,function(response){
                       if (response.success) {
                           CCRZ.subsc.basketItems.refreshModel(view);
                           window.scrollTo(0,0);
                           view.render();
                       }
                       CCRZ.pubSub.trigger("pageMessage", response);
                       hideOverlay();
                  });
             }
        },
        saveCart : function(event){
           if($('.gp_cart_attribute_items_modal').hasClass('in')) {
                $('.gp_cart_attribute_items_modal').modal('hide');
           }
           var view = CCRZ.cartDetailView;
           if(CCRZ.pagevars.pageConfig.isTrue('c.noqty') && CCRZ.pagevars.pageConfig.isTrue('c.vernoqty')){
                //find any items in the model with quantity 0
                var items = view.model.get('ECartItemsS');
                var zeroValues = items.filter(function(item){return ( item.get('quantity') === 0 || item.get('quantity') === '0'); });
                //if we found an 0 quantites, then open the modal
                if(zeroValues.length > 0){
                      //popup the modal
                      view.openRemoveModal( event, zeroValues, false);
                      hideOverlay();
                //else just go ahead and save the changes to the model
                } else {
                      CCRZ.subsc.basketItems.saveToModel(event);
                }
           } else {
                CCRZ.subsc.basketItems.saveToModel(event);
           }
        },
        processToCheckout: function(event) {
            showOverlay();
            CCRZ.cartDetailView.goToCheckout(event);
        },
        updateItemComment : function(event){
            var objLink = $(event.currentTarget),
                id = objLink.data("id"),
                items = this.model.get('ECartItemsS'),
                formData = form2js('commentsForm' + id, '.', false, function(node) {}, false),
                matchingLines = items.where({'sfid': id });
            if (matchingLines && matchingLines.length > 0) {
                matchingLines[0].set('comments', formData.note);
            }
            $("#comments_" + id).modal("hide");
            CCRZ.cartDetailView.params.hasChanged = true;
            CCRZ.subsc.basketItems.updateCart(event, false);
        },
        updateCartItems: function(event, gettingPrice){
            showOverlay();
            var view = CCRZ.cartDetailView;
            if (view.params.hasChanged) {
                  CCRZ.CCB2B_CartModel.saveUpdateChanges(view.params.skipAutoCalc, function(response){
                       if (response && response.success) {
                             if(gettingPrice){
                                 fetchCartItems(function(){
                                     CCRZ.subsc.basketItems.refreshModel(view);
                                 })
                             } else{
                                 CCRZ.subsc.basketItems.refreshModel(view);
                             }
                       }
                       CCRZ.pubSub.trigger("pageMessage", response);
                });
            } else{
                hideOverlay();
            }
        },
        refreshModel : function(view){
            view.attrQtyChanged = false;
            view.params.hasChanged = false;
        },
        removeItem: function(event) {
            showOverlay();
            var objLink = $(event.currentTarget),
                parentElement = objLink.parents(".cart_item"),
                sfid = objLink.data("id"),
                view = CCRZ.cartDetailView,
                cartId = view.model.get('sfid');

            view.invokeCtx('removeItem', cartId, sfid, function (response, event) {
                if (response && response.success && event.status) {
                     parentElement.fadeOut('slow', function(){
                        fetchCartItems(function(){
                             view.attrQtyChanged = false;
                             view.params.hasChanged = false;
                             window.scrollTo(0,0);
                        })
                     });
                }
            }, {escape: false, timeout: 120000});
        },
        changeQuantity: function(event) {
            var objLink = $(event.target),
                matchId = objLink[0].getAttribute("id").replace("entry_", ""),
                qty = parseInt(objLink.val()),
                scrubbedQty = CCRZ.util.scrubQuantity(qty),
                revertQty = false,
                view = CCRZ.cartDetailView;
            //based on page config...if true allow 0s else revert 0s
            if (CCRZ.pagevars.pageConfig.isTrue('c.noqty')) {
                revertQty = (qty !== scrubbedQty);
            } else {
                revertQty = (qty !== scrubbedQty || qty < 1);
            }
            if (revertQty) {
                view.revertItemQty(matchId, objLink);
            } else {
                view.updateItemQty(event, matchId, scrubbedQty);
            }
        },
        adjustQty: function(event, direction, multipler) {
            var p = $(event.currentTarget).parent(),
                v = CCRZ.cartDetailView;
            if (CCRZ.disableAdaptive) {
                p = $(event.currentTarget).closest(".gp_quantity_block");
            }
            var objItems = p.find(".entry");
            if (objItems) {
                  var incr = p.find(multipler),
                      increment = 1;
                  if (incr)
                      increment = parseInt(incr.val());
                  var qty = parseInt(objItems.val());
                  if (direction > 0 || qty >= increment)
                       qty = qty + direction * increment;
                  else
                       qty = 0;
                  if (CCRZ.pagevars.pageConfig.isTrue('c.noqty')) {
                        //allow 0 and update the qty
                        objItems.val(qty);
                        v.updateItemQty(event, p.data("id"), qty);
                  } else {
                        //only update if the qty is greater than 0
                        if (qty > 0) {
                             objItems.val(qty);
                             v.updateItemQty(event, p.data("id"), qty);
                             if (qty == 1) {
                                 objItems.prev().find("input").addClass('readonlyBtn');
                             } else {
                                 objItems.prev().find("input").removeClass('readonlyBtn');
                             }
                        } else{
                             objItems.prev().find("input").addClass('readonlyBtn');
                        }
                  }
                  //block Proceed to Checkout button and enable Update button
                  manageButtonLocking('processToCheckout', true);
                  manageButtonLocking('updateCartButton', false);
            }
        },
        confirmRemoveItem: function(event) {
             var elem = $(event.currentTarget),
                sfid = elem.data("id"),
                price = elem.data("price"),
                confirmModal = $("#confirmRemoveCartItem");
             confirmModal.find(".removeCartItem").attr("data-sfid",sfid);
             confirmModal.find(".removeCartItem").attr("data-price",price);
             confirmModal.modal('show');
        },
        removeCartItem: function(event) {
             var objLink = $(event.currentTarget),
                 sfid = objLink.data("sfid"),
                 view = CCRZ.cartDetailView,
                 cartId = view.model.get('sfid');
             $("#confirmRemoveCartItem").modal('hide');
             view.invokeContainerLoadingCtx($('.deskLayout'), 'removeItem', cartId, sfid, function (response, event) {
                if (response.success && event.status) {
                       view.model.priceFetch(view.params.skipAutoCalc, function (response, event){
                              CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
                              CCRZ.pubSub.trigger("action:"+view.viewName+":cartItemsRefreshed", view);
                              view.render();
                       });
                }
             }, {escape: false, timeout: 120000});
        },
        confirmClearCart: function(event) {
            var confirmModal = $("#confirmClearCart");
            confirmModal.find(".clearCart");
            confirmModal.modal('show');
        },
        qtyKeyPress: function(event) {
            //block Proceed to Checkout button and enable Update button
            manageButtonLocking('processToCheckout', true);
            manageButtonLocking('updateCartButton', false);
            return CCRZ.util.isValidNumericInput(event);
        },
        clearCart: function(event) {
            showOverlay();
            $('#confirmClearCart').modal('hide');
            CCRZ.CCB2B_CartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
            CCRZ.CCB2B_CartModel.clearCart(function(resp){
                if(resp && resp.success){
                    goToCart(CCRZ.pagevars.currentCartID);
                }
                else{
                    hideOverlay();
                    var errorMessage = $('.messagingSection-Error');
                    var msg = CCRZ.processPageLabelMap('CCB2B_ClearCartError_Msg');
                    errorMessage.html(msg);
                    errorMessage.show();
                }
            })
        },
        goToOffer: function(event) {
          goToOffer(event);
        },
    };
});
