({
    doInit : function(component,event,helper) {
        helper.bfdpicklistValues(component);
        helper.ltdPicklistValues(component);
        helper.litPicklist(component);
        helper.uomPicklist(component);
        helper.orderRec(component,event,helper);
        helper.updateorderRec(component,event,helper);
        helper.rCodePicklist(component);
    },
    //search 
    displayProducts : function(component, event, helper) {
        var productNam = component.get("v.productName");
        var productSkuID=component.get("v.productSku");
        var brandFamilyD= component.find("BFmlyDesc").get("v.value");
        var liquidTypeD= component.find("LiquidTypDesc").get("v.value");
        var orderID=component.get("v.recordId");
        var action= component.get("c.getProductFilter");
        var quantity=component.find("tab");   
        var addButton = component.find("addTCart");
        var options = [];
        if(productSkuID && productSkuID.length <3){
            alert($A.get('{!$Label.c.C360_Product_SKU_Error}'));
            return;
        }
        if(!productNam)
        {            
            action.setParams({
                "parameterName":productNam,
                "productSkuId":productSkuID,
                "brandFamilyD":brandFamilyD,
                "liquidTypeD":liquidTypeD,
                "recordId":orderID
            });
            action.setCallback(this,function(response){
                var state= response.getState();
                $A.log(response);
                if(state === "SUCCESS"){
                    if(response.getReturnValue().length<=0){
                        alert($A.get('{!$Label.c.C360_NoResults}'));
                    }else{
                        addButton.set('v.disabled',false);		// Enable Add to cart button
                        component.set("v.prodList",response.getReturnValue());
                        var uomlist = component.get("v.opUom");
                        for(var i=0;i<response.getReturnValue().length;i++){
                            for(var j=0;j<uomlist.length;j++){
                                if(response.getReturnValue()[i].Id==uomlist[j].label){
                                    options.push({value: uomlist[j].value, key: uomlist[j].value }) ;   
                                    $A.createComponents(
                                        [
                                            [
                                                "lightning:select", { label: "UOM", name: "SelUom"+j}
                                            ],
                                            [
                                                "option", { value: "Option 2", label: "Option 2" }
                                            ]
                                        ],
                                        function(components) {
                                            components[0].set("v.body", [components[1], components[2]]);
                                            component.set("v.body", components[0]);
                                        }
                                    );
                                }
                            }
                         }
                    }
                }
            });
            $A.enqueueAction(action);
        }else if(((productNam.length)>=3) && (productNam)){
            action.setParams({
                "parameterName":productNam,
                "productSkuId":productSkuID,
                "brandFamilyD":brandFamilyD,
                "liquidTypeD":liquidTypeD,
                "recordId":orderID
            });
            action.setCallback(this,function(response){
                var state= response.getState();
                $A.log(response);
                if(state === "SUCCESS"){
                    if(response.getReturnValue().length<=0){
                        alert($A.get('{!$Label.c.C360_NoResults}'));
                    }else{
                        addButton.set('v.disabled',false);		// Enable Add to cart button
                        component.set("v.prodList",response.getReturnValue());
                    }
                }
            });
            $A.enqueueAction(action);
        }else{
            alert($A.get('{!$Label.c.C360_SearchMin3}'));
        } 
    },
    
    addToCart : function(component, event, helper) {
        var chkFlag = [];
        var getAllIds= component.find("checkBox");
        var lit=component.find("selectLit");
        var q=component.find("{!'index' + key}");
        if(! Array.isArray(getAllIds))  // FOR SINGLE RECORD 
        {
            if(q.get("v.validity").valid===true && !$A.util.isEmpty(q.get("v.value"))){
                
                helper.addToCarthelper(component,event,helper);
            }else{
                alert($A.get('{!$Label.c.C360_Order_rec_selection}'));               
            }
        }else{
            for(var i=0;i<getAllIds.length;i++)
            {                            
                if(q[i].get("v.validity").valid === true && !$A.util.isEmpty(q[i].get("v.value"))){
                    chkFlag.push(q[i].get("v.value"));                   
                }                
            }
            if(chkFlag.length>0){
                helper.addToCarthelper(component,event,helper);
            }
            else{
                alert($A.get('{!$Label.c.C360_Order_rec_selection}'));               
            }
        }
    },
    
    viewCart : function(component, event, helper) {
        component.set("v.openViewCart",true);             
    },
    
    closeModel : function (component, event, helper){
        component.set("v.openViewCart", false);
        if(component.get("v.passedFromBeerLoss") == true){
            helper.orderRec(component,event,helper);
        }
    },
    back : function(component,event,helper){
        var recordId=component.get("v.recordId");
        var updateEvent = $A.get("e.c:C360_NavigateEvent");                       
        updateEvent.setParams({
            "recordid": recordId
        });
        updateEvent.fire();
    },
    updateOrdProdval: function(component,event,helper){
        var recordId=component.get("v.recordId");
        //Handle the update if the order products is empty.
        var acTion= component.get("c.getOrderProduct");
        acTion.setParams({
            "recordId":recordId
        });
        acTion.setCallback(this,function(response){
            var stAte= response.getState();
            $A.log(response);
            if(stAte === "SUCCESS"){
                if(response.getReturnValue()!="" || response.getReturnValue().length>0){
                    // Call the update functionality.
                    var childCmp = component.find("viewCart");
        			childCmp.validate(recordId);
                }
            }
        });
        $A.enqueueAction(acTion);
    },
    updateOrdProdSub: function(component,event,helper){
        var childCmp = component.find("viewCart");
        var recordId=component.get("v.recordId");
        childCmp.submitted(recordId);
    },
    updateNotes: function(component,event,helper){
        helper.updateOrderNotes();
    },
    validateOrder: function(component,event,helper){
        let button = event.getSource();
        button.set('v.disabled',true);
        var recordId=component.get("v.recordId");
        var action= component.get("c.validateOrderEcc");
        action.setParams({
            "recordId":recordId
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            var labelval = $A.get("$Label.c.Success"); 
            if(state === "SUCCESS"){
                alert(response.getReturnValue());
                if(response.getReturnValue()===labelval){
                    var childCmp = component.find("viewCart");
                    childCmp.refresh();
                }
            }
            let button = event.getSource();
            button.set('v.disabled',false);
        });
        $A.enqueueAction(action);
    },
    
    createDirectOrder: function(component,event,helper){
        let button = event.getSource();
        button.set('v.disabled',true);
        var recordId=component.get("v.recordId");
        var action= component.get("c.sendOrdersToECC");
        action.setParams({
            "recordId":recordId,
            "ordmode":""
        });
        action.setCallback(this,function(response){
            var state= response.getState();
            if(state === "SUCCESS"){ 
                var statLabel = $A.get("$Label.c.Success"); 
                if(response.getReturnValue()===statLabel){
                    alert(response.getReturnValue());
                    var updateEvent = $A.get("e.c:C360_NavigateEvent");
                    updateEvent.setParams({
                        "recordid": recordId
                    });
                    updateEvent.fire();
                }
                else{
                    alert(response.getReturnValue());  
                    let button = event.getSource();
                    button.set('v.disabled',false);
                 }
            }
        });
        $A.enqueueAction(action);
    },
    isRefreshed: function(component,event,helper){
       
    },
    createInDirectOrder:function(component,event,helper){
        var recordId=component.get("v.recordId");
        var action= component.get("c.completeIndirectOrder");
        action.setParams({
            "recordId":recordId
        });
        action.setCallback(this,function(response){
            var state= response.getState();       
            if(state === "SUCCESS"){ 
                var statLabel = $A.get("$Label.c.Success"); 
                alert(response.getReturnValue());
                var updateEvent = $A.get("e.c:C360_NavigateEvent");                       
                updateEvent.setParams({
                    "recordid": recordId
                });
                updateEvent.fire();                
            }
        });
        $A.enqueueAction(action);
    }
    
})