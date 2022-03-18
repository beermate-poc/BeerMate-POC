({
    /*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   returns intial account information, sets contact information, sets dashboard attributes, and filters dashboards based on craft parameters
	History
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Nick Serafin     Initial Creation
	------------------------------------------------------------*/
    getAccountInformation: function (helper, component, event, getAccountRec) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getRelatedAccount");
                var recordId = component.get('v.recordId');
                action.setParams({ accountId: getAccountRec });
                action.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        var account = data.getReturnValue();
                        if ((account.RecordType.Name == 'Off-Premise') || (account.RecordType.Name == 'Chain Off-Premise')) {
                            component.set("v.isOffPrem", true);
                        } else {
                            component.set("v.isOffPrem", false);
                        }
                        component.set("v.accountRec", account);
                        component.set("v.smpFlag", account.SMPFlag__c);
                        var consumerURL = '';
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            consumerURL = $A.get("$Label.c.Consumption_Dashboard") + account.OutletCd__c;
                        } else {
                            consumerURL = $A.get("$Label.c.Consumption_Dashboard_TableauApp") + account.OutletCd__c;
                        }
                        component.set("v.consumerDashboard", consumerURL);
                        if (account.Key_Contact__c != null) {
                            if(account.Contacts != null){
                                for (var j = 0; j < account.Contacts.length; j++) {
                                    if (account.Key_Contact__c == account.Contacts[j].Id) {
                                        component.set("v.contactRec", account.Contacts[j]);
                                        component.set("v.contactMeetingRec", account.Contacts[j].Name);
                                        component.set("v.contactId", account.Contacts[j].Id);
                                        break;
                                    }
                                }
                            }
                        }
                        var craftBrandFamilyAction = component.get("c.getCraftBrandFamilyUserInfo");
                        craftBrandFamilyAction.setCallback(this, function (data) {
                            if (data.getState() === "SUCCESS") {
                                var userObj = data.getReturnValue();
                                var craftBrandFamilyURL = '';
                                if (userObj != null) {
                                    craftBrandFamilyURL = '';
                                    if (userObj.Craft_Brand_Family__c == 'TENTH & BLAKE') {
                                        craftBrandFamilyURL = $A.get("$Label.c.Tenth_Blake_Flag");
                                    }
                                    if (typeof userObj.Craft_Brand_Family__c != 'undefined' && userObj.Craft_Brand_Family__c != null && userObj.Craft_Brand_Family__c != 'TENTH & BLAKE') {
                                        craftBrandFamilyURL = $A.get("$Label.c.Trademark_Brand_Family_Label") + userObj.Craft_Brand_Family__c.replace(/ /g, '%20');
                                    }
                                }
var onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Mobile") + account.TeraAccountId__c + craftBrandFamilyURL;
var offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Mobile") + account.TeraAccountId__c + craftBrandFamilyURL;
component.set("v.onPremiseOutletDashboard", onPremiseOutletURL);
component.set("v.offPremiseOutletDashboard", offPremiseOutletURL);
//var onPremiseOutletURL = '';
//var offPremiseOutletURL = '';
//if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
//onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Desktop") + account.TeraAccountId__c + craftBrandFamilyURL;
//offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Desktop") + account.TeraAccountId__c + craftBrandFamilyURL;
//} else if($A.get("$Browser.formFactor") == $A.get("$Label.c.TABLET")){
//onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Mobile_Tablet_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
//offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Mobile_Tablet_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
//} else {
//onPremiseOutletURL = $A.get("$Label.c.On_Prem_Num_Mobile_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
//offPremiseOutletURL = $A.get("$Label.c.Off_Prem_Num_Mobile_TableauApp") + account.TeraAccountId__c + craftBrandFamilyURL;
//}
//component.set("v.onPremiseOutletDashboard", onPremiseOutletURL);
//component.set("v.offPremiseOutletDashboard", offPremiseOutletURL);
                            } else {
                                var errors = data.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        console.error("Error message: " + 
                                                      errors[0].message);
                                    }
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                    }
                                } else {
                                    console.error("Unknown error");
                                }
                            }
                        });
                        $A.enqueueAction(craftBrandFamilyAction);
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                              errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Jacqueline Passehl
	Company:       Slalom, LLC
	Description:   Calls Apex Method to get currently logged in user's role
	<Date>       <Authors Name>     <Brief Description of Change>
	4/10/2018    Jacqueline Passehl     Initial Creation
	------------------------------------------------------------*/
    getCurrentUserRole : function(component,event,helper){
        var action = component.get("c.getUserRole");
        action.setCallback(this, function(a) {
            var state = a.getState();
            if (state === "SUCCESS") {
                component.set("v.userRole",a.getReturnValue());
            } else {
                var errors = a.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.error("Error message: " + 
                                      errors[0].message);
                    }
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                } else {
                    console.error("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
        
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   Validates the list of objectives related to the call log for businesss requirements
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	1/23/2018    Nick Serafin       Updated method to work with LockerService
	------------------------------------------------------------*/
    validatePage : function(component, event){
        try{
            var errorsFound = false;
            var isOffPrem = component.get('v.isOffPrem');
            var obj = component.find('obj');
            var recordId = 0;
            var name = [].concat(obj.get("v.objectives"));
            var today = new Date(); 
            name.forEach(function(c){
                recordId++;
                if(c){
                 //   alert('Currenttime###'+c.Currenttime);
                    var subTypes = [].concat(obj.find("subType"));
                    subTypes.forEach(function(sub){
                        if(sub.get("v.id") == recordId - 1){
                            var subTypeValues= sub.get("v.subTypeValues");
                            if(subTypeValues.length > 0){
                                if((!sub.get("v.selectedSubType")) && (c.Status__c == 'Executed' || c.Status__c == 'Committed')){
                                    /*if($A.get("$Browser.formFactor") == "DESKTOP"){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Sub_Type_Error") + ' ' + c.Name, 'warning');
                                    } else {*/
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Sub_Type_Error") + ' ' + c.Name, 'slds-theme_warning');
                                    //}
                                    errorsFound = true;
                                }
                            }
                        }
                    },this);
                    // MC-1761:Checks if suggested delivery date is not equal to null and greater than or equal to today.
                    if(c.RecordType.Name == 'Display' && c.Status__c == 'Committed'){
                        var dDate = [].concat(obj.find("displaydt"));
                        dDate.forEach(function(engageDate){
                            if(engageDate.get("v.id") == recordId - 1){
                                var date = engageDate.get("v.value");
                                var formatteddate= new Date(date);
                                if(!date){
                                    /*if($A.get("$Browser.formFactor") == "DESKTOP"){
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Suggested_Delivery_Date_Required_For")+ ' ' + c.Name, 'warning');
                                    } else {*/
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Suggested_Delivery_Date_Required_For")+ ' ' + c.Name, 'slds-theme_warning');
                                    //}
                                    errorsFound = true;
                                }  
                                else if (formatteddate < today) {
                                    /*if($A.get("$Browser.formFactor") == "DESKTOP"){                                      
                                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Suggested_Delivery_Date_For")+ ' ' + c.Name, 'warning');
                                    } else {*/
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Suggested_Delivery_Date_For")+ ' ' + c.Name, 'slds-theme_warning');
                                   // }
                                    errorsFound = true;
                                }                
                            }
                        }, this);
                        
                    }
                    if(c.RecordType.Name != 'Space' && c.RecordType.Name != 'Placement' && c.RecordType.Name != 'Engagement'){
                        if(c.Brands__c == null || c.Brands__c == ''){
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Brand_Error") + ' ' + c.Name, 'warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Brand_Error") + ' ' + c.Name, 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                    }
                    if( c.RecordType.Name == 'Placement'){
                        if((c.Brands__c == null || c.Brands__c == '') && (c.BMC_Product_Level__c=='Brand Package' ) ){
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Brand_Error") + ' ' + c.Name, 'warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Brand_Error") + ' ' + c.Name, 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                    }
                   
                    
                    if(c.RecordType.Name != 'Space' && c.RecordType.Name != 'Sampling' && c.RecordType.Name != 'Engagement'){
                        if(c.MC_Product__c == null || c.MC_Product__c == ''){
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Package_Error") + ' ' + c.Name, 'Warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Package_Error") + ' ' + c.Name, 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                    }
                   /* if((c.RecordType.Name == 'Placement' || c.RecordType.Name == 'Display') && (c.Status__c == 'Declined')){
                        alert(c.Product_Quantity__c);
                        //c.Product_Quantity__c = null ;
                        c.Product_Quantity__c = 0 ;
                        //component.set("c.Product_Quantity__c", "0");
                        if(component.find("obj")){
                        component.set("v.objectives.Product_Quantity__c", "0");
                    }
                        alert(c.Product_Quantity__c);
                        
                    }
                    alert(c.Product_Quantity__c);*/
                   /* if((c.RecordType.Name == 'Placement' || c.RecordType.Name == 'Display') && (c.Status__c != 'Declined')){
                        if(c.Product_Quantity__c == null || c.Product_Quantity__c == '' || c.Product_Quantity__c == '0'){
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Quantity_Error") + ' ' + c.Name, 'Warning');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Quantity_Error") + ' ' + c.Name, 'slds-theme_warning');
                            }
                            errorsFound = true;
                        }
                    }*/
                    if(c.Status__c == 'Declined'){
                        if(c.Declined_Reason__c == null || c.Declined_Reason__c == 'None'){
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Decline_Error") + ' ' + c.Name, 'Warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Decline_Error") + ' ' + c.Name, 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                    } else {
                        c.Declined_Reason__c = null;
                    }
                    if(c.RecordType.Name == 'Feature'){
                        if (c.Name == null || c.Name == '') {
                           /* if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Feature_Name_Error"), 'warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Feature_Name_Error"), 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                       if ((c.Start_Time__c == null || c.Start_Time__c == '')&&(c.End_Time__c == null || c.End_Time__c == '')&&(c.Status__c == 'Committed' || c.Status__c == 'Executed')) {
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Date_Error")+ ' ' + c.Name, 'warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Date_Error")+ ' ' + c.Name, 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                    }
                    if(c.RecordType.Name == 'Feature' && !isOffPrem){
                        if (!c.Aluminium_Pint_Package__c && !c.Bottle_Package__c && !c.Can_Package__c && !c.Draft_Package__c) {
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Feature_Package_Error") + ' ' + c.Name, 'warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Feature_Package_Error") + ' ' + c.Name, 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                    }
                    if(c.RecordType.Name == 'Engagement'){
                        if(c.Name == null || c.Name == ''){
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Name_Error"), 'Warning');
                            } else {*/
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Name_Error"), 'slds-theme_warning');
                            //}
                            errorsFound = true;
                        }
                        if(c.Status__c == 'Committed' || c.Status__c == 'Executed'){
                            var eDate = [].concat(obj.find("engageDt"));
                            eDate.forEach(function(engageDate){
                                if(engageDate.get("v.id") == recordId - 1){
                                    var date = engageDate.get("v.value");
                                    if(!date){
                                        /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Date_Error") + ' ' + c.Name, 'warning');
                                        } else {*/
                                            this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Date_Error") + ' ' + c.Name, 'slds-theme_warning');
                                        //}
                                        errorsFound = true;
                                    }
                                }
                            }, this);
                                      if(c.Brands__c == null || c.Brands__c == ''){
                                /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Brand_Error") + ' ' + c.Name, 'warning');
                                } else {*/
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Brand_Error") + ' ' + c.Name, 'slds-theme_warning');
                                //}
                                errorsFound = true;  
                            }
                          
                            if ((c.Consumer_or_Waitstaff__c != 'Consumer') && (c.Consumer_or_Waitstaff__c != 'Waitstaff')
                               && (c.Consumer_or_Waitstaff__c != 'Sampling')) {
                                /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Type_Error") + ' ' + c.Name, 'warning');
                                } else {*/
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Engagement_Type_Error") + ' ' + c.Name, 'slds-theme_warning');
                                //}
                                errorsFound = true;
                            }
                                                   }
                        if(c.Status__c == 'Executed'){
                            if ((c.Executed_By__c != 'Individual') && (c.Executed_By__c != 'Agency') && (c.Executed_By__c != 'Both')) {
                                /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Executed_Error") + ' ' + c.Name, 'warning');
                                } else {*/
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Call_Log_Executed_Error") + ' ' + c.Name, 'slds-theme_warning');
                                //}
                                errorsFound = true;
                            }
                            /* if ((c.Number_of_People_Engaged__c == null || c.Number_of_People_Engaged__c == '')
                                && c.Consumer_or_Waitstaff__c != 'Sampling') {
                                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Dollars_Spent") + ' ' + c.Name, 'warning');
                                } else {
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Number_of_People_Engaged") + ' ' +'for'+' ' + c.Name, 'slds-theme_warning');
                                }
                                errorsFound = true;
                            }*/
                            
                            if(c.Consumer_or_Waitstaff__c == 'Sampling'){
                            if (c.Number_of_Consumers_Sampled__c == null || c.Number_of_Consumers_Sampled__c == '') {
                              /* if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.No_Of_Consumer_Sampled") + ' ' + c.Name, 'warning');
                                } else {*/
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.No_Of_Consumer_Sampled") + ' '+'for'+' ' + c.Name, 'slds-theme_warning');
                               //}
                                errorsFound = true;
                            }
                              if (c.Sampling__c == null || c.Sampling__c == '') {
                                /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.Dollars_Spent") + ' ' + c.Name, 'warning');
                                } else {*/
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Warning"), $A.get("$Label.c.Dollars_Spent") + ' ' +'for'+' ' + c.Name, 'slds-theme_warning');
                               // }
                                errorsFound = true;
                            }
                                
                        }
                    
                        }
                       
                    }
                }
            },this)
            
            if(!errorsFound) {
                this.updateObjectives(component, event);
                this.saveCallLog(component, event);
            }
        } catch (e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   calls method on the Objectives component to save updates to the list of objectives on the call log
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    updateObjectives: function (component, event) {
        try{
            var com = component.find("obj");
            com.updateObjectiveMethod();
            //this.saveSummary(component, event, false);
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   saves meeting summary on the call log
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    saveSummary : function(component, event, update, helper,sumTextAreaValue) {
        try{
            if(navigator.onLine){
                        var callLog = component.get("v.callLogRec");
                        var callloguser = component.get("v.callLogsforUser");
                        var action = component.get("c.saveMeetingSummary");
                        action.setParams({ callLog : callLog });
                        action.setCallback(this, function(response) {
                            if (response.getState() === "SUCCESS") {
                                if(update){
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Call_Log_Summary_Success_Msg"), 'success', '5000');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Success"),$A.get("$Label.c.Call_Log_Summary_Success_Msg"), 'slds-theme_success');
                                    }
                                }else{
                                    console.error('Summary Text Field is not Valid');
                                }
                            } else {
                                var errors = response.getError();
                                if (errors) {
                                    if (errors[0] && errors[0].message) {
                                        console.error("Error message: " + 
                                                      errors[0].message);
                                    }
                                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                    } else {
                                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                    }
                                } else {
                                    console.error("Unknown error");
                                    
                                }
                            }
                        });
                        $A.enqueueAction(action);
                    
                
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   toggles the objective dropdown open or closed
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    toggleObjectiveDropdown : function(component, event, helper) {
        try{
            var ddDiv = component.find('dropdownMenu');
            $A.util.toggleClass(ddDiv,'slds-is-open');
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   gets the correct call log and returns information from the call log record to attributes that are displayed on the CallLog component
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    getCallLog: function (helper, component, event, getCallLogId, getAccountRec) {
        try{
            if(navigator.onLine){
                var actionForOwner = component.get("c.getOwnerAccount");
                actionForOwner.setParams({
                    accountId: getAccountRec
                });
                actionForOwner.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var returnBooleanValue = data.getReturnValue();
                        if (returnBooleanValue) {
                            var action = component.get("c.getCallLog");
                            action.setParams({ callLogId : getCallLogId, accountId : getAccountRec });
                            action.setCallback(this, function (data) {
                                if (data.getState() === "SUCCESS") {
                                    var callLogMap = data.getReturnValue();
                                    var callLog = callLogMap['current'];
                                    var futureCallLog = callLogMap['future'];
                                    if(futureCallLog != null && futureCallLog.Id == callLog.Id){
                                        futureCallLog = null;
                                    }
                                    component.set("v.callLogRec", callLog);
                                    if (callLog) {
                                        if (futureCallLog != null && futureCallLog.KeyContact__c != null) {
                                            component.set("v.contactMeetingRec", futureCallLog.KeyContact__r.Name);
                                            component.set("v.contactId", futureCallLog.KeyContact__c);
                                        } else if(callLog.Upcoming_Contact__c != null) {
                                            component.set("v.contactMeetingRec", callLog.Upcoming_Contact__r.Name);
                                            component.set("v.contactId", callLog.Upcoming_Contact__c);
                                        }
                                        if(callLog.KeyContact__c != null){
                                            component.set("v.keyContactName", callLog.KeyContact__r.Name);
                                            component.set("v.keyContactFirstName", callLog.KeyContact__r.FirstName);
                                        }
                                        else if (futureCallLog != null && futureCallLog.Account__r.Key_Contact__c != null) {
                                            component.set("v.keyContactName", callLog.Account__r.Key_Contact__r.Name);
                                            component.set("v.keyContactFirstName", callLog.Account__r.Key_Contact__r.FirstName);
                                        }
                                        
                                        if(callLog.Upcoming_Call_Date__c != null){
                                            var d  = callLog.Upcoming_Call_Date__c;
                                            component.set("v.callDate", d);
                                        } else if (callLog.Suggested_Call_Date__c != null) {
                                            component.set("v.callDate", callLog.Suggested_Call_Date__c);
                                        } else{
                                            var today = new Date();
                                            var formateDate = $A.localizationService.formatDate(today);
                                            component.set("v.callDate", formateDate);
                                        }
                                    }
                                } else {
                                    var errors = data.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                          errors[0].message);
                                        }
                                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                        } else {
                                            this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                        }
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                                var objectiveAction = component.get("c.getInitialObjectiveRecords");
                                objectiveAction.setParams({accountId : getAccountRec, callLogId : getCallLogId});
                                objectiveAction.setCallback(this, function (data) {
                                    if (data.getState() == "SUCCESS") {
                                        component.set("v.objectiveRecordsToCompare", data.getReturnValue());
                                    
                                    }
                                    else {
                                        var errors = data.getError();
                                        if (errors) {
                                            if (errors[0] && errors[0].message) {
                                                console.error("Error message: " + 
                                                              errors[0].message);
                                            }
                                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                            } else {
                                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                            }
                                        } else {
                                            console.error("Unknown error");
                                        }
                                    }
                                });
                                $A.enqueueAction(objectiveAction);
                            });
                            $A.enqueueAction(action);
                        } else {
                            var action = component.get("c.getCallLog");
                            action.setParams({
                                callLogId: getCallLogId,
                                accountId: getAccountRec
                            });
                            action.setCallback(this, function(data) {
                                if (data.getState() === "SUCCESS") {
                                    var callLogMap = data.getReturnValue();
                                    var callLog = callLogMap['current'];
                                    component.set("v.callLogRec", callLog);
                                    if (callLog) {
                                        if (callLog.KeyContact__c != null) {
                                            component.set("v.keyContactName", callLog.KeyContact__r.Name);
                                            component.set("v.keyContactFirstName", callLog.KeyContact__r.FirstName);
                                        }
                                    }
                                    var objectiveAction = component.get("c.getInitialObjectiveRecords");
                                    objectiveAction.setParams({accountId : getAccountRec, callLogId : getCallLogId});
                                    objectiveAction.setCallback(this, function (data) {
                                        if (data.getState() === "SUCCESS") {
                                            component.set("v.objectiveRecordsToCompare", data.getReturnValue());
                                        } else {
                                            var errors = data.getError();
                                            if (errors) {
                                                if (errors[0] && errors[0].message) {
                                                    console.error("Error message: " + 
                                                                  errors[0].message);
                                                }
                                                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                                } else {
                                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                                }
                                            } else {
                                                console.error("Unknown error");
                                            }
                                        }
                                    });
                                    $A.enqueueAction(objectiveAction);
                                } else {
                                    var errors = data.getError();
                                    if (errors) {
                                        if (errors[0] && errors[0].message) {
                                            console.error("Error message: " + 
                                                          errors[0].message);
                                        }
                                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                            this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                        } else {
                                            this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                        }
                                    } else {
                                        console.error("Unknown error");
                                    }
                                }
                            });
                            $A.enqueueAction(action);
                        }
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                              errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(actionForOwner);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   gets selected meeting contact information
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Nick Serafin     Initial Creation
	------------------------------------------------------------*/
    getMeetingContact: function (component, event) {
        try{
            if(navigator.onLine){
                var action = component.get("c.getMeetingContact");
                action.setParams({ contactId: component.get("v.contactId") });
                action.setCallback(this, function (data) {
                    if (data.getState() === "SUCCESS") {
                        var contact = data.getReturnValue();
                        component.set("v.contactMeetingRec", contact.Name);
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                              errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   saves call log information when the save and end button is clicked.  Saves updates to the objectives in the meeting summary
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    saveCallLog: function (component, event) {
        try{
            if(navigator.onLine){
                if(component.get("v.accountRec") && component.get("v.callLogRec")){
                    var spinner = component.find("spinner");
                    $A.util.removeClass(spinner, "slds-hide");
                    var action = component.get("c.saveCallLog");
                    action.setParams({
                        "accountId": component.get("v.accountRec").Id,
                        "contactId": component.get("v.contactId"),
                        "callLogId": component.get("v.callLogRec").Id,
                        "meetingDate": component.get("v.callDate"),
                        "endCallLog": true,
                        "objectiveRecordsToCompare": component.get("v.objectiveRecordsToCompare"),
                        "offPremise": component.get("v.isOffPrem")
                    });
                    action.setCallback(this, function (response) {
                        if (response.getState() === "SUCCESS") {
                            $A.util.addClass(spinner, "slds-hide");
                            this.displayToast($A.get("$Label.c.Success"), $A.get("$Label.c.Call_Log_Success_Msg"), 'success', '5000');
                            /*if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
								var navEvt = $A.get("e.force:navigateToSObject");
								navEvt.setParams({
									"recordId": component.get("v.accountRec").Id,
									"slideDevName": "related"
								});
								navEvt.fire();
							} else {
								var dismissActionPanel = $A.get("e.force:closeQuickAction");
								dismissActionPanel.fire();
							}*/
                            
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            this.NavigatetoGuidedSelling(component, event, component.get("v.accountRec").Id,component.get("v.contactId"),component.get("v.callLogRec").Id,component.get("v.callDate"),true,component.get("v.objectiveRecordsToCompare"),component.get("v.isOffPrem") );
                            component.set("v.showObjView", false); 
                            component.set("v.showCallLog", false);
                            }else{
                            component.set("v.showCallLogMob",false);
                            component.set("v.showObjView", false); 
                            component.set("v.showCallLog", false);
                            }
                           //component.set("v.showOverallsummary",true);
                            
                        } else if (response.getState() === "ERROR") {
                            $A.util.addClass(spinner, "slds-hide");
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.error("Error message: " + 
                                                  errors[0].message);
                                }
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                console.error("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                }
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   displays toast for dekstop
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017    Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    displayToast: function (title, message, type, duration) {
        try{
            var toast = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toast) {
                //fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                toast.setParams(toastParams);
                toast.fire();
            } else {
                // otherwise throw an alert
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
	Author:        Nick Serafin
	Company:       Slalom, LLC
	Description:   displays toast for mobile due to neccessary workaround for known issue
	<Date>      <Authors Name>     <Brief Description of Change>
	11/07/2017    Nick Serafin     Initial Creation
	------------------------------------------------------------*/
    displayToastMobileCallLog: function(component, showToast, title, message, type){
        try{
            if(showToast){
                component.set("v.showToast", true);
            }
            component.set("v.toastType", type);
            component.set("v.toastTitle", title);
            component.set("v.toastMsg", message);
            setTimeout(function(){
                component.set("v.showToast", false);
                component.set("v.showToastObjective", false);
                component.set("v.toastTitle", "");
                component.set("v.toastType", "");
                component.set("v.toastMsg", "");
            }, 3000);
        } catch(e){
            console.error(e);
        }
    },
    /*------------------------------------------------------------
	Author:        Alec Klein
	Company:       Slalom, LLC
	Description:   saves users geolcoation on start and end of a call log
	<Date>      <Authors Name>     <Brief Description of Change>
	7/07/2017     Alec Klein     Initial Creation
	------------------------------------------------------------*/
    recordCallLogGeolocation: function(component, helper, startOrEnd){
        try{
            if(navigator.onLine){
                //If the user does not have geolocation enabled, this code will not run
                if (navigator.geolocation) {
                    if(navigator.geolocation.getCurrentPosition){
                        navigator.geolocation.getCurrentPosition(function(e) {
                            var action = component.get("c.setCallLogGeolocation");
                            if(action){
                                action.setParams({
                                    "currLat": e.coords.latitude,
                                    "currLong": e.coords.longitude,
                                    "callLogId": component.get("v.callLogId"),
                                    "startOrEnd": startOrEnd
                                });
                                action.setCallback(this, function (response) {
                                    if (response.getState() === "ERROR") {
                                        var errors = response.getError();
                                        if (errors) {
                                            if (errors[0] && errors[0].message) {
                                                console.error("Error message: " + 
                                                              errors[0].message);
                                            }
                                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                            } else {
                                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                            }
                                        } else {
                                            console.error("Unknown error");
                                        }
                                    }
                                });
                                $A.enqueueAction(action);
                            }
                        }, function(error) {
                            console.error('(GPS Error#'+error.code+') '+error.message);
                        }, {'enableHighAccuracy': false, 'timeout': 5000, 'maximumAge':0});
                    }
                }
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Call_Log_Geolocation_Error"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   saves meeting info for the call log
	<Date>      <Authors Name>     <Brief Description of Change>
	7/07/2017     Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    saveMeetingInfo: function(component, event){
        try{
            if(navigator.onLine){
                //MC-1819  Active Flag on Contact prevents associated Account page from loading
                if($A.util.isEmpty(component.get("v.contactId"))){
                    var spinner = component.find("spinner");
                    $A.util.removeClass(spinner, "slds-hide");
                }
                if(component.get("v.accountRec") != null && component.get("v.callLogRec") != null && component.get("v.callDate") != null){
                    var action = component.get("c.saveCallLog");
                    action.setParams({
                        "accountId": component.get("v.accountRec").Id,
                        "contactId": component.get("v.contactId"),
                        "callLogId": component.get("v.callLogRec").Id,
                        "meetingDate": component.get("v.callDate"),
                        "endCallLog": false,
                        "objectiveRecordsToCompare": component.get("v.objectiveRecordsToCompare"),
                        "offPremise": component.get("v.isOffPrem")
                    });
                    action.setCallback(this, function (response) {
                        if (response.getState() === "SUCCESS") {
                            $A.util.addClass(spinner, "slds-hide");
                        } else {
                            $A.util.addClass(spinner, "slds-hide");
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.error("Error message: " + 
                                                  errors[0].message);
                                }
                                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                } else {
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                }
                            } else {
                                console.error("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                }
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   returns a boolean based on if the logged in user owns the account the call log is started on
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017     Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    getCurrentOwner: function(helper, component, event, getAccountRec) {
        try{
            if(navigator.onLine){
                var actionForOwner = component.get("c.getOwnerAccount");
                actionForOwner.setParams({
                    accountId: getAccountRec
                });
                actionForOwner.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var returnBooleanValue = data.getReturnValue();
                        if (returnBooleanValue) {
                            component.set("v.showMeetingDate", true);
                        }
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                              errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(actionForOwner);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
    },
    /*------------------------------------------------------------
	Author:        Bryant Daniels
	Company:       Slalom, LLC
	Description:   starts the call and calls the initial methods to set up the call log information
	<Date>      <Authors Name>     <Brief Description of Change>
	5/07/2017     Bryant Daniels     Initial Creation
	------------------------------------------------------------*/
    startCall: function (component, event, helper){
        try{
            if(navigator.onLine){
                var desktopCall = component.get("v.desktopCall");
                var spinner = component.find("spinner");
                $A.util.removeClass(spinner, "slds-hide");
                $A.util.addClass(spinner, "slds-show");
                component.set('v.isDisabled', true);
                var recordId = component.get('v.recordId');
                var callLogId = '';
                var action = component.get("c.startACall");
                action.setParams({ accountId : recordId });
                action.setCallback(this, function(data) {
                    if (data.getState() === "SUCCESS") {
                        var callLog = data.getReturnValue();
                        callLogId = callLog.Id;
                        component.set("v.callLogId", callLogId);
                        var recordId = component.get('v.recordId');
                        var getCallLogId = callLogId;
                        var getAccountRec = recordId;
                        if (!getAccountRec) {
                            this.displayToast($A.get("$Label.c.Account_Information_Missing"), $A.get("$Label.c.No_Account_Error"), 'error', '5000');
                            return;
                        } else {
                            if(!component.get("v.callLogFromGS")){
                                //this.NavigatetoGuidedSelling(component, event, getCallLogId, getAccountRec);
                               this.NavigatetoGuidedSelling(component, event,recordId,component.get("v.contactId"),getCallLogId,component.get("v.callDate"),true,component.get("v.objectiveRecordsToCompare"),component.get("v.isOffPrem") );
                                this.recordCallLogGeolocation(component, helper, 'start');

                            }
                            this.getCurrentOwner(helper, component, event, getAccountRec);
                            this.getCallLog(helper, component, event, getCallLogId, getAccountRec);                            
                        }
                        component.set("v.showCallLog", true);
                        component.set("v.showObjView", true);
                        if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                            var spinner = component.find("spinner");
                            $A.util.removeClass(spinner, "slds-hide");
                            $A.util.addClass(spinner, "slds-show");
                        }
                    } else {
                        var errors = data.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.error("Error message: " + 
                                              errors[0].message);
                            }
                            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                            } else {
                                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                            }
                        } else {
                            console.error("Unknown error");
                        }
                    }
                });
                $A.enqueueAction(action);
            } else {
                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                } else {
                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                }
            }
        } catch(e){
            console.error(e);
            if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
            } else {
                this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
            }
        }
        
    },
    
    NavigatetoGuidedSelling : function (component, event,getAccountRec,ContactId, getCallLogId,callDate,endCall,ObjectiveRecs,offPrem){
        var desktopCall = component.get("v.desktopCall");
        //if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP") && !desktopCall){         
            var evt = $A.get("e.force:navigateToComponent");
            evt.setParams({
                componentDef: "c:BMC_GuidedSelling",
                componentAttributes: {
                    "recordId" : getAccountRec,
                    "contactId" : ContactId,
                    "callogId" : getCallLogId,
                    "callDate" : callDate,
                    "endCallLog" : endCall,
                    "objectiveRecordsToCompare" : ObjectiveRecs,
                    "isOffPrem"  : offPrem,
                    Desktop  : desktopCall
                }
            });
            evt.fire();
            return;
        //}//
    },
    callLogSummary : function (component, event){
         if(navigator.onLine){
                    var action = component.get("c.getMeetingSummary");
                    action.setStorable();
                    action.setParams({
                        accountId: component.get("v.recordId")
                    });
                    action.setCallback(this, function (response) {
                        var state = response.getState();
                        if (state === 'SUCCESS') {
                            component.set("v.callLogs", response.getReturnValue());
                            component.set("v.showObjView", false); 
                            component.set("v.showCallLog", false);
                            var data = response.getReturnValue();
                        } else if (state === 'ERROR') {
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.error("Error message: " + 
                                                    errors[0].message);
                                }
                                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                } else {
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                }
                            } else {
                                console.error("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                } else {
                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                    } else {
                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                    }
                }
    }
    /*callLogSummaryforuser : function (component, event){
         if(navigator.onLine){
                    var action = component.get("c.getMeetingSummaryForUser");
                    action.setStorable();
                    action.setParams({
                        accountId: component.get("v.recordId")
                    });
                    action.setCallback(this, function (response) {
                        var state = response.getState();
                        if (state === 'SUCCESS') {
                            console.log(response.getReturnValue());
                            component.set("v.callLogsforUser", response.getReturnValue());
                            component.set("v.showObjView", false); 
                            component.set("v.showCallLog", false);
                            var data = response.getReturnValue();
                        } else if (state === 'ERROR') {
                            var errors = response.getError();
                            if (errors) {
                                if (errors[0] && errors[0].message) {
                                    console.error("Error message: " + 
                                                    errors[0].message);
                                }
                                if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                                    this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                } else {
                                    this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'slds-theme_error');
                                }
                            } else {
                                console.error("Unknown error");
                            }
                        }
                    });
                    $A.enqueueAction(action);
                } else {
                    if($A.get("$Browser.formFactor") == $A.get("$Label.c.DESKTOP")){
                        this.displayToast($A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'info');
                    } else {
                        this.displayToastMobileCallLog(component, true, $A.get("$Label.c.Error"), $A.get("$Label.c.Internet_Connection_Error_Msg"), 'slds-theme_info');
                    }
                }
    }*/
})