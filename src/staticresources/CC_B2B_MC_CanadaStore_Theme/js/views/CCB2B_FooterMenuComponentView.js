jQuery(function($) {
    CCRZ.views.CCB2B_FooterMenuComponentView = CCRZ.CloudCrazeView.extend({
        el : '#CCB2B_FooterMenuComponent',
        viewName : 'CCB2B_FooterMenuComponentView',
        templateDesktop : CCRZ.templates.CCB2B_FooterMenuComponentTemplate,
        init : function() {
            var view = this;
            view.model = new CCRZ.models.CCB2B_FooterMenuComponentModel();
            view.model.set('menuItems', view.model.getMenuItems());
            view.render();
        },
        renderDesktop : function() {
            this.renderView(this.templateDesktop);
        },
        renderView : function(currTemplate) {
            this.$el.html(currTemplate(this.model.toJSON()));
        },
        events: {
            'click .foot-list-item>a' : 'goTo'
        },
        goTo: function(event) {
            event.preventDefault();
            var link = $(event.currentTarget);
            var href = link.data('href');
            goTo(href);
        }
    });
});