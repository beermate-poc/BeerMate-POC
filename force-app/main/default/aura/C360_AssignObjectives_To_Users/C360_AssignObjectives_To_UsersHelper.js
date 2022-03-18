/* Helper Class for the component controller*/
({
	searchHelper : function(component,event,getInputkeyWord) {
        // call the apex class method 
       var action = component.get("c.fetchUser");
        
        // set param to method 
        action.setParams({
            'searchKeyWord':getInputkeyWord
        });
 
        // set a callBack
        action.setCallback(this,function(response){
  
        var state = response.getState();
            
        // if returnlist size is equal 0 ,display No Result Found... message on screen.
        if (state === "SUCCESS") {
           var storeResponse = response.getReturnValue();
           var staticLabel = $A.get("$Label.c.C360_Search_Result");
           var LabelVal = $A.get("$Label.c.C360_SearchSuccess");
            if(storeResponse.length==0){
                component.set("v.Message", staticLabel);
            }else{
                component.set("v.Message", LabelVal);
            }
            
        // set searchResult list with return value from server.
         component.set("v.listOfSearchRecords", storeResponse);
        }    
        });
		  // enqueue the Action  
        $A.enqueueAction(action);
	} ,
    
    // This method is used to navigate  to objective page on click of save and Cancel button*/
    navigatetoURL : function (component, event) {
    var recordid=component.get("v.recordId");
    var navEvt = $A.get("e.force:navigateToSObject");
    navEvt.setParams({
      "recordId": recordid,
      "slideDevName": "related"
    });
    navEvt.fire();
    } ,

   /* This function is to  clear te lookup value on click of clear button on custom lookup*/
   clearValue :function(component,event){
         var pillTarget = component.find("lookup-pill");
         var lookUpTarget = component.find("lookupField"); 
        
         $A.util.addClass(pillTarget, 'slds-hide');
         $A.util.removeClass(pillTarget, 'slds-show');
        
         $A.util.addClass(lookUpTarget, 'slds-show');
         $A.util.removeClass(lookUpTarget, 'slds-hide');
      
         component.set("v.SearchKeyWord",null);
         component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord",'');

    } ,
    
})