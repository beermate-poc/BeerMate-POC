jQuery(function($) {
    CCRZ.views.CCB2B_PaymentTokensView = CCRZ.CloudCrazeView.extend({
        elem : '#CCB2B_PaymentTokensComponent',
        viewName : 'CCB2B_PaymentTokensView',
        templateDesktop : CCRZ.templates.CCB2B_PaymentTokensTemplate,
        init : function() {
            var view = this;
            view.refreshTokenList();
        },
        events: {
            'click .removeToken' : 'removeToken'
        },
        refreshTokenList : function() {
            var view = this;
            (CCRZ.CCB2B_PaymentTokensModel) ? CCRZ.CCB2B_PaymentTokensModel : CCRZ.CCB2B_PaymentTokensModel = new CCRZ.models.CCB2B_PaymentTokensModel();
            view.model = CCRZ.CCB2B_PaymentTokensModel;
            view.model.getPaymentTokens(function(resp) {
                (resp && resp.success) ?  view.model.set("availableTokens", resp.data) : view.model.set("error", true);
                view.render();
            });
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
        },
        renderView : function(currTemplate) {
            this.setElement(this.elem);
            this.$el.html(currTemplate(CCRZ.CCB2B_PaymentTokensModel.toJSON()));
        },
        postRender: function () {
            hideOverlay();
        },
        removeToken : function(e) {
            var view = this,
                elem = $(e.currentTarget),
                parentElem = elem.closest('.paymentTokenRow'),
                tokenId = elem.data("id"),
                tokenIds = [],
                selectedId = parentElem.find('input[name="paymentToken"]:checked').attr('data-id');
            showOverlay();
            tokenIds.push(tokenId);
            view.model.removePaymentTokens(tokenIds, function(response){
                hideOverlay();
                if(response && response.success){
                    if(selectedId == tokenId){ //select next token if user remove selected one
                        parentElem.fadeOut(1200, function(){
                            parentElem.closest(".paymentTokens").find(".paymentTokenRow .paymentToken:visible")[0].click();
                        });
                    } else {
                        parentElem.fadeOut(1200);
                    }
                } else {
                    $("#removeTokenError").modal("show");
                }
            });
        }
    });
});