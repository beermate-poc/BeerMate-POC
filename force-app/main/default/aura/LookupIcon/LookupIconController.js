/**
 * Created by alexandria.sanborn on 1/8/2019.
 */
({

    openModal : function(component, event, helper){
        var idx = component.get("v.index");
        var lkup = component.get("v.lookupObj");

        var strikeEventLookup = component.getEvent("openModal");
        strikeEventLookup.setParams({data:{index:idx, lookup:lkup}});
        strikeEventLookup.fire();
    }
})