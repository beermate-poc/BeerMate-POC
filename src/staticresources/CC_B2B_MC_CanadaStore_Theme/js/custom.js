//global use functions

function goTo(url){
    if(url.startsWith('https://') || url.startsWith('http://')) {
        window.location.assign(url);
    } else if(url.startsWith('www')) {
        window.location.assign('https://' + url);
    } else {
        window.location.assign(prepareCCB2BURL(url));
    }
}

function prepareCCB2BURL(url) {
    var sign = '?';
    var cartParam = '';
    var currentSite = CCRZ.pagevars.currSiteURL;
    var CSRQueryString = getCSRQueryString();
    var containsQuestionMark = false;

    if(url.indexOf(sign) >= 0) {
        sign = '&';
        containsQuestionMark = true;
    }
    if(CCRZ.pagevars.currentCartID != null) {
        cartParam = sign + 'cartId=' + CCRZ.pagevars.currentCartID;
        containsQuestionMark = true;
    }
    if(containsQuestionMark == false && CSRQueryString.indexOf('&') == 0) {
        CSRQueryString = CSRQueryString.replace('&', '?');
    }

    return currentSite + url + cartParam + CSRQueryString;
}

function waitToHeaderInfo(counter, callback){
     var maxCheck = 50;
     if(counter < maxCheck) {
         if (CCRZ.currentUser && CCRZ.localeSwitcherView && CCRZ.productSearchView){
             var user = CCRZ.currentUser;
                  callback(user);
         }else{
             setTimeout(function(){
                  counter++;
                  waitToHeaderInfo(counter, callback);
             }, 200);
         }
     }
}

//Method format given Date object in provided dateFormat string
function formatDate(date,dateFormat){
      var year = date.getFullYear(),
          month = date.getMonth() + 1,
          day = date.getDate();

      if(month < 10){ month = '0'+month;}
      if(day<10){ day = '0'+day;}

      switch(dateFormat) {
         case 'mm/yyyy':
             return month+'/'+year;
         //date format: yyyy-mm-dd
         case 'yyyy-mm-dd':
             return year+'-'+month+'-'+day;
        //date format: dd/mm/yyyy
         case 'dd/mm/yyyy':
             return day+'/'+month+'/'+year;
         //date format: dd/mm/yyyy
         default:
             return day+'/'+month+'/'+year;
     }
}

//Method return Date object from string
function stringToDate(_date,_format,_delimiter){
     var formatLowerCase=_format.toLowerCase(),
         formatItems=formatLowerCase.split(_delimiter),
         dateItems=_date.split(_delimiter),
         monthIndex=formatItems.indexOf("mm"),
         dayIndex=formatItems.indexOf("dd"),
         yearIndex=formatItems.indexOf("yyyy"),
         month=parseInt(dateItems[monthIndex]);
     month-=1;
     return new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
}

//Method return delimeter in format date
function findDelimeterInDate(date){
    return (date.replace(/[mdy]/g, ''))[0];
}

//Method select current subview in My Account
function selectCurrentSubView(){
    $("#MyAccount_navSection").find("li.acctStep"+CCRZ.myaccountView.currIndex +" a").addClass("active");
}
//Method to set cookie
 function setCookie(name, value, days, path) {
    if (path === undefined) path = '';
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/" + path + ";expires=" + d.toGMTString();
 }
//Method to get cookie
 function getCookie(name) {
     var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
     return v ? v[2] : null;
 }

