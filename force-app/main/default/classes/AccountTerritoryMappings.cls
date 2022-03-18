public class AccountTerritoryMappings {
@InvocableMethod(label='Insert Accounts' description='Inserts the accounts specified and returns the IDs of the new accounts.')
  public static void insertTerrMapOnAccounts(List<Account> accounts) {
      System.debug('accounts'+accounts.size());
      List<Id> ownerId = new List<Id>();
      List<Account> accList = new List<Account>();
      for(Account acc:accounts){ ownerId.add(acc.OwnerId);}
      Map<Id,C360_Territory_Mapping__c> ownerToTerrMap = new Map<Id,C360_Territory_Mapping__c>(); 
          
      for(C360_Territory_Mapping__c tmp: [select id,C360_CRM_TerrID_Key__c,C360_CRM_TerrID_ParentID__c,C360_CRM_TerrID_Employee1__c,
                                                     CRM_Sales_Grp_Terr_ID_F3__c,CRM_Sales_Off_Terr_ID_F4__c,CRM_Province_Terr_ID_F5__c
                                                  from C360_Territory_Mapping__c where C360_CRM_TerrID_Employee1__c=:ownerId])
      {
          ownerToTerrMap.put(tmp.C360_CRM_TerrID_Employee1__c,tmp);
      }
      for(Account acc1:Accounts)
      {
          C360_Territory_Mapping__c terrMap = ownerToTerrMap.get(acc1.OwnerId);
          Account acc = new Account();
          acc.id = acc1.id;
          if(terrMap == null) terrMap = new C360_Territory_Mapping__c();
          acc.C360_F1_Territory_Lookup__c = terrMap.id;
          acc.C360_CRM_Sales_Rep_Terr_ID_F1__c = terrMap.C360_CRM_TerrID_Key__c;
          acc.C360_CRM_Sales_Dist_Terr_ID_F2__c = terrMap.C360_CRM_TerrID_ParentID__c;
          acc.C360_CRM_Sales_Grp_Terr_ID_F3__c = terrMap.CRM_Sales_Grp_Terr_ID_F3__c;
          acc.C360_CRM_Sales_Off_Terr_ID_F4__c = terrMap.CRM_Sales_Off_Terr_ID_F4__c;
          acc.C360_CRM_Province_Terr_ID_F5__c = terrMap.CRM_Province_Terr_ID_F5__c;
          accList.add(acc);
      }
      if(!accList.isEmpty()) 
          upsert accList;
     }
}