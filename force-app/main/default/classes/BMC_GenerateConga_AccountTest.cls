@isTest 
public class BMC_GenerateConga_AccountTest {
    static testMethod void updateField() 
    {
        TestDataFactory.insertBulkAccount('CongaAccount',Constants.DISTRIBUTOR, 200);  
        Test.startTest();
        BMC_GenerateConga_Account accObj = new BMC_GenerateConga_Account();
        DataBase.executeBatch(accObj); 
        Test.stopTest();
    }
}