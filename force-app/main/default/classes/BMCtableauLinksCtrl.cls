public  class BMCtableauLinksCtrl {
    public string mcbcId {get;set;}
    
   public BMCtableauLinksCtrl(){
      string userId =  UserInfo.getUserId();
       user  usr = [select id,FederationIdentifier from user where Id =: userId] ;
        if(usr !=null && !string.isBlank(usr.FederationIdentifier)){
            mcbcId = usr.FederationIdentifier.left(4);
         }else{
			mcbcId='';                    
         }
    }
}