//Method redirects to cart
function goToCart(orderId) {
    document.location = CCRZ.pagevars.currSiteURL + "ccrz__Cart?cartID=" + orderId + getCSRQueryString();
}
//Method to show cover loading
function showOverlay() {
    $("#customOverlay").show();
}
//Method to hide cover loading
function hideOverlay() {
    $("#customOverlay").hide();
}
//calculate total saving and set to model
function calculateTotalSaving(basePrice, subtotalPrice, model){
    var totalSaving = basePrice - subtotalPrice;
    if(totalSaving && !isNaN(totalSaving)&& totalSaving > 0){
        model.set("CCB2B_TotalSaving", parseFloat(totalSaving.toFixed(2)));
    }
    else{
        model.set("CCB2B_TotalSaving", 0);
    }
}
//calculate taxable deposit price
function calculateTaxableDeposit(depositPrice, qty, isTaxable, taxableDeposit){
    var deposit = depositPrice || 0;
    if(isTaxable){ taxableDeposit += deposit * qty;}
    return taxableDeposit;
}
//calculate nontaxable price
function calculateNonTaxableDeposit(depositPrice, qty, isTaxable, nonTaxableDeposit){
    var deposit = depositPrice || 0;
    if(!isTaxable){nonTaxableDeposit += deposit * qty;}
    return nonTaxableDeposit;
}
//calculate nontaxable price
function setDepositsToModel(taxableDeposit, nonTaxableDeposit, model){
    model.set("CCB2B_TaxableDepositPrice", taxableDeposit.toFixed(2));
    model.set("CCB2B_NonTaxableDepositPrice", nonTaxableDeposit.toFixed(2));
}

//calculate subtotal with taxable deposit
function calculateSubtotalWithoutDeposit(taxableDeposit, nonTaxableDeposit, subtotalPrice){
    var subtotalWithoutDeposit = subtotalPrice - taxableDeposit - nonTaxableDeposit;
    return subtotalWithoutDeposit;
}
//calculate subtotal to calculate Taxes
function calculateSubtotalForTaxes(taxableDeposit, subtotalWithoutDeposit){
    var subtotalForTaxes = subtotalWithoutDeposit;
    if(taxableDeposit > 0){
        subtotalForTaxes += taxableDeposit;
    }
    return subtotalForTaxes;
}
//set subtotal to model
function setSubtotalsToModel(subtotalPrice, subtotalForTaxes, subtotalWithoutDeposit, model){
    model.set("CCB2B_SubtotalPrice", parseFloat(subtotalPrice.toFixed(2)));
    model.set("CCB2B_SubtotalPriceForTaxes", parseFloat(subtotalForTaxes.toFixed(2)));
    model.set("CCB2B_SubtotalWithoutDepositPrice", parseFloat(subtotalWithoutDeposit.toFixed(2)));
}
//calculate new unit Price (without deposit)
function calculateNewUnitPrice(unitPrice, depositPrice){
    var deposit = depositPrice || 0;
    return parseFloat((unitPrice - deposit).toFixed(2));
}
//calculate new subtotal Price (without deposit)
function calculateNewSubtotalPrice(subtotalPrice, depositPrice, qty){
    var deposit = depositPrice || 0;
    return parseFloat((subtotalPrice - (deposit * qty)).toFixed(2));
}
//calculate pricing from SAP
function calculateAndSavePriceFromSAP(taxableDeposit,nonTaxableDeposit,subtotalPrice,subtotalWithoutDeposit,subtotalForTaxes,basePrice,model){
    setDepositsToModel(taxableDeposit, nonTaxableDeposit, model);
    //calculate subtotal without deposits
    subtotalWithoutDeposit = calculateSubtotalWithoutDeposit(taxableDeposit, nonTaxableDeposit, subtotalPrice);
    //calculate subtotal for calculate taxes
    subtotalForTaxes = calculateSubtotalForTaxes(taxableDeposit, subtotalWithoutDeposit);
    setSubtotalsToModel(subtotalPrice,subtotalForTaxes, subtotalWithoutDeposit, model);
    //calculate total saving
    totalSaving = calculateTotalSaving(basePrice, subtotalWithoutDeposit, model);
}
function pad(num) {
  return ("0"+num).slice(-2);
}

function unsetStickyFilter(){
    $("#collapseFilters").css({
         "position": "static",
         "top" : "unset",
         "width" : "100%",
         "max-width" : "100%"
    });
}
function setStickyFilter (maxWidth){
    $("#collapseFilters").css({
         "position": "fixed",
         "top" : "15px",
         "width" : "100%",
         "max-width" : maxWidth +"px"
    });
}

