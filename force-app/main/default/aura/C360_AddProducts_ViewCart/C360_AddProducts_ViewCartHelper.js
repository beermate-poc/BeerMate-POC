({
    onLoad : function(component, event, helper){
       // debugger;
        var orderID=component.get("v.recordId");
        var acTion= component.get("c.getOrderProduct");
        acTion.setParams({
            "recordId":orderID
        });
        acTion.setCallback(this, function(response){
            var stAte= response.getState();
            $A.log(response);
            if(stAte === "SUCCESS"){
                component.set("v.ordProdList", response.getReturnValue());
                if(response.getReturnValue()==="" || response.getReturnValue().length<=0){
                    alert($A.get('{!$Label.c.C360_NoResults}'));
                }else{
                    component.set("v.prevNotes", component.get("v.ordProdList")[0].Order__r.C360_Delivery_Notes__c);
                }
            }
        });
        $A.enqueueAction(acTion);	
    },
    
    // reason code picklist from Order product for Beer Loss 
    rCodePicklist : function(component){
        var opts3 = [];
        var action= component.get("c.getrCodePicklist"); //reason code picklist
        action.setParams({
            "fld": "CTS_Reason_Code__c"
        });
        action.setCallback(this, function(response) {
            var state= response.getState();
            $A.log(response);
            
            if (state === "SUCCESS") {
                var allValues = response.getReturnValue();
                
                Object.keys(allValues).forEach(function(key) {
                    opts3.push({value: allValues[key], label:key});
                    
                });
                component.set("v.rCodeList", opts3);
            }
        });
        $A.enqueueAction(action);
    },
    
    litPicklist : function(component){
        var opTs=[];
        var acTion= component.get("c.getorderProductPicklist"); //line item type picklist
        acTion.setParams({
            "recordId":component.get("v.recordId")
        });
        acTion.setCallback(this, function(response){
            var stAte= response.getState();
            $A.log(response);
            if(stAte === "SUCCESS"){
                var reSult =response.getReturnValue();
                Object.keys(reSult).forEach(function(key) {
                    opTs.push({value: reSult[key], label:key});
                });
                component.set("v.litList", opTs);
                component.set("v.litList", opTs);
                var ordType = component.get("v.ordType");
                if(ordType != undefined && ordType[0].Type !=undefined && 
                   (ordType[0].Type == 'CE Free Beer' || ordType[0].Type =='CE Normal' ||
                    ordType[0].Type =='CE Return' || ordType[0].Type =='CE Transfer'||ordType[0].C360_Account_Sales_Organization_code__c =='CZ10')){
                    component.set("v.isCEorder", true) ;
                }else{
                    component.set("v.isCEorder", false) ;
                }                        
            }
        });
        $A.enqueueAction(acTion);
    },
    statusPicklist : function(component){
        var opTs=[];
        var acTion= component.get("c.getRejectStatusPicklist"); //line item type picklist
        acTion.setParams({
            "recordId":component.get("v.recordId")
        });
        acTion.setCallback(this, function(response){
            var stAte= response.getState();
            $A.log(response);
            if(stAte === "SUCCESS"){
                var reSult =response.getReturnValue();
                Object.keys(reSult).forEach(function(key) {
                    opTs.push({value: reSult[key], label:key});
                });
                component.set("v.litListStatus", opTs);
            }
        });
        $A.enqueueAction(acTion);
    },      
    // push valid records to add to cart
    addToCarthelper: function(component, event, helper, status){
        
       // debugger;
        var tempIDs = [];
        var litType = [];
        var uomType = [];
        var qTy =[];
        var sts =[];
        var lIt=component.find("selectLit");
        var uOm=component.find("selectUOM"); 
        var oDp = component.find("{!'btn_index' + key}");
        var q=component.find("{!'index' + key}");
        
        // reason Code for Beer Loss
        var reasonCode =[];
        var r=component.find("{!'reasonCode' + key}");
        var warningFlag = false;

        var fLag=false;
        var ordSts =component.find("selectstatus");
        if(! Array.isArray(lIt))  //FOR SINGLE RECORD uom odp
        {       
            	
            if( component.get("v.isCEorder") == true){
                
                if( uOm.find('selectUOM').get("v.value") =='--None--'|| $A.util.isEmpty(uOm.find('selectUOM').get("v.value"))){
                    fLag=false;
                    alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                }else{
                    if(!$A.util.isEmpty(q.get("v.value")) && (q.get("v.validity").valid===true|| (ordSts != undefined && ordSts.get("v.value") != "--None--"))){
                        tempIDs.push(oDp.get("v.value"));   
                        if(lIt.get("v.value")=== "--None--" || $A.util.isEmpty(lIt.get("v.value"))){
                            litType.push(oDp.get("v.value")+'@null');
                        }else{
                            litType.push(oDp.get("v.value")+'@'+lIt.get("v.value"));
                        }
                        // For Beer Loss
                        if(component.get("v.passedFromBeerLoss")){
                            reasonCode.push(oDp.get("v.value")+'@'+r.get("v.value"));
                            if(uOm.find('selectUOM').get("v.value")=="PINT" && Number(q.get("v.value"))>=88 && lIt.get("v.value") == "Beer Loss"){
                                warningFlag = true;
                            }
                        }
                        qTy.push(oDp.get("v.value")+'@'+q.get("v.value")); 
                        uomType.push(oDp.get("v.value")+'@'+uOm.find('selectUOM').get("v.value"));
                        if(ordSts != undefined)
                    	sts.push(oDp.get("v.value")+'@'+ordSts.get("v.value"));
                        fLag=true;
                    }
                }
                
            }else{
                
                if((((!$A.util.isEmpty(q.get("v.value")))&& q.get("v.validity").valid===true)&&
                    (($A.util.isEmpty(lIt.get("v.value")) || lIt.get("v.value")==="--None--") ||
                     ($A.util.isEmpty(uOm.find('selectUOM').get("v.value")) ||
                      uOm.find('selectUOM').get("v.value")==="--None--")))) 
                {
                    
                    if( $A.util.isEmpty(uOm.get("v.value")) ||
                       uOm.find('selectUOM').get("v.value")==="--None--"){
                        alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                    }else{
                        alert($A.get('{!$Label.c.C360_LITQBlank}'));
                    }
                    fLag=false;
                    // alert("Line Item Type or Quantity cannot be left blank for selected Product");         
                }   
                else if (
                    (((!$A.util.isEmpty(q.get("v.value"))) || 
                      (!$A.util.isEmpty(lIt.get("v.value")) || 
                       lIt.get("v.value")!=="--None--" ) ) ))
                {
                    
                    // For Beer Loss
                    if(component.get("v.passedFromBeerLoss")){
                        
                        reasonCode.push(oDp.get("v.value")+'@'+r.get("v.value"));
                        if(uOm.find('selectUOM').get("v.value")=="PINT" && Number(q.get("v.value"))>=88 && lIt.get("v.value") == "Beer Loss"){
                            warningFlag = true;
                        }
                    }
                    tempIDs.push(oDp.get("v.value"));      
                    litType.push(oDp.get("v.value")+'@'+lIt.get("v.value"));              
                    qTy.push(oDp.get("v.value")+'@'+q.get("v.value")); 
                    if(ordSts != undefined)
                    sts.push(oDp.get("v.value")+'@'+ordSts.get("v.value"));
                    uomType.push(oDp.get("v.value")+'@'+uOm.find('selectUOM').get("v.value"));
                    fLag=true;
                }
            }
        } 
        else{
            	
            if( component.get("v.isCEorder") == true){
                for(var i=0;i<lIt.length;i++){
                    if( uOm[i].find('selectUOM').get("v.value") =='--None--'|| $A.util.isEmpty(uOm[i].find('selectUOM').get("v.value"))){
                        flag=false;
                        alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                    }else{
                        if((!$A.util.isEmpty(q[i].get("v.value"))&& q[i].get("v.validity").valid===true)){
                            
                            tempIDs.push(oDp[i].get("v.value")); //push acc prod ids
                            if(lIt[i].get("v.value") ==="--None--" || $A.util.isEmpty(lIt[i].get("v.value"))){
                                litType.push(oDp[i].get("v.value")+'@null');  
                            }else{
                                litType.push(oDp[i].get("v.value")+'@'+lIt[i].get("v.value")); 
                            }
                            // push id +line item picklist values
                            qTy.push(oDp[i].get("v.value")+'@'+q[i].get("v.value"));                             //push id + Quantity values
                            uomType.push(oDp[i].get("v.value")+'@'+uOm[i].find('selectUOM').get("v.value"));
                            if(ordSts != undefined)
    						sts.push(oDp[i].get("v.value")+'@'+ordSts[i].get("v.value"));
                            
                            // For Beer Loss
                            if(component.get("v.passedFromBeerLoss")){
                                reasonCode.push(oDp[i].get("v.value")+'@'+r[i].get("v.value"));
                                if(uOm[i].find('selectUOM').get("v.value")=="PINT" && Number(q[i].get("v.value"))>=88 && lIt[i].get("v.value") == "Beer Loss"){
                                    warningFlag = true;
                                }
                            }
                            fLag=true;
                        }
                    }
                }
                
            }else{
                for(var i=0;i<lIt.length;i++)
                {
                    
                    if((((!$A.util.isEmpty(q[i].get("v.value"))&& q[i].get("v.validity").valid===true) && 
                         ($A.util.isEmpty(lIt[i].get("v.value")) || 
                          ($A.util.isEmpty( uOm[i].find('selectUOM').get("v.value")) ||
                           uOm[i].find('selectUOM').get("v.value")==="--None--") ||
                          lIt[i].get("v.value")==="--None--"))))                          
                    {
                        fLag=false;
                        if( $A.util.isEmpty( uOm[i].find('selectUOM').get("v.value")) ||
                           uOm[i].find('selectUOM').get("v.value")==="--None--"){
                            alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                        }else{
                            alert($A.get('{!$Label.c.C360_LITQBlank}'));
                        }
                        break;
                    }                   
                    if(
                        (((!$A.util.isEmpty(q[i].get("v.value"))) ||
                          (!$A.util.isEmpty(lIt[i].get("v.value")) ||
                           lIt[i].get("v.value")!=="--None--" ) ) ))     
                    {         
                        tempIDs.push(oDp[i].get("v.value")); // push acc prod ids
                        litType.push(oDp[i].get("v.value")+'@'+lIt[i].get("v.value"));              //push id +line item picklist values
                        qTy.push(oDp[i].get("v.value")+'@'+q[i].get("v.value"));                             //push id + Quantity values
                        uomType.push(oDp[i].get("v.value")+'@'+uOm[i].find('selectUOM').get("v.value"));
                        if(ordSts != undefined)
                            sts.push(oDp[i].get("v.value")+'@'+ordSts[i].get("v.value"));
                        // For Beer Loss
                        if(component.get("v.passedFromBeerLoss")){
                            reasonCode.push(oDp[i].get("v.value")+'@'+r[i].get("v.value"));
                            if(uOm[i].find('selectUOM').get("v.value")=="PINT" && Number(q[i].get("v.value"))>=88 && lIt[i].get("v.value") == "Beer Loss"){
                                warningFlag = true;
                            }
                        }
                        fLag=true;
                    }     
                }// end for
                
            } 
        }
        if(warningFlag === true){
            var notes = prompt($A.get('{!$Label.c.CTS_Warning_for_Quantity}'));
            if(notes != "" && notes != null){
                this.updateNotesonOrder(component, component.get("v.prevNotes")+"\n"+notes);
            }
                
        }
        if(fLag===true){
            this.addRowHelper(component, event, tempIDs, litType, qTy, status, uomType, sts, reasonCode);
        }
        else{
            
            alert($A.get('{!$Label.c.C360_OpeartionFailed}'));
        }
    },
    addRowHelper : function(component, event, selectedRowIds, litType, qty, status, uomType, sts, reasonCode){
       // debugger;
        var paRams = event.getParam("arguments");
        /* recordID-current record id of Direct order             */
        /* selectedRowIds-selected row ids */
        var recordId=paRams.recordId;
                
        var acTion=component.get("c.updateOrderProducts");
        acTion.setParams({
            "recordId":recordId, 
            "listOfOrdProdIds": selectedRowIds,
            "listOflit": litType,
            "listOfqty": qty,
            "status":status,
            "listOfuom":uomType,
            "rejectStatus":sts,
            "listOfReason": reasonCode
        });
        acTion.setCallback(this, function(response) {
            var stAte = response.getState();
            if (stAte === "SUCCESS" && qty.length>0){
                alert($A.get('{!$Label.c.C360_ATCSuccess}'));
                // alert("The selected items have been succesfully added to the cart.");
                var navEvt = $A.get("e.force:navigateToSObject");
                
                navEvt.setParams({
                    "recordId": recordId
                });
                navEvt.fire();
            }
            else{
                alert($A.get('{!$Label.c.C360_ATCError}'));
                // alert("Error in adding selected items to the cart.");
            }          
        });
        $A.enqueueAction(acTion);
    },
    updateNotesonOrder : function(component, notes){
        // To update notes if there is any changes during addition of products
        if(notes != null && notes != 'undefined' && notes != ""){
            var updateNoteAction = component.get("c.updateOrderNotes");
            updateNoteAction.setParams({
                recordId: component.get("v.recordId"),
                bLossNotes: notes
            });
            $A.enqueueAction(updateNoteAction);
            updateNoteAction.setCallback(this, function(response){
                if(response.getState() === "SUCCESS"){
                    console.log(response.getState());
                }else{
                    console.log(response.getState());
                }
            });
            
        }
        
    },
    uomPicklist : function(component){
        var oPts=[];
        var acTion= component.get("c.getUOMPicklist"); //line item type picklist
        acTion.setParams({
            "recordId":component.get("v.recordId")
        });
        acTion.setCallback(this, function(response){
            var stAte= response.getState();
            $A.log(response);
            if(stAte === "SUCCESS"){
                var reSult =response.getReturnValue();
                //alert('result'+result);
                component.set("v.opUomMap", reSult);
                Object.keys(reSult).forEach(function(key) {
                    oPts.push({value: reSult[key], label:key});
                });
                component.set("v.opUom", oPts);
            }
        });
        $A.enqueueAction(acTion);
    }
    
    
    
})