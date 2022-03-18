({
    isUserHaveAccess:function(cmp, event, helper) {
        var recordId= cmp.get("v.recordId");
    	var action = cmp.get("c.isUserCanAccess");
        action.setParams({
            "contId":recordId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                if(response.getReturnValue() == true){
                    helper.loadHierarchyGrid(cmp, event, helper,true);
                }
                cmp.set("v.isUserAccess", response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    AddRelationToDifferentHierarchy:function(cmp, event, helper) {
        var accIds= cmp.get("v.selectedLookUpRecord").Id;
        if(accIds == undefined || accIds == null)
        {
            alert('Please Select Account');
        }
        else{
            var recordId= cmp.get("v.recordId");
    	cmp.set("v.isLoading",true);
        var action = cmp.get("c.addAccountRelationship");
                action.setParams({accId:accIds,
                                  recId:recordId					});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {

                        
                        helper.callToServer1(cmp, event, helper,false);
                        //helper.loadHierarchyGrid(cmp, event, helper,false);
                        helper.sendToPassPort(cmp, event, helper);
                        cmp.set("v.thisClearResult", true);
                      
                    }
                });
                $A.enqueueAction(action); 
        }
       
	},
	loadHierarchyGrid : function(component, event, helper,isCollapse) {
        var columns = [
            {
                type: 'url',
                initialWidth: 380,
                fieldName: 'AccountURL',
                label: 'Account Name',
                typeAttributes: {
                    label: { fieldName: 'accountName' },
                    title:  { fieldName: 'accountName' },
                }
            },
            
            {
                type: 'text',
                fieldName: 'ShipToNumber',
                label: 'Ship To Number'
            },
            {
                type: 'text',
                fieldName: 'Location',
                label: 'Location'
            },
            
            {
            type: 'button',
            
                typeAttributes: {
                    iconName: {fieldName: 'ButtonIcon'},
                    variant:'base',
                    name: 'addorremoverel', 
                    title: '',
                    label: {fieldName: 'ButtonLabel'},
                    alternativeText:'Return',
                    class: {fieldName: 'isbutton'},
                    style:'width:350px'
                }
        }
            
        ];
        component.set('v.gridColumns', columns);
        helper.callToServer1(component, event, helper,isCollapse);
    },
    
     callToServer1 : function(component, event,helper,iscollapsed) {
         debugger;
         //$A.get('e.force:refreshView').fire();
        
        var recordId= component.get("v.recordId");
    	var action = component.get("c.findHierarchyDataMultiple");
        action.setParams({
            "conId":recordId
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                var results = response.getReturnValue();
                var expandedRows = [];
                    var apexResponse = response;
                	var urlString = window.location.href;
 					var baseURL; 
                	if(urlString.indexOf("/s") !=-1){
                    	baseURL = urlString.substring(0, urlString.indexOf("/s"));
                	}
                	else if(urlString.indexOf("lightning") !=-1){
                    	baseURL = urlString.substring(0, urlString.indexOf("/s"));
                	}
                    var roles = {};
                    console.log('*******apexResponse:'+JSON.stringify(apexResponse));
                    //var results = apexResponse;
                    roles[undefined] = { Name: "Root", _children: [] };
                    var btnIcon;
                for(var i in results){ 
                    results[i].Hierarchies.forEach(function(v) {
                        if(v.RecType !== 'Distributor'){
                            expandedRows.push(v.Id);
                        }
                        if(v.ButtonLabel === "Add"){
                            btnIcon ='utility:adduser';
                        }
                        else if(v.ButtonLabel === "Remove"){
                            btnIcon ='utility:delete';
                        }
                        else
                        {
                            btnIcon ='';
                        }
                        
                        roles[v.Id] = { 
                            accountName: v.Name ,
                            name: v.Id, 
                            Type:v.Type,
                            ShipToNumber:v.ShipToNumber,
                            isbutton:v.isbutton,
                            ButtonLabel:v.ButtonLabel,
                            Location:v.Location,
                            ButtonIcon:btnIcon,
                            AccountURL:baseURL+'/'+v.Id,
                            _children: [] };
                    });
                    results[i].Hierarchies.forEach(function(v) {
                        
                        if(roles[v.ParentId] != null && roles[v.ParentId] != undefined){
                            roles[v.ParentId]._children.push(roles[v.Id]);   
                        }
                       else if(roles[v.ParentId] == undefined && roles[v.Id] != undefined){
                            roles[undefined]._children.push(roles[v.Id]); 
                       }
                        
                    });  
                 }
                    component.set("v.gridData", roles[undefined]._children);
                	
                if(iscollapsed == true){
                    component.set('v.gridExpandedRows', expandedRows);
                }
					
                	//$A.get('e.force:refreshView').fire();
                component.set("v.isLoading",false);
                
            }
        });
        $A.enqueueAction(action);
    },
    
    getRowActions: function(component, row, cb) {
        var actions = [];
        actions.push({
            iconName: 'nn',
                    name: 'addorremoverel', 
                    title: 'addorremoverel',
                    label: 'Add',
                    alternativeText:'Return',
                    class: {fieldName: 'isbutton'} });
        cb(actions);
    },
    addAccContRel: function(cmp,event,helper,rows) {
        cmp.set("v.isLoading",true);
        var recrdid = cmp.get('v.recordId');
        var action = cmp.get("c.addAccountRelationship");
                action.setParams({accId:rows.name,
                                  recId:recrdid					});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        
                        
                        helper.callToServer1(cmp, event, helper,false);
                        //helper.loadHierarchyGrid(cmp, event, helper,false);
                        helper.sendToPassPort(cmp, event, helper);
                        //$A.get('e.force:refreshView').fire();
                        
                    }
                });
                $A.enqueueAction(action);
    }, 
    removeAccContRel: function(cmp,event,helper,rows) {
        cmp.set("v.isLoading",true);
        var recrdid = cmp.get('v.recordId');
        var action = cmp.get("c.removeAccRelationship");
                action.setParams({accId:rows.name,
                                 recId:recrdid});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        //$A.get('e.force:refreshView').fire();
                        if(response.getReturnValue() ==='NoShipTo'){
                           helper.showError(cmp, event, helper,$A.get("$Label.c.PDE_PosConnection_Msg"));
                           helper.callToServer1(cmp, event, helper,false);
                        }
                        else{ 
                        helper.callToServer1(cmp, event, helper,false);
                        
                        //helper.loadHierarchyGrid(cmp, event, helper,false);
                        helper.sendToPassPort(cmp, event, helper);
                        }
                        
                        //cmp.set("v.isLoading",false);
                    }
                    else{
                        alert('You dont have sufficient access to perform this action.Please Contact support.');
                        cmp.set("v.isLoading",false);
                    }
                });
                $A.enqueueAction(action);
    },
    sendToPassPort:function(cmp,event,helper,rows) {
    	var recrdid = cmp.get('v.recordId');
        var action = cmp.get("c.sendShiptosToPassport");
                action.setParams({
                                 recId:recrdid});
                action.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        
                    }
                });
                $A.enqueueAction(action);
	},
    showError : function(component, event, helper,message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'Error',
            message:message,
            duration:' 5000',
            key: 'info_alt',
            type: 'error',
            mode: 'pester'
        });
        toastEvent.fire();
    }
    
})