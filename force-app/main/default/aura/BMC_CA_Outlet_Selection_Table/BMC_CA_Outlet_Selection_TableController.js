({
    fetchOutlets: function (component, event, helper) {
        var myPageRef = component.get("v.pageReference");
        var recordId = myPageRef.state.c__recordId;
        component.set("v.recordId", recordId);
        
        helper.getAccountInfo(component , event);
        helper.fetchOutletsHelper(component, event, helper);
        helper.initializeStates(component, event, helper);
        helper.initializeChainLvls(component,event,helper);
        helper.outletIdSearch(component,event,helper); 
        helper.initializeView(component,event,helper);
        helper.chainNumberSearch(component,event,helper);
    },    
    openModal : function(component, event, helper){
        helper.openModal(component, event, helper); 
    },
    closeFavModal: function(component, event, helper){
        var modal = component.find("favoriteList");
        modal.set("v.showModal", false);
        component.set("v.selectedwthname",'');
    },
    applyFavoritelist : function(component, event, helper){
        component.set('v.favoritecolumns', [
            {label: '', fieldName: 'Name', type: ''},
            {label: 'Target List Name', fieldName: 'Name', type: 'name'},
            {label: 'No of Target Accounts', fieldName: 'Count_Target_Accounts__c', type: 'number'},
            
        ]);
            var modal = component.find("favoriteList");
            modal.set("v.showModal", true);
            var fetchFavorites = component.get("c.fetchfavoriteList");
            fetchFavorites.setParams({
            "chainActivityId": component.get("v.recordId")
            });
            fetchFavorites.setCallback(this, function(response){
            var state=response.getState();
            if(state == "SUCCESS"){
            component.set("v.favoritelist",response.getReturnValue());
            }
            });
            $A.enqueueAction(fetchFavorites);
            },
            onSelectWTH :function(component, event, helper) {
            var favorites= component.get("v.favoritelist");
            var index= event.target.getAttribute("data-set");
            component.set("v.selectedWTH",favorites[index].favList.Id);
        component.set("v.selectedwthname",favorites[index].favList.Name);
    },
    gobcktoRcrdpage: function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId"),
            "slideDevName": "detail",
            "isredirect": false
        });
        navEvt.fire();
    },
    closeModal : function(component, event, helper){
        helper.closeModal(component, event, helper); 
    },
    createList: function(component, event, helper){
        if($A.util.isUndefinedOrNull(component.find("wthName").get("v.value")) || $A.util.isEmpty(component.find("wthName").get("v.value"))){
            helper.displayToast($A.get("$Label.c.Error"), 'Please Enter List Name','error');
        }
        else{
    		helper.checkDuplicate(component,event,helper,component.find("wthName").get("v.value"));  
            }
    },
    clearFilters : function(component,event,helper){       
        component.set("v.statesSelected",[]);
        component.set("v.chainLvlsSelected",[]);
        component.set("v.filteredOutletId",'');
        component.set("v.selectedView","All Outlets");
        component.set("v.filteredChainNumber",'');
        
        helper.closeModal(component,event,helper);
        helper.openModal(component,event,helper);
    },
    applyFavorite : function(component, event, helper){
        var selectedWTH= component.get("v.selectedWTH");
        var selectedwthname = component.get("v.selectedwthname");
        
        var modal = component.find("favoriteList");
        
        var saveRowIdsString=JSON.stringify(component.get("v.outletsSelected"));
        if(!$A.util.isUndefinedOrNull(selectedwthname) && selectedwthname !='')
        {
            var getTargetAcnts = component.get("c.applyTargetAccounts");
            getTargetAcnts.setParams({
                "wthID": selectedWTH,
                "chainActivityId": component.get("v.recordId"),
            });
            getTargetAcnts.setCallback(this, function(response){
                var state=response.getState();
                if(state === "SUCCESS")
                {
                    //helper.updateRecord(component,event,helper) ;   
                    
                    helper.displayToast($A.get("$Label.c.Success"), 'Favorite List was successfully applied','success');
                    $A.get('e.force:refreshView').fire();
                }
                else
                {
                    helper.displayToast($A.get("$Label.c.Error"), 'Unexpected error has occurred','success');
                }
                modal.set("v.showModal", false);
            });
            $A.enqueueAction(getTargetAcnts); 
        }
        else
        {
            helper.displayToast($A.get("$Label.c.Error"), 'Select Favorite List to apply','error');
        }
    },
    applyFilters : function(component, event, helper){
        var statesSelected = component.get("v.statesSelected");
        var chainLvlsSelected = [];
        chainLvlsSelected = component.get("v.chainLvlsSelected");
        var chainLvlNumSelected = component.get("v.chainLvlNumSelected");
        var searchedOutletId = component.get("v.filteredOutletId");
        var selectedView = component.get("v.selectedView");
        var selectedViewIds= component.get("v.selectedViewIds");
        var searchedChainNum = component.get("v.filteredChainNumber");
        var outletsSelected = component.get("v.outletsSelected"); 
        var outletsUnselected = component.get("v.outletsUnselected");
        var allOutlets = component.get("v.outletsFiltered");
        
        const outletsSel = JSON.parse(JSON.stringify(outletsSelected));
        const outletsUnsel = JSON.parse(JSON.stringify(outletsUnselected));
        const outletsAll = JSON.parse(JSON.stringify(allOutlets));
        
        
        component.set("v.statesSelectedCache",statesSelected);
        component.set("v.chainLvlsSelectedCache",chainLvlsSelected);
        component.set("v.filteredOutletIdCache",searchedOutletId);
        component.set("v.selectedViewCache",selectedView);
        component.set("v.filteredChainNumberCache",searchedChainNum);
        
        var outlets = component.get("v.outletsMasterObj");
        console.log('------outlets------',outlets);
        
        function filterState(outlet){
            return statesSelected.includes(outlet.theAccount.BillingState);
        };
		var allChainLevelsforOutlets = chainLvlsSelected;        
        var allChainLevels = component.get("v.allChainParentLevelForFilter");
        fetchChainParentInHierarchy(allChainLevelsforOutlets);
       
        function filterChainLvl(outlet){ 
                //return chainLvlsSelected.includes(outlet.theAccount.ParentId)
                //return allChainLevelsforOutlets.includes(outlet.theAccount.ParentId)
            	var isOutletPresent = 'false';    
            	for(var i in allChainLevelsforOutlets){
                      if(allChainLevelsforOutlets[i].includes(outlet.theAccount.ParentId)){
                          	isOutletPresent = 'true';
                      }
                }
            	if(isOutletPresent == 'true')
					return true;
            	else return false;
        };
        
		function fetchChainParentInHierarchy(chainLvlsSelected){
            
				var ChildChainLevel = [];
            	for(var i in allChainLevels){
                    if(chainLvlsSelected.includes(allChainLevels[i].ParentId)){
                        ChildChainLevel.push(allChainLevels[i].Id); 
                    }
				}
                if(ChildChainLevel.length > 0){
                
                    allChainLevelsforOutlets.push(ChildChainLevel);
                    fetchChainParentInHierarchy(ChildChainLevel); 
                }
        };
        function filterOutletId(outlet){
            return searchedOutletId == outlet.theAccount.OutletCd__c;
        };
        
        function filterViewSelected(outlet){
            if(selectedView === "Selected Outlets"){
                return outletsSel.includes(outlet.theAccount.Id);                    
            }
            else{
                if(selectedView === "Unselected Outlets"){
                    return outletsUnsel.includes(outlet.theAccount.Id);                        
                }
                else {
                    if(selectedView === "All Outlets"){
                        return outlets;                            
                    }
                }
            }
        };
        function filterStoreNum(outlet){
            return searchedChainNum == outlet.theAccount.ChainStoreNbr__c;
        };
        
        var acctsFilteredState = statesSelected.length > 0 ? Object.values(outlets).filter(filterState) : Object.values(outlets);
        var acctsFilteredChainLvl = chainLvlsSelected.length > 0 ? acctsFilteredState.filter(filterChainLvl) : acctsFilteredState;
        var acctsFilteredOutletId = searchedOutletId != null && searchedOutletId.length > 0 ? acctsFilteredChainLvl.filter(filterOutletId) : acctsFilteredChainLvl;
        var acctsFilteredStoreNum = searchedChainNum != null && searchedChainNum.length > 0 ? acctsFilteredOutletId.filter(filterStoreNum) : acctsFilteredOutletId;
        var acctsFilteredView = selectedView != null ? acctsFilteredStoreNum.filter(filterViewSelected) : acctsFilteredStoreNum;
        
        component.set("v.outletsFiltered",acctsFilteredView);
        component.set("v.isAllSelected", false); 
        component.set("v.manualSelect", true);
        
        if(acctsFilteredView.length > 0){
            component.set("v.totalPages", Math.ceil(acctsFilteredView.length/component.get("v.pageSize")));
        	component.set("v.currentPageNumber",1);
        }
        else{
            component.set("v.totalPages", 1);
        }
        
        helper.buildData(component, helper);  
        helper.closeModal(component, event, helper); 
    },
    
    handleStateUpdate : function(component, event, helper){
        component.set("v.statesSelected", event.getParam("value"));
    },
    
    handleChainLvlUpdate : function(component,event,helper){
        component.set("v.chainLvlsSelected", event.getParam("value"));
    },
    
    handleViewChange : function(component,event,helper){
        component.set("v.selectedView", event.getParam("value"));
        component.set("v.selectedViewIds",[]);
    },
    
    handleSave: function (component, event, helper) {
        var selectedMenuItem = event.getParam("value");
        if(selectedMenuItem === 'saveAndFavorite'){
            helper.saveFavoriteHelper(component,event,helper);
        }
        else{
            helper.saveOutletListHelper(component,event,helper,selectedMenuItem);  
        }
        
        
    },
    returnToRecord : function(component, event, helper){
        helper.returnToRecord(component, event, helper); 
    },
    
    onNext : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber+1);
        helper.buildData(component, helper);
    },
    
    onPrev : function(component, event, helper) {        
        var pageNumber = component.get("v.currentPageNumber");
        component.set("v.currentPageNumber", pageNumber-1);
        helper.buildData(component, helper);
    },
    
    processMe : function(component, event, helper) {
        component.set("v.currentPageNumber", parseInt(event.target.name));
        helper.buildData(component, helper);
    },
    
    onFirst : function(component, event, helper) {        
        component.set("v.currentPageNumber", 1);
        helper.buildData(component, helper);
    },
    
    onLast : function(component, event, helper) {        
        component.set("v.currentPageNumber", component.get("v.totalPages"));
        helper.buildData(component, helper);
    },
    onSelectAllChange: function(component, event, helper) { 
        component.set("v.loaded", false);
         setTimeout(function(){
         component.set("v.loaded", true);
        }, 3000);
        helper.handleSelectAllChange(component, event, helper);  
    },
    onSelectChange: function(component, event, helper){
        var maxSelectionSize = component.get("v.maxSelectionSize");
        var selectedAcctIds = component.get("v.outletsSelected");
        var unselectedAcctIds = component.get("v.outletsUnselected");
        var unselectedAcctIds1 =[];
        
        var checked = event.getSource().get("v.value");
        var acctId = event.getSource().get("v.name");
        if(checked){
            selectedAcctIds.push(acctId);
            unselectedAcctIds = unselectedAcctIds.filter(function(value, index, arr){
                return value != acctId;
            })
        } else {
            selectedAcctIds = selectedAcctIds.filter(function(value, index, arr){
                return value != acctId;
            })
            unselectedAcctIds.push(acctId);
        }
        
        if(selectedAcctIds.length <= maxSelectionSize){
            component.set("v.manualSelect", true);
            component.set("v.outletsSelected", selectedAcctIds);
            component.set("v.outletsUnselected", unselectedAcctIds);
            component.set("v.currentSelectionSize", selectedAcctIds.length); 
        } else {
            helper.displayToast('Error', 'You can only select up to 3000 outlets.', 'error', null)
        } 
    },
    
    cancelAndClose : function(component, event, helper){
        helper.resetFiltersFromCache(component, event, helper);
        helper.closeModal(component, event, helper);  
    }
})