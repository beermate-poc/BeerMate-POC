/**
@Author Accenture
@name BMC_droShipToTriggerHandler
@CreateDate  1/4/2019
@Description Trigger handler for field update in Account during insert and update of Distributor Retail Outlet records.
@Version <1.0>
*/
public  without sharing class BMC_droShipToTriggerHandler { 
    /**
    *   @description: updates a field in Account during insert of Distributor Retail Outlet records. 
    *  @name: insertShipToOnAccount
    *  @param: dro: Distributor Retail Outlet Records
    *  @return: null
    */    
    
    public static void insertShipToOnAccount(List<Distributor_Retail_Outlet__c> dro){
        try{
            set<Id> outletIds= new set<Id>();
            List<Distributor_Retail_Outlet__c> drolist=[SELECT Id,DistributorAccount__r.PrimaryShipToDistributorNbr__c,RetailOutlet__r.Id from Distributor_Retail_Outlet__c where Id IN : dro];
            for(Distributor_Retail_Outlet__c dlist : drolist ){
                outletIds.add(dlist.RetailOutlet__r.Id);
            }
            Map<Id,Account> accMap= new Map<Id,Account>();    
            for(Account account:[SELECT Id, Name, Type, BMC_BWB_Retail_Ship_To_IDs__c, Distributors__c FROM Account where Id IN : outletIds]){
                for(Distributor_Retail_Outlet__c distro: drolist){
                    if(distro.DistributorAccount__c  != null && distro.RetailOutlet__r.id==account.Id && distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c != null){
                         if(account.BMC_BWB_Retail_Ship_To_IDs__c== null){
                            account.BMC_BWB_Retail_Ship_To_IDs__c= Constants.SEMI_COLON +distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON;
                            }
                        else{
                            if(!account.BMC_BWB_Retail_Ship_To_IDs__c.contains(Constants.SEMI_COLON+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON))
                                account.BMC_BWB_Retail_Ship_To_IDs__c= account.BMC_BWB_Retail_Ship_To_IDs__c+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON;
                        }                    
                        accMap.put(account.Id, account);
                    }
                }
            }
            update accMap.values();
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
   
    /**
    *   @description: updates a field in Account during update of Distributor Retail Outlet records. 
    *  @name: updateShipToOnAccount
    *  @param: oldroMap: Distributor Retail Outlet Records, dro: Distributor Retail Outlet Records
    *  @return: null
    */    
    
    public static void updateShipToOnAccount(Map<Id,Distributor_Retail_Outlet__c> oldroMap,List<Distributor_Retail_Outlet__c> dro){
        try{
            set<Id> outletIds= new set<Id>();
            List<Distributor_Retail_Outlet__c> drolist=[SELECT Id,DistributorAccount__r.PrimaryShipToDistributorNbr__c,RetailOutlet__r.Id from Distributor_Retail_Outlet__c where Id IN : dro];
            for(Distributor_Retail_Outlet__c dlist : drolist ){
                outletIds.add(dlist.RetailOutlet__r.Id);
            }
            Map<Id,Account> accMap= new Map<Id,Account>();
            for(Account account:[SELECT Id, Name, Type, BMC_BWB_Retail_Ship_To_IDs__c, Distributors__c FROM Account where Id IN : outletIds]){
                for(Distributor_Retail_Outlet__c distro: drolist){
                    if(distro.DistributorAccount__c  != null && distro.RetailOutlet__r.id==account.Id && distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c != oldroMap.get(distro.Id).DistributorAccount__r.PrimaryShipToDistributorNbr__c &&  distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c != null){
                if(account.BMC_BWB_Retail_Ship_To_IDs__c== null){                        
                            account.BMC_BWB_Retail_Ship_To_IDs__c= Constants.SEMI_COLON+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON;
                        }
                        else{
                            if(!account.BMC_BWB_Retail_Ship_To_IDs__c.contains(Constants.SEMI_COLON+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON))
                                account.BMC_BWB_Retail_Ship_To_IDs__c= account.BMC_BWB_Retail_Ship_To_IDs__c+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON;
                        }                    
                        accMap.put(account.Id, account);
                    }
                }
            }
            update accMap.values();
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }
    
    
     /**
    *   @description: updates a field in Account during insert/update of Distributor Retail Outlet records. 
    *  @name: updateRetailOutletAccount
    *  @param: oldroMap: Distributor Retail Outlet Records, dro: Distributor Retail Outlet Records
    *  @return: null
    */    
    /* public static void updateRetailOutletAccount(Map<Id,Distributor_Retail_Outlet__c> oldroMap,List<Distributor_Retail_Outlet__c> dro, Boolean isUpdate){
        try{
            set<Id> outletIds= new set<Id>();
            List<Distributor_Retail_Outlet__c> drolist=[SELECT Id,DistributorAccount__r.PrimaryShipToDistributorNbr__c,RetailOutlet__r.Id from Distributor_Retail_Outlet__c where Id IN : dro];
      List<Account> lstAccToUpdate = new List<Account>();
         for(Distributor_Retail_Outlet__c dlist : drolist ){
                outletIds.add(dlist.RetailOutlet__r.Id); 
            }
            Map<Id,Account> accMap= new Map<Id,Account>();     
      
      for(Account account : [SELECT Id, Name, Type, BMC_BWB_Retail_Ship_To_IDs__c, Distributors__c FROM Account where Id IN : outletIds]) {
        accMap.put(account.Id, account);
      }
            
      for(Distributor_Retail_Outlet__c distro: drolist){
        
        if(distro.DistributorAccount__c  != null && accMap.containsKey(distro.RetailOutlet__r.Id) && distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c != null && (!isUpdate || (isUpdate && distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c != oldroMap.get(distro.Id).DistributorAccount__r.PrimaryShipToDistributorNbr__c) )){
          Account oAcc = accMap.get(distro.RetailOutlet__r.Id);
          if(oAcc.BMC_BWB_Retail_Ship_To_IDs__c== null){
            oAcc.BMC_BWB_Retail_Ship_To_IDs__c= Constants.SEMI_COLON +distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON;
            }
          else{
            if(!oAcc.BMC_BWB_Retail_Ship_To_IDs__c.contains(Constants.SEMI_COLON+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON))
              oAcc.BMC_BWB_Retail_Ship_To_IDs__c= oAcc.BMC_BWB_Retail_Ship_To_IDs__c+distro.DistributorAccount__r.PrimaryShipToDistributorNbr__c+Constants.SEMI_COLON;
          }  
          lstAccToUpdate.add(oAcc);      
        }
      }
           // system.debug('=========lstAccToUpdate============'+lstAccToUpdate); 
      if(!lstAccToUpdate.isEmpty()){
         update lstAccToUpdate;
      }
        }
        catch(Exception e){
            throw new AuraHandledException(Label.An_unexpected_error_occurred + Constants.BLANK_WITHSPACE + e.getMessage());
        }
    }*/
}