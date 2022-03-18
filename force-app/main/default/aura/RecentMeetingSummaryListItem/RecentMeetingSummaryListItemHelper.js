/**
 * Created by bryantdaniels on 9/12/17.
 */
({
	/*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   show/hide selected section
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
	helperToggleSection : function(component,event,secId) {
		try{
			var acc = component.find(secId);
			for(var cmp in acc) {
				$A.util.toggleClass(acc[cmp], 'slds-show');
				$A.util.toggleClass(acc[cmp], 'slds-hide');
			}
		} catch(e){
			console.error(e);
		}
	}
})