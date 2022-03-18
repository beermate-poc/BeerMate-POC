/*------------------------------------------------------------
Author:        Jacqueline Passehl
Company:       Slalom, LLC
Description:   A controller for the AddObjective,TargetUserObjective, and CreateNewPersonalObjective lightning component
Inputs:        none
Test Class:    AddObjectiveControllerTest
History
2/9/2018      Jacqueline Passehl     inital creation
2/13/2018     Jacqueline Passehl     combined the apex classes PersonalObjectiveController, and TargetUserObjectiveController
                                     into this one to have all functionality combined
------------------------------------------------------------*/
public class AddObjectiveController 
{
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   Inserts a planned objective and an objective
    Inputs:        "objective" - objective record to be inserted
                   "parent" - planned objective record to be inserted
                   "objectiveType" - record type for the objective
                   "plannedObjectiveType" - type for planned objetive
    Returns:       the id of the newly inserted record
    History
    6/22/2017      Nick Serafin     Added plannedObjectiveType input to the method
    8/9/2017       Brian Mansfield  modified return value for duplicate checking, added param
    2/9/2018       Jacqueline Passehl   seperated the inserting of records and duplicate checking (see checkDuplicates below )
                                        Added params for title and department fields, and 
                                        changed return type for retrieval of the id used for creation of a user-objective junction object
    4/6/2018       Jacqueine Passehl    Added param for selectedMBO input field on CreateNewPersonalObjective                              

