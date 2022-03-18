({
    /**
   @Author Accenture
   @name processFundRequest
   @CreateDate 05/08/2019
   @Description Function to navigate to process data on click of Process Fund Request.
  */
    showRecords: function(component, event, helper) {
        component.set('v.columns', [            
            {label: 'Channel Partner', fieldName: 'channelPartner', type: 'text'},
            {label: 'Allocation', fieldName: 'allocation', type: 'text'},
            {label: 'Account Ship To', fieldName: 'accountShipTo', type: 'text'}, 
            {label: 'Title', fieldName: 'title', type: 'text'},
            {label: 'Description', fieldName: 'description', type: 'text'},
            {label: 'Start Date', fieldName: 'startDate', type: 'date'},
            {label: 'End Date', fieldName: 'endDate', type: 'date'},
            {label: 'Status', fieldName: 'status', type: 'text'},
            {label: 'Amount', fieldName: 'amount', type: 'currency',  typeAttributes: { currencyCode: 'USD'}},
            {label: 'Co Op Event', fieldName: 'coopevent', type: 'text'}
        ]);
        helper.showRecords(component,helper);
    },
    
    processFundRequest: function(component, event, helper) {
        helper.processFundRequest(component);
    },
    onNext : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber+1);
        helper.fetchSelectedData(component, helper);
    },
    onPrev : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber-1);
        helper.fetchSelectedData(component, helper);
    },
    processMe : function(component, event, helper) {
        component.set("v.currentPageNumber", parseInt(event.target.name));
        helper.fetchSelectedData(component, helper);
    },
    onFirst : function(component, event, helper) {        
        component.set("v.currentPageNumber", 1);
        helper.fetchSelectedData(component, helper);
    },
    onLast : function(component, event, helper) {        
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.fetchSelectedData(component, helper);
    },
    onSelectAllChange: function(component, event, helper) { 
        var selectedFRIds = [];
        var unselectedFRIds = [];
        component.set("v.loaded", false);
        setTimeout(function(){
            component.set("v.loaded", true);
        }, 3000);
        var checked = event.getSource().get("v.value");
        var allData = component.get("v.allData");
        for(var x =0 ; x< allData.length; x++){
        	if(allData[x]){
                
                if(checked) {
                    selectedFRIds.push(allData[x].fundReqId);
                }
                else{
                    unselectedFRIds.push(allData[x].fundReqId);
                }
            }
        }
       component.set("v.fundrequestSelected", selectedFRIds);
       component.set("v.fundrequestUnselected", unselectedFRIds);
       helper.handleSelectAllChange(component, event, helper);  
    },
    onSelectChange: function(component, event, helper){
        var maxSelectionSize = component.get("v.maxSelectionSize");
        var selectedFRIds = component.get("v.fundrequestSelected");
        var unselectedFRIds = component.get("v.fundrequestUnselected");
        var unselectedFRIds1 =[]; 
        
        var checked = event.getSource().get("v.value");
        var acctId = event.getSource().get("v.name");
        if(checked){
            selectedFRIds.push(acctId);
            unselectedFRIds = unselectedFRIds.filter(function(value, index, arr){
                return value != acctId;
            })
        } else {
            selectedFRIds = selectedFRIds.filter(function(value, index, arr){
                return value != acctId;
            })
            unselectedFRIds.push(acctId);
        }
        
        if(selectedFRIds.length <= maxSelectionSize){ 
            component.set("v.manualSelect", true);
            component.set("v.fundrequestSelected", selectedFRIds);
            component.set("v.fundrequestUnselected", unselectedFRIds);
            component.set("v.currentSelectionSize", selectedFRIds.length); 
        } else {
            helper.displayToast('Error', 'You can only select up to 3000 outlets.', 'error', null)
        } 
    }
})