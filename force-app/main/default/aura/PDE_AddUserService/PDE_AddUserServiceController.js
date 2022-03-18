({
	doInit : function(cmp, event, helper) {
        helper.isUserHaveAccess(cmp,event,helper);
        helper.loadServiceListTable(cmp,event,helper);
        //console.log("### : " + JSON.stringify(component.get("v.data")));
    },
    updateColumnSorting: function (cmp, event, helper) {
        var fieldName = event.getParam("fieldName");
        var sortDirection = event.getParam("sortDirection");
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
    AddOrDelete:function(cmp, event, helper){
    cmp.set("v.isLoading",true);
    var id = cmp.find("{!v.idx}");
    var idxs = event.getSource().get("v.name");
    var addrDelete = event.getSource().get("v.checked");
   	var recordId= cmp.get("v.recordId");
    var serviceNme =  event.getSource().get("v.value");
    if(addrDelete === true){
         var action = cmp.get("c.AddUserService");   
    }
    else
    {
        var action = cmp.get("c.removeUserService");  
    }
    action.setParams({
            "conId":recordId,
        "serviceName":serviceNme
        });
    action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set("v.isLoading",false);
                if(serviceNme === 'POSConnection' && response.getReturnValue() ==='NoShipTo'){
                   helper.showError(cmp, event, helper,$A.get("$Label.c.PDE_PosConnection_Msg"));
                   helper.loadServiceListTable(cmp, event, helper);
                }
            }
        else{
            cmp.set("v.isLoading",false);
        }
    });
    $A.enqueueAction(action);
	},
    
})