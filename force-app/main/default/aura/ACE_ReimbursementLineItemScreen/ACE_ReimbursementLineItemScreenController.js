({
    /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:   Method to initialize Spend Category values for Reimbursement Line Item
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/05/2018  Larry A. Cardenas     Initial Creation
    11/27/2018  Alexandria Sanborn    Fix error handling logic bug
    ------------------------------------------------------------*/  
    doInit : function(component, event, helper) {
        try{
            var SpendCategory= component.get("c.getSpendCategoryValues");
            var taxPaid = component.get("c.getTaxPaidValues");
            var lineIndex = component.get("c.getLineItemIndex");


            SpendCategory.setCallback(this, function(a) {
                if(a.getState() === "SUCCESS"){
                    var Category = a.getReturnValue();
                    component.set("v.spendCategory", Category);
                } else {
                    var errorsVal = a.getError();
                    if (errorsVal) {
                        if (errorsVal[0] && errorsVal[0].message) {
                        }
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    }
                }

            });
            $A.enqueueAction(SpendCategory);

            taxPaid.setCallback(this, function(a) {
                if(a.getState() === "SUCCESS"){
                    var tax = a.getReturnValue();
                    component.set("v.Taxpaid", tax);
                } else {
                    var errorsVal = a.getError();
                    if (errorsVal) {
                        if (errorsVal[0] && errorsVal[0].message) {
                        }
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    }
                }

            });
            $A.enqueueAction(taxPaid);

            lineIndex.setParams({reimbursementId : component.get("v.recordId")});
            lineIndex.setCallback(this, function(a) {
                if(a.getState() === "SUCCESS"){
                    var idx = a.getReturnValue();
                    component.set("v.lineIdx", idx);
                } else {
                    var errorsVal = a.getError();
                    if (errorsVal) {
                        if (errorsVal[0] && errorsVal[0].message) {
                        }
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    }
                }

            });
            $A.enqueueAction(lineIndex);
        } catch(e){
            
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    
    /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:   Method to cancel Reimbursement Line Item
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/05/2018  Larry A. Cardenas     Initial Creation
    ------------------------------------------------------------*/      
    cancelModal:function(component,event,helper){
        helper.cancelModal(component,event,helper);
    },
    /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:   Method for saving the created Line Item
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Larry A. Cardenas     Initial Creation
    ------------------------------------------------------------*/
    saveReimbursLineItem:function(component,event,helper){
        try{
            if(!$A.util.isEmpty(component.find("category").get("v.value"))){
                component.set('v.newLineItem.ACE_Spend_Category__c',component.find("category").get("v.value"));
            }

            if(!$A.util.isEmpty(component.find("tax").get("v.value"))){
                component.set('v.newLineItem.ACE_Tax_Pd__c',component.find("tax").get("v.value"));
            }

            var validLineItem = true;
            var expenditureCmp = component.find("totalExpenditure");
            var expenditureValue = component.find("totalExpenditure").get("v.value");
            var errorMsg = 'Please enter in a value for ';
			 if(expenditureValue <= 0 &&  expenditureValue) {
                expenditureCmp.setCustomValidity("The expenditure amount cannot be zero or a negative number");
                validLineItem = false;
                errorMsg += " Total Expenditure ";
            }
            else {
                expenditureCmp.setCustomValidity("");
            }
            expenditureCmp.reportValidity();
            
            if($A.util.isUndefinedOrNull(component.find("name").get("v.value")) || $A.util.isEmpty(component.find("name").get("v.value"))){
                validLineItem = false;
                errorMsg += " Name ";
            }
            if($A.util.isUndefinedOrNull(component.find("category").get("v.value")) || $A.util.isEmpty(component.find("category").get("v.value"))){
                validLineItem = false;
                errorMsg += " Spend Category ";
            }
            if($A.util.isUndefinedOrNull(component.find("totalExpenditure").get("v.value")) || $A.util.isEmpty(component.find("totalExpenditure").get("v.value"))){
                validLineItem = false;
                errorMsg += " Total Expenditure ";
            }
            if($A.util.isUndefinedOrNull(component.find("tax").get("v.value")) || $A.util.isEmpty(component.find("tax").get("v.value"))){
                validLineItem = false;
                errorMsg += " Tax Paid ";
            }
            if ($A.util.isUndefinedOrNull(component.find("vendorsUsed").get("v.value"))|| $A.util.isEmpty(component.find("vendorsUsed").get("v.value"))){
                validLineItem = false;
                errorMsg += " Vendors Used ";
            }

            if(validLineItem){
                helper.createNewLineItemServerCall(component,event,helper);
            } else {
                component.set("v.showSuccess", false);
                component.set("v.showErrorToast", true);
                component.set("v.toastMsg", errorMsg);
            }
        } catch(e){
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){

                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                helper.displayToastMobile(component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    setLineItem : function(component,event,helper){
        component.set("v.newLineItem.ACE_Line_Item_ID__c",component.get("v.LineItem"));
    },
        //Call by aura:waiting event  
    handleShowSpinner: function(component, event, helper) {
        component.set("v.isSpinner", true); 
    },
     
    //Call by aura:doneWaiting event 
    handleHideSpinner : function(component,event,helper){
        component.set("v.isSpinner", false);
    }
})