jQuery(function($) {
    CCRZ.views.CCB2B_CartSummaryStickyView = CCRZ.CloudCrazeView.extend({
        viewName : 'CCB2B_CartSummaryStickyView',
        templateDesktop : CCRZ.templates.CCB2B_CartSummaryStickyMiniTemplate,
        elem : '.CCB2B_CartSummaryStickyComponent',
        init : function() {
            var view = this;
            view.model = new CCRZ.models.CCB2B_CartSummaryStickyModel();
            view.render();
        },
        preRender : function() {
            this.model.set(this.model.getCartInfo());
        },
        renderDesktop : function() {
            if (this.model.attributes.totalItems > 0 || CCRZ.pagevars.currentPageName.toLowerCase() !== 'ccrz__cart'){
                this.setElement(this.elem);
                if (CCRZ.pagevars.currentPageName.toLowerCase() === 'ccrz__cart') this.templateDesktop = CCRZ.templates.CCB2B_CartSummaryStickyTemplate;
                else if (CCRZ.pagevars.currentPageName.toLowerCase() === 'ccrz__checkoutnew') this.templateDesktop = CCRZ.templates.CCB2B_CartSummaryOrderSummaryTemplate;
                this.renderView(this.templateDesktop);
            }
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate(this.model.toJSON()));
        },
        events: {
            'click .processToCheckout' : 'processToCheckout',
            'click .processToCart' : 'processToCart'
        },
        postRender: function() {
            this.setBasketStickyOnScroll();
            stickyScroll();
        },
        setBasketStickyOnScroll : function() {
            document.addEventListener('scroll', stickyScroll, false);
            document.addEventListener('resize', stickyScroll, false);
        },
        processToCheckout: function(event) {
            showOverlay();
            CCRZ.cartDetailView.goToCheckout(event);
        },
        processToCart: function() {
            return CCRZ.CCB2B_HeaderMiniBasketView.goToCart();
        }
    });

    CCRZ.pubSub.on('view:headerMiniBasketView:init', function() {
        if (!CCRZ.CCB2B_CartSummaryStickyView) {
            CCRZ.CCB2B_CartSummaryStickyView = new CCRZ.views.CCB2B_CartSummaryStickyView();
        } else {
            CCRZ.CCB2B_CartSummaryStickyView.render();
        }
    });
});

function stickyScroll() {
    var width = window.innerWidth, mobileWidth = 991;
    if(width > mobileWidth ){
        var headerHeight = $("header").height();
        var TOP_OFFSET = 5;
        var advertisingBannerHeight = $(".advertisingSection").length > 0 ? $(".advertisingSection").height() : 0;
        var dealBannerHeight = $(".dealBanner").length > 0 ? $(".dealBanner").height() + TOP_OFFSET: 0;
        var breadcrumbHeight  = $(".breadcrumb ").length > 0 ? $(".breadcrumb ").height() + TOP_OFFSET: 0;
        headerHeight += advertisingBannerHeight + dealBannerHeight + breadcrumbHeight;
        ($(window).scrollTop() > headerHeight) ? setStickyBasket(advertisingBannerHeight, dealBannerHeight, breadcrumbHeight) : unsetStickyBasket();
    } else {
        unsetStickyBasket();
    }
}

function setStickyBasket(advertisingBannerHeight, dealBannerHeight, breadcrumbHeight) {
    var parentWidth = $(".cartSummaryCol").innerWidth();
    var stopStickyTopOffset = $('.stopStickyBasketCheckpoint').length > 0 ? $('.stopStickyBasketCheckpoint').offset().top : 0;
    var stickyBasketHeight = $('.cartSummaryContainer').length > 0 ? $('.cartSummaryContainer').height() : 0;
    var stickyBasketTopOffset = $('.cartSummaryContainer').length > 0 ? $('.cartSummaryContainer').offset().top + stickyBasketHeight : 0;
    var newStickyBasketTopOffset = ((stopStickyTopOffset - $(window).scrollTop()) - stickyBasketHeight);
    var TOP_OFFSET = 50;
    if (advertisingBannerHeight > 0) TOP_OFFSET += 20;
    if (breadcrumbHeight > 0) {
        TOP_OFFSET += breadcrumbHeight;
        if (dealBannerHeight > 0) TOP_OFFSET -= 5;
    }
    if (stopStickyTopOffset > 0 && newStickyBasketTopOffset < 0 && stickyBasketTopOffset > stopStickyTopOffset){
        TOP_OFFSET += newStickyBasketTopOffset;
    }
    $(".stickyContainer").css({
        "position": "fixed",
        "top": TOP_OFFSET + "px",
        "width": parentWidth
    });
}

function unsetStickyBasket() {
    $(".stickyContainer").css({
        "position": "static",
        "top": "0",
        "width": "auto"
    });
}