var EMPTY_VALUE = '-';

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
   return new Handlebars.SafeString("<img src='"+ CCRZ.pagevars.themeBaseURL + CCRZ.pagevars.pageConfig.get('ui.noimage') +"' class='" + CCRZ.pagevars.userLocale + " noImg img-responsive center-block img-thumbnail' alt='imgPlaceholder'' />");
});

Handlebars.registerHelper('displayAOOImage', function(baseImgName) {
   const locale = CCRZ.pagevars.userLocale.substring(0,2).toUpperCase();
   const classStr = ` class="${CCRZ.pagevars.userLocale} allOrdOpts"`;
   // data-navigate is used in click handler - check CCB2B_Order_AllOptionsView.js
   const imgStr = `<img src="${CCRZ.pagevars.themeBaseURL}images/${baseImgName}_${locale}.png"  ${classStr} alt="imgPlaceholder" data-navigate="${baseImgName}" />`;
   return new Handlebars.SafeString(imgStr);
});

Handlebars.registerHelper('imgSrcUrl', function(imgName) {
    const url = `${CCRZ.pagevars.themeBaseURL}images/${imgName}`;
    return new Handlebars.SafeString(url);
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
Handlebars.registerHelper('setLink', function(label, link, newTab) {
    var target = newTab ? " target='_blank'" : "";
    return "<a href='" + CCRZ.processPageLabelMap(link) + "'" + target + ">" + CCRZ.processPageLabelMap(label) + "</a>";
});

Handlebars.registerHelper('calculateTax', function(subtotal, type) {
    var percent;
    switch(type) {
         case 'qst':
             percent = CCRZ.pagevars.pageConfig.get('sc.canadaqsttax');
             break;
         case 'gst':
             percent = CCRZ.pagevars.pageConfig.get('sc.canadagsttax');
             break;
    }
    var tax = (subtotal * percent * 0.01);
    return tax;
});
Handlebars.registerHelper('formatDateFromMilliseconds', function(secs, dateFormat){
    var date = new Date(secs);
    return formatDate(date, dateFormat);
});
Handlebars.registerHelper('getTimeFromDate', function(timestamp) {
    var date = new Date(timestamp * 1000),
        hours = date.getHours(),
        minutes = date.getMinutes();
    return pad(hours)+":"+pad(minutes);
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
    // no promo in Canada for now
    return  false; //checkIfInArray(Object.keys(CCRZ.pagevars.promotionProducts), productId);
});

Handlebars.registerHelper('categoryWithoutNewPageLink', function(category, styleClass, options) {
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
        return new Handlebars.SafeString("<a href='" + 'javascript:void(0);' + "' onClick=\"return CCRZ.openPLP(this)\" class=\"" + styleClass + " gp_cat" + "\" data-category= '" + categoryJSON + "' data-promo='" + promo + "'>" + content + "</a>");
});
Handlebars.registerHelper('parseOrderStatus', function(text){
    return text ?  text.toUpperCase().replace(/\s/g, "_"): '';
});

Handlebars.registerHelper('isPartiallyDelivered', function(orderStatusTxt){
    let status = orderStatusTxt ? orderStatusTxt.toUpperCase().replace(/\s/g, "_"): "";
    let isPD = status === "PARTIALLY_DELIVERED";
    return isPD;
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
Handlebars.registerHelper('createDrupalLink', function(url){
    var effAccount = 'effectiveAccount=';
    var userLocale = 'cclcl=';
    var contactSign = (url.indexOf('?') >= 0) ? '&' : '?';
    var sign = '&';
    return url + contactSign + effAccount + CCRZ.pagevars.effAccountId + sign + userLocale + CCRZ.pagevars.userLocale;
});
Handlebars.registerHelper('getClassPerLocale', function() {
    var storefront = CCRZ.pagevars.storefrontName,
    lang = CCRZ.pagevars.userLocale,
    localeClass;
    if (storefront==='CanadaStore' && lang === 'fr_CA'){
        localeClass = 'french_label';
    } else {
        localeClass = 'english_label';
    }
    return (localeClass);
});
Handlebars.registerHelper('isProductOOS', function (sku) {
    if (CCRZ.pagevars.SKUPlantStockLevel) {
        return checkIfInArray(Object.keys(CCRZ.pagevars.SKUPlantStockLevel), sku);
    }
    return false;
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
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_FinancePermission__c)) {
                hasAccess = true;
            }
            break;
        //Can create Cart
        case 'create_cart':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c) ||
            (permissionsList.CCB2B_OrdersRequireApprovalPermission__c) || (permissionsList.CCB2B_OrdersRequireApprovalIIPermission__c) ||
            (permissionsList.CCB2B_RestrictedOrderingPermission__c)) {
                hasAccess = true;
            }
            break;
        //Can checkout Basket
        case 'checkout_cart':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c) ||
            (permissionsList.CCB2B_RestrictedOrderingPermission__c)) {
                hasAccess = true;
            }
            break;
        //Can see pricing
        case 'pricing':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c) ||
            (permissionsList.CCB2B_OrdersRequireApprovalPermission__c)) {
                hasAccess = true;
            }
            break;
        //Can see order history
        case 'order_history':
            if ((permissionsList.CCB2B_SiteAdminPermission__c) || (permissionsList.CCB2B_OutletOrderingPermission__c) ||
            (permissionsList.CCB2B_OrdersRequireApprovalPermission__c)) {
                hasAccess = true;
            }
            break;
        //Can create Edit New Users
        case 'create_edit_users':
            if ((permissionsList.CCB2B_SiteAdminPermission__c)) {
                hasAccess = true;
            }
            break;
    }
    return hasAccess;
});
Handlebars.registerHelper('checkMyAccountNav', function (v1, v2) {
    return (v1.toLowerCase() === v2.string.toLowerCase());
});
Handlebars.registerHelper('ifOriginalPrice', function (originalPrice, price) {
    return originalPrice !== undefined ? originalPrice > price : false;
});
Handlebars.registerHelper('parseDocumentType', function(docType) {
    return 'CCB2B_MyAccount_MyDocuments_Type_' + docType.toUpperCase().replace(/\s/g, "_");
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
Handlebars.registerHelper('eachInMap', function(map, block) {
    var output = '';
    Object.keys(map).map(function(prop) {
        output += block.fn({key: prop, value: map[prop]});
    });
    return output;
    // usage:
    // {{#eachInMap myMap}}
    //      {{key}} {{value}}
    // {{/eachInMap}}
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

Handlebars.registerHelper('parseOrderSource', function(orderSource) {
    return orderSource.replace(/\s/g, "_");
});

Handlebars.registerHelper('parseDeliveryDay', function (deliveryDay) {
    var prefix = 'CCB2B_Day_';
    var day = deliveryDay ? deliveryDay.toUpperCase() : '' ;
    return CCRZ.processPageLabelMap(prefix+day);
});

Handlebars.registerHelper('upperCase', function(text){
    return text.toUpperCase();
});

Handlebars.registerHelper('isLang', function(text){
    const locale = CCRZ.pagevars.userLocale.substring(0,2).toUpperCase();
    return text === locale;
});

Handlebars.registerHelper('getDeliveryInfo', function() {
    if(CCRZ.myaccountView.deliveryInfo){
        return CCRZ.myaccountView.deliveryInfo.reminderMsg
    }
});

Handlebars.registerHelper('formatDeliveryInfoMessage', function(templateLabelId, isCart) {
    const prefix = 'CCB2B_Day_'; //for day of week translation
    const template = CCRZ.pagevars.pageLabels[templateLabelId];
    const deliveryInfoObj =  isCart ? CCRZ.cartDetailView.model.attributes.deliveryInfo : CCRZ.myaccountView.deliveryInfo;
    const coTime = deliveryInfoObj.localizedCutOff;
    const coDay = CCRZ.processPageLabelMap( prefix + deliveryInfoObj.cutOffDay.toUpperCase() );
    const coDate = deliveryInfoObj['localizedCutoffDate'].dayInMonth + ' ' + deliveryInfoObj['localizedCutoffDate'].month;
    const deliveryDate = deliveryInfoObj['localizedDeliveryDate'].dayInMonth + ' ' + deliveryInfoObj['localizedDeliveryDate'].month;
    const deliveryDay = CCRZ.processPageLabelMap( prefix +  deliveryInfoObj.deliveryDate.dayInWeek.toUpperCase() );

    const message = template ? template
                    .replace('${CUT-OFF-TIME}', coTime)
                    .replace('${CUT-OFF-DAY}', coDay)
                    .replace('${CUT-OFF-DATE}', coDate)
                    .replace('${NEXT-AVAILABLE-DELIVERY-DATE}', deliveryDay+' '+deliveryDate)
                    : templateLabelId ;
    return message;
});

Handlebars.registerHelper('displayFooterLogo',function(){
    const imgStr = `<img src="${CCRZ.pagevars.themeBaseURL}images/molson_footer_logo.svg" alt="imgPlaceholder" class="footer-logo" />`;
    return new Handlebars.SafeString(imgStr);
});

Handlebars.registerHelper('sortCartItemsOrder',function(cartItems){
    switch(CCRZ.pagevars.currentPageName){
        case 'ccrz__CheckoutNew':
            if(cartItems[0].sfid == CCRZ.CCB2B_HeaderMiniBasketView.model.attributes.data.cartItems[0].Id){
                    CCRZ.cartCheckoutModel.attributes.sapCartItems = cartItems.reverse();
            }
            break;
        case 'ccrz__OrderView':
            CCRZ.orderDetailModel.attributes.orderItems = cartItems.reverse();
            let orderItems = CCRZ.orderDetailModel.attributes.orderItems;
            orderItems.map(function(item){
                if(!item.mockProduct){
                    item.mockProduct = {};
                }
            })
            break;
        case 'ccrz__Cart':
            if(cartItems[0].attributes.sfid == CCRZ.CCB2B_HeaderMiniBasketView.model.attributes.data.cartItems[0].Id){
                CCRZ.cartDetailModel.attributes.ECartItemsS.models = cartItems.reverse();
            }
            break;
        case 'ccrz__OrderConfirmation':
            CCRZ.orderDetailModel.attributes.orderItems = cartItems.reverse();
            break;
    }
});
Handlebars.registerHelper('productLink', function(product, styleClass, options) {
    var SKU = '';
    if (!_.isUndefined(product)) {
        if (product.linkURL) {
            SKU = product.linkURL;
        } else if (product.sku) {
            SKU = product.sku;
        } else if (product.SKU) {
            SKU = product.SKU;
        } else if (product.productSKU) {
            SKU = product.productSKU;
        }
        var linkObj = {
            'name': product.name,
            'SKU': SKU,
            'friendlyUrl': product.friendlyUrl,
            'openInNewWindow': product.openInNewWindow
        };
        var productJSON = _.escape(JSON.stringify(linkObj));
    }
    var content = '';
    var promo = '';
    if (product && product.name) {
        content = _.escape(product.name);
    }
    if (options && options.hash['image'])
        content = options.hash['image'];
    if (options && options.hash['text']) {
        content = _.escape(_.unescape(options.hash['text']));
    }
    if (options && options.hash['promo'])
        promo = options.hash['promo'];
    if(product){
        var href = CCRZ.goToPDP(null, product);

        if (product.openInNewWindow || product.isNewWindow) {
            return new Handlebars.SafeString("<a href='" + href + "' target=\"_blank\" onClick=\"return CCRZ.openPDP(this)\" class=\"" + styleClass + " gp_prod" + "\" data-product= '" + productJSON + "' data-id= '" + SKU + "' data-promo='" + promo + "'>" + content + "</a>")
        } else {
            return new Handlebars.SafeString("<a href='" + href + "' onClick=\"return CCRZ.openPDP(this)\" class=\"" + styleClass + " gp_prod" + "\" data-product= '" + productJSON + "' data-id= '" + SKU + "' data-promo='" + promo + "'>" + content + "</a>");
        }
    }
});