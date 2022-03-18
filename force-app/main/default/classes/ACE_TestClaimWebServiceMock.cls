@isTest
global class ACE_TestClaimWebServiceMock implements WebServiceMock {
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
            ACE_FundClaimStub.DT_FundReimbursement_SFDC_Rec_Res  response_x = new ACE_FundClaimStub.DT_FundReimbursement_SFDC_Rec_Res();
            ACE_FundClaimStub.Response_element res = new ACE_FundClaimStub.Response_element();
            res.Status = 'SUCCESS';
            response_x.Response = new List<ACE_FundClaimStub.Response_element>();
            response_x.Response.add(res); 
            // end
            response.put('response_x', response_x); 
        }
}