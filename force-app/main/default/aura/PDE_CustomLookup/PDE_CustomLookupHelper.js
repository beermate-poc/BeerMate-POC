({
    /**
   @Author Accenture
   @name searchHelper
   @CreateDate  11/12/2018
   @Description Function searches result for searchkeyword.
  */
    searchHelper : function(component, event, getInputkeyWord) {
        // call the apex class method 
        var acTion = component.get("c.fetchLookUpValues");
        // set param to method  
         //alert(component.get("v.chainPartnerId"));
        acTion.setParams({
            'searchKeyWord': getInputkeyWord,
            'ObjectName' : component.get("v.objectAPIName"),
            'recordId':component.get("v.recordId"),
            'channelid':component.get("v.chainPartnerId")
           
        });
        // set a callBack    
        acTion.setCallback(this, function(response) {
            $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var stAte = response.getState();
            if (stAte === "SUCCESS") {
              
                var storeResponse = response.getReturnValue();
                // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length > 0) {
                     component.set("v.message", '');
                    if((storeResponse.length === 1)&&(component.get("v.scanPage") === true)){
                        component.set("v.brandPackId", storeResponse[0].Id);
                        component.set("v.brandPackname", storeResponse[0].BMC_Brand_Package_Audit_Pack__c);
                        if(component.get("v.isOffPrem") === true){
                            if(storeResponse[0].BMC_Brand_Package__r.BMC_Tertiary_UPC_Case_Unit__c ===  getInputkeyWord  )
                                component.set("v.initUom", "Case (Outer Pack)");
                            else if(storeResponse[0].BMC_Brand_Package__r.BMC_Secondary_UPC_Retail_Unit__c  ===  getInputkeyWord  )
                                component.set("v.initUom", "Retail Unit (Inner Pack)");
                                else if(storeResponse[0].BMC_Brand_Package__r.BMC_Primary_UPC_Short_Container__c ===  getInputkeyWord || storeResponse[0].BMC_Brand_Package__r.BMC_Primary_UPC_Container__c ==  getInputkeyWord )
                                    component.set("v.initUom", "Single");
                                    else
                                        component.set("v.initUom", "Keg");
                        }
                        else{
                            if(storeResponse[0].BMC_Brand_Package__r.ContainerTypeCd__c === "KEG") {
                                component.set("v.initUom", "Keg");
                            }
                            else{
                                component.set("v.initUom", "Single");
                            }
                        }
                        component.set("v.showAudit", true);
                        var forClose = component.find("searchRes");
                        $A.util.addClass(forClose, 'slds-is-close');
                        $A.util.removeClass(forClose, 'slds-is-open');
                    }
                    else{
                        component.set("v.listOfSearchRecords", storeResponse);
                    }
                } 
                else if (storeResponse.length === 0) {
                    
                    if(component.get("v.scanPage") === true){
                        component.set("v.openAddPackage", true);                                               
                        component.set("v.resultFound", false);
                    }
                    component.set("v.message", 'No Result Found...');
                }
                    else{
                        component.set("v.message", '');
                    }
                if(component.get("v.scanPage") === true){
                    component.set("v.saveAndScan", true);
                    component.set("v.showSpinner", false);
                }
            }
        });
        // enqueue the Action  
        $A.enqueueAction(acTion);
    },
})