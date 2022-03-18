/*------------------------------------------------------------
Author:        Jacqueline Passehl
Company:       Slalom, LLC
Description:   A test class for the  for the AddObjectiveController class that is shared between the
			   TargetUserObjective, CreateNewPersonalObjective, and AddObjective components.
			   	1 -  testInsertOrUpdateRecords
			   	Tests custom insert/update method nad ensures that certain values are set as a result, such as relationship fields ids.
				2 - findUserinManagerHierarchyTest
				Creates a 4 level user manager hierarchy, by setting the ManagerId to point up to previous user added. Ensures the return list
				has the same size as the amount of users underneath the manager. Ensures that allUnderlings and paginationUnderlings sizes are the
				same if the # of users returned < pageSize,  and if # of users > pageSize ensure that they are different.
				3 - filterUsers
				Creates 3 different users- one with Title filter set, one with Department filter set, and one with both Title and Department set.
				Ensures the correct amount of user(s) is returned based upon the filter selection.
				4- HandleJunctionObjects
				Creates 3 users, puts them into a list and ensures that they are inserted to the database. Remove users from the list,
				and then ensure that they are deleted from the database (as to mimic the selection of users from the datatable in the TargetUserObjective.cmp)
				Ensures that if the toggle is on, then all Objective_User_Assignment__c objects should be removed.
				5-deleteObjectives
				Inserts one user, and then ensure after delete method is called that a SOQL statement returns 0.
				6-getPlannedObjective
				Ensures Planned_Objective__c object returned matches the test one inserted.


History
2/22/2018      Jacqueline Passehl     inital creation
------------------------------------------------------------*/
@isTest
private class AddObjectiveControllerTest {
	@isTest static void testInsertOrUpdateRecords() {

		//Test Creating a new Shared Objective
		Planned_Objective__c po = TestDataFactory.returnSinglePlannedObjective('Mine', 'Personal', Date.today(), Date.today() + 7);
		Objective__c ob = TestDataFactory.returnSingleObjective('Test', 'Objective', null, null, 'Not Started');
		ob.Bottle_Package__c = true;

		String[] titleArray = new String[] {'Area Sales Manager', 'Craft Sales Lead'};
		String[] departmentArray = new String[] {'Sales'};
		User testUser = createUser('TestUser', 'Manager');
		//call custom insert
		AddObjectiveController.insertOrUpdateRecords(ob, po, 'Objective', 'Personal', titleArray, departmentArray, false, true, testUser.Id,true,testUser.Id,null);

		Objective__c insertedOjective = [SELECT Id, Name, Status__c, Bottle_Package__c, Title__c, Department__c,
										 Planned_Objective__c, Planned_Objective__r.Name, Planned_Objective__r.Start_Date__c, Planned_Objective__r.End_Date__c  FROM Objective__c WHERE Planned_Objective__c IN (SELECT Id FROM Planned_Objective__c)];
	//	System.assertEquals(insertedOjective.Name, 'Personal: Mine - Engagement');
		System.assertEquals(insertedOjective.Name, 'Personal: Mine - Objective');
		System.assertEquals(insertedOjective.Status__c, 'Not Started');
		System.assertEquals(insertedOjective.Bottle_Package__c, true);
		System.assertEquals(insertedOjective.Planned_Objective__c, po.Id);


		po.Name = 'Mine-NameEdit';
		po.Start_Date__c = Date.today();
		po.End_Date__c = Date.newInstance(2019, 12, 1);

		String[] titleArray2 = new String[] {'Area Sales Manager'};
		String[] departmentArray2 = new String[] {'Sales', 'Manager'};
		String[] emptyArray = new String[]{};

		//update a record
		AddObjectiveController.insertOrUpdateRecords(insertedOjective, po, 'Objective', 'Shared', titleArray2, departmentArray2, true, true,testUser.Id,true ,null,null);

		Objective__c updatedObjective = [SELECT Id, Name, Status__c, Bottle_Package__c, Title__c, Department__c,
										 Planned_Objective__c, Planned_Objective__r.Name, Planned_Objective__r.Start_Date__c, Planned_Objective__r.End_Date__c  FROM Objective__c WHERE Planned_Objective__c IN (SELECT Id FROM Planned_Objective__c)];
		System.assertEquals(1, [SELECT count() From Objective__c ]);
		System.assertEquals(updatedObjective.Planned_Objective__c, po.Id);
		System.assertEquals(po.Name, updatedObjective.Planned_Objective__r.Name);


		//Test Creating a new MBO Objective
		Planned_Objective__c plannedParent = TestDataFactory.insertSinglePlannedObjective('MyObj', null, Date.today() +1, Date.today() + 2);
		Planned_Objective__c plannedMBO = TestDataFactory.insertSinglePlannedObjective('MyMBO', 'MBO', Date.today(), Date.today() + 7);
		Objective__c ob2 = TestDataFactory.returnSingleObjective('Test2', 'Objective', null, null, 'Not Started');
		//call custom insert
		AddObjectiveController.insertOrUpdateRecords(ob2,plannedParent,'Objective','MBO',emptyArray,emptyArray,false,true, testUser.Id,true,null,plannedMBO.Id);
		
		insertedOjective = [SELECT Id, Planned_Objective__c, Planned_Objective__r.Name, Planned_Objective__r.Start_Date__c, Planned_Objective__r.End_Date__c, Created_Via_MBO__c, Name FROM Objective__c WHERE Id =: ob2.Id];

		//selectedMBO field was set so this objective to link to that and boolean should be set to true
		System.assertEquals(true,insertedOjective.Created_Via_MBO__c);
		System.assertEquals(plannedMBO.Id,insertedOjective.Planned_Objective__c);

		//Test switching MBOS
		Planned_Objective__c plannedMBO2 = TestDataFactory.insertSinglePlannedObjective('MyMBO2', 'MBO', Date.today()+2, Date.today() + 4);
		AddObjectiveController.insertOrUpdateRecords(ob2,plannedParent,'Objective','MBO',titleArray2,emptyArray,true,true, testUser.Id,true,null,plannedMBO2.Id);

		ob2.Planned_Objective__c=plannedMBO2.Id;

		Planned_Objective__c insertedParentObj = [SELECT Id, Name FROM Planned_Objective__c WHERE Id=: plannedParent.Id];

		//on switch of MBO name has to be updated
		System.assertEquals('MyObj',insertedParentObj.Name);

		//Test removal of MBO and switch to Personal							 
		AddObjectiveController.insertOrUpdateRecords(ob2,plannedParent,null,'Personal',emptyArray,emptyArray,true,true, testUser.Id,true,null,null);

		updatedObjective = [SELECT Id, Name, Status__c, Bottle_Package__c, Title__c, Department__c,
										 Planned_Objective__c, Planned_Objective__r.Name, Planned_Objective__r.Start_Date__c, Planned_Objective__r.End_Date__c  FROM Objective__c WHERE Id=:ob2.Id];

		//new type shouldbe Personal for parent planned objective
		System.assertEquals('Personal',plannedParent.Planned_Objective_Type__c);								 

	}
	@isTest static void testGetUserRole() {
		User u = TestDataFactory.returnUser('Sales User', 'testUser', 'Sales User');
		System.runAs(u) {
			String userRole = AddObjectiveController.getUserRole();
			System.assertEquals('Sales User', userRole);
		}
	}
	@isTest static void checkDuplicates() {
		User testUser = TestDataFactory.insertUser('Sales User', 'testUser', 'Sales Administrator');
		System.runAs(testUser) {
			Product__c coors = TestDataFactory.insertProduct('Coors', '12', 'Off Prem Pkg', 'On Prem Pkg');
			Planned_Objective__c firstObjective = TestDataFactory.insertSinglePlannedObjective('My Objective', 'Personal', Date.today(), Date.today() + 5);
			Objective__c ob = TestDataFactory.returnSingleObjective('Test 1', 'Objective', coors.Id, null, 'Not Started');
			ob.Bottle_Package__c = true;
			ob.Is_Template__c = true;
			ob.Planned_Objective__c = firstObjective.Id;
			insert ob;
			Planned_Objective__c secondObjective = TestDataFactory.insertSinglePlannedObjective('My Objective', 'Personal', Date.today(), Date.today() + 5);
			Objective__c ob2 = TestDataFactory.returnSingleObjective('Test 2', 'Objective', coors.Id, null, 'Not Started');
			ob2.Bottle_Package__c = true;
			ob2.Is_Template__c = true;
			ob2.Planned_Objective__c = secondObjective.Id;
			insert ob2;
			Test.startTest();
				Planned_Objective__c duplicateCheck = AddObjectiveController.checkIfDuplicatePlannedObjectiveExists(secondObjective, 'Objective', 'Coors');
				AddObjectiveController.checkDuplicates(ob, firstObjective, 'Objective', false);
				Objective__c duplicateObjective = [SELECT RecordType.Name, Brand_Name__c FROM Objective__c WHERE Planned_Objective__c = :duplicateCheck.Id];
				Objective__c objectiveTest = [SELECT RecordType.Name, Brand_Name__c FROM Objective__c WHERE Planned_Objective__c = :secondObjective.Id];
				System.assertEquals(duplicateObjective.RecordType.Name, objectiveTest.RecordType.Name, 'duplicate should return same record type');
				System.assertEquals(duplicateObjective.Brand_Name__c, objectiveTest.Brand_Name__c, 'duplicate should return same brand name');
			Test.stopTest();
		}
	}
	@isTest static void findUserinManagerHierarchyTest() {
		String[] emptyStrArray = new String[] {};
		User currentUserManager = createUser('TestUser','Manager');
		User userUnderManager1 = createUser('TestUser','Underling1');
		User userUnderManager2 = createUser('TestUser','Underling2');
		User userUnderManager3 = createUser('TestUser','Underling3');
	//	User userUnderManager4 = createUser('TestUser','Underling4');
		setManagerId(userUnderManager1,currentUserManager.Id);
		setManagerId(userUnderManager2,userUnderManager1.Id);
		setManagerId(userUnderManager3,userUnderManager2.Id);
	//	setManagerId(userUnderManager4,userUnderManager3.Id);
		User currentUserManager2 = createUser('TestUser','Manager2');
		List<User> userList =  new List<User>();
		List<User> managerList = new List<User>();
		Profile p = [SELECT Id FROM Profile WHERE Name='Sales User']; 
		Test.startTest();
			//first test with small amount of users (< pageSize attribute in TargetUserObjective.cmp)
			System.runAs(currentUserManager) {
				AddObjectiveController.userObjectiveLists  managerIds = AddObjectiveController.findUserinManagerHierarchy(currentUserManager.Id,emptyStrArray,emptyStrArray);
				System.assertEquals(3, managerIds.allUnderlings.size(), 'Expected to return four managerIds due to the 4 level manager hierarchy');
				System.assertEquals(managerIds.allUnderlings.size(),managerIds.paginationUnderlings.size(),'If amount of users < pageSize then these should be equal');
			}
			//test with large amount of users (> pageSize attribute n TargetUserObjective.cmp)
			for(Integer i=0; i< 105;i++){
			User currUser = createUserNoInsert('TestUser'+ i, 'Underling' + i);
			currUser.ProfileId = p.Id;
			userList.add(currUser);
			}
			insert userList;
			for(Integer i=0; i<userList.size(); i++){
				setManagerIdNoUpdate(userList[i],currentUserManager2.Id);
				managerList.add(userList[i]);
			}
			update managerList;
			 System.runAs(currentUserManager2) {
				AddObjectiveController.userObjectiveLists  managerIds2 = AddObjectiveController.findUserinManagerHierarchy(currentUserManager2.Id,emptyStrArray,emptyStrArray);
				System.assertEquals(105, managerIds2.allUnderlings.size(), 'Expected to return 105 since thats total number of users');
				System.assertEquals(100,managerIds2.paginationUnderlings.size(),'Should return 100 as that is the pageSize attribute');
				System.assertNotEquals(managerIds2.allUnderlings.size(),managerIds2.paginationUnderlings.size(),'if amount of users > pageSize then these should NOT be equal');
			}
		Test.stopTest();
	}
	@isTest static void filterUsers() {
		User testUser1 = createUserTitleandDepartment('Test1', 'User', 'Area Sales Manager', '');
		User testUser2 = createUserTitleandDepartment('Test2', 'User', '', 'Sales');
		User tesUser3 = createUserTitleandDepartment('Test3', 'User', 'Craft Sales Lead', 'Sales');
		List<User> userList = new List<User>();
		userList.add(testUser1);
		userList.add(testUser2);
		userList.add(tesUser3);
		String[] titleArray = new String[] {'Craft Sales Lead'};
		String[] departmentArray = new String[] {'Sales'};
		Test.startTest();
		AddObjectiveController.userObjectiveLists filteredUserList = AddObjectiveController.filterAndGrabUsers(userList, titleArray, departmentArray, 1, 3, '');
		System.assertEquals(1, filteredUserList.allUnderlings.size(), 'Expected to return 1 since there is only one user that fits the title and department');
		Test.stopTest();
	}
	@isTest static void HandleJunctionObjects() {
		User testUser1 = createUserTitleandDepartment('Test1', 'User', 'Area Sales Manager', '');
		User testUser2 = createUserTitleandDepartment('Test2', 'User', '', 'Sales');
		User testUser3 = createUserTitleandDepartment('Test3', 'User', 'Craft Sales Lead', 'Sales');
		List<User> userList = new List<User>();
		userList.add(testUser1);
		userList.add(testUser2);
		userList.add(testUser3);
		System.runAs(testUser1) {
			//insert objective
			Objective__c ob = TestDataFactory.returnSingleObjective('Test 1', 'Objective', null, null, 'Not Started');
			ob.Bottle_Package__c = true;
			ob.Is_Template__c = true;
			insert ob;

			Test.startTest();
			List<Id> userIdList = new List<Id>();
			for (User user : userList) {
				userIdList.add(user.Id);
			}
			//test inserting junction objects
			AddObjectiveController.HandleJunctionObjects(ob.Id, userIdList, false);
			List<Objective_User_Assignment__c> junctionObjsTest = AddObjectiveController.getJunctionObj(ob.Id);
			System.assertEquals(3, junctionObjsTest.size(), 'there should of been 3 junction objects inserted');
			//test get user from junction
			List<User> getUserFromJunctionId = AddObjectiveController.getUserFromJunction(ob.Id);
			System.assertEquals(3, getUserFromJunctionId.size());
			userIdList.remove(2);
			//test removal of junction objects
			AddObjectiveController.HandleJunctionObjects(ob.Id, userIdList, false);
			List<Objective_User_Assignment__c> junctionObjsTestRemoval = AddObjectiveController.getJunctionObj(ob.Id);
			System.assertEquals(2, junctionObjsTestRemoval.size(), 'there should of been 1 junction objects removed');
			userIdList.remove(1);
			userIdList.remove(0);
			//test removal of junction objects- with toggle on
			AddObjectiveController.HandleJunctionObjects(ob.Id, userIdList, true);
			List<Objective_User_Assignment__c> junctionObjsTestToggle = AddObjectiveController.getJunctionObj(ob.Id);
			System.assertEquals(0, junctionObjsTestToggle.size(), 'All junction objects should have been removed since toggle is on');
			Test.stopTest();
		}
	}
	@isTest static void getAllUsers() {
		String[] titleArray = new String[] {'Area Sales Manager', 'Craft Sales Lead'};
		String[] emptyStrArray = new String[] {};
		User testUser1 = createUserTitleandDepartment('Test1', 'User', 'Area Sales Manager', '');
		User testUser2 = createUserTitleandDepartment('Test2', 'User', 'Regional Vice President', 'Sales');
		User testUser3 = createUserTitleandDepartment('Test3', 'User', 'Craft Sales Lead', '');
		List<User> userList = new List<User>();
		userList.add(testUser1);
		userList.add(testUser2);
		userList.add(testUser3);
		Test.startTest();
			List<User> activeUsersList = AddObjectiveController.findAllUsers(titleArray, emptyStrArray, userList, '');
			System.debug(activeUsersList);
			System.assertEquals(2, activeUsersList.size(), 'only 2 users fit the title criteria');
		Test.stopTest();
	}
	@isTest static void deleteObjectives(){
		Planned_Objective__c po = TestDataFactory.returnSinglePlannedObjective('Mine', 'Personal', Date.today(), Date.today() + 7);
		Objective__c ob = TestDataFactory.returnSingleObjective('Test', 'Objective', null, null, 'Not Started');
		ob.Bottle_Package__c = true;

		String[] titleArray = new String[] {'Area Sales Manager', 'Craft Sales Lead'};
		String[] departmentArray = new String[] {'Sales'};
		User testUser = createUser('TestUser','Manager');
		Test.startTest();
			//insert a record
			AddObjectiveController.insertOrUpdateRecords(ob,po,'Objective', 'Personal', titleArray,departmentArray,false,true, testUser.Id,true,testUser.Id,null);
			System.assertEquals(1, [SELECT count() From Objective__c ]);
			//delete a record
			AddObjectiveController.deleteObjective(ob.Id);
			System.assertEquals(0, [SELECT count() From Objective__c ]);
		Test.stopTest();
	}
	@isTest static void getPlannedObjective(){
		Planned_Objective__c po = TestDataFactory.insertSinglePlannedObjective('Mine', 'Personal', Date.today(), Date.today() + 7);
		Planned_Objective__c result = AddObjectiveController.getPlannedObjective(po.Id);
		System.assertEquals(po,result);
	}
    
