var EMPTY_VALUE = '-', QST_PERCENTAGE = 9.975, GST_PERCENTAGE = 5.0, UK_PERCENTAGE = 20.0;

Handlebars.registerHelper('splitPrice', function(decimal, index) {
    return (decimal.toFixed(2).toString().split('.'))[index];
});

Handlebars.registerHelper('getUserName', function() {
    var name = "";
    if(CCRZ.currentUser){
        name = CCRZ.currentUser.FirstName;
    }
    return name;
});

Handlebars.registerHelper('getAttachmentURL', function(Id) {
    return CCRZ.pagevars.attachmentURL + Id;
});

Handlebars.registerHelper('generateId', function(preText, name, postText) {
    if(typeof name == 'number'){
         return preText + name + postText;
    }
    else{
        if(typeof postText == 'string'){
            if(name){ return preText + name.split(" ").join("").toLowerCase() + postText; }
        } else{
            return preText + name.split(" ").join("").toLowerCase();
        }
    }
});

Handlebars.registerHelper('getSubViewName', function(index) {
    return CCRZ.myaccountView.subViewArray[index].view.viewName;
});

Handlebars.registerHelper('displayPlaceholderImage', function(obj) {
   return new Handlebars.SafeString("<img src='"+ CCRZ.pagevars.themeBaseURL + CCRZ.pagevars.pageConfig.get('ui.noimage') +"' class='" + CCRZ.pagevars.userLocale + " noImg' alt='imgPlaceholder'' />");
});

Handlebars.registerHelper('ifEmptyOrderName', function(elem, options) {
   if (elem && elem != EMPTY_VALUE) {
        return options.fn(this);
   }
   return options.inverse(this);
});

