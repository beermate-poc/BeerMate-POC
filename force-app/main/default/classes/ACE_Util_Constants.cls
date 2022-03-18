public without sharing class ACE_Util_Constants{
    public final static RecordType fundReqCoOpRecordType= [SELECT id FROM RecordType WHERE sObjectType='PartnerFundRequest' AND DeveloperName='Co_Op'];
    public final static RecordType fundReqStdRecordType= [SELECT id FROM RecordType WHERE sObjectType='PartnerFundRequest' AND DeveloperName='Fund_Request'];
    
    
    public static Final String CNAMEwST = 'ws_Spend_Type';
    public static Final String MNAMESTC  ='SpendType_crud'; 
    
    public static Final String CNAMEwIO = 'ws_Internal_Order';
    public static Final String MNAMEIOC  ='InternalOrder_crud';  
    
    public static Final String CNAMEwIR = 'ws_Reimbursements';
    public static Final String MNAMEIRC  ='Reimbursements_crud';
    
    public static Final String CNAMEwSL = 'ws_Spend_Limit';
    public static Final String MNAMESLC  ='SpendLimit_crud'; 
    
    public static Final String  AUTHORIZATION = 'Authorization';
    public static Final String  ECC_NAMED_CREDENTIAL = '{!$ApprovalClaims.Basic}';
    
    public static Final String  HANA_ALLOCATION = '{!$ACE_FundAllocationHANA.Basic}';
    public static Final String  HANA_REQUEST = '{!$ACE_FundRequestHANA.Basic}';
    public static Final String  HANA_CLAIM = '{!$ACE_FundClaimHANA.Basic}';
}