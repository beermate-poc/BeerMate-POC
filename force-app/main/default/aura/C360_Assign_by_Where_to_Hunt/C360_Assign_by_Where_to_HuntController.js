({
   doInit : function(component, event, helper) {
    	helper.initHandler(component, event, helper);
    },
     hselRec : function(component, event, helper) {
    	component.find("allIds").set("v.value",false);	
    },
     hselAllRec : function(component, event, helper) {
    	helper.selAllRec(component, event, helper);
    },
    hCancel : function (component, event) {
    	var recordId = component.get("v.recordId");
        var redirect = $A.get("e.force:navigateToSObject");
        redirect.setParams({
          "recordId": recordId,
          "slideDevName": "related"
        });
        redirect.fire();
    },
     hCreateObj: function(component, event, helper) {
		var createObjId = [];
        var recSize = (component.get("v.targetAcc")).length;
        var getAllId = component.find("selectedIds");
        if(!Array.isArray(getAllId) && recSize != 0)
        {
            if (getAllId.get("v.value") == true) 
            {
                createObjId.push(getAllId.get("v.text"));
            }
        }
        else{
            	for (var i = 0; i < recSize; i++)
                {
                	if (getAllId[i].get("v.value") == true) 
                    {
                    createObjId.push(getAllId[i].get("v.text"));
               		 }
            }
        }
        if(createObjId.length == 0)
        {
             var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "type":$A.get("$Label.c.C360_Warning"),
                    "title": $A.get("$Label.c.C360_Warning"),
                    "message": $A.get("$Label.c.C360_Record_select")
                });
                toastEvent.fire();   
        }
        else{
            helper.objHelper(component, event, createObjId);
            helper.canceled(component,event);
        }  
    }
})