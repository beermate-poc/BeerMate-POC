jQuery(function($) {
    CCRZ.views.CCB2B_CheckoutPaymentView = CCRZ.CloudCrazeView.extend({
        templateDesktop: CCRZ.templates.CCB2B_CheckoutPaymentTemplate,
        viewName: 'CCB2B_CheckoutPaymentView',
        el : '#CCB2B_PaymentContent',
        events: {
            "click .payNow": "payNow"
        },
        init : function() {
            var v = this,
                wasTokenSelected = getParameterFromUrl('ts');
            CCRZ.CCB2B_CheckoutPaymentModel = (CCRZ.CCB2B_CheckoutPaymentModel) ? CCRZ.CCB2B_CheckoutPaymentModel : new CCRZ.models.CCB2B_CheckoutPaymentModel();
            if (wasTokenSelected === "true"){
                var paymentTokensModel = (CCRZ.CCB2B_PaymentTokensModel) ? CCRZ.CCB2B_PaymentTokensModel : new CCRZ.models.CCB2B_PaymentTokensModel,
                    orderId = getParameterFromUrl("o");

                paymentTokensModel.getSelectedToken(orderId , function (resp) {
                    if (resp && resp.success) {
                        CCRZ.CCB2B_CheckoutPaymentModel.set("selectedToken", resp.data);
                        v.render();
                    }
                });
            } else {
                v.render();
            }
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate());
        },
        postRender : function () {
            var wpStatus = getParameterFromUrl("wpStatus");
            if (wpStatus) { (CCRZ.CCB2B_PaymentTokensView) ? CCRZ.CCB2B_PaymentTokensView.render() : CCRZ.CCB2B_PaymentTokensView = new CCRZ.views.CCB2B_PaymentTokensView; }
            switch(wpStatus) {
                 case "failure":
                     $('.paymentError').html('').html(CCRZ.pagevars.pageLabels['CCB2B_Checkout_Payment_FailurePayment']).show();
                     var errorDesc = getParameterFromUrl('errors').replace(/\+/g, ' ');
                     if (errorDesc) {
                         $('.paymentError.errorDesc').html('').html(errorDesc);
                         $('.errorDescBtn').show();
                     }
                     break;
                 case "cancelled":
                     $('.paymentError').html('').html(CCRZ.pagevars.pageLabels['CCB2B_Checkout_Payment_CancelledPayment']).show();
                     break;
            }
        },
        payNow : function() {
            showOverlay();
            var v = this,
                orderId = getParameterFromUrl('o'),
                paymentToken = null;
            if (CCRZ.CCB2B_CheckoutPaymentModel && CCRZ.CCB2B_CheckoutPaymentModel.get('selectedToken')) {
                paymentToken = CCRZ.CCB2B_CheckoutPaymentModel.get('selectedToken');
            } else if ($('#paymentTokensTable').length > 0){
                paymentToken = $('#paymentTokensTable').find('input[type="radio"]:checked').val()
            }
            v.model = (CCRZ.CCB2B_CheckoutPaymentModel) ? CCRZ.CCB2B_CheckoutPaymentModel : new CCRZ.models.CCB2B_CheckoutPaymentModel();
            v.model.getPaymentLink(orderId, paymentToken, function(response) {
                if (response && response.success && response.data) {
                    var paymentLink = response.data.paymentLink;
                    v.createPaymentSection(paymentLink);
                } else {
                    hideOverlay();
                    $('.paymentError').html('').html(CCRZ.pagevars.pageLabels['CCB2B_Checkout_Payment_ErrorPayment']).show();
                }
            });
        },
        createPaymentSection: function(paymentLink){
            var v = this;
            //Define and initialize Worldpay payment
            if(paymentLink){
                  var customOptions = {
                        type: 'lightbox',
                        iframeIntegrationId: 'libraryObject',
                        iframeHelperURL: Handlebars.helpers.getResourceFullUrl() + CCRZ.pagevars.pageConfig.get('sc.worldpayhelperpagepath'),
                        iframeBaseURL: CCRZ.pagevars.currentPageURL,
                        url: paymentLink,
                        target: 'worldpayPayment',
                        trigger: 'worldpayPaymentTrigger',
                        lightboxMaskOpacity: 50,
                        lightboxMaskColor: '#ffffffd1',
                        lightboxShadowColor: '#666',
                        lightboxShadowSize: '30px',
                        accessibility: true,
                        debug: CCRZ.pagevars.pageConfig.get('wpg.debug.enabled') === 'TRUE',
                        language: 'en',
                        country: 'gb',
                        preferredPaymentMethod: '',
                        successURL: CCRZ.pagevars.currSiteURL + 'ccrz__OrderConfirmation?o=' + CCRZ.pagevars.queryParams.o + getCSRQueryString(),
                        cancelURL: CCRZ.pagevars.currSiteURL + 'ccrz__CCPage?pageKey=' + CCRZ.pagevars.queryParams.pageKey + '&o=' + CCRZ.pagevars.queryParams.o +'&wpStatus=cancelled' + getCSRQueryString(),
                        failureURL: CCRZ.pagevars.currSiteURL + 'ccrz__CCPage?pageKey=' + CCRZ.pagevars.queryParams.pageKey + '&o=' + CCRZ.pagevars.queryParams.o + '&wpStatus=failure' + getCSRQueryString(),
                        errorURL: CCRZ.pagevars.currSiteURL + 'ccrz__CCPage?pageKey=' + CCRZ.pagevars.queryParams.pageKey + '&o=' + CCRZ.pagevars.queryParams.o + '&wpStatus=failure' + getCSRQueryString()
                  };
                  //initialise the library and pass options
                  var libraryObject = new WPCL.Library();
                  libraryObject.setup(customOptions);
                  hideOverlay();
                  $("#worldpayPaymentTrigger").click();
            }
        }
    });
});