({
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Fetches line items associated with Reimbursement Header (PartnerFundClaim) record Related_Header_Id__c 
       					and displays them in table. 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    Init : function(component, event, helper) {
        helper.getReimbursementLineItems(component, event, helper);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Saves line items after user has made updates in table. 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    saveLineItems :  function (component, event, helper) {
         // helper.saveLineItemsOnServer(component, event, helper);
        var lines = component.get("v.reimbursementLines");
        var validLineItem = true;
        for(var idx=0;idx < lines.length;idx++){
            if(lines[idx].line.ACE_Total_Expenditure__c <= 0){
                validLineItem = false;
                helper.showToast({
                    "title": "Error!",
                    "type": "error",
                    "message": "The expenditure amount cannot be zero or a negative number."
                });
            }
            if(lines[idx].line.ACE_Requested_Reimbursement__c < 0){
                validLineItem = false;
                helper.showToast({
                    "title": "Error!",
                    "type": "error",
                    "message": "The reimbursement amount cannot be a negative number."
                });
            }
        }
        if(validLineItem){
            helper.saveLineItemsOnServer(component, event, helper);
        }
    },
    
    updateComments : function(component, event, helper){
        var updatedComment = event.target.value;
        var lineIdx = event.target.id;
        
        var lines = component.get("v.reimbursementLines");
        
        for(var idx=0;idx < lines.length;idx++){
            if(lines[idx].line.ACE_Line_Item_Index__c == lineIdx){
                lines[idx].line.ACE_Comments__c = updatedComment;
            }
        }
		component.set("v.reimbursementLines", lines);
    }
})