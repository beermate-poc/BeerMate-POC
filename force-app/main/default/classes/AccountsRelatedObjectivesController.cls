public class AccountsRelatedObjectivesController {
public Account AccountRec;
public List<Account> AccountList;
public List<Objective__c> ObjList1;
public List<Objective__c> ObjList2;

    public AccountsRelatedObjectivesController(ApexPages.StandardController controller) {
    this.AccountRec= (Account)controller.getRecord();
    AccountList =[select Name,Id from Account where id =:AccountRec.id limit 1];

    }
    
    /*@version        1.0
 *@date           03/21/2019
 *@description    it gives the size of available survey list
 *@param          ID
 *@returns        Integer
*/

public Integer getNotStartedObjectiveSize(){    
  ObjList1=new List<Objective__c>();
    ObjList1=[SELECT ID,NAME,Status__c,Account__c FROM Objective__c
                             WHERE Account__c=:AccountList[0].id AND 
                                    Status__c = 'Not Started'
                                    LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()];
     return ObjList1.size();
                                    }

/*@version        1.0
 *@date           03/21/2019
 *@description    it gives the size of active objective list
 *@param          ID
 *@returns        Integer
*/    
    
    public Integer getInProgressObjectiveSize(){
    ObjList2=new List<Objective__c>();
    ObjList2=[SELECT ID,NAME,Status__c,Account__c FROM Objective__c
                             WHERE Account__c=:AccountList[0].id AND 
                                    Status__c = 'In Progress'
                                    LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()];
     return ObjList2.size();
                                    }
}