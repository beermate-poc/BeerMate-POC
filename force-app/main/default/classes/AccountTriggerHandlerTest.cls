/*------------------------------------------------------------
Author:        Bryant Daniels
Company:       Slalom, LLC
Description:   A test class for AccountTriggerHandler

               1 - testAccountOwnerUpdate
               Tests updating an account with an email field and related objective. Once updated,
               objective email should reflect the updated account's email. 

History
05/10/2017      Bryant Daniels     Initial creation
------------------------------------------------------------*/
@isTest
public class AccountTriggerHandlerTest {
    public static Final String ADMINUSERPROFILE = 'CTS Administrator';
    public static Final String USEREMAIL = 'testuser000@test.com';
    public static Final String NAME = 'DemoTest';
    public static Final String OUTLET = 'Outlet';
    public static Final String BREWERMOLSON = 'MOLSON COORS - 03456000888';
    public static Final String BRAND_NAME = 'BrandMCBC';
    public static Final String BREWERDIAGEO = 'DIAGEO - 08451515101';
    public static Final String CONTAINER = 'Keg';
    public static Final String DISPENCE = 'FlexiDraft';
    public static Final String DISPENCEDUMMY = 'Dummy';
    Public Static Final String BARNO1 = 'Bar 1';
    Public Static Final String BARNO2 = 'Bar 2';
    Public Static Final String DISPLAYTYPE = 'Font - Valiant';
    
     /*
     *  initialDataSetup is done Created all required records
     *  OutLet,BarRecord,Bar REcord Line,Brand.
     */ 
    @testSetup static void initialDataSetup()
     {
         
         
         Account acc = CTS_TestDataFactory.outletCreation(NAME,OUTLET);
         //acc.CTS_Setup_Principle_Brewer_Manually__c = true;
         acc.CTS_PB_Status_Service_Owner__c = 'Nominated PB';
         Database.insert(acc);
         
         List<CTS_Brand__c> brandList = new List<CTS_Brand__c>();
         List<C360_Bar_Record__c> barRecordList = new List<C360_Bar_Record__c>();
         
         CTS_Brand__c brandMolson = CTS_TestDataFactory.brandCreation(BREWERMOLSON , BRAND_NAME);
         brandMolson.CTS_Container__c = CONTAINER;
         brandMolson.CTS_Lineset_Default__c = DISPENCE;
         Database.insert(brandMolson);
         brandList.add(brandMolson);
         
         CTS_Brand__c brandDiageo = CTS_TestDataFactory.brandCreation(BREWERDIAGEO , BRAND_NAME+1);
         brandDiageo.CTS_Container__c = CONTAINER;
         brandDiageo.CTS_Lineset_Default__c = DISPENCE;
         Database.insert(brandDiageo);
         brandList.add(brandDiageo);
         
         CTS_Brand__c brandDiageoDummy = CTS_TestDataFactory.brandCreation(BREWERDIAGEO , BRAND_NAME+2);
         brandDiageoDummy.CTS_Container__c = CONTAINER;
         brandDiageoDummy.CTS_Lineset_Default__c = DISPENCEDUMMY;
         Database.insert(brandDiageoDummy);
         brandList.add(brandDiageoDummy);
         
         C360_Bar_Record__c barRecBar1 = CTS_TestDataFactory.barRecordCreation(CTS_TestDataFactory.NAME,acc.Id,BARNO1);
         Database.insert(barRecBar1);
         barRecordList.add(barRecBar1);
         
         C360_Bar_Record__c barRecBar2 = CTS_TestDataFactory.barRecordCreation(CTS_TestDataFactory.NAME,acc.Id,BARNO2);
         Database.insert(barRecBar2);
         barRecordList.add(barRecBar2);
         
         List<C360_Bar_Record_Line__c> barRecordLineList =  CTS_TestDataFactory.barRecordLineCreation(barRecordList,brandList);
         Database.Insert(barRecordLineList);
         
         
          
      }
    
