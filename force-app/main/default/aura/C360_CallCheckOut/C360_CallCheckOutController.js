({
	 
	 /*------------------------------------------------------------
    Author:        Accenture IDC
    Description:   This method captures geolocation  and pass coordinates to server method to capture checkin and checkout details
    ------------------------------------------------------------*/
    intiateCall : function(component, event, helper) {  
		  try{
			  if(navigator.onLine){
				  if(navigator.geolocation){
					  if(navigator.geolocation.getCurrentPosition){
						  navigator.geolocation.getCurrentPosition(function(event) {
							  var latitude=event.coords.latitude;
							  var longitude=event.coords.longitude;
							  var action=component.get("c.getStartGeoLocation");
							  var recordid= component.get("v.recordId");
                              $A.util.removeClass(component.find('spinner'),"slds-hide");
                              /*var inputParam={
                                  "latitude":latitude,
                                  "longitude":longitude,
                                  "recid":recordid
                              };*/
							  //action.setParams({latitude:event.coords.latitude,longitude:event.coords.longitude,recid:recordid});
                              
                               helper.callServer(component,"c.getStartGeoLocation",function(response){
                                 var responseValues = response.getState(); 
                                  	  if(responseValues === 'SUCCESS') {
									  var retval= response.getReturnValue();
									  var statLabel = $A.get("$Label.c.C360_InProgressStatus"); 
										  if(retval[0].C360_Status__c===statLabel){
											  $A.get("e.force:closeQuickAction").fire();
											  $A.get('e.force:refreshView').fire(); 
										  }  
										  else{
                                              component.set("v.statusCheck","True");
                                              component.find("eventNote").set("v.value",retval[0].C360_Call_Notes__c);
										  }
								  }
								  else if( responseValues === "ERROR") {
									  var errors = response.getError();  
                                       
									  if (errors) {
										  if (errors[0] && errors[0].message) {
											  if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP") ||
                                                $A.get("$Browser.formFactor") === 'DESKTOP'){
												helper.displayToast(component,$A.get("$Label.c.Error"),errors[0].message,'error');   
											  }
											  else{ 
												helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"), errors[0].message, 'slds-theme_error'); 
											  }
										  }
									  }
                                      

								  }
								  else if(responseValues ==="INCOMPLETE"){ 
									  if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP" ) ||
                                         $A.get("$Browser.formFactor") === 'DESKTOP'
                                        ){
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
                                  
                          
							
						  },function(error){ 
                              if(error.message===null ||error.message===''){
                                  error.message=$A.get("$Label.c.C360_GPSError");
                              }
                              
							  if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP") ||
                                $A.get("$Browser.formFactor") === 'DESKTOP'){
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
                  if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP") ||
                    $A.get("$Browser.formFactor") === 'DESKTOP'){
                  	helper.displayToast(component,$A.get("$Label.c.Error"),$A.get("$Label.c.Internet_Connection_Error_Msg"),'error'); 
                  }
                  else{ 
					helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),$A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_error'); 
				  }

			  } 
		  }catch(e){
              if($A.get("$Browser.formFactor") === $A.get("$Label.c.DESKTOP") ||
                $A.get("$Browser.formFactor") === 'DESKTOP'){
              	helper.displayToast(component,$A.get("$Label.c.Error"),e.message,'error');   
              }
              else{ 
					helper.displayToastMobileCallLog(component,true,$A.get("$Label.c.Error"),e.message, 'slds-theme_error'); 
				  }
		  }
	},
    
    /* This method calls pagerefresh event to refresh the page*/
    refreshPage:function(component, event, helper) {  
    } ,
    
    /* Automatically call when the component is done waiting for a response to a server request*/ 
    hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.toggleClass(spinner, "slds-hide");
        //var evt = spinner.get("e.toggle");
        //evt.setParams({ isVisible : false });
        //evt.fire();    
    } ,
    
   /* automatically call when the component is waiting for a response to a server request*/
    showSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        $A.util.toggleClass(spinner, "slds-show");
            //var evt = spinner.get("e.toggle");
            //evt.setParams({ isVisible : true });
            //evt.fire();    
    } ,
    UpdateEvent : function (component, event, helper){
        var eventSum = component.find("eventNote").get("v.value");
       // var objSum = component.find("ObjectiveSummary").get("v.value");
        var action = component.get("c.saveCallLogSummary");
        var recordid= component.get("v.recordId");
        //alert('recordid'+recordid);
         action.setParams({"recid":recordid,"eventSum":eventSum});     
		 action.setCallback(this, function(response){
               // alert('insnide');
             var responseValues = response.getState();
             if(responseValues === 'SUCCESS') {

            $A.get("e.force:closeQuickAction").fire();
		    $A.get('e.force:refreshView').fire();
             }else{
                 alert('error');
                 
             }
         });
          $A.enqueueAction(action);

}
    
})