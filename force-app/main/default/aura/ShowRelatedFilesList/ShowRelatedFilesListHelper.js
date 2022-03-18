({
	getContentDocs: function(component,event,helper){
		var action = component.get("c.fetchContentDocumentLinks");
        action.setParams({
            	"sobjectId": component.get("v.sObjectId")
        	});
        action.setCallback(this,function(response){
            var state=response.getState();
            if(state === "SUCCESS"){
                //alert('Server Call--');
                //alert('out--'+JSON.stringify(response.getReturnValue()));
                if(response.getReturnValue() != null && response.getReturnValue() != ''){
                	component.set("v.contentDocs",response.getReturnValue());
                    //alert('found--'+JSON.stringify(response.getReturnValue()));
                }else{
                    component.set("v.filesFound",false);
                }
            }
            else if(state === "ERROR"){
                //$A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                //component.set("v.ErrorMsg","Unexpected Error on getting Status values. Please try reloading the page.");
                console.log('error');
                component.set("v.filesFound",false);
            }else{
                //$A.util.removeClass(component.find("ErrorMsg"),"slds-hide");
                //component.set("v.ErrorMsg","Unexpected Error on getting Status values. Please contact admin.");
            }
        });
        $A.enqueueAction(action); 
	}
})