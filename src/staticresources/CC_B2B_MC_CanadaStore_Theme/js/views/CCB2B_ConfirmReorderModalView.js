jQuery(function($) {
    CCRZ.views.CCB2B_ConfirmReorderModalView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_ConfirmReorderModalView',
        templateDesktop : CCRZ.templates.CCB2B_ConfirmReorderModalTemplate,
        elem : '.CCB2B_ConfirmReorderModalTarget',
        init : function() {
            this.render();
        },
        renderDesktop : function() {
            this.setElement(this.elem);
            this.renderView(this.templateDesktop);
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate());
        },
        events: {
            'click .confirmReorder' : 'reorder'
        },
        reorder: function(event) {
            showOverlay();
            var objLink = $(event.currentTarget);
            var sfid = objLink.data("sfid");
            var orderModel = new CCRZ.models.CCB2B_OrderModel;
            $('#confirmOHReorder').modal('hide');
            orderModel.reorder(sfid, function(resp) {
                if(resp && resp.success) {
                    goToCart(resp.data.cartEncId);
                } else {
                    hideOverlay();
                }
            });
        }
    });

    CCRZ.pubSub.on('addConfirmModal', function() {
        if (!CCRZ.CCB2B_ConfirmReorderModalView) {
            CCRZ.CCB2B_ConfirmReorderModalView = new CCRZ.views.CCB2B_ConfirmReorderModalView();
        }
        CCRZ.CCB2B_ConfirmReorderModalView.render();
    });
});