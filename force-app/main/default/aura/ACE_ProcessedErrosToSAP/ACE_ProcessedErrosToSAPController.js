/*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Approved Reimbursement Processing to SAP.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	12/12/2018   Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
({
    doInit : function(cmp, event, helper) {
        helper.loadBatchRunDate(cmp, event, helper);
    },
    handleClaimErrors : function(cmp, event, helper) {
        debugger;
        helper.loadDataTableRepeat(cmp,event,helper);
    },
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Updates the total reimbursement count selected for SAP Processing.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	12/12/2018   Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    updateSelectedRow: function (cmp, event) {
        debugger;
        var selectedRows = event.getParam('selectedRows');
        cmp.set('v.selectedRowList',selectedRows)
        var action = cmp.get("c.getTotalClaims");
        action.setParams({
            listClaims: selectedRows
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                cmp.set('v.selectedRowsCount', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Send claims to SAP for repeat processing.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	12/12/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    sendClaimsSAP: function (cmp, event,helper) {
        debugger;
        cmp.set('v.isLoading', false);
        var selectedRow = cmp.get('v.selectedRowList');
        if(selectedRow.length == 0){
            helper.showtoastMessage(cmp, event, helper,"Info!","info","You have not selected claims to send to SAP.");
        }
        else if(selectedRow.length > 200){
            helper.showtoastMessage(cmp, event, helper,"Info!","info","Total Claims selected cannot exceed 200 records for repeat processing.");
        }
        else
        {
            var action = cmp.get("c.sendClaimsOnRepeat");
            action.setParams({
                listClaims: selectedRow
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    if(response.getReturnValue() =='Success'){ 
                    	helper.showtoastMessage(cmp, event, helper,"Success!","success","Reimbursement claims processed succesfully.");
                    	helper.loadDataTableRepeat(cmp, event,helper);
                    }
                    else
                    helper.showtoastMessage(cmp, event, helper,"Error!","error","Reimbursement claims proceesing Failed.");
                }
                else{
                    helper.showtoastMessage(cmp, event, helper,"Error!","error","Reimbursement claims proceesing Failed.");
                }
            });
            $A.enqueueAction(action);
        }
        
    },
    
    criteriaChanged: function (cmp, event) {
        debugger;
        if(document.getElementById("radio-1b").checked ==true){
            cmp.set("v.processingValue",false);
            cmp.set("v.processingValuerep",true);
        }
        else{
            cmp.set("v.processingValue",true);
            cmp.set("v.processingValuerep",false);
            cmp.set("v.showClaims",false);
        }
    },
    /*------------------------------------------------------------
•	Company:       Accenture
•	Description:   Send claims to SAP for Normal processing.
•	<Date>      <Authors Name>     <Brief Description of Change>
•	12/12/2018    Rajeshwari Shetty     Initial Creation
•	------------------------------------------------------------*/
    sendClaimNormal: function (cmp, event,helper) {
        	debugger;
        	var dateObj1 = cmp.get("v.LastBatchRun");
        	var dateObj = new Date(dateObj1);
            var action = cmp.get("c.sendClaimsNormal");
            action.setParams({
                startDate: dateObj
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    if(response.getReturnValue() =='Success')
                    helper.showtoastMessage(cmp, event, helper,"Success!","success","Reimbursement claims processed succesfully.");
					else
                    helper.showtoastMessage(cmp, event, helper,"Error!","error","Reimbursement claims proceesing Failed.");
                }
                else{
                    helper.showtoastMessage(cmp, event, helper,"Error!","error","Reimbursement claims proceesing Failed.");
                }
            });
            $A.enqueueAction(action);
    },
    updateColumnSorting: function (cmp, event, helper) {
        debugger;
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    }
    
    
})