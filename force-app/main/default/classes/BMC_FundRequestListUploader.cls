/**
@Author Accenture
@name: BMC_FundRequestListUploader
@CreateDate  06/11/2018
@Description Includes methods called from VF page to upload Fund Requests.
@Version <1.0>
*/
global without sharing class BMC_FundRequestListUploader  {
    
    public String csvAsString{get;set;}
    public string nameFile{get;set;}
    public string listName{get;set;}
    public Blob contentFile{get;set;}
    public Boolean listNamecheck {get;set;} 
    public Boolean displayPopUp {get;set;}  
    public Boolean filecheck {get;set;}
    public Boolean fileDatacheck {get;set;}
    public List<String> filelines = new List<String> ();
    public PartnerFundRequest FundRequestObj;
    public Boolean fileEmptycheck {get;set;}
    public PartnerFundRequest relatedID;
    public List<PartnerFundRequest> pfrlist{get;set;}
    public Boolean amountExceeds {get;set;}	
    public Boolean showDataFundRequest{get;set;}
    
    /**
*  @description:  Method To read Partner Fund Requests from input file
*  @name: importCSVfile
*  @param: Null
*  @return: Read File of Fund Request Records
*/
    
    public BMC_FundRequestListUploader(){
        filelines = new String[]{};
            pfrlist= New List<PartnerFundRequest>(); 
    }
    public void  importCSVFile(){
        try{
            showDataFundRequest=true;
           // System.debug('contentFile'+contentFile);
            if(contentFile != null ){
                fileDatacheck=false;
                List<String> inputvalues = new List<String> ();
                pfrlist = New List<PartnerFundRequest>(); 
                nameFile =blobToString( contentFile,Constants.ISO); 
              //  System.debug('nameFile-->'+nameFile);
                filelines = nameFile.split(Constants.NEW_LINE); 
                string[] csvFieldNames = filelines[0].split(Constants.COMMA);
              //  System.debug('csvFieldNames-->'+csvFieldNames);
                csvAsString = contentFile.toString();
                
              //  System.debug('filelines-->'+filelines.size());
              //  System.debug('csvFieldNames.size()-->'+csvFieldNames.size());
                
                if(filelines.size()<=1){
                    fileEmptycheck = true;
                    contentFile = null;
                }
                else{
                    fileEmptycheck = false;
                    if(csvFieldNames.size()==11){
                        filecheck=false;
                      //  System.debug('filelines'+filelines);
                        Decimal sum = 0;
                        for(Integer i=1;i<filelines.size();i++){
                            PartnerFundRequest frObj = new PartnerFundRequest() ;
                            string[] csvRecordData = filelines[i].split(',');
                            
                            frObj.Title = csvRecordData[0];     
                            frObj.Account_Ship_To__c = csvRecordData[1];
                            frObj.AllocationId = csvRecordData[2];   
                            frObj.RequestedAmount = Decimal.valueOf(csvRecordData[3]); 
                            sum = sum +  frObj.RequestedAmount;
                            frObj.ChannelPartnerId = csvRecordData[4];   
                            frObj.ACE_Start_Date__c = Date.valueOf(csvRecordData[5]);
                            frObj.ACE_End_Date__c = Date.valueOf(csvRecordData[6]);
                            frObj.ACE_Internal_Order__c = String.isBlank(csvRecordData[7])==true?null:csvRecordData[7];
                            frObj.ACE_Spend_Type__c = String.isBlank(csvRecordData[8])==true?null:csvRecordData[8];
                            frObj.ACE_Event_Organizer__c = csvRecordData[9];
                            frObj.Description = csvRecordData[10];
                            pfrlist.add(frObj);   
                            if(checkFR(sum,frObj.AllocationId)){
                                amountExceeds=true;
                            }
                        }
                        
                    }
                }
            }
            else{
                contentFile = null;
                fileDatacheck=true;
            }
           // System.debug('pfrlist'+pfrlist);
        }
        catch(Exception e){
           // System.debug('e.getMessage()'+e.getMessage()); 
           // System.debug('e.getLineNumber()'+e.getLineNumber()); 
            ApexPages.Message errorMessage = new ApexPages.Message(ApexPages.severity.ERROR, 'An error has occured while saving data.  Please ensure fields are in the correct format.');
            ApexPages.addMessage(errorMessage);  
            showDataFundRequest=false;
        }  
    }
    
    /**
*  @description:  Method To create Partner Fund Requests from input file
*  @name: importCSVfile
*  @param: Null
*  @return: Create Fund Request Records
*/
    
    public Boolean checkFR( Decimal sum,id AllocationId){
        AggregateResult[] groupedResults = [SELECT SUM(RequestedAmount)used FROM PartnerFundRequest where AllocationId  =:  AllocationId];
        groupedResults[0].get('used');
        
       // System.debug('used'+ groupedResults[0].get('used'));
        Decimal amtfundallocation = [SELECT  Amount FROM PartnerFundAllocation where id = :AllocationId].Amount;
       // System.debug('amtfundallocation'+amtfundallocation);
        Decimal usedFunrequest = (Decimal)(groupedResults[0].get('used'));
        if(usedFunrequest == null){
            usedFunrequest=0;
        }
       // System.debug('usedFunrequest'+usedFunrequest);
       // System.debug('sum'+sum);
        if((sum + usedFunrequest) > amtfundallocation){
            return true; 
        }
        else{
            return false;
        }
        
    }
    public void saveData() {
        try 
        {
            INSERT pfrlist;
            ApexPages.Message errorMessage = new ApexPages.Message(ApexPages.severity.INFO, 'Fund Request records inserted successfully');
            displayPopUp=true;
            ApexPages.addMessage(errorMessage);
            showDataFundRequest=false;
        } 
        catch (Exception e) {
            ApexPages.Message errorMessage = new ApexPages.Message(ApexPages.severity.ERROR, 'An error has occured while saving data');
            ApexPages.addMessage(errorMessage);
            
        }
    }
    public Pagereference closePopup(){
        try{
            PageReference pageRef = new PageReference(ApexPages.currentPage().getUrl());
            pageRef.setRedirect(true);
            return pageRef;
        }
        catch(Exception e){
            return null;
        }  
    }
    
    /**
*  @description: This function convers the input CSV file in BLOB format into a string
*  @name:  blobToString
* @param input    Blob data representing correct string in @inCharset encoding
* @param inCharset    encoding of the Blob data (for example 'ISO 8859-1')   
* @return: Conversion of Blob to String
*/
    public String blobToString(Blob input, String inCharset){
        try{
            String hex = EncodingUtil.convertToHex(input);
            system.assertEquals(0, hex.length() & 1);
            final Integer bytesCount = hex.length() >> 1;
            String[] bytes = new String[bytesCount];
            for(Integer i = 0; i < bytesCount; ++i){
                bytes[i] =  hex.mid(i << 1, 2);
            }
            return EncodingUtil.urlDecode(Constants.PERCENTAGE + String.join(bytes, Constants.PERCENTAGE), inCharset);
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }  
    }  
}