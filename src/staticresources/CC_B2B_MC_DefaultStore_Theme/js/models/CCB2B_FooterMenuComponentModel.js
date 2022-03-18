jQuery(function($) {
    CCRZ.models.CCB2B_FooterMenuComponentModel = CCRZ.CloudCrazeModel.extend({
        getMenuItems: function() {
            return CCRZ.data.menus;
        }
    });
});