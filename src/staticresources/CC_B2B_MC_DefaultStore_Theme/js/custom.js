function goTo(url){
    if(url.startsWith('https://') || url.startsWith('http://')) {
        window.location.assign(url);
    } else if(url.startsWith('www')) {
        window.location.assign('https://' + url);
    } else {
        window.location.assign(prepareCCB2BURL(url));
    }
}
function prepareCCB2BURL(url) {
    var sign = '?';
    var cartParam = '';
    var currentSite = CCRZ.pagevars.currSiteURL;
    var CSRQueryString = getCSRQueryString();
    var containsQuestionMark = false;

    if(url.indexOf(sign) >= 0) {
        sign = '&';
        containsQuestionMark = true;
    }
    if(CCRZ.pagevars.currentCartID != null) {
        cartParam = sign + 'cartId=' + CCRZ.pagevars.currentCartID;
        containsQuestionMark = true;
    }
    if(containsQuestionMark == false && CSRQueryString.indexOf('&') == 0) {
        CSRQueryString = CSRQueryString.replace('&', '?');
    }

    return currentSite + url + cartParam + CSRQueryString;
}
//Method to set cookie
function setCookie(name, value, days) {
    var d = new Date;
    d.setTime(d.getTime() + 24*60*60*1000*days);
    document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
//Method to get cookie
function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

function validateEmail(email, editClass){
    var result = false;
    var emailVal = (email) ? email.val().trim() : '';
    if(emailVal){
        var email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])[^.]/i;
        result = email_regex.test(emailVal);
    }
    if(editClass){
        (result) ? $(email).removeClass('error_input') : $(email).addClass('error_input');
    }
    return result;
}

function validatePhone(phoneNumber, country) {
    var phoneNumberVal = (phoneNumber) ? phoneNumber.val().trim() : '',
        phoneNumberRegex = /\D+/g;

    if (country === 'GB') {
        phoneNumberRegex = /[^\d.-]+/g;
    }
    return phoneNumberVal.replace(phoneNumberRegex, '');
}

function getValidSapNumber(sapNumber){
    var sapNumberVal = (sapNumber) ? sapNumber.val().trim() : '',
        sapNumber_regex = /\D+/g;
    return sapNumberVal.replace(sapNumber_regex,'');
}

//Method to show cover loading
function showOverlay() {
    $("#customOverlay").show();
}
//Method to hide cover loading
function hideOverlay() {
    $("#customOverlay").hide();
}
//checks if array contains a value
function checkIfInArray(array, value) {
    return array.indexOf(value) >= 0;
}
/************************
* CLOUD CRAZE OVERRIDES *
************************/
CCRZ.util.template = function(template) {
    var templateType = typeof(template);
    var source = '';

    switch(templateType) {
        case 'function':
            return template;
        case 'string':
            source = $('#' + template).html();
            source = _.isUndefined(source) ? '' : source;
            return Handlebars.compile(source);
    }
};
