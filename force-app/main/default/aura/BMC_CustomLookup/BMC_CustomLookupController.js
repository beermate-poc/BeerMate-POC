({
    /**
   @Author Accenture
   @name doInit
   @CreateDate  29/03/2019
   @Description Function searches result once user types in 5 serach letters.
  */
    doInit : function(component, event, helper) {
        if((component.get("v.fromRetail") === true) ){
            setTimeout(function(){ component.find("scan").focus(); }, 1000);
            component.set("v.fromRetail", true);
        }
    },
    /**
   @Author Accenture
   @name onFocus
   @CreateDate  11/12/2018
   @Description Function searches result once user types in 5 serach letters.
  */
    onFocus : function(component, event, helper){
      //  alert(component.get("v.channelName"));
        if(component.get("v.scanPage") !== true){
            $A.util.addClass(component.find("mySpinner"), "slds-show");
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            // Get Default 5 Records order by createdDate DESC  
            var getInputkeyWord = "";
            helper.searchHelper(component, event, getInputkeyWord);
        }
    },
    /**
   @Author Accenture
   @name onBlur
   @CreateDate  11/12/2018
   @Description FUnction sets result to null when user removes the typed in letters.
  */
    onBlur : function(component, event, helper){
        component.set("v.listOfSearchRecords", null );
        var forClose = component.find("searchRes");
        $A.util.addClass(forClose, 'slds-is-close');
        $A.util.removeClass(forClose, 'slds-is-open');
    },
    /**
   @Author Accenture
   @name keyPressCntrler
   @CreateDate  11/12/2018
   @Description Function searchs once enter keyword is clicked .
  */
    keyPressCntrler : function(component, event, helper) {
        var getInputkeyWord = component.get("v.searchKeyWord");
        if(( getInputkeyWord.length > 0 )){
            if(component.get("v.scanPage") === true){
                component.set("v.showSpinner", true);
            }
            var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchHelper(component, event, getInputkeyWord);
        }
        else{
            component.set("v.listOfSearchRecords", null );
            var forClose = component.find("searchRes");
            $A.util.addClass(forClose, 'slds-is-close');
            $A.util.removeClass(forClose, 'slds-is-open');
        }
    },
    /**
   @Author Accenture
   @name onClear
   @CreateDate  11/12/2018
   @Description function for clear the Record Selaction .
  */
    onClear :function(component, event, helper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField");
        if(component.get("v.clearResult")===true){
            var forClose = component.find("searchRes");
            $A.util.addClass(forClose, 'slds-is-close');
            $A.util.removeClass(forClose, 'slds-is-open');
            component.set("v.clearResult", false);
        }
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
        component.set("v.searchKeyWord", null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} );
    },
    /**
   @Author Accenture
   @name handleCompEvt
   @CreateDate  11/12/2018
   @Description  This function call when the end User Select any record from the result list.
  */   
    handleCompEvt : function(component, event, helper) {
        // get the selected Account record from the COMPONETN event 	 
        var selectedAccountgetfromEvent = event.getParam("recordByEvent");
        component.set("v.selectedRecord", selectedAccountgetfromEvent);
        var forClose = component.find("lookup-pill");
        $A.util.addClass(forClose, 'slds-show');
        $A.util.removeClass(forClose, 'slds-hide');
        var forClose = component.find("searchRes");
        $A.util.addClass(forClose, 'slds-is-close');
        $A.util.removeClass(forClose, 'slds-is-open');
        var lookUpTarget = component.find("lookupField");
        $A.util.addClass(lookUpTarget, 'slds-hide');
        $A.util.removeClass(lookUpTarget, 'slds-show');
        if(component.get("v.scanPage") === true){
            component.set("v.brandPackId", event.getParam("oRecId"));
            component.set("v.brandPackname", event.getParam("oRecName"));
            component.set("v.showAudit", true);
            var pillTarget = component.find("lookup-pill");
            var lookUpTarget = component.find("lookupField");
            $A.util.addClass(pillTarget, 'slds-hide');
            $A.util.removeClass(pillTarget, 'slds-show');
            $A.util.addClass(lookUpTarget, 'slds-show');
            $A.util.removeClass(lookUpTarget, 'slds-hide');
        }
    },
})