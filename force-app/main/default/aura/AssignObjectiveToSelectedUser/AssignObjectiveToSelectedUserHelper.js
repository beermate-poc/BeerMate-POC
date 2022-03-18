/*------------------------------------------------------------
Author:     Jacqueline Passehl
Company:    Slalom, LLC
History
<Date>      <Authors Name>           <Brief Description of Change>
2/13/2018   Jacqueline Passehl       Initial Creation
------------------------------------------------------------*/
({
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   On inital load, retrieve list of users. If logged in user is a CEO, then grab all the users in the system,
                   else only grab all the users underneath the logged in user.
    History
    <Date>       <Authors Name>           <Brief Description of Change>
    2/13/2018    Jacqueline Passehl       Initial Creation
    3/1/2018     Jacqueline Passehl       If the amount of users returned < the pageSize attribute,
                                          then set the "View More" button to be disabled.  
    ------------------------------------------------------------*/
    getUserList : function(component,event,helper) {
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                
                        /*if(component.get("v.mySalesTeam")==false){*/
                            var currentUserHiearchyList = component.get("c.filterUserListForObjective");
                            currentUserHiearchyList.setParams({
                                "userList" : component.get("v.allUsers"),
                                "title" : component.get("v.titleFilter"),
                                "State" :  component.get("v.State"),
                                "pageNumber": component.get("v.pageNumber"),
                                "pageSize": component.get("v.pageSize"),
                                "userRole": component.get("v.userRole"),
                                "myTeam":component.get("v.mySalesTeam"),
                                "manager":component.get("v.managerFilter")
                                });
                            
                            console.log(currentUserHiearchyList.getParams());
                            currentUserHiearchyList.setCallback(this, function(a) {
                                var state = a.getState();
                                
                                if (state === "SUCCESS") {
                                    $A.util.addClass(spinner, "slds-hide");
                                    component.set("v.currentUsers", a.getReturnValue().paginationUnderlings);
                                    component.set("v.allUsers", a.getReturnValue().allUnderlings);
                                    component.set("v.numOfUsers", a.getReturnValue().allUnderlings.length);
                                    //we want to call filterList as soon as we get this list if we are in edit mode
                                    //since there may already be filteres applied
                                    if(component.get("v.editingObjective")==true){
                                        this.filterUserList(component,event,helper);
                                    }
                                    if(a.getReturnValue().allUnderlings.length < component.get("v.pageSize")){
                                        component.set("v.viewMoreDisabled",true);
                                    } else {
                                        component.set("v.viewMoreDisabled",false);
                                    }
                                } else {
                                    $A.util.addClass(spinner, "slds-hide");
                                    var errors = a.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                        errors[0].message);
                                        }
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                            $A.enqueueAction(currentUserHiearchyList);
                      
                    } else {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = a.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                            errors[0].message);
                            }
                            this.handleShowNotice(component,event,helper,$A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            console.error("Unknown error");
                        }
                    }
        } catch(e){
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Upon click of the "View More" button, increase the page number, and call
                   filterUserList because filters may have already been set.
    History
    <Date>       <Authors Name>           <Brief Description of Change>
    3/1/2018    Jacqueline Passehl         Initial Creation
    ------------------------------------------------------------*/
    getNextPage : function(component,event,helper){
        //increase page number
        var pageNumber = component.get("v.pageNumber");
        pageNumber+=1;
        component.set("v.pageNumber",pageNumber);
        component.set("v.viewMoreFiltering",true);
        this.filterUserList(component,event,helper);
    },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Filters the list of users appearing in the table based on
                   title or department filters. Does this when an objective is clicked on for editing,
                   when adding a new objective, or when the "View More" button is clicked. (Will also grab
                   the next 'page' of users via apex)
    History
    <Date>       <Authors Name>           <Brief Description of Change>
    2/13/2018    Jacqueline Passehl         Initial Creation
    ------------------------------------------------------------*/
    filterUserList : function(component,event,helper){
        try{
            if(navigator.onLine){
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                if(!toggleVal){
                    component.set("v.numOfUsers", 0);
                }
                var selectionIdentifer =event.getParam("identifier"); 
                //will be null if we are just editing the objective and this is called or if View More is Clicked
                if(selectionIdentifer)
                {   
                    //reset pageNumber back to 1 and viewMore button enabled again if just filtering
                    component.set("v.pageNumber",1);
                    component.set("v.viewMoreFiltering",false);

                    if(selectionIdentifer=='Title'){
                        component.set("v.titleFilter",event.getParam("selectedValue"));
                    }
                    else if(selectionIdentifer=='State') {
                        component.set("v.state",event.getParam("selectedValue"));
                        console.log(component.get("v.state"));
                    }
                    else if(selectionIdentifer=='Name') {
                        component.set("v.managerFilter",event.getParam("selectedValue"));
                        console.log(component.get("v.managerFilter"));
                    }
                }

                var initialUserList = component.get("v.currentUsers");
                var toggleVal = component.get("v.toggleApplyUsers");

                var filtersApplied;

                if(component.get("v.state").length>0 || component.get("v.titleFilter").length>0){
                    filtersApplied=true;
                }
                else{
                    filtersApplied=false;
                }
                    var currentUserList = component.get("c.filterUserListForObjective");
                    currentUserList.setParams({
                    "userList" : component.get("v.allUsers"),
                    "title" : component.get("v.titleFilter"),
                    "state" :  component.get("v.state"),
                    "pageNumber": component.get("v.pageNumber"),
                    "pageSize": component.get("v.pageSize"),
                    "userRole": component.get("v.userRole"),
                    "myTeam":component.get("v.mySalesTeam"),
                    "manager":component.get("v.managerFilter")
                });
                currentUserList.setCallback(this, function(a) {
                    var state = a.getState();
                    if (state === "SUCCESS") {

                    //if we are filtering as a result of clicking "View More" button
                    if(component.get("v.viewMoreFiltering")==true){
                        //append next 100 users onto list & sort alphabetically
                        var combinedList = initialUserList.concat(a.getReturnValue().paginationUnderlings);
                        combinedList.sort(function(a, b) {
                          var nameA = a.Name.toUpperCase(); // ignore upper and lowercase
                          var nameB = b.Name.toUpperCase(); // ignore upper and lowercase
                          if (nameA < nameB) {
                            return -1;
                          }
                          if (nameA > nameB) {
                            return 1;
                          }
                          }); 

                            component.set("v.currentUsers",combinedList);
                            //if no filters-set numOfUsers count to be that initial all users count
                            if(!filtersApplied){
                                var allUsersSize = component.get("v.allUsers").length;
                                component.set("v.numOfUsers",allUsersSize);
                            }
                            //if filters then set numOfUsers count to be all underlings who fit the criteria
                            else{
                            component.set("v.numOfUsers",a.getReturnValue().allUnderlings.length);
                            }

                            if(combinedList.length<component.get("v.pageSize") || a.getReturnValue().paginationUnderlings.length==0){
                                component.set("v.viewMoreDisabled",true);
                            }
                            else{
                               component.set("v.viewMoreDisabled",false); 
                            }

                            //finished setting values-so set back to false
                            component.set("v.viewMoreFiltering",false);
                        }
                        // if we are filtering from adding title/departments- not click of "View More"
                        else{
                               component.set("v.currentUsers",a.getReturnValue().paginationUnderlings);
                               component.set("v.numOfUsers",a.getReturnValue().allUnderlings.length);

                               if(a.getReturnValue().paginationUnderlings.length<component.get("v.pageSize") || a.getReturnValue().paginationUnderlings.length==0){
                                component.set("v.viewMoreDisabled",true);
                                }
                            else{
                             component.set("v.viewMoreDisabled",false); 
                             }
                         }
                        
                        //if we are editing we want to get the Junction Users to show checked users
                        if(component.get("v.editingObjective"))
                        {
                            this.getJunctionUsers(component, event, helper);
                        }
                        
                        $A.util.addClass(spinner, "slds-hide");
                    } else {
                        $A.util.addClass(spinner, "slds-hide");
                        var errors = a.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                            errors[0].message);
                            }
                            this.handleShowNotice(component,event,helper,$A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(currentUserList);
            } else {
                this.handleShowNotice(component,event,helper,$A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Saves validation for a shared objective. if "Automatically Apply to Matching Users" toggle is
                   off and no users are selected, then throw an error.
    History
    <Date>       <Authors Name>         <Brief Description of Change>
    2/13/2018    Jacqueline Passehl      Initial Creation
    ------------------------------------------------------------*/
    saveAssignedObjective : function(component,event,helper){
        try{
            var selectedObjective;
            var targetCheckboxes;
             
            targetCheckboxes = document.getElementsByClassName("userlist"); 
            selectedObjective=component.get("v.plannedObjType");
            
             selectedObjective=component.get("v.plannedObjType");
             var numberOfobjective = component.find("objectiveNumberText").getElement().value;
            if( numberOfobjective === undefined ||  isNaN(numberOfobjective)===true ||  numberOfobjective <1 || numberOfobjective >99){
                 //this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Error_Message_No_of_Objective"), 'warning');
            	this.handleShowNotice(component,event,helper,$A.get("$Label.c.Warning"), $A.get("$Label.c.Error_Message_No_of_Objective"), 'warning');
            }else{
            var targetCheckboxesIds = [];
            for (var i = 0; i < targetCheckboxes.length; i++){
                if(targetCheckboxes[i].checked == true){
                    if(targetCheckboxes[i].id != ''){
                        var stringId = targetCheckboxes[i].id;
                        targetCheckboxesIds.push(stringId);
                    }
                }
            }
           
             var spinner = component.find("spinner");
           	
                //save logic for toggle is off
             if(!component.get("v.toggleApplyUsers")){
                    //if toggle is off atleast one user must be selected
                    if(targetCheckboxesIds.length==0) {   
                       
                        this.handleShowNotice(component,event,helper,$A.get("$Label.c.Warning"), $A.get("$Label.c.Target_User_Obj_Select_One_User"), 'warning');
                    }
                    else{
                       
                        component.set("v.errorsFound",false);
                        let params = event.getParam('arguments');
                        var createAssignedObjectives = component.get("c.createAssignedObjectives");
                        let ObjectiveId = params.ObjectiveId;
                        console.log( component.get("v.Number_Of_Objective"));
                        createAssignedObjectives.setParams({
                            "userList" : targetCheckboxesIds,
                            "ObjectiveId" : ObjectiveId,
                            "Number_Of_Objective" : numberOfobjective
                        });
                         $A.util.removeClass(spinner, "slds-hide");
                         createAssignedObjectives.setCallback(this, function(a) {
                    	 		var state = a.getState();
                             	
                   				 if (state === "SUCCESS") {
                                      $A.util.addClass(spinner, "slds-hide");
                                      this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Success_Message_Apply_objective"), 'success');
                                     $A.get("e.force:closeQuickAction").fire();
                                 }else {
                                    $A.util.addClass(spinner, "slds-hide");
                                    var errors = a.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                        errors[0].message);
                                        }
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                        
                		$A.enqueueAction(createAssignedObjectives);
                    }
             }else{
                 		
                  		let params = event.getParam('arguments');
                        var createAssignedObjectivesAllUser = component.get("c.createAssignedObjectivesAllUser");
                        let ObjectiveId = params.ObjectiveId;
                         $A.util.removeClass(spinner, "slds-hide");
                        createAssignedObjectivesAllUser.setParams({
                          
                            "title" : component.get("v.titleFilter"),
                            "state" :  component.get("v.state"),
                            "myTeam":component.get("v.mySalesTeam"),
                            "manager":component.get("v.managerFilter"),
                            "ObjectiveId" : ObjectiveId,
                            "Number_Of_Objective" : numberOfobjective
                           
                        });
                       createAssignedObjectivesAllUser.setCallback(this, function(a) {
                    	 		var state = a.getState();
                   				 if (state === "SUCCESS") {
                                      	$A.util.addClass(spinner, "slds-hide");
                                 		 this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Success_Message_Apply_objective"), 'success');
                                     	$A.get("e.force:closeQuickAction").fire();
                                 }else {
                                    $A.util.addClass(spinner, "slds-hide");
                                    var errors = a.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                        errors[0].message);
                                        }
                                        tthis.handleShowNotice(component,event,helper,$A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                        
                		$A.enqueueAction(createAssignedObjectivesAllUser);
                      
             }
            }
           
        } catch(e){
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
    },
   
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Upon clicking on an objective for editing, this should be the first thing to get called,
                   as it will grab exisiting title and department filters and then filter the list of users returned
                   by any existing fitlers.
    History
    <Date>       <Authors Name>         <Brief Description of Change>
    2/22/2018    Jacqueline Passehl      Initial Creation
    ------------------------------------------------------------*/
     populateTitleAndDepartment : function(component,event,helper){
        try{
            var objectiveType = component.get("v.objective.Planned_Objective__r.Planned_Objective_Type__c");
            if(objectiveType){
                if(objectiveType == 'Shared' || objectiveType == 'MBO'){
                    component.set("v.plannedObjType", objectiveType);
                    component.set("v.isSharedObjective",true);
                } else {
                    component.set("v.plannedObjType", objectiveType);
                    component.set("v.isSharedObjective",false);
                }
            }
            var titleString = component.get("v.objective.Title__c");
            var departmentString = component.get("v.objective.Department__c");

            if(titleString) {
                //get rid of commas in this string to get it back into array format
                var titleArray = titleString.split(',');
                //pass it into the MultiSelectPills component when it is called for editing
               component.find("titleEdit").set("v.selectedAnswers",titleArray);
               component.set("v.titleFilter", titleArray);

            }
            if(departmentString) {
                //get rid of commas in this string to get it back into array format
                 var departmentArray =departmentString.split(',');

                 //pass it into the MultiSelectPills component when it is called for editing
                component.find("departmentEdit").set("v.selectedAnswers",departmentArray);
                component.set("v.departmentFilter", departmentArray);
            }
            this.getUserList(component,event,helper);
        } catch(e) {
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
     },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Upon clicking on an objective for editing, this will get any existing users from 
                   the junction object (Objective_User_Assignment__c) and if any found, set their checkboxs to true.
    History
    <Date>         <Authors Name>         <Brief Description of Change>
    2/22/2018      Jacqueline Passehl      Initial Creation
    ------------------------------------------------------------*/
     getJunctionUsers: function(component,event,helper){
        try{
            if(navigator.onLine){
                var getJunctionUsers = component.get("c.getUserFromJunction");
                getJunctionUsers.setParams({
                    "objectiveId" : component.get("v.objective.Id")
                });
                getJunctionUsers.setCallback(this, function(a) {
                    var state = a.getState();
                    if (state === "SUCCESS") {
                        var junctionUserList= a.getReturnValue();
                        if(junctionUserList.length==0){
                            component.set("v.toggleApplyUsers",true);
                        }
                        else if (junctionUserList.length >= 1){
                            component.set("v.toggleApplyUsers",false);
                            //get list of users from table and set their checkboxes
                            var targetCheckboxes = document.getElementsByClassName("userlistEdit");
                            var junctionUserIdsArray = [];
                            for(i=0; i < junctionUserList.length ;i++){
                                junctionUserIdsArray.push(junctionUserList[i].Id);
                            }
                            for (var i = 0; i < targetCheckboxes.length; i++){
                                if(junctionUserIdsArray.indexOf(targetCheckboxes[i].id) > -1){
                                    targetCheckboxes[i].checked = true;
                                }
                            }
                          component.set("v.numOfUsers", junctionUserIdsArray.length);
                        }
                    } else {
                        var errors = a.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                            errors[0].message);
                            }
                            this.handleShowNotice(component,event,helper,$A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(getJunctionUsers);
            } else {
                this.handleShowNotice(component,event,helper,$A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
            }
        } catch(e){
            console.error(e);
            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
        }
     },
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Creates a toast msg on the page

    History
    <Date>       <Authors Name>         <Brief Description of Change>
    2/13/2018   Jacquelin Passehl      Initial Creation
    ------------------------------------------------------------*/
     displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['duration'] = duration
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    },
     handleShowNotice : function(component, event, helper,title,message,type) {
        component.find('notifLib').showNotice({
            "variant": type,
            "header": title,
            "message": message,
             closeCallback: function() {
                
            }
        });
    }
})