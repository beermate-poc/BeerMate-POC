jQuery( function($){

    CCRZ.uiProperties.CartDetailView.desktop.tmpl = CCRZ.templates.CCB2B_CartDetail_Template;
    CCRZ.pagevars.storeSettings.Display_Cart_Coupon__c = false;
    CCRZ.subsc = CCRZ.subsc || {};

    CCRZ.pubSub.once('view:CartDetailView:refresh', function(cartDetailView) {
        if(cartDetailView.model.attributes.ECartItemsS.length != 0){
            verifyStock();
            cartDetailView.preRender = CCRZ.subsc.basketItems.preRender;
            cartDetailView.postRender = CCRZ.subsc.basketItems.postRender;
            cartDetailView.processToCheckout = CCRZ.subsc.basketItems.processToCheckout;
            cartDetailView.updateCart = CCRZ.subsc.basketItems.updateCart;
            cartDetailView.removeItem = CCRZ.subsc.basketItems.removeItem;
            cartDetailView.changeQuantity = CCRZ.subsc.basketItems.changeQuantity;
            cartDetailView.adjustQty = CCRZ.subsc.basketItems.adjustQty;
            cartDetailView.updateItemComment = CCRZ.subsc.basketItems.updateItemComment;
            cartDetailView.performSort = CCRZ.subsc.basketItems.performSort;
            cartDetailView.manageOOSModal = CCRZ.subsc.basketItems.manageOOSModal;
            cartDetailView.clearCartButton = CCRZ.subsc.basketItems.confirmClearCart;
            cartDetailView.clearCart = CCRZ.subsc.basketItems.clearCart;

            cartDetailView.delegateEvents(_.extend(cartDetailView.events,
                 {
                     "click .processToCheckout": "processToCheckout",
                     "click .updateCart": "updateCart",
                     "click .clearCartButton":"clearCartButton",
                     "click .clearCart":"clearCart"
                 }
            ));
            cartDetailView.render();
        }
    });

    CCRZ.subsc.basketItems = {
        preRender : function() {
            Handlebars.registerPartial('actionsTotals', CCRZ.templates.CCB2B_CartDetail_ActionTemplate);
            Handlebars.registerPartial('cartItemsQty', CCRZ.templates.CCB2B_CartItemsQtyTemplate);
            Handlebars.registerPartial('cartItemsDesktop', CCRZ.templates.CCB2B_CartDetail_ItemsTemplate);
            Handlebars.registerPartial('headerSection', CCRZ.templates.CCB2B_CartDetail_HeaderTemplate);
            Handlebars.registerPartial('cartItemComment', CCRZ.templates.CCB2B_CartDetail_CommentsTemplate);
            Handlebars.registerPartial('progressTracker', CCRZ.templates.CCB2B_Order_VolumeTrackerProgressTemplate);
            let cartDetailView = CCRZ.cartDetailView;
            if (!CCRZ.CCB2B_DeliveryInfoModel) {
                CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
            }
            cartDetailView.model.deliveryInfoModel = CCRZ.CCB2B_DeliveryInfoModel;
            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                if (resp && resp.success && resp.data) {
                    let left = resp.data.trackerProgress;
                    let mtoo = resp.data.movPercentage;
                    let deliveryDate = resp.data.requestedDate;
                    let leftStr = `${left}%`;
                    let data = {
                        isCart: true,
                        mtoo: mtoo<50 ? `left:${mtoo}%`: `right:${100-mtoo}%;margin-right:${ left>94? 2*(left-95)+9 : 7 }px;` ,
                        mtootext: mtoo<50 ? `left:${mtoo}%`: `right:${100-mtoo}%` ,
                        test: `${left}%`,
                        testval: `${left}%`,
                        testcir:  left<50 ? `left:${left}%`: `right:${100-left}%;margin-right:${ left>94? 2*(left-95)+2 : 0 }px;`, //`${0.93*left}%`,
                        testlen: leftStr.length,
                        ddate: deliveryDate
                    }
                    CCRZ.cartDetailView.model.set('deliveryInfo', resp.data);
                    CCRZ.cartDetailView.model.set('data', data);
                    CCRZ.CCB2B_DeliveryInfoModel.set('deliveryInfo', resp.data);
                    CCRZ.headerView.update();
               }
            });
        },
        postRender : function() {
            let view = CCRZ.cartDetailView;
            cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;

            if (CCRZ.cartDetailView && CCRZ.cartDetailView.model.attributes && CCRZ.cartDetailView.model.attributes.ECartItemsS.length > 0){
                if(cartModel.attributes.cart && cartModel.attributes.cart.CCB2B_MetricCaseEquivalence__c ) {
                    if(cartModel.attributes.cart.CCB2B_MetricCaseEquivalence__c< CCRZ.pagevars.pageConfig["sc.minorderval"]){
                        if ( CCRZ.CCB2B_DeliveryInfoModel ) {
                            let isValidOrderVolume = CCRZ.CCB2B_DeliveryInfoModel.attributes.isValidOrderVolume;
                            if( !isValidOrderVolume ) {
                                let errorSection= $(".minimumOrderWarning");
                                errorSection.show();
                                window.scrollTo(0,0);
                            }
                        } else {
                            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                                if (resp && resp.success && !resp.data.isValidOrderVolume) {
                                    var errorSection= $(".minimumOrderWarning");
                                    errorSection.show();
                                    window.scrollTo(0,0);
                               }
                            })
                        }
                    }
                } else {
                    cartModel.getCartData(function(resp) {
                        if(resp.data.cart.CCB2B_MetricCaseEquivalence__c< CCRZ.pagevars.pageConfig["sc.minorderval"]){
                            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                                if (resp && resp.success && !resp.data.isValidOrderVolume) {
                                    var errorSection= $(".minimumOrderWarning");
                                    errorSection.show();
                                    window.scrollTo(0,0);
                                }
                            });
                        }
                    });
                }
            }
            if(view.pickerView){
                 view.pickerView.render();
            }
            if($('.cc_invalid').length) {
                $('.cc_invalid').addClass('alert alert-danger');
            }

            CCRZ.cartDetailView.manageOOSModal();
        },
        manageOOSModal : function() {},
        processToCheckout: function(event) {
            if(CCRZ.cartDetailView.model.attributes.deliveryInfo){
            let preventCheckout = CCRZ.cartDetailView.model.attributes.deliveryInfo.preventCheckout;
                if(!preventCheckout){
                    showOverlay();
                    CCRZ.cartDetailView.goToCheckout(event);
                }
            }
        },
        performSort: function(event) {
            var view = CCRZ.cartDetailView,
                objLink = $(event.currentTarget),
                sortField = objLink.data("sort"),
                items = view.model.get('ECartItemsS');
            if (sortField == view.params.sortBy) {
                view.model.set('ECartItemsS', new CCRZ.collections.CartItems(items.models.reverse(), {sort: false}));
            }else {
                items.changeSort(sortField);
                items.sort();
                view.params.sortBy = sortField;
            }
            view.render();
            $("#ccb2b-basket-continuecheckout-btn").attr("disabled", false);
            $(".loading_price").hide();
            $(".previous_price").show();
            hideOverlay();
            //enable qty buttons
            $(".readonlyBtn").removeClass("readonlyBtn");
            return false;

        },
        updateCart: function(event, gettingPrice) {
            if(gettingPrice != false){gettingPrice = true;}
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
                     //else just go ahead and save the changes to the model
                  } else {
                       CCRZ.subsc.basketItems.updateCartItems(event, gettingPrice);
                  }
            } else {
                  CCRZ.subsc.basketItems.updateCartItems(event, gettingPrice);
            }
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
                  CCRZ.cartDetailView.manageOOSModal = function() {};
                  CCRZ.CCB2B_CartModel.saveUpdateChanges(view.params.skipAutoCalc, function(response){
                       if (response && response.success) {
                             if(gettingPrice){
                                     fetchCartItems( false, function(){
                                     CCRZ.subsc.basketItems.refreshModel(view);
                                     verifyStock();
                                 })
                             } else{
                                 CCRZ.subsc.basketItems.refreshModel(view);
                             }
                             CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
                       }
                       view.render();
                       hideOverlay();
                       CCRZ.pubSub.trigger("pageMessage", response);
                });
            } else{
                hideOverlay();
            }
        },
        refreshModel : function(view){
            view.attrQtyChanged = false;
            view.params.hasChanged = false;
            hideOverlay();
        },
        removeItem: function(event) {
            showOverlay();
            CCRZ.cartDetailView.manageOOSModal = function() {};
            var objLink = $(event.currentTarget),
                parentElement = objLink.parents(".cart_item"),
                sfid = objLink.data("id"),
                view = CCRZ.cartDetailView,
                cartId = view.model.get('sfid');

            view.invokeCtx('removeItem', cartId, sfid, function (response, event) {
                if (response && response.success && event.status) {
                     parentElement.fadeOut('slow', function(){
                        fetchCartItems(false, function(){
                             view.attrQtyChanged = false;
                             view.params.hasChanged = false;
                             verifyStock();
                             hideOverlay();
                             CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
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
                  let incr = p.find(multipler);
                  let increment = 1;
                  if (incr){
                      increment = parseInt(incr.val());
                  }
                  var qty = parseInt(objItems.val());
                  if (direction > 0 || qty >= increment) {
                       qty = qty + direction * increment;
                  }
                  else {
                       qty = 0;
                  }
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
            }
        },
        confirmClearCart: function(event) {
            var confirmModal = $("#confirmClearCart");
            confirmModal.find(".clearCart");
            confirmModal.modal('show');
        },
        clearCart: function(event) {
            showOverlay();
            $('#confirmClearCart').modal('hide');
            CCRZ.CCB2B_CartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
            CCRZ.CCB2B_CartModel.clearCart(function(resp){
                if(resp && resp.success){
                    goToCart(CCRZ.pagevars.currentCartID);
                }
            })
        },
    };

});


