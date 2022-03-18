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
           myReminders : {
                  register : function(registrar){
                         registrar.registerNewView('myRemindersView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_Reminders_Name'], new CCRZ.views.CCB2B_MyRemindersView());
                  }
           },
           myOutlet : {
               register : function(registrar){
                      registrar.registerNewView('myOutletView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_Overview_MyOutlet_overview'], new CCRZ.views.CCB2B_MyOutletView());
               }
           },
           outletAddress : {
               register : function(registrar){
                      registrar.registerNewView('outletAddressView', CCRZ.pagevars.pageLabels['CCB2B_MyAccount_Overview_MyOutlet_address'], new CCRZ.views.CCB2B_OutletAddressView());
               }
           },
    });

    CCRZ.pubSub.on('view:myaccountView:awaitingSubViewInit', function(viewRef){
          if(CCRZ.MyAccount.myOverview){
                CCRZ.MyAccount.myOverview.register(viewRef);
          }
          if(CCRZ.MyAccount.myOutlet){
                CCRZ.MyAccount.myOutlet.register(viewRef);
          }
          if(CCRZ.MyAccount.outletAddress){
                CCRZ.MyAccount.outletAddress.register(viewRef);
          }
          if(CCRZ.MyAccount.contactInfo){
                CCRZ.MyAccount.contactInfo.register(viewRef);
          }
          if(CCRZ.MyAccount.changePassword){
                CCRZ.MyAccount.changePassword.register(viewRef);
          }
          if(CCRZ.MyAccount.addressBooks){
                CCRZ.MyAccount.addressBooks.register(viewRef);
          }
          if(CCRZ.MyAccount.myCarts){
                CCRZ.MyAccount.myCarts.register(viewRef);
          }
          if(CCRZ.MyAccount.myOrders){
                CCRZ.MyAccount.myOrders.register(viewRef);
          }
          if(CCRZ.MyAccount.myWishlists){
                CCRZ.MyAccount.myWishlists.register(viewRef);
          }
          if(CCRZ.MyAccount.mySubscriptions){
                CCRZ.MyAccount.mySubscriptions.register(viewRef);
          }
          if(CCRZ.MyAccount.myInvoices){
                CCRZ.MyAccount.myInvoices.register(viewRef);
          }
          if(CCRZ.MyAccount.myDocuments){
                CCRZ.MyAccount.myDocuments.register(viewRef);
          }
          if(CCRZ.MyAccount.myReminders){
                CCRZ.MyAccount.myReminders.register(viewRef);
          }
          viewRef.currIndex = 0;
          CCRZ.pubSub.on("view:myaccountView:subViewInit", function(data) {
                  var v = CCRZ.myaccountView,
                      viewState = getParameterFromUrl('viewState') || 'myOverview',
                      lastSection = sessionStorage.getItem('lastSection');
                  v.currIndex = v.sectionMap[lastSection] || v.sectionMap[viewState]|| 0;
                  v.subView = v.subViewArray[v.currIndex].view;
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
        if(CCRZ.HDRMyAccount.myOverview){
            CCRZ.HDRMyAccount.myOverview.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myOutlet){
            CCRZ.HDRMyAccount.myOutlet.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.outletAddress){
            CCRZ.HDRMyAccount.outletAddress.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.contactInfo){
            CCRZ.HDRMyAccount.contactInfo.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.addressBooks){
            CCRZ.HDRMyAccount.addressBooks.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myCarts){
            CCRZ.HDRMyAccount.myCarts.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myOrders){
            CCRZ.HDRMyAccount.myOrders.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myWishlists){
            CCRZ.HDRMyAccount.myWishlists.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.mySubscriptions){
            CCRZ.HDRMyAccount.mySubscriptions.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.mySubscriptionsNew){
            CCRZ.HDRMyAccount.mySubscriptionsNew.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myInvoices){
            CCRZ.HDRMyAccount.myInvoices.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myWallet){
            CCRZ.HDRMyAccount.myWallet.register(viewRef);
        }
        if(CCRZ.HDRMyAccount.myDocuments){
            CCRZ.HDRMyAccount.myDocuments.register(viewRef);
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
        init : function() {
            var view = this;
            view.model = (CCRZ.CCB2B_DeliveryInfoModel) ? CCRZ.CCB2B_DeliveryInfoModel : CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                if(resp && resp.success && resp.data) {
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
        myWishlistsView.detailsView.generateDisplay = CCRZ.subsc.wishlistDetails.generateDisplay;
         //Advertising Banner
        (CCRZ.CCB2B_AdvertisingBannerView) ? CCRZ.CCB2B_AdvertisingBannerView.render() : CCRZ.CCB2B_AdvertisingBannerView = new CCRZ.views.CCB2B_AdvertisingBannerView();
    });

    /***************/
    /* WISHLIST DETAIL */
    /***************/
    CCRZ.pubSub.once('view:wishlistDetailsView:refresh', function(wishlistDetailsView) {
        wishlistDetailsView.renderDesktop = CCRZ.subsc.wishlistDetails.renderDesktop;
        wishlistDetailsView.refresh = CCRZ.subsc.wishlistDetails.refresh;
        wishlistDetailsView.selectAll = CCRZ.subsc.wishlistDetails.selectAll;
        wishlistDetailsView.uncheckSelectAll = CCRZ.subsc.wishlistDetails.uncheckSelectAll;
        wishlistDetailsView.addToBasket = CCRZ.subsc.wishlistDetails.addToBasket;
        wishlistDetailsView.addAllToBasket = CCRZ.subsc.wishlistDetails.addAllToBasket;
        wishlistDetailsView.printFavourites = CCRZ.subsc.wishlistDetails.printFavourites;
        wishlistDetailsView.updateSequenceWishlist = CCRZ.subsc.wishlistDetails.updateSequenceWishlist;
        wishlistDetailsView.removeSingleQty = CCRZ.subsc.wishlistDetails.removeSingleQty;
        wishlistDetailsView.addSingleQty = CCRZ.subsc.wishlistDetails.addSingleQty;
        wishlistDetailsView.removeSingleQty = CCRZ.subsc.wishlistDetails.removeSingleQty;
        wishlistDetailsView.addToCartKey = CCRZ.subsc.wishlistDetails.addToCartKey;
        wishlistDetailsView.manageAddAllToBasketButton = CCRZ.subsc.wishlistDetails.manageAddAllToBasketButton;
        wishlistDetailsView.addToWishListDisabling = CCRZ.subsc.wishlistDetails.addToWishListDisabling;
        wishlistDetailsView.proceedLeavePage = CCRZ.subsc.wishlistDetails.proceedLeavePage;
        wishlistDetailsView.goToOffer = CCRZ.subsc.wishlistDetails.goToOffer;
        wishlistDetailsView.deleteItem = CCRZ.subsc.wishlistDetails.deleteItem;
        wishlistDetailsView.delegateEvents(_.extend(wishlistDetailsView.events,
           {
              'change .selectAllCheckbox' : 'selectAll',
              'change .addToWishlistCheckbox' : 'uncheckSelectAll',
              'click .addItemToBasket': 'addToBasket',
              'click .addAllToBasket': 'addAllToBasket',
              'click .printList': 'printFavourites',
              'click .plus' : 'addSingleQty',
              'click .minus' : 'removeSingleQty',
              'keypress .entry' : 'addToCartKey',
              'keyup .entry' : 'manageAddAllToBasketButton',
              'click .qty_btn' : 'manageAddAllToBasketButton',
              'click .addToWishlistCheckbox' : 'addToWishListDisabling',
              'click .confirmLeaving' : 'proceedLeavePage',
              'click .goToOffer' : 'goToOffer',
           }
        ));
        wishlistDetailsView.render();
    });

    CCRZ.views.CCB2B_SelectWishlistView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_SelectWishlistView',
        templateDesktop : CCRZ.templates.CCB2B_MoveCopyToWishlistBtnTemplate,
        init : function() {
            this.render();
        },
        renderDesktop : function() {
            var view = this;
            view.setElement('.selectWishButtons');
            if(CCRZ.myaccountView.subView.detailsView.pickerView.coll.length > 0){
                view.model = CCRZ.myaccountView.subView.detailsView.pickerView.coll;
                view.renderView(view.templateDesktop);
            }
            else{
                view.model = new CCRZ.collections.WishlistLightList();
            }
            view.model.fetch(function() {
                view.renderView(view.templateDesktop);
            });
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate(this.model));
            CCRZ.subsc.wishlistDetails.addToWishListDisabling();
        },
        events: {
            "click .pickWishSelect" : "processItems",
        },
        processItems: function(event) {
            var obj = $(event.target),
                val = obj.data("id"),
                v = this,
                createName = obj.closest(CCRZ.uiProperties.wishlistPickerModal.nameSelector).find('.newListName').val(),
                skus = [],
                wlIds = [],
                model = (CCRZ.multipleWishlistModel) ? CCRZ.multipleWishlistModel : new CCRZ.models.CCB2B_WishlistModel();
            $('.addToWishlistCheckbox:checked').each(function() {
                skus.push($(this).data('id'));
                wlIds.push($(this).data('wlid'));
            });

            showOverlay();
            var method = $(obj).data('method');
            switch(method) {
               case 'move':
                    v.processMoveItems(model, skus, createName, wlIds, val);
               break;
               case 'copy':
                   v.processAddItems(model, skus, createName, val);
               break;
            }
        },
        processMoveItems: function(model, skus, createName, wlIds, val){
            var v = this;
            if (val == '-1') {
                v.moveMultipleToNewWishlist(model, skus, createName, wlIds);
                $('.wishButtonsAll .newListName').val('');
            }
            else{
                v.moveMultipleToWishlist(model, skus, val, wlIds);
            }
        },
        processAddItems: function(model, skus, createName, val){
            var v = this;
            if (val == '-1') {
                v.addMultipleToNewWishlist(model, skus, createName);
                $('.wishButtonsAll .newListName').val('');
            }
            else{
                v.addMultipleToWishlist(model, skus, val);
            }
        },
        addMultipleToWishlist: function(wishlistModel, skus, val){
            var v = this;
            wishlistModel.addMultipleToWishlist(skus, val, function(resp) {
                v.showWishlistModal(resp, 'existing');
            });
        },
        addMultipleToNewWishlist: function(wishlistModel, skus, name){
            var v = this;
            wishlistModel.addMultipleSkusToNewWishlist(skus, name, function(resp){
                v.showWishlistModal(resp, 'new');
            });
        },
        moveMultipleToWishlist: function(wishlistModel, skus, val, wlIds){
            var v = this;
            wishlistModel.moveMultipleToWishlist(skus, val, wlIds, function(resp) {
                v.showWishlistModal(resp, 'existing');
            });
        },
        moveMultipleToNewWishlist: function(wishlistModel, skus, name, wlIds){
            var v = this;
            wishlistModel.moveMultipleToNewWishlist(skus, name, wlIds, function(resp){
                v.showWishlistModal(resp, 'new');
            });
        },
        showWishlistModal: function(resp, type){
            hideOverlay();
            var wlModal;
            if(resp && resp.success){
                if (type == 'existing'){
                    wlModal = $('#favourites_existing_modal_success');
                }
                else if (type == 'new'){
                    wlModal = $('#favourites_new_modal_success');
                }
                $('.addToWishlistCheckbox:checked').prop("checked", false);
                $('.selectAllCheckbox:checked').prop("checked", false);
                $('.addToWishlistAll button').attr("disabled","disabled");
            }
            else {
                wlModal = $('#favourites_addall_modal_error');
            }
            $(wlModal).slideDown();
            setTimeout(function(){
                $(wlModal).slideUp();
                CCRZ.myaccountView.subView.detailsView.pickerView.refresh();
                CCRZ.subsc.wishlistDetails.refresh();
            },2500);
        },
    });

    CCRZ.subsc.wishlistDetails = {
        generateDisplay : function(modelData, ele){
            var view = this;
            view.dataSet = modelData;
            view.wishlistItemData.reset();
            view.setElement(ele);
            CCRZ.subsc.wishlistDetails.refresh();
        },
        refresh: function(){
            var view = CCRZ.myaccountView.subView.detailsView;
            var modelData = view.dataSet;
            var wishlistItemModel = (CCRZ.CCB2B_WishlistItemModel) ? CCRZ.CCB2B_WishlistItemModel : new CCRZ.models.CCB2B_WishlistItemModel;
            var sequenceMap = [];
            wishlistItemModel.getWishlistItemsSequence(modelData.attributes.sfid,function(resp){
                sequenceMap = resp.data;
            });

            view.wishlistItemData.reset();
            view.wishlistItemData.fetch(modelData.attributes.sfid, modelData.attributes.productItems, function() {
                var unsortedData = view.wishlistItemData.toJSON();
                if(sequenceMap.length>0){
                    sequenceMap.forEach(function(val, index){
                        unsortedData.filter(function(item){
                            if(val == item.uid){
                                item.CCB2B_Sequence = index;
                                return false;
                            }
                        })
                    });
                    var sortedData = _.sortBy(unsortedData, 'CCB2B_Sequence');

                    view.dataSet.set('itemData', sortedData);
                }
                else{
                    view.dataSet.set('itemData', unsortedData);
                }

                view.render();
            });
        },
        renderDesktop : function(){
            var v = this;
            if (v.dataSet){
                v.$el.html(v.templateDesktop(v.dataSet.toJSON()));

                if(CCRZ.selectWishlist){
                    CCRZ.selectWishlist.render();
                }
                else{
                    CCRZ.selectWishlist = new CCRZ.views.CCB2B_SelectWishlistView;
                }
                $( "#sortableFavourites" ).sortable({
                    tolerance: "pointer",
                    axis: "y",
                    handle: ".fa-sort",
                    helper: 'clone',
                    containment: "parent",
                    delay: 100,
                    update: function(){
                        v.updateSequenceWishlist();
                    },
                });
                $("#sortableFavourites").disableSelection();
            }
            //initialize Sticky Cart Summary
            if (CCRZ.CCB2B_CartSummaryStickyView){
                CCRZ.CCB2B_CartSummaryStickyView.render();
            } else {
                CCRZ.CCB2B_CartSummaryStickyView = new CCRZ.views.CCB2B_CartSummaryStickyView;
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
            };

            CCRZ.openPLP = function(objLink) {
                if(!checkIfPositiveQuantity()){
                    if (objLink.target === "_blank") {
                        window.open(CCRZ.goToPLP(objLink));
                    } else {
                        window.location = CCRZ.goToPLP(objLink);
                    }
                }
            };

            $('a:not("#ccb2b-menu-browseproducts, #ccb2b-menu-businesssupport, #ccb2b-menu-helpdesk"), .processToCart, .goToCart, .goToOffer, #logoUrl, .goToPLP').on("click", function(e) {
                if(checkIfPositiveQuantity()){
                    e.preventDefault();
                    e.stopPropagation();
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
        selectAll: function(event){
            var target = $(event.target);

            if(target[0].checked){
                $('.addToWishlistCheckbox').each(function() {
                    this.checked = true;
                })
            }
            else{
                $('.addToWishlistCheckbox').each(function() {
                    this.checked = false;
                })
            }
            CCRZ.subsc.wishlistDetails.addToWishListDisabling();
        },
        uncheckSelectAll: function(){
            $('.selectAllCheckbox')[0].checked = false;
        },
        addToBasket: function(event) {
            var view = this,
                objLink = $(event.target),
                id = objLink.data("id"),
                qtyInput = $("#entry_" + id ),
                qty = qtyInput.val(),
                sku = objLink.data("sku"),
                productName = objLink.data("name"),
                incr = 1,
                scrubbedQty = CCRZ.util.scrubQuantity(qty, incr);
            if (qty < 1){
                qty = 1;
            }
            view.invokeContainerLoadingCtx($('.deskLayout'), 'handleAddtoCart', sku, qty.toString(), function(response){
                if(response && response.success){
                    var productsSku = [],
                        rewardModel = (CCRZ.CCB2B_RewardsModel) ? CCRZ.CCB2B_RewardsModel : new CCRZ.models.CCB2B_RewardsModel();
                    //check if product is eligible for promotion
                    productsSku.push(sku);
                    rewardModel.isEligibleForPromotionBySKU(productsSku, function(resp){
                         var eligiblePromo = (resp && resp.success && resp.data) ? true : false;
                         CCRZ.pubSub.trigger('eligibleForPromotion', eligiblePromo);
                    });
                    cartId = response.data;
                    CCRZ.pagevars.currentCartID = cartId;
                    //cart change will update cookie
                    CCRZ.pubSub.trigger('cartChange', cartId);
                    doneLoading(objLink);

                    if (CCRZ.pagevars.pageConfig.isTrue('wl.g2c')) {
                        cartDetails();
                    }
                    $(qtyInput).val(0);
                    manageAddAllToBasketButton();
                }
                showAddToBasketModal(response,  ` ${qty} x ${productName} `);
            });

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
                    wlModal = $('#favourites_addtocart_success');
                    var rewardModel = (CCRZ.CCB2B_RewardsModel) ? CCRZ.CCB2B_RewardsModel : new CCRZ.models.CCB2B_RewardsModel();
                    rewardModel.isEligibleForPromotionBySKU(productData.skus, function(resp){
                         var eligiblePromo = (resp && resp.success && resp.data) ? true : false;
                         CCRZ.pubSub.trigger('eligibleForPromotion', eligiblePromo);
                    });
                    //cart change will update cookie
                    CCRZ.pubSub.trigger('cartChange', CCRZ.pagevars.currentCartID);
                    hideOverlay();
                }
                else{
                    wlModal = $('#favourites_addtocart_error');
                }
                setQtyToZero();
                manageAddAllToBasketButton();
                $(wlModal).slideDown();
                setTimeout(function(){
                    $(wlModal).slideUp();
                },2500);
            });
        },
        printFavourites: function(){
            window.onafterprint = function(event) {
                $(".cc_myaccount_mywishlists_container").removeClass("print_class");
                $("body").removeAttr("style");
                hideOverlay();
            };
            window.onbeforeprint = function(event) {
                $(".cc_myaccount_mywishlists_container").addClass("print_class");
                $("body").css('padding-bottom',0);
            }
            showOverlay();
            window.print();
        },
        updateSequenceWishlist: function(){
            showOverlay();
            var entries = $('#sortableFavourites .ui-state-default'),
                wishlistItems = {},
                model = (CCRZ.multipleWishlistModel) ? CCRZ.multipleWishlistModel : new CCRZ.models.CCB2B_WishlistModel(),
                view = CCRZ.myaccountView.subView.detailsView;
            for (var i=0; i<entries.length; i++){
                wishlistItems[$(entries[i]).data('id')] = i;
            }
            model.updateSequenceWishlist(wishlistItems, function(resp) {
                hideOverlay();
            });
            event.target.blur();
        },
        addSingleQty: function(event){
            var objLink = $(event.target),
                id = objLink.data("id"),
                qtyInput = $("#entry_" + id ),
                incr = 1;
            CCRZ.subsc.wishlistDetails.adjustQuantity(parseInt(incr), qtyInput)
        },
        removeSingleQty: function(event){
            var objLink = $(event.target),
                id = objLink.data("id"),
                qtyInput = $("#entry_" + id ),
                incr = 1;
            CCRZ.subsc.wishlistDetails.adjustQuantity(-parseInt(incr),qtyInput)
        },
        adjustQuantity: function(qty, qtyInput){
            var prevQty = parseInt($(qtyInput).val()),
                newQty = (prevQty + qty)>0 ? prevQty + qty : 0;
            $(qtyInput).val(newQty);
        },
        addToCartKey : function(event){
            if (window.event && window.event.keyCode == 13 || event.which == 13) {
                this.addToBasket(event);
                return false;
            }
            else {
                return CCRZ.util.isValidNumericInput(event);
            }
        },
        addToWishListDisabling: function(){
            var button = $('.addAllToWishlistButton'),
                checkboxes = $('.addToWishlistCheckbox:checked'),
                minCheckedCheckboxes = 1;
            if(checkboxes.length >= minCheckedCheckboxes) $(button).removeAttr("disabled");
            else $(button).attr("disabled","disabled");
        },
        manageAddAllToBasketButton: function(){
            manageAddAllToBasketButton();
        },
        goToOffer: function(event){
            goToOffer(event);
        },
        deleteItem: function(event) {
            var objLink = $(event.target);
            var id = objLink.data("id");
            var pid = objLink.data("pid");
            var v = this;
            var itemModel = this.wishlistItemData.get(id);
            v.wishlistItemData.deleteEntity(pid, id, function() {
                v.wishlistItemData.remove(itemModel);
                CCRZ.pubSub.trigger('refreshWishlists', id);
                v.dataSet.set('itemData', v.wishlistItemData.toJSON());
                v.dataSet.set('productItems', v.wishlistItemData.toJSON());
                v.refresh();
            });
        },
    };

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

    /***********************/
    /* CONTACT INFORMATION */
    /***********************/
    CCRZ.pubSub.once('view:contactInfoView:refresh', function (contactInfoView) {
        contactInfoView.postRender = CCRZ.subsc.contactInfo.postRender;
    });

    CCRZ.subsc.contactInfo = {
        postRender: function () {
            if (getParameterFromUrl('emailChanged')) {
                var hintElem = "<p class='newEmailHint'>" + CCRZ.pagevars.pageLabels['EmailChangedHint'] + "</p>";
                var emailElem = $('.myAccEmailAddr.cc_acct_email');
                (emailElem) ? emailElem.append(hintElem) : '';
            }
        }
    };

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

                 if (response.data['emailAddress'] !== response.data['username']) {
                     location.search += '&emailChanged=true';
                 } else {
                     location.reload();
                 }
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
    };
    /***************/
    /* ACCOUNT NAV*/
    /***************/
    CCRZ.pubSub.on('view:myAccountNavView:refresh', function(accountNavView) {
        var myCartsEnabledProfiles = [CCRZ.pagevars.pageConfig['sc.showforprofile.profilename1'],
                                        CCRZ.pagevars.pageConfig['sc.showforprofile.profilename2'],
                                        CCRZ.pagevars.pageConfig['sc.showforprofile.profilename3']];
        if (CCRZ.pagevars.pageConfig['sc.showforprofile.enabled'] && !checkIfInArray(myCartsEnabledProfiles, CCRZ.myaccountModel.attributes.profileName)) {
            $('.showForSpecificProfile').hide();
        }
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
                 if(window.innerWidth > 991){
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
        myCartsView.delegateEvents(_.extend(myCartsView.events,
            {
                "click .cloneCart": "cloneCart",
            }
        ));
        myCartsView.render();
    });
    CCRZ.subsc.myCarts = {
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
                v = this;
                
            var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
            
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
            if(v.dataReady) {
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


    /***************/
    /* REMINDERS */
    /***************/
    CCRZ.views.CCB2B_MyRemindersView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_MARemindersView',
        templateDesktop : CCRZ.templates.CCB2B_MyAccount_RemindersTemplate,
        managedSubView : true,
        init : function() {
            this.render();
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
                } else {
                    $(".remindersSection").find(".fetch-error").show();
                }
            });

        },
        events: {
            'click .saveReminders' : 'saveReminders',
            'click .check-option' : 'setCheckbox'
        },
        saveReminders : function(event){
            showOverlay();
            var view = this,
                serializedObj = {};
            $(".check-option").each(function(){
                 serializedObj[this.name] = this.checked;
            });
            CCRZ.CCB2B_RemindersModel.setOrderReminder(serializedObj, function(resp){
                (resp && resp.success) ? $(".remindersSection").find(".reminder-error").hide() : $(".remindersSection").find(".save-error").show();
                hideOverlay();
            });
        },
        setCheckbox : function(event){
            var elem = $(event.currentTarget);
            elem.val() == "false" ? elem.val("true") : elem.val("false");
        }
    });

    /***************/
    /* OUTLET */
    /***************/
    CCRZ.views.CCB2B_MyOutletView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_MyOutletView',
        templateDesktop : CCRZ.templates.CCB2B_MyAccount_MyOutletTemplate,
        managedSubView : true,
        init : function() {
            var view = this;
            view.model = (CCRZ.CCB2B_DeliveryInfoModel) ? CCRZ.CCB2B_DeliveryInfoModel : CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                if(resp && resp.success && resp.data) {
                    CCRZ.myaccountView.subView.model.set('deliveryInfo', resp.data);
                    view.render();
                }
            });
        },
        renderDesktop : function() {
            var v = this;
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

    CCRZ.views.CCB2B_OutletAddressView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_OutletAddressView',
        templateDesktop : CCRZ.templates.CCB2B_MyAccount_OutletAddressTemplate,
        managedSubView : true,
        init : function() {
            var view = this;
            view.model = (CCRZ.CCB2B_DeliveryInfoModel) ? CCRZ.CCB2B_DeliveryInfoModel : CCRZ.CCB2B_DeliveryInfoModel = new CCRZ.models.CCB2B_DeliveryInfoModel();
            CCRZ.CCB2B_DeliveryInfoModel.getDeliveryInfo(function(resp){
                if(resp && resp.success && resp.data) {
                    CCRZ.myaccountView.subView.model.set('deliveryInfo', resp.data);
                    view.render();
                }
            });
        },
        renderDesktop : function() {
            var v = this;
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
});
