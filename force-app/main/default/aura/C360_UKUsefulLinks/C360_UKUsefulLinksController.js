({        
    /* Method to  call GP/POR Calculator link from homepage links*/
    clickGpCal : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_GP_POR_Calculator_Link");
        helper.redirectToUrl(component,event,url); 
	},
     /* Method to  call CGA Reports from homepage links*/
    clickCGA :function(component, event, helper) {
        var url= $A.get("$Label.c.C360_CGAReportsLink");
        helper.redirectToUrl(component,event,url); 
	},       
     /* Method to  call Iknow from homepage links*/
    clickIknow :function(component, event, helper) {
        var url= $A.get("$Label.c.C360_IknowLink");
        helper.redirectToUrl(component,event,url); 
	},        
    /* Method to  call Period Brief from homepage links*/
    clickPbrief :function(component, event, helper) {
        var url= $A.get("$Label.c.C360_PeriodBriefLink");
        helper.redirectToUrl(component,event,url); 
	},  
    /* Method to  call Guest Ales range from homepage links*/
     guestAlesrange : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_GARLink");
        helper.redirectToUrl(component,event,url); 
	},
     /* Method to  call BeerPointApp from Salesforce1 Home Page links*/ 
     clickBP : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_BeerPointApp");
        var isdesktop=$A.get("$Browser.isDesktop");
      	if(!isdesktop){
          helper.redirectToUrl(component,event,url); 
      	}
	},
    /* Method to  call Brand Ved from Salesforce1 Home Page links*/ 
     clickBV : function(component, event, helper) {
        debugger;
        var url= $A.get("$Label.c.C360_BrandVideosApp");
        var isdesktop=$A.get("$Browser.isDesktop");
      	//if(!isdesktop){
        helper.redirectToUrl(component,event,url); 
      	//}
	},
     /* Method to  call BuildingWithBeerApp from Salesforce1 Home Page links*/
     clickBWB : function(component, event, helper) {
      var url= $A.get("$Label.c.C360_BuildingwithBeer_App_UK");
      var isdesktop=$A.get("$Browser.isDesktop");
      if(!isdesktop){
          helper.redirectToUrl(component,event,url); 
      }
	},
    /* Method to call Your Deal App */
    clickYourDeal : function(component, event, helper) {
      var url= $A.get("$Label.c.C360_YourDealAppLink");
      var isdesktop=$A.get("$Browser.isDesktop");
      //if(!isdesktop){
          helper.redirectToUrl(component,event,url); 
      //}
	},
     /* Method to  call MenuMakerLink from Salesforce1 Home Page links		*/
     clickMM : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_MenuMakerLink");
        helper.redirectToUrl(component,event,url); 
	},
     /* Method to  call MenuMakerBWLink from Salesforce1 Home Page links		*/
    clickMMBW : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_MMBWLink");
        helper.redirectToUrl(component,event,url); 
	},
    // Method to call C360_HotlinesLink from Salesforce1 Home Page links
    hotLines : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_HotlinesLink");
        helper.redirectToUrl(component,event,url); 
	},  
     /* Method to  call OffTrade external link  from homepage links 	*/
	clickOffTrade : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_Off_TradeWBLink");
         helper.redirectToUrl(component,event,url); 		
	},
     /* Method to  call Trax external link	*/
    clickTrax : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_Trax_app_link");
          var isdesktop=$A.get("$Browser.isDesktop");
         if(!isdesktop){
         	helper.redirectToUrl(component,event,url); 	
         }
	},    
    /* Method to  call 60SecondShop external link  from homepage links*/
	click60Shop : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_60SecondShop");
         helper.redirectToUrl(component,event,url); 	
	},
    
    clickOne : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_oneOTWBLinks");
         helper.redirectToUrl(component,event,url);
    },
    /* Method to  call Staples external link	*/
    /*clickReg : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_RegOTWB_Link");
         helper.redirectToUrl(component,event,url);	
	},*/
    /* Method to  call Archway external link	*/
   /*clickNatOT : function(component, event, helper) {
         var url= $A.get("$Label.c.C360_NatOT_Link");
         helper.redirectToUrl(component,event,url);	
	},*/
   /* Method to  call MDA_App link  */
   clickMDA : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_MDAEnterpriseApp");
        var isdesktop=$A.get("$Browser.isDesktop");
      	if(!isdesktop){
          helper.redirectToUrl(component,event,url); 		
      }		
     },			
    /* Method to  call MDA Website link  */
    clickMDAWeb: function(component, event, helper) {
        var url= $A.get("$Label.c.C360_MDAEnterprise_Website");
         helper.redirectToUrl(component,event,url);		
     },	
   /* Method to  call Your deal app from Salesforce1 Home Page links		*/ 
   clickYD : function(component, event, helper) {
       var url= $A.get("$Label.c.C360_YDA_link");
  	   var isdesktop=$A.get("$Browser.isDesktop");
      if(!isdesktop){
          helper.redirectToUrl(component,event,url); 		
      }
     },
    /* Method to  call Beer and Cider from Salesforce1 Home Page links */   
    clickBNC : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_BeerNCiderLink");
        helper.redirectToUrl(component,event,url); 
	},
     /* Method to  call Wine from Salesforce1 Home Page links */
    clickWine : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_WineLink");
        helper.redirectToUrl(component,event,url); 
	}, 
    /* Method to  call Spirits, Softs & RTDs from Salesforce1 Home Page links */
    clickSSR : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_SSRLink");
        helper.redirectToUrl(component,event,url); 
	},  
    /* Method to  call Cask & Craft from Salesforce1 Home Page links */	
    caskNc : function(component, event, helper) {
        var url= $A.get("$Label.c.C360_CaskNCLink");
        helper.redirectToUrl(component,event,url); 
	},
    /* Method to call Microlise from salesforce1 Homepage links */
    clickMicro: function(component, event, helper){
         var url= $A.get("$Label.c.C360_MicroliseLink");
        helper.redirectToUrl(component,event,url); 
    }
})