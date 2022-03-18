({
    // parse picklist and multipicklist answers before show it
    parsePicklistAnswers : function(component,event,helper){
        var questions = component.get("v.questions");
        var ans = [];
        var initAnswers = [];
        for (var i=0;i<questions.length;i++){
            ans.push("");
        }
        for (var q in questions){
            var typeOfAnswer = questions[q].Type_of_Answer__c;
            if(typeOfAnswer === "Picklist"){
                initAnswers[q] = questions[q].Answer__c;
                var question = questions[q].Answer__c.split(";");
                questions[q].Answer__c = question;
            }
            if(typeOfAnswer === "Multi Picklist"){
                initAnswers[q] = questions[q].Answer__c;
                var question = questions[q].Answer__c.split(";");
                var answers = [];
                for(var a in question){
                    answers.push({label: question[a] ,isChecked:false});
                }
                questions[q].Answer__c = answers;
            }
        }
        component.set("v.questions",questions);
        component.set("v.answers",ans);
        component.set("v.initialAnswers",initAnswers);
    },

    // function to check answer in multipicklist
    selectOptionHelper : function(component,label,isCheck,number) {
        var selectedOption="";
        var allOptions = component.get("v.questions["+number+"].Answer__c");
        var count=0;
        for(var i=0;i<allOptions.length;i++){
            if(allOptions[i].label==label) { 
                if(isCheck=="true"){
                    allOptions[i].isChecked = false; 
                }else{ 
                    allOptions[i].isChecked = true; 
                } 
            } 
            if(allOptions[i].isChecked){ 
                selectedOption=allOptions[i].label; 
                count++; 
            } 
        } 
        if(count>1){
            selectedOption = count+ " items selected";
        }
        component.set("v.selectedOptions",selectedOption);
        component.set("v.questions["+number+"].Answer__c",allOptions);
    },

    // parse the answers before save it
    parseAnswers : function (component,event,helper){
        var q = component.get("v.questions");
        var answers = component.get("v.answers");
        for(var i=0;i<q.length;i++){
            if(q[i].Type_of_Answer__c == "Text"){
                if(q[i].Name.startsWith("TradeTeam Offer")){
                    if(answers[i].length != 13){
                        answers[i]=" ";
                        alert("Question : " + q[i].Name + " must be 13 characters e.g. MON:0800-1400");
                    }
                }
            }
            if(q[i].Type_of_Answer__c == "Checkbox"){
                if(answers[i] == ""){
                    answers[i] = false;
                }
            }
            if(q[i].Type_of_Answer__c == "Picklist"){
                if(answers[i] == ""){
                    answers[i] = q[i].Answer__c[0];
                }
            }
            if(q[i].Type_of_Answer__c == "Multi Picklist"){
                var mpAnswers = "";
                var a = q[i].Answer__c;
                for(var j=0;j<a.length;j++){
                    if(a[j].isChecked == true){
                        mpAnswers = mpAnswers + a[j].label + ";" ;
                    }
                }
                if(mpAnswers.length>0){
                    mpAnswers = mpAnswers.substring(0,mpAnswers.length-1);
                }
                answers[i] = mpAnswers;
            }
            if(q[i].Type_of_Answer__c == "Currency"){
                var curr = answers[i];
                if(answers[i] != ""){
                    if(curr.substring(0,$A.get('$Locale.currency').length) != $A.get('$Locale.currency')){
                        answers[i] = $A.get('$Locale.currency') + " " + answers[i];
                    }
                }
            }
            if(q[i].Type_of_Answer__c == "Lookup"){
                var curr = component.get("v.selectedRecord");
                if(curr.Name != undefined){
                    answers[i] = "Name: " + curr.Name + " ; SKU: " + curr.C360_Product_ID_SKU__c + " ; Brand Owner: " + curr.C360_Brand_Owner_Description__c;
                }else{
                    answers[i]="";
                }
            }
            if(q[i].Name.endsWith("To") && q[i-1].Name.endsWith("From")){
                if(answers[i]<answers[i-1]){
                    alert(q[i-1].Name + " need to be lower than " + q[i].Name);
                    answers[i]=" ";
                }
            }
        }
        component.set("v.answers",answers);
    },

    searchHelper : function(component,event,getInputkeyWord) {
        //action searches for records on the lookup
        var action = component.get("c.fetchLookUpValues");  
        action.setParams({
            'searchKeyWord': getInputkeyWord
        });    
        action.setCallback(this, function(response) {
        $A.util.removeClass(component.find("mySpinner"), "slds-show");
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
            // if storeResponse size is equal 0 ,display No Result Found... message on screen.                }
                if (storeResponse.length === 0) {
                    component.set("v.Message", "No Result Found...");
                } else {
                    component.set("v.Message", "");
                }
                // set searchResult list with return value from server.
                component.set("v.listOfSearchRecords", storeResponse);
            }

        });
    // enqueue the Action  
        $A.enqueueAction(action);
    
    },

    //function to check if exists answers on this case
    checkExistingAnswers : function (component,event,helper){
        var questions = component.get("v.questions");
        var action1 = component.get("c.checkExistingAnswers");
        action1.setParams({
            caseId: component.get("v.caseRecord").Id
        });
        action1.setCallback(this,function(response1){
            var state = response1.getState();

            if (state === "SUCCESS") {
                if(response1.getReturnValue() === 0){
                    if(questions.length>0){
                        component.set('v.isVisible',true);
                    }
                }else{
                    component.set("v.isVisible",false);
                }
            }
        });
        $A.enqueueAction(action1);
    }
})