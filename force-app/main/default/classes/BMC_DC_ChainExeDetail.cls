/**
@Author Accenture
@name: BMC_DC_ChainExeDetail
@CreateDate  05/08/2019
@Description Includes methods for Email body table data Functionality
@Version <1.0>
*/
public class BMC_DC_ChainExeDetail {
    public Id accountId {get;set;}
    public String accName;
    public Integer mandateValue;
    public Integer gapValue;
    public Decimal gapperValue; 
    public Integer totalmandate;
    public Integer totalgap;
    public String brandPackage;
    public Decimal gapPercent; 
    public list<brandPackTableData> lstWapperData;
    Public Decimal mandateVal;
    Public String key;
    Public Decimal scaleGapValue;
    Public Decimal scaleMandateValue;
    /**
*  @description: Returns the details of Distributor level data. 
*  @name: getreturnData
*  @param: accountId: Distributor Account Id
*  @return: wrapDistributorTable - Returns Distributor level Mandate and Gap records
*/    
    public wrapDistributorTable  getreturnData(){
        accName = [Select Id, name from Account where id =: accountId].Name;
        AggregateResult[] groupedResults = [SELECT SUM(BMC_Mandate_Count__c)caRec FROM BMC_Chain_Activity_Detail__c where BMC_Chain_Activity_ID__r.RecordType.Name = 'Chain Mandate' and BMC_Distributor_Account__c=:accountId  and BMC_Status__c  ='Final'and  BMC_Gap_Calculation_Status__c = 'Current'];
        if(groupedResults[0].get('caRec')==null){
            scaleMandateValue= 0;
        }
        else{
            Decimal mandateValueDeci = (Decimal)(groupedResults[0].get('caRec'));
            scaleMandateValue = mandateValueDeci.setScale(0,RoundingMode.HALF_UP);
        }
        mandateValue = Integer.valueOf(scaleMandateValue);
        
        AggregateResult[] groupedResults1=[SELECT SUM(BMC_Gap_Count__c)Bgc FROM BMC_Chain_Activity_Detail__c where BMC_Chain_Activity_ID__r.RecordType.Name = 'Chain Mandate' and  BMC_Distributor_Account__c=:accountId  and BMC_Status__c  ='Final'and  BMC_Gap_Calculation_Status__c = 'Current' and BMC_Mandate_Gap_Flag__c = 'Y' and BMC_Not_Sold_Re_Sold__c!='NA'];
        if(groupedResults1[0].get('Bgc')==null){
            scaleGapValue= 0;
        }
        else{
            Decimal gapValueDeci = (Decimal)(groupedResults1[0].get('Bgc'));
            scaleGapValue = gapValueDeci.setScale(0,RoundingMode.HALF_UP);
        }
        gapValue = Integer.valueOf(scaleGapValue);
        
        if(gapValue>0){
            gapperValue = decimal.valueof((gapValue * 100)/mandateValue);
        }
        else{
            gapperValue = 0;
        }
        wrapDistributorTable returnDisData = new wrapDistributorTable(accName,mandateValue,gapValue,gapperValue);
        
        return returnDisData;
    }
    public  class wrapDistributorTable{
        public String accountName{get;set;}
        public Integer mandate{get;set;}
        public Integer gap{get;set;}
        public Decimal gapPer{get;set;}
        public wrapDistributorTable(String accountName, Integer mandate, Integer gap , Decimal gapPer){
            this.accountName = accountName;
            this.mandate = mandate;
            this.gap = gap;
            this.gapPer = gapPer;
        }
    }
    /**
*  @description: Returns the details on Top Brand Package with gaps for a Distributor
*  @name: getreturnTable1
*  @param: accountId: Distributor Account Id
*  @return: brandPackTableData - Returns Distributor level Top Brand Packages with Gap records
*/ 
    public List<brandPackTableData> getreturnTable1(){
        List<brandPackTableData> lstWapperData = new  List<brandPackTableData>();
        Map<String,brandPackTableData> allGappackage = new  Map<String,brandPackTableData> ();
        Map<Integer,brandPackTableData> mandatePackage = new  Map<Integer,brandPackTableData> ();
        List<BMC_Chain_Activity_Detail__c> bpList = [SELECT Name, BMC_Brand__c,BMC_Not_Sold_Re_Sold__c, BMC_Package__c , BMC_Status__c ,BMC_Gap_Calculation_Status__c ,BMC_Mandate_Gap_Flag__c  FROM BMC_Chain_Activity_Detail__c where BMC_Chain_Activity_ID__r.RecordType.Name = 'Chain Mandate' and BMC_Distributor_Account__c =: accountId and BMC_Status__c  ='Final' and  BMC_Gap_Calculation_Status__c = 'Current'  ];
        for(BMC_Chain_Activity_Detail__c bp : bpList){  
            if(allGappackage.containsKey(bp.BMC_Brand__c+bp.BMC_Package__c)){
                brandPackTableData table = allGappackage.get(bp.BMC_Brand__c+bp.BMC_Package__c);
                table.totalmandate = table.totalmandate +1 ;
                if(bp.BMC_Mandate_Gap_Flag__c == 'Y' && bp.BMC_Not_Sold_Re_Sold__c!='NA'){
                    table.totalgap = table.totalgap +1 ;
                }
                if(table.totalgap>0){
                    Decimal gapBp= (decimal.valueof(table.totalgap)*100)/decimal.valueof(table.totalmandate);
                    table.gapPercent = gapBp.setScale(0,RoundingMode.HALF_UP);
                }
                else{
                    table.gapPercent = 0;
                }
                allGappackage.put(bp.BMC_Brand__c+bp.BMC_Package__c,table );
            }
            else{
                if(bp.BMC_Mandate_Gap_Flag__c == 'Y' && bp.BMC_Not_Sold_Re_Sold__c!='NA'){
                    allGappackage.put(bp.BMC_Brand__c+bp.BMC_Package__c,new brandPackTableData(bp.BMC_Brand__c+Constants.BLANK_WITHSPACE+bp.BMC_Package__c,1,1,100));
                }
                else {
                    allGappackage.put(bp.BMC_Brand__c+bp.BMC_Package__c,new brandPackTableData(bp.BMC_Brand__c+Constants.BLANK_WITHSPACE+bp.BMC_Package__c,1,0,0) );
                }
            }
        }
        for(brandPackTableData gapValue: allGappackage.values()){
            if(gapValue.totalgap != 0){
                lstWapperData.add(gapValue);
            }
        }
        lstWapperData.sort();
        return lstWapperData;
    }
    public class brandPackTableData implements Comparable {
        public Integer totalmandate{get;set;}
        public Integer totalgap{get;set;}
        public string brandPackage{get;set;}
        public decimal gapPercent{get;set;}
        public brandPackTableData(String brandPackage , Integer totalmandate, Integer totalgap, Decimal gapPercent){
            this.brandPackage = brandPackage;
            this.totalmandate = totalmandate;
            this.totalgap = totalgap;
            this.gapPercent = gapPercent;
        }
        public brandPackTableData() {}
        public Integer compareTo(Object ObjToCompare) {
            String gap = String.valueOf(totalgap);
            brandPackTableData that = (brandPackTableData)ObjToCompare;
            if (totalgap == that.totalgap) return 0; // extremely unlikely
            return (this.totalgap < that.totalgap) ? 1 : -1;
        }
    }
    
