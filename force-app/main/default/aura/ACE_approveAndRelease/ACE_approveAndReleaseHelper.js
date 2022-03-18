({
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Fetches list of states from Promotion's MU to be populated in dropdown when component initializes. 		
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    fetchStatesServer : function(component, event, helper){
        var fetchMUAction = component.get("c.getStates");
        fetchMUAction.setParams({
            promotionId : component.get("v.recordId")
        });

        fetchMUAction.setCallback(this, function(response){
            var state=response.getState();
            if( state == "SUCCESS"){
              
                component.set("v.promoStatus", response.getReturnValue().currentPromoStatus);
                component.set("v.stateOptions", response.getReturnValue().states)
                component.set("v.appropriatedDollars", response.getReturnValue().remainingDollars);
                component.set("v.remainingDollars", response.getReturnValue().remainingDollars);

            } else {
                helper.displayToast(component,event,$A.get("$Label.c.ACE_errorTitle"),'Error occurred while fetching MUs','error');
            }
        });
        $A.enqueueAction(fetchMUAction);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Generates list of potential Fund Requests from Ship-Tos associated with State selected.	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    fetchShipTosFromState : function(component, event, helper){
        var stateSelected = component.find('states').get('v.value');
        var generateFundRequestsAction =component.get("c.getShipTo");
        generateFundRequestsAction.setParams({
            promotionId : component.get("v.recordId"),
            state : stateSelected
        });
        generateFundRequestsAction.setCallback(this,function(response){
            var state=response.getState();

            if( state == "SUCCESS"){
                component.set("v.fundRequests",response.getReturnValue().fundRequests);
                component.set("v.remainingDollars",response.getReturnValue().budgetAmount);
                component.set("v.appropriatedDollars",response.getReturnValue().budgetAmount);
                component.set("v.spendTypeOptions", response.getReturnValue().spendTypeOptions)
            }
        });
        $A.enqueueAction(generateFundRequestsAction);

    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Util method to display any type of toast based on parameters 	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    displayToast: function (component,event,title, message, type) {        
         var toastEvent = $A.get("e.force:showToast");
          toastEvent.setParams({
            title : title,
            message: message,
            type: type
        });
        toastEvent.fire();
    },
    
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Checks all boxes to create Fund Requests from custom attribute.	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    checkAll : function(component, val){
        var itemList=component.get("v.fundRequests");
        for(var i=0;i<itemList.length;i++)
        {
            itemList[i].fundRequestCheck=val;
        }
        component.set("v.fundRequests",itemList);
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:   Returns a Boolean if any potential Fund Requests have errors. 	
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    checkFRError : function(component, event, helper){
        var hasError = false;
        var itemList=component.get("v.fundRequests");
        for(var i=0;i<itemList.length;i++)
        {
            if(itemList[i].fundRequestCheck ==true && (itemList[i].fundRequestSF.RequestedAmount <= 0 || itemList[i].fundRequestSF.RequestedAmount == null))
            {
                helper.displayToast(component,event,$A.get("$Label.c.ACE_errorTitle"),'Fund Request cannot be created without assigned dollars','error');
                hasError = true;
                break;
            } else if (itemList[i].fundRequestCheck == false && itemList[i].fundRequestSF.RequestedAmount > 0 ){
                helper.displayToast(component,event,$A.get("$Label.c.ACE_errorTitle"),'Fund Request has assigned dollars but create checkbox is unchecked.','error');
                hasError = true;
                break;
            } 
        }
        return hasError;
    },
/*------------------------------------------------------------
       Author:        Alexandria Sanborn
       Company:       Accenture
       Description:  Sends potential new Fund Requests to Apex class to be created.
       <Date>      <Authors Name>     <Brief Description of Change>
       01/08/2019  Alexandria Sanborn
------------------------------------------------------------*/
    createFRServer : function(component, event, helper){
        var itemList=component.get("v.fundRequests");
        var action=component.get("c.createFundRequestRec");
        action.setParams({
            fundReqsString : JSON.stringify(component.get("v.fundRequests")),
        });
        action.setCallback(this,function(response){
            var state=response.getState();
            if( state == "SUCCESS") {
                if(response.getReturnValue().length>0){
                    helper.displayToast(component,event,null,response.getReturnValue().length + " " +  $A.get("$Label.c.ACE_fundRequestSuccessMsg"),'success');
                    component.find("fundRequestCheckAll").set("v.value",false);
                    helper.fetchShipTosFromState(component, event, helper);
                }else{
                    helper.displayToast(component,event,$A.get("$Label.c.ACE_errorTitle"),'Fund Request cannot be created if create checkbox is unchecked.','error');
                }
                
            } else {
                helper.displayToast(component,event,null,response.getError()[0].message,'error');
            }
        });
        $A.enqueueAction(action);
    }
})