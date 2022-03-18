jQuery(function ($) {
    CCRZ.uiProperties.CheckoutNav.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutNavTemplate;
    CCRZ.subsc = CCRZ.subsc || {};
    let requestedPickerDate = ''; // to keep chosen date between requests
    //set format date for Inclusions
    function formatDate(date) {
        var day = String(date.getDate())
        if (day.length == 1)
            day = '0' + day
        var month = String((date.getMonth() + 1))
        if (month.length == 1)
            month = '0' + month
        if ('fr_CA' == CCRZ.pagevars.userLocale) {
            return date.getFullYear() + " " + month + " " + day;
        }
        return day + " " + month + " " + date.getFullYear()
    }

    //OVERFLOW CHECKOUT
    CCRZ.Checkout = _.extend(CCRZ.Checkout || {}, {
        shippingInfo: {
            register: function (registrar) {
                registrar.registerViewNew(CCRZ.pagevars.pageLabels['CCB2B_Checkout_Shipping_Info_Step'], new CCRZ.views.UserInfoView(), 'images/shipping_payment_header.png');
            }
        }
    });

    //clickable navigation
    CCRZ.pubSub.once('view:Nav:refresh', function (navView) {
        navView.backToPreviousStep = CCRZ.subsc.checkoutNav.backToPreviousStep;
        navView.delegateEvents(_.extend(navView.events,
            {
                "click .backToPreviousStep a": "backToPreviousStep"
            }
        ));
    });
    CCRZ.subsc.checkoutNav = {
        backToPreviousStep: function () {
            CCRZ.cartCheckoutView.slideLeft();
        }
    }

    //register Shipping and Review steps for checkout
    CCRZ.pubSub.on('view:cartCheckoutView:awaitingSubViewInit', function (view) {

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
    CCRZ.pubSub.once('view:AddressListing:refresh', function (shippingView) {

        shippingView.preRender = CCRZ.subsc.shippingInfo.preRender;
        shippingView.postRender = CCRZ.subsc.shippingInfo.postRender;
        shippingView.processShippingInfo = CCRZ.subsc.shippingInfo.processShippingInfo;
        shippingView.checkMinimumOrderValue = CCRZ.subsc.shippingInfo.checkMinimumOrderValue;
        shippingView.preventKeypress = CCRZ.subsc.shippingInfo.preventKeypress;
        shippingView.setDeliveryInformation = CCRZ.subsc.shippingInfo.setDeliveryInformation;

        let checkoutModel = CCRZ.cartCheckoutModel;
        let cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
        cartModel.getDeliveryInformation(null,  (resp) => {
        if (resp && resp.success) {
            checkoutModel.set('CCB2B_deliveryInformation', resp.data);
            cartModel.set('CCB2B_deliveryInformation', resp.data);
            }
        });

        shippingView.delegateEvents(_.extend(shippingView.events,
            {
                "click .processShippingInfo": "processShippingInfo",
                "keydown .requestedDate": "preventKeypress",
                "change .requestedDate": "setDeliveryInformation"
            }
        ));

        shippingView.shippingInfo = new CCRZ.views.ShippingView();
        shippingView.shippingData = new CCRZ.collections.ShippingOptionList();
        shippingView.requestDateData = new CCRZ.models.RequestedDate();
        shippingView.shippingInfo.initSetup(function () {
            shippingView.render();
        });
    });


    CCRZ.subsc.shippingInfo = {

        preRender: function () {
            var v = CCRZ.cartCheckoutView.subView;
            v.$el.find(".shippingCost").html(formatPrice(CCRZ.cartCheckoutModel.attributes.shippingCharge));

            if (CCRZ.pagevars.pageConfig.isTrue('SO.ShowReqDate')) {
                v.shippingInfo.updateRequestedDate();
            }



        },
        postRender: function () {
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
            CCRZ.cartCheckoutView.subView.requestDateData.fetch(function () {
                CCRZ.subsc.shippingInfo.updateRequestedDate();
                //restore last Checkout step
                if (window.sessionStorage) {
                    var lastCheckoutStep = window.sessionStorage.getItem("lastCheckoutStep");
                    if (lastCheckoutStep == '1')
                        CCRZ.cartCheckoutView.subView.processShippingInfo();
                    //remove storage of last step of Checkout
                    window.sessionStorage.removeItem("lastCheckoutStep");
                }
                ;
            });
            this.checkMinimumOrderValue();
        },
        processShippingInfo: function () {
            var v = CCRZ.cartCheckoutView.subView,
                formData = form2js('shipForm', '.', false, function (node) {
                }, false);
            if (v.shippingInfo.validateInfo(formData)&&v.allowProceed) {
                CCRZ.cartCheckoutModel.set(formData);
                $('[type=button].processShippingInfo').attr('disabled', 'disabled').addClass('disabled');
                var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel,
                    cartName = (v.$el.find("#ccb2b-co-shipping-ordername-input").val()).trim(),
                    requestedDate = $('#shipForm').find('.requestedDate').val() || null;
                showOverlay();
                if (cartName == "") {
                    cartName = EMPTY_VALUE;
                }
                //setCartData
                cartModel.setCartData({
                    "cartName": cartName,
                    "requestedDeliveryDate": requestedDate,
                } , ()=>{

           //call to SAP for pricing
                        cartModel.updatePricing(requestedDate, function (resp) {
                            if (resp && resp.success) {
                                hideOverlay();
                                if (resp && resp.success) {
                                    var model = CCRZ.cartCheckoutModel, taxableDeposit = 0,
                                        nonTaxableDeposit = 0, subtotalPrice = 0,
                                        subtotalWithoutDeposit = 0, totalSaving = 0, basePrice = 0, subtotalForTaxes = 0,
                                        displaySubstitutionMsg = false,
                                        sapCartItems = [];
                                    model.set('name', cartName);
                                    var cartItems = model.get('cartItems');
                                    $.each(resp.data.cartItems, function (index, item) {
                                        var productR = item.ccrz__Product__r,
                                            depositPrice = productR.CCB2B_DepositPrice__c || 0,
                                            isTaxable = productR.CCB2B_DepositIsTaxable__c,
                                            qty = item.ccrz__Quantity__c,
                                            sku = productR.ccrz__SKU__c;
                                        //calculate subtotal
                                        subtotalPrice += item.CCB2B_SAPSubtotalPrice__c;
                                        //calculate deposits
                                        taxableDeposit = calculateTaxableDeposit(depositPrice, qty, isTaxable, taxableDeposit);
                                        nonTaxableDeposit = calculateNonTaxableDeposit(depositPrice, qty, isTaxable, nonTaxableDeposit);
                                        //calculate base price
                                        basePrice += item.ccrz__SubAmount__c;
                                        var matchingItem = (cartItems.filter(function (obj) {
                                            return obj.mockProduct.sku == sku;
                                        }))[0];
                                        //check for item substitution
                                        if(item.CCB2B_Is_Substituted__c&&!displaySubstitutionMsg){
                                            displaySubstitutionMsg = true;
                                        }
                                       if(item.CCB2B_Is_Substituted__c){
                                            matchingItem.CCB2BIsSubstituted = true;
                                       }
                                        //calculate unit price and subtotal without deposits
                                        matchingItem.CCB2BUnitPrice = calculateNewUnitPrice(item.CCB2B_SAPUnitPrice__c, depositPrice);
                                        matchingItem.CCB2BSubtotalPrice = calculateNewSubtotalPrice(item.CCB2B_SAPSubtotalPrice__c, depositPrice, qty);
                                        sapCartItems.push(matchingItem);
                                    });
                                    model.set("sapCartItems", sapCartItems);
                                    model.set("CCB2BSAPTotalPrice", resp.data.cart.CCB2B_SAPTotalPrice__c);
                                    model.set("displaySubstitutionMsg",displaySubstitutionMsg);
                                    calculateAndSavePriceFromSAP(taxableDeposit, nonTaxableDeposit, subtotalPrice, subtotalWithoutDeposit, subtotalForTaxes, basePrice, model);
                                    CCRZ.cartCheckoutView.slideRight();
                                    CCRZ.pubSub.trigger('fetchAvailablePayments', null);
                                }
                            } else if(resp && resp.data && resp.data.sapErrors.inventoryErrors){

                                var errorMessage = Handlebars.helpers.pageLabelMap(
                                    resp.data.sapErrors.inventoryErrors.labelValue,
                                    resp.data.sapErrors.inventoryErrors.productNumber
                                    );

                                $(".inventoryMsg").html(errorMessage.toString());
                                $(".pricingFromSapInventoryError").show();
                                window.scrollTo(0, 0);
                                hideOverlay();

                            } else {
                                //show error and show base prices
                                $(".pricingFromSapError").show();
                                window.scrollTo(0, 0);
                                hideOverlay();
                            }
                        });
                } );
            } else {
                window.scrollTo(0, 0);
            }
        },
        updateRequestedDate: function () {
            var view = CCRZ.cartCheckoutView.subView.shippingInfo,
                dateFormat = CCRZ.pagevars.pageLabels['Date_Format'],
                offset = 0;
            this.setDefaultDatepicker();

            if ((view.requestDateData.attributes.ApiError) && CCRZ.pagevars.pageConfig.isTrue('SO.gateDDErr')) {
                this.disableProceedButton();
            }
            if (!view.requestDateData.attributes.ApiError) {
                var offset, duration;
                if (view.requestDateData.attributes.Offset) {
                    offset = view.requestDateData.attributes.Offset;
                    var duration;
                    if (view.requestDateData.attributes.Duration) {
                        duration = view.requestDateData.attributes.Duration;
                        startDate = '+' + offset + 'd';
                        endDate = '+' + (offset + duration) + 'd';

                        $.fn.datepicker.defaults.startDate = startDate;
                        $.fn.datepicker.defaults.endDate = endDate;
                    } else {
                        startDate = '+' + offset + 'd';
                        $.fn.datepicker.defaults.startDate = startDate;
                    }
                } else if (view.requestDateData.attributes.Duration) {
                    duration = view.requestDateData.attributes.Duration;
                    startDate = new Date();
                    endDate = '+' + duration + 'd';
                    $.fn.datepicker.defaults.endDate = endDate;
                }
                if (view.requestDateData.attributes.Exclusions && this.requestDateData.attributes.Exclusions.length > 0) {
                    var exclusions = view.requestDateData.attributes.Exclusions[0];
                    if (exclusions.startsWith("*")) {
                        exclusions = exclusions.substring(exclusions.lastIndexOf("*") + 1);
                        $.fn.datepicker.defaults.daysOfWeekDisabled = exclusions;
                    } else {
                        $.fn.datepicker.defaults.datesDisabled = view.requestDateData.attributes.Exclusions;
                    }
                } else if (view.requestDateData.attributes.Inclusions && view.requestDateData.attributes.Inclusions.length > 0) {
                    var daysOfWeek = '0,1,2,3,4,5,6',
                        inclusions = view.requestDateData.attributes.Inclusions[0];
                    if (inclusions.startsWith("*")) {
                        inclusions = inclusions.substring(inclusions.lastIndexOf("*") + 1);
                        var newArr = inclusions.split(",").map(function (item) {
                            return item.trim();
                        });
                        var diff = $(daysOfWeek.split(",")).not(newArr).get();
                        $.fn.datepicker.defaults.daysOfWeekDisabled = diff;
                    } else {
                        var enabledDates = view.requestDateData.attributes.Inclusions;
                        $.fn.datepicker.defaults.beforeShowDay = function (date) {
                            if (enabledDates && enabledDates.indexOf(formatDate(date)) < 0)
                                return {enabled: false}
                            else
                                return {enabled: true}
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
        setDateWithCutOffTime: function (dateFormat) {
			var requestedDate;
            var firstAvailableDate = CCRZ.cartCheckoutModel.get('requestedDateData').firstAvailableDate,
                requestedDateElem = $('.requestedDate');
            CCRZ.cartCheckoutModel.set("firstAvailableDate", firstAvailableDate);
            if (CCRZ.cartCheckoutModel && CCRZ.cartCheckoutModel.attributes.requestedDateStr) {
                var delimeter = findDelimeterInDate(dateFormat),
                    choosedDate = stringToDate(CCRZ.cartCheckoutModel.attributes.requestedDateStr, dateFormat, delimeter),
                    firstAvailable = stringToDate(firstAvailableDate, dateFormat, delimeter),
                    isAvailable = this.checkIfdateIsAvailable(choosedDate, CCRZ.cartCheckoutModel.attributes.requestedDateStr.split(delimeter).join(' '));
                CCRZ.cartCheckoutModel.set("firstAvailableDatetime", firstAvailable);
                $.fn.datepicker.defaults.minDate = firstAvailable || 1;
                if (isAvailable && (firstAvailable < choosedDate)) {
                    requestedDate = CCRZ.cartCheckoutModel.attributes.requestedDateStr;
                } else {
                    requestedDate = firstAvailableDate;
                }
            } else {
				requestedDate = firstAvailableDate;
            }
            
			requestedDateElem.val(requestedDate).datepicker("update");
			requestedDateElem.attr("data-date", requestedDate);
			//this.setDeliveryInformation();
        },
		setDeliveryInformation: function () {
		    let requestedDate = $('.requestedDate').val();
		    requestedPickerDate = requestedDate;
		    let checkoutModel = CCRZ.cartCheckoutModel;
		    let firstAvailableDate = checkoutModel.attributes.firstAvailableDate;
            let dateFormat = CCRZ.pagevars.pageLabels['Date_Format'],
                delimeter = findDelimeterInDate(dateFormat);
            // validate requested date
            if(firstAvailableDate && requestedDate){
                firstAvailableDate = stringToDate(firstAvailableDate, dateFormat, delimeter);
                requestedDate = stringToDate(requestedDate, dateFormat, delimeter);
                if(requestedDate.getTime() < firstAvailableDate.getTime()){
                    requestedPickerDate = checkoutModel.attributes.firstAvailableDate;
                    // update the picker
                    let requestedDateElem = $('.requestedDate');
                    requestedDateElem.attr("data-date", requestedPickerDate);
                    requestedDateElem.attr("value", requestedPickerDate);
                    requestedDateElem.val(requestedPickerDate).datepicker("update");
                }
            }

			let cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel;
			cartModel.getDeliveryInformation($('.requestedDate').val(),  (resp) => {
				if (resp && resp.success) {
                    checkoutModel.set('CCB2B_deliveryInformation', resp.data);
				    cartModel.set('CCB2B_deliveryInformation', resp.data);
					CCRZ.cartCheckoutView.subView.render();
					CCRZ.subsc.shippingInfo.updateRequestedDate();
				}
            });
            this.checkMinimumOrderValue();
		},
		checkMinimumOrderValue : function(requestDate){
            showOverlay();
            var cartModel = (CCRZ.CCB2B_CartModel) ? CCRZ.CCB2B_CartModel : new CCRZ.models.CCB2B_CartModel,
                view = CCRZ.subsc.shippingInfo,
                errorSection= $(".minimumOrderWarning");

            cartModel.getCartData(function(resp) {
                if(resp.data.cart.CCB2B_MetricCaseEquivalence__c< CCRZ.pagevars.pageConfig["sc.minorderval"]){
                    cartModel.getDeliveryInformation($('.requestedDate').val() || null ,  (resp) => {
                        if (resp && resp.success && !resp.data.isValidOrderVolume) {
                            errorSection.show()
                            window.scrollTo(0,0);
                            view.disableProceedButton();
                            CCRZ.cartCheckoutView.subView.allowProceed = false;
                       }else{
                            errorSection.hide()
                            view.enableProceedButton();
                            CCRZ.cartCheckoutView.subView.allowProceed = true;
                        }
                    })
                }else{
                    errorSection.hide()
                    view.enableProceedButton();
                    CCRZ.cartCheckoutView.subView.allowProceed = true;
                }
            })
            hideOverlay();
        },
		enableProceedButton : function(){
            var proceedButton = $('[type=button].processShippingInfo ');
            if (proceedButton) {
                  proceedButton.removeClass('blocked');
                  proceedButton.removeAttr('disabled','disabled').removeClass('disabled');
            }
        },
        setJustPassedInfo: function () {
            var view = CCRZ.cartCheckoutView.subView.requestDateData,
                justPassedLabel = $("#ccb2b-co-shipping-cut-off-time-passed");
            (view.attributes.justPassed) ? justPassedLabel.show() : justPassedLabel.hide();
        },
        disableProceedButton: function () {
            var proceedButton = $('[type=button].processShippingInfo ');
            if (proceedButton) {
                proceedButton.addClass('blocked');
                proceedButton.attr('disabled', 'disabled').addClass('disabled');
            }
        },
        setDefaultDatepicker: function () {
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
            $.fn.datepicker.defaults.beforeShowDay = function (date) {
                var firstAvailableDate = CCRZ.cartCheckoutModel.get("firstAvailableDatetime") || new Date();
                if (date < firstAvailableDate) {
                    return false
                }
            };
        },
        checkIfdateIsAvailable: function (date, unformattedDate) {
            var exclusions = $.fn.datepicker.defaults.daysOfWeekDisabled,
                dayOfWeek = (date.getDay()).toString(),
                isAvailable = false,
                inclusions = CCRZ.cartCheckoutModel.get('requestedDateData').Inclusions;

            if (inclusions.indexOf(unformattedDate) == -1) {
                isAvailable = false;
                return isAvailable;
            }
            if (exclusions.indexOf(dayOfWeek) == -1) {
                isAvailable = true;
                return isAvailable;
            }
        },
        preventKeypress: function (e) {
            return false;
        }
    };

    //STEP 2 - ORDER REVIEW
    CCRZ.uiProperties.OrderReviewView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutReviewTemplate;
    CCRZ.uiProperties.CartOrderReviewView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutReviewCartItem;
    CCRZ.uiProperties.CartOrderReviewViewV2.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutReviewCartItem;
    CCRZ.pubSub.once('view:OrderReviewView:refresh', function (orderReviewView) {
        orderReviewView.goToConfirm = CCRZ.subsc.orderReview.goToConfirm;
        orderReviewView.postRender = CCRZ.subsc.orderReview.postRender;
        orderReviewView.setPaymentMethod = CCRZ.subsc.orderReview.setPaymentMethod;
        orderReviewView.checkOrderingPermission = CCRZ.subsc.orderReview.checkOrderingPermission;
        orderReviewView.delegateEvents(_.extend(orderReviewView.events,
            {
                "click .goToConfirm": "goToConfirm",
                "click .paymentMethod": "setPaymentMethod",

            }
        ));
        CCRZ.pubSub.trigger('fetchAvailablePayments', null);
        orderReviewView.render();
    });
    
    
	CCRZ.pubSub.on('fetchAvailablePayments', function () {
		var cartModel = new CCRZ.models.CCB2B_CartModel;
		cartModel.getAvailablePaymentMethods(function(resp){
		    hideOverlay();
			if(resp && resp.success){
				CCRZ.cartCheckoutModel.set({'availablePaymentMethods':resp.data});
			} else {
				window.scrollTo(0, 0);
				CCRZ.pubSub.trigger('pageMessage', {
					messages: [{
						type: 'CUSTOM',
						labelId: 'Checkout_PaymentMethods_Error',
						severity: 'ERROR',
						classToAppend: 'messagingSection-Error'
					}]
				});
			}
		});
	});

    CCRZ.subsc.orderReview = {
        postRender: function () {
            (CCRZ.CCB2B_PaymentTokensView) ? CCRZ.CCB2B_PaymentTokensView.refreshTokenList() : CCRZ.CCB2B_PaymentTokensView = new CCRZ.views.CCB2B_PaymentTokensView;
            this.checkOrderingPermission();
        },
        goToConfirm: function () {
            showOverlay();
            var deliveryDateModel = new CCRZ.models.CCB2B_DeliveryDateModel,
                requestedDeliveryDate = CCRZ.cartCheckoutModel.get("requestedDateStr");
            deliveryDateModel.checkCutOffTimePassed(requestedDeliveryDate, function (resp) {
                if (resp && resp.success && resp.data != null) {
                    if (resp.data) {
                        CCRZ.subsc.orderReview.placeOrder();
                    } else {
                        hideOverlay();
                        window.scrollTo(0, 0);
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
                    window.scrollTo(0, 0);
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
        placeOrder: function () {
            var cartModel = new CCRZ.models.CCB2B_CartModel;
            var selectedPaymentMethod = $('.payment_method_check').find('input[type="radio"]:checked').val();

            // First verify SKUPlantStockLevel
            cartModel.verifySKUPlantStockLevel(CCRZ.cartCheckoutModel.attributes.productListMap, function(resp) {
                if (resp && resp.data) {
                    // Some products have been removed
                    if (resp.data.removedSKUs) {
						var errorModal = $('#oosErrorModal'),
							removedSkus = $('#removedSkus')[0];
							
						for(var i = 0; i < resp.data.removedSKUs.length; i++){
							removedSkus.innerHTML = '<p>' + removedSkus.innerHTML + resp.data.removedSKUs[i] + '</p>';
						}

                        errorModal.modal('show');
                        $(document).on('click', '.hideModal', function () {
                            goToCart(CCRZ.pagevars.currentCartID);
                        });
                    }
                    // All products available
                    else {
                        // Pay by card - Moneris
                        if (selectedPaymentMethod === "PayByCard") {
                            var selectedToken = $('.pay_by_card_section').find('input[type="radio"]:checked').val();

                            if (selectedToken && selectedToken === 'newToken') {
                                var paymentTokensView = (CCRZ.CCB2B_PaymentTokensView) ? CCRZ.CCB2B_PaymentTokensView : new CCRZ.views.CCB2B_PaymentTokensView();
                                paymentTokensView.doMonerisSubmit();
                            } else if (selectedToken) {
                                CCRZ.pubSub.trigger("view:CCB2B_PaymentTokensView:monerisResp", selectedToken, false);
                            }
                        }
                        // Trade Account
                        else if (selectedPaymentMethod === "TradeAccount") {
                            cartModel.submitOrder(function (resp) {
                                    if (resp && resp.success) {
                                        CCRZ.subsc.orderReview.makePayment();
                                    } else {
                                        hideOverlay();
                                        var errorType = resp.data ? resp.data : '';
                                            CCRZ.pubSub.trigger('pageMessage', {
                                            messages: [{
                                                type: 'CUSTOM',
                                                labelId: 'Checkout_OrderPlaceError' + errorType,
                                                severity: 'ERROR',
                                                classToAppend: 'messagingSection-Error'
                                            }]
                                        });
                                    }
                                }
                            );
                        }
                    }
                }
            });
        },
        makePayment: function () {
            showOverlay();
            var paymentModel = new CCRZ.models.PaymentModel(),
                paymentDataJson = {};
                var v = this;
            paymentModel.invokeCtx('placeOrderNew', paymentDataJson, function (response) {
                if (response && response.success) {
					v.saveCardData(response, v.saveCard);
                } else if (response && response.messages && _.isArray(response.messages) && (response.messages.length > 0)) {
                    CCRZ.pubSub.trigger('pageMessage', response);
                    showOverlay();
                    if (response.data && !response.data.isValidated) {
                        setTimeout(function () {
                            //wait 3 seconds, then redirect to the cart page
                            cartDetails();
                            hideOverlay();
                        }, 3000)
                    } else {
                        hideOverlay();
                    }
                } else {
                    hideOverlay();
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
        setPaymentMethod: function () {
            var target = $(event.target),
                id = target[0].id,
                payByCardSection = $('.pay_by_card_section');

            if (id === 'ccb2b-co-review-PayByCard') {
                $(payByCardSection).show();
            } else {
                $(payByCardSection).hide();
            }
            $('.cc_billing_address').show();
            $('.goToConfirm').removeAttr("disabled");
        },
        saveCardData: function(orderCreateResponse, saveCard) {
            var cartModel = new CCRZ.models.CCB2B_CartModel;
            var v = this;
            cartModel.saveCardData(v.paymentToken, saveCard, function(resp){
				v.continueToCheckout(orderCreateResponse);
            });
        },
        continueToCheckout: function(orderCreateResponse){
		   if (orderCreateResponse.data.placeURL) {
			   window.location = orderCreateResponse.data.placeURL + getCSRQueryString();
		   } else {
			   showOverlay();
			   orderDetails(orderCreateResponse.data);
		   } 
        },
        checkOrderingPermission : function () {
            if (!Handlebars.helpers.checkContactDisplayPermissions('checkout_cart')) {
                $('#permissionErrorModal').modal('show');
            }
        }
    };

    CCRZ.pubSub.on("view:CCB2B_PaymentTokensView:monerisResp", function (token, saveCard) {
        var cartModel = new CCRZ.models.CCB2B_CartModel;

        cartModel.submitOrderCard(token, function (resp) {
                if (resp && resp.success) {
                    // Payment and SAP ok - create CC Order
					CCRZ.subsc.orderReview['saveCard'] = (saveCard === true ? true : false);
					if(resp.data){
						CCRZ.subsc.orderReview['paymentToken'] = resp.data.paymentToken;
					}		
                    CCRZ.subsc.orderReview.makePayment();
                } else {
                    // SAP or Payment error
                    var errorType = resp.data ? resp.data : '';
                    CCRZ.pubSub.trigger('pageMessage', {
                        messages: [{
                            type: 'CUSTOM',
                            labelId: 'Checkout_OrderPlaceError' + errorType,
                            severity: 'ERROR',
                            classToAppend: 'messagingSection-Error'
                        }]
                    });
                }
            }
        );
    });


    //STEP 3 - ORDER CONFIRMATION (ORDER HISTORY)
    CCRZ.uiProperties.OrderDetailView.desktop.tmpl = CCRZ.templates.CCB2B_CheckoutOrderDetailTemplate;
    CCRZ.pubSub.once('view:OrderDetailView:refresh', function (orderDetailView) {
        orderDetailView.preRender = CCRZ.subsc.orderConfirm.preRender;
        orderDetailView.render = CCRZ.subsc.orderConfirm.render;
        orderDetailView.goToAccount = CCRZ.subsc.orderConfirm.goToAccount;
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
        goToAccount: function () {
            if (CCRZ.pagevars.linkOverrideMap['HeaderMyAccount']) {
                window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderMyAccount'];
            } else {
                CCRZ.headerView.goToMAS('viewAccount');
            }
        },
        preRender: function () {
            var model = CCRZ.orderDetailModel,
                subtotalPrice = 0, subtotalWithoutDeposit = 0,
                totalSaving = 0, taxableDeposit = 0,
                nonTaxableDeposit = 0, basePrice = 0, subtotalForTaxes = 0;
            //calculate subtotals and deposits
            $.each(model.attributes.orderItems, function (index, item) {
                var depositPrice = item.mockProduct? item.mockProduct.CCB2BDepositPrice : 0,
                    isTaxable = item.mockProduct? item.mockProduct.CCB2BDepositIsTaxable: 0,
                    inventoryType = item.mockProduct? item.mockProduct.inventoryType : null,
                    qty = item.quantity;
                if(inventoryType && inventoryType != 'UNBW'){
                    //calculate subtotal
                    subtotalPrice += item.CCB2BSAPSubtotalPrice;
                    //calculate deposits
                    taxableDeposit = calculateTaxableDeposit(depositPrice, qty, isTaxable, taxableDeposit);
                    nonTaxableDeposit = calculateNonTaxableDeposit(depositPrice, qty, isTaxable, nonTaxableDeposit);
                    //calculate base price
                    basePrice += item.SubAmount;
                }
                //calculate unit price and subtotal without deposits
                item.CCB2BUnitPrice = calculateNewUnitPrice(item.CCB2BSAPUnitPrice, depositPrice);
                item.CCB2BSubtotalPrice = calculateNewSubtotalPrice(item.CCB2BSAPSubtotalPrice, depositPrice, qty);
            });
            setDepositsToModel(taxableDeposit, nonTaxableDeposit, model);
            //calculate subtotal without deposits
            subtotalWithoutDeposit = calculateSubtotalWithoutDeposit(taxableDeposit, nonTaxableDeposit, subtotalPrice);
            //calculate subtotal for calculate taxes
            subtotalForTaxes = calculateSubtotalForTaxes(taxableDeposit, subtotalWithoutDeposit);
            setSubtotalsToModel(subtotalPrice, subtotalForTaxes, subtotalWithoutDeposit, model);
            //calculate total saving
            totalSaving = calculateTotalSaving(basePrice, subtotalWithoutDeposit, model);
        },
        render: function () {
            Handlebars.registerPartial('orderItemsDesktop', CCRZ.templates.CCB2B_CheckoutConfirmCartItem);
            CCRZ.orderDetailView.preRender();
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
        },
        printOrder: function () {
            window.print();
            event.target.blur();
        },
    };
    CCRZ.subsc.orderDetail = {
        reorder : function(event) {
            var objLink = $(event.target),
                orderId = objLink.data("id"),
                reorderModal = $('#confirmOHReorder');
            reorderModal.find(".confirmReorder").attr("data-sfid",orderId);
            reorderModal.modal('show');
        }
    };
});
