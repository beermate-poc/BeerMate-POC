({
    getAccountInfo : function(component , event) {
        try{
            if(navigator.onLine){
                var actionAccount=component.get("c.getAccountDetails");
                actionAccount.setParams({recordId: component.get("v.recordId")}); 
                actionAccount.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
                        var chainActivityobj = response.getReturnValue(); 
                        component.set("v.chainactivitystatus", chainActivityobj.chainActivity.BMC_Status__c);
                        if(chainActivityobj.chainActivity.BMC_Status__c===$A.get("$Label.c.BMC_CACancelled")){
                            component.set("v.addproduct", false);
                        }
                        
                    } else if (response.getState() === "ERROR") {
                        this.displayToast (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');           
                    }
                });
                $A.enqueueAction(actionAccount);            
            } else {
                this.displayToast (component, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');             
            }
        } catch(e){
            this.displayToast (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');           
        }
    },
    fetchOutletsHelper : function(component, event, helper) {
        component.set('v.mycolumns', [
            {label: 'Account Name', fieldName: 'Name', type: 'name'},
            {label: 'Account Address', fieldName: 'BillingStreet', type: 'address'},
            {label: 'Account City', fieldName: 'BillingCity', type: 'text'},
            {label: 'Account State', fieldName: 'BillingState', type: 'text'},
            {label: 'Account Store Number', fieldName: 'ChainStoreNbr__c', type: 'number'},
            {label: 'Retail Outlet ID', fieldName: 'OutletCd__c', type: 'number'},
            {label: 'Total 13wk Volume', fieldName: 'Total_13_Wk_Volume__c', type:'number'},
        ]);
            var fetchOutlets = component.get("c.fetchOutletsFromServer");
            fetchOutlets.setParams({
            "chainActivityId": component.get("v.recordId")
            });
            fetchOutlets.setCallback(this, function(response){
            var state=response.getState();
            if(state == "SUCCESS"){
            var accountWrapper = helper.sortReturnedAccounts(component, event, helper,response);
            
            component.set("v.outletsMasterObj", accountWrapper);
            component.set("v.outletsMasterList", accountWrapper);
            component.set("v.outletsFiltered", accountWrapper);
            
            component.set("v.totalPages", Math.ceil(accountWrapper.length/component.get("v.pageSize")));
            component.set("v.currentPageNumber",1);
            
            helper.filterSelectedAccountsIds(component, event, helper);
            helper.buildData(component, helper);
            component.set("v.loaded", true);
            
            } else {
            component.set("v.loaded", true);
            this.displayToast('Error', 'Page Load Error', 'error', null)
            }
            });
            $A.enqueueAction(fetchOutlets); 
            },
            
            sortReturnedAccounts : function(component, event, helper,response){
            var accountWrappers = []
                      var allAccountsSize = response.getReturnValue().allAccounts.length;
        var allAccounts = response.getReturnValue().allAccounts;
        var selectedAccounts = response.getReturnValue().selectedAccounts;
        for(var idx = 0;idx < allAccountsSize ;idx++){
            var accountWrapper = {};
            accountWrapper.theAccount = response.getReturnValue().allAccounts[idx];
            accountWrapper.selected = selectedAccounts.includes(accountWrapper.theAccount.Id);
            accountWrappers.push(accountWrapper);
        }
        
        return accountWrappers;    
    },
    
    
    saveOutletListHelper : function(component, event, helper, selectedMenuItem) {
        component.set("v.loaded", false);
        var recordId = component.get("v.recordId");
        var outletsSelected =component.get("v.outletsSelected");
        var chainActivityObj = component.get("v.chainactivitystatus");
        var saveRowIdsString = JSON.stringify(component.get("v.outletsSelected"));
        if(outletsSelected.length ==0 && chainActivityObj == 'Final' && selectedMenuItem!='saveAndFavorite'){
            this.displayToast('Error', 'Atleast one outlet should be selected when chain execution status is final', 'error');
            $A.get('e.force:refreshView').fire();            
        }
        else if(outletsSelected.length ==0  && selectedMenuItem==='saveAndFavorite'){
            this.displayToast('Error', 'At least one outlet should be selected to create a favorite list', 'error');
            $A.get('e.force:refreshView').fire();            
        }
        else{
            var saveOutlets = component.get("c.generateWhereToHuntList");  
            var isFavoriteBoolean = selectedMenuItem ==='saveAndFavorite' ? true : false; 
            var wthName = '';
            
            if(!$A.util.isUndefinedOrNull(component.find("wthName")) && !$A.util.isUndefinedOrNull(component.find("wthName").get("v.value")) && !$A.util.isEmpty(component.find("wthName").get("v.value")) ){
                wthName =component.find("wthName").get("v.value"); 
            }
            
            saveOutlets.setParams({
                "chainActivityId": recordId, 
                "acctsSelectedString": saveRowIdsString, 
                "isFavorite": isFavoriteBoolean, 
                "whereToHuntName": wthName});
            
            saveOutlets.setCallback(this, function(response){
                var state=response.getState();
                
                component.set("v.loaded", true);
                if(state == "SUCCESS"){
                    //helper.updateRecord(component,event,helper);
                    if(selectedMenuItem === 'saveAndContinue'){
                        $A.get('e.force:refreshView').fire();
                    } else if (selectedMenuItem === 'saveAndReturn'){
                        helper.returnToRecord(component,event,helper);            
                    } else if (selectedMenuItem === 'saveAndFavorite'){
                        this.displayToast('Success', 'Favorite List Created!', 'success');
                        $A.get('e.force:refreshView').fire();
                    }
                }  
                
                else {
                    this.displayToast('Error', 'List(s) were not updated.', 'error');
                }
            });
            
            $A.enqueueAction(saveOutlets); 
        }
    },     
    
    displayToast: function(component,event,title, message, type) {           
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title: title,
            message: message,
            type: type
            
        });
        toastEvent.fire();
        
    },
    
    initializeStates: function (component, event, helper){
        var states = ["AK","AL","AR","AZ","CA","CO","CT","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VA","VT","WA","WI","WV","WY"];         
        var stateOpts = [];
        for(var stateIdx=0; stateIdx < states.length;stateIdx++){
            stateOpts.push({label: states[stateIdx], value:states[stateIdx]});
        }
        
        component.set("v.states",stateOpts);
    },
    
    filterSelectedAccountsIds : function(component, event, helper){
        
        var selectedAcctIdsCurrent = component.get("v.outletsSelected");
        var selectedAcctIdsUpdated = [];
        var unselectedAcctIdsCurrent = component.get("v.outletsUnselected");
        var unselectedAcctIdsUpdated = [];
        
        var allAccts = component.get("v.outletsFiltered");
        var isAllSelected = component.get("v.isAllSelected");
        var manualSelect = component.get("v.manualSelect");
        var maxSelectionSize = component.get("v.maxSelectionSize");
        if(isAllSelected || manualSelect){  
             
            for(var idx=allAccts.length-1;idx >= 0;idx--){
                if((isAllSelected || allAccts[idx].selected == true) && !selectedAcctIdsCurrent.includes(allAccts[idx].theAccount.Id)){
                    selectedAcctIdsUpdated.push(allAccts[idx].theAccount.Id);
                    unselectedAcctIdsCurrent=[];
                    
                }
                else{
                   if(allAccts[idx].selected == false && !unselectedAcctIdsCurrent.includes(allAccts[idx].theAccount.Id)){
                        unselectedAcctIdsUpdated.push(allAccts[idx].theAccount.Id);
                    }  
                }
            } 
        } else {
           
            for(var i=0;i< allAccts.length;i++)
            {
                unselectedAcctIdsUpdated.push(allAccts[i].theAccount.Id);  
            }  
           
        }
        
        if(selectedAcctIdsCurrent.length + selectedAcctIdsUpdated.length <= maxSelectionSize){
            selectedAcctIdsCurrent = selectedAcctIdsCurrent.concat(selectedAcctIdsUpdated);
            unselectedAcctIdsCurrent = unselectedAcctIdsCurrent.concat(unselectedAcctIdsUpdated);
           
            var selectedAcctIdsCurrentUpdated = [];
            for(var i=0;i< selectedAcctIdsCurrent.length;i++)
            {
                	if(!unselectedAcctIdsCurrent.includes(selectedAcctIdsCurrent[i]))
                		selectedAcctIdsCurrentUpdated.push(selectedAcctIdsCurrent[i]);  
            }  
            
            component.set("v.outletsSelected", selectedAcctIdsCurrentUpdated);
            component.set("v.currentSelectionSize", selectedAcctIdsCurrentUpdated.length);
            component.set("v.outletsUnselected", unselectedAcctIdsCurrent);
            
        } else {
            
            component.set("v.manualSelect", true);
            component.set("v.isAllSelected",false);
            this.displayToast('Error', 'You can only select up to ' + maxSelectionSize + ' outlets.', 'error', null)
        } 
        
    },
    
    initializeChainLvls: function (component, event, helper){
        var fetchChainLevels = component.get("c.fetchChainLevels");
        var chainLvlOpts = [];
        	fetchChainLevels.setParams({chainActivityId:component.get("v.recordId")});
            fetchChainLevels.setCallback(this, function(response) {
            	if (response.getState() === "SUCCESS") {
                    var chainParents = {};
                    chainParents = response.getReturnValue();
                    component.set("v.allChainParentLevelForFilter",chainParents); 
                    for(var ix=0; ix < chainParents.length;ix++){
            			chainLvlOpts.push({label: (chainParents[ix].ChainLevelNbr__c +' - '+chainParents[ix].Name), value:chainParents[ix].Id});
        				}  
                        component.set("v.chainLvls",chainLvlOpts);
                    } else if (response.getState() === "ERROR") {
                        this.displayToast (component, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');           
                    }
                });
        $A.enqueueAction(fetchChainLevels);
    },
    
    initializeView: function (component,event,helper){
        var views = ["All Outlets","Selected Outlets","Unselected Outlets"];
        var viewOpts = [];
        for(var viewIdx=0; viewIdx < views.length;viewIdx++){
            viewOpts.push({label: views[viewIdx], value:views[viewIdx]});
        }
        component.set("v.views",viewOpts); 
    },
    
    outletIdSearch: function(component,event,helper){
        var queryId = component.find('searchOutlets').get('v.value');
        component.set("v.filteredOutletId",queryId);
    },
    
    chainNumberSearch: function(component,event,helper){
        var queryNum = component.find('searchChainNumber').get('v.value');
        component.set("v.filteredChainNumber",queryNum);
    },
    
    openModal : function(component, event, helper){
        var modal = component.find("Filter");
        modal.set("v.showModal", true);
        
    },
    
    closeModal : function(component, event, helper){
        var modal = component.find("Filter");
        modal.set("v.showModal", false);
        component.set("v.wthinputmodal",false);             
    },
    
    returnToRecord : function(component,event,helper){
        window.location.href = "/"+ component.get("v.recordId");
        
    },
    saveFavoriteHelper : function(component,event,helper){
        component.set('v.wthinputmodal',true);
    },
    handleSelectAllChange: function(component, event, helper) {
         
        component.set("v.manualSelect", false);
        helper.filterSelectedAccountsIds(component, event, helper);
        helper.buildData(component, helper);   
    },
    buildData : function(component, helper) {
       
        //component.set("v.loaded", false);
        var data = [];
        var pageNumber = component.get("v.currentPageNumber");
        var pageSize = component.get("v.pageSize");
        var allData = component.get("v.outletsFiltered");
        var x = (pageNumber-1)*pageSize;
        var checked = component.get('v.isAllSelected');
        var manualSelect = component.get('v.manualSelect');
        var selectedAcctIds = component.get("v.outletsSelected");
        
        //creating data-table data
        for(; x<(pageNumber)*pageSize; x++){
            if(allData[x]){
                if(!manualSelect){
                    allData[x].selected = checked;
                } else {
                    allData[x].selected = selectedAcctIds.includes(allData[x].theAccount.Id);
                }              
                data.push(allData[x]);
            }
        }
        component.set("v.outletsToDisp", data); 
        helper.generatePageList(component, pageNumber);
       
    },
    
    
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
    
    
    checkDuplicate: function(component, event, helper,wthName) {
        var acTion = component.get("c.checkDuplicatWTHName");
        acTion.setParams({
            wthName:wthName
        });
        acTion.setCallback(this, function(response) {
            if (response.getState() === "SUCCESS") {
                var dupCheck=response.getReturnValue();
                if(dupCheck){
                    this.displayToast($A.get("$Label.c.Error"), 'The provided list name already exists.  Please enter a unique name.','error');
                }
                else{
                    this.saveOutletListHelper(component,event,helper,'saveAndFavorite');
                }
            }
            
        });
        $A.enqueueAction(acTion);        
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
    
    resetFiltersFromCache : function(component, event, helper){
        var statesSelected = component.get("v.statesSelected");
        var chainLvlsSelected = component.get("v.chainLvlsSelected");
        var searchedOutletId = component.get("v.filteredOutletId");
        var selectedView = component.get("v.selectedView");
        var filteredChainNumber = component.get("v.filteredChainNumber");
        
        var statesSelectedCache = component.get("v.statesSelectedCache");
        var chainLvlsSelectedCache = component.get("v.chainLvlsSelectedCache");
        var searchedOutletIdCache = component.get("v.filteredOutletIdCache");
        var selectedViewCache = component.get("v.selectedViewCache");
        var filteredChainNumberCache = component.get("v.filteredChainNumberCache");
        component.set("v.statesSelected",statesSelectedCache);
        component.set("v.chainLvlsSelected",chainLvlsSelectedCache);
        component.set("v.filteredOutletId",searchedOutletIdCache); 
        component.set("v.selectedView",selectedViewCache);
        component.set("v.filteredChainNumber",filteredChainNumberCache)
    },
    /*
    updateRecord: function(component,event,helper){
        var recordId = component.get("v.recordId");
        var updateRecord = component.get("c.updateRecord");
        updateRecord.setParams({
            chainActivityId:recordId
        })
        $A.enqueueAction(updateRecord);       
    }
    */
})