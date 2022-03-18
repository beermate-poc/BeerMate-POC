({
	doInit : function(component, event, helper) {
		if (navigator.userAgent.match(/Tablet|iPad/i)){
            component.set('v.ifmsrc',$A.get("$Label.c.Home_Chain_Mobile_Tablet"));
        } else if(navigator.userAgent.match(/Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i)){
            component.set('v.ifmsrc',$A.get("$Label.c.Home_Chain_Mobile"));
        } else {
            component.set('v.ifmsrc',$A.get("$Label.c.Home_Chain_Desktop"));
        }
    },
    openHelpMeUrl : function (component){
        window.open($A.get("$Label.c.HomeChain_Sway_Link")); 
    }
})