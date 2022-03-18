({
    /*------------------------------------------------------------
    Author:        Gopal
    Company:       Accenture
    Description:   Sets view values on form if planned objective select is changed

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/17/2017    Brian Mansfield       Initial Creation
    07/09/2018    Gopal	        MC-1707 - Replaced Sub Type from Planned Objective object with Sub Type from Objective
    ------------------------------------------------------------
    setFormFieldsFromTemplate : function(component, template) {
        try{
            var emptyArray = [];
            if(template != null){
                var brandSearch = component.find("brandSearch");
                var offPrem = component.get("v.placeIsOffPremise");
                var brandName = template.Brand_Name__c.trim();
                component.find("brandSearch").set("v.searchValue", template.Brand_Name__c);
                component.find("placeQty").set("v.value", template.Product_Quantity__c);
                if(brandSearch.get('v.searchValue')){
                    if(brandSearch.get('v.showPkg')){
                        brandSearch.set("v.selectedPkgId", template.MC_Product__c);
                        if (offPrem) {
                            var actionCall = component.get('c.retrievePackageOffPremise');
                        } else {
                            var actionCall = component.get('c.retrievePackage');
                        }
                        var a = actionCall.setParams({brandName : brandName, selectedPkgId : template.MC_Product__c});
                        actionCall.setCallback(this,function(response){
                            if(response.getState() == "SUCCESS"){
                                if (response.getReturnValue().length > 0){
                                    var results = response.getReturnValue().map(function(property) {
                                        return JSON.parse(property);
                                    });
                                    brandSearch.set("v.isDisablePkg", false);
                                    brandSearch.set("v.packages", results);
                                } else {
                                    brandSearch.set("v.isDisablePkg", true);
                                    brandSearch.set("v.packages", []);
                                }
                            } else if (response.getState() === "ERROR"){
                                var errors = data.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        
                                    }
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                    }
                                } else {
                                }
                            }
                        });
                        $A.enqueueAction(actionCall);
                    }
                }
                if(template.Planned_Objective__c != null && template.Planned_Objective__c != ''){
                    if(template.Sub_Type__c != null && template.Sub_Type__c != ''){
                        if(template.Sub_Type__r.Sub_Type_Values__c != null && template.Sub_Type__r.Sub_Type_Values__c != ''){
                            var subTypes = template.Sub_Type__r.Sub_Type_Values__c.split(",").map(function(item) {
                                return item.trim();
                            });
                            component.set("v.subTypeValues", subTypes);
                            // MC:1701- Subtypes should be added on objectives instead of planned objectives
                            component.set("v.subType",template.Sub_Type__c);
                        }
                    } else {
                        component.set("v.subTypeValues", emptyArray);
                        // MC:1701- Subtypes should be added on objectives instead of planned objectives
                        component.set("v.subType","");
                    }
                }
            } else {
                component.set("v.selectedSubType", "");
                // MC:1701- Subtypes should be added on objectives instead of planned objectives
                component.set("v.subType","");
                component.set("v.subTypeValues", emptyArray);
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },*/
    /*------------------------------------------------------------
    Author:       Gopal
    Company:       Accenture
    Description:   displays toast on desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    07/09/2017    Gopal     	Initial Creation
    ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toastMsg) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['Duration'] = duration
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            }
        } catch(e){
        }
    },
    /*------------------------------------------------------------
    Author:       Gopal
    Company:       Accenture
    Description:   displays toast on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    07/09/2017    Gopal     	Initial Creation
    ------------------------------------------------------------*/
    displayToastMobile: function(component, title, message, type){
        try{
            component.set("v.showErrorToast", true);
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showErrorToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
        }
    },
    newPlacementObjective : function(component, event, helper){
        try{
            var porjectedDays=component.get("v.smartSkuOpp").Projected90Days__c;
            if(navigator.onLine){
                var actionCall = component.get("c.createNewObjective");
                actionCall.setParams({accountId : component.get("v.recordId"),
                                      objPlacement: component.get("v.newObjective"),
                                      productId: component.get("v.ProductId"),
                                      brandName:component.find("brandval").get("v.value"),
                                      packageval: component.get("v.selectedPkg"),
                                      callogId: component.get("v.callogId"),
                                      premise : component.get("v.isOffPrem")
                                     });
                actionCall.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        if(response.getReturnValue()==="Success"){
                            component.set("v.refreshObj", true);
                            component.set("v.showCreateObj", false);
                            this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.BMC_GSNewObjectiveMessage"), 'success');
                        }  else if(response.getReturnValue() === "Duplicate"){
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_GSDuplicateFound"), 'warning');
                        }
                    } else if (response.getState() === "ERROR") {
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                            }
                            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {}
                    }
                });
                $A.enqueueAction(actionCall);
            }else {
                if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e) {
            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    fetchPackage : function(component, event, helper){
        try{
            if(navigator.onLine){
                //if($A.util.isEmpty(component.get("v.smartSkuOpp").Brand__c) && component.get("v.objectName")==$A.get("$Label.c.BMC_GSSKUObjectName")){
                var brandValue = '';
                if(component.get("v.isOffPrem")){
                    brandValue =  component.get("v.smartSkuOpp").Brand__c;
                    var actionCall = component.get("c.getPackage");
                    actionCall.setParams({brandName : brandValue, premise : component.get("v.isOffPrem")});
                }else{
                    if(component.get("v.smartSkuOpp").Brand_Package__c.includes("-")){
                        brandValue =  component.get("v.smartSkuOpp").Brand_Package__c.substring(0, component.get("v.smartSkuOpp").Brand_Package__c.indexOf("-")).trim();
                    }
                    var actionCall = component.get("c.getPackage");
                    actionCall.setParams({brandName : brandValue, premise : component.get("v.isOffPrem")});
                }
                actionCall.setCallback(this, function(response) {
                    if (response.getReturnValue().length > 0) {
                        var results = response.getReturnValue().map(function(property) {
                            return JSON.parse(property);
                        });
                        component.set('v.packages', results);
                        component.find("brandval").set("v.value", brandValue);
                    }else if (response.getState() === "ERROR") {
                        var errorsVal = response.getError();
                        if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                                
                            }
                            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            
                        }
                    }
                });
                $A.enqueueAction(actionCall);
                // } 
                if(!$A.util.isEmpty(component.get("v.chainMandate").Brand_Package__c) && component.get("v.objectName")===$A.get("$Label.c.BMC_GSChainObjectName")){
                    if(component.get("v.isOffPrem")){
                        var actionCall = component.get("c.getPackage");
                        actionCall.setParams({brandName : component.get("v.chainMandate").MC_Product__c, premise : component.get("v.isOffPrem")});
                    }else{
                        var brandValue =  component.get("v.chainMandate").TradeMarkBrandLongNme__c;
                        var actionCall = component.get("c.getPackage");
                        actionCall.setParams({brandName : brandValue, premise : component.get("v.isOffPrem")});
                    }
                    actionCall.setCallback(this, function(response) {
                        if (response.getReturnValue().length > 0) {
                            var results = response.getReturnValue().map(function(property) {
                                return JSON.parse(property);
                            });
                            component.set('v.packages', results);
                            component.find("brandval").set("v.value", brandValue);
                        } else if (response.getState() === "ERROR") {
                            var errorsVal = response.getError();
                            if (errorsVal) {
                                if (errorsVal[0] && errorsVal[0].message) {
                                    
                                }
                                if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                } else {
                                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                }
                            } else {
                            }
                        }
                    });
                    $A.enqueueAction(actionCall);
                }
            }  else {
                if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        }catch(e) {
            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Gopal Neeluru
    Company:       Accenture
    Description:   sets date picker on change of the status
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    07/09/2018   Gopal			     Initial Creation
    ------------------------------------------------------------*/
    statusChange : function(component, event, helper) {
        try{
            if (component.find("statusSelectOptions").get("v.value") === "Committed") {
                if(navigator.onLine){
                    var actionCall = component.get("c.getTodayPlusSevenDays");
                    actionCall.setCallback(this, function(response) {
                        if (response.getState() === "SUCCESS") {
                            component.find("dt").set("v.value", response.getReturnValue());
                        } else if (response.getState() === "ERROR") {
                            var errOrs = response.getError();
                            if (errOrs) {
                                if (errOrs[0] && errOrs[0].message) {
                                    
                                }
                                if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                } else {
                                    this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                }
                            } else {
                            }
                        }
                    });
                    $A.enqueueAction(actionCall);
                } else {
                    if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                    } else {
                        this.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                    }
                }
            }
        } catch(e) {
            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
})