jQuery(function($) {
        CCRZ.models.CCB2B_FetchCartModel = CCRZ.CloudCrazeModel.extend({
            className: 'cc_ctrl_Cart3',
            /* function to set new cart name */
            fetchCart: function (priceFromSap, callback) {
                    var model = this;
                    model.invokeCtx('fetchCart', function (response, event) {
                        var model = CCRZ.cartDetailModel;
                        model.set('messages', (response && response.messages)?response.messages:[]);
                        if (response.success && event.status) {
                            response.data['hasCoupon'] =
                                (response.data.couponList && response.data.couponList.length > 0);
                            response.data['couponName'] =
                                (response.data['hasCoupon'])? response.data.couponList[0]['couponName'] : null;
                            var items = response.data.ECartItemsS;
							var taxableDeposit = 0, nonTaxableDeposit = 0,
								productItems = response.data.productList
								subtotalPrice = 0, subtotalWithoutDeposit = 0,
								totalSaving = 0, basePrice = 0, subtotalForTaxes = 0, originalPrice = 0;
							$.each(items, function( index, item ){
								var sku = item.product,
									isTaxable = productItems[sku].CCB2BDepositIsTaxable,
									depositPrice = productItems[sku].CCB2BDepositPrice || 0,
									qty = item.quantity;
								//item.pricingFromSap = true;
								//calculate subtotal
								subtotalPrice += item.subAmount;
								//calculate deposits
								taxableDeposit = calculateTaxableDeposit(depositPrice, qty, isTaxable, taxableDeposit);
								nonTaxableDeposit = calculateNonTaxableDeposit(depositPrice, qty, isTaxable, nonTaxableDeposit);
								//calculate unit price and subtotal without deposits
								item.CCB2BUnitPrice = calculateNewUnitPrice(item.price, depositPrice);
								item.CCB2BSubtotalPrice = calculateNewSubtotalPrice(item.subAmount, depositPrice, qty );
								//calculate base price
								basePrice += item.subAmount;
								originalPrice += item.CCB2BOriginalPrice ? item.CCB2BOriginalPrice * item.quantity : item.subAmount;
							});
							calculateAndSavePriceFromSAP(taxableDeposit,nonTaxableDeposit,subtotalPrice,subtotalWithoutDeposit,subtotalForTaxes,basePrice,model);
							gstTax = ((subtotalPrice - nonTaxableDeposit) * CCRZ.pagevars.pageConfig.get('sc.canadagsttax') * 0.01);
							qstTax = ((subtotalPrice - nonTaxableDeposit) * CCRZ.pagevars.pageConfig.get('sc.canadaqsttax') * 0.01);
							totalPrice = subtotalPrice + taxableDeposit + nonTaxableDeposit + gstTax + qstTax;
							totalSaving = calculateTotalSaving(originalPrice, basePrice, model);
							
							model.set("CCB2B_SubtotalQst", parseFloat(qstTax.toFixed(2)));
							model.set("CCB2B_SubtotalGst", parseFloat(gstTax.toFixed(2)));
							model.set("CCB2B_TotalPrice", totalPrice);
							response.data.summaryReady = true;
                            var cartModelData = response.data;
                            model.processData(cartModelData, model);
                            model.trigger('refreshedFromServer');
                            callback(response);
                        } else {
                            callback(response);
                        }
                        CCRZ.pubSub.trigger("pageMessage", response);
                    }, {escape: false, timeout: 120000});
                },
            });
});