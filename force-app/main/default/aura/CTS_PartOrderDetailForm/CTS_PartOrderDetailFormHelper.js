({
	setDatatableValues : function(component, event, helper) {
      	var action1 = component.get("c.getPartOrderLineItems");
        var prodReq = component.get("v.recordId");
        action1.setParams({"productId":prodReq})
        action1.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //console.log(response.getReturnValue());  {label: 'WOL Reference', fieldName: 'CTS_Related_Technician_Tasks__c', type: 'action',editable: false},// <-- Works as expected...                
                component.set("v.data", response.getReturnValue());
                var cols = [
                   
                    {label: 'Quantity', fieldName: 'QuantityRequested', type: 'number',editable: true,initialWidth:115},
                    {label: 'Required', fieldName: 'CTS_Required__c', type: 'boolean',editable: true,initialWidth: 115},
                    
                    {type: "button", typeAttributes: {
                        label: 'View Task',
                        name: 'View',
                        title: 'View',
                        disabled: false,
                        value: 'view',
                        iconPosition: 'left',
                        variant: 'Base'
                    },initialWidth: 100},
                    {label: 'Product', fieldName: 'CTS_Product_Required_Info__c', type: 'text',editable: false}
                ];
                component.set("v.columns", cols);
            }
        }));
        $A.enqueueAction(action1);  
    },
    retrivePartOrderDetails : function(component, event, helper)
    {
    	var action = component.get("c.getPartOrderDetail");
        //alert("recordId----"+component.get("v.recordId"));
        action.setParams({partOrderId : component.get("v.recordId")});
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state == "SUCCESS"){
                var partOrderRec = response.getReturnValue();
                //alert(partOrderRec);
                component.set("v.editPartOrder",partOrderRec);
                if(!$A.util.isEmpty(partOrderRec.CTS_TR__c) || !$A.util.isUndefined(partOrderRec.CTS_TR__c))
                    {
                        component.set("v.editPartOrder.CTS_TR__c",partOrderRec.CTS_TR__c);
                		component.set("v.TRName",partOrderRec.CTS_TR__r.Name);
                        $A.util.removeClass(component.find("divtag1TR"), "slds-hide");
                        $A.util.addClass(component.find("divtag2TR"), "slds-hide");
                    }
                if(!$A.util.isEmpty(partOrderRec.CTS_Service_Appointment__c) || !$A.util.isUndefined(partOrderRec.CTS_Service_Appointment__c))
                    {
                        component.set("v.editPartOrder.CTS_Service_Appointment__c",partOrderRec.CTS_Service_Appointment__c);
                		component.set("v.SANumber",partOrderRec.CTS_Service_Appointment__r.AppointmentNumber);
                        $A.util.removeClass(component.find("divtag1SA"), "slds-hide");
                        $A.util.addClass(component.find("divtag2SA"), "slds-hide");
                    }
                
                
                component.set("v.editPartOrder.Description",partOrderRec.Description);
                component.set("v.editPartOrder.Status",partOrderRec.Status);
                component.set("v.editPartOrder.CTS_Delivery_Method__c",partOrderRec.CTS_Delivery_Method__c);
                component.set("v.editPartOrder.CTS_Requested_Delivery_Date__c",partOrderRec.CTS_Requested_Delivery_Date__c);
                component.set("v.editPartOrder.CTS_Address_Line_1__c",partOrderRec.CTS_Address_Line_1__c);
                component.set("v.editPartOrder.CTS_Town_or_Ctiy__c",partOrderRec.CTS_Town_or_Ctiy__c);
                component.set("v.editPartOrder.CTS_Postal_Code__c",partOrderRec.CTS_Postal_Code__c);
                component.set("v.editPartOrder.CTS_Country_Code__c",partOrderRec.CTS_Country_Code__c);
                component.set("v.editPartOrder.CTS_Add_Alternate_Address__c",partOrderRec.CTS_Add_Alternate_Address__c);
                component.set("v.editPartOrder.CTS_Alternate_Address__c",partOrderRec.CTS_Alternate_Address__c);
                component.set("v.editPartOrder.CTS_Alternate_Address_City__c",partOrderRec.CTS_Alternate_Address_City__c);
                component.set("v.editPartOrder.CTS_Alternate_Address_State__c",partOrderRec.CTS_Alternate_Address_State__c);
                component.set("v.editPartOrder.CTS_Alternate_Zip_Postal_Code__c",partOrderRec.CTS_Alternate_Zip_Postal_Code__c);
                component.set("v.editPartOrder.CTS_Alternate_Country__c",partOrderRec.CTS_Alternate_Country__c);
                component.set("v.editPartOrder.CTS_Order_Date__c",partOrderRec.CTS_Order_Date__c);
                component.set("v.editPartOrder.CTS_Part_Authorisation_Warning__c",partOrderRec.CTS_Part_Authorisation_Warning__c);
                component.set("v.editPartOrder.CTS_Parts_Cost__c",partOrderRec.CTS_Parts_Cost__c);
                
                helper.setDatatableValues(component, event, helper);
                $A.get('e.force:refreshView').fire();
            }
        });

        $A.enqueueAction(action);
	}
})