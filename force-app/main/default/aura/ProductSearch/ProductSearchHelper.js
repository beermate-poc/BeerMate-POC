({
	onSearchChange : function(component) {
		try{
			if (component.get('v.showMenu')) {
				var spinner = component.find('autoCompleteSpinner');
				$A.util.removeClass(spinner, 'slds-hide');
				component.set('v.loading', true);
				var display = component.get('v.Identifier');
				var filterString = '';
				if(display == 'brandLookup'){
					filterString = JSON.stringify(component.get('v.filters'))
				} else if(display == 'materialLookup' || display == 'contactLookup'){
					filterString = JSON.stringify(component.get('v.filters'));
					filterString = '[' + filterString + ']';
				} else {
					filterString = JSON.stringify(component.get('v.filters'))
				}
				var action = component.get("c.retrieveSearchResults");
				action.setParams({ 
					objectName : component.get('v.object'), 
					search: component.get('v.searchValue'), 
					fieldName: component.get('v.field'),
					filters: component.get('v.filters') != null ? filterString : null,
					subField: component.get('v.subField')
				});
				action.setCallback(this, function(response) {
					var state = response.getState();
					var spinner = component.find('autoCompleteSpinner');
					$A.util.addClass(spinner, 'slds-hide');
					component.set('v.loading', false);
					if (state === "SUCCESS") {
						if (response.getReturnValue().length > 0) {
							var results = response.getReturnValue().map(function(property) {
								var JSONproperty = JSON.parse(property);
								if (component.get('v.aggregateSELECT') != null && typeof component.get('v.aggregateSELECT') != 'undefined') {
									JSONproperty.aggregateDisplay == null ? JSONproperty.aggregateDisplay = '(0)' : JSONproperty.aggregateDisplay = '(' + JSONproperty.aggregateDisplay + ')';
								} else {
									JSONproperty.aggregateDisplay = '';
								}
								if (component.get('v.subField') != null) {
									JSONproperty.subFieldValue = JSONproperty[component.get('v.subField')];
								}
								return JSONproperty;
							});
							component.set('v.noResults', false);
							component.set('v.results', results);
						} else {
							component.set('v.noResults', true);
							component.set('v.results', []);
						}
					} else if (state === "ERROR") {
						var errors = response.getError();
						if (errors) {
							if (errors[0] && errors[0].message) {
								console.log("Error message: " + 
										errors[0].message);
								alert(errors[0].message);
							}
						} else {
							console.log("Unknown error");
							alert('An error has occured. Please refresh the screen');
						}
					}
				});
				$A.enqueueAction(action);
			} else {
				component.set('v.showMenu', true);
			}
		} catch(e){
			console.error(e);
		}
	},
	onSelectOption : function(component, element) {
		component.set('v.showMenu', false);
		component.set('v.searchValue', element.firstChild.firstChild.innerText);
		component.set('v.selectedId', element.id);
		var setEvent = component.getEvent("setSearchAttr");
		setEvent.setParams({"attributeValue": element.firstChild.firstChild.innerText});
		setEvent.setParams({"identifier": component.get('v.Identifier')});
		setEvent.setParams({"id": component.get('v.selectedId')});
		setEvent.fire();
		//Packages are only showing a few pages we dont want to populate this all the time
		 var populatePackages = component.get("v.showPkg");
		if(populatePackages == true){
			this.populatePackages(component,event);
		}
	},
    
	clearOut: function(component) {
            component.set('v.noResults', false);
		component.set('v.showMenu', false);
		component.set('v.results', []);
	},
	populatePackages: function(component, event){
		try{
			if(component.get('v.searchValue') != null && component.get('v.searchValue') != ''){
			    var brandName = component.get('v.searchValue').trim();
		        if (component.get('v.isOffPremise')) {
                    if(component.get('v.field')=='TrademarkBrandLongNme__c')
                    {
                        if(component.get('v.fromScreen')=='chainActivity'){
                            var action = component.get('c.retrieveCAPackageOffPremise');
                        }
                        else{
                            var action = component.get('c.retrievePackageOffPremise');
                        }
                    }
						
                    if(component.get('v.field')=='CmrclPlanningBrandGroupNme__c')
                        var action = component.get('c.retrievePackageOffPremisegroup');
                    if(component.get('v.field')=='TrademarkBrandFamilyNme__c')
                        var action = component.get('c.retrievePackageOffPremiseFamily');
                } else {
                    if(component.get('v.field')=='TrademarkBrandLongNme__c')
                    {
                        if(component.get('v.fromScreen')=='chainActivity')
                            var action = component.get('c.retrievePackageChainCreation');
                         else
                       		var action = component.get('c.retrievePackage');
                    }
                   
                      if(component.get('v.field')=='CmrclPlanningBrandGroupNme__c')
                            var action = component.get('c.retrievePackagegroup');
                        if(component.get('v.field')=='TrademarkBrandFamilyNme__c')
                            var action = component.get('c.retrievePackageFamily');
                }
                action.setParams({ brandName : brandName });
                action.setCallback(this, function(response) {
                    if (response.getState() === "SUCCESS") {
						if (response.getReturnValue().length > 0) {
							var results = response.getReturnValue().map(function(property) {
								return JSON.parse(property);
							});
							component.set('v.isDisablePkg', false);
                            var presentPackages = [];
                            if(component.get("v.packages") && component.get("v.packages") != '' && component.get("v.packages") != null && component.get("v.isFromObjectivesPage")){
                                presentPackages = component.get("v.packages");
                                //alert(presentPackages);
                                results.forEach(function irterator(item){
                                    var notFound = true;
                                    (component.get("v.packages")).forEach(function callback(pid){
                                        if(item.Id == pid.Id ){
                                          //console.log('Match found------/////');
                                          notFound = false;
                                          //break;
                                        }
                                    });
                                    
                                    if(notFound){
                                    	presentPackages.push(item);
                                    }
                                })
                                
                                component.set("v.packages", presentPackages);
                            }else{
                            	//alert('Else Part');
								component.set('v.packages', results);
                            }
						} else {
							component.set('v.isDisablePkg', true);
							component.set('v.packages', []);
						}
		            } else if (response.getState() === "ERROR") {
		                console.log("Errors", response.getError());
		            }
		        });
		       $A.enqueueAction(action);
		    }
		} catch(e){
			console.error(e);
		}
	},
	setPackage : function(component, event, helper){
		var brand = component.find("selectOptions").get('v.value');
		component.set('v.selectedValue', brand);
	}
})