//getAllQtyForProducts
function getProductsForAddAllToBasket(){
    var entries = $('.cc_entry'),
        products = [],
        skus = [],
        productData = {},
        checked = [];

    $('.addToWishlistCheckbox:checked').each(function() {
        checked.push($(this).data('id'));
    });

    for (var i=0; i<entries.length; i++){
        if ($(entries[i]).val() > 0){
              products.push({
                    quantity : parseInt($(entries[i]).val()),
                    sku : ($(entries[i]).data('sku')).toString()
              })
              skus.push(($(entries[i]).data('sku')).toString());
        }else{
             if(checked.includes($(entries[i]).data('sku'))){
                products.push({
                         quantity : 1,
                         sku : ($(entries[i]).data('sku')).toString()
                  })
                  skus.push(($(entries[i]).data('sku')).toString());
             }
        }
    }
    productData.products = products;
    productData.skus = skus;
    return productData;
}

//setQtyToZero
function setQtyToZero(){
    var entries = $('.cc_entry');
    $(entries).val(0);
}

//show add to basket modal
function showAddToBasketModal(response, productName){
    if(response && response.success){
        $('#addtobasket_modal_success .product_name').html(productName);
        $('#addtobasket_modal_success').slideDown();
    }
    else{
        $('#addtobasket_modal_error .product_name').html(productName);
        $('#addtobasket_modal_error').slideDown();
    }
    setTimeout(function(){
        $('.modal-add-to-basket').slideUp();
    },3000);
}

//disable/enable Add All to Basket button
function manageAddAllToBasketButton(sfid){
    var count = 0,
        minCountProduct = 1;

    if(CCRZ.pagevars.currentPageName == "ccrz__ProductList"){
        $('.entry').each(function() {
            if (sfid){
                if(sfid == $(this).data('sfid')){
                    if ($(this).val() > 0){
                        document.getElementById('ccb2b-plp-add-to-'+$(this).data('sku')+'-checkbox').checked = true;
                    }else{
                        document.getElementById('ccb2b-plp-add-to-'+$(this).data('sku')+'-checkbox').checked = false;
                    }
                }
            }else{
                if ($(this).val() > 0){
                    document.getElementById('ccb2b-plp-add-to-'+$(this).data('sku')+'-checkbox').checked = true;
                }else{
                    document.getElementById('ccb2b-plp-add-to-'+$(this).data('sku')+'-checkbox').checked = false;
                }
            }
        });
    }else{
       $('.entry').each(function() {
           if ($(this).val() > 0) count++;
       });
       (count >= minCountProduct) ?  $('.addAllToBasket').removeAttr("disabled","disabled") : $('.addAllToBasket').attr("disabled","disabled");
    }
}

//Method creates new wishList or updates existing one 
function addMultipleToWishlist(skus, val, view, isNew, modalPrefix, existingName) {
    let name = existingName ? existingName : ''; // fallback for undefined
    name =  name.lastIndexOf('+')==-1 ? name :  existingName.substring(0, existingName.lastIndexOf('+')).trimEnd() ;
    showOverlay();
    wishlistModel = (CCRZ.multipleWishlistModel) ? CCRZ.multipleWishlistModel : new CCRZ.models.CCB2B_WishlistModel();
    $('.addAllToWishlistFormContainer').hide();
    var checkResponse = function(resp) {
        if(resp) {
            showWishlistModal(resp.success, view, modalPrefix, name);
            manageAddAllToBasketButton();
        }
    };
    if (isNew) {
        wishlistModel.addMultipleSkusToNewWishlist(skus, val, checkResponse);
        name = (val == '') ? CCRZ.pagevars.pageLabels['CCB2B_NewWishList'] : val;
    } else wishlistModel.addMultipleToWishlist(skus, val, checkResponse);
}

//Method show modal message with result of wishList creation/modification
function showWishlistModal(isSuccess, view, modalPrefix, listName) {
    hideOverlay();
    var pageLabelPrefix;
    switch(modalPrefix) {
        case "favourites_addsingle":
            pageLabelPrefix = 'CCB2B_Product_AddToWishList_Modal';
            break;
        case "favourites_addall":
            pageLabelPrefix = 'CCB2B_ProductList_AddToWishListAll_Modal';
            break;
    }
    var wlModal = $('#' + modalPrefix + '_modal_error');
    var pageLabelName = pageLabelPrefix + '_Error_Content';
    if (isSuccess) {
        wlModal = $('#' + modalPrefix + '_modal_success');
        pageLabelName = pageLabelPrefix + '_Success_Content';
        $('.addToWishlistCheckbox:checked').prop("checked", false);
        $('.addToWishlistAll button').attr("disabled","disabled");
    }
    var messagePrefix = CCRZ.pagevars.pageLabels[''+pageLabelName+''];
    var actualMessage = messagePrefix + ' ' + listName;
    wlModal.find('.modal-body p .part1').html(actualMessage);
    $(wlModal).slideDown();
    setTimeout(function() {
        $(wlModal).slideUp();
        view.refresh();
    }, 2500);
}

