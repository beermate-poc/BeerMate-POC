({
    iscreate:function(component,Event,helper){
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
                    component.set("v.cloneopen",true);
                }
                else{
                    component.set("v.nocloneopen",true);
                }
            }
        });
        $A.enqueueAction(Action);
        
    },
   
})