({
    loadBatchRunDate : function(cmp, event,helper) {
        debugger;
        cmp.set("v.processingValue",true);
        var action = cmp.get("c.getClaimProcessDetails");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
               var respon = response.getReturnValue();
                
                var formateddate =$A.localizationService.formatDate(respon, "MMMM dd yyyy, hh:mm:ss a");
                var formateddate1 =$A.localizationService.formatDate(respon, "yyyy-MM-dd hh:mm:ss a");
                cmp.set("v.LastBatchRun",formateddate);
                cmp.set("v.LastBatchNoFormat",formateddate1);
            }
        });
        $A.enqueueAction(action);
    },
    loadDataTableRepeat : function(cmp, event,helper) {
        debugger;
        cmp.set("v.columns",[
            {label:"Claim Title", fieldName:"Record_URL__c",type:"url",typeAttributes: {label: { fieldName: 'Title' }},sortable: "true" },
            {label:"Header Record Number", fieldName:"ACE_Header_Record_Read__c",type:"text",sortable: "true"},
            {label:"Fund Request ID", fieldName:"Request",type:"text",sortable: "true"},
            {label:"Approve and Release ID", fieldName:"Allocation",type:"text",sortable: "true"},
            {label:"Ship To", fieldName:"Account_Ship_To__c",type:"text",sortable: "true"},
            {label:"Status", fieldName:"ACE_Reimbursement_Status__c",type:"text",sortable: "true"},
            {label:"Approved Date", fieldName:"ACE_Approval_Date__c",type:"date",sortable: "true"},
            {label:"Amount", fieldName:"ACE_Total_Requested_Reimbursement_Read__c",type:"currency",cellAttributes: { alignment: 'left' },sortable: "true"}
        ]);
        if(cmp.get("v.requestID") == null && cmp.get("v.allocId") == null  && cmp.get("v.headerId")==null && cmp.get("v.rangeStart")==null && cmp.get("v.rangeEnd")==null && cmp.get("v.shipTo")==null){
            helper.showtoastMessage(cmp, event, helper,"Info!","info","Please Enter valid Filter Criteria.");
        }
        else if((cmp.get("v.rangeStart")!=null && cmp.get("v.rangeEnd")==null) ||(cmp.get("v.rangeStart")==null && cmp.get("v.rangeEnd")!=null))
        {
            helper.showtoastMessage(cmp, event, helper,"Info!","info","Please Enter valid date Range.");
        }
            else if(cmp.get("v.shipTo") != null && (cmp.get("v.rangeStart")==null || cmp.get("v.rangeEnd")==null))
            {
                helper.showtoastMessage(cmp, event, helper,"Info!","info","Please Enter valid date Range.");
            }
                else{
                    var stDate= cmp.get("v.rangeStart");
                    var enDate= cmp.get("v.rangeEnd");
                    var action = cmp.get("c.getClaims");
                    action.setParams({
                        requestId: cmp.get("v.requestID"),
                        allocId: cmp.get("v.allocId"),
                        headerId: cmp.get("v.headerId"),
                        startdate: stDate,
                        endDate: enDate,
                        shipToId:cmp.get("v.shipTo")
                    });
                    action.setCallback(this, function(response) {
                        var state = response.getState();
                        if (state === "SUCCESS") {
                            if(response.getReturnValue().length == 0){
                                helper.showtoastMessage(cmp, event, helper,"Info!","info","No records to dispaly.");
                                cmp.set("v.showClaims",false);
                            }
                            else{
                                var rows = response.getReturnValue();
                                cmp.set("v.selectedData",response.getReturnValue());
                                for (var i = 0; i < rows.length; i++) {
                                    var row = rows[i];
                                    if (row.Allocation) row.Allocation = row.Allocation.ACE_FY_Promotion_ID__c;
                                    if (row.Request) row.Request = row.Request.ACE_FY_Fund_Request_ID__c;    
                                    if (row.Account_Ship_To__c) row.Account_Ship_To__c = row.Account_Ship_To__r.Name;
                                    if(row.ACE_Reimbursement_Status__c=='PaymentPending') row.ACE_Reimbursement_Status__c = 'Payment Pending';
                                }
                                cmp.set("v.data",rows);
                                cmp.set("v.showClaims",true);
                            }
                        }
                    });
                    $A.enqueueAction(action);
                }
    },
    showtoastMessage : function(component, event, helper,title,type,msg) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": title,
            "type": type,
            "message":msg
        });
        toastEvent.fire();
    },
    sortData: function (cmp, fieldName, sortDirection) {
        var data = cmp.get("v.data");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse))
        cmp.set("v.data", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
        function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
    
    
})