    @isTest static void testAccountOwnerUpdate(){
        User testUser = TestDataFactory.insertUser('System Administrator', 'testUser', 'Sales User');
        User testUser2 = TestDataFactory.insertUser('System Administrator', 'testUser2', 'Sales User');
        testUser2.FirstName = testUser2.FirstName+'SystAdmin';
        update testUser2;
        System.runAs(testUser2){
            Account acc = TestDataFactory.returnSingleAccount('Test Account', 'On-Premise');
            Objective__c obj = TestDataFactory.returnSingleObjective('Test Objective', 'Engagement', null, acc.Id, 'In-Progress');
            obj.Account_Owner_Email__c ='testemail@test.com';
            insert obj;
            Test.startTest();
                //update email for user
                String updatedEmail = 'testupdatedemail@email.com';
                testUser.Email = updatedEmail;
                update testUser;
                Objective__c objBeforeUpdate = [select Id, Account_Owner_Email__c,Account__r.Owner.Email from Objective__c where Id =: obj.Id];
                ///code to trigger if statement here
                objBeforeUpdate.Account_Owner_Email__c='testemail@test.com';
                objBeforeUpdate.Account__r.Owner.Email = 'differenttestemail@test.com';
                //update account to trigger the account update trigger
                acc.ownerid = testUser.id;
                update acc;
                Objective__c objAfterUpdate = [select Id, Account_Owner_Email__c,Account__r.Owner.Email from Objective__c where Id =: obj.Id];
            Test.stopTest();
            System.assert(objBeforeUpdate.Account_Owner_Email__c != updatedEmail, 'Expected the objective email to NOT MATCH the updated email got: ' + objBeforeUpdate.Account_Owner_Email__c);
            System.assert(objAfterUpdate.Account_Owner_Email__c == updatedEmail, 'Expected the objective email to MATCH the updated email got: ' + objAfterUpdate.Account_Owner_Email__c);
        }
    }
    
      /*
       * CTS
       * This Method covers the positive scenario like passing all required fields to the updatePBStatusOnOutlet method.
       */
     private static testMethod void updatePBStatusOnOutletTest_positive(){
        User usr = CTS_TestDataFactory.userCreation(ADMINUSERPROFILE,NAME,USEREMAIL);
        Account acc = [SELECT Id,Name,CTS_Principal_Brewer_Status__c FROM Account WHERE Name=:NAME LIMIT 1];
        C360_Bar_Record__c barRecordNo1 = [SELECT Id,Name FROM C360_Bar_Record__c WHERE CTS_Bar_No__c=:BARNO1 LIMIT 1];
        CTS_Brand__c brand = [SELECT Id,CTS_Container__c,CTS_Brand_Brewer__c FROM CTS_Brand__c WHERE Name =:BRAND_NAME LIMIT 1];
        //system.debug('brand;;;;;;;;;'+brand);
        C360_Bar_Record_Line__c barRecordLine = new C360_Bar_Record_Line__c();
        barRecordLine.C360_Bar_Record__c = barRecordNo1.ID;
        barRecordLine.C360_Brand__c = brand.ID;
        barRecordLine.C360_Position__c = 2;
        barRecordLine.C360_Display_Type__c = DISPLAYTYPE;
        barRecordLine.CTS_Default_Lineset__c =DISPENCE;
         
         
        //barRecordLine.C360_Brand_Owner__c = brandDiageo2.CTS_Brand_Brewer__c;
        System.runAs(usr){
            Database.Insert(barRecordLine);         
        	
            Test.startTest();
            //acc.CTS_Setup_Principle_Brewer_Manually__c = false;
            acc.CTS_PB_Status_Service_Owner__c = 'Bar Record derived PB';
            Database.update(acc);
            
            Test.stopTest();
            Account accAssert = [SELECT Id,Name,CTS_Principal_Brewer_Status__c FROM Account WHERE Name=:NAME LIMIT 1];
           // System.assertEquals(BREWERDIAGEO, accAssert.CTS_Principal_Brewer_Status__c);
            
        }

        
     }
}