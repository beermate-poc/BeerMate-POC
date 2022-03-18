jQuery(function ($) {
    CCRZ.models.CCB2B_CartModel = CCRZ.CloudCrazeModel.extend({
        className: 'CCB2B_CartController',
        /* function to add multiple products do cart */
        addAllToCart: function (products, callback) {
            this.invokeCtx('addAllToCart', products, function (resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                });
        },
        /* function to set cart data */
        setCartData: function (cartData, callback) {
            this.invokeCtx('setCartData', cartData, function (resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                });
        },
        /* function to submit order */
        submitOrder: function (callback) {
            this.invokeCtx('submitOrder', function (resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false,
                    timeout: 120000
                });
        },
        /* function to submit order paid by card */
        submitOrderCard: function (token, callback) {
            this.invokeCtx('submitOrderCard', token, function (resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false,
                    timeout: 120000
                })
        },
        /* function to persist card data via API */
        saveCardData: function (token, isSaveCard, callback) {
          this.invokeCtx('saveCardData', token, isSaveCard, function(resp){
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false,
                    timeout: 120000
                })
        },
        /* function to fetch price from SAP */
        updatePricing: function (requestedDate, callback) {
            this.invokeCtx('updatePricing', requestedDate, function (resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                });
        },
        saveUpdateChanges: function (skipAutoCalc, callback) {
            var hasChanged = CCRZ.cartDetailModel.checkForChanges();
            if (hasChanged) {
                var model = CCRZ.cartDetailModel;
                var messages = ('messages' in model.attributes) ? model.unset('messages') : [];
                var cartjson = JSON.stringify(model.toJSON());
                CCRZ.cartDetailModel.invokeCtx('updateCart', cartjson, function (response, event) {
                    model.set('messages', (response && response.messages) ? response.messages : []);
                    callback(response);
                }, {timeout: 120000});
            }
        },
        verifySKUPlantStockLevel: function (productList, callback) {
            this.invokeCtx('verifySKUPlantStockLevel', productList, function (resp) {
                    if (callback != null) {
                        callback(resp);
                    }
                },
                {
                    buffer: false,
                    escape: false,
                    nmsp: false
                }
            )
        },
        getAvailablePaymentMethods: function(callback) {
			this.invokeCtx('getAvailablePaymentMethods', function (resp) {
					if (callback != null) {
						callback(resp);
					}
				},
				{
					buffer: false,
					escape: false,
					nmsp: false
				}
			)
        },
		getDeliveryInformation: function(requestedDate, callback) {
			this.invokeCtx('getDeliveryInformation', requestedDate, function (resp) {
					if (callback != null) {
						callback(resp);
					}
				},
				{
					buffer: false,
					escape: false,
					nmsp: false
				}
			)
		},
		getDeliveryInformation: function(requestedDate, callback) {
			this.invokeCtx('getDeliveryInformation', requestedDate, false, function (resp) {
					if (callback != null) {
						callback(resp);
					}
				},
				{
					buffer: false,
					escape: false,
					nmsp: false
				}
			)
		},
		getDeliveryInformationCalendar: function(callback) {
			this.invokeCtx('getDeliveryInformation', null, true, function (resp) {
					if (callback != null) {
						callback(resp);
					}
				},
				{
					buffer: false,
					escape: false,
					nmsp: false
				}
			)
		},
		deleteCart : function(cartId, callback){
            var that = this;
            this.invokeCtx('clearCart', cartId,
                function(response){
                    if(callback){
                        callback(response);
                    }
                },
                {
                    buffer : false,
                    escape:false,
                    nmsp : false
                }
            );
        },
        clearCart : function(callback){
            var that = this;
            this.invokeCtx('clearCart', null,
                function(response){
                    if(callback){
                        callback(response);
                    }
                },
                {
                    buffer : false,
                    escape:false,
                    nmsp : false
                }
            );
        },
        getCartData : function(callback){
            var that = this;
            this.invokeCtx(
                'getCartData',
                function(response){
                    if(callback){
                        callback(response);
                    }
                },
                {
                    buffer : false,
                    escape:false,
                    nmsp : false
                }
            );
        },
        removeCartItems: function(cartItemId, callback){
             this.invokeCtx('removeCartItems', cartItemId, function (response) {
                 if(callback){
                     callback(response);
                 }
            },
            {
                 buffer : false,
                 escape: false,
                 nmsp : false
            });
        },
    });
});