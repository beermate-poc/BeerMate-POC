({
	postChatter : function(component, event, helper) {
	helper.createPost(component, event, helper);	
	},
    closeChatterPost : function(component, event, helper) {
        component.set("v.showPostChatter",true);
    },
    doInit : function(component, event, helper) {
        helper.getcurrentUser(component, event, helper);
    },
    handleUploadFinished: function (component, event, helper) {
        // Get the list of uploaded files
        var uploadedFiles = event.getParam("files");
        try{
            if(navigator.onLine){
                if(uploadedFiles.length > 0){
                 	var actionFile = component.get("c.getUploadedFile");
                            actionFile.setCallback(this, function (data) {
                                if (data.getState() === "SUCCESS") {
                                    component.set("v.fileId",data.getReturnValue());
                                }else {
                                    var errorsVal = data.getError();
                                    if (errorsVal) {
                                        if (errorsVal[0] && errorsVal[0].message) {
                                            
                                        }
                                            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        
                                    }
                                }
                                
                            });
                            $A.enqueueAction(actionFile);   
                }
                
            }  else {
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        }catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error'); 
        }
    },    
    /*------------------------------------------------------------
Author:        Gopala Neeluru
Company:       Accenture
Description:   calls user search method present in helper
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    searchUsers: function (component, event,helper) {
        try{
            if(navigator.onLine){
                 if(component.find("userName").get("v.value").length >=4){
                     component.set("v.searchString",component.find("userName").get("v.value"));
           			helper.userSearch(component, event,helper,component.find("userName").get("v.value"));
        		}
            }
            else {
                    helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'error');
            }
        }
        catch(e){
                helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } 
    },
    setSelectedUser : function (component, event,helper) {
        var usrName = event.currentTarget.getAttribute("data-attriVal");
        var usrId = event.currentTarget.getAttribute("data-set");
        component.find("userName").set("v.value",usrName);
        component.set("v.disabled",true);
        component.set("v.searchString",'');
    }
})