({
    getChannelList: function(component) {
        var acTion = component.get("c.getLabel");
        acTion.setCallback(this, function(response) {
            component.set("v.mylabel", response.getReturnValue());
        });
        $A.enqueueAction(acTion);
    },
    getCustomValue: function(component) {
        var acTion = component.get("c.getinitValue");
        acTion.setCallback(this, function(response) {
            component.set("v.spointvalue", response.getReturnValue());
        });
        $A.enqueueAction(acTion);
    },
    getAccount: function(component) {
        if($A.util.isUndefinedOrNull(component.get("v.selectedLookUpRecord").Id)){
            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_SelectDistributor"), 'warning');
        }
        else if($A.util.isUndefinedOrNull(component.get("v.onpremiseoutlet")) || $A.util.isEmpty(component.get("v.onpremiseoutlet")) )
        {
            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_Empty"), 'warning');
        }
            else  if($A.util.isUndefinedOrNull(component.get("v.offpremiseoutlet")) || $A.util.isEmpty(component.get("v.offpremiseoutlet")))
            {
                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_Empty"), 'warning');
            }
                else if ( component.get("v.onpremiseoutlet") < 0 || component.get("v.offpremiseoutlet") < 0)
                {
                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_Negative"), 'warning');
                }
                    else if( (component.get("v.onpremiseoutlet") == 0 )&& (component.get("v.offpremiseoutlet") == 0 ) )
                    {
                        this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_Zero"), 'warning');
                    }
                        else if($A.util.isUndefinedOrNull(component.get("v.annualVolume")) || $A.util.isEmpty(component.get("v.annualVolume")) )
                        {
                            this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_VolumeNull"), 'warning');
                        }
                            else if ( component.get("v.annualVolume") < 0)
                            {
                                this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_VolumeNegative"), 'warning');
                            }
                                else if (component.get("v.annualVolume") == 0)
                                {
                                    this.displayToast($A.get("$Label.c.Warning"), $A.get("$Label.c.BMC_SOS_VolumeZero"), 'warning');
                                }
                                    else {
                                        component.set("v.showSpinner", true);
                                        var acTion = component.get("c.getAllRetailAccounts");
                                        acTion.setParams({
                                            spoint:component.get("v.spointvalue"),
                                            accountId : (component.get("v.selectedLookUpRecord").Id),
                                            accountName : (component.get("v.selectedLookUpRecord").Name),
                                            onPremiseOutlet :  component.get("v.onpremiseoutlet"),
                                            offPremiseOutlet:  component.get("v.offpremiseoutlet"),
                                            annualVolume:  component.get("v.annualVolume"),
                                            selectedPremise:  component.get("v.selectedPremise"),
                                            selectedChannel:  component.get("v.selectedChannel")
                                        });
                                        acTion.setCallback(this, function(response) {
                                            if (response.getState() === "SUCCESS") {
                                                var coUnt = response.getReturnValue();
                                                component.set("v.showSpinner", false);
                                                if (coUnt.length > 0) {
                                                    if( (component.get("v.onpremiseoutlet") == 0 )&& (component.get("v.offpremiseoutlet") !== 0 ) )
                                                    {
                                                        this.displayToast($A.get("$Label.c.Warning"),
                                                                          $A.get("$Label.c.BMC_SOS_DistributorWarning1")+' '+coUnt[1]+' '+
                                                                          $A.get("$Label.c.BMC_SOS_WarningOffPremise")+''+
                                                                          $A.get("$Label.c.BMC_SOS_DistributorWarning2"),  'warning');
                                                    }
                                                    else if( (component.get("v.onpremiseoutlet") !== 0 )&& (component.get("v.offpremiseoutlet") == 0 ) )
                                                    {
                                                        this.displayToast($A.get("$Label.c.Warning"),
                                                                          $A.get("$Label.c.BMC_SOS_DistributorWarning1")+' '+coUnt[0]+' '+
                                                                          $A.get("$Label.c.BMC_SOS_WarningOnPremise")+''+
                                                                          $A.get("$Label.c.BMC_SOS_DistributorWarning2"),  'warning');
                                                    }
                                                        else
                                                        {
                                                            this.displayToast($A.get("$Label.c.Warning"),
                                                                              $A.get("$Label.c.BMC_SOS_RPcount1")+' '+coUnt[0]+' '+
                                                                              $A.get("$Label.c.BMC_SOS_Rpcount2")+  ' '+coUnt[1]+' '+
                                                                              $A.get("$Label.c.BMC_SOS_Rpcount3"),  'warning');
                                                        }
                                                }
                                                else{
                                                    this.displayToast($A.get("$Label.c.Success"),  $A.get("$Label.c.BMC_SOS_Success"), 'success');
                                                    $A.get('e.force:refreshView').fire();
                                                }
                                            } else if (response.getState() === "ERROR") {
                                                this.displayToast ($A.get("$Label.c.Error"), $A.get("$Label.c.An_unexpected_error_occurred"), 'error');
                                            }
                                        });
                                        $A.enqueueAction(acTion);
                                    }
    },
    displayToast: function (title, message, type, duration) {
        try{
            var toAst = $A.get("e.force:showToast");
            // For lightning1 show the toast
            if (toAst) {
                // fire the toast event in Salesforce1
                var toastParams = {
                    "title": title,
                    "message": message,
                    "type": type
                }
                if (duration) {
                    toastParams['Duration'] = duration
                }
                toAst.setParams(toastParams);
                toAst.fire();
            } else {
                // otherwise throw an alert 
                alert(title + ': ' + message);
            }
        } catch(e){
            console.error(e);
        }
    }
})