jQuery( function($){
     CCRZ.uiProperties.headerView.desktop.tmpl = CCRZ.templates.CCB2B_HeaderComponentTemplate;

   CCRZ.pubSub.once('view:headerView:refresh', function (headerView) {
        let locale = CCRZ.pagevars.userLocale.indexOf('fr')>-1 ? 'fr_CA': 'en_CA';
        let test = "data-id="+locale;
        let navLocale = navigator.locale;
        $('.active').removeClass('active');
        $(`tr[${test}]`).addClass('active');
        $('.cc_tr_locale').click((e)=>{
             $('.active').removeClass('active');
             $(e.currentTarget).addClass('active');
             let data = $(e.currentTarget).attr('data-id');
             locale = data;
        });
        $('#changeLocale').click((e)=>{
            $('#switcherMod').css('display', 'block');
        });
        $('#setLocale').click((e)=>{
            $('#switcherMod').css('display', 'none');
            window.location.href = CCRZ.pagevars.currSiteURL + CCRZ.pagevars.currentPageName +"?cclcl="+locale;
        });
        $('#cancelLocale').click((e)=>{
            $('#switcherMod').css('display', 'none');
        });
        $('.close').click((e)=>{
            $('#switcherMod').css('display', 'none');
        });
        $('#switcherMod').css('display', 'none');
        $('#logoURL').click((e) =>{
            window.location.href = CCRZ.pagevars.currSiteURL + 'ccrz__CCSiteLogin?cclcl=' + CCRZ.pagevars.userLocale;
        });
    });


});