    ------------------------------------------------------------*/
    @AuraEnabled
    public static Id insertOrUpdateRecords(Objective__c objective, Planned_Objective__c parent, String objectiveType, String plannedObjectiveType,
        String[] title, String[] department, Boolean editing, Boolean toggle, String delegateId ,Boolean calledFromVF,Id wthId, Id selectedMBOId) {
        
        if(editing){
            if(objectiveType==null){
                objectiveType = objective.RecordType.Name;
            }
            //if editing with MBO selected
            if(selectedMBOId!=null)
            {
                //if adding an MBO on edit
                if(!objective.Created_Via_MBO__c){
                    parent.Name = objective.Planned_Objective__r.Name;
                }
                parent.Id = objective.Planned_Objective__r.Id;
            }
            //if editing without MBO selected
            else if(selectedMBOId==null)
            {   
                //if removing an existing MBO
                if(objective.Planned_Objective__r.Name == '' || objective.Planned_Objective__r.Name == null){
                   //removeExistingMBO = true;
                   parent.Planned_Objective_Type__c = plannedObjectiveType;
                    //if removing MBO on edit and going to Personal- will no longer be shared
                    if(plannedObjectiveType=='Personal'){
                        if(objective.Title__c!=null){
                            objective.Title__c = null;
                        }
                        if(objective.Department__c!=null){
                            objective.Department__c=null;
                        }
                    }
                }
                else{
                    parent.Id = objective.Planned_Objective__r.Id;
                    parent.Name = objective.Planned_Objective__r.Name;
                    parent.Start_Date__c = objective.Planned_Objective__r.Start_Date__c;
                    parent.End_Date__c = objective.Planned_Objective__r.End_Date__c;
                }
            }
        upsert parent;

        } else if (!editing && selectedMBOId==null) {
            if(delegateId != null && delegateId != ''){
                objective.OwnerId = delegateId;
            }
            parent.Planned_Objective_Type__c = plannedObjectiveType;
            insert parent;
        }
        //will be null if going from personal/shared to MBO
        if(parent.Name != null){
            objective.Name = plannedObjectiveType + ': ' + parent.Name + ' - ' + objectiveType;
        }
        objective.Is_Template__c = true;
        if(selectedMBOId!=null){
           objective.Created_Via_MBO__c = true;
           objective.Planned_Objective__c = selectedMBOId;
        }
        else{
            objective.Created_Via_MBO__c = false;
            objective.Planned_Objective__c = parent.Id;
        }
        objective.Toggle_Users__c = toggle;
        String mcProduct = objective.MC_Product__c;
        String brandName = objective.Brands__c;
        String brandGroup = objective.BMC_Brand_Group__c;
        String brandFamily = objective.BMC_Brand_Family__c;    
            
        if(mcProduct == null || mcProduct == ''){
            system.debug('brandName'+brandName);
            if(brandName!=null){
               List<Product__c> brand = [SELECT Id FROM Product__c WHERE TrademarkBrandLongNme__c = :objective.Brands__c AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) LIMIT 1];
            if(!brand.isEmpty()){
                objective.MC_Product__c = brand[0].Id;
            } 
            }            
            if(brandGroup!=null){
               List<Product__c> brandGrouplist = [SELECT Id FROM Product__c WHERE CmrclPlanningBrandGroupNme__c = :objective.BMC_Brand_Group__c AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) LIMIT 1];
            if(!brandGrouplist.isEmpty()){
                objective.MC_Product__c = brandGrouplist[0].Id;
            } 
            }  
             if(brandFamily!=null){
               List<Product__c> brandFamilylist = [SELECT Id FROM Product__c WHERE TrademarkBrandFamilyNme__c = :objective.BMC_Brand_Family__c AND RetailBrandFlag__c = true AND (OrderableSKULifecycleStatusNme__c = :Constants.ACTIVE OR OrderableSKULifecycleStatusNme__c = :Constants.PHASE_OUT) LIMIT 1];
            if(!brandFamilylist.isEmpty()){
                objective.MC_Product__c = brandFamilylist[0].Id;
            } 
            }  
        }
        if(!title.isEmpty()){
            if(title.size()==1){
                objective.Title__c = title[0];
            } else{
                objective.Title__c = string.join(title,',');
            }
        }
        if (!department.isEmpty()){
            if(department.size()==1){
                objective.Department__c = department[0];
            } else{
                objective.Department__c = string.join(department,',');
            }
        }
        if(!editing){
            Schema.DescribeSObjectResult objSO = Schema.SObjectType.Objective__c; 
            Map<String,Schema.RecordTypeInfo> rtMapByName = objSO.getRecordTypeInfosByName();
            Schema.RecordTypeInfo rtByName =  rtMapByName.get(objectiveType);
            objective.RecordTypeId = rtByName.getRecordTypeId();
        }
        upsert objective;
            if(calledFromVF==true){
                TargetListController.createObjectives(wthId,objective.Id);
            }
            
        //return the Id so that you can use it with the user-objecive junction object (Objective_User_Assignment__c)
        return objective.Id;
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   deletes an objective
    Inputs:        "objectiveId" - The id of the objective to be deleted

    Returns:        nothing
    History
    3/29/2018      Jacqueline Passehl    Inital Creation
    ------------------------------------------------------------*/
    @AuraEnabled
    public static void deleteObjective(Id objectiveId){
       Objective__c objToDelete = [SELECT Id, Name FROM Objective__c WHERE Id=: objectiveId ];
       delete objToDelete;
    }
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   Inserts a planned objective and an objective
    Inputs:        "objective" - objective record to be inserted
                   "parent" - planned objective record to be inserted
                   "objectiveType" - record type for the objective
                   ignoreDuplicateCheck -boolean to check duplicate planned objectives

    Returns:       null if success, the duplicate planned objective if a dup is found
    History
    6/22/2017      Nick Serafin     Added plannedObjectiveType input to the method
    8/9/2017       Brian Mansfield  modified return value for duplicate checking, added param
    2/9/2018       Jacqueline Passehl   modified to make it a method for just checking dupicates, and moved inserting
                                        of records into insertRecords method (see above)
    ------------------------------------------------------------*/
    @AuraEnabled
    public static Planned_Objective__c checkDuplicates(Objective__c objective, Planned_Objective__c parent, String objectiveType, Boolean ignoreDuplicateCheck) {
        if (!ignoreDuplicateCheck) {
            Planned_Objective__c duplicateCheck = checkIfDuplicatePlannedObjectiveExists(parent, objectiveType, objective.Brands__c);
            if (duplicateCheck != null) {
                return duplicateCheck;
            }
        }
        return null;
    }
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   Returns the users role
    Inputs:        none
    Returns:       Users role as a string
    History
    6/22/2017      Nick Serafin     Initial Creation
    ------------------------------------------------------------*/
    @AuraEnabled
    public static String getUserRole() {
        User userObj = [SELECT UserRole.Name FROM User WHERE UserRoleId = :UserInfo.getUserRoleId() LIMIT 1];
        return userObj.UserRole.Name;
    }
    /*------------------------------------------------------------
    Author:        Brian Mansfield
    Company:       Slalom, LLC
    Description:   Checks if there already exist a Planned Objective of the same type where the associated template has the same brand
    Inputs:        none
    Returns:       the string "OK" if no duplicate found, else a string with the error message to display in client-side
                   toast if a duplicate is found with the duplicates type, name, start date and end date.
    History
    8/4/2017       Brian Mansfield     Initial Creation
    11/1/2017      Matt Kelly          Updated to use custom label that stores list of available roles
    11/14/2017     Matt Kelly          Updated to if user has a shared role it should not check for duplicates
    ------------------------------------------------------------*/
    @testVisible
    private static Planned_Objective__c checkIfDuplicatePlannedObjectiveExists(Planned_Objective__c plannedObjToCheck, String objectiveType, String mcProduct) {
        String role = getUserRole();
        List<String> shared_objective_roles = System.Label.Shared_Objective_Roles.split(', ');
        Boolean hasSharedRole = false;
        for (String r : shared_objective_roles) {
            if(r == role) {
                hasSharedRole = true;
                break;
            }
        }
        if(!hasSharedRole){
            for (Objective__c obj : [SELECT Planned_Objective__r.CreatedById, Planned_Objective__r.End_Date__c,
                                    Planned_Objective__r.Name, Planned_Objective__r.Planned_Objective_Type__c, Planned_Objective__r.Start_Date__c, MC_Product__c
                                    FROM Objective__c
                                    WHERE RecordType.Name = :objectiveType
                                    AND Brand_Name__c = :mcProduct
                                    AND Planned_Objective__r.Start_Date__c <= :plannedObjToCheck.End_Date__c
                                    AND Planned_Objective__r.End_Date__c > :plannedObjToCheck.Start_Date__c
                                    AND Is_Template__c = true
                                    ORDER BY Planned_Objective__r.Planned_Objective_Type__c ASC]) {
                if (obj.Planned_Objective__r.Planned_Objective_Type__c == Constants.OBJECTIVE_MBO) {
                    return obj.Planned_Objective__r;
                } else if (obj.Planned_Objective__r.Planned_Objective_Type__c == Constants.OBJECTIVE_PERSONAL) {
                    if (obj.Planned_Objective__r.CreatedById == UserInfo.getUserId()) {
                        return obj.Planned_Objective__r;
                    }
                }
            }
        }
        // else no duplicates found
        return null;
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   wrapper class for the UserLists- Used in order to keep track of all users returned vs
                   each "page" of users 

    Inputs:        none
    Returns:       none
    History        
    3/1/2018       Jacqueline Passehl Inital Creation
    ------------------------------------------------------------*/
    public class userObjectiveLists{
        @AuraEnabled
        public List<User> allUnderlings {get; set;}
        @AuraEnabled
        public List<User> paginationUnderlings {get; set;}
        @AuraEnabled
        public Id delegateUser {get; set;}
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Finds all users underneath current logged in user in Manager Hierarchy (goes 5 levels deep). This
                    Method should be called if the logged in user is not a COE
    Inputs:        "userId" - id of the currently logged in user

    Returns:       list of users underneath logged in user
    2/9/2018       Jacqueline Passehl   initial creation
    3/2/2018       Jacqueline Passehl   updated to if the logged in user has an Objective Delegate field filled out,
                                        then instead give the view of that Objective Delegate user.
    3/8/2018       Jacqueline Passehl   return type updated to userObjectiveLists in order to return both list of all users and list of users brought back via pagination                                 

    ------------------------------------------------------------*/
    @AuraEnabled
    public static userObjectiveLists findUserinManagerHierarchy(Id loggedInUserId,String[] title, String[] department){
        userObjectiveLists result = new userObjectiveLists();
        //create a list to hold all user Ids under Manager
        List<Id> userIds= new List<Id>();
        List<User> userList = new List<User>();
        Integer levelCount = 0;
        Id userToCheckId = loggedInUserId;
        //check if logged in user has an Objective Delegate, if so then find all users underneath this user instead.
        User loggedinUser = [SELECT Id, Objective_Delegate__c from User WHERE Id=: loggedInUserId AND Profile.Name IN (:Constants.SALES_ADMINISTRATOR, :Constants.SALES_USER, :Constants.SYSTEM_ADMINISTRATOR) ];
        if(loggedinUser.Objective_Delegate__c!=null){
            userToCheckId= loggedinUser.Objective_Delegate__c;
            result.delegateUser = loggedinUser.Objective_Delegate__c;
        }
        levelCount+=1;
        for (User user : [SELECT Id, Name, Title, Department, ManagerId, IsActive from User WHERE ManagerId=:userToCheckId AND IsActive=true AND Profile.Name IN (:Constants.SALES_ADMINISTRATOR, :Constants.SALES_USER, :Constants.SYSTEM_ADMINISTRATOR)]){
            if(user.ManagerId != null){
                userIds.add(user.Id);
                userList.add(user);
            }
        }
        List<User> nextUserLevel = [SELECT Id, Name, Title, Department, ManagerId, IsActive from User WHERE ManagerId IN: userIds AND IsActive=true AND Profile.Name IN (:Constants.SALES_ADMINISTRATOR, :Constants.SALES_USER, :Constants.SYSTEM_ADMINISTRATOR)];
        levelCount+=1;
        userList.addAll(nextUserLevel);
        getAllBelowUsers(userList,nextUserLevel,levelCount);
        //filter user list by name ascending in filterAndGrabUsers after recursively grabbing all users underneath
        userObjectiveLists filteredUsers= filterAndGrabUsers(userList,title,department,1,100,'');//1 and 100 should be same as pageNumber & pageSize attribute defaults
        result.paginationUnderlings= filteredUsers.paginationUnderlings;
        result.allUnderlings=userList;
        return result;
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:    recursive helper method to continuously grab all users below the current list of users 
    Inputs:         "userList" - list of users that are underneath the current list of users
                    "nextUserLevel" - the "next level" of users in the manager hierarchy
                    "levelCount" - the current level that we are deep in the hiearchy

    Returns:       nothing
    2/9/2018       Jacqueline Passehl   initial creation

    ------------------------------------------------------------*/
    private static void  getAllBelowUsers(List<User> userList,List<User> nextUserLevel, Integer levelCount){
        if(!nextUserLevel.isEmpty() && levelCount <= Constants.MAX_LEVEL_5){
            List<User> nextLevel = [SELECT Id, Name, Title, Department, ManagerId,IsActive from User WHERE ManagerId IN: nextUserLevel AND IsActive=true AND Profile.Name IN (:Constants.SALES_ADMINISTRATOR, :Constants.SALES_USER, :Constants.SYSTEM_ADMINISTRATOR)];
            levelCount+=1;
            for(User user : nextLevel){
                userList.add(user);
            }
            getAllBelowUsers(userList,nextLevel,levelCount);
        }
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:    filters the list of users grabbed from findUserinManagerHierarchy() by title and department
                    as selected by from the MultiSelectPills component in TargetUserObjective component

    Inputs:         "userList" - list of users in the next set of filtered users
                    "title" - title filter(s) applied
                    "department" - department filter(s) applied

    Returns:       list of fitlered users
    2/9/2018       Jacqueline Passehl   initial creation
    2/28/2018      Jacqueline Passehl   combined grabbing of all users and filtering users

    ------------------------------------------------------------*/
    @AuraEnabled
    public static userObjectiveLists filterAndGrabUsers (List<User> userList, String[] title, String[] department,Decimal pageNumber, Decimal pageSize, String userRole)
    {
        userObjectiveLists result = new userObjectiveLists();
        List<User> filteredUsers= new List<User>();
		
        Integer skipRecords = Integer.valueOf((pageNumber - 1) * pageSize);
        Integer maxRecords = Integer.valueOf(pageSize);

        String query =
            'SELECT' + 
                ' Id, Name, Title, Department, ManagerId ' +
             'FROM' +
                ' User ' +
                ' WHERE ' +
                    ' IsActive = true AND (Profile.Name = ' + '\''+ Constants.SALES_ADMINISTRATOR + '\''+
            ' OR Profile.Name = ' + '\''+ Constants.SALES_USER + '\''+
			' OR Profile.Name = ' + '\''+ Constants.SYSTEM_ADMINISTRATOR + '\''+
            ') '; 
        if(!title.isEmpty())
        {
            query += ' AND Title IN: title ';
        }
        if(!department.isEmpty())
        {
            query += ' AND Department IN: department ';
        }
        //ONLY add this query if you are not a COE (Not Sales Admin)
        if(userRole !='Sales Administrator')
        {
           query += ' AND Id IN:userList ';
        }
        query += ' ORDER BY Name ASC ';
        query += ' LIMIT :maxRecords ';
        query += ' OFFSET :skipRecords ';

        filteredUsers = (List<User>)Database.query(query);

        result.allUnderlings=findAllUsers(title,department,userList,userRole);
        result.paginationUnderlings= filteredUsers;
        return result;
    }
    //subhrant 
    @AuraEnabled
    public static userObjectiveLists filterUserListForObjective (List<User> userList, String[] title, String[] state,Decimal pageNumber, Decimal pageSize, String userRole,Boolean myTeam,String[] manager)
    {
        userObjectiveLists result = new userObjectiveLists();
        List<User> filteredUsers= new List<User>();
        List<String> profile = new  List<String>();
        user loggedinUser	=[select id,country from user where id=: userinfo.getUserId()];
        String country = '';
         List<user> managerList = new   List<user>();
         if(!manager.isEmpty()){
                 managerList	=[select id,C360_CRM_Employee_ID__c from user where name  IN : manager];
         }
        if(C360_Util_Constants.OBJECTTIVE_PROFILE.get(loggedinUser.country) !=null){
            	 country = loggedinUser.country;
            	 profile =  C360_Util_Constants.OBJECTTIVE_PROFILE.get(loggedinUser.country);
        }
	
        
        Integer skipRecords = Integer.valueOf((pageNumber - 1) * pageSize);
        Integer maxRecords = Integer.valueOf(pageSize);

        String query =
            'SELECT' + 
                ' Id, Name, Title, State, ManagerId ' +
             'FROM' +
                ' User ' +
                ' WHERE ' +
                ' IsActive = true AND Profile.Name  IN :profile'; 
        
        if(!string.isBlank(country)){
            query += ' AND Country =: country ';
        }
        if(!title.isEmpty())
        {
            query += ' AND Title IN: title ';
        }
        if(!state.isEmpty())
        {
            query += ' AND State IN: state ';
        }
         if(myTeam)
        {
            query += ' AND My_Sales_Team__c= true';
        }
        if(!manager.isEmpty()){
            set<string> CrmId  = new  set<string>();
            set<string> UserId = new  set<string>();
            for(user userrec : managerList){
                if( userrec.C360_CRM_Employee_ID__c !=null){
                     
                     CrmId.add(userrec.C360_CRM_Employee_ID__c);
                }
                UserId.add(userrec.id);
            }
            if(!CrmId.isEmpty()){
                 query += ' AND  (C360_F1_CRM_ID__c IN :CrmId OR C360_F2_CRM_ID__c IN : CrmId OR C360_F3_CRM_ID__c IN :CrmId OR C360_F4_CRM_ID__c IN : CrmId OR C360_F5_CRM_ID__c IN: CrmId OR ManagerId IN : UserId OR Manager.ManagerId IN : UserId )';
            }else{
                 query += ' AND  ( ManagerId IN : UserId OR Manager.ManagerId IN : UserId )';
            }
         
        }

        query += ' ORDER BY Name ASC ';
        query += ' LIMIT :maxRecords ';
        query += ' OFFSET :skipRecords ';
		
        filteredUsers = (List<User>)Database.query(query);
		
        result.allUnderlings=filteredUsers;
        result.paginationUnderlings= filteredUsers;
        return result;
    }
    //subhrant createAssignedObjectives
    @AuraEnabled
    public static void createAssignedObjectives (List<string> userList,String ObjectiveId,Integer Number_Of_Objective){
  		Id assigneObjectiveRecordTypeId = [select Id,Name from RecordType where DeveloperName='C360_Assigned_Objective'].id;
        
       Objective__c objectiveRec  = [select Id,Name,Account__c,Objective_type__c,BMC_Projected90Days__c,Number_of_Objectives__c,Target_Volume_Qty__c,Target_Volume_UOM__c 
                                     from Objective__c where id=:ObjectiveId];
        if(Number_Of_Objective !=null){
            objectiveRec.Number_of_Objectives__c = Number_Of_Objective;
        }
        List<Objective__c> assignedObjectiveToInsert = new  List<Objective__c>();
        Objective__c assignedObjective;
        for(string  userRec : userList){
            for(integer i =1; i <= Number_Of_Objective; i++){
            	assignedObjective = new Objective__c();
            	assignedObjective.Account__c = objectiveRec.Account__c;
            	assignedObjective.Name = objectiveRec.Name;
            	assignedObjective.Objective_type__c = objectiveRec.Objective_type__c;
            	assignedObjective.Objective__c = objectiveRec.Id;
            	assignedObjective.OwnerId = userRec;
           		assignedObjective.RecordTypeId = assigneObjectiveRecordTypeId;
                assignedObjective.Target_Volume_Qty__c = objectiveRec.Target_Volume_Qty__c;
                assignedObjective.Target_Volume_UOM__c = objectiveRec.Target_Volume_UOM__c;
               	assignedObjectiveToInsert.add(assignedObjective);
            	}
            	
        }
        if(assignedObjectiveToInsert.size()>0){
              update objectiveRec;
              System.enqueueJob(new AsyncObjectiveInsert(assignedObjectiveToInsert));
        }
      
    }
    
    public class AsyncObjectiveInsert implements Queueable {
        List<Objective__c> objectiveListToInsert = new List<Objective__c>();
        AsyncObjectiveInsert(List<Objective__c> objectiveList ){
            objectiveListToInsert = objectiveList;
        }
        public void execute(QueueableContext context) {
              	insert objectiveListToInsert;
       		    
        }
	}
    
   
     @AuraEnabled
    public static void createAssignedObjectivesAllUser (String[] title, String[] state ,Boolean myTeam,String[] manager,String ObjectiveId,Integer Number_Of_Objective){
    	 userObjectiveLists result = new userObjectiveLists();
        List<User> filteredUsers= new List<User>();
        List<String> profile = new  List<String>();
        user loggedinUser	=[select id,country from user where id=: userinfo.getUserId()];
         String country = '';
         List<user> managerList = new   List<user>();
         if(!manager.isEmpty()){
                 managerList	=[select id,C360_CRM_Employee_ID__c from user where name  IN : manager];
         }
        if(C360_Util_Constants.OBJECTTIVE_PROFILE.get(loggedinUser.country) !=null){
            	 country = loggedinUser.country;
            	 profile =  C360_Util_Constants.OBJECTTIVE_PROFILE.get(loggedinUser.country);
        }
	
        
       

        String query =
            'SELECT' + 
                ' Id, Name, Title, State, ManagerId ' +
             'FROM' +
                ' User ' +
                ' WHERE ' +
                ' IsActive = true AND Profile.Name  IN :profile'; 
        
        if(!string.isBlank(country)){
            query += ' AND Country =: country ';
        }
        if(!title.isEmpty())
        {
            query += ' AND Title IN: title ';
        }
        if(!state.isEmpty())
        {
            query += ' AND State IN: state ';
        }
         if(myTeam)
        {
            query += ' AND My_Sales_Team__c= true';
        }
        if(!manager.isEmpty()){
            set<string> CrmId  = new  set<string>();
            set<string> UserId = new  set<string>();
            for(user userrec : managerList){
                if( userrec.C360_CRM_Employee_ID__c !=null){
                     
                     CrmId.add(userrec.C360_CRM_Employee_ID__c);
                }
                UserId.add(userrec.id);
            }
            if(!CrmId.isEmpty()){
                 query += ' AND  (C360_F1_CRM_ID__c IN :CrmId OR C360_F2_CRM_ID__c IN : CrmId OR C360_F3_CRM_ID__c IN :CrmId OR C360_F4_CRM_ID__c IN : CrmId OR C360_F5_CRM_ID__c IN: CrmId OR ManagerId IN : UserId OR Manager.ManagerId IN : UserId )';
            }else{
                 query += ' AND  ( ManagerId IN : UserId OR Manager.ManagerId IN : UserId )';
            }
         
        }
		List<String> userList = new List<string>();
        for(User userrec : (List<User>)Database.query(query)){
            userList.add(userrec.id);
        }
		
        system.debug('@@' +Number_Of_Objective);
        if(userList.size()>0){
            createAssignedObjectives(userList,ObjectiveId,Number_Of_Objective);
        }
      
		
    }
    
    
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:    inserts a junction object; Objective_User_Assignment__c based on current selected users and the objective
                    being created

    Inputs:         "objectiveId" - Id of created objective
                    "userIdList" - list of the selected user's ids
  
    Returns:       nothing
    2/9/2018       Jacqueline Passehl   initial creation

    ------------------------------------------------------------*/
    @AuraEnabled
    public static void HandleJunctionObjects (Id objectiveId, List<Id> userIdList, Boolean toggleUsers)
    {
        List<Objective_User_Assignment__c> junctionObjList = getJunctionObj(objectiveId);
        List<Id> existingUserIds = new List<Id>();

        //Loop through for removal of users on edit
        List<Objective_User_Assignment__c> junctionObjsToRemove = new List<Objective_User_Assignment__c>();
        for(Objective_User_Assignment__c juntionObj: junctionObjList){
 
            //if the existing list has users that aren't in the list of users selected then remove them
            if(!userIdList.contains(juntionObj.User__c) || toggleUsers){
                junctionObjsToRemove.add(juntionObj);
            }
            else{
                existingUserIds.add(juntionObj.User__c);
            }
        }
        //loop through for addition of users on edit or adding a new objective
        List<Objective_User_Assignment__c> objectiveUserList= new List<Objective_User_Assignment__c>();
        for(Id userId : userIdList){
            //if user in list of users selected is NOT in the existing list
            if(!existingUserIds.contains(userId)){
                Objective_User_Assignment__c objectiveUser = new Objective_User_Assignment__c();
                objectiveUser.User__c = userId;
                objectiveUser.Objective__c =objectiveId;
                objectiveUserList.add(objectiveUser);
            }
        }
        if(!objectiveUserList.isEmpty()){
            insert objectiveUserList;
        }
        if(!junctionObjsToRemove.isEmpty()){
            delete junctionObjsToRemove;
        }
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   returns  list of users from junction object Objective_User_Assignment__c by matching objective

    Inputs:         none
  
    Returns:       List<User>
    2/19/2018       Jacqueline Passehl   initial creation
    ------------------------------------------------------------*/
    @AuraEnabled
    public static List<User> getUserFromJunction (Id objectiveId){
        return [SELECT Id, Name, Title, Department, ManagerId FROM User WHERE Id IN (SELECT User__c FROM Objective_User_Assignment__c WHERE Objective__c =: objectiveId) AND Profile.Name IN (:Constants.SALES_ADMINISTRATOR, :Constants.SALES_USER, :Constants.SYSTEM_ADMINISTRATOR)];
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   get junction object Objective_User_Assignment__c by matching objective id

    Inputs:         objectiveId
  
    Returns:       List<Objective_User_Assignment__c>
    2/19/2018      Jacqueline Passehl   initial creation
    ------------------------------------------------------------*/
    public static List<Objective_User_Assignment__c> getJunctionObj (Id objectiveId){
        return [SELECT Id, Name, Objective__c, User__c FROM Objective_User_Assignment__c WHERE Objective__c =: objectiveId ] ;
    }
    /*------------------------------------------------------------
    Author:        Nick Serafin
    Company:       Slalom, LLC
    Description:   Returns all the active users in the system
    Inputs:        none
    Returns:       Lists<User>
    History
    2/14/2018      Nick Serafin         Initial Creation
    3/8/2018       Jacqueline Passehl   Updated to show all the active users in the system that are filtered by title and department (but no pagination)
    ------------------------------------------------------------*/
    @AuraEnabled
    public static List<User> findAllUsers(String[] title, String[] department, List<User> userList, String userRole) {

        List<User> allUsers= new List<User>();    
        
        String query =
       'SELECT' + 
           ' Id, Name, Title, Department, ManagerId ' +
        'FROM' +
           ' User ' +
           ' WHERE ' +
            ' IsActive = true AND (Profile.Name = ' + '\''+ Constants.SALES_ADMINISTRATOR + '\''+
            ' OR Profile.Name = ' + '\''+ Constants.SALES_USER + '\''+
			' OR Profile.Name = ' + '\''+ Constants.SYSTEM_ADMINISTRATOR + '\''+
            ') ';
        if(!title.isEmpty())
        {
            query += ' AND Title IN: title ';
        }
        if(!department.isEmpty())
        {
            query += ' AND Department IN: department ';
        }
        //ONLY add this query if you are not a COE (Not Sales Admin)
        if(userRole !='Sales Administrator')
        {
           query += ' AND Id IN:userList ';
        }
        query += ' ORDER BY Name ASC ';
        allUsers = (List<User>)Database.query(query);
        return allUsers;
    }
    /*------------------------------------------------------------
    Author:        Jacqueline Passehl
    Company:       Slalom, LLC
    Description:   Given a Planned_Objective__c id,  return a Planned_Objective__c object
    Inputs:        Object Id
    Returns:       Planned_Objective__c
    History
    4/2/2018       Jacqueline Passehl   Initial Creation
    ------------------------------------------------------------*/
    @AuraEnabled
    public static Planned_Objective__c getPlannedObjective (Id objectId){
        return [SELECT Id, Name, Start_Date__c, End_Date__c, Planned_Objective_Type__c FROM Planned_Objective__c WHERE id=:objectId];
    }
}