({
    closeModelMethod : function(component, event, helper) {
		var recordId = component.get("v.recId");
        var redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
          "recordId": recordId,
          //"slideDevName": "detail"
        });
        redirect.fire();
	},
    exeChange : function(component, event, helper) {
    	//get the value of select option
        var selectedPck = component.find("ExecutionTypeId");
        //alert(selectedPck.get("v.value"));
        if(component.find("StatusId").get("v.value")==="Rejected"){
        	component.set("v.varVal",false); 
            var inputIndustry1 = component.find("RejTypeId1");
            var rejVal = component.get("v.optn");
            //alert(rejVal);
            inputIndustry1.set("v.options",rejVal );
        }
        else{
            component.set("v.varVal",true);
        }
    },
    exeType : function(component, event, helper) {
        var action = component.get("c.getPicklstVal");
        var inputIndustry = component.find("ExecutionTypeId");
        var opts=[];
        action.setCallback(this, function(a) {
            opts.push({
                class: "optionClass",
                label: $A.get("$Label.c.Sales_None"),
                value: ""
            });
            var result= a.getReturnValue();
            for (var key in a.getReturnValue()) {
                opts.push({"class": "optionClass", 
                           label: key, 
                           value: result[key]});
            }
            /*for(var i=0;i< a.getReturnValue().length;i++){
                opts.push({"class": "optionClass", 
                           label: a.getReturnValue()[i], 
                           value: a.getReturnValue()[i]});
            }*/
            inputIndustry.set("v.options", opts);
             
        });
        $A.enqueueAction(action); 
    },
    rejType : function(component, event, helper) {
        var action = component.get("c.getRejlstVal");
        var inputIndustry = component.find("RejTypeId");
        //var inputIndustry1 = component.find("RejTypeId1"); 
        //alert(inputIndustry1);
        var opts=[];
        action.setCallback(this, function(a) {
            opts.push({
                class: "optionClass",
                label: $A.get("$Label.c.Sales_None"),
                value: ""
            });
            var result= a.getReturnValue();
            for (var key in a.getReturnValue()) {
                opts.push({"class": "optionClass", 
                           label: key, 
                           value: result[key]});
            }
            /*for(var i=0;i< a.getReturnValue().length;i++){
                opts.push({"class": "optionClass", 
                           label: a.getReturnValue()[i], 
                           value: a.getReturnValue()[i]});
            }*/
            inputIndustry.set("v.options", opts);
            component.set("v.optn", opts);
             
        });
        $A.enqueueAction(action); 
    },
    conType : function(component, event, helper) {
        var action = component.get("c.getConlstVal");
        var inputIndustry = component.find("CountryId");
        var opts=[];
        action.setCallback(this, function(a) {
            opts.push({
                class: "optionClass",
                label: $A.get("$Label.c.Sales_None"),
                value: ""
            });
            var result= a.getReturnValue();
            for (var key in a.getReturnValue()) {
                opts.push({"class": "optionClass", 
                           label: key, 
                           value: result[key]});
            }
            /*for(var i=0;i< a.getReturnValue().length;i++){
                opts.push({"class": "optionClass", 
                           label: a.getReturnValue()[i], 
                           value: a.getReturnValue()[i]});
            }*/
            inputIndustry.set("v.options", opts);
             
        });
        $A.enqueueAction(action); 
    },
    staType : function(component, event, helper) {
        var action = component.get("c.getStaPicklstVal");
        var inputIndustry = component.find("StatusId");
        var opts=[];
        action.setCallback(this, function(a) {
            opts.push({
                class: "optionClass",
                label: $A.get("$Label.c.Sales_None"),
                value: ""
            });
            var result= a.getReturnValue();
            for (var key in a.getReturnValue()) {
                opts.push({"class": "optionClass", 
                           label: key, 
                           value: result[key]});
            }
            /*for(var i=0;i< a.getReturnValue().length;i++){
                opts.push({"class": "optionClass",
                           label: a.getReturnValue()[i], 
                           value: a.getReturnValue()[i]});
            }*/
            inputIndustry.set("v.options", opts);
             
        });
        $A.enqueueAction(action); 
    },
    create : function(component, event, helper) {
        
        var objName = component.find("ObjName").get("v.value");
        var objDescpt = component.find("ObjDetails").get("v.value");
        var objExTyp = component.find("ExecutionTypeId").get("v.value");
        var objStrt = component.find("StrtTime").get("v.value");
        var objEnd = component.find("EndTime").get("v.value");
        var objStat = component.find("StatusId").get("v.value");
        //var objRej = component.find("RejTypeId").get("v.value");
        var objCon = component.find("CountryId").get("v.value");
        //var objProd = component.find("ProdId").get("v.value");
        component.set('v.savedisable',true);
        if($A.util.isEmpty(objName) || $A.util.isUndefined(objName)){
             component.set('v.savedisable',false);
            //alert(' Name is Required');
            alert($A.get("$Label.c.Sales_Validation_Name"));
            return;
        }            
        if($A.util.isEmpty(objDescpt) || $A.util.isUndefined(objDescpt)){
             component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_Description"));
            return;
        }
        if($A.util.isEmpty(objExTyp) || $A.util.isUndefined(objExTyp)){
         component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_Exe_Type"));
            return;
        }
        if($A.util.isEmpty(objStrt) || $A.util.isUndefined(objStrt)){
             component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_StartTime"));
            return;
        }
        if($A.util.isEmpty(objEnd) || $A.util.isUndefined(objEnd)){
           component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_EndTime"));
            return;
        }            
        if($A.util.isEmpty(objStat) || $A.util.isUndefined(objStat)){
            component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_Status"));
            return;
        }
        if($A.util.isEmpty(objCon) || $A.util.isUndefined(objCon)){
        	component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_Country"));
            return;
        }
        if(objStat==='Rejected'){
            var dclnRsn = component.find("RejTypeId1").get("v.value");
            if($A.util.isEmpty(dclnRsn) || $A.util.isUndefined(dclnRsn)){
             component.set('v.savedisable',false);
            alert($A.get("$Label.c.Sales_Validation_DeclinedReason"));
                return;
            }
        }
        component.set("v.conIds",objCon);
        var tempRej ="";
        if(objStat==="Rejected")
        {
            tempRej = component.find("RejTypeId1").get("v.value");
        }
        else if(objStat !=='Rejected'){
            tempRej = component.find("RejTypeId").get("v.value");
        }
        //alert('tempRej----'+tempRej);
        var action = component.get("c.createRecord");
        action.setParams({ Name : component.find("ObjName").get("v.value"),
                           Descpt : component.find("ObjDetails").get("v.value"),
                           ExTyp : component.find("ExecutionTypeId").get("v.value"),
                           Strt : component.find("StrtTime").get("v.value"),
                           EndT : component.find("EndTime").get("v.value"),
                           Stat : component.find("StatusId").get("v.value"),
                           Rej : tempRej,
                           Con : component.find("CountryId").get("v.value"),
                           Prod : component.get("v.prdIds"),
                           recId : component.get("v.recId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
              helper.closeModelMethod(component, event, helper);
            }
            else{
                component.set('v.savedisable',false);
            }
        });
        $A.enqueueAction(action);
    },    
})