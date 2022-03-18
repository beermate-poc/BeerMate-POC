({
	/*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   returns array of sub types
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    6/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
	loadSubTypeValues : function(component, event, helper) {
		try{
			var subTypeField = component.get("v.ObjectiveSubType");
			if(subTypeField != null && subTypeField != ''){
				var subTypes = subTypeField.split(",").map(function(item) {
					return item.trim();
				});
				component.set("v.subTypeValues", subTypes);
			}
		} catch(e){
			console.error(e);
		}
	}
})