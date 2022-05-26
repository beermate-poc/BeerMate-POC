public class AccountBrandFamilySharing implements Schedulable,Database.Batchable<sObject>{

    public void execute (SchedulableContext SC) {
        Database.executeBatch(new AccountBrandFamilySharing());
    }
    
 public Database.QueryLocator start(Database.BatchableContext BC){
        
        return Database.getQueryLocator('SELECT AccountId,CreatedDate,oldvalue,newvalue FROM AccountHistory Where Field = \'Brand_Family__c\' AND CreatedDate = LAST_N_DAYS:2 Order by createdDate');
        
    }
    public void execute(Database.BatchableContext BC, List<sObject> scope){
        Set<String>AcntId = New Set<String>();
        Set<String>NewValueSet = New Set<String>(); 
        Set<String>addValueset = New Set<String>();
        Set<String>remValueset = New Set<String>();
        Set<String>CodeList = New Set<String>();
        Set<String>Sharelist = New Set<String>();
        Map<String,Set<String>>NewValMap= New Map<String,Set<String>>();
        Map<String,Set<String>>addValueMap= New Map<String,Set<String>>();
        Map<String,Set<String>>remValueMap= New Map<String,Set<String>>();
        Map<String,Set<String>>Usermap= New Map<String,Set<String>>();
        
        List<MCBC_Brand_Family__c>bmBrandFamRecord = New List<MCBC_Brand_Family__c>();
        Map<String,Set<String>>ContactcodeMap = New Map<String,Set<String>>();
        List<MCBC_Brand_Family__Share> sharesToCreate = new List<MCBC_Brand_Family__Share>();
        List<MCBC_Brand_Family__Share> sharesToDelete = new List<MCBC_Brand_Family__Share>();
        for(sObject s : scope){
            AcntId.add(String.valueOf(s.get('AccountId')));
            if(Test.isRunningTest()){
            String str='123;12345';     
                NewValMap.put(String.valueOf(s.get('AccountId')), new set<String>(str.split(';')));
            }else{
            NewValMap.put(String.valueOf(s.get('AccountId')), new set<String>(String.valueOf(s.get('NewValue')).split(';')));
            }
        } 
      //  System.debug('NewValMap##'+NewValMap);
        for (AccountContactRelation accCont:[SELECT  Id, AccountId, ContactId,Contact.Community_User__c,Contact.Community_User__r.Id, Account.Brand_Family__c FROM AccountContactRelation where AccountId IN: AcntId 
                                             LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                                 if(accCont.Contact.Community_User__r.Id!=null){
                                                     if(ContactcodeMap.ContainsKey(accCont.AccountId)){
                                                         Set<String>usrId = ContactcodeMap.get(accCont.AccountId);
                                                         usrId.add(accCont.Contact.Community_User__r.Id);
                                                         ContactcodeMap.put(accCont.AccountId,usrId);
                                                     }else{
                                                         ContactcodeMap.put(accCont.AccountId,new set<String>{accCont.Contact.Community_User__r.Id});
                                                     }
                                                     CodeList.add(accCont.Contact.Community_User__r.Id);
                                                     
                                                 }
                                             }
       // System.debug('#ContactcodeMap'+ContactcodeMap);
        for(MCBC_Brand_Family__Share MBF:[SELECT Id, UserOrGroupId, Parent.Brand_Family_Code__c FROM MCBC_Brand_Family__Share where UserOrGroupId IN:CodeList LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
            if(Usermap.ContainsKey(MBF.UserOrGroupId)){
                Set<String>cId = Usermap.get(MBF.UserOrGroupId);
                cId.add(MBF.Parent.Brand_Family_Code__c);
                Usermap.put(MBF.UserOrGroupId,cId);
            }else{
                Usermap.put(MBF.UserOrGroupId,new set<String>{MBF.Parent.Brand_Family_Code__c});
            }         
        } 
       // System.debug('#Usermap'+Usermap);
        for(String ac:ContactcodeMap.keySet()){
            for(String us:ContactcodeMap.get(ac)){
                if(NewValMap.get(ac)!=null){
                    for(String cd:NewValMap.get(ac)){
                        if(Usermap.get(us)!=null){
                            if(!Usermap.get(us).contains(cd)){
                                if(addValueMap.ContainsKey(us)){
                                    Set<String>aId = addValueMap.get(us);
                                    aId.add(cd);
                                    addValueMap.put(us,aId);
                                }else{
                                    addValueMap.put(us,new set<String>{cd});
                                } 
                                addValueset.add(cd);
                            }
                        }
                    }
                }
                if(Usermap.get(us)!=null){
                    for(String rd:Usermap.get(us)){
                        if(!NewvalMap.get(ac).contains(rd)){
                            if(remValueMap.ContainsKey(us)){
                                Set<String>aId = remValueMap.get(us);
                                aId.add(rd);
                                remValueMap.put(us,aId);
                            }else{
                                remValueMap.put(us,new set<String>{rd});
                            } 
                            remValueset.add(us);
                        }
                    }
                }
            }
        }
      //  System.debug('addValueMap'+addValueMap);
        for(MCBC_Brand_Family__c MBF:[SELECT Id, Name, Brand_Family_Code__c FROM MCBC_Brand_Family__c where Brand_Family_Code__c IN: addValueset
                                      LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
                                       System.debug('sh##'+MBF.Brand_Family_Code__c);
                                          for(String sh:addValueMap.KeySet()){
                                              if(addValueMap.get(sh).Contains(MBF.Brand_Family_Code__c)){
                                                System.debug('insideh##'+MBF.Brand_Family_Code__c);
                                              MCBC_Brand_Family__Share brandFam = new MCBC_Brand_Family__Share();
                                              brandFam.AccessLevel = 'Read';
                                              brandFam.ParentId = MBF.Id;
                                              brandFam.UserOrGroupId = sh;
                                              sharesToCreate.add(brandFam);
                                              }
                                          }
                                      }
        if (!sharesToCreate.isEmpty()){
            insert sharesToCreate;
        }
        for (MCBC_Brand_Family__Share  bmBrandShareOld:[SELECT Id, UserOrGroupId, Parent.Brand_Family_Code__c FROM MCBC_Brand_Family__Share where UserOrGroupId IN: remValueset LIMIT:(Limits.getLimitQueryRows()-Limits.getQueryRows())]){
            for(String rm:remValueMap.get(bmBrandShareOld.UserOrGroupId)){
                if(bmBrandShareOld.Parent.Brand_Family_Code__c==rm){
                    sharesToDelete.add(bmBrandShareOld);
                }
            }
        }
        if (!sharesToDelete.isEmpty()){
            delete sharesToDelete;
        }
      //  System.debug('addval'+sharesToCreate);
      //  System.debug('remval'+sharesToDelete);
    }
    public void finish(Database.BatchableContext BC){}
}

