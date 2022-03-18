jQuery(function ($) {
    CCRZ.views.CCB2B_PaymentTokensView = CCRZ.CloudCrazeView.extend({
        elem: '#CCB2B_PaymentTokensComponent',
        viewName: 'CCB2B_PaymentTokensView',
        templateDesktop: CCRZ.templates.CCB2B_PaymentTokensTemplate,
        init: function () {
            var view = this;
            view.refreshTokenList();
            view.attachMonerisResponse(view.handleMonerisResponse);
        },
        events: {
            'click .removeToken': 'removeToken',
            'click .paymentToken': 'setOption',
        },
        refreshTokenList: function () {
            var view = this;
            (CCRZ.CCB2B_PaymentTokensModel) ? CCRZ.CCB2B_PaymentTokensModel : CCRZ.CCB2B_PaymentTokensModel = new CCRZ.models.CCB2B_PaymentTokensModel();
            view.model = CCRZ.CCB2B_PaymentTokensModel;
            view.model.getPaymentTokens(function (resp) {
                (resp && resp.success) ? view.model.set("availableTokens", resp.data) : view.model.set("error", true);
                view.render();
            });
        },
        renderDesktop: function () {
            this.renderView(this.templateDesktop);
        },
        renderView: function (currTemplate) {
            this.setElement(this.elem);
            this.$el.html(currTemplate(CCRZ.CCB2B_PaymentTokensModel.toJSON()));
        },
        postRender: function () {
            this.showLoaderWhileIFrameLoads();
            hideOverlay();
        },
        removeToken: function (e) {
            var view = this,
                elem = $(e.currentTarget),
                parentElem = elem.closest('.paymentTokenRow'),
                tokenId = elem.data("id"),
                tokenIds = [],
                selectedId = parentElem.find('input[name="paymentToken"]:checked').attr('data-id');
            showOverlay();
            tokenIds.push(tokenId);
            view.model.removePaymentTokens(tokenIds, function (response) {
                hideOverlay();
                if (response && response.success) {
                    if(selectedId == tokenId){ //select next token if user remove selected one
                        parentElem.fadeOut(1200, function(){
                            parentElem.closest(".paymentTokens").find(".paymentTokenRow .paymentToken:visible")[0].click();
                        });
                    } else {
                        parentElem.fadeOut(1200);
                    }
                    var filteredTokens = view.model.get("availableTokens").filter(function (token) {
                        return token.Id != tokenId;
                    });
                    view.model.set("availableTokens", filteredTokens);
                } else {
                    $("#removeTokenError").modal("show");
                }
            });
        },
        setOption: function () {
            var target = $(event.target),
                id = target[0].id,
                monerisSection = $('#monerisSection');

            if (id === 'ccb2b-payment-token-new') {
                $(monerisSection).show();
            } else {
                $(monerisSection).hide();
            }
        },
        showLoaderWhileIFrameLoads: function () {
            var iframe = $('#monerisFrame');
            if (iframe.length) {
                $(iframe).before('<div id="spinner" class="loading_price"><div></div><div></div><div></div><div></div></div>');
                $(iframe).on('load', function () {
                    document.getElementById('spinner').style.display = 'none';
                });
            }
        },
        doMonerisSubmit: function () {
            var monFrameRef = document.getElementById('monerisFrame').contentWindow;
            monFrameRef.postMessage('tokenize', CCRZ.pagevars.pageConfig['mon.baseurl']);
            return false;
        },
        attachMonerisResponse: function (respMsg) {
            if (window.addEventListener) {
                window.addEventListener("message", respMsg, false);
            } else {
                if (window.attachEvent) {
                    window.attachEvent("onmessage", respMsg);
                }
            }
        },
        handleMonerisResponse: function (e) {
            var view = CCRZ.CCB2B_PaymentTokensView;
            var respData = eval("(" + e.data + ")");
            view.model.set('monerisResp', respData);
            if (respData.responseCode[0] !== '001') {
                respData.responseCode.reverse();
                var errorLabels = [];
                _.each(respData.responseCode, function (code) {
                    errorLabels.push('MONERIS_ERROR_' + code);
                });
                respData.errorLabels = errorLabels;
                hideOverlay();
                view.render();
            } else {
                // 001 - Pre-auth successful
                var saveCard = $('#ccb2b-payment-token-save')[0].checked;
                CCRZ.pubSub.trigger("view:CCB2B_PaymentTokensView:monerisResp", respData.dataKey, saveCard);
            }
        }
    });
});