jQuery( function($){
    CCRZ.uiProperties.spotlightView.desktop.tmpl = CCRZ.templates.CCB2B_Featured_Template;

    CCRZ.pubSub.once('view:spotlightView:refresh', function(spotlightView) {
        spotlightView.postRender = CCRZ.subsc.featured.postRender;
        spotlightView.render();
    });

    CCRZ.subsc.featured = {
        postRender: function(event) {
            $('#featureProductsCarousel').slick({
                 infinite: true,
                 slidesToShow: 4,
                 slidesToScroll: 1,
                 responsive: [
                     {
                       breakpoint: 991,
                       settings: {
                         slidesToShow: 3,
                       }
                     },
                     {
                       breakpoint: 767,
                       settings: {
                         slidesToShow: 2,
                       }
                     },
                     {
                       breakpoint: 575,
                       settings: {
                         slidesToShow: 1,
                       }
                     }
                   ]
            });
        }
    }
});
