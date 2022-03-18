jQuery(function ($) {
    CCRZ.uiProperties.productDetailView.desktop.tmpl = CCRZ.templates.CCB2B_ProductDetailTemplate;
    CCRZ.uiProperties.widgetSectionView.desktop.tmpl = CCRZ.templates.CCB2B_ProductDetailWidgetContainerTemplate;
    CCRZ.uiProperties.nameValGroupSectionView.desktop.tmpl = CCRZ.templates.CCB2B_ProductDetailWidgetSectionGroupTmpl;
    CCRZ.uiProperties.prodSectionView.desktop.main.tmpl = CCRZ.templates.CCB2B_ProductsSectionTemplate;

    CCRZ.pubSub.once('view:productDetailView:refresh', function (prodDetailView) {
        prodDetailView.processAddItem = CCRZ.subsc.productDetail.processAddItem;
        prodDetailView.changeQty = CCRZ.subsc.productRelated.changeQty;
        prodDetailView.addToCart = CCRZ.subsc.productDetail.addToCart;
        prodDetailView.proceedLeavePage = CCRZ.subsc.productDetail.proceedLeavePage;
        prodDetailView.handleConfirmLeave = CCRZ.subsc.productDetail.handleConfirmLeave;
        prodDetailView.addToCartKey = CCRZ.subsc.productRelated.addToCartKey;
        prodDetailView.checkQuantity = CCRZ.subsc.productRelated.checkQuantity;
        prodDetailView.delegateEvents(_.extend(prodDetailView.events,
            {
                'click .r_minus': 'changeQty',
                'click .r_plus': 'changeQty',
                'click .r_addItem': 'addToCart',
                'keypress .r_entry': 'addToCartKey',
                'click .addItem': 'addToCart',
                'click .confirmLeaving' : 'proceedLeavePage'
            }
        ));
    });

    CCRZ.subsc.productDetail = {
        handleConfirmLeave: function(){
             $('a:not("#ccb2b-menu-browseproducts, #ccb2b-menu-businesssupport, #ccb2b-menu-helpdesk, .pickWish"), .processToCart, .goToCart, .goToOffer, #logoUrl, .cc_sort_option, .cc_layout_option').on("click", function(e) {
                if(checkIfPositiveQuantity()) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.stop();
                    let confirmModal = $("#confirmLeavePage"),
                        v = CCRZ.prodDetailView;
                    v.tempRedirectionTarget = $(e.currentTarget);
                    confirmModal.modal('show');
                    var submenus = document.getElementsByClassName("dropdown-menu");
                    for (var i = 0; i < submenus.length; i++) {
                        submenus[i].removeAttribute("style");
                    }
                }
           });
        },
        proceedLeavePage : function (event){
            var view = CCRZ.prodDetailView;
            proceedLeavePage(event, view);
        },
        addToCart: function(event) {
             var objLink = $(event.target);
             var qtyInput = objLink.parents(".phoneProductItem").find(".entry");
             var qty = qtyInput.val();
             var incrInput = objLink.parents(".phoneProductItem").find('.item_qtyIncrement');
             var incr = parseInt(incrInput.val());
             var scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
             if(qty !== scrubbedQty || qty < 1) {
              qty = 1
             }
              var sku = objLink.attr("data-sku");
              var parentId = objLink.data("parent");
              var subTerm = $("input[name='subOptionGuider"+sku+"']:checked").val();
              if(subTerm == 'nosuboption')
              {
               subTerm = null;
              }
              var sellerID = objLink.data("seller");
              this.processAddItem(sku, qty, parentId, false, subTerm, sellerID);
        },
        processAddItem: function (sku, qty, parentId, showMessage, subTerm, sellerID) {
            var productName = $('#ccb2b-pdp-addtocart-btn').data('name');
            if (!qty)
                qty = 1;
            this.className = 'cc_RemoteActionController';
            this.invokeContainerLoadingCtx(
                $('.prodDetailContainer')
                , 'addItem', sku, qty, _.isUndefined(parentId) ? null : parentId
                , _.isUndefined(subTerm) ? null : subTerm
                , _.isUndefined(sellerID) ? null : sellerID
                , null, function (response) {
                    var cartId = response.data,
                        rewardModel = (CCRZ.CCB2B_RewardsModel) ? CCRZ.CCB2B_RewardsModel : new CCRZ.models.CCB2B_RewardsModel(),
                        productsSku = [];
                    CCRZ.pagevars.currentCartID = cartId;
                    //cart change will update cookie
                    CCRZ.pubSub.trigger('cartChange', cartId);
                    if (showMessage) {
                        var msgArr = new Array();
                        msgArr[0] = sku;
                        var msg = "";
                        var msgContext;
                        if (response.messages && response.messages.length > 0) {
                            msg = CCRZ.processPageLabelMap('ProductDetails_InvalidSKU');
                            msgContext = CCRZ.createPageMessage('ERROR', "messagingSection-Error", msg);
                        } else {
                            msg = CCRZ.processPageLabelMap('ADDED_TO_CART', msgArr);
                            msgContext = CCRZ.createPageMessage('INFO', "messagingAction-Info", msg);
                        }
                        CCRZ.pubSub.trigger("pageMessage", msgContext);
                    }
                    this.className = 'cc_ctrl_ProductDetailRD';
                    //check if product is eligible for promotion
                    productsSku.push(sku);
                    rewardModel.isEligibleForPromotionBySKU(productsSku, function (resp) {
                        var eligiblePromo = (resp && resp.success && resp.data) ? true : false;
                        CCRZ.pubSub.trigger('eligibleForPromotion', eligiblePromo);
                    });
                    if (CCRZ.pagevars.pageConfig.isTrue('pd.g2c')) {
                        cartDetails();
                    }
                    if (response && response.success) {
                        $('#ccb2b-pdp-qty-input').val(0);
                    }
                   showAddToBasketModal(response,  ` ${qty} x ${productName} `);
                }
            );
        }
    };

    /******************/
    /*Related Products*/
    /******************/
    CCRZ.pubSub.once('view:prodSectionView:refresh', function (prodSectionView) {
        prodSectionView.changeQty = CCRZ.subsc.productRelated.changeQty;
        prodSectionView.addToCart = CCRZ.subsc.productRelated.addToCart;
        prodSectionView.addToCartKey = CCRZ.subsc.productRelated.addToCartKey;
        prodSectionView.delegateEvents(_.extend(prodSectionView.events,
            {
                'click .r_minus': 'changeQty',
                'click .r_plus': 'changeQty',
                'click .r_addItem': 'addToCart',
                'keypress .r_entry': 'addToCartKey',
            }
        ));
        prodSectionView.render();
    });

    CCRZ.subsc.productRelated = {
        changeQty: function (event) {
            var elem = $(event.currentTarget),
                qtySingleIncrement = 1,
                sfid = (elem.attr("data-sfid"));
            if (elem.hasClass("r_minus")) {
                qtySingleIncrement = -parseInt(qtySingleIncrement);
            }
            CCRZ.subsc.productRelated.adjustQuantity(qtySingleIncrement, sfid);
        },
        adjustQuantity: function (qty, sfid) {
            var elem = $("#ccb2b-pdp-related-" + sfid + "_qtyEntry"),
                prevQty = parseInt(elem.val()),
                newQty = (prevQty + qty) > 0 ? prevQty + qty : 0;
            if (newQty > 0) {
                $('.messagingSection-Warning-' + sfid).hide();
            } else {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + elem.attr("data-sfid"), 'Invalid_Qty'));
            }
            elem.val(newQty);
        },
        addToCart: function (event) {
            var elem = $(event.currentTarget),
                productId = (elem.attr("data-sfid")),
                productName = (elem.attr("data-name")),
                qtyInput = $("#ccb2b-pdp-related-" + productId + "_qtyEntry"),
                qty = qtyInput.val(),
                incr = 1,
                scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
            $('.messagingSection-Warning-' + productId).hide();
            if (qty !== scrubbedQty || qty < 1) {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + elem.attr("data-sfid"), 'Invalid_Qty'));
                qtyInput.val(scrubbedQty);
            } else {
                CCRZ.prodDetailView.className = 'cc_RemoteActionController';
                CCRZ.subsc.productRelated.processAddItem(productId, qty, '', productName);
            }
        },
        addToCartKey: function (event) {
            var v = this;
            if (window.event && window.event.keyCode == 13 || event.which == 13) {
                CCRZ.subsc.productRelated.addToCart(event);
                return false;
            } else {
                return CCRZ.util.isValidNumericInput(event);
            }
        },
        processAddItem: function (productId, qty, sellerId, productName) {
            var v = this;
            CCRZ.prodDetailView.invokeContainerLoadingCtx(
                $(".deskLayout")
                , 'addItem'
                , productId, qty, null, null, sellerId, null
                , function (response) {
                    var cartId = response.data;
                    CCRZ.pagevars.currentCartID = cartId;
                    //cart change will update cookie
                    CCRZ.pubSub.trigger('cartChange', cartId);
                    CCRZ.prodDetailView.className = 'cc_ctrl_ProductDetailRD';
                    if (CCRZ.pagevars.pageConfig.isTrue('pd.g2c')) {
                        cartDetails();
                    }
                    showAddToBasketModal(response,  ` ${qty} x ${productName} `);
                    if (response && response.success) {
                        $('#ccb2b-pdp-related-' + productId + '_qtyEntry').val(0);
                    }
                }
            );
        },
    }
});
