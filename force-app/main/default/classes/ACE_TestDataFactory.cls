/**
* Created by alexandria.sanborn on 12/19/2018.
*/
@isTest
public with sharing class ACE_TestDataFactory {
    public static final RecordType shipToAcctRecordType = [SELECT id FROM RecordType WHERE sObjectType='Account' AND DeveloperName='Ship_To'];
    public static final RecordType distAcctRecordType = [SELECT id FROM RecordType WHERE sObjectType='Account' AND DeveloperName='Distributor'];
    public static final RecordType hierarchyAcctRecordType = [SELECT id FROM RecordType WHERE sObjectType='Account' AND DeveloperName='Hierarchy'];
    
    public static final Map<String, String[]> managementUnitToStates = new Map<String, String[]>{
        'MU - AZ NV NM' => new String[]{'AZ', 'NV', 'NM'},
            'MU - IL IA' => new String[]{'IL' , 'IA'},
                'MU - AK ID WA OR' => new String[]{'AK', 'ID', 'WA', 'OR'}
    };
                        
    public static Profile commUserProfile = [Select ID, Name from Profile Where Name='Community Finance' LIMIT 1];
    public static Profile sysAdminProfile = [Select ID, Name from Profile Where Name = 'System Administrator'];
    public static User sysAdminRoleUser = [SELECT id FROM User where UserRoleId != null AND ProfileId=:sysAdminProfile.id AND isActive=TRUE AND ACE_Approver__c=TRUE LIMIT 1];
    
    public static UserRole r = [SELECT id FROM UserRole LIMIT 1];
    
    public static Account createAccount(String name, Id userId, Id recordTypeId){
        return createAccountWithHierarchy(name, userId, recordTypeId, null);
    }
    public static Account createAccountWithHierarchy(String name, Id userId, Id recordTypeId, Id parentId) {
        Account newAcc = new Account();
        newAcc.Name = name;
        if(userId != null){
            newAcc.OwnerId = userId;
        }
        
        if(recordTypeId != null){
            newAcc.recordTypeId = recordTypeId;
        }
        
        if(parentId != null){
            newAcc.parentId = parentId;
        }
        
        return newAcc;
    }
    
     public static Account returnACE_fundreq_SingleAccount(String name) {
        Account newAcc = new Account();
        newAcc.Name = name;
       	newAcc.C360_Node_Type__c = 'MU';
        insert newAcc;
        return newAcc;
    }
    public static Contact createContact(Id acctId){
        return createContactHierarchy(acctId, null);
    }
    
    public static Contact createContactHierarchy(Id acctId, String lastName){
        Contact newContact = new Contact(AccountId=acctId);
        newContact.LastName = lastName == null ? 'commuserapextest' : lastName;
        newContact.role__c = 'Site Analyst';
        return newContact;
    }
    
    public static Account[] createMUCustLvl4Links(){
        Account[] managementUnitsToCreate = new Account[]{};
            for(String mu : managementUnitToStates.keySet()){
                for(String state : managementUnitToStates.get(mu)){
                    managementUnitsToCreate.add(new Account(Name=mu, BillingState=state, AccountNumber='1234'));
                }
            }
        return managementUnitsToCreate;
    }
    
    public static Account[] createShipTos(Integer numToCreate, Account[] managementUnits){
        return createShipTosWithHierarchy(numToCreate, managementUnits, null);
    }
    
    public static Account[] createShipTosWithHierarchy(Integer numToCreate, Account[] managementUnits, Account[] distributors){
        Account[] shipToAccts = new Account[]{};
            
            for(Account mu : managementUnits){
                for(Integer acctQty=0; acctQty < numToCreate ;acctQty++){
                    Account shipTo = new Account(
                        RecordTypeId=shipToAcctRecordType.id,
                        Name='Ship to' + mu.Name + acctQty,
                        Cust_Hierarchy_lvl4_link__c=mu.id,
                        Cust_Hierarchy_Lvl5_Text__c=mu.Name + '_' + mu.BillingState,
                        Primary_Ship_To__c=TRUE,
                        Type='Ship-To',
                        C360_Account_Status__c='Active',
                        BillingState=mu.BillingState);
                    if(distributors != null){
                        shipTo.ParentId = distributors[acctQty].id;
                    }
                    shipToAccts.add(shipTo);
                }
            }
        return shipToAccts;
    }
    
    public static PartnerMarketingBudget createBudget(Integer amount){
        return createBudget(amount, null);
    }
    
    public static PartnerMarketingBudget createBudget(Integer amount, String mu){
        PartnerMarketingBudget appropriateSpend = new PartnerMarketingBudget();
        appropriateSpend.Title='Appropriate Spend DEc 19';
        appropriateSpend.Amount=amount;
        appropriateSpend.Type='Marketing Funds';
        appropriateSpend.StartDate=date.parse('10/5/2018');
        appropriateSpend.EndDate=date.parse('10/31/2018');
        appropriateSpend.Management_Units__c=mu == null ? 'MU - IL IA' : mu;
        return appropriateSpend;
    }
    
    public static User getPortalUser(){
        //return [SELECT id FROM User WHERE ProfileId=:sysAdminProfile.id AND UserRoleId != null AND isActive=TRUE and email='larry.cardenas@millercoors.com' LIMIT 1];
        UserRole salesRole = [Select Id From UserRole Where name = 'Sales Administrator' Limit 1];
        Profile sysAdmin = [Select Id from Profile where name = 'System Administrator'Limit 1];
        User portalACEAccountOwner1 = new User(
            ProfileId = sysAdmin.Id,
            UserRoleId = salesRole.Id,
            Username = System.now().millisecond() + 'potaltest2@test.com',
            Alias = 'portal',
            Email='potal@test.com',
            EmailEncodingKey='UTF-8',
            ACE_Personnel_Number__c ='92350',
            Firstname='potaltest123',
            Lastname='potaltest',
            LanguageLocaleKey='en_US',
            LocaleSidKey='en_US',
            TimeZoneSidKey='America/Chicago'            
        );
        insert portalACEAccountOwner1;
        return portalACEAccountOwner1;
    }
    
    
   public static User createPortalUser(){
        UserRole portalRole = [Select Id From UserRole Where PortalType = 'None' Limit 1];
        Profile sysAdmin = [Select Id from Profile where name = 'System Administrator'];
        Integer randomNumber = Integer.valueof((Math.random() * 1000));
        Integer randomNumber1 = Integer.valueof((Math.random() * 100));
        String userName= System.now().millisecond() +'@test.molsoncoors.com.prod';
        List<User> userNameCheck = [Select Id,Username from User where Username =: userName Limit 1];
        User portalAccountOwner1 = new User();
        if(userNameCheck.size() > 0){
            Username = randomNumber1+System.now().millisecond() +randomNumber+'@test.molsoncoors.com.prod';
                portalAccountOwner1.ProfileId = sysAdmin.Id;
                portalAccountOwner1.Alias = 'testing';
                portalAccountOwner1.Email='test123.tst@test.com';
                portalAccountOwner1.EmailEncodingKey='UTF-8';
                portalAccountOwner1.ACE_Personnel_Number__c ='2350';
                portalAccountOwner1.Firstname='test123';
                portalAccountOwner1.Lastname='testy';
                portalAccountOwner1.LanguageLocaleKey='en_US';
                portalAccountOwner1.LocaleSidKey='en_US';
                portalAccountOwner1.TimeZoneSidKey='America/Chicago';
                portalAccountOwner1.ACE_Approver__c=TRUE;
                }else{
                    portalAccountOwner1.ProfileId = sysAdmin.Id;
                        portalAccountOwner1.UserName= userName;
                        portalAccountOwner1.Alias = 'testing';
                        portalAccountOwner1.Email='test123.tst@test.com';
                        portalAccountOwner1.EmailEncodingKey='UTF-8';
                        portalAccountOwner1.ACE_Personnel_Number__c ='2350';
                        portalAccountOwner1.Firstname='test123';
                        portalAccountOwner1.Lastname='testy';
                        portalAccountOwner1.LanguageLocaleKey='en_US';
                        portalAccountOwner1.LocaleSidKey='en_US';
                        portalAccountOwner1.TimeZoneSidKey='America/Chicago';
                        portalAccountOwner1.ACE_Approver__c=TRUE;
                        }
        insert portalAccountOwner1;
        return portalAccountOwner1;
    }
    
    public static User createACEApprover(Decimal spendLimit){
        user u = New User(
            UserName = 'test_ace' + math.random() + '@test.com.ace',
            FirstName = 'Test-First',
            LastName = 'Test-Last',
            Alias = 'testace',
            email = 'test' + math.random() + '@test.com.ace',
            ProfileId = sysAdminProfile.id,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ACE_Personnel_Number__c ='2350',
            ACE_Approver__c=TRUE,
            Spend_Limit__c=spendLimit
        );
        return u;
        
    }
    
    public static User createChannelPartner(String commContactId){
        user u = New User(
            UserName = 'test_' + math.random() + '@test.com',
            FirstName = 'Test-First',
            LastName = 'Test-Last',
            Alias = 'test',
            email = 'test' + math.random() + '@test.com',
            CommunityNickName = string.valueOf(math.random()).substring(0,6),
            ProfileId = commUserProfile.id,
            TimeZoneSidKey = 'America/New_York',
            LocaleSidKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            ACE_Personnel_Number__c ='2350',
            ContactID = commContactId
        );
        
        return u;
    }
    
    
    public static PartnerFundAllocation createPromotion(String appropriateSpendId, String partnerAccId, String mu){
        PartnerFundAllocation approveAndRelease=new PartnerFundAllocation();
        approveAndRelease.BudgetId=appropriateSpendId;
        approveAndRelease.Title='Approve dec 20';
        approveAndRelease.Amount=44;
        approveAndRelease.ACE_Start_Date__c=date.parse('10/5/2018');
        approveAndRelease.ACE_End_Date__c=date.parse('10/31/2018');
        approveAndRelease.ChannelPartnerId=partnerAccId;
        approveAndRelease.ACE_MU__c = mu;
        return approveAndRelease;
    }
    
    public static ACE_Internal_Order__c[] createInternalOrders(){
        ACE_Internal_Order__c[] ordersToCreate = new ACE_Internal_Order__c[]{};
            
            ACE_Internal_Order__c brandedSLMAOrder = new ACE_Internal_Order__c();
        brandedSLMAOrder.ACE_Brand_Cd__c = '1';
        brandedSLMAOrder.ACE_Internal_Order_Type__c='SLMA';
        brandedSLMAOrder.ACE_Order_Status__c='20';
        brandedSLMAOrder.ACE_MgmtUnitCd__c='1234';
        brandedSLMAOrder.ACE_Budget_Owner__c='GM';
        ordersToCreate.add(brandedSLMAOrder);
        
        ACE_Internal_Order__c brandedNotSLMAOrder = new ACE_Internal_Order__c();
        brandedNotSLMAOrder.ACE_Brand_Cd__c = '1';
        brandedNotSLMAOrder.ACE_Internal_Order_Type__c='TEST';
        brandedNotSLMAOrder.ACE_Order_Status__c='20';
        brandedNotSLMAOrder.ACE_MgmtUnitCd__c='1234';
        brandedNotSLMAOrder.ACE_Budget_Owner__c='GM';
        ordersToCreate.add(brandedNotSLMAOrder);
        
        ACE_Internal_Order__c unbrandedSLMAOrder = new ACE_Internal_Order__c();
        unbrandedSLMAOrder.ACE_Brand_Cd__c = '9999';
        unbrandedSLMAOrder.ACE_Internal_Order_Type__c='SLMA';
        unbrandedSLMAOrder.ACE_Order_Status__c='20';
        unbrandedSLMAOrder.ACE_MgmtUnitCd__c='1234';
        unbrandedSLMAOrder.ACE_Budget_Owner__c='GM';
        ordersToCreate.add(unbrandedSLMAOrder);
        return ordersToCreate;
    }
    
    public static Spend_Type__c[] createSpendTypes(){
        Spend_Type__c[] spendTypesToCreate = new Spend_Type__c[]{};
            
            Spend_Type__c taxableSLMAST = new Spend_Type__c();
        taxableSLMAST.ACE_Order_Type__c = 'SLMA';
        taxableSLMAST.ACE_Taxable_Flag__c = true;
        taxableSLMAST.ACE_Spend_Type_Name__c='test1';
        spendTypesToCreate.add(taxableSLMAST);
        
        Spend_Type__c notTaxableSLMAST = new Spend_Type__c();
        notTaxableSLMAST.ACE_Order_Type__c = 'SLMA';
        notTaxableSLMAST.ACE_Taxable_Flag__c = false;
        notTaxableSLMAST.ACE_Spend_Type_Name__c='test2';
        spendTypesToCreate.add(notTaxableSLMAST);
        
        Spend_Type__c taxableNotSLMAST = new Spend_Type__c();
        taxableNotSLMAST.ACE_Order_Type__c = 'NotSLMA';
        taxableNotSLMAST.ACE_Taxable_Flag__c = true;
        taxableNotSLMAST.ACE_Spend_Type_Name__c='test3';
        spendTypesToCreate.add(taxableNotSLMAST);
        
        Spend_Type__c nottaxableNotSLMAST = new Spend_Type__c();
        nottaxableNotSLMAST.ACE_Order_Type__c = 'NotSLMA';
        nottaxableNotSLMAST.ACE_Taxable_Flag__c = false;
        nottaxableNotSLMAST.ACE_Spend_Type_Name__c='test4';
        spendTypesToCreate.add(nottaxableNotSLMAST);
        
        return spendTypesToCreate;
    }
    
    public static String updateFundRequests(Id approveAndReleaseId){
        return updateFundRequests(approveAndReleaseId, 'AZ');
    }
    
    public static String updateFundRequests(Id approveAndReleaseId, String state){
        ACE_approveAndReleaseClass.FundReqWrapper fundReqs = ACE_approveAndReleaseClass.getShipTo(approveAndReleaseId, state);
        
        //simulates ui - user would check box to create FR and input requested amt
        for(ACE_approveAndReleaseClass.FundReqCustom fundReq : fundReqs.fundRequests){
            fundReq.fundRequestCheck=true;
            fundReq.fundRequestSF.RequestedAmount = 10;
        }
        
        //returns data incoming from lightning component
        return Json.serialize(fundReqs.fundRequests);
    }
    
    public static PartnerFundRequest createFundRequestByMU(PartnerFundAllocation promotion){
        return createFundRequestByShipTo(promotion,null);
    }
    
    public static PartnerFundRequest createFundRequestByShipTo(PartnerFundAllocation promotion, Account shipTo){
        PartnerFundRequest newFR = new PartnerFundRequest();
        newFR.Title = promotion.Title;
        newFR.ACE_Event_Organizer__c = 'eventOrg';
        newFR.RequestedAmount = promotion.Amount / 3;
        newFR.ACE_Spend_Type__c = promotion.ACE_Spend_Type__c;
        newFR.ACE_Internal_Order__c = promotion.ACE_Internal_Order__c;
        newFR.ACE_Co_Op_Event__c = promotion.ACE_Co_Op_Event__c;
        newFR.ACE_Start_Date__c = promotion.ACE_Start_Date__c;
        newFR.ACE_End_Date__c = promotion.ACE_End_Date__c;
        newFR.BudgetId = promotion.BudgetId;
        newFR.AllocationId = promotion.id;
        newFR.ChannelPartnerId = promotion.ChannelPartnerId;
        newFR.Account_Ship_To__c = shipTo != null ? shipTo.id : null;
        return newFR;
    }
    
    public static PartnerFundRequest[] createFundRequests(PartnerFundAllocation promotion, Integer numToCreate){
        PartnerFundRequest[] fundReqsToCreate = new PartnerFundRequest[]{};
            //making sure the promotion amount is greater than the total fr requested amts
            Decimal frReqAmt = promotion.Amount / (numToCreate+1);
        
        Account[] shipTos = [SELECT id FROM Account WHERE RecordTypeid=:shipToAcctRecordType.id AND Cust_Hierarchy_lvl4_link__r.Name = :promotion.ACE_MU__c LIMIT :numToCreate];
        for(Integer qty=0;qty < numToCreate;qty++){
            PartnerFundRequest newFR = new PartnerFundRequest();
            newFR.Title = promotion.Title;
            newFR.ACE_Event_Organizer__c = 'eventOrg';
            newFR.RequestedAmount = frReqAmt;
            newFR.ACE_Spend_Type__c = promotion.ACE_Spend_Type__c;
            newFR.ACE_Internal_Order__c = promotion.ACE_Internal_Order__c;
            newFR.ACE_Co_Op_Event__c = promotion.ACE_Co_Op_Event__c;
            newFR.ACE_Start_Date__c = promotion.ACE_Start_Date__c;
            newFR.ACE_End_Date__c = promotion.ACE_End_Date__c;
            newFR.BudgetId = promotion.BudgetId;
            newFR.AllocationId = promotion.id;
            newFR.ChannelPartnerId = promotion.ChannelPartnerId;
            newFR.Account_Ship_To__c = shipTos[qty].id;
            newFR.ACE_Status__c='Approved';
            newFR.Status='Approved';
            newFR.Amount=0;
            fundReqsToCreate.add(newFR);
        }
        return fundReqsToCreate;
    }
    
    public static PartnerFundClaim[] createReimbursement(PartnerFundRequest[] fundRequests, Integer headersPerFR){
        PartnerFundClaim[] reimbursementsToCreate = new PartnerFundClaim[]{};
            for(PartnerFundRequest fr : fundRequests){
                for(Integer qty=0;qty < headersPerFR;qty++){
                    PartnerFundClaim newHeader = new PartnerFundClaim();
                    newHeader.RequestId = fr.id;
                    newHeader.Title = fr.Title + qty;
                    newHeader.Amount = 0;
                    newHeader.Account_Ship_To__c = fr.Account_Ship_To__c;
                    newHeader.ACE_Total_Requested_Reimbursement__c=2;
                    reimbursementsToCreate.add(newHeader);
                }
            }
        return reimbursementsToCreate;
    }
    
    public static PartnerFundClaim[] createLineItems(PartnerFundClaim[] headers){
        PartnerFundClaim[] linesToCreate = new PartnerFundClaim[]{};
            headers = [SELECT id, Title, ChannelPartnerId, Account_Ship_To__c, RequestId, ACE_Header_Record_Read__c,ACE_Total_Requested_Reimbursement__c FROM PartnerFundClaim WHERE id IN :headers];
        
        for(PartnerFundClaim header : headers){
            PartnerFundClaim lineFull = new PartnerFundClaim(RequestId=header.RequestId, Amount=0,Line_Item__c=true,Related_Header_ID__c=header.ACE_Header_Record_Read__c);
            lineFull.Title = header.Title + '1';
            lineFull.ACE_Spend_Category__c = 'Co-op Event';
            lineFull.ACE_Total_Expenditure__c = 2;
            lineFull.ACE_Requested_Reimbursement__c = 2;
            lineFull.ACE_Reimbursement_Percent__c=100;
            lineFull.Account_Ship_To__c = header.Account_Ship_To__c;
            lineFull.ACE_Line_Item_Index__c = 1;
            linesToCreate.add(lineFull);
            
            PartnerFundClaim lineHalf = new PartnerFundClaim(RequestId=header.RequestId, Amount=0,Line_Item__c=true,Related_Header_ID__c=header.ACE_Header_Record_Read__c);
            lineHalf.Title = header.Title + '2';
            lineHalf.ACE_Spend_Category__c = 'Incentive';
            lineHalf.ACE_Total_Expenditure__c = 2;
            lineHalf.ACE_Requested_Reimbursement__c = 1;
            lineHalf.ACE_Reimbursement_Percent__c=50;
            lineHalf.Account_Ship_To__c = header.Account_Ship_To__c;
            lineHalf.ACE_Line_Item_Index__c = 2;
            linesToCreate.add(lineHalf);
        }
        return linesToCreate;
    }
    
    public static Account[] updatePortalAccounts(Account[] accts){
        for(Account acct : accts){
            acct.isPartner = true;
        }
        return accts;
        
    }
    
    /*------------------------------------------------------------
Author:        Maneesha Gudisay
Company:       Accenture
Description:   Method that creates a file and Links the document to reimbursement.		
<Date>      <Authors Name>     <Brief Description of Change>
03/26/2019  Maneesha Gudisay
------------------------------------------------------------*/
    public static void createFile(Id reimbursementId){
        ContentVersion contentVersion = new ContentVersion(
            Title = 'files',
            PathOnClient = 'files.jpg',
            VersionData = Blob.valueOf('Test Content'),
            IsMajorVersion = true
        );
        insert contentVersion;
        
        ContentVersion contentVersionObj = [SELECT Id, Title, ContentDocumentId FROM ContentVersion WHERE Id = :contentVersion.Id LIMIT 1];
        ContentDocumentLink contentDocumentLinkObj = new ContentDocumentLink();
        contentDocumentLinkObj.LinkedEntityId =reimbursementId;
        contentDocumentLinkObj.ContentDocumentId =contentVersionObj.ContentDocumentId;
        contentDocumentLinkObj.ShareType='I';
        insert contentDocumentLinkObj;
        
    }
     public static Blob createCSV( Id shipto , Id allocation , Id distributor){
        String str = 'Title,Account_Ship_To__c,AllocationId,RequestedAmount,ChannelPartnerId,ACE_Start_Date__c,ACE_End_Date__c,ACE_Internal_Order__c,ACE_Spend_Type__c,ACE_Event_Organizer__c,Description\n FRTest1,'+ shipto + ','+ allocation + ',100,'+ distributor +',2018-10-05,2018-10-31,,,rajiv,desc';
        Blob csvFileBody;
        csvFileBody = Blob.valueOf(str);  
        return csvFileBody;         
    }
    public static Blob createinvalidCSVfile(){
        String str = '!!!!'; 
        Blob csvFileBody;
        csvFileBody = Blob.valueOf(str);  
        return csvFileBody; 
    }
}