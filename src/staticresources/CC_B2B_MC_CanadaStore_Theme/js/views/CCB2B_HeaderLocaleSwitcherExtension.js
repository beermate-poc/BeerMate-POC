jQuery( function($){
     CCRZ.uiProperties.localeSwitcherView.desktop.tmpl = CCRZ.templates.CCB2B_HeaderLocaleSwitcherTemplate;
     CCRZ.uiProperties.localeSwitcherView.selectModal.tmpl = CCRZ.templates.CCB2B_HeaderLocaleSwitcherModalTemplate;

     CCRZ.pubSub.once('view:localeSwitcherView:refresh', function(view) {
           view.setLocale = CCRZ.subsc.localeView.setLocale;
     });

     CCRZ.subsc.localeView = {
        setLocale: function(event) {
             var objLink = $(event.target);
             var id = objLink.data("id");
             var v = this;
             var locale = $("tr." + this.highlightClass).attr("data-id");
             //close the modal
             v.closeModal(event);
             showOverlay();
             //first check if a selection was made and its not the current locale
             if(locale && '' != locale && this.model.attributes && this.model.attributes.locale && this.model.attributes.locale != locale){
              //with a valid locale, call the controller to set the locale
              this.model.invokeContainerLoadingCtx(
                 $('body'),'setLocale', locale,
                 function(response, event){
                    if(event.status && response && response.success && response.data){
                        //call the cc_tmpl_storefront javascript function to reload the page with the cclcl parameter

                        //if we got the same value back from the setLocale call, then set is successful,
                        //and page param can be updated and reload the page
                        if(response.data.locale && response.data.locale === locale){
                              //remove last Checkout step
                              if(CCRZ.pagevars.currentPageName === "ccrz__CheckoutNew"){
                                 if(window.sessionStorage) {
                                     if(CCRZ.cartCheckoutView.subViewArray[1].view == CCRZ.cartCheckoutView.subView){
                                         window.sessionStorage.setItem("lastCheckoutStep", '1')
                                     }
                                 };
                              }
                              CCRZ.console.log('set locale succeeded, reload page');
                              CCRZ.reloadPageWithParam("cclcl", locale);
                        } else {
                              CCRZ.console.log('set locale failed');
                              hideOverlay();
                        }
                    } else {
                         hideOverlay();
                         if(response && response.messages && _.isArray(response.messages) && response.messages.length){
                            CCRZ.console.log('got messages: '+response.messages);
                         } else{
                            CCRZ.console.log('got error');
                         }
                    }
                 },{buffer: false, timeout : 120000});
             } else { hideOverlay(); }
        }
     }
});
