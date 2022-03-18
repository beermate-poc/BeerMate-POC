({
    /**
   @Author Accenture
   @name doInit
   @CreateDate  9/13/2018
   @Description Init function.
  */
    doInit: function(component, event, helper) {
        if(component.get("v.editAuditObj.BMC_No_Manufacture_Date__c")===true)
            component.set("v.codeRequired", false);
    },
    /**
   @Author Accenture
   @name gotoBrndPcklist
   @CreateDate  9/13/2018
   @Description Function to navigate back to Brand Pack Audit Itemm list.
  */
    gotoBrndPcklist: function(component, event, helper) {
        if(component.get("v.showEditaudit")===true)
            component.set("v.showEditaudit", false);
    },
    /**
   @Author Accenture
   @name updateAuidtitem
   @CreateDate  9/13/2018
   @Description Function to update Audit Items.
  */
    updateAuidtrec: function(component, event, helper) {
        helper.updateAuidtitem(component, event, helper);
    },
    /**
   @Author Accenture
   @name deleteAuidtrec
   @CreateDate  9/13/2018
   @Description Function to delete Audit Items.
  */
    deleteAuidtrec: function(component, event, helper) {
        if(confirm('Are you sure you want to delete this audit item?'))
            helper.deleteAuidtitem(component, event, helper);
    },
    /**
   @Author Accenture
   @name setcodedateRqrd
   @CreateDate  9/13/2018
   @Description Function to set code date mandatory.
  */
    setcodedateRqrd:function(component, event, helper) {
        if(component.get("v.editAuditObj.BMC_No_Manufacture_Date__c")===true){
            component.set("v.codeRequired", false);
        }
        if(component.get("v.editAuditObj.BMC_No_Manufacture_Date__c")===false){
            component.set("v.codeRequired", true);
        }
    }
})