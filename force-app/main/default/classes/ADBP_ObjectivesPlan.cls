/*------------------------------------------------------------
Author:        Mihai Badescu(mihai.badescu@molsoncoors.com)
Description:   Controller to get and update objectives.
Inputs:        none
History
12/11/2020     Initial creation
------------------------------------------------------------*/

public with sharing class ADBP_ObjectivesPlan {

    @AuraEnabled(cacheable=true)
    public static List<Objective__c> getObjectivesList(Id oppId){
        List<Objective__c> objList = new List<Objective__c>([Select Id, Name, Account__r.Name, e_Commerce_Accounts__c, Account__r.BillingStreet, Account__r.BillingCity, Account__r.TradeChannelDesc__c, Include_In_ADBP_Plan__c, Projected_NSR__c, Projected_DNR__c, Distribution_Type__c, Average_Weekly_Revenue__c, BMC_Projected90Days__c, GS_Selling_Story__c, Smart_Objective__c, Status__c, Objectives_Premise_Type__c, Projected_Weekly_Velocity__c, Related_Distributor_Sales_Rep__c FROM Objective__c WHERE Opportunity__c =: oppId AND Smart_Objective__c = TRUE ORDER BY Projected_NSR__c DESC NULLS LAST]);
        return objList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOppDetails(Id oppId,Id userId){
        List<Opportunity> oppList = new List<Opportunity>([Select Id,Projected_NSR__c,Projected_DNR__c,Projected_Volume__c,Number_of_Objectives_Planned__c,Benchmark_Placements__c,OwnerId,StageName,Planned_Placement__c FROM Opportunity WHERE Id =: oppId LIMIT 1]);
        if(userId != oppList[0].OwnerId){
            List<User> listUser = new List<User>([Select Id, ProfileName__c FROM User Where Id =: userId]);
            if(listUser[0].ProfileName__c == 'System Administrator'){
                oppList[0].OwnerId =  userId;
            }
        }
        return oppList;
    }

    @AuraEnabled
    public static string updateObjectivesToPlan(List<Id> includeList, List<Id> excludeList,Id oppId ){
        try{
            List<Opportunity> oppList = new List<Opportunity>([Select Id,Projected_NSR__c,Projected_DNR__c,Projected_Volume__c,Number_of_Objectives_Planned__c,Benchmark_Placements__c,OwnerId,StageName,Planned_Placements__c FROM Opportunity WHERE Id =: oppId LIMIT 1]);
            if(oppList[0].StageName == 'Execute' || oppList[0].StageName == 'Closed'){
                return 'success';
            }else{
                List<Objective__c> objList = new List<Objective__c>();
                for (integer i=0; i<includeList.size(); i++){
                    Objective__c obj = new Objective__c();
                    obj.Id = includeList[i];
                    obj.Include_In_ADBP_Plan__c = true;
                    objList.add(obj);
                }
                for (integer i=0; i<excludeList.size(); i++){
                    Objective__c obj = new Objective__c();
                    obj.Id = excludeList[i];
                    obj.Include_In_ADBP_Plan__c = false;
                    objList.add(obj);
                }
                update objList;
                rollupObjective(oppId);
                calcIncludeOnProducts(oppId);
                return 'success';
            }
        }catch(Exception ex){
            ErrorLog.insertErrorLog('ADBP_ObjectivesPlan','assignObjectivesToPlan',ex.getMessage(), ex.getLineNumber());
            return 'unsuccess';
        }
    }

    public static void rollupObjective(Id oppId){
        try{ 
        List<Objective__c> objectives = [select id,opportunity__c,account__c from objective__C where opportunity__c =:oppId];
        LREngine.Context ctx = new LREngine.Context(Opportunity.SobjectType, // parent object
                                            Objective__c.SobjectType,  // child object
                                            Schema.SObjectType.Objective__c.fields.Opportunity__c, // relationship field name
                                            'Include_In_ADBP_Plan__c = true');  
        ctx.add(
            new LREngine.RollupSummaryField(
                                            Schema.SObjectType.Opportunity.fields.Projected_DNR__c,
                                            Schema.SObjectType.Objective__c.fields.Projected_DNR__c,
                                            LREngine.RollupOperation.Sum 
                                         )); 
        ctx.add(
            new LREngine.RollupSummaryField(
                                            Schema.SObjectType.Opportunity.fields.Projected_NSR__c,
                                            Schema.SObjectType.Objective__c.fields.Projected_NSR__c,
                                            LREngine.RollupOperation.Sum 
                                         )); 
        ctx.add(
            new LREngine.RollupSummaryField(
                                            Schema.SObjectType.Opportunity.fields.Projected_Volume__c,
                                            Schema.SObjectType.Objective__c.fields.BMC_Projected90Days__c,
                                            LREngine.RollupOperation.Sum 
                                         )); 
        ctx.add(
            new LREngine.RollupSummaryField(
                                            Schema.SObjectType.Opportunity.fields.Number_of_Objectives_Planned__c,
                                            Schema.SObjectType.Objective__c.fields.id,
                                            LREngine.RollupOperation.Count 
                                         )); 
        Sobject[] masters = LREngine.rollUp(ctx, objectives);
        String distType = System.Label.Physical_Distribution_Value;
        distType = '\''+distType+'\''; 
        System.debug('hh'+distType);
        LREngine.Context ctx1 = new LREngine.Context(Opportunity.SobjectType, // parent object
                                            Objective__c.SobjectType,  // child object
                                            Schema.SObjectType.Objective__c.fields.Opportunity__c, // relationship field name
                                            'Include_In_ADBP_Plan__c = true and Distribution_Type__c ='+distType); 
                ctx1.add(
            new LREngine.RollupSummaryField(
                                            Schema.SObjectType.Opportunity.fields.Physical_Distribution_Outlets_Planned__c,
                                            Schema.SObjectType.Objective__c.fields.account__c,
                                            LREngine.RollupOperation.Count_Distinct 
                                         )); 
        Sobject[] masters1 = LREngine.rollUp(ctx1, objectives);
        update masters;
        update masters1;
        }
        catch(Exception ex){
           ErrorLog.insertErrorLog('ADBP_ObjectivesPlan','rollupObjective',ex.getMessage(), ex.getLineNumber());
        }
    }

    public static void calcIncludeOnProducts(Id oppId){
        try{
            AggregateResult[] ag = [SELECT C360_Product__c, Opportunity__c, COUNT(Id) c FROM Objective__c WHERE Opportunity__c =:oppId AND Include_In_ADBP_Plan__c = TRUE AND C360_Product__c != NULL GROUP By Opportunity__c, C360_Product__c];
            List<OpportunityLineItem> oList = new List<OpportunityLineItem>();
            for(OpportunityLineItem oli : [SELECT Id,Product2Id,OpportunityId FROM OpportunityLineItem WHERE OpportunityId =:oppId]){
                OpportunityLineItem ol = new OpportunityLineItem();
                ol.Id = oli.Id;
                for(AggregateResult a : ag){
                    if(oli.Product2Id == (id)a.get('C360_Product__c') && oli.OpportunityId == (id)a.get('Opportunity__c')){
                        ol.Number_of_Objectives_Included_in_Plan__c = (integer)a.get('c'); 
                    }
                }
                if(ol.Number_of_Objectives_Included_in_Plan__c == NULL){
                    ol.Number_of_Objectives_Included_in_Plan__c = 0;
                }
                oList.add(ol);
            }
            if(oList.size()>0){
                update oList;
            }
        }catch(Exception ex){
            ErrorLog.insertErrorLog('ADBP_ObjectivesPlan','calcIncludeOnProducts',ex.getMessage(), ex.getLineNumber());
        }
    }
}