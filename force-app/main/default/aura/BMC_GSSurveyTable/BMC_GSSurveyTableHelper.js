({
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
    /*------------------------------------------------------------
	Author:        Gopal Neeluru
	Company:       Accenture
	Description:   Method to fetch Surveys
	<Date>      <Authors Name>     <Brief Description of Change>
	08/06/2018    Gopal Neeluru     Initial Creation
	------------------------------------------------------------*/
    getSurveyTaken :function(component, event, helper,AccountId) {
        try{
		if(navigator.onLine){
        var actionSurvey = component.get("c.getSurveysTaken");
        actionSurvey.setParams({accountId : AccountId});
        actionSurvey.setCallback(this, function(response) {
            var stateVal = response.getState();
            if (stateVal === "SUCCESS") {
                
                component.set('v.surveycolumns', [
                    {label:'Name' , fieldName: 'Survey_Name__c', type: $A.get("$Label.c.BMC_GSDataTypeText")},
                    {label:'Last Execution', fieldName: 'LastModifiedDate ' , type: 'text'},
                    {label: 'Executed By', fieldName: 'userName', type: 'text'}
                ]);
                var rowsData = response.getReturnValue();
                var dataVal =[];
                for (var i = 0; i < rowsData.length; i++) {
                    var rowVal = rowsData[i];
                    if(!$A.util.isEmpty(rowVal.User__c)){
                        rowVal.userName = rowVal.User__r.Name;
                        dataVal.push(rowVal);
                    }
                    
                }
                component.set("v.surveydata",dataVal);
            }
            else if (response.getState() === "ERROR") {
                            var errorsVal = response.getError();
                            if (errorsVal) {
                            if (errorsVal[0] && errorsVal[0].message) {
                            
                        }
                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                    } else {
                        
                    }
                }
        });
        $A.enqueueAction(actionSurvey);
			 }
			 else {
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
	}
	 catch(e){
            
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
        }
		
    }
})