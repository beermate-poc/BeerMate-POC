/**
@Author Accenture
@name BMC_CustomLookupControllerTest
@CreateDate  11/12/2018
@Description Includes methods for testing BMC_CustomLookupController.
@Version <1.0>
*/
@isTest(SeeAllData= false)
private with sharing class BMC_CustomLookupControllerTest {
    
    private Static Final String DISTRIBUTOR_NAME = 'Test Sample Outlet Selection Distributor Account';
    private Static Final String SEARCH_KEYWORD = 'Test';
    private Static Final String RETAIL_NAME = 'Test scanning On Acc';
    private Static Final String SCAN_CODE = '1234';
    private Static Final String SALES_USER ='Sales User';
    private Static Final String USER_NAME ='TestUser';
    private Static Final String ROLE ='Leadership';
    private Static Final String NAME ='User';
    private Static Final String FRNAME ='Test fund req';
    
    /**
*  @description: Method for initialDataSetup. 
*  @name: initialDataSetup
*  @param: null
*  @return: null
*/ 
    @testSetup static void initialDataSetup()
    {	
        User currUser = TestDataFactory.returnUser(SALES_USER, USER_NAME, ROLE);
        insert currUser;
        
        System.runAs(currUser){
            Account distributorObj=TestDataFactory.returnDistributoraccount(DISTRIBUTOR_NAME, Constants.DISTRIBUTOR);
            Account onaccObj=TestDataFactory.returnSingleOnAccount(RETAIL_NAME, Constants.SOS_ONPREMISE, Constants.SOS_ON);
            Account fundreqAcc =ACE_TestDataFactory.returnACE_fundreq_SingleAccount(FRNAME);
            BMC_Retail_Quality_Audit__c auditObj=TestDataFactory.createRetailaudit(onaccObj.Id, distributorObj.Id);
            List<Product__c> prodList=TestDataFactory.createauditProduct();
            List<BMC_Retail_Quality_Audit_Brand_Pack__c> rqaBranPack=TestDataFactory.createRetailauditbrandpack(auditObj.Id, prodList);
        }
    }
    
    /**
@Author Accenture
@name fetchLookUpValuesTest
@CreateDate  11/12/2018
@Description Method tests the fetchLookUpValues method.
*/
    @isTest
    public static void fetchLookUpValuesTest(){
        try{
            User salesUser = [select id from User where LastName =:NAME LIMIT 1];
            System.runAs(salesUser){	
                Account distributorObj=[SELECT ID FROM ACCOUNT WHERE NAME =:DISTRIBUTOR_NAME LIMIT 1];
                Account fundreqAcc=[SELECT ID FROM ACCOUNT WHERE NAME =:FRNAME LIMIT 1];
                BMC_Retail_Quality_Audit__c auditObj=[SELECT ID FROM BMC_Retail_Quality_Audit__c WHERE BMC_Distributor__r.Name =:DISTRIBUTOR_NAME and BMC_Outlet__r.Name =:RETAIL_NAME LIMIT 1];
                Test.startTest();
                List<sobject> fundrequestList= BMC_CustomLookupController.fetchLookUpValues(SEARCH_KEYWORD, constants.PARTNERFUNDREQUEST, fundreqAcc.id,null);
                List<sobject> accountList= BMC_CustomLookupController.fetchLookUpValues(SEARCH_KEYWORD, constants.ACCOUNT, distributorObj.id,null);
                List<sobject> retailList=BMC_CustomLookupController.fetchLookUpValues(SCAN_CODE, Constants.RETAIL_QUALITY_AUDIT_BRAND_PACK, auditObj.id,null);
                BMC_CustomLookupController.fetchLookUpValues(null, null, null,null);
                Test.stopTest();
                System.assertEquals(1, accountList.size());
                System.assertEquals(1, retailList.size());
            }
        }  
        catch(Exception e){
            Constants.coverExceptionScenario = false;
        }
    }
}