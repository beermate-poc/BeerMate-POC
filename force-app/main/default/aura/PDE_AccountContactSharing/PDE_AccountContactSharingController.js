({
    doInit: function (component, event, helper) { 
       helper.isUserHaveAccess(component, event, helper);
        
      },
    onRowSelect: function(cmp,event,helper){
        debugger;
        var action = event.getParam("action");
        var rows = event.getParam("row");
        var btnLabel= rows.ButtonLabel;
        var data = cmp.get("v.gridData");
        switch (rows.ButtonLabel) {
            case 'Add':
                helper.addAccContRel(cmp,event,helper,rows);
                break;
            case 'Remove':
                helper.removeAccContRel(cmp,event,helper,rows);
                break;
        }
    },
    handleClickRelation:function(cmp,event,helper){
        helper.AddRelationToDifferentHierarchy(cmp,event,helper);
    }
})