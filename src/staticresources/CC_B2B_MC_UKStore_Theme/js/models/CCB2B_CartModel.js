jQuery(function($) {
        CCRZ.models.CCB2B_CartModel = CCRZ.CloudCrazeModel.extend({
             className: 'CCB2B_CartController',
             /* function to add multiple products do cart */
             addAllToCart: function(products, callback){
                   this.invokeCtx('addAllToCart', products, function (resp) {
                         if(callback != null){
                             callback(resp);
                         }
                   },
                   {
                         buffer : false,
                         escape: false,
                         nmsp : false
                   });
             },
             /* function to set cart data */
             setCartData: function(cartData,callback){
                  this.invokeCtx('setCartData', cartData, function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false
                  });
             },
             /* function to change PONumber */
             updatePONumber: function(poNumber,callback){
                 this.invokeCtx('updatePONumber', poNumber, function (resp) {
                       if(callback != null){
                           callback(resp);
                       }
                 },
                 {
                       buffer : false,
                       escape: false,
                       nmsp : false
                 });
             },
             /* function to prepare cart before placing order */
             prepareCart: function(selectedPaymentMethod, callback){
                  this.invokeCtx('prepareCart', selectedPaymentMethod, function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false
                  });
             },
             /* function to submit order */
             submitOrder: function(callback){
                  this.invokeCtx('submitOrder', function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false,
                        timeout: 120000
                  });
             },
             saveUpdateChanges: function(skipAutoCalc, callback) {
                 var hasChanged = CCRZ.cartDetailModel.checkForChanges();
                 if (hasChanged) {
                        var model = CCRZ.cartDetailModel;
                        var messages = ('messages' in model.attributes) ? model.unset('messages') : [];
                        var cartjson = JSON.stringify(model.toJSON());
                        CCRZ.cartDetailModel.invokeCtx('updateCart', cartjson, function(response, event){
                                 model.set('messages', (response && response.messages)?response.messages:[]);
                                 callback(response);
                        }, {timeout: 120000});
                 }
            },

            /* function to check if minimum order value is satisfiedr*/
            checkMinimumOrderValue: function(orderDate, callback){
                this.invokeCtx('checkMinimumLimit', orderDate, function(resp){
                    if(callback != null){
                        callback(resp);
                    }
                },{
                    buffer : false,
                    escape : false,
                    nmsp : false
                });
            },
            /* function to check if all free products are available */
            checkFreeProductsAvailability: function(productsSKUs, callback) {
                if (productsSKUs.length > 0) {
                    this.invokeCtx('checkFreeProductsAvailability', productsSKUs, function (resp) {
                        if (callback != null){
                            callback(resp);
                        }
                    },{
                        buffer : false,
                        escape : false,
                        nmsp : false
                    });
                } else {
                    if (callback != null){
                        callback();
                    }
                }
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
            updateCartItem : function(cartData, callback){
                var that = this;
                this.invokeCtx(
                    'updateCart', cartData,
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

        });
});