({
    /*doInit: function(component, event, helper){
        
    },*/
    
    
     /* Method to  Call QCTeam URL from  TeamFolder UsefulLinks on homepage*/
    clickQCTeam: function(component, event, helper) {
        var Url= $A.get("$Label.c.C360_QCTeamFolderLink");
         helper.redirectToUrl(component,event,Url); 	
	},    
    /* Method to  call ATL folderlink from TeamFolder UsefulLinks on homepage*/
    clickATLteam : function(component, event, helper) {
         var Url= $A.get("$Label.c.C360_ATLTeamFolderLink");
         helper.redirectToUrl(component,event,Url); 	
	},

   /* Method to  call ManTeamFolderlink from  TeamFolder UsefulLinks on homepage*/    
   clickManTeam : function(component, event, helper) {
       var Url= $A.get("$Label.c.C360_MANTeamFolderLink");
         helper.redirectToUrl(component,event,Url);
     },
  /* Method to  call BCFolder Link from Salesforce1 TeamFolder UsefulLinks on homepage*/
     ClickBCTeam : function(component, event, helper) {
      var Url= $A.get("$Label.c.C360_BCTeamFolderLink");
       helper.redirectToUrl(component,event,Url); 
     },
    
   /* Method to  call ABFolderLink from Salesforce1 TeamFolder UsefulLinks on homepage*/
   clickABFolder : function(component, event, helper) {
       var Url= $A.get("$Label.c.C360_ABTeamFolderLink");
       helper.redirectToUrl(component,event,Url); 
     },
  /* Method to  call SASKTeamLink from Salesforce1 TeamFolder UsefulLinks on homepage*/   
  clickSASKTeam : function(component, event, helper) {
       var Url= $A.get("$Label.c.C360_SASKTeamFolderLink");
       helper.redirectToUrl(component,event,Url); 

     },
    
    /* Method to call ONTeamLink from Salesforce1 TeamFolder UsefulLinks on homepage*/   
  clickONTeam : function(component, event, helper) {
       var Url= $A.get("$Label.c.C360_ONTeamFolderLink");
       helper.redirectToUrl(component,event,Url); 

     }


})