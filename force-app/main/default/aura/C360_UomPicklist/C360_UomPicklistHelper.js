({
	loadValue : function(component,event) {
     //var action= component.get("c.retrieveUom");
       var recordId=component.get("v.recordId");
       var opUomMap=component.get("v.opUomMap");
       var ordType= component.get("v.ordType");  
        var opts=[];
      //  alert('##recordId'+recordId);
     //   alert('##opUomMap'+opUomMap);
     /*   for (var key in opUomMap){
            if(key==recordId){
                alert('result$$$'+opUomMap[key]);
                
            }
       }*/
        //var Each = $A.get("$Label.c.C360_UOM_Each");
        //Bug-fix UOM Direct order
         if(ordType[0].Type ==$A.get("$Label.c.C360_CA_Standard") || ordType[0].Type=='CA Standard'){
                        component.set("v.orderTypeCA",true);
        }
        if(ordType[0].RecordType.Name ==='Indirect Order'){
             opts.push({value:'EACH',label:'EACH'});
           
           
        }else{
 			Object.keys(opUomMap).forEach(function(key) {
                if(key==recordId){
                    var res = opUomMap[key].split(";");
                    for(var i=0;i<res.length;i++){
                       opts.push({value:res[i],label:res[i]});
                    }
                }  
                else{
                     if(ordType[0].Type ==$A.get("$Label.c.C360_CA_Standard")){
                        component.set("v.orderTypeCA",true);
                    }
                }
             }); 
           
        }
          component.set("v.options",opts);
       
     /*   action.setParams({
                    "prdId":recordId
                });
        		action.setCallback(this,function(response){
                    var state= response.getState();
                    alert("#####"+response.getReturnValue());
                    component.set("v.options",response.getReturnValue());
                });
        	$A.enqueueAction(action);*/
	}
})