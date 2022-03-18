@isTest
public class ACE_FundRequestreimbuseSchedularTest {
	@isTest
    public static void createherarchyRelationships(){
        Test.StartTest();
		ACE_FundRequestReimburseSchedular sh1 = new ACE_FundRequestReimburseSchedular();
		String sch = '0 0 23 * * ?'; 
        system.schedule('FundRequestSchedular', sch, sh1); 
        Test.stopTest(); 
    }
    
}