    @isTest static void  getfilterUserListForObjective(){
      
		List<User> userList = createUserInsalesStructure();
        List<String> userIdListToCreate = new List<String>();
        for(user usr : userList ){
            userIdListToCreate.add(usr.id);
        }
		String[] titleArray = new String[] {'Sales'};
		String[] state = new String[] {'UK'};
        String[] manager = new String[]{'f1 sales'};
        Objective__c Obj =createobjective('TEST','Objective','Canada');
		Test.startTest();
		AddObjectiveController.userObjectiveLists filteredUserList = AddObjectiveController.filterUserListForObjective(userList, titleArray,state , 1, 3, '',true,manager);
		
        AddObjectiveController.createAssignedObjectives(userIdListToCreate,Obj.id,1);
        System.assertEquals(0, filteredUserList.allUnderlings.size(), 'Expected to return 0 ');
		Test.stopTest();
        
    }
    @isTest static void testCreateAssignedObjectivesAllUser(){
    	List<User> userList = createUserInsalesStructure();
        List<String> userIdListToCreate = new List<String>();
        for(user usr : userList ){
            userIdListToCreate.add(usr.id);
        }
		String[] titleArray = new String[] {'Sales'};
		String[] state = new String[] {'ontario'};
        String[] manager = new String[]{'f1 sales'};
       
        Objective__c Obj =createobjective('TEST','Objective','Canada');
        
        Test.startTest();
        AddObjectiveController.createAssignedObjectivesAllUser(titleArray, state ,false, manager,Obj.Id,1);
        List<objective__c> objList =	[select id  from objective__c];
        system.assertEquals(1,objList.size(),'1 objective');
    	Test.stopTest();
    }
    
