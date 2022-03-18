@isTest
global class ACE_TestApproveWebServiceMock implements WebServiceMock {
   global void doInvoke(
           Object stub,
           Object request,
           Map<String, Object> response,
           String endpoint,
           String soapAction,
           String requestName,
           String responseNS,
           String responseName,
           String responseType) {
        // start - specify the response you want to send
        ACE_ClaimApprovalStub.DT_ApprovedClaims_SFDC_Rec_Res  response_x = new ACE_ClaimApprovalStub.DT_ApprovedClaims_SFDC_Rec_Res();
        ACE_ClaimApprovalStub.DT_ApprovedClaims_SFDC_Rec_Res  response_xv = new ACE_ClaimApprovalStub.DT_ApprovedClaims_SFDC_Rec_Res();
        List<ACE_ClaimApprovalStub.Response_element> responlist = new List<ACE_ClaimApprovalStub.Response_element>();
        ACE_ClaimApprovalStub.Response_element res = new ACE_ClaimApprovalStub.Response_element();
        ACE_ClaimApprovalStub.Response_element res1 = new ACE_ClaimApprovalStub.Response_element();
        res.Status = 'SUCCESS';
        //responlist.add(res1);
        responlist.add(res);
        
        response_x.Response = new List<ACE_ClaimApprovalStub.Response_element>();
        response_x.Response.addAll(responlist);
        // end
        response.put('response_x', response_x); 
        response.put('response_xv', response_xv);
   }
}