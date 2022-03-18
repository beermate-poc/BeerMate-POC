({
    /* This method  is called on Click of Save &New Button,which calls pagerefresh event 
     and  clears  field values*/
    init:function(component, event, helper) {
    } ,
    
    /* Method to open searchresult window on keypress with search value*/
    keyPressController : function(component, event, helper) {
        
    // get the search Input keyword   
    var getInputkeyWord = component.get("v.SearchKeyWord");
        
     /* check if getInputKeyWord size id more then 0 then open the lookup result List and call the helper 
       else close the lookup result List part*/
       if( getInputkeyWord.length > 0 ){
          var forOpen = component.find("searchRes");
               $A.util.addClass(forOpen, 'slds-is-open');
               $A.util.removeClass(forOpen, 'slds-is-close');
            helper.searchHelper(component,event,getInputkeyWord);
        }
        else{  
            component.set("v.listOfSearchRecords", null ); 
             var forclose = component.find("searchRes");
               $A.util.addClass(forclose, 'slds-is-close');
               $A.util.removeClass(forclose, 'slds-is-open');
          }   
	} ,
    
    // This function call when the end User Select any record from the result list.   
    handleComponentEvent : function(component, event, helper) {
    
      //get the selected User record from the COMPONETN event 	 
       var selectedUser = event.getParam("userByEvent");

	   component.set("v.selectedRecord" , selectedUser); 
       var forclose = component.find("lookup-pill");
       $A.util.addClass(forclose, 'slds-show');
       $A.util.removeClass(forclose, 'slds-hide');
        
       var forclose = component.find("searchRes");
       $A.util.addClass(forclose, 'slds-is-close');
       $A.util.removeClass(forclose, 'slds-is-open');
        
       var lookUpTarget = component.find("lookupField");
       $A.util.addClass(lookUpTarget, 'slds-hide');
       $A.util.removeClass(lookUpTarget, 'slds-show');    
	} ,
    
    // Automatically call when the component is done waiting for a response to a server request.  
    hideSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : false });
        evt.fire();    
    } ,
    
   // automatically call when the component is waiting for a response to a server request.
    showSpinner : function (component, event, helper) {
        var spinner = component.find('spinner');
        var evt = spinner.get("e.toggle");
        evt.setParams({ isVisible : true });
        evt.fire();    
    } ,
    
    // function to clear the Record Selection 
    clear :function(component,event,helper){
          
      		helper.clearValue(component, event);  
    } ,
    
    // function to handle Save and Save&New for assigned objectives
    saveObjective :function(component,event,helper){
        var lktarget=component.find("lkp");
        var newnum = component.get("v.number1");
        var SelectUser= component.get("v.selectedRecord");
        var SelecteduserId =SelectUser.Id;
        var recordid=component.get("v.recordId");
        var isvalid= true;
        var buttonName = event.getSource().get("v.name");
       
        // Validation to check null value for user lookup
         if ($A.util.isEmpty(SelecteduserId)){
             var statLabel = $A.get("$Label.c.C360_RequiredField");
             lktarget.set("v.errors", [{message:statLabel}]);
         } 
         // Validation check for  input fields on layout
         if(newnum>99 || newnum<=0 || $A.util.isEmpty(SelecteduserId) || $A.util.isEmpty(newnum) || (newnum.toString().indexOf('.') != -1)){  
            isvalid = false;
          }
        
        if(isvalid){
         var Action =component.get("c.createObjective");
         Action.setParams({
            'Pid':recordid,
            'AssignNum':newnum.toString(),
            'Ownerid':SelecteduserId    
          });
         Action.setCallback(this,function(response){ 
         var state = response.getState(component, event);
         if (state === "SUCCESS") {
             if(buttonName == 'SaveNew'){
             lktarget.set("v.errors", "");
                component.set("v.number1",1);
                 helper.clearValue(component, event);
                     $A.get('e.force:refreshView').fire(); 
             } 
             else{
                 helper.navigatetoURL(component, event);
             }
        }
       });
          $A.enqueueAction(Action);  
        } 
       
    } ,
    
    // Function to Cancel the tranactions and redirect to object page
    cancelCreation:function(component,event,helper){
       helper.navigatetoURL(component,event); 
    }
           
})