jQuery( function($){
    CCRZ.uiProperties.wishlistPickerModal.desktop.tmpl = CCRZ.templates.CCB2B_AddToWishlistBtnTemplate;

    CCRZ.pubSub.once('view:wishlistPickerModal:refresh', function(wishlistPickerModal) {
        wishlistPickerModal.refresh = CCRZ.subsc.wishlistPickerModal.refresh;
        wishlistPickerModal.processAddItem = CCRZ.subsc.wishlistPickerModal.processAddItem;
        wishlistPickerModal.render();
    });

    CCRZ.subsc.wishlistPickerModal = {
        refresh: function() {
            var v = this;
            v.coll.fetch(function() {
                v.render();
                if(CCRZ.pagevars.currentPageName=='ccrz__ProductList'){
                    if(CCRZ.wishlistAll){
                        CCRZ.wishlistAll.render();
                    }
                    else{
                        CCRZ.wishlistAll = new CCRZ.views.CCB2B_WishlistAllView;
                    }
                    CCRZ.subsc.productListItems.addToWishListDisabling();
                }
                else if(CCRZ.pagevars.currentPageName=='ccrz__MyAccount'){
                    if(CCRZ.selectWishlist){
                        CCRZ.selectWishlist.render();
                    }
                    else{
                        CCRZ.selectWishlist = new CCRZ.views.CCB2B_SelectWishlistView;
                    }
                }
            });
        },
        processAddItem: function(obj, val) {
            var parentObj = obj.closest('.wishFinder');
            var skus = [];
            skus.push(parentObj.data("sku"));
            var pickerModal = obj.closest(CCRZ.uiProperties.wishlistPickerModal.nameSelector);
            var createName = pickerModal.find('.newListName').val();
            var currentView;
            switch(CCRZ.pagevars.currentPageName) {
                case "ccrz__ProductList":
                    currentView = CCRZ.productListPageView.productItemsView.pickerView;
                    break;
                case "ccrz__ProductDetails":
                    currentView = CCRZ.prodDetailView.pickerView;
                    break;
                case "ccrz__Cart":
                    currentView = CCRZ.cartDetailView.pickerView;
                    break;
                case "ccrz__MyAccount":
                    currentView = CCRZ.myaccountView.subView.detailsView.pickerView;
                    break;
            }
            if (val == '-1') {
                addMultipleToWishlist(skus, createName, currentView, true, 'favourites_addsingle');
                $('.newListName ').not('.wishButtonsAll').val('');
            } else {
                var wishListName = pickerModal.find('[data-id="'+val+'"]')[0];
                if (wishListName) {
                    wishListName = wishListName.text;
                }
                addMultipleToWishlist(skus, val, currentView, false, 'favourites_addsingle', wishListName);
            }
        }
    }

});
