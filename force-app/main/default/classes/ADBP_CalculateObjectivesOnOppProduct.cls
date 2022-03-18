/*
@Author Mihai Badescu
@name ADBP_CalculateObjectivesOnOppProduct
@CreateDate  4/26/2021
@Description Batch class to calculate values from objectives to every product
@Version <1.0>
*/
global class ADBP_CalculateObjectivesOnOppProduct implements Database.Batchable<Sobject>{
    global final String query;
    global Database.QueryLocator start(Database.BatchableContext bc) {
        Id RecordTypeIdOpportunity = Schema.SObjectType.Opportunity.getRecordTypeInfosByName().get('ADBP Opportunity').getRecordTypeId();
        String query = 'SELECT Id,Product2Id,OpportunityId,Opportunity.RecordTypeId, Opportunity.StageName FROM OpportunityLineItem WHERE Opportunity.RecordTypeId =: RecordTypeIdOpportunity AND Opportunity.StageName IN (\'Preview\',\'Plan\',\'Collaborate\',\'Execute\')';
        return Database.getQueryLocator(query);
    }
    global void execute(Database.BatchableContext bc, List<OpportunityLineItem> scope) {
        List<OpportunityLineItem> oList = new List<OpportunityLineItem>();
        Set<Id> pId = new Set<Id>();
        Set<Id> oId = new Set<Id>();
        for (OpportunityLineItem oli : scope){
            OpportunityLineItem o = new OpportunityLineItem();
            o.Product2Id = (id)oli.Product2Id;
            pId.add(oli.Product2Id);
            o.OpportunityId = (id)oli.OpportunityId;
            oId.add(oli.OpportunityId);
            o.Id = oli.Id;
            oList.add(o);
        }
        for(AggregateResult ag : [SELECT C360_Product__c, Opportunity__c, COUNT(Id) c, SUM(Projected_NSR__c) nsr, SUM(Projected_DNR__c) dnr, SUM(BMC_Projected90Days__c) total FROM Objective__c WHERE Opportunity__c in: oId AND C360_Product__c in:pId GROUP By C360_Product__c, Opportunity__c]){
            for(Integer i=0; i<oList.size();i++){
                if((id)ag.get('Opportunity__c') == oList[i].OpportunityId && (id)ag.get('C360_Product__c')== oList[i].Product2Id){
                    oList[i].Number_of_Objectives__c = (integer)ag.get('c');
                    oList[i].Total_Projected_NSR__c = (decimal)ag.get('nsr');
                    oList[i].Total_Projected_DNR__c = (decimal)ag.get('dnr');
                    oList[i].Total_Projected_Volume__c = (decimal)ag.get('total');
                }
            }
        }
        if(oList.size()>0){
            update oList;
        }
    }
    global void finish(Database.BatchableContext bc) {
        //Get the status of the Batch Job
    }
}