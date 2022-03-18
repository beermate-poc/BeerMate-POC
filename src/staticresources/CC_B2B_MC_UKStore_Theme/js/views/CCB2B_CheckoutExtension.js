jQuery( function($){
        CCRZ.uiProperties.CheckoutNav.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutNavTemplate;
        CCRZ.subsc = CCRZ.subsc || {};
        let requestedPickerDate = ''; // to keep chosen date between requests
        let requestedStorageDate = '';  // temporary copy of date to be stored in dateForMinimumOrder session storage, to be used before session storage is updated

        //set format date for Inclusions
        function formatDate(date) {
              var day = String(date.getDate())
              if (day.length == 1)
                day = '0' + day
              var month = String((date.getMonth()+1))
              if (month.length == 1)
                month = '0' + month
              return day + " " + month + " " + date.getFullYear()
        }

        //OVERFLOW CHECKOUT
        CCRZ.Checkout = _.extend(CCRZ.Checkout||{},{
             shippingInfo: {
                  register : function(registrar){
                    registrar.registerViewNew(CCRZ.pagevars.pageLabels['CCB2B_Checkout_Shipping_Info_Step'], new CCRZ.views.UserInfoView(), 'images/shipping_payment_header.png');
                  }
             }
        });

        //clickable navigation
        CCRZ.pubSub.once('view:Nav:refresh', function(navView) {
            navView.backToPreviousStep = CCRZ.subsc.checkoutNav.backToPreviousStep;
            navView.delegateEvents(_.extend(navView.events,
                 {
                       "click .backToPreviousStep a": "backToPreviousStep"
                 }
            ));
            navView.render();
        });
        CCRZ.subsc.checkoutNav = {
            backToPreviousStep : function() {
                CCRZ.cartCheckoutView.slideLeft();
            }
        };

        //register Shipping and Review steps for checkout
        CCRZ.pubSub.on('view:cartCheckoutView:awaitingSubViewInit', function(view) {
            if (CCRZ.Checkout.shippingInfo) {
                CCRZ.Checkout.shippingInfo.register(view);
            }
            if (CCRZ.Checkout.review) {
                CCRZ.Checkout.review.register(view);
            }
            CCRZ.pubSub.trigger('view:cartCheckoutView:subViewInit', true);
        });

        //STEP 1 - DELIVERY INFO
        CCRZ.uiProperties.UserInfoView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutShippingInfoTemplate;
        CCRZ.pubSub.once('view:AddressListing:refresh', function(shippingView) {
            shippingView.preRender = CCRZ.subsc.shippingInfo.preRender;
            shippingView.postRender = CCRZ.subsc.shippingInfo.postRender;
            shippingView.processShippingInfo = CCRZ.subsc.shippingInfo.processShippingInfo;
            shippingView.processBackToInfo = CCRZ.subsc.shippingInfo.processBackToInfo;
            shippingView.preventKeypress = CCRZ.subsc.shippingInfo.preventKeypress;
            shippingView.checkMinimumOrderValue = CCRZ.subsc.shippingInfo.checkMinimumOrderValue;
            shippingView.setDeliveryTimeWindow = CCRZ.subsc.shippingInfo.setDeliveryTimeWindow;
            shippingView.updateRequestedDateData = CCRZ.subsc.shippingInfo.updateRequestedDateData;
        	shippingView.setDeliveryInformation = CCRZ.subsc.shippingInfo.setDeliveryInformation;

        // cartModel date could be outdated, so check also sessionStorage for more current value
        let requestedDate =  CCRZ.cartCheckoutModel.attributes.requestedDateStr;
        if(window.sessionStorage && (window.sessionStorage.getItem("dateForMinimumOrder"))) {
            requestedDate = window.sessionStorage.getItem("dateForMinimumOrder");
        };
        let checkoutModel = CCRZ.cartCheckoutModel;
        let cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
        cartModel.getDeliveryInformation(requestedDate,  (resp) => {
        if (resp && resp.success) {
            checkoutModel.set('CCB2B_deliveryInformation', resp.data);
            cartModel.set('CCB2B_deliveryInformation', resp.data);
            }
        });

        shippingView.delegateEvents(_.extend(shippingView.events,
            {
                "click .processShippingInfo": "processShippingInfo",
                "keydown .requestedDate": "preventKeypress",
                "change .requestedDate": "setDeliveryInformation",
                "click .processBackToInfo" : "processBackToInfo"
            }
        ));

            shippingView.shippingInfo = new CCRZ.views.ShippingView();
            shippingView.shippingData = new CCRZ.collections.ShippingOptionList();
            shippingView.requestDateData = new CCRZ.models.RequestedDate();
            shippingView.shippingInfo.initSetup(function(){
                shippingView.render();
            });
        });

        CCRZ.subsc.shippingInfo = {
            preRender : function() {
                var v = CCRZ.cartCheckoutView.subView;
                v.$el.find(".shippingCost").html(formatPrice(CCRZ.cartCheckoutModel.attributes.shippingCharge));
                if (CCRZ.pagevars.pageConfig.isTrue('SO.ShowReqDate')){
                    v.shippingInfo.updateRequestedDate();
                }
            },
            postRender : function() {
                var v = CCRZ.cartCheckoutView.subView,
                    billBean = CCRZ.cartCheckoutModel.get('billingAddress'),
                    shipBean = CCRZ.cartCheckoutModel.get('shippingAddress');

                if (billBean.stateCode) {
                    v.renderBillStates(billBean.stateCode, billBean.countryCode);
                } else if (billBean.state) {
                    v.renderBillStates(billBean.state, billBean.countryCode);
                } else {
                    v.renderBillStates('', billBean.countryCode);
                }

                if (shipBean.stateCode) {
                    v.renderShipStates(shipBean.stateCode, shipBean.countryCode);
                } else if (shipBean.state) {
                    v.renderShipStates(shipBean.state, shipBean.countryCode);
                } else {
                    v.renderShipStates('', shipBean.countryCode);
                }
                //fetch available delivery date
                CCRZ.cartCheckoutView.subView.requestDateData.fetch(function(){
                    CCRZ.subsc.shippingInfo.updateRequestedDate();
                });
                //set cartItems
                CCRZ.cartCheckoutView.model.set('basketItems', CCRZ.cartCheckoutModel.get('cartItems'));

                // order summary
                if (!CCRZ.CCB2B_CartSummaryStickyView) {
                    CCRZ.CCB2B_CartSummaryStickyView = new CCRZ.views.CCB2B_CartSummaryStickyView();
                } else {
                    CCRZ.CCB2B_CartSummaryStickyView.render();
                }
            },
            processShippingInfo : function() {
                var v = CCRZ.cartCheckoutView.subView,
                    formData = form2js('shipForm', '.', false, function(node) {}, false);
                if (v.shippingInfo.validateInfo(formData)) {
                    CCRZ.cartCheckoutModel.set(formData);
                    $('[type=button].processShippingInfo').attr('disabled','disabled').addClass('disabled');
                    var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel,
                        cartName = (v.$el.find("#ccb2b-co-shipping-ordername-input").val()).trim(),
                        requestedDate = $('#shipForm').find('.requestedDate').val() || null;
                        deliveryTimeWindow = $('#ccb2b-co-shipping-deliverytimewindow-info').text();
                    showOverlay();
                    setRequestedDateToStorage(requestedDate);
                    requestedStorageDate = requestedDate;
                    if (cartName == ""){ cartName = EMPTY_VALUE; }
                    //setCartData
                    cartModel.setCartData({
                        "cartName" : cartName,
                        "deliveryTimeWindow" : deliveryTimeWindow
                    });
                    window.scrollTo(0,0);
                    (CCRZ.CCB2B_HeaderMiniBasketView) ? CCRZ.CCB2B_HeaderMiniBasketView.fetchCartInfo(false, function () {
                        var view = CCRZ.cartCheckoutView;
                        // Refetch cart items to ensure up to date items are grouped
                        if (view.model.get('ECartItemsSGrouped')) {
                            view.className = 'cc_ctrl_CheckoutRD';
                            view.invokeCtx('fetchCart', function (response) {
                                if (response && response.data) {
                                    var parsedData = JSON.parse(parseUnicodeDecimal(JSON.stringify(response.data)));
                                    view.model.attributes = parsedData;
                                    view.model.set('cartItems', parsedData.cartItems);
                                    view.model.set('basketItems', parsedData.cartItems);
                                    view.slideRight();
                                }
                            });
                        }
                        // First time going to 2 step
                        else {
                            view.slideRight();
                        }
                    }) : '';
                } else {
                    window.scrollTo(0,0);
                }
            },
            processBackToInfo : function() {
                (CCRZ.CCB2B_HeaderMiniBasketView) ? CCRZ.CCB2B_HeaderMiniBasketView.fetchCartInfo(false, function () {
                    CCRZ.cartCheckoutView.slideLeft();
                }) : '';
            },
            updateRequestedDate: function() {
                 var view = CCRZ.cartCheckoutView.subView.shippingInfo,
                     dateFormat = CCRZ.pagevars.pageLabels['Date_Format'];
                 this.setDefaultDatepicker();

                 if( (view.requestDateData.attributes.ApiError) && CCRZ.pagevars.pageConfig.isTrue('SO.gateDDErr')){
                    this.disableProceedButton();
                 }
                 if(!view.requestDateData.attributes.ApiError){
                    var duration;
                    if (view.requestDateData.attributes.Duration) {
                        duration = view.requestDateData.attributes.Duration;
                        startDate = new Date();
                        endDate = '+' + duration + 'd';
                        $.fn.datepicker.defaults.endDate = endDate;
                    }
                    if (view.requestDateData.attributes.Exclusions && this.requestDateData.attributes.Exclusions.length > 0) {
                        var exclusions = view.requestDateData.attributes.Exclusions[0];
                        if(exclusions.startsWith("*")) {
                            exclusions = exclusions.substring(exclusions.lastIndexOf("*") + 1);
                            $.fn.datepicker.defaults.daysOfWeekDisabled = exclusions;
                        } else {
                            $.fn.datepicker.defaults.datesDisabled = view.requestDateData.attributes.Exclusions;
                        }
                    }
                    if (view.requestDateData.attributes.Inclusions && view.requestDateData.attributes.Inclusions.length > 0) {
                        var daysOfWeek = '0,1,2,3,4,5,6',
                            inclusions = view.requestDateData.attributes.Inclusions[0];
                        if(inclusions.startsWith("*")) {
                            inclusions = inclusions.substring(inclusions.lastIndexOf("*") + 1);
                            var newArr = inclusions.split(",").map(function(item) {
                                return item.trim();
                            });
                            var diff = $(daysOfWeek.split(",")).not(newArr).get();
                            $.fn.datepicker.defaults.daysOfWeekDisabled = diff;
                        } else {
                            var enabledDates = view.requestDateData.attributes.Inclusions;
                            $.fn.datepicker.defaults.beforeShowDay = function(date){
                                 if (enabledDates && enabledDates.indexOf(formatDate(date)) < 0)
                                     return { enabled: false }
                                 else
                                     return { enabled: true }
                            }
                        }
                    }
                    this.setDateWithCutOffTime(dateFormat);
                    this.setJustPassedInfo();
                 }
                if(requestedPickerDate){
                                let requestedDateElem = $('.requestedDate');
                                requestedDateElem.attr("data-date", requestedPickerDate);
                                requestedDateElem.attr("value", requestedPickerDate);
                                requestedDateElem.val(requestedPickerDate).datepicker("update");
                            }
            },
            setDateWithCutOffTime : function(dateFormat){
                var firstAvailableDate = CCRZ.cartCheckoutModel.get('requestedDateData').firstAvailableDate,
                    requestedDateElem = $('.requestedDate'),
                    dateToSet;
                CCRZ.cartCheckoutModel.set("firstAvailableDate",firstAvailableDate);
                CCRZ.cartCheckoutModel.attributes.requestedDateStr = Handlebars.helpers.getRequestedDeliveryDate(CCRZ.cartCheckoutModel.attributes.requestedDateStr);
                if(CCRZ.cartCheckoutModel && CCRZ.cartCheckoutModel.attributes.requestedDateStr){
                    var delimeter = findDelimeterInDate(dateFormat),
                        choosedDate = stringToDate(CCRZ.cartCheckoutModel.attributes.requestedDateStr, dateFormat, delimeter),
                        firstAvailable = stringToDate(firstAvailableDate, dateFormat, delimeter),
                        isAvailable = this.checkIfdateIsAvailable(choosedDate, CCRZ.cartCheckoutModel.attributes.requestedDateStr.split(delimeter).join(' '));
                    CCRZ.cartCheckoutModel.set("firstAvailableDatetime",firstAvailable);
                    $.fn.datepicker.defaults.minDate = firstAvailable || 1;
                    if(isAvailable && (firstAvailable < choosedDate )){
                        var requestedDate = CCRZ.cartCheckoutModel.attributes.requestedDateStr;
                        requestedDateElem.val(requestedDate).datepicker("update");
                        dateToSet = requestedDate;
                    } else {
                        requestedDateElem.val(firstAvailableDate).datepicker("update");
                        dateToSet = firstAvailableDate;
                    }
                } else {
                    requestedDateElem.val(firstAvailableDate).datepicker("update");
                    dateToSet = firstAvailableDate;
                }
                setRequestedDateToStorage(dateToSet);
                requestedStorageDate = dateToSet;
                CCRZ.cartCheckoutModel.attributes.requestedDateStr = dateToSet;
                this.updateRequestedDateData(dateToSet);
			//	this.setDeliveryInformation();
            },
			setDeliveryInformation: function () {
        		    let requestedDate = $('.requestedDate').val();
        		    requestedPickerDate = requestedDate;
        		    let checkoutModel = CCRZ.cartCheckoutModel;
        			let cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
        			let firstAvailableDate = CCRZ.cartCheckoutModel.get('requestedDateData').firstAvailableDate;

                    if(requestedDate){
                        let today = new Date();
                        let paramDate = new Date(
                            requestedDate.substring(6)*1,
                            requestedDate.substring(3,5)-1,
                            requestedDate.substring(0,2)*1
                            );
                        if(paramDate < today){
                            requestedDate = requestedStorageDate ? requestedStorageDate: firstAvailableDate;
                            requestedPickerDate = requestedDate;
                        }
                    }
        			cartModel.getDeliveryInformation(requestedDate,  (resp) => {
        				if (resp && resp.success) {
                            checkoutModel.set('CCB2B_deliveryInformation', resp.data);
        				    cartModel.set('CCB2B_deliveryInformation', resp.data);
        					CCRZ.cartCheckoutView.subView.render();
        					CCRZ.subsc.shippingInfo.updateRequestedDate();
        				}
                    });
        		},
            setDeliveryTimeWindow : function(requestDate) {
                var view = CCRZ.cartCheckoutView.subView.requestDateData;

                if(view.attributes && view.attributes.deliveryTimeWindow) {
                    var requestedDeliveryDate = (typeof requestDate == "object") ? $(".requestedDate").val() : requestDate,
                        dateFormat = CCRZ.pagevars.pageLabels['Date_Format'],
                        delimiter = findDelimeterInDate(dateFormat),
                        requestedAsDate = stringToDate(requestedDeliveryDate, dateFormat, delimiter),
                        dayOfWeekKey = requestedAsDate.toLocaleDateString('en', { weekday: 'short' }).toUpperCase().replace(/[^A-Z]/g, ''), //IE fix - removes text directionalities
                        dayOfWeek = CCRZ.pagevars.pageLabels['CCB2B_Day_' + dayOfWeekKey],
                        deliveryTimeWindow = view.attributes.deliveryTimeWindow[requestedDeliveryDate] !== undefined ? view.attributes.deliveryTimeWindow[requestedDeliveryDate] : view.attributes.deliveryTimeWindow[dayOfWeekKey];

                    var deliveryTimeWindowInfo = Handlebars.helpers.pageLabelMap(
                         "CCB2B_DeliveryTimeWindowFormat",
                         dayOfWeek,
                         deliveryTimeWindow.startTime,
                         deliveryTimeWindow.endTime
                    );
                    $('#ccb2b-co-shipping-deliverytimewindow-info').text(deliveryTimeWindowInfo);
                }
            },
            checkMinimumOrderValue : function(requestDate){
                showOverlay();
                var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel,
                    view = CCRZ.subsc.shippingInfo,
                    requestedDeliveryDate;
                (typeof requestDate == "object") ?  requestedDeliveryDate = $(".requestedDate").val() : requestedDeliveryDate = requestDate;
                if(requestedPickerDate){
                    requestedDeliveryDate = requestedPickerDate;
                }
                CCRZ.cartCheckoutModel.attributes.requestedDateStr = requestedDeliveryDate;
                setRequestedDateToStorage(requestedDeliveryDate);
                requestedStorageDate = requestedDeliveryDate;
                cartModel.checkMinimumOrderValue(requestedDeliveryDate, function(res){
                    if (res && res.success & res.data){
                        $(".minimumOrderWarning").hide();
                        if ((CCRZ.cartCheckoutView.model.attributes.requestedDateData.ApiError) && CCRZ.pagevars.pageConfig.isTrue('SO.gateDDErr')) {
                            view.disableProceedButton();
                        } else {
                            view.enableProceedButton();
                        }
                    } else {
                        $(".minimumOrderWarning").show();
                        window.scrollTo(0,0);
                        view.disableProceedButton();
                    }
                    hideOverlay();
                });
            },
            updateRequestedDateData : function(requestDate) {
                var requestedDateElem = $('.requestedDate')
                this.setDeliveryTimeWindow(requestDate);
                this.checkMinimumOrderValue(requestDate);
                var date = requestedDateElem.val();
                requestedDateElem.attr("data-date", date);
            },
            enableProceedButton : function(){
                var proceedButton = $('[type=button].processShippingInfo ');
                if (proceedButton) {
                      proceedButton.removeClass('blocked');
                      proceedButton.removeAttr('disabled','disabled').removeClass('disabled');
                }
            },
            setJustPassedInfo : function() {
                var view = CCRZ.cartCheckoutView.subView.requestDateData,
                    justPassedLabel = $("#ccb2b-co-shipping-cut-off-time-passed");
                (view.attributes.justPassed) ? justPassedLabel.show() : justPassedLabel.hide();
            },
            disableProceedButton : function(){
                var proceedButton = $('[type=button].processShippingInfo ');
                if (proceedButton) {
                      proceedButton.addClass('blocked');
                      proceedButton.attr('disabled','disabled').addClass('disabled');
                }
            },
            setDefaultDatepicker : function(){
               var daysArray = CCRZ.pagevars.pageLabels['DaysOfWeek'].split(","),
                   daysShortArray = CCRZ.pagevars.pageLabels['CCB2B_DaysOfWeek_Short'].split(","),
                   monthsArray = CCRZ.pagevars.pageLabels['MonthsOfYear'].split(","),
                   dateFormat = CCRZ.pagevars.pageLabels['Date_Format'],
                   firstAvailableDate = CCRZ.cartCheckoutModel.get('requestedDateData').firstAvailableDate;
               $.fn.datepicker.dates[CCRZ.pagevars.userLocale] = {
                     days: daysArray,
                     daysShort: daysShortArray,
                     daysMin: daysShortArray,
                     months: monthsArray,
                     monthsShort: monthsArray,
                     format: dateFormat,
               };
               $.fn.datepicker.defaults.format = dateFormat;
               $.fn.datepicker.defaults.language = CCRZ.pagevars.userLocale;
               $.fn.datepicker.defaults.todayHighlight = true;
               $.fn.datepicker.defaults.editable = false;
               $.fn.datepicker.defaults.minDate = firstAvailableDate || 1;
               $.fn.datepicker.defaults.autoclose = true;
               $.fn.datepicker.defaults.defaultDate = new Date();
               $.fn.datepicker.defaults.minViewMode = 'days';
               $.fn.datepicker.defaults.maxViewMode = 'days';
               $.fn.datepicker.defaults.beforeShowDay = function(date){
                   var firstAvailableDate = CCRZ.cartCheckoutModel.get("firstAvailableDatetime") || new Date();
                   if (date < firstAvailableDate) {return false }
               };
            },
            checkIfdateIsAvailable : function(date, unformattedDate) {
                var exclusions = $.fn.datepicker.defaults.daysOfWeekDisabled,
                    dayOfWeek = (date.getDay()).toString(),
                    isAvailable = false,
                    inclusions = CCRZ.cartCheckoutModel.get('requestedDateData').Inclusions;

                if (inclusions.indexOf(unformattedDate) == -1) {
                    isAvailable = false;
                    return isAvailable;
                }
                if (exclusions.indexOf(dayOfWeek) == -1){
                   isAvailable = true;
                   return isAvailable;
                }
            },
            preventKeypress : function(e){
                return false;
            }
        };

        //STEP 2 - ORDER REVIEW
        CCRZ.uiProperties.OrderReviewView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutReviewTemplate;
        CCRZ.uiProperties.CartOrderReviewView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutReviewCartItem;
        CCRZ.uiProperties.CartOrderReviewViewV2.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutReviewCartItem;
        CCRZ.pubSub.once('view:OrderReviewView:refresh', function(orderReviewView) {
            orderReviewView.preRender = CCRZ.subsc.orderReview.preRender;
            orderReviewView.postRender = CCRZ.subsc.orderReview.postRender;
            orderReviewView.goToConfirm = CCRZ.subsc.orderReview.goToConfirm;
            orderReviewView.goToCart = CCRZ.subsc.orderReview.goToCart;
            orderReviewView.setPaymentMethod = CCRZ.subsc.orderReview.setPaymentMethod;
            orderReviewView.useSavedCard = CCRZ.subsc.orderReview.useSavedCard;
            orderReviewView.checkToDisablePoNumber = CCRZ.subsc.orderReview.checkToDisablePoNumber;
            orderReviewView.enablePoNumberValidation = CCRZ.subsc.orderReview.enablePoNumberValidation;
            orderReviewView.checkOrderingPermission = CCRZ.subsc.orderReview.checkOrderingPermission;
            orderReviewView.delegateEvents(_.extend(orderReviewView.events,
                 {
                          "click .goToConfirm": "goToConfirm",
                          "click .goToCart": "goToCart",
                          "click .paymentMethod": "setPaymentMethod",
                          "click .useSavedCard": "useSavedCard"
                 }
            ));
            orderReviewView.render();
        });

        CCRZ.subsc.orderReview = {
            preRender : function() {
                var view = CCRZ.cartCheckoutView,
                    cartItems = view.model.get('basketItems'),
                    categoryMap = view.model.get('productBasketCategories');
                if(cartItems[0].sfid == CCRZ.CCB2B_HeaderMiniBasketView.model.attributes.data.cartItems[0].Id){
                    cartItems = cartItems.reverse();
                }
                view.model.set('totalSavings', CCRZ.CCB2B_MiniCartModel.get('data').totalSavings);
                groupECartItemsPerCategory(view, cartItems, categoryMap);
            },
            postRender : function() {
                (CCRZ.CCB2B_PaymentTokensView) ? CCRZ.CCB2B_PaymentTokensView.refreshTokenList() : CCRZ.CCB2B_PaymentTokensView = new CCRZ.views.CCB2B_PaymentTokensView;
                 this.checkToDisablePoNumber();
                 this.enablePoNumberValidation();
                 this.checkOrderingPermission();
            },
            goToConfirm : function() {
                showOverlay();
                var deliveryDateModel = new CCRZ.models.CCB2B_DeliveryDateModel,
                    requestedDeliveryDate = CCRZ.cartCheckoutModel.get("requestedDateStr"),
                    cartModel = new CCRZ.models.CCB2B_CartModel,
                    poNumber = $('#ccb2b-co-review-po-number').val().trim();

                if (poNumber != ''){
                    cartModel.updatePONumber(poNumber);
                }

                deliveryDateModel.checkCutOffTimePassed(requestedDeliveryDate, function(resp){
                     if (resp && resp.success && resp.data != null) {
                         if (resp.data){
                            CCRZ.subsc.orderReview.placeOrder();
                         } else {
                             hideOverlay();
                             window.scrollTo(0,0);
                             CCRZ.pubSub.trigger('pageMessage', {
                                  messages: [{
                                       type: 'CUSTOM',
                                       labelId: 'Checkout_CutOffTime_Passed_Error',
                                       severity: 'ERROR',
                                       classToAppend: 'messagingSection-Error'
                                  }]
                             });
                         }
                     } else {
                         hideOverlay();
                         window.scrollTo(0,0);
                         CCRZ.pubSub.trigger('pageMessage', {
                              messages: [{
                                   type: 'CUSTOM',
                                   labelId: 'Checkout_CutOffTime_General_Error',
                                   severity: 'ERROR',
                                   classToAppend: 'messagingSection-Error'
                              }]
                         });
                     }
                });
            },
            goToCart : function() {
                goToCart(CCRZ.pagevars.currentCartID);
            },
            placeOrder : function(){
                var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
                var selectedPaymentMethod = $('.payment_method_check').find('input[type="radio"]:checked').val();
                cartModel.prepareCart(selectedPaymentMethod, function(resp) {
                     if (!resp.success) {
                         hideOverlay();
                         var errorType = resp.data ? resp.data : '',
                             label = 'Checkout_OrderPlaceError' + errorType;
                         CCRZ.pubSub.trigger('pageMessage', {
                              messages: [{
                                   type: 'CUSTOM',
                                   labelId: label,
                                   severity: 'ERROR',
                                   classToAppend: 'messagingSection-Error'
                              }]
                         });
                     } else {
                         cartModel.submitOrder(function(resp) {
                              hideOverlay();
                              if (resp && resp.success) {
                                  var makePaymentIsSuccess = resp.success && resp.data;
                                    CCRZ.subsc.orderReview.makePayment(selectedPaymentMethod, makePaymentIsSuccess);
                              } else if(resp && resp.data && resp.data.accountErrors) {
                                  var accountErrorsMsg = resp.data.accountErrors;
                                  $('#accountErrorBody').html(accountErrorsMsg);
                                  $('#accountErrorModal').modal('show');
                              } else if(resp && resp.data && resp.data.inactiveSKU) {
                                  var inactiveErrorsMsg = Handlebars.helpers.pageLabelMap(
                                      "CCB2B_InventoryError_Inactive",
                                       resp.data.inactiveSKU
                                   ).toString();
                                  $('#inventoryErrorBody').text(inactiveErrorsMsg);
                                  $('#inventoryErrorModal').modal('show');
                              } else if(resp && resp.data && resp.data.inventoryErrors) {
                                  if(resp.data.inventoryErrors.RewardError && window.sessionStorage) {
                                      window.sessionStorage.setItem('RewardError', true);
                                  }
                                  var inventoryErrorsMsg = '';
                                  if(resp.data.inventoryErrors.OutOfStock) {
                                      inventoryErrorsMsg += CCRZ.pagevars.pageLabels['CCB2B_InventoryError_Removed'];
                                      resp.data.inventoryErrors.OutOfStock.forEach(function (cartItem, index) {
                                          inventoryErrorsMsg += '</br>' + Handlebars.helpers.pageLabelMap(
                                              "CCB2B_InventoryError_ItemFormat",
                                              cartItem.sku,
                                              cartItem.name,
                                              cartItem.quantity,
                                              CCRZ.pagevars.pageLabels[(cartItem.ccrz__Quantity__c == 1) ? 'CCB2B_InventoryError_Item' : 'CCB2B_InventoryError_Items']
                                          );
                                      });
                                  }
                                  if(resp.data.inventoryErrors.PartiallyOutOfStock) {
                                      if(inventoryErrorsMsg != '') inventoryErrorsMsg += '</br>';
                                      inventoryErrorsMsg += CCRZ.pagevars.pageLabels['CCB2B_InventoryError_Changed'];
                                      resp.data.inventoryErrors.PartiallyOutOfStock.forEach(function (cartItem, index) {
                                          inventoryErrorsMsg += '</br>' + Handlebars.helpers.pageLabelMap(
                                              "CCB2B_InventoryError_ItemFormat",
                                              cartItem.sku,
                                              cartItem.name,
                                              cartItem.quantity,
                                              CCRZ.pagevars.pageLabels[(cartItem.ccrz__Quantity__c == 1) ? 'CCB2B_InventoryError_Item' : 'CCB2B_InventoryError_Items']
                                          );
                                      });
                                  }
                                  $('#inventoryErrorBody').html(inventoryErrorsMsg);
                                  $('#inventoryErrorModal').modal({backdrop: true, keyboard: false, show: true});
                                  $('#inventoryErrorModal').data('bs.modal').options.backdrop = 'static';
                              } else if(resp && resp.data && resp.data.promotionErrors){
                                 var promotionErrorMessage = Handlebars.helpers.pageLabelMap(
                                    resp.data.promotionErrors.labelValue,
                                    resp.data.promotionErrors.promotionCode
                                 );
                                 $('#promotionErrorBody').html(promotionErrorMessage.toString());
                                 $('#promotionErrorModal').modal('show');
                              } else if (resp && resp.data && resp.data.availabilityErrors){
                                  var availabilityErrorMessage = Handlebars.helpers.pageLabelMap(
                                      resp.data.availabilityErrors.labelValue,
                                      resp.data.availabilityErrors.productName,
                                      resp.data.availabilityErrors.productNumber
                                  );
                                  $('#availabilityErrorBody').html(availabilityErrorMessage.toString());
                                  $('#availabilityErrorModal').modal('show');
                              }
                              else {
                                  var errorMsg = '';
                                  if(resp.data.calloutMsg) {
                                     errorMsg = CCRZ.pagevars.pageLabels[resp.data.calloutMsg];
                                  } else {
                                      errorMsg = CCRZ.pagevars.pageLabels['Checkout_OrderPlaceError'];
                                      if(resp.data.errorMsg) {
                                          errorMsg += '</br>' + resp.data.errorMsg;
                                      }
                                      if(resp.data.refNumber) {
                                          errorMsg += '</br>' + Handlebars.helpers.pageLabelMap("CCB2B_ErrorCode", resp.data.refNumber);
                                      }
                                  }
                                  window.scrollTo(0,0);
                                  CCRZ.pubSub.trigger('pageMessage', {
                                       messages: [{
                                            type: 'CUSTOM',
                                            message: errorMsg,
                                            severity: 'ERROR',
                                            classToAppend: 'messagingSection-Error'
                                       }]
                                  });
                              }
                         });
                     }
                });
            },
            makePayment : function(paymentMethod, makePaymentIsSuccess){
                var paymentModel = new CCRZ.models.PaymentModel(),
                    paymentDataJson = {};
                paymentModel.invokeContainerLoadingCtx($('.checkoutContent'), 'placeOrderNew', paymentDataJson, function(response) {
                        hideOverlay();
                            if (response && response.success) {
                                if (response.data.placeURL) {
                                    if (window.sessionStorage){
                                        sessionStorage.setItem("dateForMinimumOrder", null);
                                    }
                                    window.location = response.data.placeURL + getCSRQueryString();
                                } else {
                                    showOverlay();
                                    // Trade account
                                    if (paymentMethod === "TradeAccount" || (paymentMethod === "PayByCard" && !makePaymentIsSuccess)) {
                                        orderDetails(response.data);
                                    // Worldpay
                                    } else if (paymentMethod === "PayByCard" && makePaymentIsSuccess) {
                                        var paymentTokensModel = (CCRZ.CCB2B_PaymentTokensModel) ? CCRZ.CCB2B_PaymentTokensModel : new CCRZ.models.CCB2B_PaymentTokensModel;
                                        var selectedToken = $('.pay_by_card_section').find('input[type="radio"]:checked').val();

                                        // Save selected token on order
                                        if (selectedToken !== 'newToken') {
                                            paymentTokensModel.saveSelectedToken(selectedToken, response.data, function (resp) {
                                                if (resp && resp.success) {
                                                    goToOrderPayment(response.data, true);
                                                }
                                            });
                                        }
                                        // New token
                                        else {
                                            goToOrderPayment(response.data, false);
                                        }
                                    }
                                }
                            } else if (response && response.messages && _.isArray(response.messages) && (response.messages.length > 0)) {
                                CCRZ.pubSub.trigger('pageMessage', response);
                                showOverlay();
                                if (response.data && !response.data.isValidated) {
                                    setTimeout(function() {
                                        //wait 3 seconds, then redirect to the cart page
                                        cartDetails();
                                        hideOverlay();
                                    }, 3000)
                                } else {
                                    hideOverlay();
                                }
                            } else {
                                CCRZ.pubSub.trigger('pageMessage', {
                                    messages: [{
                                        type: 'CUSTOM',
                                        labelId: 'Checkout_OrderPlaceError',
                                        severity: 'ERROR',
                                        classToAppend: 'messagingSection-Error'
                                    }]
                                });
                            }
                        }, {
                            escape: false,
                            timeout: 120000
                });
            },
            setPaymentMethod: function(){
                var target = $(event.target),
                    id = target[0].id,
                    payByCardSection = $('.pay_by_card_section');

                if (id == 'ccb2b-co-review-PayByCard') {
                    $(payByCardSection).show();
                }else {
                    $(payByCardSection).hide();
                }
                $('.cc_billing_address').show();
                $('.goToConfirm').removeAttr("disabled");
            },
            useSavedCard: function(){
                $('.card_section').toggle();
                $('.stored_card_section').toggle();
            },
            checkToDisablePoNumber: function(){
               var poNumber = CCRZ.cartCheckoutModel.get("poNumber");
               var isSetPONumberOnCart = poNumber ? true : false;
               if(isSetPONumberOnCart){
                   var poNumberInput = $('#ccb2b-co-review-po-number');
                   if(poNumberInput){
                     poNumberInput.val(poNumber);
                     poNumberInput.prop("disabled", isSetPONumberOnCart);
                  }
               }
            },
            enablePoNumberValidation : function () {
                $('#ccb2b-co-review-po-number').on('input', function() {
                    var c = this.selectionStart,
                        r = /[^a-z0-9]/gi,
                        v = $(this).val();
                    if (r.test(v)) {
                        $(this).val(v.replace(r, ''));
                        c--;
                    }
                    this.setSelectionRange(c, c);
                });
            },
            checkOrderingPermission : function () {
                if (!Handlebars.helpers.checkContactDisplayPermissions('checkout_basket')) {
                    $('#permissionErrorModal').modal('show');
                }
            }
        };

        //STEP 3 - ORDER CONFIRMATION (ORDER HISTORY)
        CCRZ.uiProperties.OrderDetailView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutOrderDetailTemplate;
        CCRZ.pubSub.once('view:OrderDetailView:refresh', function(orderDetailView) {
              orderDetailView.goToAccount = CCRZ.subsc.orderConfirm.goToAccount;
              orderDetailView.render = CCRZ.subsc.orderConfirm.render;
              orderDetailView.reorder = CCRZ.subsc.orderDetail.reorder;
              orderDetailView.printOrder = CCRZ.subsc.orderConfirm.printOrder;
              orderDetailView.delegateEvents(_.extend(orderDetailView.events,
                  {
                       "click .goToAccount": "goToAccount",
                       "click .reorder": "reorder",
                       "click .printOrder": "printOrder",
                  }
              ));
              orderDetailView.render();
        });
        CCRZ.subsc.orderConfirm = {
            goToAccount : function() {
                if (CCRZ.pagevars.linkOverrideMap['HeaderMyAccount']) {
                    window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderMyAccount'];
                } else {
                    CCRZ.headerView.goToMAS('myOverview');
                }
            },
            printOrder: function() {
                window.onafterprint = function(event) {
                    $(".cc_order_details").removeClass("print_class");
                    $("body").removeAttr("style");
                    hideOverlay();
                };
                window.onbeforeprint = function(event) {
                    $(".cc_order_details").addClass("print_class");
                    $("body").css('padding-bottom',0);
                }
                showOverlay();
                window.print();
            },
            render : function() {
                Handlebars.registerPartial('orderItemsDesktop', CCRZ.templates.CCB2B_CheckoutConfirmCartItem);
                var v = CCRZ.orderDetailView;
                if (CCRZ.display.isPhone()) {
                    v.setElement($(CCRZ.uiProperties.OrderDetailView.phone.selector));
                    v.$el.html(v.templatePhone(v.model.toJSON()));
                } else {
                    v.setElement($(CCRZ.uiProperties.OrderDetailView.desktop.selector));
                    v.$el.html(v.templateDesktop(v.model.toJSON()));
                }
                v.navView.render();
                CCRZ.pubSub.trigger("view:" + v.viewName + ":refresh", v);
                CCRZ.pubSub.trigger('addConfirmModal');
            }
        };
        CCRZ.subsc.orderDetail = {
            reorder : function(event) {
                var objLink = $(event.target);
                    orderId = objLink.data("id");
                    reorderModal = $('#confirmOHReorder');
                reorderModal.find(".confirmReorder").attr("data-sfid",orderId);
                reorderModal.modal('show');
            }
        };
});
