/*Strike by Appiphony

Version: 1.0.0
Website: http://www.lightningstrike.io
GitHub: https://github.com/appiphony/Strike-Components
License: BSD 3-Clause License*/
({
    checkIfInitialized: function(component, event, helper) {
        var initCallsRunning = component.get('v.initCallsRunning');

        if (--initCallsRunning < 0) {
            initCallsRunning = 0;
        }

        component.set('v.initCallsRunning', initCallsRunning);
    },
    closeMenu: function(component, event, helper) {
        component.set('v.focusIndex', null);
        component.set('v.openMenu', false);
    },
    getParams: function(component, event, helper) {
        var filter = component.get('v.filter');
        var limit = component.get('v.limit');
        var object = component.get('v.object');
        var order = component.get('v.order');
        var offset = component.get('v.offset').toString();
        var labelToApi = component.get('v.labelToApi');

        var subtitleField = component.get('v.subtitleField');
        var columnsDisp = component.get('v.columnsToDisp');
        var searchFields = '';
        var searchTerms = '';
        var searchInputs = component.find('lookupInput');
       

        if(searchInputs.length){
            searchInputs.forEach(function(input){
            var inputVal = input.getElement().value;
            if(inputVal != null && inputVal.length > 0){
                searchFields = searchFields + labelToApi[input.getElement().placeholder] + ',';
                searchTerms = searchTerms + inputVal + ',';
            }
        });
    
        } else {
            var inputVal = searchInputs.getElement().value;
            if(inputVal != null && inputVal.length > 0){
                searchFields = searchFields + labelToApi[searchInputs.getElement().placeholder] + ',';
                searchTerms = searchTerms + inputVal + ',';
            }
            
        }

        return {
            filter: filter,
            limit: limit,
            object: object,
            order: order,
            searchFields: searchFields,
            subtitleField: subtitleField,
            columnsToDisp: columnsDisp,
            searchTerms : searchTerms,
            offset: offset
        };
    },
    getRecentRecords: function(component, event, helper) {
        var returnedRecords = [];

        var getRecordsAction = component.get('c.getRecentRecords');

        getRecordsAction.setParams({
            jsonString: JSON.stringify(helper.getParams(component, event, helper))
        });

        getRecordsAction.setCallback(this, function(res) {
            if (res.getState() === 'SUCCESS') {
                var returnValue = JSON.parse(res.getReturnValue());

                if (returnValue.isSuccess) {
                    returnValue.results.data.forEach(function(record) {
                        returnedRecords.push({
                            label: record.label,
                            sublabel: record.sublabel,
                            value: record.value
                        });
                    });
                }
            }
            component.set('v.recentRecords', returnedRecords);

            helper.checkIfInitialized(component, event, helper);
        });

        $A.enqueueAction(getRecordsAction);
    },
    getRecordByValue: function(component, event, helper) {
        var value = component.get('v.value');
        var objectType = component.get("v.object");
        var nameToDisp = component.get("v.fieldToDisp");

        if (!value) {
            component.set('v.valueLabel', null);
            component.set('v.valueSublabel', null);
            helper.checkIfInitialized(component, event, helper);

            return;
        }

        var getRecordsAction = component.get('c.getRecords');
        var params = helper.getParams(component, event, helper);

        if ($A.util.isEmpty(params.filter)) {
            params.filter = 'Id = \'' + value + '\'';
        } else {
            params.filter = 'Id = \'' + value + '\' AND (' + params.filter + ')';
        }

        getRecordsAction.setParams({
            jsonString: JSON.stringify(params)
        });

        getRecordsAction.setCallback(this, function(res) {
            if (res.getState() === 'SUCCESS') {
                console.log(res.getReturnValue());
                var returnValue = JSON.parse(res.getReturnValue());

                if (returnValue.isSuccess) {
                    returnValue.results.data.forEach(function(record) {
                        var keys = Object.keys(record);
                        var nameVal = keys.find(function(field){
                            return field == nameToDisp;
                        });

                        component.set('v.valueLabel', record[nameVal]);
                        component.set('v.valueSublabel', record[nameVal]);
                    });
                }
            }

            helper.checkIfInitialized(component, event, helper);
        });

        $A.enqueueAction(getRecordsAction);
    },
    getRecordLabel: function(component, event, helper) {
        var getRecordLabelAction = component.get('c.getRecordLabel');

        getRecordLabelAction.setParams({
            jsonString: JSON.stringify({
                object: component.get('v.object')
            })
        });

        getRecordLabelAction.setCallback(this, function(res) {
            if (res.getState() === 'SUCCESS') {
                var returnValue = JSON.parse(res.getReturnValue());

                if (returnValue.isSuccess) {
                    component.set('v.objectLabel', returnValue.results.objectLabel);
                }
            }

            helper.checkIfInitialized(component, event, helper);
        });

        $A.enqueueAction(getRecordLabelAction);
    },

    getFieldLabels: function(component, event, helper){
        var getFieldLabelsAction = component.get("c.getFieldLabels");

        getFieldLabelsAction.setParams({
            sObjectName:component.get("v.object"),
            fieldList:component.get('v.searchField')});

        getFieldLabelsAction.setCallback(this, function(res) {
            if (res.getState() === 'SUCCESS') {
                var fieldLabels = Object.keys(res.getReturnValue());
                component.set('v.labelToApi', res.getReturnValue());
                component.set('v.searchFieldLabels',fieldLabels);
            }
            helper.checkIfInitialized(component, event, helper);
        })
        $A.enqueueAction(getFieldLabelsAction);
    },


    getRecordsBySearchTerm: function(component, event, helper) {
        var searchTerms = component.find('lookupInput');
        console.log('----searchTerms----'+searchTerms);

        var searchTimeout = component.get('v.searchTimeout');
        var showRecentRecords = component.get('v.showRecentRecords');

        clearTimeout(searchTimeout);

        component.set('v.openMenu', true);
        component.set('v.searching', true);

        component.set('v.searchTimeout', setTimeout($A.getCallback(function() {
            if (!component.isValid()) {
                return;
            }

            var getRecordsAction = component.get('c.getRecords');
            var params = helper.getParams(component, event, helper);

            getRecordsAction.setParams({
                jsonString: JSON.stringify(params)
            });

            getRecordsAction.setCallback(this, function(res) {
                if (res.getState() === 'SUCCESS') {
                    var returnValue = JSON.parse(res.getReturnValue());
                    if (returnValue.isSuccess && returnValue.results.data.length > 0) { //&&  returnValue.results.searchTerm === component.find('lookupInput').getElement().value
                        var returnedRecords = [];
                        var returnedRecordsDisp = [];
                        var fieldHeaders = [];
                        var doNotDisp = component.get("v.dontDisp");
                        Object.keys(returnValue.results.data[0]).forEach(function(fieldName){
                            if(doNotDisp == null || doNotDisp.length == 0 || !doNotDisp.includes(fieldName)){
                                var fieldNameActual = fieldName === "value" ? "id" : fieldName;
                            	fieldHeaders.push(fieldNameActual);  
                            }
                            
                        });
                        component.set("v.fieldHeaders", fieldHeaders);

                        returnValue.results.data.forEach(function(record) {
                            var newRecordObj = [];
                            var newRecordObjDisp = [];
                            Object.keys(record).forEach(function(fieldName){
                                var fieldNameActual = fieldName === "value" ? "id" : fieldName;
                                newRecordObj.push({"fieldName" : fieldNameActual, "value" : record[fieldName]})
                                if(fieldHeaders.includes(fieldName)){
                                     newRecordObjDisp.push({"fieldName" : fieldNameActual, "value" : record[fieldName]})
                                }
                            })
                            returnedRecords.push(newRecordObj);
                            returnedRecordsDisp.push(newRecordObjDisp);
                        });

                        helper.setRecords(component, event, helper, returnedRecords);
                        component.set("v.recordsToDisp", returnedRecordsDisp); 
                        component.find("pagination").set("v.isLastPage", returnValue.results.data.length < component.get("v.limit"));
                    }
                    else{
                       // if(returnValue.results.data.length == 0){
                            var toastEvent = $A.get("e.force:showToast");
                            toastEvent.setParams({
                                title : 'Info',
                                message: 'Search results returned no matches.',
                                duration:' 5000',
                                key: 'info_alt',
                                type: 'info',
                                mode: 'dismissible'
                            });
        					toastEvent.fire();
                            component.set('v.searching', false); 
                        //}
                    }
                    //component.find("pagination").set("v.isLastPage", returnValue.results.data.length < component.get("v.limit"));
                } else {
                    console.log('--------here2-----');
                    helper.setRecords(component, event, helper, []);
                }
            });

            $A.enqueueAction(getRecordsAction);
        }), 200));
    },
    setRecords: function(component, event, helper, returnedRecords) {
        component.set('v.focusIndex', null);
        component.set('v.records', returnedRecords);
        component.set('v.searching', false);

        helper.openMenu(component, event, helper);
    },
    openMenu: function(component, event, helper) {
        component.set('v.openMenu', !component.get('v.disabled'));
    },
    closeMobileLookup: function(component, event, helper) {
        var inputs = component.find('lookupInput');
        for(var idx=0;idx<inputs.length;idx++) {
            inputs[idx].getElement().value = '';
        }
        $A.util.removeClass(component.find('lookup'), 'sl-lookup--open');
    },
    updateValueByFocusIndex: function(component, event, helper) {
        var focusIndex = component.get('v.focusIndex');

        if (focusIndex == null) {
            focusIndex = 0;
        }

        var records = component.get('v.records');

        if (focusIndex < records.length) {
            var nameToDisp = component.get("v.fieldToDisp");
            var objectType = component.get("v.object");

            component.set('v.value', records[focusIndex][records[focusIndex].length-1].value);
            var nameVal = records[focusIndex].find(function(field){
                return field.fieldName === nameToDisp;
            });

            var strikeEventLookup = component.getEvent("selectRecord");
            strikeEventLookup.setParams({data:records[focusIndex]});
            strikeEventLookup.fire();

            component.set('v.valueLabel', nameVal.value);
            component.set('v.valueSublabel', nameVal.value);

            var inputs = component.find('lookupInput');
            for(var idx=0;idx<inputs.length;idx++) {
                inputs[idx].getElement().value = '';
            }

            helper.closeMenu(component, event, helper);
        } else if (focusIndex === records.length) {
            helper.addNewRecord(component, event, helper);
        }

        helper.closeMobileLookup(component, event, helper);
    },
    addNewRecord: function(component, event, helper) {
        if (!component.get('v.allowNewRecords')) {
            return;
        }

        var addRecordEvent;
        var overrideNewEvent = component.get('v.overrideNewEvent');

        if (overrideNewEvent) {
            addRecordEvent = component.getEvent('strike_evt_addNewRecord');
        } else {
            addRecordEvent = $A.get('e.force:createRecord');

            addRecordEvent.setParams({
                entityApiName: component.get('v.object')
            });
        }
        addRecordEvent.fire();

        helper.closeMenu(component, event, helper);
    },
    moveRecordFocusUp: function(component, event, helper) {
        var openMenu = component.get('v.openMenu');

        if (openMenu) {
            var focusIndex = component.get('v.focusIndex');
            var options = component.find('lookupMenu').getElement().getElementsByTagName('tr');

            if (focusIndex === null || focusIndex === 0) {
                focusIndex = options.length - 1;
            } else {
                --focusIndex;
            }

            component.set('v.focusIndex', focusIndex);
        }
    },
    moveRecordFocusDown: function(component, event, helper) {
        var openMenu = component.get('v.openMenu');

        if (openMenu) {
            var focusIndex = component.get('v.focusIndex');
            var options = component.find('lookupMenu').getElement().getElementsByTagName('li');

            if (focusIndex === null || focusIndex === options.length - 1) {
                focusIndex = 0;
            } else {
                ++focusIndex;
            }

            component.set('v.focusIndex', focusIndex);
        }
    }
})
/*Copyright 2017 Appiphony, LLC

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the 
following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following 
disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following 
disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote 
products derived from this software without specific prior written permission. 

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE 
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.*/