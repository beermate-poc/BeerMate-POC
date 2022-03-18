jQuery( function($){
    CCRZ.uiProperties.QuickOrderView.desktop.tmpl = CCRZ.templates.CCB2B_MiniQuickOrderTemplate;
    CCRZ.uiProperties.QuickOrderView.entry.tmpl = CCRZ.templates.CCB2B_MiniQuickOrderEntryTemplate;

    CCRZ.pubSub.once('view:QuickOrderView:refresh', function(quickOrderView) {
        quickOrderView.renderDesktop = CCRZ.subsc.quickOrder.renderDesktop;
        quickOrderView.addToCart = CCRZ.subsc.quickOrder.addToCart;
        quickOrderView.validateQuantities = CCRZ.subsc.quickOrder.validateQuantities;
        quickOrderView.render();
    });

    CCRZ.subsc.quickOrder = {
        renderDesktop : function(){
            var v = this,
                numberOfRows = 3;
            v.count = 0;
            v.setElement($(CCRZ.uiProperties.QuickOrderView.desktop.selector));
            v.$el.html(v.templateDesktop());
            for (var i=0; i<numberOfRows; i++){
                this.addMore();
            }
        },
        validateQuantities: function(items) {
            var isValid = true;
            $.each(items, function(index, item) {
                var qty = item.qty;
                var scrubbedQty = CCRZ.util.scrubQuantity(qty);
                if (item.qty == '') item.qty = "0";
                if(qty !== scrubbedQty && qty!=0) {
                    isValid = false;
                    var elName = "quickorder[" + index + "].qty";
                    $(':input[name="' + elName + '"]').val(scrubbedQty);
                }
            });
            return isValid;
        },
        addToCart : function(event) {
            var formData = form2js('skuQtyForm', '.', false, function(node) {}, false);
            var data = formData.quickorder;
            if(this.validateQuantities(data)) {
                var dataSet = JSON.stringify(data);
                this.invokeCtx("addBulk", dataSet,function(response){
                    if(response && response.data) {
                        var cartId = response.data.cartId;
                        CCRZ.pagevars.currentCartID = cartId;
                        CCRZ.console.log(response);
                         //cart change will set cookie
                        CCRZ.pubSub.trigger('cartChange', cartId);
                        CCRZ.pubSub.trigger('pageMessage', response.data);
                        CCRZ.pubSub.trigger('action:CartDetailView:refresh', response.data);

                        //reset the sku and qty
                        if(CCRZ.pagevars.pageConfig.isTrue('qo.clr')){
                            $(".sku-input").val('');
                            $(".qty-input").val(1);
                        }
                        if (CCRZ.pagevars.pageConfig.isTrue('qo.g2c')) {
                            cartDetails();
                        }
                    }
                });
            }
            else {
                CCRZ.pubSub.trigger("pageMessage", CCRZ.createPageMessage('WARN', "messagingSection-Warning", 'Invalid_Qty'));
            }
        }
    }
});