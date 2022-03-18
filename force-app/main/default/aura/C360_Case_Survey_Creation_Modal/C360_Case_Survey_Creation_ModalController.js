({
    doInit : function(component,event,helper){
        //set an attribute with all types of answers to show input for each type
        var questionTypes = {text:"Text",date:"Date",dateTime:"Date Time",checkbox:"Checkbox",currency:"Currency",numeric:"Numeric",picklist:"Picklist",multiPicklist:"Multi Picklist",lookup:"Lookup",time:"Time"};
        component.set("v.questionTypes",questionTypes);
        
        // action to get questions on this survey by category and subcategory
        var action = component.get("c.findCaseCreationQuestions");
        action.setParams({
            category : component.get("v.caseRecord").C360_Category__c, 
            subCategory: component.get("v.caseRecord").C360_Sub_Category__c,
            issueType: component.get("v.caseRecord").Type_of_Issue__c
        });
        action.setCallback(this,function(response){
            var state = response.getState();

            if (state === "SUCCESS") {
                component.set("v.questions",response.getReturnValue());
                // parse picklist and multi picklist answers
                helper.parsePicklistAnswers(component,event,helper);
                //check if exists answers on survey and if yes do not show the survey
                helper.checkExistingAnswers(component,event,helper);
            }
        });
        $A.enqueueAction(action);
    },

    // open dropdown for multipicklist input
    openDropdown:function(component,event,helper){
        $A.util.addClass(component.find('dropdown'),'slds-is-open');
        $A.util.removeClass(component.find('dropdown'),'slds-is-close');
    }, 
    // close dropdown for multipicklist input
    closeDropDown:function(component,event,helper){
        $A.util.addClass(component.find('dropdown'),'slds-is-close');
        $A.util.removeClass(component.find('dropdown'),'slds-is-open');
    },
    // check the selected record on the multipicklist 
    selectOption:function(component,event,helper){   
        var label = event.currentTarget.id.split("#BP#")[0];
        var isCheck = event.currentTarget.id.split("#BP#")[1];
        var number = event.currentTarget.id.split("#BP#")[2];
        helper.selectOptionHelper(component,label,isCheck,number);
    },

    //funtion to save the questions and answers from the survey
    handleSave : function(component,event,helper){
        //parse the answers
        helper.parseAnswers(component,event,helper);
        var answers = component.get("v.answers");
        //check if all answers are completed
        if(answers.includes("")){
            alert("Please fill all the answers");
        }else{
            if(answers.includes(" ")){
                console.log("###");
            }else{
                //action to save questions and answers
                var action = component.get("c.saveAnswers");
                action.setParams({
                    answers : component.get("v.answers"), 
                    questions: component.get("v.questions"),
                    initialAnswers: component.get("v.initialAnswers"),
                    caseId: component.get("v.caseRecord").Id
                });
                action.setCallback(this,function(response){
                    var state = response.getState();
                    if (state === "SUCCESS"){
                        component.set("v.isVisible",false);
                    }
                });
                $A.enqueueAction(action);
            }
        }
    },

    //function is called everytime when is changed a value for text,currency and numeric types
    onChangeValue : function(component,event,helper){
        var value =  event.getSource().get("v.value");
        var poz =  event.getSource().get("v.name");
        var questions = component.get("v.questions");
        var answers = component.get("v.answers");
        if (questions[poz].Type_of_Answer__c == "Numeric"){
            //check if for numeric type the input is integer
            if(Number.isInteger(Number(value))){
                answers[poz] = value ;
            }else{
                alert("Question : " + questions[poz].Name + " : please insert an integer number");
            }
            //check if needed to show a warning message for extra cost
            if(questions[poz].Name === "Number of copies required"){
                if(value > 29){
                    component.set("v.MessageAlertExtraCost","There is a customer charge of £0.50 per invoice for requests of 30 or more documents.");
                }else {
                    component.set("v.MessageAlertExtraCost","");
                }
            }
        }else{
            answers[poz] = value ;
        }
        component.set("v.answers",answers);
    },

    //function is called everytime when is changed a datetime value
    onChangeDateTimeValue : function(component,event,helper){
        var value =  new Date(event.getSource().get("v.value"));
        var poz =  event.getSource().get("v.name");
        var answers = component.get("v.answers");
        answers[poz] = value.toLocaleString("en-GB");
        component.set("v.answers",answers);
    },

    //function is called everytime when is changed a time value
    onChangeTimeValue : function(component,event,helper){
        var value =  new String(event.getSource().get("v.value"));
        var poz =  event.getSource().get("v.name");
        var answers = component.get("v.answers");
        answers[poz] = value.substring(0,5);
        component.set("v.answers",answers);
    },

    //function is called everytime when is changed a date value
    onChangeDateValue : function(component,event,helper){
        var value =  new Date(event.getSource().get("v.value"));
        var poz =  event.getSource().get("v.name");
        var answers = component.get("v.answers");
        answers[poz] = value.toLocaleDateString("en-GB");
        component.set("v.answers",answers);
    },

    //function is called everytime when is changed a checkbox value
    onChangeCheckbox : function(component,event,helper){
        var value =  event.getSource().get("v.checked");
        var poz =  event.getSource().get("v.name");
        var answers = component.get("v.answers");
        answers[poz] = value ;
        component.set("v.answers",answers);
    },

    onfocus : function(component,event,helper){
        $A.util.addClass(component.find("mySpinner"), "slds-show");
        var forOpen = component.find("searchRes");
            $A.util.addClass(forOpen, 'slds-is-open');
            $A.util.removeClass(forOpen, 'slds-is-close');
        var getInputkeyWord = '';
        helper.searchHelper(component,event,getInputkeyWord);
    },

    onblur : function(component,event,helper){       
        component.set("v.listOfSearchRecords", null );
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    },

    //function for search in lookup
    keyPressController : function(component, event, helper) {  
    var getInputkeyWord = component.get("v.SearchKeyWord");

    if( getInputkeyWord.length > 0 ){
        var forOpen = component.find("searchRes");
        $A.util.addClass(forOpen, 'slds-is-open');
        $A.util.removeClass(forOpen, 'slds-is-close');
        helper.searchHelper(component,event,getInputkeyWord);
    }
    else{  
        component.set("v.listOfSearchRecords", null ); 
        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
    }
    },
     
   //function for clear the Record Selection 
    clear :function(component,event,heplper){
        var pillTarget = component.find("lookup-pill");
        var lookUpTarget = component.find("lookupField"); 
        
        $A.util.addClass(pillTarget, 'slds-hide');
        $A.util.removeClass(pillTarget, 'slds-show');
        
        $A.util.addClass(lookUpTarget, 'slds-show');
        $A.util.removeClass(lookUpTarget, 'slds-hide');
    
        component.set("v.SearchKeyWord",null);
        component.set("v.listOfSearchRecords", null );
        component.set("v.selectedRecord", {} );   
    },
     
    //function to select the record form lookup
    selectRecord : function(component, event, helper){      
    var name = event.currentTarget.id.split("#BP#")[0];
    var sku = event.currentTarget.id.split("#BP#")[1];
    var brand = event.currentTarget.id.split("#BP#")[2];

    var selectedRecord = {Name:name,C360_Product_ID_SKU__c:sku,C360_Brand_Owner_Description__c:brand};
    component.set("v.selectedRecord",selectedRecord);

    var forclose = component.find("lookup-pill");
        $A.util.addClass(forclose, 'slds-show');
        $A.util.removeClass(forclose, 'slds-hide');

        var forclose = component.find("searchRes");
        $A.util.addClass(forclose, 'slds-is-close');
        $A.util.removeClass(forclose, 'slds-is-open');
        
        var lookUpTarget = component.find("lookupField");
            $A.util.addClass(lookUpTarget, 'slds-hide');
            $A.util.removeClass(lookUpTarget, 'slds-show');  
    }
})