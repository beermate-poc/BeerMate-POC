({
    onLoad : function(component,event,helper){
        this.bfdpicklistValues(component);
        this.ltdPicklistValues(component);
        this.litpicklist(component);
    },
    orderRec: function(component,event,helper){
        var action = component.get("c.getOrderDetails");
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var result = response.getReturnValue();
                component.set("v.ordType",result);   
                var ordertype = component.get("v.ordType");
                if(response.getReturnValue()!=""){
                    if(component.get("v.ordType")[0].Type == 'UK Ullage & Beer Loss'){
                        component.set("v.bLossDesc",component.get("v.ordType")[0].C360_Delivery_Notes__c);
                        component.set("v.descBefore", component.get("v.bLossDesc"));
                        component.set("v.passedFromBeerLoss", true);
                    }
                }
                if(ordertype != undefined && ordertype[0].Type!=undefined && 
                   (ordertype[0].Type == 'CE Free Beer' || ordertype[0].Type =='CE Normal' ||
                    ordertype[0].Type =='CE Return' || ordertype[0].Type =='CE Transfer'||ordertype[0].C360_Account_Sales_Organization_code__c=='CZ10')){
                    component.set("v.isNoneValue",true) ;
                }else{
                    component.set("v.isNoneValue",false) ;
                }
             }
        });
        $A.enqueueAction(action);
    },
    updateorderRec : function(component,event,helper) {
        var action= component.get("c.updateSubmittedOrder");
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            if(state != "SUCCESS"){
                alert("Could not able to update order.");
            }
        });
        $A.enqueueAction(action);
    },
    // Brand Family Picklist Values for search filter
    bfdpicklistValues : function(component) {
        var action= component.get("c.convertFieldToPicklist");
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            var opts1 = [];
            var opts2 = [];
            $A.log(response);
            if(state === "SUCCESS"){
                var allValues= response.getReturnValue();
                for(var i in response.getReturnValue())
                { 
                    opts1.push({value: allValues[i],key:i});
                }
                opts1.sort(function compare(a,b) {
                    if (a.value < b.value)
                        return -1;
                    if (a.value > b.value)
                        return 1;
                    return 0;
                });
                
                component.set('v.option1',opts1);       
            }
        });
        $A.enqueueAction(action);
    },
    
    // Line Type Description picklist values for search filter
    ltdPicklistValues : function(component) {
        var action= component.get("c.convertLTDToPicklist");
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            var opts2 = [];
            $A.log(response);
            if(state === "SUCCESS"){
                var allValues= response.getReturnValue();
                for(var i in response.getReturnValue()){ // alerts key  
                    opts2.push({value: allValues[i],key:i});  
                }   
                opts2.sort(function compare(a,b) {
                    if (a.value < b.value)
                        return -1;
                    if (a.value > b.value)
                        return 1;
                    return 0;
                });
                component.set('v.option2',opts2);
             }
        });
        $A.enqueueAction(action);        
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
                    opts3.push({value: allValues[key],label:key});
               });
                component.set("v.rCodeoptions", opts3);
            }
        });
        $A.enqueueAction(action);
    },
    
    // line item type picklist from Order product  
    litPicklist : function(component){
        var opts =[];
        var action= component.get("c.getorderProductPicklist"); //line item type picklist
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            $A.log(response);
            if(state === "SUCCESS"){
                var result =response.getReturnValue();
                Object.keys(result).forEach(function(key) {
                    opts.push({value: result[key],label:key});
                });
                component.set("v.opList",opts);
            }
        });
        $A.enqueueAction(action);
    },
    
    /* add to cart--insert order product record      */
    addRowHelper : function(component, event, selectedRowIds,litType,qty,uomType,reasonCode){ 
        var action=component.get("c.insertOrderProduct");
        /* recordID-current record id of Direct order */
        /* selectedRowIds-selected row ids */
        action.setParams({
            "recordId": component.get("v.recordId"), 
            "listOfAccProdIds": selectedRowIds,
            "listOflit": litType,
            "listOfqty": qty,
            "listOfuom": uomType,
            "listOfReason": reasonCode
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS" && qty.length>0){
                alert($A.get('{!$Label.c.C360_ATCSuccess}'));
                this.clearQty(component,event);
            }
            else{
                alert($A.get('{!$Label.c.C360_ATCError}'));
                this.clearQty(component,event);
            }          
        });
        $A.enqueueAction(action);
    },
    
    // method to clear quantity field
    clearQty : function(component,event){
        var getAllIds= component.find("checkBox");
        var qty=[];
        var q= component.find("{!'index' + key}");
        for(var i=0;i<getAllIds.length;i++) {   
            if((!$A.util.isEmpty(q[i].get("v.value"))&& q[i].get("v.validity").valid===true)){
                q[i].set("v.value","");
                qty.push(getAllIds[i].get("v.text")+'@'+q[i].get("v.value"));                   
            }
        } 
    },
    
    // push valid records to add to cart
    addToCarthelper: function(component,event,helper){
        var tempIDs = [];
        var litType = [];
        var uomType=[]; 
        var qty =[];
        var getAllIds= component.find("checkBox");
        var lit=component.find("selectLit");
        var uom= component.find("selectUOM");
        var q= component.find("{!'index' + key}");
        var OrderType =  component.get("v.ordType");
        // reason Code for Beer Loss
        var reasonCode =[];
        var r=component.find("{!'reasonCode' + key}");
        var warningFlag = false;
        var prevNote;
        var bloss;
        var flag=false;
        if(! Array.isArray(getAllIds))  // FOR SINGLE RECORD 
        {           
            // if qauntity or line item type is empty
            if( component.get("v.isNoneValue") == true){
                if( uom.find('selectUOM').get("v.value") =='--None--'|| $A.util.isEmpty(uom.find('selectUOM').get("v.value"))){
                    flag=false;
                    alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                    
                }else{
                    if(!$A.util.isEmpty(q.get("v.value")) && q.get("v.validity").valid===true){
                        // For Beer Loss
                        if(component.get("v.passedFromBeerLoss")){
                            reasonCode.push(getAllIds.get("v.text")+'@'+r.get("v.value"));
                            if(uom.find('selectUOM').get("v.value")=="PINT" && Number(q.get("v.value"))>=88 && lit.get("v.value") == "Beer Loss"){
                                warningFlag = true;
                            }
                        }
                        flag=true;
                        tempIDs.push(getAllIds.get("v.text"));
                        
                        if(lit.get("v.value")=== "--None--"|| $A.util.isEmpty(lit.get("v.value"))){
                            litType.push(getAllIds.get("v.text")+'@null');
                        }else{
                            litType.push(getAllIds.get("v.text")+'@'+lit.get("v.value"));
                        }
                        // push id + Quantity values
                        qty.push(getAllIds.get("v.text")+'@'+q.get("v.value"));  
                        uomType.push(getAllIds.get("v.text")+'@'+uom.find('selectUOM').get("v.value"));
                    }else{
                        alert($A.get('{!$Label.c.C360_LITQBlank}'));
                    }
                }
            }
            else{
                if(
                    ((((!$A.util.isEmpty(q.get("v.value")))&& q.get("v.validity").valid===true)&&
                      (($A.util.isEmpty(lit.get("v.value")) || lit.get("v.value")==="--None--") || 
                       ( OrderType[0].RecordType.Name !='Indirect Order' && ( $A.util.isEmpty(uom.find('selectUOM').get("v.value")) ||
                                                                             uom.find('selectUOM').get("v.value")==="--None--"))))))
                {
                    if( $A.util.isEmpty(uom.find('selectUOM').get("v.value")) ||
                       uom.find('selectUOM').get("v.value")==="--None--"){
                        alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                    }else{
                        alert($A.get('{!$Label.c.C360_LITQBlank}'));
                    }
                    flag=false;
                }   
                else if (
                    (((!$A.util.isEmpty(q.get("v.value")) && q.get("v.validity").valid===true) || 
                      (!$A.util.isEmpty(lit.get("v.value")) || 
                       (OrderType[0].RecordType.Name === 'Indirect Order'|| (uom.find('selectUOM').get("v.value") !=="--None--")
                        && !$A.util.isEmpty(uom.find('selectUOM').get("v.value"))) ||
                       lit.get("v.value")!=="--None--" ) ) ))
                {
                    tempIDs.push(getAllIds.get("v.text"));
                    litType.push(getAllIds.get("v.text")+'@'+lit.get("v.value"));              
                    qty.push(getAllIds.get("v.text")+'@'+q.get("v.value"));  
                    uomType.push(getAllIds.get("v.text")+'@'+uom.find('selectUOM').get("v.value"));
                    
                    // For Beer Loss
                    if(component.get("v.passedFromBeerLoss")){
                        reasonCode.push(getAllIds.get("v.text")+'@'+r.get("v.value"));
                        if(uom.find('selectUOM').get("v.value")=="PINT" && Number(q.get("v.value"))>=88 && lit.get("v.value") == "Beer Loss"){
                            warningFlag = true;
                        }
                     }
                    flag=true;
                }
            }
        }
        else{  
            if( component.get("v.isNoneValue") == true){
                for(var i=0;i<getAllIds.length;i++) {  
                    if( uom[i].find('selectUOM').get("v.value") =='--None--'|| $A.util.isEmpty(uom[i].find('selectUOM').get("v.value"))){
                        flag=false;
                        alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                    }else{
                        if(!$A.util.isEmpty(q[i].get("v.value"))&& q[i].get("v.validity").valid===true){
                            tempIDs.push(getAllIds[i].get("v.text")); //push acc prod ids  
                            if(lit[i].get("v.value")=== "--None--" || $A.util.isEmpty(lit[i].get("v.value"))){
                                litType.push(getAllIds[i].get("v.text")+'@null');
                            }else{
                                litType.push(getAllIds[i].get("v.text")+'@'+lit[i].get("v.value"));
                            }
                            qty.push(getAllIds[i].get("v.text")+'@'+q[i].get("v.value"));                             //push id + Quantity values
                            uomType.push(getAllIds[i].get("v.text")+'@'+uom[i].find('selectUOM').get("v.value"));
                            // For Beer Loss
                            if(component.get("v.passedFromBeerLoss")){
                                reasonCode.push(getAllIds[i].get("v.text")+'@'+r[i].get("v.value"));
                                if(uom[i].find('selectUOM').get("v.value")=="PINT" && Number(q[i].get("v.value"))>=88 && lit[i].get("v.value") == "Beer Loss"){
                                    warningFlag = true;
                                }
                            }
                            flag=true;
                        }
                    }
                }
            } 
            else{                
                for(var i=0;i<getAllIds.length;i++) {  
                    if((!$A.util.isEmpty(q[i].get("v.value"))&& q[i].get("v.validity").valid===true) && 
                         ($A.util.isEmpty(lit[i].get("v.value")) || 
                          (
                              OrderType[0].RecordType.Name !='Indirect Order' &&
                              ($A.util.isEmpty(uom[i].find('selectUOM').get("v.value")) ||
                               uom[i].find('selectUOM').get("v.value")==="--None--")) ||
                          lit[i].get("v.value")==="--None--"))                         
                    {
                        flag=false;
                        if( $A.util.isEmpty(uom[i].get("v.value")) ||
                           uom[i].find('selectUOM').get("v.value")==="--None--"){
                            alert($A.get('{!$Label.c.C360_Order_UOM_Val}'));
                        }else{
                            alert($A.get('{!$Label.c.C360_LITQBlank}'));
                        }
                        break;
                    }                   
                    if(
                        (((!$A.util.isEmpty(q[i].get("v.value"))&& q[i].get("v.validity").valid===true) &&
                          (!$A.util.isEmpty(lit[i].get("v.value")) &&
                           lit[i].get("v.value") !=="--None--" &&
                           (OrderType[0].RecordType.Name === 'Indirect Order'|| (uom[i].find('selectUOM').get("v.value") !=="--None--")
                            && !$A.util.isEmpty(uom[i].find('selectUOM').get("v.value")))
                          ))))     
                    {    
                        tempIDs.push(getAllIds[i].get("v.text")); //push acc prod ids
                        litType.push(getAllIds[i].get("v.text")+'@'+lit[i].get("v.value"));              //push id +line item picklist values
                        qty.push(getAllIds[i].get("v.text")+'@'+q[i].get("v.value"));                             //push id + Quantity values
                        uomType.push(getAllIds[i].get("v.text")+'@'+uom[i].find('selectUOM').get("v.value"));
                        // For Beer Loss
                        if(component.get("v.passedFromBeerLoss")){
                            reasonCode.push(getAllIds[i].get("v.text")+'@'+r[i].get("v.value"));
                            if(uom[i].find('selectUOM').get("v.value")=="PINT" && Number(q[i].get("v.value"))>=88 && lit[i].get("v.value") == "Beer Loss"){
                                warningFlag = true;
                            }
                         }
                        flag=true;
                    }
                }// end for  
            }    
        }
        /*if(otherRCode===true){
            var reason = prompt("Please specify any other reason here.");
            if(reason != "" && reason != null){
                this.updateOrderNotes(component, reason);
            }               
        }*/
        if(warningFlag===true){
            bloss = prompt($A.get('{!$Label.c.CTS_Warning_for_Quantity}'));
        }
        if(flag===true){
            //Notes to track other reason code and 88PINTS justification for Beer Loss
            prevNote = component.get("v.bLossDesc");
            if(bloss != "" && bloss != null){
                component.set("v.bLossDesc",prevNote+"\n"+bloss);
            }
            this.updateOrderNotes(component, component.get("v.bLossDesc"));
            this.addRowHelper(component, event, tempIDs,litType,qty,uomType,reasonCode);
        }
        else{
            alert("Operation failed!");
            this.clearQty(component,event);
        } 
    },
    uomPicklist : function(component){
        var opts=[];
        var action= component.get("c.getUOMPicklist"); //line item type picklist
        action.setParams({
            "recordId":component.get("v.recordId")
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            $A.log(response);
            if(state === "SUCCESS"){
                var result =response.getReturnValue();
                component.set('v.opUomMap',result);
                Object.keys(result).forEach(function(key) {
                    opts.push({value: result[key],label:key});
                });
                component.set("v.opUom",opts);
            }
        });
        $A.enqueueAction(action);
    },
    /* Navigates  user to  detail page of the record*/
    navigate : function(component, event,recid) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": recid,
            "slideDevName": "related"
        });
        navEvt.fire();       
    },
    updateOrderNotes : function(component, bloss) {
        // To update notes if there is any changes during addition of products
        //var notes = component.get("v.bLossDesc");
        if(bloss != null && bloss != 'undefined' && bloss != ""){
            var updateNoteAction = component.get("c.updateOrderNotes");
            updateNoteAction.setParams({
                recordId: component.get("v.recordId"),
                bLossNotes: bloss
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
    }
    
})