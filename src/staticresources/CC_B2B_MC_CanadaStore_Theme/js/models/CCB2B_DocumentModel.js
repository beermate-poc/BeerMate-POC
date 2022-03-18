jQuery(function($) {
    CCRZ.models.CCB2B_DocumentModel = Backbone.Model.extend({
        initialize : function(documentModel){
            this.set(this.parse(documentModel));
        }
    });
});