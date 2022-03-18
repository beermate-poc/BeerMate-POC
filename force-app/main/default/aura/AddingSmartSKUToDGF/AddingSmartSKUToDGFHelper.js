({
	getCalculator : function(component, event, helper) {
		var actionCall = component.get("c.getCalculator");
        let recordid = component.get("v.recordId"); 
        actionCall.setParams({calId:recordid});
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            
            $A.util.addClass(component.find("divspn") , "slds-hide");
                           
            if (stateValue === "SUCCESS") {
                //var resultInfo = response.getReturnValue() 
                //alert(result);
                var result = response.getReturnValue();  
                if(result){
                    component.set("v.calculatorRec",result);
                    if(result.SmartSKU_Projections__c && result.SmartSKU_Projections__c != null){
                        component.set("v.selectedSKUValue",result.SmartSKU_Projections__c);
                    }
                    if(result.Account__c){
                        helper.getSKUForAccount(component, event, result.Account__c,result.SmartSKU_Projections__c);
                    }else if(result.Distributor_Retail_Outlet__c){
                        helper.getSKUForDRO(component, event, result.Distributor_Retail_Outlet__c,result.SmartSKU_Projections__c);
                    }
                }else{
                   
                   $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                   component.set("v.ErrorMsg","Unable to fetch the record details from server. Please contact admin.");
                }
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg","Unable to fetch the record details from server. Please contact admin.");
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unable to fetch the record details from server. Please contact admin.",
                        "type": "error"
                        
                    });
                    toastEvent.fire();
                	
                	
            }
        });
        $A.enqueueAction(actionCall);
	},
    getSKUForAccount : function(component, event, accId,skuid) {
        $A.util.removeClass(component.find("divspn") , "slds-hide");
		var actionCall = component.get("c.getSKUsForAccount");
         
        actionCall.setParams({
            accId:accId,
            skuId:skuid
        });
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            
            $A.util.addClass(component.find("divspn") , "slds-hide");
                           
            if (stateValue === "SUCCESS") {
                //var resultInfo = response.getReturnValue() 
                
                var result = response.getReturnValue();
                //alert(JSON.stringify(result));
                if(result){
                    var optionList = component.get("v.options");
                    result.forEach(function itr(item){
                        //alert(item);
                        optionList.push(item);
                    });
                    component.set("v.options",optionList);
                    
                }else{
                   
                   
                }
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg","Unable to fetch the SKUs. Please contact admin.");
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unable to fetch the SKUs. Please contact admin.",
                        "type": "error"
                        
                    });
                    toastEvent.fire();
                	
                	
            }
        });
        $A.enqueueAction(actionCall);
	},
    getSKUForDRO : function(component, event, droId,skuid) {
        $A.util.removeClass(component.find("divspn") , "slds-hide");
		var actionCall = component.get("c.getSKUsForDRO");
        let recordid = component.get("v.recordId"); 
        actionCall.setParams({
            droId:droId,
            skuId:skuid
        });
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            
            $A.util.addClass(component.find("divspn") , "slds-hide");
                           
            if (stateValue === "SUCCESS") {
                //var resultInfo = response.getReturnValue() 
                //alert(result);
                var result = response.getReturnValue();  
                if(result){
                    var optionList = component.get("v.options");
                    result.forEach(function itr(item){
                        optionList.push(item);
                    });
                    component.set("v.options",optionList);
                }else{
                   
                }
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg","Unable to fetch the SKUs. Please contact admin.");
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unable to fetch the SKUs. Please contact admin.",
                        "type": "error"
                        
                    });
                    toastEvent.fire();
                	
                	
            }
        });
        $A.enqueueAction(actionCall);
	},
    saveChanges : function(component, event, helper) {
        let error = false;
        var selectedSkuId = component.get("v.selectedSKUValue");
        var calrec = component.get("v.calculatorRec");
        if(component.find("Units_per_Case").get("v.value") == "" || component.find("Units_per_Case").get("v.value") == null
          || component.find("Case_Cost").get("v.value") == "" || component.find("Case_Cost").get("v.value") == null || component.find("Listed_Retail_Price").get("v.value") == "" 
           || component.find("Listed_Retail_Price").get("v.value") == null || component.find("CE_s_90_Days").get("v.value") == "" || component.find("CE_s_90_Days").get("v.value") == null
          ){
            	$A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg",$A.get("$Label.c.Required_Field_Missing"));
            	$A.util.addClass(component.find("divspn") , "slds-hide");
            	return;
        }
        calrec.SmartSKU_Projections__c = selectedSkuId;
        calrec.Units_per_Case__c = component.find("Units_per_Case").get("v.value");
        calrec.Case_Cost__c = component.find("Case_Cost").get("v.value");
        calrec.Listed_Retail_Price__c = component.find("Listed_Retail_Price").get("v.value");
        calrec.CE_s_90_Days__c = component.find("CE_s_90_Days").get("v.value");
        var actionCall = component.get("c.saveCalculator");
        
        actionCall.setParams({
            cal:calrec            
        });
        actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            
            $A.util.addClass(component.find("divspn") , "slds-hide");
                           
            if (stateValue === "SUCCESS") {
                if(response.getReturnValue() == "Success"){
                    $A.get("e.force:closeQuickAction").fire();
        			$A.get('e.force:refreshView').fire();
                }else{
                   $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                    component.set("v.ErrorMsg",response.getReturnValue()+". Please contact admin.");
                    var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                        "title": "Error!",
                        "message": response.getReturnValue()+". Please contact admin.",
                        "type": "error"
                        
                    });
                    toastEvent.fire();
                    $A.get("e.force:closeQuickAction").fire();
        			$A.get('e.force:refreshView').fire();
                }
                
            }else{
                $A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
        		component.set("v.ErrorMsg","Unknown Error Occured on Save. Please contact admin.");
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "message": "Unknown Error Occured on Save. Please contact admin.",
                        "type": "error"
                        
                    });
                    toastEvent.fire();
                	
                	
            }
        });
        $A.enqueueAction(actionCall);
    }
})