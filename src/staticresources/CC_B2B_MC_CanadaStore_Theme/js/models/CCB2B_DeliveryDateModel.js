jQuery(function($) {
        CCRZ.models.CCB2B_DeliveryDateModel = CCRZ.CloudCrazeModel.extend({
             className: 'CCB2B_CutOffTimeController',
             /* function to set new cart name */
             checkCutOffTimePassed: function(requestedDeliveryDate, callback){
                  this.invokeCtx('checkCutOffTime', requestedDeliveryDate, function (resp) {
                        if(callback != null){
                            callback(resp);
                        }
                  },
                  {
                        buffer : false,
                        escape: false,
                        nmsp : false
                  });
             }
        });
});