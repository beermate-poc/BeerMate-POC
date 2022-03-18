({
   /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:  method to load initial data
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    doInit : function(component, event, helper) {
      	component.set("v.newObjective.Name",component.get("v.objectName"));
        component.find("statusSelectOptions").set("v.value","Committed"); 
        if(!component.get("v.isOffPrem")){
          component.set("v.newObjective.Objectives_Premise_Type__c","On-Premise");  
        }else{
            component.set("v.newObjective.Objectives_Premise_Type__c","Off-Premise");  
        }
        helper.fetchPackage(component, event, helper);
 		helper.statusChange(component, event, helper);
    },
	closeModal : function(component, event, helper) {
		component.set("v.showCreateObj",false);
	},
    createPlacementObj : function(component, event, helper) {
        if($A.util.isEmpty(component.get("v.selectedPkg")) ||$A.util.isEmpty(component.find("selectOptions").get("v.value")) || $A.util.isEmpty(component.find("objectiveName").get("v.value")) ||
          	$A.util.isEmpty(component.find("placeQty").get("v.value")) || component.find("placeQty").get("v.value") == 0 || (component.find("dt").get("v.value") == null && component.find("statusSelectOptions").get("v.value") == 'Committed')){
            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                helper.displayToast($A.get("$Label.c.Error"),'Please fill all Mandatory fields', 'error');
            }
            else 
            {
              helper.displayToastMobile(component,$A.get("$Label.c.Error"),'Please fill all Mandatory fields', 'slds-theme_error');   
            }
           
        }
      
        else{
           helper.newPlacementObjective(component, event, helper); 
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
      helper.statusChange(component, event, helper);
    },
    /*------------------------------------------------------------
    Author:        Gopal
    Company:       Accenture
    Description:   Handles event if planned objective select is changed

    History
    <Date>      <Authors Name>     <Brief Description of Change>
    7/09/2018    Gopal			       Initial Creation
    ------------------------------------------------------------*/
    plannedObjectiveChanged : function(component, event, helper) {
        var templateVal = event.getParam("template");
        helper.setFormFieldsFromTemplate(component, templateVal);
    },
    
    onPackageChange : function(component, event, helper) {
        if(!$A.util.isEmpty(component.find("selectOptions").get("v.value"))){
          var parcedValue = component.find("selectOptions").get("v.value").split(',');
                var productId = parcedValue[0].trim();
                var packVal = parcedValue[1].trim();
        component.set("v.selectedPkg",packVal);
        component.set("v.ProductId",productId);  
            
        } 
    }
})