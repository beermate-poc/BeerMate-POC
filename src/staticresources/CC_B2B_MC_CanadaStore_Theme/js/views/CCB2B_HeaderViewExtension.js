jQuery(function ($) {

    CCRZ.uiProperties.headerView.desktop.tmpl = CCRZ.templates.CCB2B_HeaderComponentTemplate;

    let prepareMCActions =  () => {
        let mcHasHover = false;
        let buttonHasHover = false;
        let isIPAD = /iphone|ipad/.test( navigator.userAgent.toLowerCase() );

        // hover on container not minibasketsection to keep listener after changes of basket items
        if(window.innerWidth>1024 && !isIPAD){
            $('.CCB2B_HeaderMiniBasketComponent').hover(
                (e) => {
                    mcHasHover = true;
                },
                (e) => {
                    mcHasHover = false;
                    setTimeout(() => {
                        if (!buttonHasHover) {
                            $(".miniBasketSection").slideUp();
                        }
                    }, 50);
                }
            );
            $('#cartHeader').hover(
                (e) => {
                    buttonHasHover = true;
                    var miniBasketElem = $(".miniBasketSection");
                    var visible = $(".miniBasketSection:visible").length === 1;
                    if (!visible) {
                        miniBasketElem.slideToggle();
                    }
                },
                (e) => {
                    buttonHasHover = false;
                    setTimeout(() => {
                        if (!mcHasHover) {
                            $(".miniBasketSection").slideUp();
                        }
                    }, 50);
                }
            );
        }

    }
    CCRZ.pubSub.once('view:headerView:refresh', function (headerView) {
        headerView.preRender = CCRZ.subsc.headerView.preRender;
        headerView.doLogout = CCRZ.subsc.headerView.doLogout;
        headerView.goToMyAccount = CCRZ.subsc.headerView.goToMyAccount;
        headerView.delegateEvents(_.extend(headerView.events,
            {
                "click .goToMyAccount": "goToMyAccount"
            }
        ));
        headerView.render();
        // actually test for iPad and iPhone
        let isIOS = /iphone|ipad/.test( navigator.userAgent.toLowerCase() );
        let isCheckoutPage = /checkout/.test( CCRZ.pagevars.currentPageName.toLowerCase() );
        if(!isCheckoutPage){
            if(isIOS || window.innerWidth<1025){ // isIOS or other mobile devices (smaller screen)
                headerView.events["click .chead"] = (e)=>{
                    let miniBasketElem = $(".miniBasketSection");
                    miniBasketElem.slideToggle();
                };
            }
        }
    });

    CCRZ.pubSub.once('c:headerInfo:done', function () {
        CCRZ.headerView.render();
        CCRZ.productSearchView.render();
        CCRZ.localeSwitcherView.render();
        CCRZ.headerView.renderFinish();
        if(CCRZ.pagevars.currentPageName != 'ccrz__CheckoutNew'){
            prepareMCActions();
        }
        $('.ui-autocomplete').click(e=>{
             let searchText = $.trim($("#searchText").val());
             let URL = CCRZ.buildQueryString(CCRZ.pagevars.currSiteURL + 'ccrz__ProductList?operation=quickSearch&searchText='+encodeURIComponent(searchText));
             window.location.href = URL;
        });
        if(CCRZ.pagevars.currentPageName == 'ccrz__ProductDetails'){
             CCRZ.subsc.productDetail.handleConfirmLeave();
        }
       let tt = 0
        const accswInt = setInterval(
            ()=>{
                  const accsw = $('.effwig');
                  if(accsw.length){
                      const t = accsw.detach();
                      t.appendTo('.effwigdiv');
                      accsw.css({
                          'display': 'block'
                      })
                      clearInterval(accswInt);
                  } else {
                      tt = tt + 500;
                      if(tt>10000){ //should not happen
                          clearInterval(accswInt);
                          console.log("Error moving Account Switcher!!!");
                      }
                  }
            }, 500
        );
    });

    CCRZ.subsc.headerView = {
        preRender: function () {
            Handlebars.registerPartial("subMenuItemMobile", CCRZ.templates.CCB2B_HeaderSubMenuMobileComponentTemplate);
            var view = this;
            waitToHeaderInfo(0, function (user) {
                view.model.set({user: user});
                CCRZ.pubSub.trigger("c:headerInfo:done");
            });
        },
        doLogout: function () {
            setCookie('apex__effacc', '', 0, 'b2b');
            if (CCRZ.pagevars.linkOverrideMap['HeaderLogout']) {
                window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderLogout'];
            } else {
                window.location.href = CCRZ.pagevars.currSiteURL + 'CCB2B_LogoutPage';
            }
        },
        goToMyAccount: function (event) {
            if (CCRZ.pagevars.linkOverrideMap['HeaderMyAccount']) {
                window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderMyAccount'];
            } else {
                CCRZ.headerView.goToMAS('viewAccount');
            }
        },
    };

    //change styles for zooming in/zooming out
    addNewStylesForZoomOut();
    $(window).resize(function() {
        addNewStylesForZoomOut();
    });
});