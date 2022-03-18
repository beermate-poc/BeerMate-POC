({
	iscreate:function(component,Event,helper){
        //alert(Schema.sObjectType.Order.isCreateable());
        var Action=component.get("c.getCreateableDetail");
        var recordId= component.get("v.recordId");
      
        Action.setParams(
           {"OrdId":recordId}
       );
        Action.setCallback(this, function(response){ 
           var ResponseValues = response.getState();
           var Result = response.getReturnValue();
            if (ResponseValues === 'SUCCESS') {
                if(Result==true)
                {
                    this.accessButton(component,Event,helper);
                }
                else{
                    component.set("v.nocloneopen",true);
                }
            }
        });
                           $A.enqueueAction(Action);
    
    },
    accessButton:function(component,Event,helper){
        var Action=component.get("c.getOrderDetail");
      var recordId= component.get("v.recordId");
       Action.setParams(
           {"OrdId":recordId}
       );
       Action.setCallback(this, function(response){ 
           var ResponseValues = response.getState();
           var Result = response.getReturnValue();
            if (ResponseValues === 'SUCCESS') {
                for(var i in Result){
                    if(((i.includes('C360')||i.includes('CTS'))&&(Result[i] === 'Beermate'))||(i === 'System Administrator')){
                        component.set("v.cloneopen",true);
                    }
                    else {
                        component.set("v.nocloneopen",true);
                    }
                }
            }
       });
    $A.enqueueAction(Action);
    }
})