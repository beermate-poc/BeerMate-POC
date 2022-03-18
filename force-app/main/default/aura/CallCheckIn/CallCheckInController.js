({
	doInit : function(component, event, helper) {
        try{
			  if(navigator.onLine){
				  if(navigator.geolocation){
					  if(navigator.geolocation.getCurrentPosition){
						  navigator.geolocation.getCurrentPosition(function(event) {
							  var latitude=event.coords.latitude;
							  var longitude=event.coords.longitude;
							  var action=component.get("c.CallCheckIn");
							  var recordid= component.get("v.recordId");
                              $A.util.removeClass(component.find('spinner'),"slds-hide");
                               helper.callServer(component,"c.CallCheckIn",function(response){
                                 var responseValues = response.getState();
                                    $A.util.addClass(component.find('spinner'),"slds-hide");
                                  	  if(responseValues === 'SUCCESS') {
									  var retval= response.getReturnValue();
                                          if(retval!='error'){
                                           var navEvent = $A.get("e.force:navigateToSObject");
                                      		  navEvent.setParams({
                                              recordId: retval,
                                              slideDevName: "detail"
                                         });
                                        navEvent.fire(); 
                                          
                                      }
									 /* var statLabel = $A.get("$Label.c.C360_InProgressStatus"); 
										  if(retval[0].C360_Status__c===statLabel){
											  $A.get("e.force:closeQuickAction").fire();
											  $A.get('e.force:refreshView').fire(); 
										  }  
										  else{
                                              component.set("v.statusCheck","True");
                                              component.find("eventNote").set("v.value",retval[0].C360_Call_Notes__c);
										  }*/
								  }
								  else if( responseValues === "ERROR") {
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
                                  
                                   $A.util.addClass(component.find('spinner'),"slds-hide");
                              },
         
                              recordid,latitude,longitude
                                                
                             );
                                  
                          
							
						  }
							  /*action.setParams({latitude:event.coords.latitude,longitude:event.coords.longitude,recid:recordid});     
							  action.setCallback(this, function(response){
								  var responseValues = response.getState();
                                  $A.util.addClass(component.find('spinner'),"slds-hide");
								  if(responseValues === 'SUCCESS') {
									  var retval= response.getReturnValue();
                                      if(retval!='error'){
                                           var navEvent = $A.get("e.force:navigateToSObject");
                                      		  navEvent.setParams({
                                              recordId: retval,
                                              slideDevName: "detail"
                                         });
                                         navEvent.fire(); 
                                          
                                      }else{
                                    if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
											helper.displayToast(component,$A.get("$Label.c.Error"),$A.get("$Label.c.Call_Check_In_Error"),'error');   
									  }else{ 
										helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),$A.get("$Label.c.Call_Check_In_Error"),'slds-theme_error'); 
								      }
                                          
                                     }
                                     
								  }
								  else if( responseValues === "ERROR") {
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
						  }*/,function(error){ 
                              if(error.message===null ||error.message===''){
                                  error.message=$A.get("$Label.c.C360_GPSError");
                              }
                              
							  if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
								helper.displayToast(component,$A.get("$Label.c.Error"),error.message,'error');   
							  }
                              else{ 
								helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),error.message, 'slds-theme_error'); 
							  }
						  })     
					  }
				  }
			  }   
			  else{
                  if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
                  	helper.displayToast(component,$A.get("$Label.c.Error"),$A.get("$Label.c.Internet_Connection_Error_Msg"),'error'); 
                  }
                  else{ 
					helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),$A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_error'); 
				  }

			  } 
		  }catch(e){
              if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP")){
              	helper.displayToast(component,$A.get("$Label.c.Error"),e.message,'error');   
              }
              else{ 
					helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),e.message, 'slds-theme_error'); 
				  }
          }

	 }
})