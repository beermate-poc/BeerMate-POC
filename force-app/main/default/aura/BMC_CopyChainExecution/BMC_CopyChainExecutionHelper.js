({
    getCEInfo : function(helper, component, event, getExecutionRec) {
        try{
            var action = component.get("c.getRelatedCE");
            var recordId = component.get('v.recordId');
            action.setParams({ executionId: getExecutionRec });
            action.setCallback(this, function(a) {
                var state = a.getState();
                if (state === "SUCCESS") {
                    var chainActivity = a.getReturnValue();
                    //component.find('startDate').set("v.chainActivity.BMC_Start_Date__c);
                    component.set("v.chainActivity", a.getReturnValue());
                    component.set("v.recordTypeId", chainActivity.RecordTypeId);
                    component.set("v.recordTypeName", chainActivity.RecordType.Name);
                    
                    /*Changes made as part of GB-8868 bug*/
                    
                    component.find("MandateType").set("v.value",chainActivity.BMC_Mandate_Type__c);
                    component.find("startDate").set("v.value",chainActivity.BMC_Start_Date__c);
                    component.find("MBO").set("v.value",chainActivity.BMC_Monthly_Business_Objectives__c);
                    component.find("endDate").set("v.value",chainActivity.BMC_End_Date__c);
                    component.find("Notes").set("v.value",chainActivity.BMC_Notes__c);
                    component.find("costest").set("v.value",chainActivity.BMC_Program_Cost_Estimate__c);
                    component.find("gapStatus").set("v.value",chainActivity.BMC_Gap_Calculation_Status__c);
                    component.find("mobRestrction").set("v.value",chainActivity.BMC_Mobile_Restriction__c);
                    component.find("mMandateType").set("v.value",chainActivity.BMC_Mandate_Type__c);
                    component.find("mstartDate").set("v.value",chainActivity.BMC_Start_Date__c);
                    component.find("mendDate").set("v.value",chainActivity.BMC_End_Date__c);
                    component.find("mNotes").set("v.value",chainActivity.BMC_Notes__c);
                    component.find("mMinProducts").set("v.value",chainActivity.BMC_Distributor_Option_Minimum_Products__c);
                    component.find("mSeasonalBg").set("v.value",chainActivity.BMC_Seasonal_Brand_Group__c);
                    component.find("mgapStatus").set("v.value",chainActivity.BMC_Gap_Calculation_Status__c);
                    component.find("mmobRestrction").set("v.value",chainActivity.BMC_Mobile_Restriction__c);
                    
                    var Activity = component.find("Activity");
                    var Mandate = component.find("Mandate");
                    
                    if(chainActivity.RecordType.Name=='Chain Mandate'){
                        $A.util.addClass(Activity, 'slds-hide');
                        $A.util.removeClass(Activity, 'slds-show');
                        $A.util.addClass(Mandate, 'slds-show');
                        $A.util.removeClass(Mandate, 'slds-hide');
                    }
                    else{
                        $A.util.addClass(Mandate, 'slds-hide');
                        $A.util.removeClass(Mandate, 'slds-show');
                        $A.util.addClass(Activity, 'slds-show');
                        $A.util.removeClass(Activity, 'slds-hide');
                    }
                    component.set("v.showSpinner", false);
                } else {
                    var errors = a.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + 
                                          errors[0].message);
                        }
                        this.displayToast(Component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                    } else {
                        console.error("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        }catch(e){
            console.error(e);
        }
        
    },
    navigateToRecord: function ( recordId ) {
        
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": recordId
        });
        navEvt.fire();	
    },
    
    getUserName: function(component, event, helper){
        var action = component.get("c.getUserName");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.userInfo", storeResponse);
            }
        });
        $A.enqueueAction(action);
    },
    displayToast: function (component, title, message, type) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            if (toastMsg) {
                var toastParams = {
                    title: title,
                    message: message,
                    type: 'error'
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
        } catch(e){
            
        }
    },
    
})