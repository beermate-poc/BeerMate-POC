({
    /**
   @Author Accenture
   @name doInit
   @Description Function to retrieve current Chain Execution details and Seasonal Brand Group names.
  */
    doInit : function(component, event, helper) {
        
        helper.getAccountInfo(component , event);

    },
     /**
   @Author Accenture
   @name productSelection
   @Description Function that redirects to Add a Seasonal Product.
  */
    productSelection : function(component, event, helper) {
	component.set("v.addproduct", true);
    },
    /**
   @Author Accenture
   @name gobcktoRcrdpage
   @Description Function that redirects to Current Chain Execution record details page.
  */
    gobcktoRcrdpage: function(component, event, helper) {
        helper.goToRecordDetailPage(component , event);
    },
    /**
   @Author Accenture
   @name saveProduct
   @Description Function to create Chain Execution Product.
  */
    saveProduct : function(component, event, helper) {
        component.set("v.showspinner", true);
        helper.insertProduct(component , event);
    },
    /**
   @Author Accenture
   @name onChangesgn
   @Description Function to get package names.
  */
    onChangesgn : function(component, event, helper) {
        component.set("v.isdisablepkg", false);
        var actionPackage = component.get("c.getPackageNames"); 
        actionPackage.setParams({
            "seasonalBrandGroupName" : component.get('v.selectedsgn') ,
            "isOffPremise":component.get("v.isoffprem")
        });
        actionPackage.setCallback(this, function(a){
            var state = a.getState(); 
            if(state === 'SUCCESS') {
                component.set('v.packages', a.getReturnValue());
            }
        });
        $A.enqueueAction(actionPackage);
    },
    
    
    
  /**
   @Author Accenture
   @name savecaProduct
   @Description Function to create Chain Execution Products for Seasonal Mandates.
  */
    savecaProduct : function(component, event, helper) {

        try{
            if(navigator.onLine){
                var seasonalName = component.find("seasonalGroupName").get("v.value");
                var packageValues=component.find("packageValue").get("v.value");
                if($A.util.isEmpty(seasonalName) ||
                   seasonalName === $A.get("$Label.c.BMC_SelectSeasonalGroupName")){
                    helper.displayToastMob (component , $A.get("$Label.c.Error") , $A.get("$Label.c.BMC_SGNError") , 'slds-theme_error'); 
                    component.set("v.showspinner" , false);
                }
                else if($A.util.isEmpty(packageValues) ||
                        packageValues === $A.get("$Label.c.BMC_SelectSeasonalGroupName")){
                    helper.displayToastMob (component , $A.get("$Label.c.Error") , $A.get("$Label.c.BMC_packageError") , 'slds-theme_error'); 
                    component.set("v.showspinner" , false);
                }
      
                    else{
                        component.set("v.showspinner", true);
        				var whichButton=event.getSource().get("v.name");
                        var actionProduct = component.get("c.insertCAProduct"); 
                        actionProduct.setParams({
                            "seasonalBrandGroupName" : component.get('v.selectedsgn') ,
                            "recordID":component.get("v.recordId") ,
                            "packageName" :component.get("v.selectedpkg") ,
                            "isOffPremise":component.get("v.isoffprem")
                        });
                        actionProduct.setCallback(this , function(a){
                            var state = a.getState(); 
                            component.set("v.showspinner", false);
                        	if(state === "SUCCESS")
                            {
                                helper.displayToastMob(component , $A.get("$Label.c.Success") ,  $A.get("$Label.c.BMC_CA_ProductAdded") , 'slds-theme_success');
                                if(whichButton === $A.get("$Label.c.BMC_AddAnother"))
                                {
                                    component.set('v.selectedsgn' , '');
                                    component.set('v.selectedpkg' , '');
                                }
                                else
                                {
                                    var recordId=component.get("v.recordId")
                                    window.parent.location = '/' + recordId;
                                }
                            }  
                            else
                                helper.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
                            });
                        $A.enqueueAction(actionProduct);
                    } } else 
                        this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');             
        }
        catch(e){
            this.displayToastMob (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');           
        }
    }
})