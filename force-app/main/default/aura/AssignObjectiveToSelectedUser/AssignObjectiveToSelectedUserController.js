/*------------------------------------------------------------
Author:     Jacqueline Passehl
Company:    Slalom, LLC
History
<Date>      <Authors Name>           <Brief Description of Change>
2/13/2018   Jacqueline Passehl       Initial Creation
------------------------------------------------------------*/
({
   
    doInit : function(component, event, helper) {
        if(component.get("v.editingObjective")==false){
            helper.getUserList(component,event,helper);
        }
    },
    changeCountry : function(component, event, helper) {
     	 console.log(component.get("v.country"));
    },
    /*------------------------------------------------------------
    Description:   handler called when boolean editingObjective attribute is changed. If user is editing objective,
                   then populate title and department fields. If not editing, just retrieve user list.
    ------------------------------------------------------------*/
    handleEditing : function(component,event,helper){
        if(component.get("v.editingObjective")==true){
            helper.populateTitleAndDepartment(component,event,helper);
        }
        else{
            helper.getUserList(component,event,helper);
        }
    },
    
    getNextPage : function(component,event,helper){
        helper.getNextPage(component,event,helper);
    },
    /*------------------------------------------------------------
    Description:   When a title or department filter is added, filter the user list.    
    ------------------------------------------------------------*/
    filterUserList : function(component,event,helper){
        helper.filterUserList(component,event,helper);
    },
    /*------------------------------------------------------------
    Description:   When the "Automatically Apply to Matching Users" toggle is clicked, set the
                   attribute toggleApplyUsers to equal the value of the userToggleEdit checkbox input value.
                   Also if toggle is on then make sure all of the user checkboxes are no longer checked and
                   the numOfUsers attribute is reset to 0, else make sure numOfUsers equals the length of currentUsersList.
    ------------------------------------------------------------*/
    toggleBoxClick : function(component,event,helper){
        try{
            var currentUsersList = component.get("v.currentUsers");
            var toggleVal;
            
            if(component.get("v.editingObjective")==true)
            {
                toggleVal= component.find("userToggleEdit").getElement().checked;
                component.set("v.toggleApplyUsers",toggleVal);
                if(toggleVal){
                    var targetCheckboxes = document.getElementsByClassName("userlistEdit");
                    for (var i = 0; i < targetCheckboxes.length; i++){
                        targetCheckboxes[i].checked = false;
                    }
                }
            }
            else if(component.get("v.editingObjective")==false)
            {
                toggleVal= component.find("userToggle").getElement().checked;
                component.set("v.toggleApplyUsers",toggleVal);
                if(toggleVal){
                    var targetCheckboxes = document.getElementsByClassName("userlist");
                    for (var i = 0; i < targetCheckboxes.length; i++){
                        targetCheckboxes[i].checked = false;
                    }
                }
            }

            if(toggleVal){
                component.set("v.numOfUsers", currentUsersList.length);
            } else {
               // component.set("v.numOfUsers", 0);
            }
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Description:   Calls the saveObjective function on button press
    ------------------------------------------------------------*/
    saveObjective : function(component,event,helper){
      
       helper.saveAssignedObjective(component,event,helper);
    },
        
    /*------------------------------------------------------------
       Description:   calls insertOrRemoveJunction helper method.
    ------------------------------------------------------------*/
    insertOrRemoveJunction : function(component,event,helper){
        helper.insertOrRemoveJunction(component,event,helper);
    },
        
   
    updateNumOfUsersSelected : function(component, event, helper){
        try{
            var targetCheckboxes;
            if(component.get("v.editingObjective")){
                 targetCheckboxes = document.getElementsByClassName("userlistEdit");
            }
            else{
                 targetCheckboxes = document.getElementsByClassName("userlist"); 
            }
            var targetCheckboxesIds = [];
            for (var i = 0; i < targetCheckboxes.length; i++){
                if(targetCheckboxes[i].checked == true){
                    if(targetCheckboxes[i].id != ''){
                        var stringId = targetCheckboxes[i].id;
                        targetCheckboxesIds.push(stringId);
                    }
                }
            }
            component.set("v.numOfUsers", targetCheckboxesIds.length);
        } catch(e){
            console.error(e);
            helper.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    mySalesTeamToggle : function(component, event, helper){
        var toggleVal= component.find("myTeam").getElement().checked; 
       	component.set("v.mySalesTeam", toggleVal); 
        helper.getUserList(component, event, helper);
    },
    increment : function(component, event, helper){
    	var no_of_obj =	component.find("objectiveNumberText").getElement().value;
        console.log(no_of_obj)
        if(no_of_obj <99){
                no_of_obj++;
                component.set("v.Number_Of_Objective",no_of_obj);
        }
	},
 	 decrement : function(component, event, helper){
    	var no_of_obj =	component.find("objectiveNumberText").getElement().value;
    	if(no_of_obj > 1 ){
   	 		no_of_obj--;
    		component.set("v.Number_Of_Objective",no_of_obj);
        }
	}
   
})