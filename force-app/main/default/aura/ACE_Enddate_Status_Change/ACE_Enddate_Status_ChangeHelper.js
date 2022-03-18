({
    /**
   @Author Accenture
   @name processFundRequest
   @CreateDate 05/08/2019
   @Description Function to navigate to process data on click of Process Fund Request.
  */
    processFundRequest : function(component) {
       
                var recordsSelected = component.get("v.fundrequestSelected");
                var selectedRecCount = recordsSelected.length;
                if(recordsSelected == ''){
                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.ACE_NoRecordsSelected"), 'warning');
                            $A.get('e.force:refreshView').fire();
                }
                else {
                    var acTion = component.get("c.processFundRequestRecords");
                    acTion.setParams({
                        statusChangeList : component.get("v.fundrequestSelected")
                        
                    });
                    acTion.setCallback(this, function(response) {
                        if (response.getState() === "SUCCESS") {
                            var coUnt = response.getReturnValue();
                            this.displayToast($A.get("$Label.c.Success"), selectedRecCount + ' '+$A.get("$Label.c.ACE_FundRequestProcessSuccessfully"), 'success');
                            $A.get('e.force:refreshView').fire();
                            
                        }
                        else if (response.getState() === "ERROR") {
                            this.displayToast ($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        }
                    });
                    $A.enqueueAction(acTion);
                }
            
    },
    showRecords : function(component , helper) {
        if($A.util.isUndefinedOrNull(component.get("v.estartdate")) || $A.util.isUndefinedOrNull(component.get("v.eenddate")) )
        {
            this.displayToast($A.get("$Label.c.Warning"),  $A.get("$Label.c.ACE_YearEnd_EndData_Empty"), 'warning');
        }
        else if(component.get("v.estartdate") >= component.get("v.eenddate"))
        {
            this.displayToast($A.get("$Label.c.Warning"),  $A.get("$Label.c.ACE_StartDateLessThanEndDate"), 'warning');
            // $A.get('e.force:refreshView').fire();
        }
        else{
                var acTion = component.get("c.displayFundRequestRecords");
                acTion.setParams({
                    accountId : component.get("v.selectedLookUpRecord").Id,
                    allocationId : component.get("v.selectedLookUpChannelRecord").Id,
                    esdate: component.get("v.estartdate"),
                    eedate: component.get("v.eenddate"), 
                    channel: component.get("v.channelValue")
                });
                acTion.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var allData = response.getReturnValue();
                        if(allData.length == 0){
                            this.displayToast($A.get("$Label.c.Warning"), 'No Results found', 'warning');
                            $A.get('e.force:refreshView').fire();
                        }
                        else{
                            component.set("v.showData", true);
                            component.set("v.totalPages", Math.ceil(response.getReturnValue().length/component.get("v.pageSize")));
                            component.set("v.allData", response.getReturnValue());
                            component.set("v.currentPageNumber",1);
                            helper.buildData(component, helper);
                        }
                    }
                    else if (response.getState() === "ERROR") {
                        this.displayToast ($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                    }
                });
                $A.enqueueAction(acTion);
            }
    },
    displayToast: function (title, message, type, duration) {
        try{
            var toAst = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toAst) {
                // fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['Duration'] = duration
                }
                toAst.setParams(toastParams);
                toAst.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    },
    buildData : function(component, helper) {
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.allData");
        var x = (pageNumber-1)*pageSize;
        var checked = component.get('v.isAllSelected');
        var manualSelect = component.get('v.manualSelect');
        var selectedAcctIds = component.get("v.outletsSelected");
       
        //creating data-table data
        for(; x<(pageNumber)*pageSize; x++){
            if(allData[x]){
                
                data.push(allData[x]);
            }
        }
        component.set("v.data", data);
        helper.generatePageList(component, pageNumber);
    },   
    fetchSelectedData : function(component, helper) {
     
        var  selectedFRIds = component.get("v.fundrequestSelected");
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.allData");
        var x = (pageNumber-1)*pageSize;
        var checked = component.get('v.isAllSelected');
        var manualSelect = component.get('v.manualSelect');

        //creating data-table data
        for(; x<(pageNumber)*pageSize; x++){
            if(allData[x]){
                if(!manualSelect){
                    allData[x].selected = checked;
                } else {
                    console.log('--te--'+allData[x].fundReqId);
                    console.log('--tets--'+selectedFRIds.includes(allData[x].fundReqId));
                    allData[x].selected = selectedFRIds.includes(allData[x].fundReqId);
                }              
                data.push(allData[x]);
            }
        }
        component.set("v.data", data); 
        helper.generatePageList(component, pageNumber);
           
    },
    /*
     * this function generate page list
     * */
    generatePageList : function(component, pageNumber){
        pageNumber = parseInt(pageNumber);
        var pageList = [];
        var totalPages = component.get("v.totalPages");
        if(totalPages > 1){
            if(totalPages <= 10){
                var counter = 2;
                for(; counter < (totalPages); counter++){
                    pageList.push(counter);
                } 
            } else{
                if(pageNumber < 5){
                    pageList.push(2, 3, 4, 5, 6);
                } else{
                    if(pageNumber>(totalPages-5)){
                        pageList.push(totalPages-5, totalPages-4, totalPages-3, totalPages-2, totalPages-1);
                    } else{
                        pageList.push(pageNumber-2, pageNumber-1, pageNumber, pageNumber+1, pageNumber+2);
                    }
                }
            }
        }
        component.set("v.pageList", pageList);
    },
     handleSelectAllChange: function(component, event, helper) {
         
        component.set("v.manualSelect", false);
        helper.fetchSelectedData(component, helper);   
    },
})