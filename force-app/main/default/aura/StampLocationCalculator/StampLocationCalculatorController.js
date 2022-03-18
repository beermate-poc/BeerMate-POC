({
	doInit : function(component, event, helper) {
        var geoCode = '';
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function showPosition(position) {
                geoCode = position.coords.latitude+';'+position.coords.longitude;
                //console.log('geoCode'+geoCode);
                var action = component.get("c.updateCalculation");
				action.setParams({ 
					recId : component.get('v.recordId'), 
					geoCodes: geoCode
					
				});
				action.setCallback(this, function(response) {
					var state = response.getState();
					if (state === "SUCCESS") {
                        var recordType = response.getReturnValue();
						
                        if(recordType.includes('On Premise Assortment Tool - Step 1')){
                          component.set("v.Message",$A.get("$Label.c.Assortment_Geolocation_Msg"));
                        $A.get('e.force:refreshView').fire();  
                        }
                        else if(recordType.includes("Outil d'assortiment C.S.P. - Étape 1")){
                          component.set("v.Message",$A.get("$Label.c.Assortment_Geolocation_Msg"));
                        $A.get('e.force:refreshView').fire();  
                        }
                         else if(recordType.includes("Outil d'assortiment C.S.P. (CA/GBR/I) - Étape 1")){
                          component.set("v.Message",$A.get("$Label.c.Assortment_Geolocation_Msg"));
                        $A.get('e.force:refreshView').fire();  
                        }
                        else {
						component.set("v.Message",$A.get("$Label.c.GeoLocationStamped"));
                        $A.get('e.force:refreshView').fire();
                        }
					} else if (state === "ERROR") {
						var errors = response.getError();
                       if (errors) {
							if (errors[0] && errors[0].message) {
								console.log("Error message: " + 
										errors[0].message);
							component.set("v.Message",errors[0].message);	
							}
						} else {
							console.log("Unknown error");
							component.set("v.Message","	Unknown error while stamping Geo Codes! Please reach out to admin.");
						}
					}
				});
				$A.enqueueAction(action);
            });
            window.setTimeout(
                $A.getCallback(function() {
                    if(!geoCode){
                
                        component.set("v.Message",$A.get("$Label.c.GeoLocationNotStamped"));
                    }
                }), 1000
            );
        	
        //alert(geoCode);                                             
        
        }else{
            component.set("v.Message",$A.get("$Label.c.GeoLocationNotStamped"));
        }
			
	}
})