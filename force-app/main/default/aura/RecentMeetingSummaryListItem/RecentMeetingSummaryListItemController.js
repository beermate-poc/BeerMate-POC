/**
 * Created by bryantdaniels on 9/12/17.
 */
({
	/*------------------------------------------------------------
    Author:        Bryant Daniels
    Company:       Slalom, LLC
    Description:   calls helper to toggle selected section
    History
    <Date>      <Authors Name>     <Brief Description of Change>
    9/12/17    Bryant Daniels     Initial Creation
    ------------------------------------------------------------*/
	toggleSection : function(component, event, helper) {
		helper.helperToggleSection(component,event,'summaryContent');
	},
})