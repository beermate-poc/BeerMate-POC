jQuery( function($){
     CCRZ.uiProperties.headerView.desktop.tmpl = CCRZ.templates.CCB2B_HeaderComponentTemplate;

     CCRZ.pubSub.once('view:headerView:refresh', function(headerView) {
             headerView.preRender  = function() {
                 Handlebars.registerPartial("subMenuItemMobile", CCRZ.templates.CCB2B_HeaderSubMenuMobileComponentTemplate);
                 var view = this;
                 waitToHeaderInfo(0, function(user){
                     view.model.set({user: user});
                     CCRZ.pubSub.trigger("c:headerInfo:done");
                 });
             };
             headerView.goToMyAccount = CCRZ.subsc.headerFunc.goToMyAccount;
             headerView.hideMiniCart = CCRZ.subsc.headerFunc.hideMiniCart;
             headerView.goHome = CCRZ.subsc.headerFunc.goHome;
             headerView.doLogout = CCRZ.subsc.headerFunc.doLogout;
             headerView.goToCart = CCRZ.subsc.headerFunc.showMiniBasket;
             headerView.delegateEvents(_.extend(headerView.events,
                  {
                      "click .goToMyAccount": "goToMyAccount",
                      "click #userDropdown": "hideMiniCart"
                  }
             ));
             headerView.render();
     });

     CCRZ.subsc = CCRZ.subsc || {};
     CCRZ.subsc.headerFunc = {
        goToMyAccount: function(event) {
            if (CCRZ.pagevars.linkOverrideMap['HeaderMyAccount']) {
                window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderMyAccount'];
            } else {
                CCRZ.headerView.goToMAS('myOverview');
            }
        },
        showMiniBasket : function(event) {
            if (CCRZ.pagevars.currentPageName.toLowerCase() == 'ccrz__checkoutnew') {
                goToCart(CCRZ.pagevars.currentCartID);
            }else{
                var miniBasketElem = $(".miniBasketSection");
                miniBasketElem.slideToggle();
            }
        },
        goHome: function(event) {
            if (CCRZ.pagevars.pageConfig["sc.redirecthomepageurl"]) {
                window.location.href = Handlebars.helpers.createDrupalLink( CCRZ.pagevars.pageConfig["sc.redirecthomepageurl"] );
            } else {
                CCRZ.homePage();
            }
        },
        hideMiniCart : function(event){
            $(".miniBasketSection").slideUp();
        },
        doLogout : function () {
            if (CCRZ.pagevars.linkOverrideMap['HeaderLogout']) {
                window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderLogout'];
            } else {
                window.location.href = CCRZ.pagevars.currSiteURL + 'CCB2B_LogoutPage';
            }
        }
     }

     CCRZ.pubSub.once('c:headerInfo:done', function() {
          CCRZ.headerView.render()
          CCRZ.productSearchView.render();
          CCRZ.headerView.renderFinish();
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

     //change styles for zooming in/zooming out
     addNewStylesForZoomOut();
     $(window).resize(function() {
        addNewStylesForZoomOut();
     });

});