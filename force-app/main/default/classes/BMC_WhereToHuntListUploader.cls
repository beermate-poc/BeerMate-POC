/**
@Author Accenture
@name: BMC_WhereToHuntListUploader
@CreateDate  06/11/2018
@Description Includes methods called from VF page to upload Where To Hunt List  and Chain Executive Upload.
@Version <1.0>
*/
global without sharing class BMC_WhereToHuntListUploader  {
    public Boolean csvformat {get;set;}	
    public string nameFile{get;set;}
    public string listName{get;set;}
    public Blob contentFile{get;set;}
    public Boolean duplicateTargetTitle {get;set;}	
    public Boolean listNamecheck {get;set;}	
    public Boolean displayPopUp {get;set;}	
    public Boolean filecheck {get;set;}
    public Boolean fileDatacheck {get;set;}
    private List<String> filelines = new List<String> ();
    public Where_to_Hunt__c whereToHuntObj;
    public Boolean fileEmptycheck {get;set;}
    public Id recordIdCA {get;set;}
    public String chainrecordName {get;set;}
    public Where_to_Hunt__c realtedWTHID;
    private static Final String BMC_CHAINRECORDID = 'id';
    private static Final String BMC_CHAINNAME = 'chainName';
    private static Final String BMC_CHAINFIELDS = 'OutletCd__c, ParentId,StatusNme__c';
    private static Final String BMC_CHAINORDER = 'OutletCd__c ASC';
    public String fileName = 'csv';
    
    /**
*  @description:  Method To create Taret List
*  @name:  readFile
*  @param: Null
*  @return: Creation of  Where to Hunt List
*/
    public void readFile()
    {
        
      //  System.debug('nameFile'+nameFile);
        
      //  System.debug('readFile');
        if(String.isBlank(listName)){
            listNamecheck=true;
            contentFile=null;
        }
        else{
            if(!nameFile.endsWith(fileName)){
                csvformat = true;
            }else{
                listNamecheck=false;
                if(checkDuplicateListName(listName)){
                    duplicateTargetTitle = true;
                    contentFile = null;
                } else {
                    duplicateTargetTitle = false;
                    try{
                        if(contentFile != null ){
                            fileDatacheck=false;
                            List<String> inputvalues = new List<String> ();
                            List<Target_Account__c> newTargetAccountsToinsert = new List<Target_Account__c>(); 
                            nameFile =blobToString( contentFile,Constants.ISO);
                            filelines = nameFile.split(Constants.NEW_LINE);
                            string[] csvFieldNames = filelines[0].split(Constants.COMMA);
                            if(filelines.size()<=1){
                                fileEmptycheck = true;
                                contentFile = null;
                            }
                            else{
                                fileEmptycheck = false;                       
                                if(csvFieldNames.size()==1){
                                    ID chainId = null ;
                                    whereToHuntObj = new Where_to_Hunt__c(Name=listName, List_Status__c =Constants.ACTIVE);
                                    database.insert(whereToHuntObj); 
                                    filecheck=false;
                                    for (Integer i=1;i<filelines.size();i++){
                                        String formattedIDs=filelines[i].replaceAll(Constants.ROW_LINE,Constants.BLANK_WITHOUTSPACE);
                                        inputvalues.add(formattedIDs);
                                    }
                                  //  System.debug('inputvalues'+inputvalues);
                                    BMC_WTHInsertTargetAccounts insertTargetAccount = new BMC_WTHInsertTargetAccounts(inputvalues,whereToHuntObj ,whereToHuntObj.Id, chainId,null,null); 
                                    database.executeBatch(insertTargetAccount);
                                    displayPopUp=true;
                                }
                                else{
                                    filecheck=true;
                                    contentFile = null;
                                }
                            }
                        }
                        else{
                            fileDatacheck=true;
                            contentFile = null;
                        }
                    }
                    catch(Exception e){
                        throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
                    }  
                }
            }
        }
    }
    /**
*  @description:  Method To create Taret List and Chain Outlet from Upload Oulet List from Chain Execution
*  @name: readCAFile
*  @param: Null
*  @return: Creation of  Where to Hunt List and Chain Outlets
*/
    public void  readCAFile(){
        try{
          //  System.debug('fileName'+fileName);
          //  System.debug('nameFile'+nameFile);
            if(contentFile != null ){
                if(!nameFile.endsWith(fileName)){
                    csvformat = true;
                }
                else{
                    fileDatacheck=false;
                    recordIdCA  = ApexPages.CurrentPage().getparameters().get(BMC_CHAINRECORDID);
                    chainrecordName = ApexPages.CurrentPage().getparameters().get(BMC_CHAINNAME);
                    List<String> inputvalues = new List<String> ();
                    nameFile =blobToString( contentFile,Constants.ISO); 
                    filelines = nameFile.split(Constants.NEW_LINE);			              
                    string[] csvFieldNames = filelines[0].split(Constants.COMMA);
                    if(filelines.size()<=1){
                        fileEmptycheck = true;
                        contentFile = null;
                    }
                    else{
                        fileEmptycheck = false;
                        if(csvFieldNames.size()==1){
                            filecheck=false;
                            for (Integer i=1;i<filelines.size();i++)
                            {
                                String formattedIDs=filelines[i].replaceAll(Constants.ROW_LINE,Constants.BLANK_WITHOUTSPACE);
                                inputvalues.add(formattedIDs);
                            }
                            
                            List<Where_to_Hunt__c> realtedWTHID =  [SELECT Id FROM Where_to_Hunt__c where BMC_Chain_Activity_ID__c =:recordIdCA and Name =:chainrecordName and  List_Status__c  =: Constants.ACTIVE LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
                            List<Target_Account__c>  oldtargetList =[SELECT Id ,  Target_List__c FROM Target_Account__c where Target_List__c =: realtedWTHID[0].Id LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
                            if(oldtargetList.size() > 0){
                                database.delete(oldtargetList);
                            }
                            BMC_Chain_Activity__c chainActivity = [SELECT Id, BMC_Where_to_Hunt_List__c ,BMC_Chain_Parent_Account__c,(SELECT id FROM Where_to_Hunt__r WHERE BMC_Chain_Activity_Favorite__c = false) FROM BMC_Chain_Activity__c WHERE Id = :recordIdCA LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
                            Map<Id, Account> accountById = new Map<Id, Account> ([SELECT Id, OutletCd__c, ParentId,StatusNme__c FROM Account WHERE Id = :chainActivity.BMC_Chain_Parent_Account__c LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]);
                            accountById = ACE_AccountHierarchy.getAllChildAccts(accountById, BMC_CHAINFIELDS, null,BMC_CHAINORDER);
                            List<String>  childOutletList = new  List<String> ();
                            List<String>  inputchildOutletList = new  List<String> ();
                            List<String>  errorchildOutletList = new  List<String> ();
                            List<String>  inactiveOutletList = new  List<String> ();
                            List<String>  inactiveInputList = new  List<String> ();
                            for (Id childOutlet : accountById.keySet()){
                                if((accountById.get(childOutlet).OutletCd__c != null)&& (accountById.get(childOutlet).StatusNme__c == 'Active')){
                                    childOutletList.add(accountById.get(childOutlet).OutletCd__c);
                                }
                                if(accountById.get(childOutlet).StatusNme__c == 'Inactive'){
                                    inactiveOutletList.add(accountById.get(childOutlet).OutletCd__c);
                                }
                            }
                            for(String fOutlet :inputvalues){
                                if(childOutletList.contains(fOutlet)){
                                    inputchildOutletList.add(fOutlet);
                                }
                                else if(inactiveOutletList.contains(fOutlet)){
                                    inactiveInputList.add(fOutlet);
                                }
                                else{
                                    errorchildOutletList.add(fOutlet);
                                }
                            }
                            if(chainActivity.BMC_Where_to_Hunt_List__c == NULL){
                                chainActivity.BMC_Where_to_Hunt_List__c = chainActivity.Where_To_Hunt__r[0].id;
                                update chainActivity; 
                            }
                            
                            BMC_WTHInsertTargetAccounts insertTargetAccount = new BMC_WTHInsertTargetAccounts(inputchildOutletList,whereToHuntObj,realtedWTHID[0].Id, recordIdCA, errorchildOutletList,inactiveInputList);
                            database.executeBatch(insertTargetAccount);
                            displayPopUp=true;
                        }
                        else{
                            contentFile = null;
                            filecheck=true;
                        }
                        
                    }
                    
                }
                
            }
            else{
                contentFile = null;
                fileDatacheck=true;
            }
            
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
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
    /**
*  @description: R Method that checks to see if a Where_to_Hunt__c record already exists with the provided title
*  @name: checkDuplicateListName
*  @param: string, containing the targetListTitle
*  @return: true: if query finds a record whose name is equal to the provided string
false: if query finds no records with a name equal to the povided string
*/
    public Boolean checkDuplicateListName(String tgtListTitle){
        try{
            List<Where_to_Hunt__c> checkDuplicates = [select name from Where_to_Hunt__c where name =: tgtListTitle LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())];
            if (checkDuplicates.size() > 0) {
                return true;
            } else {
                return false;
            }
        }
        catch(Exception e){
            return null;
        }  
    }
    /**
*  @description:   Method To navigate to created Where To Hunt List
*  @name: closePopup
*  @param: null
*/
    
    public Pagereference closePopup(){
        try{
            PageReference ref = new PageReference(Constants.FORWARD_SLASH+whereToHuntObj.Id);
            return ref;
        }
        catch(Exception e){
            return null;
        }  
    }
    /**
*  @description:   Method to close the mandate outlet popup
*  @name: returnChain
*  @param: null
*/
    
    
    public Pagereference returnChain(){
        try{
            recordIdCA  = ApexPages.CurrentPage().getparameters().get(BMC_CHAINRECORDID);
            PageReference ref = new PageReference(Constants.FORWARD_SLASH+recordIdCA);
            ref.setRedirect(true);
            return ref;
        }
        catch(Exception e){
            return null;
        }  
    }
    /**
*  @description:  Method to close the duplicate list name error popup
*  @name: closeError
*  @param: null
*/
    public void closeError(){
        try{
            duplicateTargetTitle = false;
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description:   Method to close file error popup
*  @name: closeFileError
*  @param: null
*/
    public void closeFileError(){
        try{
            filecheck=false;  
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    /**
*  @description:  Method to close list error popup
*  @name: closeFileEmptyError
*  @param: null
*/
    public void closeFileEmptyError(){
        try{
            fileEmptycheck=false;  
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description:  Method to close in valid CSV error popup
*  @name: closevalidCSVpopup
*  @param: null
*/
    
    public void closevalidCSVpopup(){
        try{
            csvformat=false;   
        }
        catch(Exception e){
            //closeFileError();
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    /**
*  @description:  Method to close list error popup
*  @name: closelistpopup
*  @param: null
*/
    public void closelistpopup(){
        try{
            listNamecheck=false;   
        }
        catch(Exception e){
            //closeFileError();
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    /**
*  @description: Method to close file error popup
*  @name: closefileDatapopup
*  @param: null
*/
    public void closefileDatapopup(){
        try{
            fileDatacheck=false;  
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
}