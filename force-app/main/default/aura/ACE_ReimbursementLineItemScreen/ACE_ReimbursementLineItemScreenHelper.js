({
    
    cancelModal : function(component,event,helper) {
        window.location.reload();
        if($A.get("$Browser.formFactor") == "DESKTOP"){
            component.set("v.showCreateLineItem ", false);
        } else {
            component.set("v.showCreateLineItem ",false);
        }
        
    },
    /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:  Method to Create New Line Item
    History
    <Date>      <Authors Name>     <Brief Description of Change>
   11/05/2018    Larry A. Cardenas     Initial Creation
    ------------------------------------------------------------*/
    createNewLineItemServerCall : function(component,event,helper) {

    if(navigator.onLine) {
        var lineItemAction = component.get("c.createLineItemServer");
        lineItemAction.setParams({
            PartnerFundClaimId: component.get("v.recordId"),
            titleStr: component.get("v.newLineItem.Title"),
            LineItem: "True",
            SpendVal: component.get("v.newLineItem.ACE_Spend_Category__c"),
            TaxPaid: component.get("v.newLineItem.ACE_Tax_Pd__c"),
            VendorsUsed: component.get("v.newLineItem.ACE_Vendors_Used__c"),
            Comments: component.get("v.newLineItem.ACE_Comments__c"),
            TotalExp: component.get("v.newLineItem.ACE_Total_Expenditure__c"),
            lineIdxStr: component.get("v.lineIdx").toString()
        });


        lineItemAction.setCallback(this, function (response) {
            var stateVal = response.getState();
            if (stateVal == "SUCCESS") {
                // this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.ACE_LineItemCreated"), 'success');
               // component.set("v.newLineItem", "");
                component.set("v.newLineItem.Title", "");
                component.set("v.newLineItem.ACE_Spend_Category__c", "");
                component.set("v.newLineItem.ACE_Tax_Pd__c", "");
                component.set("v.newLineItem.ACE_Vendors_Used__c", "");
                component.set("v.newLineItem.ACE_Comments__c", "");
                component.set("v.newLineItem.ACE_Total_Expenditure__c", "");
                component.find("category").set("v.value",'');
                component.find("tax").set("v.value",'');
                component.set("v.showSuccess", true);
                component.set("v.showErrorToast", false);
                component.set("v.lineIdx", component.get("v.lineIdx")+1);
            } else {
                var errorsVal = response.getError();
                if (errorsVal) {
                    component.set("v.showSuccess", false);
                    component.set("v.showErrorToast", true);

                    //component.set("v.toastMsg", $A.get("$Label.c.An_unexpected_error_occurred"));
                }
            }
        });

        $A.enqueueAction(lineItemAction);
    }
    },
    /*------------------------------------------------------------
    Author:        Larry A. Cardenas
    Company:       Accenture
    Description:   Method for Display Toast on Desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    11/10/2018    Larry A. Cardenas     Initial Creation
    ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toast
            
            if (toastMsg) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    title: title,
                    message: message,
                    type: type
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
        } catch(e){
            
        }
    },
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
            console.error(e);
        }
    }
    
})