Handlebars.registerHelper('ifPageDisplay', function(pageName, options) {
    if (CCRZ.pagevars.currentPageName.toLowerCase() != pageName.toLowerCase()) {
        return options.inverse(this);
    }
    else { return options.fn(this); }
});
Handlebars.registerHelper('ifNotPageDisplay', function(pageName, options) {
    return (CCRZ.pagevars.currentPageName.toLowerCase() != pageName.toLowerCase()) ? true : false;
});
Handlebars.registerHelper('hideOnPaymentStep', function(options) {
    return (CCRZ.pagevars.currentPageName.toLowerCase() == 'ccrz__ccpage' && CCRZ.pagevars.queryParams.pageKey  && CCRZ.pagevars.queryParams.pageKey.toLowerCase() == 'payment') ? true : false;
});
Handlebars.registerHelper('setLink', function(label, link, newTab) {
    var target = newTab ? " target='_blank'" : "";
    return "<a href='" + CCRZ.processPageLabelMap(link) + "'" + target + ">" + CCRZ.processPageLabelMap(label) + "</a>";
});
Handlebars.registerHelper('calculateTax', function(subtotal, type) {
    var percent;
    switch(type) {
         case 'qst':
             percent = QST_PERCENTAGE;
             break;
         case 'gst':
             percent = GST_PERCENTAGE;
             break;
         case 'uk':
             percent = UK_PERCENTAGE;
             break;
    }
    var qstTax = (subtotal * percent * 0.01);
    return qstTax;
});
Handlebars.registerHelper('getPriceWithTaxes', function(subtotal, type) {
    var percent;
        switch(type) {
        case 'uk':
             percent = UK_PERCENTAGE;
             break;
    }
    var priceWithTax = (subtotal * (100+percent) * 0.01);
    return priceWithTax;
});
Handlebars.registerHelper('getTimeFromDate', function(timestamp) {
    var date = new Date(timestamp),
        hours = date.getHours(),
        minutes = date.getMinutes();
    return pad(hours)+":"+pad(minutes);
});
Handlebars.registerHelper('getDateFromTimestamp', function(timestamp) {
    var date = new Date(timestamp);
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
});
Handlebars.registerHelper('isLogoClickable', function(options) {
    var currPage = CCRZ.pagevars.currentPageName.toLowerCase();
    if (currPage != 'ccrz__CCChangePassword'.toLowerCase() &&
        currPage != 'ccrz__CCForgotPassword'.toLowerCase() &&
        currPage != 'ccrz__CCSiteLogin'.toLowerCase()) {
         return options.fn(this);
    } else {
         return options.inverse(this);
    }
});
Handlebars.registerHelper('calculateProductLimit', function(limit, product, maxLimit) {
    if(limit == "nolimit"){
        return limit;
    }else{
        var usedQty = product.resultQuantity || 0,
            newProductLimit = parseInt(limit - usedQty);
        if(limit > maxLimit){
            newProductLimit = parseInt(maxLimit - usedQty);
        }
        return newProductLimit;
    }
});
Handlebars.registerHelper('setDefaultRewardQty', function(dealLimit, calculatedDealLimit, product, highestPriceSKU, isDefaultInRewards) {
    var isDefaultReward = product.isDefaultReward,
        defaultQuantity = (product.defaultQuantity) ? product.defaultQuantity : 'nolimit',
        calculatedProductLimit = Handlebars.helpers.calculateProductLimit(defaultQuantity, product),
        qtyToSet = 0;
    switch(true) {
        case isDefaultInRewards && isDefaultReward && defaultQuantity == 'nolimit':
            qtyToSet = calculatedDealLimit;
            break;
        case isDefaultInRewards && isDefaultReward && defaultQuantity != 'nolimit':
            (calculatedProductLimit >= dealLimit) ? qtyToSet = calculatedDealLimit :  qtyToSet = calculatedProductLimit;
             break;
        case isDefaultInRewards && !isDefaultReward :
             qtyToSet = 0;
             break;
        case !isDefaultInRewards && product.productSKU == highestPriceSKU && defaultQuantity == 'nolimit' :
             qtyToSet = calculatedDealLimit;
             break;
        case !isDefaultInRewards && product.productSKU == highestPriceSKU && defaultQuantity != 'nolimit':
             (calculatedProductLimit > calculatedDealLimit) ? qtyToSet = calculatedDealLimit : qtyToSet = calculatedProductLimit;
             break;
        case !isDefaultInRewards && product.productSKU != highestPriceSKU :
              qtyToSet = 0;
              break;
    }
    return qtyToSet;
});
Handlebars.registerHelper('getRequestedDeliveryDate', function(deliveryDate) {
    var requestedDeliveryDate;
    if(window.sessionStorage) {
        (window.sessionStorage.getItem("dateForMinimumOrder")) ? requestedDeliveryDate = window.sessionStorage.getItem("dateForMinimumOrder") : requestedDeliveryDate = deliveryDate;
    };
    return requestedDeliveryDate;
});
Handlebars.registerHelper('formatDateFromMilliseconds', function(secs, dateFormat){
    var date = new Date(secs);
    return formatDate(date, dateFormat);
});
Handlebars.registerHelper('getNumberOfCartItems', function(){
    var total = 0;
    if(CCRZ.CCB2B_HeaderMiniBasketView && CCRZ.CCB2B_HeaderMiniBasketView.model && CCRZ.CCB2B_HeaderMiniBasketView.model.get("data")){
        cartItems = CCRZ.CCB2B_HeaderMiniBasketView.model.get("data").cartItems;
        if(cartItems && cartItems.length>0) {
            cartItems.forEach(function(val, index){
                if(val.ccrz__Quantity__c > 0) total++;
            });
        }
    }
    return total;
});
Handlebars.registerHelper('totalVisibleItems', function(items){
    var total = 0;
    if(items && items.length>0) {
        items.forEach(function(val, index){
            if(val.attributes.quantity > 0) total++;
        });
    }
    return total;
});
Handlebars.registerHelper('parseOrderStatus', function(text){
    return text.toUpperCase().replace(/\s/g, "_");
});
Handlebars.registerHelper({
    ex: function (v1) {
        return (v1 && v1 != '');
    },
    eq: function (v1, v2) {
        return v1 === v2;
    },
    ne: function (v1, v2) {
        return v1 !== v2;
    },
    lt: function (v1, v2) {
        return v1 < v2;
    },
    gt: function (v1, v2) {
        return v1 > v2;
    },
    lte: function (v1, v2) {
        return v1 <= v2;
    },
    gte: function (v1, v2) {
        return v1 >= v2;
    },
    and: function () {
        return Array.prototype.slice.call(arguments).every(Boolean);
    },
    or: function () {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    }
});
Handlebars.registerHelper('isProductInPromo', function (productId) {
    return checkIfInArray(Object.keys(CCRZ.pagevars.promotionProducts), productId);
});
Handlebars.registerHelper('promoCategory', function (productId) {
    return _.find(CCRZ.pagevars.promotionProducts, function(val, key) {
        if(key == productId) {
            return val;
        }
    });
});
Handlebars.registerHelper('createDrupalLink', function(url) {
    var effAccount = 'effectiveAccount=';
    var userLocale = 'cclcl=';
    var contactSign = (url.indexOf('?') >= 0) ? '&' : '?';
    var sign = '&';
    return url + contactSign + effAccount + CCRZ.pagevars.effAccountId + sign + userLocale + CCRZ.pagevars.userLocale;
});
Handlebars.registerHelper('parseDeliveryDay', function (deliveryDay) {
    var prefix = 'CCB2B_Day_';
    var day = deliveryDay ? deliveryDay.toUpperCase() : '' ;
    return CCRZ.processPageLabelMap(prefix+day);
});
Handlebars.registerHelper('showDealsMenuItem', function (displayName) {
    var expectedName = CCRZ.processPageLabelMap('CCB2B_Header_DealsMenuItem');
    var promoProducts = CCRZ.pagevars.promotionProducts;
    var result = 0;
    if (String(displayName).toLowerCase() === String(expectedName).toLowerCase() && !(typeof promoProducts==='undefined')) {
        result = Object.keys(CCRZ.pagevars.promotionProducts).length;
    }
    return result > 0 ? true : false;
});
Handlebars.registerHelper('categoryNoDropdownLink', function(category, styleClass, options) {
    var tmpCategory = _.clone(category);
    if (tmpCategory && tmpCategory.shortDesc) {
        delete tmpCategory.shortDesc;
    }
    if (tmpCategory && tmpCategory.longDesc) {
        delete tmpCategory.longDesc;
    }
    var categoryJSON = _.escape(JSON.stringify(tmpCategory));
    var content = '';
    var promo = '';
    if (tmpCategory && tmpCategory.name) {
        content = _.escape(tmpCategory.name);
    } else if (tmpCategory && tmpCategory.category && tmpCategory.category.name) {
        content = _.escape(tmpCategory.category.name);
    }
    var linkTarget = '';
    if (options && options.hash['image'])
        content = options.hash['image'];
    if (options && options.hash['text']) {
        content = _.escape(options.hash['text']);
    }
    if (options && options.hash['promo'])
        promo = options.hash['promo'];
    var href = CCRZ.goToPLP(null, category);
    if (category.openInNewWindow || category.isNewWindow) {
        return new Handlebars.SafeString("<a href='" + href + "' target=\"_blank\" onClick=\"return goToCategory(this)\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a>");
    } else {
        return new Handlebars.SafeString("<a href='" + href + "' onClick=\"return goToCategory(this)\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a>");
    }
});
Handlebars.registerHelper('categoryDropdownLink', function(category, styleClass, mobile, options) {
    var tmpCategory = _.clone(category);
    if (tmpCategory && tmpCategory.shortDesc) {
        delete tmpCategory.shortDesc;
    }
    if (tmpCategory && tmpCategory.longDesc) {
        delete tmpCategory.longDesc;
    }
    var categoryJSON = _.escape(JSON.stringify(tmpCategory));
    var content = '';
    var promo = '';
    if (tmpCategory && tmpCategory.name) {
        content = _.escape(tmpCategory.name);
    } else if (tmpCategory && tmpCategory.category && tmpCategory.category.name) {
        content = _.escape(tmpCategory.category.name);
    }
    var linkTarget = '';
    if (options && options.hash['image'])
        content = options.hash['image'];
    if (options && options.hash['text']) {
        content = _.escape(options.hash['text']);
    }
    if (options && options.hash['promo'])
        promo = options.hash['promo'];
    var href = CCRZ.goToPLP(null, category);
    if (mobile) {
        var id = Handlebars.helpers.generateId('ccb2b-menu-m-', category.displayName);
        if (category.openInNewWindow || category.isNewWindow) {
            return new Handlebars.SafeString("<a href='" + href + "'id='" + id + "' target=\"_blank\" onClick=\"return CCRZ.openPLP(this)\"  data-menuid=\"" + category.menuId + "\" class=\"" + styleClass + " gp_cat dropdown-toggle" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a><span class=\"hidden-xs icon-arrow-right\"></span><span class=\" visible-xs icon-plus-dark\"></span><span class=\"visible-xs icon-minus-dark\"></span>");
        } else {
            return new Handlebars.SafeString("<a href='" + href + "'id='" + id + "' onClick=\"return CCRZ.openPLP(this)\" data-menuid=\"" + category.menuId + "\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a><span class=\"hidden-xs icon-arrow-right\"></span><span class=\" visible-xs icon-plus-dark\"></span><span class=\" visible-xs icon-minus-dark\"></span>");
        }
    } else {
        var id = Handlebars.helpers.generateId('ccb2b-menu-', category.displayName);
        if (category.openInNewWindow || category.isNewWindow) {
            return new Handlebars.SafeString("<a href='" + href + "' id='" + id + "' target=\"_blank\" onClick=\"return goToCategory(this)\" data-toggle=\"dropdown\" data-menuid=\"" + category.menuId + "\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a><span class=\"hidden-xs icon-arrow-right\"></span><span class=\"visible-xs icon-plus-dark\"></span><span class=\"visible-xs icon-minus-dark\"></span>");
        } else {
            return new Handlebars.SafeString("<a href='" + href + "' id='" + id + "' onClick=\"return goToCategory(this)\" data-toggle=\"dropdown\" data-menuid=\"" + category.menuId + "\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a><span class=\"hidden-xs icon-arrow-right\"></span><span class=\"visible-xs icon-plus-dark\"></span><span class=\"visible-xs icon-minus-dark\"></span>");
        }
     }
});
Handlebars.registerHelper('hideFromMyAccountNav', function (title) {
    var labelsToHide = (CCRZ.pagevars.pageConfig['sc.myaccount.hidenav']).split(',');

    for (var i = 0; i < labelsToHide.length; i++){
        var label = labelsToHide[i].trim();
        if (CCRZ.pagevars.pageLabels[label] == title) {
            return new Handlebars.SafeString("style = \"display: none;\"");
        }
    }
});
Handlebars.registerHelper('isListEmpty', function(value){
    var isListEmpty = true;
    if(value && value.length) {
        value.forEach(function(val, index){
            if(val.ccrz__Quantity__c > 0) isListEmpty = false;
        });
    }
    return isListEmpty;
});
Handlebars.registerHelper('checkAdminProfile', function () {
    return CCRZ.pagevars.hasAdminProfile.toString() == 'true';
});
Handlebars.registerHelper('checkContactDisplayPermissions', function (currentAction) {
    var permissionsList = CCRZ.pagevars.contactPermissions;
    var hasAccess = false;
    switch(currentAction.toLowerCase()) {
        //Can see financial documents
        case 'financial_documents':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_GeneralManagerPermission__c) ||
                (permissionsList.CCB2B_FinanceParentPermission__c) || (permissionsList.CCB2B_FinancePermission__c)){
                hasAccess = true;
            }
        break;
        //Can create Basket
        case 'create_basket':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_GeneralManagerPermission__c) ||
                (permissionsList.CCB2B_OutletOrderingPermission__c) || (permissionsList.CCB2B_OrdersRequireApprovalPermission__c) ||
                (permissionsList.CCB2B_RestrictedOrderingPermission__c) || (permissionsList.CCB2B_OrdersRequireApprovalIIPermission__c)){
                hasAccess = true;
            }
        break;
        //Can checkout Basket
        case 'checkout_basket':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_GeneralManagerPermission__c) ||
                (permissionsList.CCB2B_OutletOrderingPermission__c) ||  (permissionsList.CCB2B_RestrictedOrderingPermission__c)){
                hasAccess = true;
            }
        break;
        //Can see pricing
        case 'pricing':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_GeneralManagerPermission__c) ||
                (permissionsList.CCB2B_FinanceParentPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c) ||
                (permissionsList.CCB2B_OrdersRequireApprovalPermission__c)){
                hasAccess = true;
            }
        break;
        //Can see order history
        case 'order_history':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_GeneralManagerPermission__c) ||
                (permissionsList.CCB2B_FinanceParentPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c) ||
                (permissionsList.CCB2B_OrdersRequireApprovalPermission__c)){
                hasAccess = true;
            }
        break;
        //Can create Edit New Users
        case 'create_edit_users':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_GeneralManagerPermission__c) ||
                (permissionsList.CCB2B_FinanceParentPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c)){
                hasAccess = true;
            }
        break;
    }
    return hasAccess;
});
Handlebars.registerHelper('checkMyAccountNav', function (v1, v2) {
    return (v1.toLowerCase() === v2.string.toLowerCase());
});
Handlebars.registerHelper('hideFromMyAccountNav', function (title) {
    var labelsToHide = (CCRZ.pagevars.pageConfig['sc.myaccount.hidenav']).split(',');

    for (var i = 0; i < labelsToHide.length; i++){
        var label = labelsToHide[i].trim();
        if (CCRZ.pagevars.pageLabels[label] == title) {
            return new Handlebars.SafeString("style = \"display: none;\"");
        }
    }
});
Handlebars.registerHelper('compareIgnoreCase', function(v1, v2){
    return String(v1).toLowerCase() === String(v2).toLowerCase();
});
Handlebars.registerHelper('getResourceFullUrl', function(){
    var siteUrl = CCRZ.pagevars.currSiteURL,
        themeBase = CCRZ.pagevars.themeBaseURL,
        siteUrlElements = siteUrl.split('/'),
        themeBaseElements = themeBase.split('/');
    //find duplicates
    var duplicates = siteUrlElements.filter(function(val) {
        if(val != ''){
            return themeBaseElements.indexOf(val) != -1;
        }
    });
    //remove duplicate word
    if(duplicates){
        var duplicateElem = duplicates[0];
        siteUrlElements = siteUrlElements.filter(function(item) {
            return item !== duplicateElem
        });
    }
    finallySiteUrl = siteUrlElements.join("/");
    return finallySiteUrl + themeBase;
});
Handlebars.registerHelper('getBillingAddress', function(oldBillingAddress, oldAccountName){
    if(!$.isEmptyObject(CCRZ.pagevars.billingAddress)) {
        var billingAddress = CCRZ.pagevars.billingAddress;
        billingAddress.companyName = billingAddress.accountName;
        billingAddress.address1 = billingAddress.street;
        return billingAddress;
    } else {
        if (!oldAccountName.data) oldBillingAddress.companyName = oldAccountName;
        return oldBillingAddress;
    }
});
Handlebars.registerHelper('getDeliveryAddress', function(deliveryAddress, accountName){
    if (!accountName.data) {
        deliveryAddress.companyName = accountName;
    }
    return deliveryAddress;
});
Handlebars.registerHelper('displayDeliveredQty', function (orderStatus, deliveredQty) {
    if (orderStatus !== 'Completed') {
        return 0;
    } else {
        return deliveredQty;
    }
});
// Override of OOTB helper to create category link - modified case: Deal breadcrumb link
Handlebars.registerHelper('categoryLink', function(category, styleClass, options) {
    var tmpCategory = _.clone(category);
    if (tmpCategory && tmpCategory.shortDesc) {
        delete tmpCategory.shortDesc;
    }
    if (tmpCategory && tmpCategory.longDesc) {
        delete tmpCategory.longDesc;
    }
    var categoryJSON = _.escape(JSON.stringify(tmpCategory));
    var content = '';
    var promo = '';
    if (tmpCategory && tmpCategory.name) {
        content = _.escape(tmpCategory.name);
    } else if (tmpCategory && tmpCategory.category && tmpCategory.category.name) {
        content = _.escape(tmpCategory.category.name);
    }
    var linkTarget = '';
    if (options && options.hash['image'])
        content = options.hash['image'];
    if (options && options.hash['text']) {
        content = _.escape(options.hash['text']);
    }
    if (options && options.hash['promo'])
        promo = options.hash['promo'];
    var href = CCRZ.goToPLP(null, category);

    //// Breadcrumb modification
    if (styleClass === undefined) { // undefined due to CC bug
        if (tmpCategory.friendlyUrl) {
            var friendlyUrl = _.escape(tmpCategory.friendlyUrl),
                drupalLinkIdentifier = 'DRUPAL_LINK';
            if (friendlyUrl.includes(drupalLinkIdentifier)) {
                var drupalLink = CCRZ.pagevars.pageConfig["sc.redirecthomepageurl"];
                if (drupalLink) {
                    drupalLink.includes('uk/') ? friendlyUrl = friendlyUrl.replace(drupalLinkIdentifier + '/uk/', '') : friendlyUrl = friendlyUrl.replace(drupalLinkIdentifier + '/', '');
                    href = Handlebars.helpers.createDrupalLink(drupalLink + friendlyUrl);
                }
            }
        }
    }
    ////

    if (category.openInNewWindow || category.isNewWindow) {
        return new Handlebars.SafeString("<a href='" + href + "' target=\"_blank\" onClick=\"return CCRZ.openPLP(this)\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a>");
    } else {
        return new Handlebars.SafeString("<a href='" + href + "' onClick=\"return CCRZ.openPLP(this)\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a>");
    }
});
Handlebars.registerHelper('parseDocumentType', function(docType) {
    return 'CCB2B_MyAccount_MyDocuments_Type_' + docType.toUpperCase().replace(/\s/g, "_");
});
Handlebars.registerHelper('displayFooterLogo',function(){
    const imgStr = `<img src="${CCRZ.pagevars.themeBaseURL}images/molson_footer_logo.svg" alt="imgPlaceholder" class="footer-logo" />`;
    return new Handlebars.SafeString(imgStr);
});
Handlebars.registerHelper('imgSrcUrl', function(imgName) {
    const url = `${CCRZ.pagevars.themeBaseURL}images/${imgName}`;
    return new Handlebars.SafeString(url);
});
Handlebars.registerHelper('Card', function(){
    const wpStatus = `${CCRZ.pagevars.queryParams.wpStatus}`
    if(wpStatus == 'cancelled'){
        return 'Note2';
    }
    return 'Note1';
});
Handlebars.registerHelper('isPaymentPage', function(){
    const pagekey = `${CCRZ.pagevars.queryParams.pageKey}`;
    console.log(pagekey == "Payment" ? true : false)
    return(pagekey == "Payment" ? true : false);
});
Handlebars.registerHelper('sortCartItemsOrder',function(cartItems){
    CCRZ.orderDetailModel.attributes.orderItems = cartItems.reverse();
})