function getParameterFromUrl(name){
    var parameters = {};
    location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s,name,val) {
         parameters[name]=val
    });
    return name ? parameters[name] : false;
}

// Method to check if is mobile device based on system (not screen size)
function isMobileDevice() {
    var check = false;
    (function(a){
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))
            check = true;
    })
    (navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

// Method to close the category menu and redirect to PLP
function goToCategory(context) {
    var mainMenu = $(".dropdown.open");
    mainMenu.removeClass("open");
    return CCRZ.openPLP(context);
}

// Method to convert minutes into timestamp
function toTimestamp(minutes) {
    return minutes * 60 * 1000;
}

//checks if array contains a value
function checkIfInArray(array, value) {
    return array.indexOf(value) >=0;
}

/************************
* CLOUD CRAZE OVERRIDES *
************************/
CCRZ.util.template = function(template) {
    var templateType = typeof(template);
    var source = '';

    switch(templateType) {
        case 'function':
            return template;
        case 'string':
            source = $('#' + template).html();
            source = _.isUndefined(source) ? '' : source;
            return Handlebars.compile(source);
    }
};

CCRZ.reloadPageWithParam = function(urlParam, paramValue) {
    var shortURL = window.location.href;
    var reloadLocation = shortURL;
    if (!urlParam) {
         CCRZ.console.log('no params, reload url is: ' + reloadLocation);
         window.location.href = reloadLocation;
    }
    if (!paramValue) {
         paramValue = '';
    }
    var checkCartId = shortURL.split(urlParam);
    var paramCartId = null;
    var paramEnd = null;
    if (checkCartId.length > 1) {
         var paramsString = checkCartId[1];
         if ('&' !== paramsString.substr(-1)) {
             paramsString = paramsString + '&';
         }
         paramCartId = paramsString.substr(0, paramsString.indexOf('&'));
         paramEnd = paramsString.substr(paramsString.indexOf('&') + 1);
         //restore #param for My Account Navigation
         if(!paramEnd && paramsString.indexOf('#')){
             paramEnd = '#' + paramsString.substr(paramsString.indexOf('#') + 1);
         }
         if (!paramEnd) {
             reloadLocation = checkCartId[0] + urlParam + "=" + paramValue + '&';
         } else {
             reloadLocation = checkCartId[0] + urlParam + "=" + paramValue + '&' + paramEnd;
         }
    } else {
         if (shortURL.indexOf('?') >= 0) {
             reloadLocation = shortURL + "&" + urlParam + "=" + paramValue;
         } else {
             reloadLocation = shortURL + "?" + urlParam + "=" + paramValue;
         }
    }
    CCRZ.console.log('reload url is: ' + reloadLocation);
    window.location.href = reloadLocation;
};

//add new styles for zoom in / zoom out (especially PLP)
function addNewStylesForZoomOut() {
    var zoom80 = 80, zoom60 = 60, zoom40 = 40, min = 0,
        zoomVal = Math.round(window.devicePixelRatio * 100),
        containerEl = $('.container'),
        productListEl = $(".productListContent"),
        clearFixEl = productListEl.find(".clearfix");
    productItemsEl = productListEl.find(".cc_product_container");
    //remove all 'width..' classes
    $.each( productItemsEl, function( index, item ) {
        removeClassByPrefix(item, 'width');
    });
    //reset styles
    containerEl.addClass('fullWidth');
    clearFixEl.addClass('withoutClear');
    switch(true) {
        case zoomVal >= zoom80:
            containerEl.removeClass('fullWidth');
            clearFixEl.removeClass('withoutClear');
            break;
        case zoomVal < zoom80 && zoomVal > zoom60:
            productItemsEl.addClass('width20');
            break;
        case zoomVal < zoom60 && zoomVal > zoom40:
            productItemsEl.addClass('width15');
            break;
        case zoomVal < zoom40 && zoomVal > min:
            productItemsEl.addClass('width10');
            break;
    }
}

//remove class name starts from prefix from element
function removeClassByPrefix(el, prefix) {
    var regx = new RegExp('\\b' + prefix + '.*?\\b', 'g');
    el.className = el.className.replace(regx, '');
    return el;
}

//Method to disable/enable button
function manageButtonLocking(buttonClass, disableButton) {
    (disableButton) ? $("."+buttonClass+"").attr("disabled","disabled").addClass('readonlyBtn') :  $("."+buttonClass+"").removeAttr("disabled").removeClass('readonlyBtn');
}

//get cartItems
function fetchCartItems(priceFromSap, callback){
    CCRZ.FetchCartModel = (CCRZ.FetchCartModel) ? CCRZ.FetchCartModel : new CCRZ.models.CCB2B_FetchCartModel();
    CCRZ.FetchCartModel.fetchCart(priceFromSap, function(resp) {
         CCRZ.headerView.update();
         CCRZ.cartDetailView.render();
         if(callback){ callback(); }
    });
}

function verifyStock(){
    showOverlay();
        CCRZ.CCB2B_CartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
        CCRZ.CCB2B_CartModel.verifySKUPlantStockLevel(CCRZ.cartDetailModel.attributes.productList, function(resp) {
            if (resp && resp.data) {
                if (resp.data.removedSKUs) {
                    //set removed sku to model
					CCRZ.cartDetailView.model.set("removedSkus", resp.data.removedSKUs);
                    // Override of postRender function to show modal
                    CCRZ.cartDetailView.manageOOSModal = function() {
                        $('#oosErrorModal').modal({backdrop: true, keyboard: false, show: true});
                    }
                } else {
                    // Override of postRender function to NOT show modal
                    CCRZ.cartDetailView.manageOOSModal = function() {};
                }
                fetchCartItems(false, function(){
                $("#ccb2b-basket-continuecheckout-btn").attr("disabled", false);
                $(".readonlyBtn").removeClass("readonlyBtn");
                if(CCRZ.cartDetailView.model.attributes.deliveryInfo){
                let preventCheckout = CCRZ.cartDetailView.model.attributes.deliveryInfo.preventCheckout;
                    if(preventCheckout){
                        $("#ccb2b-basket-continuecheckout-btn").attr("disabled", true);
                        $("#ccb2b-basket-continuecheckout-btn").addClass("readonlyBtn");
                    }
                }
            });
            hideOverlay();
        }
    });
}

function checkIfPositiveQuantity() {
     var entries = $('.cc_entry');
     for (var i=0; i<entries.length; i++){
         if ($(entries[i]).val() > 0){
             return true;
         }
     }
     return false;
}

function proceedLeavePage(event, view) {
     var target = $(event.currentTarget);
     $('a:not("#ccb2b-menu-browseproducts, #ccb2b-menu-businesssupport, #ccb2b-menu-helpdesk"), .processToCart, .goToCart, .goToOffer, #logoUrl, .cc_sort_option, .cc_layout_option, .goToPLP').unbind('click');
     $('.cc_page_size_control').unbind('change');
     $('.cc_entry').val(0);
     var size = target.data("size");
     var layout = target.data("layout");
     //check if original event switches sizing
     if (size) {
         $('#confirmLeavePage').modal('hide');
         view.model.set("pageSize", parseInt(size));
         view.tempRedirectionTarget = undefined;
         CCRZ.pubSub.trigger("view:productItemsView:shouldRefresh");
     }
     //check if original event switches layout
     else if (layout) {
         $('#confirmLeavePage').modal('hide');
         view.model.set("layout", layout);
         view.tempRedirectionTarget = undefined;
         CCRZ.pubSub.trigger("view:productItemsView:shouldRefresh");
     }
     else {
         $('#confirmLeavePage').modal('hide');
         $(view.tempRedirectionTarget).click();
         view.tempRedirectionTarget = undefined;
     }
}