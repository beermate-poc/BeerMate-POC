({
	/*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   navigates to account record
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	9/14/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
	navigateToDetailsView : function(accountId) {
		var event = $A.get("e.force:navigateToSObject");
		event.setParams({
			"recordId": accountId
		});
		event.fire();
	},
	/*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   displays toast
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	9/14/2017    Bryant Daniels     Initial Creation
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
				toast.setParams(toastParams);
				toast.fire();
			} else {
				// otherwise throw an alert
				alert(title + ': ' + message);
			}
		} catch(e){
			console.error(e);
		}
	}
})