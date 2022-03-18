({
    createPost : function(component, event, helper){
        try{
            if(navigator.onLine){
                if(!$A.util.isEmpty(component.find("textval").get("v.value"))){
                    var accId  = component.get("v.accrec").Id;
                    var commentVal = component.find("textval").get("v.value");
            	var actionPost = component.get("c.createChatterPost");
                    actionPost.setParams({ accountId : accId,comment : commentVal,fileId : component.get("v.fileId")});
                            actionPost.setCallback(this, function (data) {
                                if (data.getState() === "SUCCESS") {
                                   this.displayToast($A.get("$Label.c.Success"),$A.get("$Label.c.BMC_GSChatterSuccess"), 'success'); 
                                    component.set("v.showPostChatter",true);
                                }else {
                                    var errorsVal = data.getError();
                                    if (errorsVal) {
                                        if (errorsVal[0] && errorsVal[0].message) {
                                           
                                        }
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                    }
                                }
                                
                            });
                            $A.enqueueAction(actionPost);
                }
                    
            }else {
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                       }
        } catch(e){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error'); 
        }
        
   },
    
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   displays toast for dekstop
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018   Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toastMsg = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toastMsg) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toastMsg.setParams(toastParams);
                toastMsg.fire();
            } 
        } catch(e){
           
        }
    },
    getcurrentUser : function(component, event, helper){
        try{
            if(navigator.onLine){
            	var actionUser = component.get("c.getLoggedInUser");
                            actionUser.setCallback(this, function (data) {
                                if (data.getState() === "SUCCESS") {
                                    component.set("v.user",data.getReturnValue());
                                }else {
                                    var errorsVal = data.getError();
                                    if (errorsVal) {
                                        if (errorsVal[0] && errorsVal[0].message) {
                                            
                                        }
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        
                                    }
                                }
                                
                            });
                            $A.enqueueAction(actionUser); 
            }else {
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                       }
        } catch(e){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error'); 
        }
        
   },
    
    /*------------------------------------------------------------
Author:        Ankita Shanbhag
Company:       Accenture
Description:   Returns the list of accounts based on searched Account Name
History
<Date>      <Authors Name>     <Brief Description of Change>
7/8/2018    Ankita Shanbhag    Initial Creation
------------------------------------------------------------*/
    userSearch : function(component, event, helper,searchString){        
            var actionSearch = component.get("c.searchUserName");
		actionSearch.setParams({
		   userName: searchString
		});
		actionSearch.setCallback(this, function(a) {
			var stateVal = a.getState();
			if (stateVal === "SUCCESS") {
                component.set("v.userlist",a.getReturnValue());
			}
		});
		$A.enqueueAction(actionSearch);
        },
    
})