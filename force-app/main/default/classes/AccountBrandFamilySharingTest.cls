@isTest
private class AccountBrandFamilySharingTest {
    
    @testSetup
    private static void setup(){
        List<Contact>cnt = New List<Contact>();
        List<User>usr= New List<User>();
        List<MCBC_Brand_Family__c>mbf = New List<MCBC_Brand_Family__c>();
        List<MCBC_Brand_Family__Share>mbfs = New List<MCBC_Brand_Family__Share>();
        UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
        system.debug('portalRole is ' + portalRole);
        
        Profile profile1 = [Select Id from Profile where name = 'System Administrator'];
        User portalAccountOwner1 = new User(
            UserRoleId = portalRole.Id,
            ProfileId = profile1.Id,
            Username = System.now().millisecond() + 'test2@test.com',
            Alias = 'batman',
            Email='bruce.wayne@wayneenterprises.com',
            EmailEncodingKey='UTF-8',
            Firstname='Bruce',
            Lastname='Wayne',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago'
        );
        //Database.insert(portalAccountOwner1);
        
        
       // System.runAs ( portalAccountOwner1 ){
            Account portalAccount1 = new Account(
                Name = 'TestAccount',
                Brand_Family__c='1;100'
                //OwnerId = portalAccountOwner1.Id
            );
            Database.insert(portalAccount1);
            
            //Create contact
            Contact contact1 = new Contact(
                FirstName = 'Test',
                Lastname = 'McTesty',
                AccountId = portalAccount1.Id,
                Email = System.now().millisecond() + 'test@test.com'
            );
            cnt.add(contact1);
            Contact contact2 = new Contact(
                FirstName = 'Test',
                Lastname = 'McTesty',
                AccountId = portalAccount1.Id,
                Email = System.now().millisecond() + 'test@test.com'
            );
            cnt.add(contact2);
            Database.insert(cnt);
            
            //Create user
            Profile portalProfile = [SELECT Id FROM Profile Where Name='Partner Experience User' Limit 1];
            User user1 = new User(
                Username = System.now().millisecond() + 'test12345@test.com',
                ContactId = contact1.Id,
                ProfileId = portalProfile.Id,
                Alias = 'test123',
                Email = 'test12345@test.com',
                EmailEncodingKey = 'UTF-8',
                LastName = 'McTesty',
                CommunityNickname = 'test12345',
                TimeZoneSidKey = 'America/Los_Angeles',
                LocaleSidKey = 'en_US',
                LanguageLocaleKey = 'en_US'
            );
            usr.add(user1);
            User user2 = new User(
                Username = System.now().millisecond() + 'test125@test.com',
                ContactId = contact2.Id,
                ProfileId = portalProfile.Id,
                Alias = 'test123',
                Email = 'test12345@test.com',
                EmailEncodingKey = 'UTF-8',
                LastName = 'McTesty',
                CommunityNickname = 'test125',
                TimeZoneSidKey = 'America/Los_Angeles',
                LocaleSidKey = 'en_US',
                LanguageLocaleKey = 'en_US'
            );
            usr.add(user2);
            Database.insert(usr);
            MCBC_Brand_Family__c MBF1 = New MCBC_Brand_Family__c(
                Name='Test1',
                Brand_Family_Code__c='1');
            mbf.add(MBF1);
            MCBC_Brand_Family__c MBF2 = New MCBC_Brand_Family__c(
                Name='Test2',
                Brand_Family_Code__c='100');
             mbf.add(MBF2);
            MCBC_Brand_Family__c MBF3 = New MCBC_Brand_Family__c(
                Name='Test3',
                Brand_Family_Code__c='12345');
            mbf.add(MBF3);
            MCBC_Brand_Family__c MBF4 = New MCBC_Brand_Family__c(
                Name='Test4',
                Brand_Family_Code__c='123');
            mbf.add(MBF4);
            Database.insert(mbf);
            MCBC_Brand_Family__Share MBFS1 = New MCBC_Brand_Family__Share(
                ParentId=MBF1.Id,
                UserOrGroupId=user1.Id,
                AccessLevel='Read'      
            );
            mbfs.add(MBFS1);
            MCBC_Brand_Family__Share MBFS2 = New MCBC_Brand_Family__Share(
                ParentId=MBF2.Id,
                UserOrGroupId=user1.Id,
                AccessLevel='Read'
            );
            mbfs.add(MBFS2);
            MCBC_Brand_Family__Share MBFS3 = New MCBC_Brand_Family__Share(
                ParentId=MBF1.Id,
                UserOrGroupId=user2.Id,
                AccessLevel='Read'      
            );
            mbfs.add(MBFS3);
            MCBC_Brand_Family__Share MBFS4 = New MCBC_Brand_Family__Share(
                ParentId=MBF2.Id,
                UserOrGroupId=user2.Id,
                AccessLevel='Read'
            );
            mbfs.add(MBFS4);
            Database.insert(mbfs);
            
        //}
    }
    
    static testMethod void AccountBrandSharing(){
        Account acct = [SELECT Id,Brand_Family__c FROM Account WHERE Name='TestAccount' LIMIT 1];
        AccountHistory ah = new AccountHistory();
        ah.AccountId=acct.Id;
        ah.Field='Brand_Family__c';
        insert ah;
        Test.StartTest();
        AccountBrandFamilySharing ab= New AccountBrandFamilySharing();
        Database.executeBatch(ab);
        System.assertEquals('Brand_Family__c',ah.Field );
        Test.StopTest();       
    }
}