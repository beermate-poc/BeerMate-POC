jQuery(function($) {
    CCRZ.views.CCB2B_Order_AllOptionsView = CCRZ.CloudCrazeView.extend({
        templateDesktop: CCRZ.templates.CCB2B_Order_AllOptionsTemplate,
        viewName: 'CCB2B_Order_AllOptionsView',
        el : '#CCB2B_OrderAllOptsContent',
        events: {
            "click .tile": "allOrdOpts"
        },
        init : function() {
            this.render();
            $('[data-toggle="tooltip"]').tooltip();
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate());
        },
        allOrdOpts : function(e) {
            // navigation is using menu items
            const target = e.currentTarget.dataset.navigate;
            const locale = CCRZ.pagevars.userLocale.substring(0,2).toUpperCase();
            const menuItems = {
                "EN": {
                   "fast_order":"#ccb2b-menu-fastorder",
                   "favourities":"#ccb2b-menu-favourites",
                   "order_pad":"#ccb2b-menu-orderpad",
                   "reorder":"#ccb2b-menu-reorder"
                },
                "FR": {
                   "fast_order":"#ccb2b-menu-commanderapide",
                   "favourities":"#ccb2b-menu-favoris",
                   "order_pad":"#ccb2b-menu-bondecommande",
                   "reorder":"#ccb2b-menu-commanderdenouveau"
                }
            };
             showOverlay();
             $(menuItems[locale][target]).click();
        }

    });
});