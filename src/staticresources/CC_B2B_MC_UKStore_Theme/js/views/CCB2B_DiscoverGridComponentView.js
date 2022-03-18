jQuery(function($) {
    CCRZ.views.CCB2B_DiscoverGridComponentView = CCRZ.CloudCrazeView.extend({
        el : '#CCB2B_DiscoverGridComponent',
        viewName : 'CCB2B_DiscoverGridComponentView',
        templateDesktop : CCRZ.templates.CCB2B_DiscoverGridComponentTemplate,
        init : function() {
            var view = this;
            view.model = new CCRZ.models.CCB2B_DiscoverGridComponentModel();
            view.model.getData(function(resp){
                if(resp && resp.success){
                    view.model.set('menus', resp);
                    view.render();
                }
            });
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate(this.model.toJSON()));
        }
    });
});