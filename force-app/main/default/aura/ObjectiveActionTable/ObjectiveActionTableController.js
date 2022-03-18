({
    doInit : function(component, event, helper) {
        $A.util.addClass(component.find("ErrorMsg"),"slds-hide");
        component.set("v.ErrorMsg",'');
        
        helper.getStatusValues(component, event, helper);
       
          
	},
    editClick : function(component, event, helper) {
        /*
        var showFilesEvent = component.getEvent("OnClickShowFilesEvent"); 
        //alert(event.target.getAttribute("data-key"));
                        //Set event attribute value
        showFilesEvent.setParams({"typeOfEvent" : "Open Files and Edit","sobjectedId" : event.target.getAttribute("data-key"),"isFromShowRelatedFilesCMP":false}); 
        showFilesEvent.fire();
        */
        
		var editPageEvent = component.getEvent("OnClickEditPageEvent"); 
                        //Set event attribute value
        editPageEvent.setParams({"clickedEdit" : true,"selectedObjectiveId":event.target.getAttribute("data-key")}); 
        editPageEvent.fire();
        
	},
    navigateTosellingstoryLink : function(component, event, helper) {
		var storyLinkEvent = component.getEvent("OnClickobjectivestory"); 
		var key =event.getSource().get("v.value");
        storyLinkEvent.setParams({"externalKey" : key});
        storyLinkEvent.fire();
	},
    onStatusChange : function(component, event, helper) {
		//console.log(event.target.id+"===="+event.target.value);
        let objId = event.target.id;
        let objStatus = event.target.value;
        
        component.set("v.optionChanged",true);
        let mapVal = component.get("v.statusChangesMap");
        let objs = component.get("v.objRec");
        for(let key in objs){
            if(objs[key].Id == objId && objs[key].Status__c != objStatus){
                //alert('In change loop===='+key+objs[key].Status__c + objStatus);
                
                if(mapVal){
                    
                    mapVal[objId]= {Id: objId, Status__c:objStatus};
                    break;
                }else{
                    mapVal = {};
                    
                    mapVal[objId]= {Id: objId, Status__c:objStatus};
                    break;
                }
            }else if(objs[key].Id == objId && objs[key].Status__c == objStatus){
                //alert('In delete loop===='+key+objs[key].Status__c + objStatus);
                if(mapVal[objId]){
                    
                    delete mapVal[objId];
                    
                    break;
                }
            }
        }
        //console.log(JSON.stringify(mapVal) + '----------'+Object.keys(mapVal).length);
        if(Object.keys(mapVal).length > 0){
            component.set("v.statusChangesMap",mapVal);            
        }else{
            //alert('No Values Set'+JSON.stringify(mapVal));
            component.set("v.optionChanged",false);
            component.set("v.statusChangesMap",{});
        }
                    
        
        //alert('update=='+JSON.stringify(component.get("v.statusChangesMap")));
        //alert('Creating Map---'+(JSON.stringify(mapVal)) + Object.values(mapVal));
	}
    ,
    onSave : function(component, event, helper) {
		helper.saveStatusChanges(component, event, helper);
        
	}
    ,
    handleCancel : function(component, event, helper) {
        component.set("v.statusChangesMap",{});
        component.set("v.optionChanged",false);
        var objListOriginal = [...component.get("v.objRec")];
        component.set("v.objRec",[]);
        component.set("v.objRec",objListOriginal);
        component.set("v.ErrorMsg","");
        
        
	},
    navigateToFilesComponent : function(component, event, helper) {
		var showFilesEvent = component.getEvent("OnClickShowFilesEvent"); 
        //alert(event.getSource().get("v.value"));
                        //Set event attribute value
        showFilesEvent.setParams({"typeOfEvent" : "Open Files","sobjectedId" : event.getSource().get("v.value"),"isFromShowRelatedFilesCMP":false}); 
        showFilesEvent.fire();
	}
})