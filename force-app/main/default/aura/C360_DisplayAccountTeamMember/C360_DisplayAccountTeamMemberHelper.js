({
	//This is called on page loading from the componnet controller which will fetch account team data ass.  
	fetchAccTm : function(component,helper) {
      var action=component.get("c.getFetchAccountTeam"); //Calling the apex controller method
      var RecordId = component.get("v.recordId"); // Getting the account Id in context
      action.setParams({recid:RecordId}); //passing parameters
      //Call back method to process the response  
      action.setCallback(this, function(response){  
           var ResponseValues = response.getState();
            if (ResponseValues == 'SUCCESS') {
               var Res = response.getReturnValue();
               component.set("v.mydata",Res);
               }
               else{
               }
        });
	$A.enqueueAction(action);
	}
})