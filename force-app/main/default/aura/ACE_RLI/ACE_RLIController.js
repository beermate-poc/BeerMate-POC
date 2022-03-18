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
        helper.sendRecordsToServer(component, event, helper);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Updates Reason Code field with user input.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/    
    changeReasonCode :  function(component, event, helper)   {
        var index=event.getSource().get('v.name');
        var getReasonCode = event.getSource().get('v.value');
        var itemList=component.get("v.reimbursementLines");
        itemList[index].line.ACE_Reason_Code__c=getReasonCode;
        component.set("v.reimbursementLines",itemList);  
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Updates Spend Type field with user input.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/ 
    updateSpendType : function(component, event, helper){
        var index=event.getSource().get('v.name');
        var selectedSpendType = event.getSource().get('v.value');
        var itemList=component.get("v.reimbursementLines");
        itemList[index].line.ACE_Spend_Type__c = selectedSpendType;
        component.set("v.reimbursementLines",itemList);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Removes IO when user clicks X on pill displaying IO name.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    handleIORemove : function(component, event, helper){
        var currentRow = event.target.id;
        var reimbursements = component.get("v.reimbursementLines");
        reimbursements[currentRow].line.Internal_Order__c = null;
        reimbursements[currentRow].internalOrderNumber = "";
        component.set("v.reimbursementLines", reimbursements);
    },
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Opens modal for user to perform custom lookups. Currently doing lookup on IO and Brand (Profit Center).
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/    
    openModal : function(component, event, helper){
        var index = event.getParams().data.index;
        var obj = event.getParams().data.lookup;

        component.set("v.currentRowSelected",index);
        component.set("v.currentFieldSelected",obj);

        var modal = component.find(obj + "-modal");
        var lookupCmp = component.find(obj);
        lookupCmp.set("v.value", null);
        lookupCmp.set("v.valueLabel", null);
        lookupCmp.set("v.pageNumber", 1);
        lookupCmp.set("v.offset", 0);
        lookupCmp.set("v.resultSize", 0);
        lookupCmp.set("v.recordsToDisp",[]);
        modal.set("v.showModal", true); 
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Updates IO or Brand WC field when user selects from custom lookup component (strike_lookup).
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    updateRow : function(component, event, helper){
        var currentRow = component.get("v.currentRowSelected");
        var currentField = component.get("v.currentFieldSelected");
        var reimbursements = component.get("v.reimbursementLines");

        var record = event.getParams().data

        if(currentField == "Internal_Order__c"){
            var id = record.find(function(field){
                return field.fieldName === 'id';
            });

            var ioNumber = record.find(function(field){
                return field.fieldName === 'Internal Order Number';
            });

            var brand = record.find(function(field){
                return field.fieldName === 'Brand';
            });

            reimbursements[currentRow].line.Internal_Order__c = id.value;
            reimbursements[currentRow].internalOrderNumber = ioNumber.value;
            reimbursements[currentRow].brand = brand.value;
        } else if (currentField == "ACE_Profit_Center__c"){
              var brandWC = record.find(function(field){
                  return field.fieldName === 'Profit Center ID';
              });
              reimbursements[currentRow].brandWC= brandWC.value;
        }
        var modal = component.find(currentField + "-modal");
        modal.set("v.showModal", false);
        component.set("v.reimbursementLines", reimbursements);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Removes IO when user clicks X on pill displaying IO name.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/    
    handleBrandWCRemove : function(component, event, helper){
        var currentRow = event.target.id;
        var reimbursements = component.get("v.reimbursementLines");
        reimbursements[currentRow].brandWC = null;
        component.set("v.reimbursementLines", reimbursements);        
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