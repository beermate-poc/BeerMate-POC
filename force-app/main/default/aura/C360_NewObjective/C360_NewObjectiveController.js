({
   closeModel: function(component, event, helper) {
       helper.closeModelMethod(component, event, helper);
   },
   handleComponentEvent: function(component, event, helper){
    	var prdId = event.getParams("selectedId");
        //alert('----prdId----'+prdId);
	},
   SavenClose: function(component, event, helper) {
      helper.create(component, event, helper);
      //helper.reqFieldCheck(component, event, helper);
      //helper.closeModelMethod(component, event, helper);
      
   },
   doInit: function(component, event, helper) {
       //helper.intialTemp(component,event,helper);
       helper.exeType(component, event, helper);
       helper.staType(component, event, helper);
       helper.conType(component, event, helper); 
       helper.rejType(component, event, helper); 
    },
    onStatuslistChange : function(component, event, helper) {
        helper.exeChange(component, event, helper);
    },
    onPicklistChange : function(component, event, helper) {
        var appEvent = $A.get("e.c:C360_ProdEvent");
        appEvent.setParams({
            "CountryVal" : component.find("CountryId").get("v.value")
        });
        appEvent.fire();
        helper.exeChange(component, event, helper);
    },
    
})