({
    doInit : function(component, event, helper) {
	var action = component.get("c.manualShareRead");
    component.set("v.Spinner", true);
    var recordId= component.get("v.recordId");
	action.setParams({"recordId":recordId});
    action.setCallback(this,function(response){
    var responseValues = response.getState();
    if(responseValues === 'SUCCESS') 
    {
	//debugger;
        var retval= response.getReturnValue();        
        if(retval.includes('success')){
           //retval ='Record Shared successfully';
            if($A.get("$Browser.formFactor") === 'DESKTOP'){
												
                helper.displayToast(component,$A.get("$Label.c.Success"),$A.get("$Label.c.SuccessMessageForCoaching"),'Success');   
											 
            }else{ 
												
                helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Success"),$A.get("$Label.c.SuccessMessageForCoaching"), 'Success'); 
											  
            } 
        }else{
            //retval ='You are not authorized to share this record';
            
            if($A.get("$Browser.formFactor") === 'DESKTOP'){
												
                helper.displayToast(component,$A.get("$Label.c.Error"),$A.get("$Label.c.ErrorMessageForCoaching"),'Error');   
											 
            }else{ 
												
                helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),$A.get("$Label.c.ErrorMessageForCoaching"), 'slds-theme_error'); 
											  
            } 
            
        }
        }else if( responseValues === "ERROR") {
       		 var errors = response.getError();
			if (errors) {
	    	if (errors[0] && errors[0].message) {
			if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
												
                helper.displayToast(component,$A.get("$Label.c.Error"),errors[0].message,'error');   
											 
            }
											  
            else{ 
												
                helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"), errors[0].message, 'slds-theme_error'); 
											  
            }
										 
        }
									  
        }
								 
    }
								 
        else if(responseValues ==="INCOMPLETE"){ 
									 
            if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
										
                helper.displayToast(component,$A.get("$Label.c.Error"),$A.get("$Label.c.Internet_Connection_Error_Msg"),'error');   
									  
            } 
                                      
            else{ 
										
                helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),$A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_error'); 
								     
            }
								 
        }
        });
 $A.enqueueAction(action);
},


});