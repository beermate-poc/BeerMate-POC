Handlebars.registerHelper('setLink', function(label, link, newTab) {
    var target = newTab ? " target='_blank'" : "";
    return "<a href='" + CCRZ.processPageLabelMap(link) + "'" + target + ">" + CCRZ.processPageLabelMap(label) + "</a>";
});

Handlebars.registerHelper('generateId', function(preText, name, postText) {
    if(typeof name == 'number'){
         return preText + name + postText;
    }
    else{
        if(typeof postText == 'string'){
            return preText + name.split(" ").join("").toLowerCase() + postText;
        } else{
            return preText + name.split(" ").join("").toLowerCase();
        }
    }
});
// Override of OOTB helper to create country dropdown
Handlebars.registerHelper("selectGeo", function(name, entries, value, styleClass, prefix, placeholder) {
    var fullStyles = styleClass + " " + prefix + "Field " + prefix + name;
    var fullName = '';
    if (prefix && (prefix.indexOf('.', prefix.length - 1) !== -1))
        fullName = prefix + name;
    else
        fullName = prefix + 'Address.' + name;
    if (entries && entries.length > 0) {
        var buffer = "<select required name='" + fullName + "Code' class='" + fullStyles + "'>";

        // Add default unselectable value
        if (entries.length > 1) {
            buffer = buffer.replace('>',' aria-invalid="true">');
            buffer += "<option value='' disabled selected hidden>"
                + CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_CountryPlaceHolder'] + "</option>";
        }
        for (var i = 0, j = entries.length; i < j; i++) {
            buffer += "<option value='" + entries[i].value + "'";
            if (value && value == entries[i].value)
                buffer += " selected";
            buffer += ">" + entries[i].label + "</option>";
        }
        buffer += "</select>";
        return buffer;
    } else {
        var buffer2 = "<input name='" + fullName + "' class='" + fullStyles + "' value='" + value + (placeholder ? "' placeholder='" + placeholder : "") + "' maxLength='255'>";
        return buffer2;
    }
});

Handlebars.registerHelper('localeString', function() {
    let locale = CCRZ.pagevars.userLocale.indexOf('fr')>-1 ? false : true;
    return locale;
});

Handlebars.registerHelper('displayFooterLogo',function(){
    const imgStr = `<img src="${CCRZ.pagevars.themeBaseURL}images/molson_footer_logo.svg" alt="My Molson Coors" class="footer-logo" />`;
    return new Handlebars.SafeString(imgStr);
});

Handlebars.registerHelper('displayHeaderLogo',function(){
    const imgStr = `<img src="${CCRZ.pagevars.themeBaseURL}images/mmc_logo.png" alt="My Molson Coors" class="branding_logo" />`;
    return new Handlebars.SafeString(imgStr);
});

Handlebars.registerHelper('isLogoClickable', function(options) {
    var currPage = CCRZ.pagevars.currentPageName.toLowerCase();
    if (currPage != 'ccrz__CCChangePassword'.toLowerCase() &&
        currPage != 'ccrz__CCSiteLogin'.toLowerCase()) {
         return options.fn(this);
    } else {
         return options.inverse(this);
    }
});