jQuery( function($){
     CCRZ.uiProperties.EffAccountSelView.widget.tmpl = CCRZ.templates.CCB2B_EffectiveAccountTemplate;

     CCRZ.pubSub.once('view:EffAccountSelView:refresh', function(effAccountView) {
                effAccountView.pickAccount = CCRZ.subsc.effPicklist.pickAccount;
                effAccountView.delegateEvents(_.extend(effAccountView.events,
                      {
                          "click .pickAccount": "pickAccount"
                      }
                ));
                effAccountView.render();
     });

     CCRZ.subsc = CCRZ.subsc || {};
     CCRZ.subsc.effPicklist = {
          pickAccount : function(event) {
               showOverlay();
               var v = this;
               var selAccId = $(event.currentTarget).data("id");
               v.processSelection(selAccId);
          }
     };
});
