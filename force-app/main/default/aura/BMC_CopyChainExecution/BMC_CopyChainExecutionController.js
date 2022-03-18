({
    doInit : function(component, event, helper) {
        try{
            component.set("v.showSpinner", true);
            helper.getCEInfo(helper, component, event, component.get("v.recordId"));
            helper.getUserName(component, event, helper);
        } catch(e){
            console.error(e);
        }
        
    },
    handleSave: function(component, event, helper) {
        component.set("v.showSpinner", true);
        var recordId = component.get('v.recordId');
        var executionname = component.find("name").get("v.value");
        var MandateType = component.find("MandateType").get("v.value");
        var status = component.find("status").get("v.value");
        var startDate = component.find("startDate").get("v.value");
        var endDate = component.find("endDate").get("v.value");
        var MBO = component.find("MBO").get("v.value");
        var Notes = component.find("Notes").get("v.value");
        var happyhr = component.find("happyhr").get("v.value");
        var ltobom = component.find("ltobom").get("v.value");
        var weekly = component.find("weekly").get("v.value");
        var adfeature = component.find("adfeature").get("v.value");
        var display = component.find("display").get("v.value");
        var event = component.find("event").get("v.value");
        var pos = component.find("pos").get("v.value");
        var other = component.find("other").get("v.value");
        var eft = component.find("eft").get("v.value");
        var costest = component.find("costest").get("v.value");
        
        if((other) && ($A.util.isEmpty(Notes))){
            helper.displayToast(component, $A.get("$Label.c.Error"), $A.get("$Label.c.BMC_CE_NotesOther_Validation"), 'slds-theme_error');
            component.set("v.showSpinner", false);
        }
        else{
            var action = component.get("c.checkandsave");
            
            action.setParams({ executionId: recordId ,
                              executionname: executionname ,
                              MandateType: MandateType ,
                              status: status ,
                              startDate: startDate ,
                              endDate: endDate ,
                              MBO: MBO ,
                              Notes: Notes ,
                              happyhr: happyhr ,
                              ltobom: ltobom ,
                              weekly: weekly ,
                              adfeature: adfeature ,
                              display: display ,
                              event: event ,
                              pos: pos ,
                              other: other ,
                              eft: eft ,
                              costest: costest });
            action.setCallback(this, function(a) {
                var state = a.getState();
                if (state === "SUCCESS") {
                    var chainActivity = a.getReturnValue();
                    component.set("v.chainActivity", a.getReturnValue());
                    helper.navigateToRecord(a.getReturnValue().Id);
                    component.set("v.showSpinner", false);
                    
                } else {
                    var errors = a.getError();
                    component.set("v.showSpinner", false);
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.error("Error message: " + 
                                          errors[0].message);
                        }
                        var errorMsg= action.getError()[0].message;
                        helper.displayToast(component, $A.get("$Label.c.Error"), errorMsg, 'error');
                    } else {
                        console.error("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);
        }
    },
    handleCancel : function(component, event, helper) {
        $A.get("e.force:closeQuickAction").fire();
    },
    handleSaveMandate: function(component, event, helper) {
        component.set("v.showSpinner", true);
        var recordId = component.get('v.recordId');
        var executionname = component.find("mname").get("v.value");
        var MandateType = component.find("mMandateType").get("v.value");
        var status = component.find("mstatus").get("v.value");
        var startDate = component.find("mstartDate").get("v.value");
        var endDate = component.find("mendDate").get("v.value");
        var Notes = component.find("mNotes").get("v.value");
        var MinProducts = component.find("mMinProducts").get("v.value");
        var SeasonalBg = component.find("mSeasonalBg").get("v.value");
        
        var action = component.get("c.checkAndSaveMandate");
        
        action.setParams({ executionId: recordId ,
                          executionname: executionname ,
                          MandateType: MandateType ,
                          status: status ,
                          startDate: startDate ,
                          endDate: endDate ,
                          Notes: Notes ,
                          MinProducts: MinProducts ,
                          SeasonalBg : SeasonalBg});
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                var chainActivity = a.getReturnValue();
                component.set("v.chainActivity", a.getReturnValue());
                helper.navigateToRecord(a.getReturnValue().Id);
                component.set("v.showSpinner", false);
            } else {
                var errors = a.getError();
                component.set("v.showSpinner", false);
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + 
                                      errors[0].message);
                    }
                    var errorMsg= action.getError()[0].message;
                    helper.displayToast(Component, $A.get("$Label.c.Error"), errorMsg, 'error');
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
        
    },
})