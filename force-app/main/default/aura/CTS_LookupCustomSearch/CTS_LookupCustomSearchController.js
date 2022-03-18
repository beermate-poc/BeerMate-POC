({
   doInit : function(component, event, helper){      
    	setTimeout(
         $A.getCallback(function() {  
           //alert(component.get("v.selectedRecord"));
           if(component.get("v.selectedRecord") != null && component.get("v.selectedRecord") != undefined)
           {
                var forclose = component.find("lookup-pill");
                   $A.util.addClass(forclose, 'slds-show');
                   $A.util.removeClass(forclose, 'slds-hide');
               
               $A.util.removeClass(component.find("lookup-pill-Label"), 'slds-hide');
               $A.util.addClass(component.find("lookup-pill-Label"), 'slds-show');
          
                var forclose = component.find("searchRes");
                   $A.util.addClass(forclose, 'slds-is-close');
                   $A.util.removeClass(forclose, 'slds-is-open');
               	//component.set("v.closeDropDown", true);
                
                var lookUpTarget = component.find("lookupField");
                    $A.util.addClass(lookUpTarget, 'slds-hide');
                    $A.util.removeClass(lookUpTarget, 'slds-show');
               
           }
    	}), 1500);
    },
    onfocus : function(component,event,helper){
       $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
        	//component.set("v.closeDropDown", true);
         
         var getInputkeyWord = '';
         //alert(getInputkeyWord);
         helper.searchHelper(component,event,getInputkeyWord);
    },
    onblur : function(component,event,helper){       
        //component.set("v.listOfSearchRecords", null );
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        //component.set("v.closeDropDown", true);
    },
    keyPressController : function(component, event, helper) {
       // get the search Input keyword   
         var getInputkeyWord = component.get("v.SearchKeyWord");
         //alert("keyPressController"+getInputkeyWord);
       // check if getInputKeyWord size id more then 0 then open the lookup result List and 
       // call the helper 
       // else close the lookup result List part.   
        if( getInputkeyWord != null && getInputkeyWord != undefined && getInputkeyWord.length > 0 ){
             
            helper.searchHelper(component,event,getInputkeyWord);
        }
        else{  
             //component.set("v.listOfSearchRecords", null ); 
             var forclose = component.find("searchRes");
               $A.util.addClass(forclose, 'slds-is-close');
               $A.util.removeClass(forclose, 'slds-is-open');
            //component.set("v.closeDropDown", true);
          }
	},
    
  // function for clear the Record Selaction 
    clear :function(component,event,heplper){
         var pillTarget = component.find("lookup-pill");
         var pillTargetLabel = component.find("lookup-pill-Label");
         var lookUpTarget = component.find("lookupField"); 
        
         $A.util.addClass(pillTarget, 'slds-hide');
         $A.util.addClass(pillTargetLabel, 'slds-hide');
         $A.util.removeClass(pillTarget, 'slds-show');
         $A.util.removeClass(pillTargetLabel, 'slds-show');
        
         $A.util.addClass(lookUpTarget, 'slds-show');
         $A.util.removeClass(lookUpTarget, 'slds-hide');
      
         component.set("v.SearchKeyWord",null);
         component.set("v.listOfSearchRecords", null );
         component.set("v.selectedRecord", {} );   
    },
    
  // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
    // get the selected record from the COMPONETN event 	 
       var selectedRecordGetFromEvent = event.getParam("recordSelected");
	   component.set("v.selectedRecord" , selectedRecordGetFromEvent); 
       
        var forclose = component.find("lookup-pill");
           $A.util.addClass(forclose, 'slds-show');
           $A.util.removeClass(forclose, 'slds-hide');
        
        $A.util.removeClass(component.find("lookup-pill-Label"), 'slds-hide');
        $A.util.addClass(component.find("lookup-pill-Label"), 'slds-show');
  
        var forclose = component.find("searchRes");
           $A.util.addClass(forclose, 'slds-is-close');
           $A.util.removeClass(forclose, 'slds-is-open');
        
        var lookUpTarget = component.find("lookupField");
            $A.util.addClass(lookUpTarget, 'slds-hide');
            $A.util.removeClass(lookUpTarget, 'slds-show');  
      
	},
})