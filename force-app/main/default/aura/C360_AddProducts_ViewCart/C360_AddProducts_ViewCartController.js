({
    doInit : function(component, event, helper) {	/* doInit Method */
        helper.onLoad(component, event, helper);
        helper.litPicklist(component);
        helper.uomPicklist(component);
        helper.statusPicklist(component);
        helper.rCodePicklist(component);
        
    },
    
    deleteOrderProd : function(component, event, helper){
        var delId=event.getSource().get("v.value");
        var action=component.get("c.deleteOrderProduct");
        action.setParams({
            "orderProdId":delId
        });        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state=== "SUCCESS"){
                alert($A.get('{!$Label.c.C360_DelSuccess}'));
            }
            else{
                alert($A.get('{!$Label.c.C360_DelError}'));
                
            }
            // call the onLoad function for refresh the List view    
            helper.onLoad(component, event, helper);
        });
        $A.enqueueAction(action);   
    },
    validate : function(component, event, helper) {
      //  debugger;
        var chkFlag = [];
        var lit=component.find("selectLit");
        var rejstatus =component.find("selectstatus");
        
        var q=component.find("{!'index' + key}");
        if(! Array.isArray(lit) && (!Array.isArray(lit)))  //FOR SINGLE RECORD 
        {
            if(rejstatus !== undefined && rejstatus.get("v.value") ==="--None--" && q.get("v.value") <=0)
            {
                alert($A.get('{!$Label.c.C360_InvalidQty}'));
            }
            else if(rejstatus === undefined && q.get("v.value") <=0)
            {
                alert($A.get('{!$Label.c.C360_InvalidQty}'));
            }
            else if(q.get("v.validity").valid===true || (rejstatus != undefined && rejstatus.get("v.value") !="--None--")){
                helper.addToCarthelper(component, event, helper, 'validate');
            }else{
                alert($A.get('{!$Label.c.C360_InvalidQty}')); 
            }
        }
        else{
            
            for(var i=0;i<q.length;i++)
            {
                if(q[i].get("v.validity").valid===false ){
                    chkFlag.push(q[i].get("v.validity").valid);
                }
                else if((rejstatus !== undefined && rejstatus[i].get("v.value") ==="--None--"&& q[i].get("v.value") <=0) ||(rejstatus === undefined &&q[i].get("v.value") <=0))
                {
                    chkFlag.push(false);
                }
            } 
            if(chkFlag.indexOf(false)===-1){
                
                helper.addToCarthelper(component, event, helper, 'validate');
            }
            else{
                alert($A.get('{!$Label.c.C360_InvalidQty}'));
            }
        } 
        // helper.addToCarthelper(component, event, helper,'validate');
    },
    submit : function(component, event, helper) {
        var params = event.getParam("arguments");
        var chkFlag = [];     
        var lit=component.find("selectLit");
        var q=component.find("{!'index' + key}");
        if(! Array.isArray(lit) && (!Array.isArray(selectLit)) )  //FOR SINGLE RECORD 
        {
            if(q.get("v.validity").valid===true){
                helper.addToCarthelper(component, event, helper, 'submitted');
            }else{
                alert($A.get('{!$Label.c.C360_InvalidQty}'));
            }
        }
        else{
            for(var i=0;i<q.length;i++)
            {
                
                if(q[i].get("v.validity").valid===false){
                    
                    chkFlag.push(q[i].get("v.validity").valid);
                }
            } 
            
            if(chkFlag.indexOf(false)===-1){
                helper.addToCarthelper(component, event, helper, 'submitted');
            }
            else{
                alert($A.get('{!$Label.c.C360_InvalidQty}'));
            }
        }         
        
    },
    setDefautQuantity : function(component, event){
      //  debugger;
        var status =event.getSource().get("v.value");
        var q=component.find("{!'index' + key}");
        var indx =event.getSource().get("v.name");
        if(event.getSource().get("v.value") !=="--None--")
        {
            if(! Array.isArray(q))
            {
                q.set("v.value", 0);
            }
            else
                q[indx].set("v.value", 0);
            
        }
        
            
    }
    
    
})