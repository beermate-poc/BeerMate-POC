jQuery( function($){
    CCRZ.uiProperties.productListPageView.productItem.grid.tmpl = CCRZ.templates.CCB2B_ProductListItemGridTemplate;
    CCRZ.uiProperties.productListPageView.productItem.list.tmpl = CCRZ.templates.CCB2B_ProductListItemListTemplate;
    CCRZ.uiProperties.productListPageView.header.tmpl = CCRZ.templates.CCB2B_ProductListHeaderTemplate;
    CCRZ.uiProperties.productListPageView.footer.tmpl = CCRZ.templates.CCB2B_ProductListFooterTemplate;
    CCRZ.uiProperties.productListFilterView.desktop.tmpl = CCRZ.templates.CCB2B_ProductListFilterTemplate;
    CCRZ.uiProperties.productListFilterView.ItemView.tmpl = CCRZ.templates.CCB2B_SpecGroupFilterTemplate;

    CCRZ.pubSub.once('view:productListHeader:refresh', function(productListHeader) {
        productListHeader.addAllToBasket = CCRZ.subsc.productListItems.addAllToBasket;
        productListHeader.delegateEvents(_.extend(productListHeader.events,
            {
                 "click .addAllToBasket" : "addAllToBasket"
            }
        ));
    });

    CCRZ.pubSub.once('view:productListFooter:refresh', function(productListFooter) {
        productListFooter.showMore = CCRZ.subsc.productListItems.showMore;
        productListFooter.addAllToBasket = CCRZ.subsc.productListItems.addAllToBasket;
        productListFooter.showAddAllToWishlistForm = function (e) {
            $('.productListActionButtons').hide();
            $('.addAllToWishlistFormContainer').show();
            $('ul.addllToWishlistList').show();
            $('#addToWishGlass').show();
        };
        productListFooter.delegateEvents(_.extend(productListFooter.events,
            {
                 "click .cc_show_more_products" : "showMore",
                 "click .addAllToFavourites": "showAddAllToWishlistForm",
                 "click .addAllToBasket" : "addAllToBasket"
            }
        ));
        productListFooter.render();
    });

    CCRZ.pubSub.once('view:productListFilterView:refresh', function(productListFilterView) {
        productListFilterView.openFilters = CCRZ.subsc.productListItems.openFilters;
        productListFilterView.collapseFilter = CCRZ.subsc.productListItems.collapseFilter;
        productListFilterView.delegateEvents(_.extend(productListFilterView.events,
             {
                "click .cc_collapse_group": "collapseFilter",
                "click .openFilters": "openFilters"
             }
        ));
        productListFilterView.render();
    });
    CCRZ.pubSub.on('view:productListFilterView:refresh', function(productListFilterView) {
        /*Filter sticky on PLP*/
        CCRZ.subsc.productListItems.makeFilterSticky();
        /*Collapse Filters on mobile*/
        CCRZ.subsc.productListItems.showDesktopFilters();
        var myAccountMobileFilters = $(".openFilters").parent();
        (myAccountMobileFilters.is(':visible')) ? $("#collapseFilters").hide() : $("#collapseFilters").show();
    })
    CCRZ.pubSub.on('view:specGroupListView:refresh', function(view) {
        //ony one filter expanded
        var filterContainer = $('.specGroupContent');
        filterContainer.find(".collapse").on('show.bs.collapse', function () {
            var otherPanels = $(this).parents('.specGroupContent').find('.cc_spec_group_container'),
                collapse = $('.collapse',otherPanels);
            collapse.parent(".cc_spec_grouping").find('a span').removeClass('icon-minus-dark').addClass('icon-plus-dark');
            collapse.removeClass('in');
        })
    });
    CCRZ.pubSub.on('view:productItemView:refresh', function(productItemView) {
        productItemView.gridClass = "col-md-4 col-sm-6 col-xs-12";
        productItemView.preRender = CCRZ.subsc.productListItems.preRender;
        productItemView.addToCart = CCRZ.subsc.productListItems.addToCart;
        productItemView.processAddItem = CCRZ.subsc.productListItems.processAddItem;
        productItemView.delegateEvents(_.extend(productItemView.events,
            {
                'click .cc_add_to_btn' : 'addToCart',
            }
        ));
    });
    CCRZ.pubSub.once('view:productItemsView:refresh', function(productItemsView) {
        productItemsView.preRender = CCRZ.subsc.productListItems.preRender;
        productItemsView.postRender = CCRZ.subsc.productListItems.postRender;
        productItemsView.addToWishListDisabling = CCRZ.subsc.productListItems.addToWishListDisabling;
        productItemsView.checkQuantity = CCRZ.subsc.productListItems.checkQuantity;
        productItemsView.proceedLeavePage = CCRZ.subsc.productListItems.proceedLeavePage;
        productItemsView.manageAddAllToBasketButton = CCRZ.subsc.productListItems.manageAddAllToBasketButton;
        productItemsView.handlecheckbox = CCRZ.subsc.productListItems.handlecheckbox;
        productItemsView.delegateEvents(_.extend(productItemsView.events,
            {
                "click .addToWishlistCheckbox" : "addToWishListDisabling",
                "keyup .entry" : "manageAddAllToBasketButton",
                "click .qty_btn" : "manageAddAllToBasketButton",
                "click .addToWishlistCheckbox": "handlecheckbox",
                "click .confirmLeaving" : "proceedLeavePage"
            }
        ));
        productItemsView.render();
    });

    CCRZ.subsc.productItemsView = {
        addToCart: function(event){
            var qtyInput = $("#" + this.model.get('sfid') + "_qtyEntry"),
                qty = qtyInput.val(),
                productId = this.model.get('sfid'),
                sellerId = !_.isUndefined(this.model.get('sellerID')) ? this.model.get('sellerID') : '',
                incr = parseInt(this.model.get('qtySkipIncrement')),
                scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
            if(qty !== scrubbedQty || qty < 1) {
                qty = 1;
            }
            CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-"+this.model.get('sfid'), null));
            this.className = 'cc_RemoteActionController';
            CCRZ.subsc.productListItems.processAddItem(productId,qty,sellerId);
        }
    }
    CCRZ.views.CCB2B_WishlistAllView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_WishlistAllView',
        templateDesktop : CCRZ.templates.CCB2B_AddAllToWishlistFormTemplate,
        init : function() {
            this.render();
        },
        renderDesktop : function() {
            var view = this;
            view.setElement('.wishButtonsAll');
            if(CCRZ.productListPageView.productItemsView.pickerView && CCRZ.productListPageView.productItemsView.pickerView.coll.length > 0){
                view.model = CCRZ.productListPageView.productItemsView.pickerView.coll;
                view.renderView(view.templateDesktop);
            }else{
                view.model = new CCRZ.collections.WishlistLightList();
                view.model.fetch(function() {
                    view.renderView(view.templateDesktop);
                    if(view.model.length == 0){
                        CCRZ.subsc.productListItems.addToWishListDisabling();
                    }
                });
            }
            //overridden CCRZ functions to prevent default behaviour
            CCRZ.openPDP = function(objLink) {
                if(!checkIfPositiveQuantity()){
                    if (objLink.target === "_blank") {
                        window.open(CCRZ.goToPDP(objLink));
                    } else {
                        window.location = CCRZ.goToPDP(objLink);
                    }
                }
            }
            CCRZ.openPLP = function(objLink) {
                if(!checkIfPositiveQuantity()){
                    if (objLink.target === "_blank") {
                        window.open(CCRZ.goToPLP(objLink));
                    } else {
                        window.location = CCRZ.goToPLP(objLink);
                    }
                }
            }

            var v = CCRZ.productListPageView;
            $('a:not("#ccb2b-menu-productcatalog, #ccb2b-menu-businesssupport, .pickWish, #ccb2b-menu-orderproducts, #ccb2b-menu-helpdesk, #ccb2b-menu-commanderdesproduits, #ccb2b-menu-portfoliodeproduits, #ccb2b-menu-assistance, #ccb2b-menu-informationssurnosmarques"), #ccb2b-menu-brandinformation, .goToCart, .goToOffer, #logoUrl, .cc_sort_option, .cc_layout_option').on("click", function(e) {
                if(checkIfPositiveQuantity()) {
                    var confirmModal = $("#confirmLeavePage");
                    //check if clicked element switches page layout
                    if (this.className.includes('cc_layout_option')) {
                        var buttonId = this.id;
                        //set target layout type in modal
                        if (buttonId.includes('grid')) {
                            confirmModal.find(".confirmLeaving").attr("data-layout","grid");
                        }
                        else if (buttonId.includes('list')) {
                            confirmModal.find(".confirmLeaving").attr("data-layout","list");
                        }
                    }
                    e.preventDefault();
                    e.stopPropagation();
                    v.tempRedirectionTarget = $(e.currentTarget);
                    confirmModal.modal('show');
                    var submenus = document.getElementsByClassName("dropdown-menu");
                    for (var i = 0; i < submenus.length; i++) {
                        submenus[i].removeAttribute("style");
                    }
                }
            });

            $('.cc_page_size_control').on("change", function(e) {
                  if(checkIfPositiveQuantity()) {
                      var selection = $(e.target).val();
                      confirmModal = $("#confirmLeavePage");
                      confirmModal.find(".confirmLeaving").attr("data-size",selection);
                      e.preventDefault();
                      e.stopPropagation();
                      v.tempRedirectionTarget = $(e.currentTarget);
                      confirmModal.modal('show');
                  }
            });


        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate(this.model));
        },
        postRender : function(){
            CCRZ.subsc.productListItems.addToWishListDisabling();
            $('.productListActionButtons').hide();
        },
        events: {
            "click .pickWish" : "addItem",
            "click .addAllToFavourites": "showAddAllToWishlistForm",
            "click h4.closeAddToWishlist": "hideAddAllToWishlistForm",
            "click .defaultWishlistMarker": "propagateAddItem",
            "click .plusWishlistMarker": "propagateAddItem"

        },
        addItem: function(event) {
             var objLink = $(event.target),
                 id = objLink.data("id");
             this.processAddItem(objLink, id);
        },
        propagateAddItem: function(e) {
            $(e.currentTarget.parentElement).find('a').click();

        },
        showAddAllToWishlistForm: function(e) {
            $('.addAllToWishlistFormContainer').show();
            $('ul.addllToWishlistList').show();
        },
        hideAddAllToWishlistForm: function(e) {
            $('.addAllToWishlistFormContainer').hide();
            $('ul.addllToWishlistList').hide();
            $('#addToWishGlass').hide();
            $('.productListActionButtons').show();
        }
        ,
        processAddItem: function(obj, val) {
            var v = this;
            var parentObj = obj.closest('.wishFinder');
            var pickerModal = obj.closest(CCRZ.uiProperties.wishlistPickerModal.nameSelector);
            var createName = pickerModal.find('.newListName').val();
            var skus = [];
            $('.addToWishlistCheckbox:checked').each(function() {
                skus.push($(this).data('id'));
            });
            var pickerView = CCRZ.productListPageView.productItemsView.pickerView;
            if (val == '-1') {
                addMultipleToWishlist(skus, createName, pickerView, true, 'favourites_addall');
                $('.wishButtonsAll .newListName').val('');
            } else {
                var wishListName = pickerModal.find('[data-id="'+val+'"]')[0];
                if (wishListName) {
                    wishListName = wishListName.text;
                }
                addMultipleToWishlist(skus, val, pickerView, false, 'favourites_addall', wishListName);
            }
            CCRZ.subsc.productListItems.addToWishListDisabling();
        }
    });

    CCRZ.subsc.productListItems = {
        preRender : function(qty) {
            Handlebars.registerPartial('priceDisplay', CCRZ.templates.CCB2B_PriceDisplayTemplate);
            Handlebars.registerPartial('productQuantityControls', CCRZ.templates.CCB2B_ProductQuantityControlsTemplate);
        },
        postRender : function() {
            (CCRZ.wishlistAll) ? CCRZ.wishlistAll.render() : CCRZ.wishlistAll = new CCRZ.views.CCB2B_WishlistAllView;
            addNewStylesForZoomOut();
        },
        addToCart: function(event){
            var qtyInput = $("#" + this.model.get('sfid') + "_qtyEntry"),
                qty = qtyInput.val(),
                productId = this.model.get('sfid'),
                sellerId = !_.isUndefined(this.model.get('sellerID')) ? this.model.get('sellerID') : '',
                incr = parseInt(this.model.get('qtySkipIncrement')),
                scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
            if(qty !== scrubbedQty || qty < 1) {
                qty = 1;
            }
            CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-"+this.model.get('sfid'), null));
            this.className = 'cc_RemoteActionController';
            this.processAddItem(productId,qty,sellerId);
        },
        processAddItem: function(productId, qty, sellerId) {
            var v = this;
            var productName = this.model.get('sfdcName');
            this.invokeContainerLoadingCtx(
                $(".deskLayout"),'addItem',productId,qty,null,null,sellerId,null
                ,function(response){
                    cartId = response.data;
                    CCRZ.pagevars.currentCartID = cartId;
                    CCRZ.pubSub.trigger('cartChange', cartId);
                    this.className = 'cc_ctrl_ProductList';
                    if (CCRZ.pagevars.pageConfig.isTrue('pl.g2c')) {
                        cartDetails();
                    }
                    if(response && response.success){
                        $('#'+productId+'_qtyEntry').val(0);
                        manageAddAllToBasketButton();
                    }
                    showAddToBasketModal(response,  ` ${qty} x ${productName} `);
                }
            );
        },
        collapseFilter : function(e){
            setTimeout(function(){
                var elem = $(e.currentTarget).closest('.cc_spec_grouping');
                var filterContainer = elem.find(".cc_spec_values_container");
                if(filterContainer.hasClass('in')){
                    elem.find('a span').removeClass('icon-plus-dark').addClass('icon-minus-dark');
                } else {
                    elem.find('a span').removeClass('icon-minus-dark').addClass('icon-plus-dark');
                }
            }, 350);
        },
        makeFilterSticky : function(){
            $(window).scroll(function() {
                    var width = window.innerWidth, desktopWidth = 1200, mobileWidth = 991, largeWidth = 1550;
                    if (width >= largeWidth){
                        var headerHeight = 157;
                        ($(window).scrollTop() > headerHeight) ?  setStickyFilter(251) : unsetStickyFilter();
                    } else {
                        if(width > desktopWidth ){
                            var headerHeight = 220;
                            ($(window).scrollTop() > headerHeight) ?  setStickyFilter(180) : unsetStickyFilter();
                        } else{
                            if(width > mobileWidth ){
                                var headerHeight = 285;
                                ($(window).scrollTop() > headerHeight) ?  setStickyFilter(142) : unsetStickyFilter();
                            }else{
                                unsetStickyFilter();
                            }
                        }
                    }
            });
        },
        openFilters : function(){
            $("#collapseFilters").slideToggle("slow");
        },
        showDesktopFilters : function() {
           //show filters after resize screen
           window.addEventListener("resize", function() {
                if(window.innerWidth > 991){
                      $("#collapseFilters").show();
                }
           }, false);
        },
        addToWishListDisabling: function(){
           var button = $('.addAllToWishlistButton'),
               checkboxes = $('.addToWishlistCheckbox:checked'),
               minCheckedCheckboxes = 2;
           if(checkboxes.length >= minCheckedCheckboxes){
               $(button).removeAttr("disabled");
               $('.productListActionButtons').show();
               $('.cc_add_to_btn').attr("disabled","disabled");
               $('.cc_add_to_wishList').attr("disabled","disabled");
           }else {
               $(button).attr("disabled","disabled");
               $('.productListActionButtons').hide();
               $('.cc_add_to_btn').removeAttr("disabled","disabled");
               $('.cc_add_to_wishList').removeAttr("disabled","disabled");
           }
        },
        addAllToBasket: function(event) {
           showOverlay();
           var productData = getProductsForAddAllToBasket();
           var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;

            // Hide all invalid qty messages
            CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage("WARN", "messagingSection-Warning-", null));

           cartModel.addAllToCart(productData.products, function(response){
               var wlModal;
               if(response && response.success){
                   wlModal = $('#plp_addall_modal_success');
                   //cart change will update cookie
                   CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
                   hideOverlay();
               }
               else{
                   wlModal = $('#plp_addall_modal_error');
                   hideOverlay();
               }
               setQtyToZero();
               manageAddAllToBasketButton();
               CCRZ.subsc.productListItems.addToWishListDisabling();
               $(wlModal).slideDown();
               setTimeout(function(){
                   $(wlModal).slideUp();
               },2500);
           });
        },
        checkQuantity: function(event){
            var sfid = $(event.target).data('sfid'),
                qtyInput = $("#" + sfid + "_qtyEntry"),
                qty = qtyInput.val(),
                incr = parseInt(this.model.get('qtySkipIncrement')),
                scrubbedQty = CCRZ.util.scrubQuantity(qty);

            manageAddAllToBasketButton(sfid);
            CCRZ.subsc.productListItems.addToWishListDisabling();
            if(qty !== scrubbedQty || qty < 1) {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + sfid, 'Invalid_Qty'));
            } else {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + sfid, null));
            }
        },
        proceedLeavePage : function (event){
            var view = CCRZ.productListPageView;
            proceedLeavePage(event, view);
        },
        manageAddAllToBasketButton : function(event){
           this.checkQuantity(event);
       },
       showMore: function(){
            var v = CCRZ.productListPageView.productItemsView,
                collection = v.collection;

            collection.forEach(function(product){
                product.attributes.qty = $('#'+product.attributes.sfid+'_qtyEntry').val();
                product.attributes.checked = $('#ccb2b-plp-add-to-'+product.attributes.SKU+'-checkbox').is(":checked");
            })

            var currentIndex = v.model.get('renderedCount')-1;
            // Invoke view more method and render the returned items
            collection.findMore(function(items){
                _.each(items, function(product, index){
                    product.set('index', currentIndex+=1);
                    v.addProductView(product);
                });
                _.each(v.itemViews, function(view) {
                    view.$el.toggleClass("col-md-4 col-sm-6 col-xs-12", v.model.get('layout') == 'grid');
                });
                v.render();
                v.addToWishListDisabling();
            });
       },
       handlecheckbox: function(event){
            var sku = event.currentTarget.attributes[3].nodeValue,
                sfid = $(event.target).data('sfid'),
                qtyInput = $("#" + sfid + "_qtyEntry"),
                qty = qtyInput.val(),
                checked = document.getElementById('ccb2b-plp-add-to-'+sku+'-checkbox').checked,
                v = CCRZ.productListPageView.productItemsView,
                layout = v.model.get('layout');
            if(qty>0 && !checked){
                setTimeout(function(){
                    qtyInput.val('0');
                    CCRZ.subsc.productListItems.addToWishListDisabling();
                    qtyInput.removeClass('glow-animation');
                    $('#ccb2b-plp-' + layout + '-qtypminus-' + sku + '-btn').removeAttr("disabled","disabled");
                    $('#ccb2b-plp-' + layout + '-qtyplus-' + sku + '-btn').removeAttr("disabled","disabled");
                },1800)
                 qtyInput.addClass('glow-animation');
                 $('#ccb2b-plp-' + layout + '-qtypminus-' + sku + '-btn').attr("disabled","disabled");
                 $('#ccb2b-plp-' + layout + '-qtyplus-' + sku + '-btn').attr("disabled","disabled");
            }
            CCRZ.subsc.productListItems.addToWishListDisabling();
       }
    }
});
