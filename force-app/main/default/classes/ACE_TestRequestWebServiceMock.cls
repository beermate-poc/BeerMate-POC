@isTest
global class ACE_TestRequestWebServiceMock implements WebServiceMock {
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
            ACE_FundRequestStub.DT_FundRequest_SFDC_Rec_Res  response_x = new ACE_FundRequestStub.DT_FundRequest_SFDC_Rec_Res();
            ACE_FundRequestStub.Response_element res = new ACE_FundRequestStub.Response_element();
            res.Status = 'SUCCESS';
            response_x.Response = new List<ACE_FundRequestStub.Response_element>();
            response_x.Response.add(res); 
            // end
            response.put('response_x', response_x); 
        }
}