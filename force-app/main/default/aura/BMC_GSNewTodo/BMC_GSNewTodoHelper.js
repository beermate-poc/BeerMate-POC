({
    /*------------------------------------------------------------
    Author:        Gopal Neeluru
    Company:       Accenture
    Description:   Create New ToDo
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopal Neeluru     Initial Creation
    ------------------------------------------------------------*/
    addToDos: function (component, event) {
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                var subjects = [];
                var dates = [];
                var action = component.get("c.createTasks"); 
                var section = [].concat(component.find("addToDoSection").find("addToDoRow"));
                section.forEach(function (todo) {
                    if (todo != null) {
                        if ((todo.find("subject").get("v.value") != null) && (todo.find("subject").get("v.value") != '')) {
                            subjects.push(todo.find("subject").get("v.value"));
                        } if ((todo.find("datepicker").get("v.value") != null) && (todo.find("datepicker").get("v.value") != '')) {
                            dates.push(todo.find("datepicker").get("v.value"));
                        }
                    }
                }, this);
                action.setParams({
                    "whatId" : null,
                    "accountId" : component.get("v.accountId"),
                    "subjects": subjects,
                    "activityDates": dates
                });
                action.setCallback(this, function (response) {
                    if (response.getState() === "SUCCESS") {
                        $A.util.addClass(spinner, "slds-hide");
                        if($A.get("$Browser.formFactor") == "DESKTOP"){
                            this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.To_Do_Were_Created"), 'success');
                        }
						else{
							this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.To_Do_Were_Created"), 'slds-theme_success');  
						}
                     component.set("v.gsloadToDos", true);
                    component.set("v.showNewToDo", false);
                    } else if (response.getState() === "ERROR") {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                            errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                               this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');  
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                   this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error'); 
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
               this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error'); 
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Gopal Neeluru
    Company:       Accenture
    Description:   run validity check on the input fields
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopal Neeluru     Initial Creation
    ------------------------------------------------------------*/
    inputValidityCheck: function (component, value) {
        try{
            if (typeof value != 'undefined' && !value.get('v.validity').valid) {
                var missingValue = value.get('v.messageWhenValueMissing');
                var message = missingValue && value.get('v.validity').valueMissing ? missingValue : $A.get("$Label.c.Complete_Required_Fields");
                if($A.get("$Browser.formFactor") == "DESKTOP"){
                    this.displayToast('warning', message, 'warning');
                } else {
                   this.displayToastMobile(component,$A.get("$Label.c.Error"),message, 'slds-theme_error'); 
                }
                return false;
            }
            return true;
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
               this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error'); 
            }
        }
    },
    /*------------------------------------------------------------
    Author:        Gopal Neeluru
    Company:       Accenture
    Description:   validate input fields on the page
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopal Neeluru     Initial Creation
    ------------------------------------------------------------*/
    validatePage: function (component, event) {
        try{
            var errorsFound = false;
            var subjects = [];
            var dates = [];
            var section = [].concat(component.find("addToDoSection").find("addToDoRow"));
            section.forEach(function (todo) {
                if ((todo.find("subject").get("v.value") != null) && (todo.find("subject").get("v.value") != '')) {
                    subjects.push(todo.find("subject").get("v.value"));
                } if ((todo.find("datepicker").get("v.value") != null) && (todo.find("datepicker").get("v.value") != '')) {
                    dates.push(todo.find("datepicker").get("v.value"));
                }
                if ((todo.find("subject").get("v.value") != null && todo.find("subject").get("v.value") != '') &&
                 (todo.find("datepicker").get("v.value") == null || todo.find("datepicker").get("v.value") == '')) {
                    if($A.get("$Browser.formFactor") == "DESKTOP"){
                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objective_Subject_And_Date_Error"), 'warning');
                    } else {
						this.displayToastMobile(component,$A.get("$Label.c.Warning"),$A.get("$Label.c.Create_Objective_Subject_And_Date_Error"), 'slds-theme_warning'); 
                    }
                    errorsFound = true;
                    return;
                }
                if ((todo.find("subject").get("v.value") == null || todo.find("subject").get("v.value") == '') &&
                 (todo.find("datepicker").get("v.value") != null && todo.find("datepicker").get("v.value") != '')) {
                    if($A.get("$Browser.formFactor") == "DESKTOP"){
                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Objective_Subject_And_Date_Error"), 'warning');
                    } else {
						this.displayToastMobile(component,$A.get("$Label.c.Warning"),$A.get("$Label.c.Create_Objective_Subject_And_Date_Error"), 'slds-theme_warning');
                    }
                    errorsFound = true;
                    return;
                }
            }, this);
            if(subjects.length == 0 && dates.length == 0){
                if($A.get("$Browser.formFactor") == "DESKTOP"){
                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Todos_no_info_error"), 'warning');
                } else {
					  this.displayToastMobile(component,$A.get("$Label.c.Warning"), $A.get("$Label.c.Create_Todos_no_info_error"),'slds-theme_warning');
                }
                errorsFound = true;
                return;
            }
            if (!errorsFound) {
                this.addToDos(component, event);
            }
        } catch(e) {
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobile(component,$A.get("$Label.c.Error"),$A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error'); 
            }
        }
    },
    /*------------------------------------------------------------
   Author:        Gopal Neeluru
    Company:       Accenture
    Description:   display toast on desktop
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopal Neeluru     Initial Creation
    ------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['Duration'] = duration
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
    Author:        Gopal Neeluru
    Company:       Accenture
    Description:   display toast on mobile
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/07/2018    Gopal Neeluru     Initial Creation
    ------------------------------------------------------------*/
    displayToastMobile: function(component, title, message, type){
        try{
            component.set("v.showErrorToast", true);
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showErrorToast", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
            console.error(e);
        }
    }
})