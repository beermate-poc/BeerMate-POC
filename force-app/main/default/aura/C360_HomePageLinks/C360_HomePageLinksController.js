({
    /*doInit: function(component, event, helper){
        
    },*/
    
    /* Method to  call Vault external link from homepage links*/
    clickVault : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_Vault");
        helper.redirectToUrl(component,event,url); 
	},
     /* Method to  call 60SecondShop external link  from homepage links*/
	click60Shop : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_60SecondShop");
         helper.redirectToUrl(component,event,url); 	
	},
     /* Method to  call AnalyticSmart external link*/
    analyticSmart : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_AnalyticSmart");
         helper.redirectToUrl(component,event,url); 	
	},    
    /* Method to  call Staples external link*/
    navigateStaples : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_Staples");
         helper.redirectToUrl(component,event,url); 	
	},
    /* Method to  call Archway external link*/
    clickArchWay : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_Archway");
         helper.redirectToUrl(component,event,url); 	
	},
    
    clickBPMolsonShopLink : function(component, event, helper) {
        //nsole.log('HI');
        //ert('Hi');
        var url= $A.get("$Label.c.C360_BPMolsonShopLink");
        helper.redirectToUrl(component,event,url); 	
	},
    
   /* Method to  call Molson Account Manager external link*/    
   clickMCManager : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_MAManager");
         helper.redirectToUrl(component,event,url);
     }, 
  /* Method to  call BuildingWithBeerApp from Salesforce1 Home Page links*/
     clickBWB : function(component, event, helper) {
      var url= $A.get("$Label.c.C360_BuildingWithBeerApp");
      var isdesktop=$A.get("$Browser.isDesktop");
      if(!isdesktop){
          helper.redirectToUrl(component,event,url); 
      }
     },
    
   /* Method to  call OneDriveApp from Salesforce1 Home Page links*/
   clickOneDrive : function(component, event, helper) {
       var url= $A.get("$Label.c.C360_OneDrive");
  	   var isdesktop=$A.get("$Browser.isDesktop");
      if(!isdesktop){
          helper.redirectToUrl(component,event,url); 
      }
     },
  /* Method to  call BeerPointApp from Salesforce1 Home Page links*/   
  clickBP : function(component, event, helper) {
      var url= $A.get("$Label.c.C360_BeerPointApp");
      var isdesktop=$A.get("$Browser.isDesktop");
      if(!isdesktop){
          helper.redirectToUrl(component,event,url); 
      }

     }


})