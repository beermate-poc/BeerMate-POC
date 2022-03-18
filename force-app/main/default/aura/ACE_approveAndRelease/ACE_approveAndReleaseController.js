({
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Fetches list of states from Promotion's MU to be populated in dropdown when component initializes. 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    fetchStates : function(component, event, helper){
        helper.fetchStatesServer(component, event, helper);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Generates list of potential Fund Requests from Ship-Tos associated with State selected.	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/

     showTable : function(component, event, helper)   {
        helper.fetchShipTosFromState(component, event, helper);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates Remaining Dollar Amount from Promotion and 
       				displays error if user enters amount exceeding Promotion Amount.	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    calculateDollars : function(component,event,helper) {
        var index = event.target.getAttribute("data-set");
        var changedValue=document.getElementById(index).value;
        var itemList=component.get("v.fundRequests");
        var arr = document.getElementsByName('qty');
        var tot=0;
        for(var i=0;i<arr.length;i++){
            var decimalVal = parseFloat(arr[i].value);
            
            if(decimalVal)
                tot += decimalVal;
        }
        var dollars=component.get("v.appropriatedDollars");
        var rem=dollars-parseFloat(tot);
        if(rem <0)
        {
            changedValue = 0;   
            helper.displayToast(component,event,$A.get("$Label.c.ACE_errorTitle"),$A.get("$Label.c.ACE_assignedDollarsValidation"),'error');
            
        }
        else
        {
            component.set("v.remainingDollars",rem);
            
        }
        itemList[index].fundRequestSF.RequestedAmount= arr[index].value;
        component.set("v.fundRequests",itemList);
        
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   If data that user has entered passes validation, creates new Fund Requuests.	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/    
    createFundRequest : function(component, event, helper){
        var hasError = helper.checkFRError(component, event, helper);

        if(!hasError){
            helper.createFRServer(component, event, helper);
        }
    },
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Updates all check boxes if user selects Check All box.	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/    
    onCheckAll :  function(component, event, helper)   {
        var checkValue=component.find("fundRequestCheckAll").get("v.value");
        helper.checkAll(component, checkValue);
    },

/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Checks only the box selected and unchecks all.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    onCheckEach : function(component, event, helper)   {
        var checkValue=component.get("v.fundRequestCheck");
        if(checkValue ==  false) {
            component.find("fundRequestCheckAll").set("v.value",false);
        }
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Opens modal for user to perform custom lookups. Currently doing lookup on IO.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    openModal : function(component, event, helper){
        //alert('twsdf');
        var index = event.getParams().data.index;
        var obj = event.getParams().data.lookup;

        component.set("v.currentRowSelected",index);
        component.set("v.currentFieldSelected",obj);
        
        var lookupCmp = component.find(obj);
        lookupCmp.set("v.value", null);
        lookupCmp.set("v.valueLabel", null);

        var modal = component.find(obj + "-modal");
        modal.set("v.showModal", true);
        
        var pagination = lookupCmp.find("pagination");
        //pagination.set("v.pageNumber", 1);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Updates Spend Type field with user input from dropdown.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    updateSpendType : function(component, event, helper){
        var index=event.getSource().get('v.name');
        var selectedSpendType = event.getSource().get('v.value');
        var itemList=component.get("v.fundRequests");
        itemList[index].fundRequestSF.ACE_Spend_Type__c = selectedSpendType;
        component.set("v.fundRequests",itemList);
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
        var fundRequests = component.get("v.fundRequests");
        fundRequests[currentRow].fundRequestSF.ACE_Internal_Order__c = null;
        fundRequests[currentRow].internalOrderNumber = "";
        component.set("v.fundRequests", fundRequests);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Updates IO field when user selects from custom lookup component (strike_lookup).
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    updateRow : function(component, event, helper){
        var currentRow = component.get("v.currentRowSelected");
        var currentField = component.get("v.currentFieldSelected");
        var fundRequests = component.get("v.fundRequests");
        var record = event.getParams().data

        if(currentField == "ACE_Internal_Order__c"){
            var id = record.find(function(field){
                return field.fieldName === 'id';
            });

            var ioNumber = record.find(function(field){
                return field.fieldName === 'Internal Order Number';
            });

            fundRequests[currentRow].fundRequestSF.ACE_Internal_Order__c = id.value;
            fundRequests[currentRow].internalOrderNumber = ioNumber.value;
        }

        var modal = component.find(currentField + "-modal");
        modal.set("v.showModal", false);
        component.set("v.fundRequests", fundRequests);
    }
})