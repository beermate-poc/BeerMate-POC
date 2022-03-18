({
	//This Function is called during the page load
    doInit : function(component, event, helper) {
        $A.util.addClass(component.find("error"),"slds-hide");
        component.set("v.iniVar",true);
        var recordidpassed = component.get("v.recordId");
        //alert("recordidpassed"+ recordidpassed);
        var actionCall2 = component.get("c.getFieldsAccessible");
            actionCall2.setCallback(this, function(response) {
                var stateValue = response.getState();
                if (stateValue === "SUCCESS") {
                    component.set("v.FieldAccess",response.getReturnValue());                
                }
             });
             //This call out is fetch all the accessible fields for the current user.
             $A.enqueueAction(actionCall2);
        
        if(recordidpassed.substring(0,3) == "a24")
        {
            console.log("barline:::"+recordidpassed);
            component.set("v.lineId",recordidpassed);
            component.set("v.Isclone",true);
            var actionCall = component.get("c.barReclineinfo");
            actionCall.setParams({
                "recid":component.get("v.lineId")
            });
            actionCall.setCallback(this, function(response) {
                var stateValue = response.getState();
                if (stateValue === "SUCCESS") {
                    var barline = response.getReturnValue();
                    component.set("v.BarRecordLine",barline);
                    component.set("v.BarRecordLine.Id",component.get("v.lineId"));
                    component.set("v.BarRecordLine.C360_Position__c",barline.C360_Position__c);
                    component.set("v.BarRecordLine.C360_Bar_Record__c",barline.C360_Bar_Record__c);
                    component.set("v.BarRecordLine.C360_Display_Type__c",barline.C360_Display_Type__c);
                    component.set("v.BarRecordLine.CTS_Display_Sub_Type__c",barline.CTS_Display_Sub_Type__c);
                    component.set("v.BarRecordLine.C360_Brand__c",barline.C360_Brand__c);
                    component.set("v.BarRecordLine.C360_Brand__r.Name",barline.C360_Brand__r.Name);
                    component.set("v.BarRecordLine.C360_Customer_Selling_Price__c",barline.C360_Customer_Selling_Price__c);
                    component.set("v.BarRecordLine.C360_Through_the_Bar__c",barline.C360_Through_the_Bar__c);
                    component.set("v.BarRecordLine.CTS_Cooling_type__c",barline.CTS_Cooling_type__c);
                    component.set("v.BarRecordLine.C360_Handle_type__c",barline.C360_Handle_type__c);
                    component.set("v.BarRecordLine.CTS_Default_Lineset__c",barline.CTS_Default_Lineset__c);
                    component.set("v.BarRecordLine.CTS_Gas_Type__c",barline.CTS_Gas_Type__c);
                    component.set("v.BarRecordLine.CTS_Out_of_Spec__c",barline.CTS_Out_of_Spec__c);
                    component.set("v.BarRecordLine.C360_Status__c",barline.C360_Status__c);
                    $A.util.addClass(component.find("divtag2"), "slds-hide");
        			$A.util.removeClass(component.find("divtag1"), "slds-hide");
                    component.find("Position").set("v.value",barline.C360_Position__c);
    				component.find("Displaytype").set("v.value",barline.C360_Display_Type__c);
      				component.find("DisplaySubtype").set("v.value",barline.CTS_Display_Sub_Type__c);
                    component.find("brandid").set("v.value",barline.C360_Brand__c);
                    component.find("CustSelling").set("v.value",barline.C360_Customer_Selling_Price__c);
                    component.find("ThroughtheBar").set("v.value",barline.C360_Through_the_Bar__c);
                    component.find("CoolingType").set("v.value",barline.CTS_Cooling_type__c);
                    component.find("HandleType").set("v.value",barline.C360_Handle_type__c);
                    component.find("LineSet").set("v.value",barline.CTS_Default_Lineset__c);
                    component.find("GasType").set("v.value",barline.CTS_Gas_Type__c);
                    component.find("Out_of_Spec").set("v.value",barline.CTS_Out_of_Spec__c);
                    component.find("Status").set("v.value",barline.C360_Status__c);
                    
                    component.set("v.barrecId",barline.C360_Bar_Record__c);
                    console.log("BarREc ID>>>>>>>"+component.get("v.barrecId"));
                    var actionCallbarec = component.get("c.barRec");
                    actionCallbarec.setParams({
                        "recid":component.get("v.barrecId")
                    });
                    actionCallbarec.setCallback(this, function(response) {
                        var stateValue = response.getState();
                        if (stateValue === "SUCCESS") {
                            component.set("v.BarRec",response.getReturnValue());
                            
                        }
                     });
                    
                     //This call out is to pre populate the bar record info.
                     $A.enqueueAction(actionCallbarec);
                    
                    /*
                    // Find the component whose aura:id is "flowData"
                    var flow = component.find("flowData");
                    //console.log("BarREc ID12>>>>>>>"+component.get("v.barrecId"));
                    var inputVariables = [
                           {
                              name : "recordId",
                              type : "String",
                              value:  component.get("v.barrecId")
                           }
                        ];
                    // In that component, start your flow. Reference the flow's Unique Name.
                    flow.startFlow("CTS_Show_Bar_Information",inputVariables);

                    */
                    
                }
             });
            
             //This call out is to pre populate the bar record info.
             $A.enqueueAction(actionCall);
        }
	},
    //This function is to handle whenever the changes done to brand field in component.
    handleChange : function(component, event, helper) {
        var brandId = component.find("brandid").get("v.value");
        if(!(component.get("v.iniVar"))){
            
    	if((brandId !== null)&&(brandId.length >=15))
        {
            $A.util.addClass(component.find("error"),"slds-hide");
            var actionCall = component.get("c.brandInfo");
            actionCall.setParams({
                "brand":brandId
            });
            actionCall.setCallback(this, function(response) {
                var stateValue = response.getState();
                if (stateValue === "SUCCESS") {
                    var brandRec = response.getReturnValue();    
                        //console.log('brandRec'+brandRec);
                    	//component.find("BrandOwner").set("v.value",brandRec.CTS_Brand_Brewer__c);
                                      
                    	//component.find("Spuroff").set("v.value",brandRec.CTS_Spur_Off__c);
                    
                    	//component.find("ExtraCold").set("v.value",brandRec.CTS_Extra_Cold__c);
                    
                    	component.find("GasType").set("v.value",brandRec.CTS_Primary_Gas_Type__c);
                    
                    	component.find("LineSet").set("v.value",brandRec.CTS_Lineset_Default__c);
                    
                    	//component.find("CouplerType").set("v.value",brandRec.CTS_Coupler_Default__c);
                    
                }
             });
             $A.enqueueAction(actionCall);
        }else 
        {
           	$A.util.removeClass(component.find("error"),"slds-hide");
            
            	//component.find("BrandOwner").set("v.value","");
            
            	//component.find("Spuroff").set("v.value","");
            
            	//component.find("ExtraCold").set("v.value","");
            
            	component.find("GasType").set("v.value","");
            
            	component.find("LineSet").set("v.value","");
            
            	//component.find("CouplerType").set("v.value","");
            
                //component.find("InstallResponsibility").set("v.value","");
            
        }
    }
        component.set("v.iniVar",false);
    },
    //This handles the button Clicks Save and Cancel
    handleClick : function(component, event, helper) {
    	var selectedButtonLabel = event.getSource().get("v.label");
        
        //alert("Button label: " + selectedButtonLabel);
        if(selectedButtonLabel === $A.get("$Label.c.CTS_Save"))
        {
            
            var barRecordLine = component.get("v.BarRecordLine") ;
            
		    var operation = "Edit";
            
            var actionCall = component.get("c.barRecLineInsert");
            actionCall.setParams({
                			  "barRecordLine":barRecordLine,
                              "barRecId": barRecordLine.C360_Bar_Record__c,
                              "deepCloneNeeded":component.get("v.BarRec.CTS_Update_Complete__c"),//component.get("v.BarRec.CTS_Update_Complete__c")
                			  "operation" : operation
                             });
        	actionCall.setCallback(this, function(response) {
            var stateValue = response.getState();
            if (stateValue === "SUCCESS") {
                			if((response.getReturnValue()).split("_")[0] === "Success")
                                   {
                                       
                                       $A.util.addClass(component.find("ErrorMsg"), "slds-hide");
                                       helper.closeQuickActionAndRedirect(component, event,(response.getReturnValue()).split("_")[1]);
                                       var evnT = $A.get("event.force:showToast");
                                       evnT.setParams({
                                           "title":"Bar Record Line:",
                                           "message":"Record Updated Successfully !",
                                           "type":"success"
                                          //"messageTemplate": "{0} Created! Click {1}!",
                                           //"messageTemplateData": ["Record", {
                                           // "url": "/"+(response.getReturnValue()).split("_")[1],
                                           // "label": "here"
                                        	//}]
                                       });
                                       evnT.fire();
                                       $A.get('e.force:refreshView').fire();
                                   }
                               else{
                                   	$A.util.removeClass(component.find("ErrorMsg"), "slds-hide");
                					component.set("v.ErrorMsg",response.getReturnValue());     
                                    
                                   }
            } 
         });
         $A.enqueueAction(actionCall);
            
           
        }
        else{
            
            if((selectedButtonLabel === $A.get("$Label.c.CTS_Cancel")))
            {
                helper.closeQuickActionAndRedirect(component, event,component.get("v.BarRecordLine.C360_Bar_Record__c"));
                
            }
        }
    
    },
    //This fuction is to switch the display of Bar Record Field in Component
    toggleDisplay :function(component, event, helper) {
		
        $A.util.addClass(component.find("divtag1"), "slds-hide");
        $A.util.removeClass(component.find("divtag2"), "slds-hide");

	} ,
    setDisplaytype : function(component, event, helper) {
      component.set("v.BarRecordLine.C360_Display_Type__c",component.find("Displaytype").get("v.value"));
	},
    setDisplaysubtype : function(component, event, helper) {
      component.set("v.BarRecordLine.CTS_Display_Sub_Type__c",component.find("DisplaySubtype").get("v.value"));
	},
    handleCancel : function(component, event, helper) {
      helper.closeQuickActionAndRedirect(component, event,component.get("v.BarRecordLine.C360_Bar_Record__c"));
	}
})