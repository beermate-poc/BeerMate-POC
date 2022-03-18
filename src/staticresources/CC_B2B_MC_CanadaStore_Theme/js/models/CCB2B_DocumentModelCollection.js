jQuery(function($) {
    CCRZ.collections.CCB2B_DocumentModelCollection = CCRZ.CloudCrazePageable.extend({
        mode: "client",
        state: {
            firstPage: 1,
            pageSize: parseInt(CCRZ.getPageConfig('pgbl.ord', true) ? CCRZ.getPageConfig('pgbl.pageSize', '3') : '2000'),
        },
        searchFormData :{
            ascending: "false"
        },
        model : CCRZ.models.CCB2B_DocumentModel,
        className : 'CCB2B_MyAccountController',
        initialize : function(dataList){
            this.reset(dataList);
        },
        fetchNavData: function(state, formData, callback) {
            var coll = this;
            this.invokeContainerLoadingCtx($('.deskLayout'), "getDocuments", function(response){
                if(response && response.success) {
                    callback(response.data);
                } else {
                    CCRZ.pubSub.trigger("pageMessage", response);
                }
            }, {
                 buffer: false,
                 escape: false,
                 nmsp: false
            });
        },
        fetchAllNavData: function(state, formData, callback) {
            this.fetchNavData(state, formData, callback);
        },
    });
});