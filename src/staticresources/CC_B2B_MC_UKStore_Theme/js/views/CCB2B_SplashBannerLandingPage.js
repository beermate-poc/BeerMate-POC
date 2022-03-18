jQuery( function($){
    CCRZ.uiProperties.SplashDisp.desktop.tmpl = CCRZ.templates.CCB2B_SplashBannerLandingPageTemplate;

    CCRZ.pubSub.on('view:PromoDisp:refresh', function(splashView) {
        //OOTB we have two views with the same name. To distinguish them we check the existence of the doCarousel function
        if(splashView.doCarousel){
            splashView.initCarousel = function(){
                    $('#splashBannerCarousel').slick({
                        dots: true,
                        infinite: true,
                        slidesToShow: 1,
                        swipe: false,
                        autoplay: true,
                        adaptiveHeight: true,
                        autoplaySpeed: 5000,
                        speed: 600,
                    });
            }
            splashView.initCarousel();
        }
    });
});
