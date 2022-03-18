({
    /**
   @Author Accenture
   @name getAccountInfo
   @Description Function to retrieve current Chain Execution details and Seasonal Brand Group names.
  */    
    getAccountInfo : function(component , event) {
        try{
            if(navigator.onLine){
                var actionAccount=component.get("c.getAccountDetails");
                actionAccount.setParams({recordId: component.get("v.recordId")}); 
                actionAccount.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var chainActivityobj = response.getReturnValue(); 
                        if(chainActivityobj.chainActivity.BMC_Status__c===$A.get("$Label.c.BMC_CACancelled")){
                            component.set("v.addproduct", false); 
                        }
                        else if((chainActivityobj.chainActivity.BMC_Mandate_Type__c === "Seasonal") && (chainActivityobj.chainActivity.BMC_Seasonal_Brand_Group__c != null)){
                             component.set("v.addproduct", false); 
                             component.set("v.addproductsgn", true); 
                        }
                         if(chainActivityobj.chainActivity.BMC_Parent_Premise_Type__c === $A.get("$Label.c.BMC_CA_OffPremiseType")) {
                            component.set("v.isoffprem", true);                         
                        }
                            else {                             
                                component.set("v.isoffprem", false);                            
                            }  
                        if(chainActivityobj.chainActivity.BMC_Mandate_Type__c === "Seasonal"){
                            component.set("v.showseasonalbrandname", true);
                            component.set("v.showbrand", false);
                            component.set("v.sgnlist", chainActivityobj.seasonalGroupList);
                            
                        }
                        else{
                            component.set("v.showseasonalbrandname", false);
                            component.set("v.showbrand", true);
                        }
                        
                    } else if (response.getState() === "ERROR") {
                        this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
                    }
                });
                $A.enqueueAction(actionAccount);  
                
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    goToRecordDetailPage: function(component , event) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "detail",
            "isredirect": false
        });
        navEvt.fire();
    },
   
    /**
   @Author Accenture
   @name insertProduct
   @Description Function to create Chain Execution Product.
  */
    insertProduct : function(component , event) {
        try{
            if(navigator.onLine){ 
                var brand= component.find("brandSearch").get("v.searchValue");  
                var brandSearch =component.find("brandSearch").find("selectOptions").get("v.value");
                if($A.util.isEmpty(brand) || $A.util.isEmpty(brandSearch)){
                    this.displayToastMob (component , $A.get("$Label.c.Error") , $A.get("$Label.c.BMC_ProductError") , 'slds-theme_error'); 
                    component.set("v.showspinner" , false);
                }
                else{
                    var acctionauditProducts=component.get("c.createChainProducts");
                    acctionauditProducts.setParams({recordId: component.get("v.recordId"), 
                                                    brandValue:brand,
                                                    selectedPkgId:brandSearch});        
                    acctionauditProducts.setCallback(this, function(response) {
                        component.set("v.showspinner", false);
                        if (response.getState() === "SUCCESS") {
                            
                            this.displayToastMob(component , $A.get("$Label.c.Success") ,  $A.get("$Label.c.BMC_CA_ProductAdded") , 'slds-theme_success');
                            var buttonPressed=event.getSource().get("v.name");
                            if(buttonPressed === $A.get("$Label.c.BMC_Save_Close")){
                                this.goToRecordDetailPage(component , event);
                            }
                            
                            component.find("brandSearch").set("v.searchValue" , "");
                            component.find("brandSearch").find("selectOptions").set('v.value' , "");
                           
     
                        } else if (response.getState() === "ERROR") {
                            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                        }
                    });
                    $A.enqueueAction(acctionauditProducts);
                    $A.get('e.force:refreshView').fire();
                }
            } else {
                this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
            }
        } catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    },
    /**
   @Author Accenture
   @name displayToastMob
   @Description Function to display toast.
  */ 
    displayToastMob: function(component, title, message, type){
        try{
            component.set("v.showerrortoast", true);
            component.set("v.toasttype", type);
            component.set("v.toasttitle", title);
            component.set("v.toastmsg", message);
            setTimeout(function(){
                component.set("v.showerrortoast", false);
                component.set("v.toasttitle", "");
                component.set("v.toasttype", "");
                component.set("v.toastmsg", "");
            }, 3000);
        } catch(e){
            system.debug(e);
        }
    }
    
})