jQuery( function($){
    CCRZ.uiProperties.myOrdersView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_OrderHistoryTemplate;
    CCRZ.uiProperties.myOrdersView.cancelModal.tmpl = CCRZ.templates.CCB2B_MyAccount_OrderHistoryCancelTemplate;
    CCRZ.uiProperties.contactInfoView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_ContactInfoTemplate;
    CCRZ.uiProperties.contactInfoEditView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_ContactInfoEditTemplate;
    CCRZ.uiProperties.myAccountNavView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_NavTemplate;
    CCRZ.uiProperties.myAccountChangePasswordView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_ChangePasswordTemplate;
    CCRZ.uiProperties.myCartsView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_MyCartsTemplate;
    CCRZ.uiProperties.myWishlistsView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_MyWishlistTemplate;
    CCRZ.uiProperties.wishlistDetailsView.editModal.tmpl = CCRZ.templates.CCB2B_MyAccount_MyWishlistEditTemplate;
    CCRZ.uiProperties.wishlistDetailsView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_MyWishlistDetailTemplate;
    CCRZ.uiProperties.navigatePaginationView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_PaginationTemplate;
    CCRZ.uiProperties.mySubscriptionSummaryNewView.desktop.tmpl = CCRZ.templates.CCB2B_MyAccount_MySubscriptionTemplate;

    //OVERFLOW MYACCOUNT
    CCRZ.MyAccount = _.extend(CCRZ.MyAccount||{},{
           myOverview : {
                  register : function(registrar){
                         registrar.registerNewView('myOverviewView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_Overview_Name'], new CCRZ.views.CCB2B_MyOverviewView());
                  }
           },
           myDocuments : {
                  register : function(registrar){
                      var documentsList = new CCRZ.collections.CCB2B_DocumentModelCollection();
                      var useDocPaginator = CCRZ.getPageConfig('pgbl.doc', false);
                      if(useDocPaginator) {
                          CCRZ.documentsPaginatorView = new CCRZ.views.navigatePaginationView({
                              model : documentsList
                          });
                      }

                      var theView = new CCRZ.views.CCB2B_DocumentsView({
                          model : documentsList
                      });

                      registrar.registerNewView('CCB2B_DocumentsView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_MyDocuments_Section_Menu'], theView);
                      if(useDocPaginator) {
                          CCRZ.documentsPaginatorView.listenTo(theView, "pagination:host:rendered", CCRZ.documentsPaginatorView.hostRendered);
                      }
                  }
           },
		   myDelivery : {
				  register : function(registrar){
						 registrar.registerNewView('CCB2B_DeliveryParametersView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_DeliveryParameters'], new CCRZ.views.CCB2B_DeliveryParametersView());
				  }
		   },
		   myReminders : {
                 register : function(registrar){
                        registrar.registerNewView('myRemindersView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_Reminders_Name'], new CCRZ.views.CCB2B_MyRemindersView());
                 }
           },
    });

    CCRZ.pubSub.on('view:myaccountView:awaitingSubViewInit', function(viewRef){
          if (CCRZ.MyAccount.contactInfo) {
                CCRZ.MyAccount.contactInfo.register(viewRef);
          }
          if (CCRZ.MyAccount.changePassword) {
                CCRZ.MyAccount.changePassword.register(viewRef);
          }
          if (CCRZ.MyAccount.addressBooks) {
                CCRZ.MyAccount.addressBooks.register(viewRef);
          }
          if (CCRZ.MyAccount.myCarts) {
                CCRZ.MyAccount.myCarts.register(viewRef);
          }
          if (CCRZ.MyAccount.myOrders) {
                CCRZ.MyAccount.myOrders.register(viewRef);
          }
          if (CCRZ.MyAccount.myWishlists) {
                CCRZ.MyAccount.myWishlists.register(viewRef);
          }
          if (CCRZ.MyAccount.mySubscriptions) {
                CCRZ.MyAccount.mySubscriptions.register(viewRef);
          }
          if (CCRZ.HDRMyAccount.mySubscriptionsNew) {
               CCRZ.MyAccount.mySubscriptionsNew.register(viewRef);
          }
          if (CCRZ.MyAccount.myInvoices) {
                CCRZ.MyAccount.myInvoices.register(viewRef);
          }
          if (CCRZ.HDRMyAccount.myWallet) {
               CCRZ.MyAccount.myWallet.register(viewRef);
          }
          if(CCRZ.MyAccount.myDocuments){
               CCRZ.MyAccount.myDocuments.register(viewRef);
          }
          if(CCRZ.MyAccount.myDelivery){
               CCRZ.MyAccount.myDelivery.register(viewRef);
          }
          if(CCRZ.MyAccount.myReminders){
              CCRZ.MyAccount.myReminders.register(viewRef);
          }
          viewRef.currIndex = 0;
          CCRZ.pubSub.on("view:myaccountView:subViewInit", function(data) {
                  var v = CCRZ.myaccountView,
                      viewState = getParameterFromUrl('viewState') || 'viewAccount',
                      lastSection = sessionStorage.getItem('lastSection');
                  v.currIndex = v.sectionMap[lastSection] || v.sectionMap[viewState]|| 0;
                  v.subView = v.subViewArray[v.currIndex].view;
                  if (!CCRZ.CCB2B_DeliveryInfoModel) {
                        CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
                  }
                  v.model.deliveryInfoModel = CCRZ.CCB2B_DeliveryInfoModel;
                  CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                        if (resp && resp.success && resp.data) {
                            CCRZ.myaccountView.deliveryInfo = resp.data
                            v.render()
                       }
                  });
                  v.render();
          });
          CCRZ.pubSub.trigger("view:myaccountView:subViewInit", true);
    });

    CCRZ.pubSub.on("view:myaccountView:subViewInit", function(data) {
        var v = CCRZ.myaccountView;
        v.render = CCRZ.subsc.myAccount.render;
        v.gotoSection = CCRZ.subsc.myAccount.gotoSection;
    });

    CCRZ.pubSub.on('view:myaccountHDRView:awaitingSubViewInit', function(viewRef){
        if (CCRZ.HDRMyAccount.contactInfo) {
            CCRZ.HDRMyAccount.contactInfo.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.addressBooks) {
            CCRZ.HDRMyAccount.addressBooks.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.myCarts) {
            CCRZ.HDRMyAccount.myCarts.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.myOrders) {
            CCRZ.HDRMyAccount.myOrders.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.myWishlists) {
            CCRZ.HDRMyAccount.myWishlists.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.mySubscriptions) {
            CCRZ.HDRMyAccount.mySubscriptions.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.mySubscriptionsNew) {
            CCRZ.HDRMyAccount.mySubscriptionsNew.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.myInvoices) {
            CCRZ.HDRMyAccount.myInvoices.register(viewRef);
        }
        if (CCRZ.HDRMyAccount.myWallet) {
            CCRZ.HDRMyAccount.myWallet.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myDocuments){
            CCRZ.HDRMyAccount.myDocuments.register(viewRef);
        }
	    if(CCRZ.HDRMyAccount.myDelivery){
		    CCRZ.HDRMyAccount.myDelivery.register(viewRef);
	    }
	    if(CCRZ.HDRMyAccount.myReminders){
            CCRZ.HDRMyAccount.myReminders.register(viewRef);
        }
        CCRZ.pubSub.trigger("view:myaccountHDRView:subViewInit", true);
    });

    /***************/
    /* OVERVIEW */
    /***************/
    CCRZ.views.CCB2B_MyOverviewView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_MAOverviewView',
        templateDesktop : CCRZ.templates.CCB2B_MyAccount_OverviewTemplate,
        managedSubView : true,
        init: function(){
            var view = this;
            if (!CCRZ.CCB2B_DeliveryInfoModel) {
                CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
            }
            view.model = CCRZ.CCB2B_DeliveryInfoModel;
            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                if (resp && resp.success && resp.data) {
                    CCRZ.myaccountView.subView.model.set('deliveryInfo', resp.data);
                    view.render();
                }
            });
        },
        renderDesktop : function() {
            var v = this;
            (CCRZ.CCB2B_AdvertisingBannerView) ? CCRZ.CCB2B_AdvertisingBannerView.render() : CCRZ.CCB2B_AdvertisingBannerView = new CCRZ.views.CCB2B_AdvertisingBannerView();
            v.$el.html(v.templateDesktop(v.model.toJSON()));
        },
        events: {
            'click .goToInternalSection' : 'goToInternalSection'
        },
        goToInternalSection : function(event){
            var sectionId = $(event.currentTarget).data('id');
            $("#"+sectionId).click();
        }
    });

    /* Advertising Banner */
    CCRZ.views.CCB2B_AdvertisingBannerView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_AdvertisingBannerView',
        templateDesktop : CCRZ.templates.CCB2B_Advertising_Banner_Template,
        elem: '.CCB2B_AdvertisingBannerTarget',
        init: function(){
            var v = this;
            v.model = (CCRZ.CCB2B_AdvertisingBannerModel) ? CCRZ.CCB2B_AdvertisingBannerModel : new CCRZ.models.CCB2B_AdvertisingBannerModel();
            v.model.fetchPromos(function(resp){
                v.model.set('banners', resp.data );
                v.render();
            });
        },
        renderDesktop : function() {
            var v = this,
                sectionIndex = CCRZ.myaccountView.currIndex,
                sectionMap = CCRZ.myaccountView.sectionMap,
                matchingName = '';
                matchingSection = _.find(sectionMap, function(key, val) {
                    if(key == sectionIndex){
                       matchingName =  val;
                       return true;
                    } else {
                        return false;
                    }
                });
            if(matchingSection == sectionIndex){
                switch(matchingName) {
                    case "myOverviewView":
                        v.renderAdvertising("My Account Overview");
                        break;
                    case "myWishlists":
                        v.renderAdvertising("My Account Favourites");
                        break;
                }
            }
        },
        renderAdvertising : function(section){
            var v = this,
                banners = v.model.get('banners');
            if(banners && banners[section]){
                $.each(banners[section], function( type, banner ){
                    switch(type) {
                        case "Banner":
                            v.elem = ".CCB2B_AdvertisingBannerTarget";
                            break;
                        case "Left Nav":
                            v.elem = ".CCB2B_AdvertisingMiniBannerTarget";
                            break;
                    }
                    v.setElement(v.elem);
                    v.$el.html(v.templateDesktop(banner));
                });
            }
        }
    });

    CCRZ.subsc.myAccount = {
        render: function() {
            //restore last selected MA section
            var lastSection = sessionStorage.getItem('lastSection'),
                viewState = getParameterFromUrl('viewState'),
                isViewStateFavourites = (viewState == 'myWishlists'),
                v = this;
            v.currIndex = isViewStateFavourites ? v.sectionMap[viewState] : (v.sectionMap[lastSection] || v.sectionMap[viewState] || 0);
            v.subView = v.subViewArray[v.currIndex].view;
            CCRZ.headerView.model.attributes.viewState = isViewStateFavourites ? viewState : (lastSection || viewState || 'viewAccount');

            if (CCRZ.display.isPhone()) {
                v.$el.html('');
                v.setElement($(CCRZ.uiProperties.myaccountView.phone.selector));
            } else {
                v.$el.html('');
                v.setElement($(CCRZ.uiProperties.myaccountView.desktop.selector));
            }
            if (!v.subView || v.subView == null) {
                v.subView = v.subViewArray[v.currIndex].view;
            }
            if (v.subView.initSetup) {
                v.subView.initSetup(function() {
                    v.renderSubView();
                });
            } else {
                v.renderSubView();
            }
            CCRZ.pubSub.trigger("view:" + v.viewName + ":refresh", v);
        },
        gotoSection : function(index) {
            var v = this;
            v.$el.fadeOut(function() {
                var sectionMap = v.sectionMap, sectionName;
                v.$el.empty().show();
                v.subView = v.subViewArray[index].view;
                v.currIndex = index;
                //save last selected MA section
                _.find(sectionMap, function(val, key) {
                    if (val === index) {
                        sectionName = key;
                        return true;
                    }
                });
                if (sectionName){
                    sessionStorage.setItem('lastSection', sectionName);
                    CCRZ.headerView.model.attributes.viewState = sectionName;
                }
                if (v.subView.initSetup) {
                    v.subView.initSetup(function() {
                        v.renderSubView();
                    });
                } else {
                    v.renderSubView();
                }
            });
        },
    }

    /***************/
    /* WISHLIST LIST */
    /***************/
    CCRZ.pubSub.on('view:myWishlistsView:refresh', function(myWishlistsView) {
         //Advertising Banner
        (CCRZ.CCB2B_AdvertisingBannerView) ? CCRZ.CCB2B_AdvertisingBannerView.render() : CCRZ.CCB2B_AdvertisingBannerView = new CCRZ.views.CCB2B_AdvertisingBannerView();
    });

    /***************/
    /* WISHLIST DETAIL */
    /***************/
    CCRZ.pubSub.once('view:wishlistDetailsView:refresh', function(wishlistDetailsView) {
        wishlistDetailsView.addToCart = CCRZ.subsc.wishlistDetails.addToCart;
        wishlistDetailsView.renderDesktop = CCRZ.subsc.wishlistDetails.renderDesktop;
        wishlistDetailsView.postRender = CCRZ.subsc.wishlistDetails.postRender;
        wishlistDetailsView.reRenderView = CCRZ.subsc.wishlistDetails.reRenderView;
        wishlistDetailsView.getGroupedWishlistItem = CCRZ.subsc.wishlistDetails.getGroupedWishlistItem;
        wishlistDetailsView.changeLayout = CCRZ.subsc.wishlistDetails.changeLayout;
        wishlistDetailsView.catalogFilter = CCRZ.subsc.wishlistDetails.catalogFilter;
        wishlistDetailsView.deleteItem = CCRZ.subsc.wishlistDetails.deleteItem;
        wishlistDetailsView.manageAddAllToBasketButton = CCRZ.subsc.wishlistDetails.manageAddAllToBasketButton;
        wishlistDetailsView.checkQuantity = CCRZ.subsc.wishlistDetails.checkQuantity;
        wishlistDetailsView.adjustQuantity = CCRZ.subsc.wishlistDetails.adjustQuantity;
        wishlistDetailsView.manageQty = CCRZ.subsc.wishlistDetails.manageQty;
        wishlistDetailsView.addAllToBasket = CCRZ.subsc.wishlistDetails.addAllToBasket;
        wishlistDetailsView.searchFavProducts = CCRZ.subsc.wishlistDetails.searchFavProducts;
        wishlistDetailsView.resetSearchFilter = CCRZ.subsc.wishlistDetails.resetSearchFilter;
        wishlistDetailsView.doSearchEnter = CCRZ.subsc.wishlistDetails.doSearchEnter;
        wishlistDetailsView.highlightSearchingWord = CCRZ.subsc.wishlistDetails.highlightSearchingWord;
        wishlistDetailsView.removeHighlightSearchingWord = CCRZ.subsc.wishlistDetails.removeHighlightSearchingWord;
        wishlistDetailsView.disableAddToBasketButtons = CCRZ.subsc.wishlistDetails.disableAddToBasketButtons;
        wishlistDetailsView.resetLayout = CCRZ.subsc.wishlistDetails.resetLayout;
        wishlistDetailsView.searchAndHighlightDetailLayout = CCRZ.subsc.wishlistDetails.searchAndHighlightDetailLayout;
        wishlistDetailsView.searchAndHighlightTableLayout = CCRZ.subsc.wishlistDetails.searchAndHighlightTableLayout;
        wishlistDetailsView.proceedLeavePage = CCRZ.subsc.wishlistDetails.proceedLeavePage;
        wishlistDetailsView.printFavourites = CCRZ.subsc.wishlistDetails.printFavourites;
        wishlistDetailsView.delegateEvents(_.extend(wishlistDetailsView.events,
            {
                'click .addItemToCart': 'addToCart',
                'click .changeLayout': 'changeLayout',
                'change #ccb2b-wishlist-catalog': 'catalogFilter',
                "keyup .entry" : "manageAddAllToBasketButton",
                "click .qty_btn" : "manageAddAllToBasketButton",
                'click .manageQty' : 'manageQty',
                'click .addAllToBasket' : 'addAllToBasket',
                'click .searchFavProducts' : 'searchFavProducts',
                'keyup .searchFavInput' : 'doSearchEnter',
                'click .confirmLeaving' : 'proceedLeavePage',
                'click .printList': 'printFavourites',
            }
        ))
        wishlistDetailsView.render();
    })

    CCRZ.subsc.wishlistDetails = {
        addToCart: function(event){
            var v = this,
                objLink = $(event.target),
                id = objLink.data("id"),
                itemModel = this.wishlistItemData.get(id),
                sku = itemModel.attributes.prodBean.sku,
                productElem, qty, sfid,
                productName = itemModel.attributes.prodBean.name,
                layout = v.$el.find(".changeLayout.active").attr('data-layout');

            switch(layout){
                case 'detail': productElem = objLink.closest(".cc_wish_finder"); break;
                case 'table': productElem = objLink.closest(".myAccFavRow"); break;
            }

            sfid = productElem.attr("data-sfid");
            qty = productElem.find('.entry').val();
            if(qty && qty < 1) {
                qty = 1;
            }
            v.invokeContainerLoadingCtx($('.deskLayout'), 'handleAddtoCart', sku, qty.toString(), function(response){
                cartId = response.data;
                CCRZ.pagevars.currentCartID = cartId;
                //cart change will update cookie
                CCRZ.pubSub.trigger('cartChange', cartId);
                productElem.find('.entry').val(0);
                manageAddAllToBasketButton();
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + sfid, null));
                if (CCRZ.pagevars.pageConfig.isTrue('wl.g2c')) {
                    cartDetails();
                }
                showAddToBasketModal(response,  ` ${qty} x ${productName} `);
            });
        },
        renderDesktop : function(){
             var v = this;
             if (v.dataSet) {
                 v.getGroupedWishlistItem();
             }
             $('a:not("#ccb2b-menu-productcatalog, #ccb2b-menu-businesssupport, .pickWish, #ccb2b-menu-orderproducts, #ccb2b-menu-helpdesk, #ccb2b-menu-commanderdesproduits, #ccb2b-menu-portfoliodeproduits, #ccb2b-menu-assistance, #ccb2b-menu-informationssurnosmarques"), #ccb2b-menu-brandinformation, .goToCart, .goToOffer, #logoUrl, .cc_sort_option, .changeLayout, .cc_prod_link').on("click", function(e) {
                 if(checkIfPositiveQuantity()){
                     e.preventDefault();
                     e.stopPropagation();
                     window.stop();
                     v.tempRedirectionTarget = $(e.currentTarget);
                     $('#confirmLeavePage').modal('show');
                     var submenus = document.getElementsByClassName("dropdown-menu");
                     for (var i = 0; i < submenus.length; i++) {
                       submenus[i].removeAttribute("style");
                     }
                 }
             });


        },
        proceedLeavePage: function(event){
            var view = CCRZ.myaccountView.subView.detailsView;
            proceedLeavePage(event, view);
        },
        reRenderView: function(){
            var view = CCRZ.myaccountView.subView.detailsView;
            view.$el.html(view.templateDesktop(view.dataSet.toJSON()));
            view.postRender();
        },
        postRender: function(){
            var v = this;
            if(v.dataSet.get('selectedCatalogFilter')){
                document.getElementById('ccb2b-wishlist-catalog').value = v.dataSet.get('selectedCatalogFilter');
                $("#ccb2b-wishlist-catalog").change();
            }
            //render Add to favourites
            CCRZ.myaccountView.subView.detailsView.pickerView.render();
        },
		getGroupedWishlistItem: function(){
			var view = CCRZ.myaccountView.subView.detailsView,
			    modelData = view.dataSet,
			    wishlistItemModel = (CCRZ.CCB2B_WishlistItemModel) ? CCRZ.CCB2B_WishlistItemModel : new CCRZ.models.CCB2B_WishlistItemModel,
			    categorizedItems = [], ids = [],
			    itemData = modelData.attributes.itemData;
			for(var i = 0; i < itemData.length; i++){
				ids.push(itemData[i].prodBean.id);
   			}
			wishlistItemModel.getWishlistItemsCategorizedMap(ids,function(resp){
				if(resp && resp.data){
                    var groupedItems = {};
                    _.each(resp.data, function(products, group) {
                        groupedItems[group] = [];
                        _.each(products, function(product){
                            //find matching product and add fields to model
                            var matchingProduct = _.filter(modelData.get('itemData'), function(data){ return data.prodBean.sfid == product.id; });
                            if(product.casesPerRow){
                                matchingProduct[0].casesPerRow = product.casesPerRow;
                            }
                            if (product.casesPerPallet){
                                matchingProduct[0].casesPerPallet = product.casesPerPallet;
                            }
                            groupedItems[group].push(matchingProduct[0]);
                        })
                    });
                    modelData.set('groupedItems', groupedItems);
                }
                view.reRenderView();
			});
		},
		//reset qty, add buttons and search filter while changing layout
		resetLayout : function(){
		    setQtyToZero();
		    this.$el.find(".invalid_qty_msg").hide();
            this.disableAddToBasketButtons();
            this.resetSearchFilter();
            manageAddAllToBasketButton();
        },
		// method to change layout
		changeLayout: function(event){
		    let v = this,
		        layoutBtn = $(event.currentTarget),
		        layoutType = layoutBtn.attr("data-layout"),
		        catalogControl = v.$el.find(".filter-by-catalog-section");
		        catalogControlVal = catalogControl.val(),
		        tableSection = v.$el.find('.wishlist-table-section'),
		        detailSection = v.$el.find('.wishlist-detail-section');

		    layoutBtn.addClass("active").addClass("disabled");
            v.dataSet.set('selectedLayout', layoutType);
            v.dataSet.set('selectedCatalogFilter', catalogControlVal);
            v.resetLayout();

		    switch(layoutType){
		        case 'detail':
		            v.$el.find("#wishlist-tablelayout-button").removeClass("active").removeClass("disabled");
		            tableSection.addClass("hidden");
		            detailSection.removeClass("hidden");
		            catalogControl.addClass("invisible");
		        break;
		        case 'table':
                    v.$el.find("#wishlist-detaillayout-button").removeClass("active").removeClass("disabled");
                    tableSection.removeClass("hidden");
                    detailSection.addClass("hidden");
                    catalogControl.removeClass("invisible");
		        break;
            }
        },
        // method to filter by catalog on table layout
        catalogFilter: function(event){
            let v = this,
                filterBy = $(event.currentTarget).val(),
                catalogSections = v.$el.find(".catalog-group");
            v.dataSet.set('selectedCatalogFilter', filterBy);
            if(filterBy =="All"){
                catalogSections.show();
            } else {
                _.each(catalogSections, function(section){
                    ($(section).attr('data-catalog') == filterBy) ? $(section).show() : $(section).hide();
                });
            }
        },
        deleteItem: function(event) {
             var objLink = $(event.target),
                 id = objLink.data("id"),
                 pid = objLink.data("pid"),
                 parentElement = objLink.closest(".myAccOrderRows"),
                 v = this,
                 itemModel = this.wishlistItemData.get(id);

             v.wishlistItemData.deleteEntity(pid, id, function() {
                  var selectedLayout = v.$el.find(".changeLayout.active").attr("data-layout"),
                      selectedCatalogFilter = v.$el.find("#ccb2b-wishlist-catalog").val();
                  v.wishlistItemData.remove(itemModel);
                  CCRZ.pubSub.trigger('refreshWishlists', id);
                  v.dataSet.set({
                      'itemData': v.wishlistItemData.toJSON(),
                      'productItems': v.wishlistItemData.toJSON(),
                      'selectedLayout': selectedLayout,
                      'selectedCatalogFilter': selectedCatalogFilter
                  });
                  v.render();
             });
        },
        manageAddAllToBasketButton : function(event){
            this.checkQuantity(event);
            manageAddAllToBasketButton();
        },
        checkQuantity: function(event){
            var sfid = $(event.target).data('sfid'),
                layout = this.$el.find(".changeLayout.active").attr('data-layout'),
                qtyInput = $("#" + sfid + "_" + layout +"_qtyEntry"),
                qty = qtyInput.val(),
                addItemToCart = $("#" + sfid + "_" + layout +"_addToCart"),
                scrubbedQty = CCRZ.util.scrubQuantity(qty);
            if(qty !== scrubbedQty || qty < 1) {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + sfid, 'Invalid_Qty'));
                addItemToCart.addClass("disabled").attr("disabled", "disabled");
            } else {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning-" + sfid, null));
                addItemToCart.removeClass("disabled").removeAttr("disabled");
            }
        },
        manageQty: function(event){
            var objLink = $(event.target),
                sfid = objLink.data("sfid"),
                layout = this.$el.find(".changeLayout.active").attr('data-layout'),
                qtyInput = $("#" + sfid + "_" + layout +"_qtyEntry"),
                incr = 1,
                type = objLink.data("type"),
                v = this;

            switch(type){
                case 'add':
                    v.adjustQuantity(event, parseInt(incr), qtyInput);
                break;
                case 'remove':
                     v.adjustQuantity(event, -parseInt(incr),qtyInput)
                break;
            }
        },
        adjustQuantity: function(event, qty, qtyInput){
            var prevQty = parseInt($(qtyInput).val()),
                newQty = (prevQty + qty)>0 ? prevQty + qty : 0;
            $(qtyInput).val(newQty);
            this.manageAddAllToBasketButton(event);
        },
        disableAddToBasketButtons: function(){
            var addAllToBasket  = v.$el.find(".addAllToBasket");
            addAllToBasket.attr("disabled", "disabled");
        },
        //method to add all products with qty to basket
        addAllToBasket: function(event) {
           showOverlay();
           var v = this,
               productData = getProductsForAddAllToBasket(),
               cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;

           // Hide all invalid qty messages
           CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage("WARN", "messagingSection-Warning-", null));

           cartModel.addAllToCart(productData.products, function(response){
               var wlModal;
               if(response && response.success){
                   wlModal = $('#favourites_addtocart_success');
                   //cart change will update cookie
                   CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
                   hideOverlay();
               }
               else{
                   wlModal = $('#favourites_addtocart_error');
                   hideOverlay();
               }
               setQtyToZero();
               manageAddAllToBasketButton();
               $(wlModal).slideDown();
               setTimeout(function(){
                   $(wlModal).slideUp();
               },2500);
           });
        },
        //method to reset search results on 'table' layout
        resetSearchFilter:function(){
            var v = this,
                layout = v.$el.find(".changeLayout.active").attr('data-layout'),
                products = v.$el.find(".cc_wishlist_item"),
                searchVal = v.$el.find('.searchFavInput'),
                catalogGroups = v.$el.find('.catalog-group');
            searchVal.val("");
            //show all products
            _.each(products, function(product){
                var skuElem = $(product).find('.sku-elem')[0],
                    nameElem = $(product).find('.name-elem a')[0];
                v.removeHighlightSearchingWord(skuElem);
                v.removeHighlightSearchingWord(nameElem);
                $(product).show();
            });
            //show all catalogs
            _.each(catalogGroups, function(catalog){
                $(catalog).show();
            });
            //hide nor result message
            v.$el.find(".search-no-result").addClass("hidden");
        },
        //metod to search and highlight on detail layout
        searchAndHighlightDetailLayout: function(products, searchVal){
            var v = this,
                searchNoResult = v.$el.find(".search-no-result"),
                allProductsHidden = true;
            _.each(products, function(product){
                var sku = $(product).attr('data-sku'),
                    skuElem = $(product).find('.sku-elem')[0],
                    name = $(product).attr('data-name').toLowerCase(),
                    nameElem = $(product).find('.name-elem a')[0];
                v.removeHighlightSearchingWord(skuElem);
                v.removeHighlightSearchingWord(nameElem);
                if(sku.indexOf(searchVal) != -1){ //search by sku
                    v.highlightSearchingWord(searchVal, skuElem);
                    $(product).show();
                    allProductsHidden = false;
                } else if(name.indexOf(searchVal.toLowerCase()) != -1){ //search by name
                   v.highlightSearchingWord(searchVal, nameElem);
                   $(product).show();
                   allProductsHidden = false;
                } else {
                    $(product).hide();
                }
            });
            if(allProductsHidden){ searchNoResult.removeClass("hidden"); }
        },

        //metod to search and highlight on table layout
        searchAndHighlightTableLayout: function(products, searchVal){
            var v = this,
                searchNoResult = v.$el.find(".search-no-result"),
                catalogGroups = v.$el.find(".catalog-group"),
                hiddenCatalogs = 0;
            _.each(catalogGroups, function(catalog){
                 var products = $(catalog).find('.cc_wishlist_item'),
                     size = products.length,
                     allProductsInCatalogHidden = true;
                 $(catalog).show();
                 _.each(products, function(product){
                     var sku = $(product).attr('data-sku'),
                         skuElem = $(product).find('.sku-elem')[0],
                         name = $(product).attr('data-name').toLowerCase(),
                         nameElem = $(product).find('.name-elem a')[0];
                     v.removeHighlightSearchingWord(skuElem);
                     v.removeHighlightSearchingWord(nameElem);
                     if(sku.indexOf(searchVal) != -1){ //search by sku
                         $(product).show();
                         v.highlightSearchingWord(searchVal, skuElem);
                         allProductsInCatalogHidden = false;
                     } else if(name.indexOf(searchVal.toLowerCase()) != -1){ //search by name
                         $(product).show();
                         v.highlightSearchingWord(searchVal, nameElem);
                         allProductsInCatalogHidden = false;
                     } else {
                         $(product).hide();
                     }
                 });
                 //if all products in catalog is hidden, hide catalog
                 if(allProductsInCatalogHidden){
                     $(catalog).hide();
                     hiddenCatalogs++;
                 }
            });
            if(hiddenCatalogs == (catalogGroups.length)){
                 searchNoResult.removeClass("hidden");
            }
        },
        //method to search products by SKU
        searchFavProducts: function(event){
            var v = this,
                searchVal = v.$el.find('.searchFavInput').val(),
                layout = v.$el.find(".changeLayout.active").attr('data-layout'),
                products = v.$el.find(".wishlist-"+ layout +"-section .cc_wishlist_item"),
                searchNoResult = v.$el.find(".search-no-result");
            if(searchVal){
                searchNoResult.addClass("hidden");
                switch(layout){
                    case 'detail': v.searchAndHighlightDetailLayout(products, searchVal);
                    break;
                    case 'table': v.searchAndHighlightTableLayout(products, searchVal);
                    break;
                }
            } else {
                v.resetSearchFilter();
            }
        },
        //call search when user click 'enter', reset search when input is empty
        doSearchEnter: function(event) {
            let v = this,
                searchBtn = v.$el.find(".searchFavProducts"),
                searchVal = $(event.currentTarget).val();
            if ((event && event.keyCode == 13 || event.which == 13) && searchBtn.val().trim().length != 0) {
                v.searchFavProducts();
                return false;
            } else {
                if(searchVal == ''){
                    v.resetSearchFilter();
                }
                else { return true; }
            }
        },
        //method to highlight searching sku
        highlightSearchingWord: function(searchVal, inputText) {
             var innerHTML = (inputText.innerHTML) ? inputText.innerHTML : inputText.text;
             var index = (innerHTML.toLowerCase()).indexOf(searchVal.toLowerCase());
             if (index >= 0) {
                 innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+searchVal.length) + "</span>" + innerHTML.substring(index + searchVal.length);
                 inputText.innerHTML = innerHTML;
             }
        },
        removeHighlightSearchingWord: function(inputText){
            if(inputText.href){
                var previousData = $(inputText).parent().attr('data-original-data');
            } else {
                var previousData = $(inputText).attr('data-original-data');
            }
            inputText.innerHTML = previousData;
        },
        printFavourites: function(){
            showOverlay();
            window.print();
            hideOverlay();
        },
    }

    /***************/
    /* MY DOCUMENTS */
    /***************/
    CCRZ.views.CCB2B_DocumentsView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_DocumentsView',
        templateDesktop : CCRZ.templates.CCB2B_MyAccount_MyDocumentsTemplate,
        managedSubView : true,
        initialize : function(){
            this.listenTo(this.model, "reset", this.ready);
            this.dataLoadStarted = false;
            this.dataReady = false;
            this.dataModel = this.model;
        },
        initSetup: function(callback) {
            this.dataLoadStarted = false;
            this.dataReady = false;
            callback();
        },
        ready : function(documentsList, args) {
            this.documentsList = documentsList;
            this.dataReady = true;
            this.render();
        },
        renderDesktop : function() {
            if(this.dataReady){
                var view = this;
                var data = view.documentsList.toJSON();
                view.$el.html(view.templateDesktop(data));
            }
        },
        render : function() {
            if(!this.dataLoadStarted) {
                this.dataModel.fetch();
                this.dataLoadStarted=true;
            }
            if(this.dataReady) {
                this.renderDesktop();
                CCRZ.pubSub.trigger("view:"+this.viewName+":refresh", this);
                this.trigger('pagination:host:rendered', this, {
                    hostView : this.viewName
                });
            }
        },
        preRender: function() {
            if(!this.dataLoadStarted) {
                this.dataModel.fetch();
                this.dataLoadStarted = true;
            }
        },
        postRender: function() {
            if(this.dataReady) {
                this.trigger('pagination:host:rendered', this, {
                    hostView : this.viewName
                });
            }
        },
        downloadFile: function(){
            event.preventDefault();
            window.location.href = $(event.target).data('id');
        },
    });

    /***************/
    /* EDIT ACCOUNT */
    /***************/
    CCRZ.pubSub.once('view:editAccountView:refresh', function(editAccountView) {
        editAccountView.updateAccount = CCRZ.subsc.editAccount.updateContactInformation;
        editAccountView.updateUserInformation = CCRZ.subsc.editAccount.updateUserInformation;
        editAccountView.delegateEvents(_.extend(editAccountView.events,
            {
                "click .updateAccount": "updateAccount",
            }
        ));
        editAccountView.render();
    });

    CCRZ.subsc.editAccount = {
        updateContactInformation: function(event) {
             showOverlay();
             var objLink = $(event.currentTarget),
                 v = this,
                 serializedMyAccountForm = $("#myAccountForm").serializeObject();

             // OOTB logic workaround
             serializedMyAccountForm['mailingAddress.city'] = '-';
             serializedMyAccountForm['mailingAddress.countryCode'] = '-';
             serializedMyAccountForm['mailingAddress.postalCode'] = '-';
             serializedMyAccountForm['mailingAddress.state'] = '-';
             serializedMyAccountForm['mailingAddress.street'] = '-';
             serializedMyAccountForm['otherAddress.city'] = '-';
             serializedMyAccountForm['otherAddress.countryCode'] = '-';
             serializedMyAccountForm['otherAddress.postalCode'] = '-';
             serializedMyAccountForm['otherAddress.state'] = '-';
             serializedMyAccountForm['otherAddress.street'] = '-';

             if (v.model.get("preventContactEdit")) {
                 v.updateUserInformation(objLink, serializedMyAccountForm);
             } else {
                 v.model.updateContactInformation(serializedMyAccountForm, false, function(response) {
                     if (response && response.success) {
                         v.updateUserInformation(objLink, serializedMyAccountForm);
                     } else {
                         if (response && response.messages) {
                              CCRZ.pubSub.trigger('pageMessage', response);
                              $('.acctmainSection')[0].scrollIntoView();
                         }
                         doneLoading(objLink);
                         hideOverlay();
                     }
                 });
             }
        },
        updateUserInformation: function(objLink, serializedMyAccountForm) {
            var v = this;
            v.model.updateUserInformation(serializedMyAccountForm, false, function(response) {
            if (response && response.success) {
                 CCRZ.pubSub.trigger('myAccountUpdate', response);
                 location.reload();
            } else {
                 if (response && response.messages) {
                      CCRZ.pubSub.trigger('pageMessage', response);
                      $('.acctmainSection')[0].scrollIntoView();
                 }
                 doneLoading(objLink);
                 hideOverlay();
            }
            });
        }
    }
    /***************/
    /* ACCOUNT NAV*/
    /***************/
    CCRZ.pubSub.on('view:myAccountNavView:refresh', function(accountNavView) {
        var myAccountMobileNav = $(".openAccountMenu").parent();
        (myAccountMobileNav.is(':visible')) ? $(".cc_myaccount_nav_list").hide() : $(".cc_myaccount_nav_list").show();
        selectCurrentSubView();
        accountNavView.openAccountMenu = CCRZ.subsc.accountNav.openAccountMenu;
        accountNavView.delegateEvents(_.extend(accountNavView.events,
            {
                "click .openAccountMenu": "openAccountMenu"
            }
        ));
        //clear advertising banners
        $(".CCB2B_AdvertisingBannerTarget").html("");
        $(".CCB2B_AdvertisingMiniBannerTarget").html("");
        CCRZ.subsc.accountNav.showDefaultMenu();

    });
    CCRZ.subsc.accountNav = {
        openAccountMenu : function() {
            $(".cc_myaccount_nav_list").slideToggle("slow");
        },
        showDefaultMenu : function() {
            //show default menu after resiaze screen
            window.addEventListener("resize", function() {
                 if (window.innerWidth > 991){
                        $(".cc_myaccount_nav_list").css("display","block");
                 }
            }, false);
        }
    }
    /***************/
    /* CHANGE PASSWORD */
    /***************/
    CCRZ.pubSub.once('view:changePasswordView:refresh', function(changePasswordView) {
        changePasswordView.updatePassword = CCRZ.subsc.changePasswordView.updatePassword;
        changePasswordView.delegateEvents(_.extend(changePasswordView.events,
            {
                "click .ccb2b-updatepassword" : "updatePassword"
            }
        ));
        changePasswordView.render();
    });
    CCRZ.subsc.changePasswordView = {
        updatePassword : function() {
            var currentPassword = $('#ccb2b-ma-pass-currentpass-input').val(),
                newPassword = $('#ccb2b-ma-pass-newpass-input').val(),
                newPasswordVerify = $('#ccb2b-ma-pass-confirmnewpass-input').val(),
                myaccountjson = JSON.stringify(CCRZ.myaccountModel.toJSON());

            this.invokeContainerLoading($('body'), 'updatePassword', currentPassword, newPassword, newPasswordVerify, function(response) {
                CCRZ.pageMessagesView.trigger(response);
            });
        }
    }
    /***************/
    /* CARTS */
    /***************/
    CCRZ.pubSub.once('view:myCartsView:refresh', function(myCartsView) {
        myCartsView.cloneCart = CCRZ.subsc.myCarts.cloneCart;
        myCartsView.renameCart = CCRZ.subsc.myCarts.renameCart;
        myCartsView.deleteCart = CCRZ.subsc.myCarts.deleteCart;
        myCartsView.preRender = CCRZ.subsc.myCarts.preRender;
        myCartsView.delegateEvents(_.extend(myCartsView.events,
            {
                "click .cloneCart": "cloneCart",
            }
        ));
        myCartsView.render();
    });
    CCRZ.subsc.myCarts = {
        preRender: function () {
            if(!CCRZ.myaccountView.deliveryInfo){
                let myaccountView = CCRZ.myaccountView;
                if (!CCRZ.CCB2B_DeliveryInfoModel) {
                    CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
                }
                myaccountView.model.deliveryInfoModel = CCRZ.CCB2B_DeliveryInfoModel;
                CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                    if (resp && resp.success && resp.data) {
                        CCRZ.myaccountView.deliveryInfo = resp.data
                   }
                });
            }
        },
        cloneCart : function(event) {
            showOverlay();
            var objLink = $(event.target),
                id = objLink.data("id");
            this.cartList.cloneCart(id, function(resp) {
                 if (resp && resp.success && resp.data) {
                     hideOverlay();
                     cartDetails(resp.data);
                 }
            });
        },
        renameCart: function(event) {
            showOverlay();
            var objLink = $(event.target),
                id = objLink.data("id"),
                v = this,
                newName = $(".rename_" + id).val();
            this.closeModal(id);
            this.cartList.renameCart(id, newName,function(id){
                v.cartList.refresh(function() {
                    v.render();
                    hideOverlay();
                });
            });
        },
        deleteCart: function(event) {
            showOverlay();
            var objLink = $(event.target),
                id = objLink.data("id"),
                v = this,
                cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;

            cartModel.deleteCart(id, function(response){
                if(response && response.success){
                    if(response.data){
                        CCRZ.pubSub.trigger('cartChange', response.data);
                    }
                    CCRZ.headerView.update();
                    v.cartList.refresh(function() {
                        v.render();
                        hideOverlay();
                    });
               }
            });
        },
    }
    /***************/
    /* ORDERS */
    /***************/
    CCRZ.pubSub.once('view:myOrdersView:refresh', function(myOrdersView) {
        myOrdersView.updateDatePicker = CCRZ.subsc.myOrders.updateDatePicker;
        myOrdersView.reorder = CCRZ.subsc.myOrders.reorder;
        myOrdersView.preRender = CCRZ.subsc.myOrders.preRender;
        myOrdersView.postRender = CCRZ.subsc.myOrders.postRender;
        myOrdersView.confirm = CCRZ.subsc.myOrders.confirm;
        myOrdersView.delegateEvents(_.extend(myOrdersView.events,
            {
                "click .confirmReorder": "confirm"
            }
        ));
        myOrdersView.render();
    });
    CCRZ.subsc.myOrders = {
        updateDatePicker : function(event) {
             var daysArray = CCRZ.pagevars.pageLabels['DaysOfWeek'].split(","),
                 daysShortArray = CCRZ.pagevars.pageLabels['CCB2B_DaysOfWeek_Short'].split(",")
                 monthsArray = CCRZ.pagevars.pageLabels['MonthsOfYear'].split(","),
                 dateFormat = CCRZ.pagevars.pageLabels['Date_Format'];
             $.fn.datepicker.dates[CCRZ.pagevars.userLocale] = {
                 days: daysArray,
                 daysShort: daysShortArray,
                 daysMin: daysShortArray,
                 months: monthsArray,
                 monthsShort: monthsArray,
                 format: dateFormat
             };
             $.fn.datepicker.defaults.language = CCRZ.pagevars.userLocale;
             $.fn.datepicker.defaults.format = dateFormat;
             $.fn.datepicker.defaults.todayHighlight = true;
        },
        preRender: function() {
            Handlebars.registerPartial('confirmReorderModal', CCRZ.templates.CCB2B_ConfirmReorderModalTemplate);
            if(!this.dataLoadStarted) {
                  this.dataModel.fetch();
                  this.dataLoadStarted=true;
            }
        },
        postRender: function() {
            var v = CCRZ.myaccountView.subView;
            if (v.dataReady) {
                 v.updateDatePicker();
                 v.trigger('pagination:host:rendered', this, {
                        hostView : v.viewName
                 });
                 CCRZ.subsc.myOrders.updateDatePicker();
                 $('.input-daterange').datepicker({
                       autoclose: true
                 });
            }
        },
        reorder: function(event) {
            var objLink = $(event.target);
                id = objLink.data("id");
            $('#confirmOHReorder').modal('show');
        },
        confirm: function(event)
        {
            showOverlay();
            $('#confirmOHReorder').modal('hide');
            this.orderList.reorder(id, function(newCartId) {
                cartDetails(newCartId);
            });
        }
    }
    
	/***********************/
	/* Delivery Parameters */
	/***********************/
	CCRZ.views.CCB2B_DeliveryParametersView = CCRZ.CloudCrazeView.extend({
		viewName : 'CCB2B_DeliveryParametersView',
		templateDesktop : CCRZ.templates.CCB2B_MyAccount_DeliveryTemplate,
		managedSubView : true,
		init : function() {
			this.render();
		},
		renderDesktop : function() {
			showOverlay();
			var v = this;
			if (!CCRZ.CCB2B_CartModel)  {
				CCRZ.CCB2B_CartModel = new CCRZ.models.CCB2B_CartModel();
			}
			v.model = CCRZ.CCB2B_CartModel;
			CCRZ.CCB2B_CartModel.getDeliveryInformationCalendar(function(resp){
				if(resp && resp.success && resp.data) {
					CCRZ.myaccountView.subView.model.set('deliveryParameters', resp.data);
					v.$el.html(v.templateDesktop(v.model.toJSON()));
					hideOverlay();
				}
				hideOverlay();
			});

		}
	});
	/***************/
    /* REMINDERS */
    /***************/
    CCRZ.views.CCB2B_MyRemindersView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_MYRemindersView',
        templateDesktop : CCRZ.templates.CCB2B_MyAccount_RemindersTemplate,
        managedSubView : true,
        init : function() {
            this.render();
        },
        preRender: function() {
            Handlebars.registerPartial('confirmRemindersModal', CCRZ.templates.CCB2B_ConfirmRemindersModalTemplate);
        },
        renderDesktop : function() {
            showOverlay();
            var v = this;
            if (!CCRZ.CCB2B_RemindersModel)  {
                CCRZ.CCB2B_RemindersModel = new CCRZ.models.CCB2B_RemindersModel();
            }
            v.model = CCRZ.CCB2B_RemindersModel;
            CCRZ.CCB2B_RemindersModel.getOrderReminder(function(resp){
                if(resp && resp.success && resp.data) {
                    CCRZ.myaccountView.subView.model.set('reminders', resp.data);
                    v.$el.html(v.templateDesktop(v.model.toJSON()));
                    hideOverlay();
                }
            });

        },
        events: {
            'click .saveReminders' : 'saveReminders',
            'click .check-option' : 'setCheckbox',
            'click .confirmSave' : 'doSave',
            'click .cancelSave' : 'doCancel'
        },
       doCancel: function(event) {
                $('#confirmRemindersModal').modal('hide');
                this.renderDesktop();
            },
        doSave: function(event) {
                $('#confirmRemindersModal').modal('hide');
                this.doSaveReminders();
        },
        saveReminders : function(event){
           if($('.check-option[value=false]').length>1) {
                $('#confirmRemindersModal').modal('show');
           } else {
               this.doSaveReminders();
           }
        },
        doSaveReminders: function() {
            showOverlay();
            const view = this;
            let serializedObj = {};
            $(".check-option").each(function(){
                 serializedObj[this.name] = this.checked;
            });
            CCRZ.CCB2B_RemindersModel.setOrderReminder(serializedObj, function(resp){
                if (resp && resp.success) {
                    $(".remindersSection").find(".reminder-error").hide();
                    $('.saveReminders').attr('disabled', true);
                    view.renderDesktop();
                } else {
                     $(".remindersSection").find(".save-error").show();
                      hideOverlay();
                }
            });
        },
        setCheckbox : function(event){
            var elem = $(event.currentTarget);
            elem.val() == "false" ? elem.val("true") : elem.val("false");
            $('.saveReminders').attr('disabled',null);
        }
    });
});