	/*------------------------------------------------------------

			   Helper Methods
	------------------------------------------------------------*/
      
    private static Objective__c createobjective(String Name ,String recType,string Country) {
			Id recordTypeId = 	[SELECT Id FROM RecordType WHERE DeveloperName =: recType].id;
        
        	Objective__c obj = new Objective__c(Name=Name,C360_Country__c =Country ,Start_Date__c = system.today(),End_Date__c= system.today() +10);
        	insert obj;
            System.assert(obj.Id!=null);
        	return obj; 
	}
	private static User createUser(String firstName, String lastName) {
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Sales User'];
		User u = new User(Alias = 'test', Email = firstName + lastName + '@testorg.com',
						  EmailEncodingKey = 'UTF-8', FirstName = firstName, LastName = lastName, LanguageLocaleKey = 'en_US',
						  LocaleSidKey = 'en_US', ProfileId = p.Id,
						  TimeZoneSidKey = 'America/Los_Angeles', UserName = firstName + lastName + '@testorg.com');
		u.Override_Profile_Management__c = true;
		insert u;
        System.assert(u!=null);
		return u;
	}
	private static User createUserNoInsert(String firstName, String lastName) {
		User u = new User(Alias = 'test', Email = firstName + lastName + '@testorg.com',
						  EmailEncodingKey = 'UTF-8', FirstName = firstName, LastName = lastName, LanguageLocaleKey = 'en_US',
						  LocaleSidKey = 'en_US',
						  TimeZoneSidKey = 'America/Los_Angeles', UserName = firstName + lastName + '@testorg.com');
        
        System.assert(u!=null);
		return u;
	}
	private static User createUserTitleandDepartment(String firstName, String lastName, String title, String department) {
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Sales User'];
		User u = new User(Alias = 'test', Email = firstName + lastName + '@testorg.com',
						  EmailEncodingKey = 'UTF-8', FirstName = firstName, LastName = lastName, LanguageLocaleKey = 'en_US',
						  LocaleSidKey = 'en_US', ProfileId = p.Id,
						  TimeZoneSidKey = 'America/Los_Angeles', UserName = firstName + lastName + '@testorg.com', Title = title, Department = department, isActive = true);
		u.Override_Profile_Management__c = true;
		insert u;
        System.assert(u!=null);
		return u;
	}

