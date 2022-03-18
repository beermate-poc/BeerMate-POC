({
   /**
   @Author Accenture
   @name selectRecord
   @CreateDate  11/12/2018
   @Description Function returns the Id of selected record.
  */
  
    
    selectRecord : function(component, event, helper){
        var getSelectRecord = component.get("v.oRecord");
        var oRecId = component.get("v.oRecId");
        var oRecName = component.get("v.oRecName");
        var compEvent = component.getEvent("oSelectedRecordEvent");
        compEvent.setParams({"recordByEvent" : getSelectRecord ,"oRecId" : oRecId,"oRecName" : oRecName});
        compEvent.fire();
    },
})