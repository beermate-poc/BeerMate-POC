/**
              * @author        Accenture
              * @Name          C360_AgreementStageChangeBatch
              * @Created date  12/05/2019
              * @description   Batch class for updating Agreement stage according to start date and end date 
              * @Version       1.0
            **/
            global class C360_AgreementStageChangeBatch implements Database.Batchable<sObject>{
                private static final string CNAME='C360_AgreementStageChangeBatch';
                 private static final string MNAME='execute';
                private static final string SIGNATURECOMPLETED='Signature Completed';
                private static final string EXECUTED='Executed';
                private static final string EXECUTION='Execution';
                private static final string REJECTED='Rejected';
                private static final string LOSTCOMPETITION='Lost Competition';
                private static final string STOPPED='Stopped';
                private static final string OPEN='Open';
                private static final string SUBMITTED='Submitted';
                private static final string APPROVEDNEGOTIATION='Approved/Negotiation';
                global Database.QueryLocator start(Database.BatchableContext bc) {
                    return Database.getQueryLocator([SELECT id, RecordType.Name, RecordType.DeveloperName, Start_Date__c,Status__c,Stage__c,End_Date__c,Rolling__c  FROM MCBC_Agreement__c where Stage__c!='Historical' LIMIT :Limits.getLimitQueryRows() - Limits.getQueryRows()]);
            }
                global void execute(Database.BatchableContext bc, List<MCBC_Agreement__c> scope){
                    try{
                     List<MCBC_Agreement__c> activeStage = new List<MCBC_Agreement__c>();
					 List<MCBC_Agreement__c> activeStatus = new List<MCBC_Agreement__c>();
                    for (MCBC_Agreement__c sd : scope)
                    { if((sd.Status__c==REJECTED||sd.Status__c==LOSTCOMPETITION||sd.Status__c==STOPPED) || (sd.End_Date__c< Date.today()))
                        
                     {sd.Stage__c ='Historical';
                       activeStage.add(sd);   
                        }
                        else if((sd.Start_Date__c<= Date.today() && sd.End_Date__c > Date.today() && (sd.Status__c==SIGNATURECOMPLETED || sd.Status__c==EXECUTED || sd.Status__c==EXECUTION))||((sd.Start_Date__c<= Date.today() && sd.End_Date__c==null)&& (sd.Status__c==SIGNATURECOMPLETED||sd.Status__c==EXECUTED||sd.Status__c==EXECUTION)) && sd.Stage__c!='Active')
                        {sd.Stage__c ='Active';
                         if(sd.RecordType.DeveloperName == 'AB_Buy_Sell_Agreement_Retail' || sd.RecordType.DeveloperName == 'Canada_Loan_Agreement_On_Premise'){
                             sd.Status__c='Execution';
                         }
                       activeStage.add(sd);
                        }
                     else if((sd.Status__c==OPEN||sd.Status__c==SUBMITTED||sd.Status__c==APPROVEDNEGOTIATION||sd.Start_Date__c>Date.today())&& sd.Stage__c!='Future' && (sd.End_Date__c> Date.today()||sd.End_Date__c==null))
                     {sd.Stage__c ='Future';
                       activeStage.add(sd);   
                        }
                    }
                Database.update(activeStage,false);
                        }catch(Exception ex){
                      ErrorLog.insertErrorLog(CNAME,MNAME,ex.getMessage(), ex.getLineNumber()); 
                    }
                }    
                global void finish(Database.BatchableContext bc){
                    
                }    
            }