	private static list<User> createUserInsalesStructure() {
		Profile p = [SELECT Id FROM Profile WHERE Name = 'Sales User'];
        List<user> uslist =new  List<user>();
		User u = new User(Alias = 'f1_test', Email =  'f1_test_sales@testorg.com',
						  EmailEncodingKey = 'UTF-8', FirstName = 'f1', LastName = 'sales', LanguageLocaleKey = 'en_US',
						  LocaleSidKey = 'en_US', ProfileId = p.Id,
						  TimeZoneSidKey = 'America/Los_Angeles', UserName = 'f1_test_sales@testorg.com', Title = 'sales', state = 'ontario', isActive = true,C360_CRM_Employee_ID__c='1',C360_F1_CRM_ID__c='1');
		u.Override_Profile_Management__c = true;
        uslist.add(u);
        User u1 = new User(Alias = 'f1_test1', Email =  'f2_test_sales1@testorg.com',
						  EmailEncodingKey = 'UTF-8', FirstName = 'f2', LastName = 'sales', LanguageLocaleKey = 'en_US',
						  LocaleSidKey = 'en_US', ProfileId = p.Id,
						  TimeZoneSidKey = 'America/Los_Angeles', UserName = 'f2_test_sales1@testorg.com', Title = 'sales', state = 'ontario', isActive = true,C360_CRM_Employee_ID__c='2',C360_F1_CRM_ID__c='2');
       
		u1.Override_Profile_Management__c = true;
        uslist.add(u1);	
        
        insert uslist;
        System.assert(uslist!=null);
        return uslist;
	}    
    	
	private static void setManagerId(User user, Id userId) {
		user.ManagerId = userId;
		update user;
        System.assertEquals(userId, user.ManagerId);
	}
	private static void setManagerIdNoUpdate(User user, Id userId) {
		user.ManagerId = userId;
      System.assertEquals(userId, user.ManagerId);
    }

}