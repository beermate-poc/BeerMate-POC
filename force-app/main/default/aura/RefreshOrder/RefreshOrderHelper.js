({
	validateRefresh : function(component, event, helper) {
        debugger;
        var action= component.get("c.isRefreshOrder"); //line item type picklist
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            $A.log(response);
            if(state === "SUCCESS"){
                var result =response.getReturnValue();
                if(result.C360_Sales_Channel__c!="" && result.C360_Sales_Channel__c != "Beermate"){
                   component.set("v.ErrorMsg",$A.get("$Label.c.Beermate_Order_Error_msg"));
                   component.set("v.norefreshopen",true);
                }
                else if((result.Status =="Submitted"||result.Status =="Edit in Progress") && result.C360_SAP_Order_ID__c !=""&&result.C360_SAP_Order_ID__c !=undefined)
                {
                    helper.refresh(component, event, helper);
                }
                else
                {
                   component.set("v.ErrorMsg",$A.get("$Label.c.Refresh_Order_Error_Mesg"));
                   component.set("v.norefreshopen",true);
                }
                
            }
        });
        $A.enqueueAction(action);
		
	},
    refresh : function(component, event, helper) {
		debugger;
        var action= component.get("c.refreshOrders"); //line item type picklist
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            $A.log(response);
            if(state === "SUCCESS"){
                var result =response.getReturnValue();
                if(result == 'Success!')
                {
                   component.set("v.ErrorMsg", $A.get("$Label.c.Refresh_Order_Succes_Mesg"));
                }
                else
                {
                    component.set("v.ErrorMsg",result);
                }
                component.set("v.norefreshopen",true);
                   
            }
        });
        $A.enqueueAction(action);
	}
})