    /**
*  @description: Returns the details of Chain Execution for a Distributor
*  @name: getactivityRet
*  @param: accountId: Distributor Account Id
*  @return: cdList - Returns Chain Execution records of the Distributor
*/ 
    public list<BMC_Chain_Activity_Detail__c> getactivityRet(){
        DateTime dt=DateTime.newInstance(date.today(), Time.newInstance(0, 0, 0, 0));
        String day=dt.format('EEE');
        Date Monday;
        Date Sunday;
        map<String, list<Integer>> myMap1 = new map<String, list<Integer>>
        {'Mon' => new list<Integer> {0, 6},
            'Tue' => new list<Integer> {6, 12},
                'Wed' => new list<Integer> {5, 11},
                    'Thu' => new list<Integer> {4, 10},
                        'Fri' => new list<Integer> {3, 9},
                            'Sat' => new list<Integer> {2, 8},
                                'Sun' => new list<Integer> {1, 7}
        };
            list<Integer> val= myMap1.get(day) ;
        Monday=date.today()+val[0];
        Sunday=date.today()+val[1];
        
        List<BMC_Chain_Activity_Detail__c> cdList = [SELECT Name, BMC_Status__c , BMC_Distributor_Account__c, BMC_Mandate_Type__c, BMC_Gap_Calculation_Status__c, BMC_Chain_Activity_ID__c, BMC_Chain_Parent_Account__r.Name, BMC_All_Brand_Packages__c, BMC_Elements__c, BMC_Start_Date__c, BMC_End_Date__c, BMC_Total_Outlets_Selected__c, BMC_Activity_ID_Series_Number__c  FROM BMC_Chain_Activity_Detail__c                                                    
                                                     where BMC_Distributor_Account__c =:accountId  
                                                     and BMC_Status__c ='Final' 
                                                     and BMC_Activity_ID_Series_Number__c=1 
                                                     and BMC_Mandate_Type__c='Activity'
                                                     and BMC_Start_Date__c>=: Monday
                                                     and BMC_Start_Date__c<=: Sunday
                                                     and (BMC_Gap_Calculation_Status__c  = 'Current'or BMC_Gap_Calculation_Status__c  ='Future') order by BMC_Total_Outlets_Selected__c DESC];        
        
        
        return cdList;
    }
    
}