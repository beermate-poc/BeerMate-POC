<!--
Author:         Nick Serafin
Company:        Slalom, LLC
Description:    Conatiner App to hold the ContactHierarchy component in order to be embeded in a visualforce page with lightning:out
Attributes:     recordId – Id of the Call Plan

History
<Date>      <Authors Name>     <Brief Description of Change>
12/14/2017    Nick Serafin        Initial Creation
-->
<aura:application access="GLOBAL" extends="ltng:outApp">
	<aura:dependency resource="c:ContactHierarchy"/>
</aura:application>