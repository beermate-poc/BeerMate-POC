jQuery(function ($) {
    CCRZ.uiProperties.newCustomerView.desktop.tmpl = CCRZ.templates.CCB2B_SiteRegisterDesktopTemplate;

    CCRZ.pubSub.once('view:newCustomerView:refresh', function (loginView) {

        $(' #localeString').addClass('register');
        loginView.preRender = CCRZ.subsc.registerSite.preRender;
        loginView.renderDesktop = CCRZ.subsc.registerSite.renderDesktop;
        loginView.getURLParameter = CCRZ.subsc.registerSite.getURLParameter;
        loginView.initValidationDesktop = CCRZ.subsc.registerSite.initValidationDesktop;
        loginView.submit = CCRZ.subsc.registerSite.submit;
        loginView.highlight = CCRZ.subsc.registerSite.highlight;
        loginView.unhighlight = CCRZ.subsc.registerSite.unhighlight;
        loginView.enableUsernameValidation = CCRZ.subsc.registerSite.enableUsernameValidation;
        loginView.handleEmailAddress = CCRZ.subsc.registerSite.handleEmailAddress;
        loginView.handlePhoneNumber = CCRZ.subsc.registerSite.handlePhoneNumber;
        loginView.handleSapNumber = CCRZ.subsc.registerSite.handleSapNumber;
        loginView.goToLogin = CCRZ.subsc.registerSite.goToLogin;
        loginView.addAccountsChecked = CCRZ.subsc.registerSite.addAccountsChecked;
        loginView.addAccountInput = CCRZ.subsc.registerSite.addAccountInput;
        loginView.changeCountryCode = CCRZ.subsc.registerSite.changeCountryCode;
        loginView.changePhoneCountryCode = CCRZ.subsc.registerSite.changePhoneCountryCode;
        loginView.setConfigPerCountry = CCRZ.subsc.registerSite.setConfigPerCountry;
        loginView.setupValidationMessages = CCRZ.subsc.registerSite.setupValidationMessages;
        loginView.setupValidationRules = CCRZ.subsc.registerSite.setupValidationRules;
        loginView.setPhoneCountryCode = CCRZ.subsc.registerSite.setPhoneCountryCode;
        loginView.checkAdditionalAccountRequested = CCRZ.subsc.registerSite.checkAdditionalAccountRequested;
        loginView.delegateEvents(_.extend(loginView.events,
            {
                "input .sapNumberInput": "handleSapNumber",
                "input .cc_phone": "handlePhoneNumber",
                "click .goToLogin": "goToLogin",
                "click .addAccCheck": "addAccountsChecked",
                "click .addAccountInput": "addAccountInput",
                "change #phoneCountryCode": "changeCountryCode",
                "change #country": "setConfigPerCountry"
            }
        ));
        loginView.render();

        //overwrite registerUser method
        if (CCRZ.newCustomerModel) {
            CCRZ.newCustomerModel.registerUser = function (newCustomerFormData, callback) {
                var model = this;
                model.invokeContainerLoadingCtx($('.deskLayout'), 'registerUser',
                    {newCustomerFormJSON: newCustomerFormData},
                    function (response) {
                        model.set(model.parse(response.data));
                        if (callback) {
                            callback(response);
                        }
                    },
                    {
                        buffer: false,
                        timeout: 120000
                    }
                );
            }
        }
    });

    CCRZ.subsc = CCRZ.subsc || {};

    CCRZ.subsc.registerSite = {
        preRender: function (state, country) {
            var view = this,
                countryList = view.model.get('countryList'),
                newCountryList = [],
                countryIsoCode = CCRZ.getPageConfig('reg.countryisocode').split(';');
            $.each(countryList, function (index, item) {
                if (checkIfInArray(countryIsoCode, item.value)) {
                    item.label = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_CountryLabel_' + item.value];
                    newCountryList.push(item);
                    return;
                }
            });
            newCountryList.reverse();
            view.model.set('countryList', newCountryList);
        },
        renderDesktop: function () {
            var v = this;
            v.$el.html('');
            v.setElement($(CCRZ.uiProperties.newCustomerView.desktop.selector));
            if (v.getURLParameter('registrationSuccess') == 'true') {
                v.model.set("registrationSuccess", true);
            }
            if (v.getURLParameter('multiaccount') == 'true') {
                v.model.set("additionalAccountRequested", true);
            }
            if (v.getURLParameter('countrycode') == 'CA'){
                v.model.set("countryCode", 'CA');
            }

            v.$el.html(v.templateDesktop(v.model.toJSON()));
            v.renderStateLists();
            v.initValidationDesktop();
            v.setPhoneCountryCode();
            v.changeCountryCode();
            jQuery('.addAccountDiv').hide();
        },
        initValidationDesktop: function () {
            var v = this;
            jQuery('#newCustomerForm').validate({
                invalidHandler: function (event, validator) {
                    if (!CCRZ.disableAdaptive) {
                        CCRZ.handleValidationErrors(event, validator, 'error_messages_section', false);
                    }
                },
                rules: v.setupValidationRules(),
                messages: v.setupValidationMessages(),
                errorElement: "em",
                errorPlacement: function (error, element) {
                    // Needed for bootstrap 3 (per validator documentation)
                    if (CCRZ.disableAdaptive) {
                        error.addClass("help-block");
                        if (element.prop("type") === "checkbox") {
                            error.insertAfter(element.next("label"));
                            element.addClass('error');
                        } else {
                            error.insertAfter(element);
                        }
                    }
                },
            });
            v.enableUsernameValidation();
        },
        highlight: function (element, errorClass, validClass) {
            if (CCRZ.disableAdaptive) {
                $(element).parents(".form-elem").addClass("has-error").removeClass("has-success");
            }
        },
        unhighlight: function (element, errorClass, validClass) {
            if (CCRZ.disableAdaptive) {
                $(element).parents(".form-elem").addClass("has-success").removeClass("has-error");
            }
        },
        checkEmailsMatching: function () {
            var v = CCRZ.newCustomerView,
                username = v.$el.find("#username"),
                usernameVal = (username.val()).trim(),
                confirmUsername = v.$el.find("#confirmUsername"),
                confirmUsernameVal = (confirmUsername.val()).trim(),
                errorMsgSection = v.$el.find(".additionalErrorMsg");
            errorMsgSection.hide();
            if (!username || !confirmUsername || username === "" || confirmUsername === "" || usernameVal !== confirmUsernameVal) {
                var pageLabel = 'CCB2B_SiteRegister_EmailDoNotMatch_Msg';
                errorMsgSection.html(CCRZ.pagevars.pageLabels[pageLabel]);
                username.addClass("error");
                confirmUsername.addClass("error");
                errorMsgSection.show();
                return false;
            }
            // Check if emails are valid
            else if (!validateEmail(username, false) || !validateEmail(confirmUsername, false)) {
                return false;
            } else {
                return true;
            }
        },
        addAccountsChecked: function (event){
            $('.radio-btn-selected').removeClass('radio-btn-selected');
            $(event.currentTarget).addClass('radio-btn-selected');
            if($('.radio-btn-selected').val() == CCRZ.pagevars.pageLabels['Yes']){
                 let counter = 0;
                 let elStr = `
                    <div class="form-group col-xs-12">
                      <div class="form-elem"><input id="cc_additional_account-${counter}" name="additionalAccounts" type="text" class="form-control cc_additional_account " value="" onfocus="myFocus(this);" onblur="myBlur(this);"></div>
                    </div>
                 `
                let el = jQuery(elStr);
                jQuery('.addedAccountsContainer').append(el);
                jQuery('.addAccountDiv').show();
            }else {
                jQuery('.addedAccountsContainer').empty();
                jQuery('.addAccountDiv').hide();
            }
            CCRZ.subsc.registerSite.checkAdditionalAccountRequested();
        }
        ,
        checkAdditionalAccountRequested : function(reset){
            if($('.radio-btn-selected').val() || reset){
                $('.additionalAccountAction').removeClass('error_input');
                $('.additionalAccountRequestedError').hide();
            }else{
                $('.additionalAccountAction').addClass('error_input');
                $('.additionalAccountRequestedError').show();
            }
        }
        ,
        addAccountInput:  function (e){
             let counter = jQuery('.cc_additional_account').length;
             let elStr = `
                    <div class="form-group col-xs-12">
                      <div class="form-elem"><input id="cc_additional_account-${counter}" name="additionalAccounts" type="text" class="form-control cc_additional_account " value="" onfocus="myFocus(this);" onblur="myBlur(this);"></div>
                    </div>
             `
            let el = jQuery(elStr);
            jQuery('.addedAccountsContainer').append(el);
         }
         ,
        submit: function (event) {
            showOverlay();
            let v = this;
            let errorMsgSection = v.$el.find(".error_messages_section");
            document.getElementById('error_msg').innerHTML = '';
            errorMsgSection.hide();
            v.checkAdditionalAccountRequested();
            if (jQuery('#newCustomerForm').valid() && CCRZ.subsc.registerSite.checkEmailsMatching() && $('.radio-btn-selected').val()) {
                var newCustomerJSON = jQuery('#newCustomerForm').serializeObject();
                //join country code and phone number
                if (newCustomerJSON.primaryPhoneROI) {
                    newCustomerJSON.primaryPhone = newCustomerJSON.phoneCountryCode + newCustomerJSON.primaryPhoneROI;
                } else if (newCustomerJSON.primaryPhoneUK) {
                    newCustomerJSON.primaryPhone = newCustomerJSON.phoneCountryCode + newCustomerJSON.primaryPhoneUK;
                } else if (newCustomerJSON.primaryPhoneCA) {
                    newCustomerJSON.primaryPhone = newCustomerJSON.phoneCountryCode + newCustomerJSON.primaryPhoneCA;
                }
                if(newCustomerJSON.postalCode){
                    newCustomerJSON.postalCode = newCustomerJSON.postalCode.replace(/\s/g,'');
                }
                if(newCustomerJSON.sapNumber){
                    newCustomerJSON.sapNumber = Number(newCustomerJSON.sapNumber).toString();
                }
                let addAccLen = $('[name="additionalAccounts"]').length;
                if(addAccLen>0){
                    newCustomerJSON.additionalAccountRequested = "on";
                }
                if(addAccLen==1){
                    let addAccArr = [  $('[name="additionalAccounts"]').val() ];
                    newCustomerJSON.additionalAccounts = addAccArr;
                }
                //CCRZ-2145 Tax Exempt not working
                //checkbox will have a value of undefined if unchecked, and true if checked.
                if (!newCustomerJSON.taxExemptFlag) {
                    newCustomerJSON.taxExemptFlag = false;
                } else {
                    newCustomerJSON.taxExemptFlag = true;
                }
                newCustomerJSON.userLocale = CCRZ.pagevars.userLocale;
                let additionalAccountRequested = newCustomerJSON.additionalAccountRequested;
                v.model.registerUser(JSON.stringify(newCustomerJSON), function (response) {
                    if (response && response.success) {
                        if (CCRZ.getPageConfig('UR.DirLogin', false)) {
                            hideOverlay();
                            v.model.doLogin(newCustomerJSON.username, newCustomerJSON.NewPassword);
                        } else {
                            let countryCode = $("[name='Address.countryCode']").val();
                            if(additionalAccountRequested) {
                                window.location.href = CCRZ.pagevars.currSiteURL + 'ccrz__CCSiteRegister?registrationSuccess=true' + '&multiaccount=true' +'&countrycode='+countryCode + getCSRQueryString();
                            }else{
                                window.location.href = CCRZ.pagevars.currSiteURL + 'ccrz__CCSiteRegister?registrationSuccess=true' +'&countrycode='+countryCode + getCSRQueryString();
                            }
                        }
                    } else {
                        window.scrollTo(0, 0);
                        hideOverlay();
                        CCRZ.pageMessagesView.trigger(response);
                    }
                });
            } else {
                hideOverlay();
                document.body.scrollTop = document.documentElement.scrollTop = 0;
                // Default HTML form countryMsg workaround
                var countryError = $("#country em"),
                    language = navigator.language;
                if (countryError) {
                    var label = checkIfInArray(language, 'fr') || checkIfInArray(language, 'CA') ?
                        CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Registration_Unsuccessful_CA'] : CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Country_Required'];
                    countryError[0].innerText = label;
                }
            }
        },
        enableUsernameValidation: function () {
            var username = $('input.cc_username'),
                view = this,
                SIGN_COUNT = 60;
            username.on('keyup focusout', function (event) {
                if (event.type === 'keyup' && username.val().length <= SIGN_COUNT) {
                    view.handleEmailAddress(event);
                } else if (event.type === 'focusout' && username.val().length > SIGN_COUNT) {
                    view.handleEmailAddress(event);
                }
            });
        },
        handleEmailAddress: function (event) {
            var emailInput = $(event.currentTarget);
            var isValid = validateEmail(emailInput, false),
                errorMessage = emailInput.siblings();
            if (!isValid && emailInput.val().trim() !== '') {
                emailInput[0].classList.add('errorBorder');
                emailInput[0].setAttribute('aria-invalid', 'true');
                errorMessage.show();
            } else {
                emailInput[0].classList.remove('errorBorder');
                emailInput[0].setAttribute('aria-invalid', 'false');
                errorMessage.hide();
            }
        },
        handlePhoneNumber: function (event) {
            var phoneNumberInput = $(event.currentTarget),
                country = (document.getElementsByName("Address.countryCode")[0]) ? document.getElementsByName("Address.countryCode")[0].value : undefined;
            phoneNumberInput.val(validatePhone(phoneNumberInput, country));
        },
        handleSapNumber: function (event) {
            var sapNumberInput = $(event.currentTarget);
            sapNumberInput.val(getValidSapNumber(sapNumberInput));
        },
        getURLParameter: function (name) {
            return decodeURI(
                (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
            );
        },
        goToLogin: function () {
            window.location.href = CCRZ.pagevars.currSiteURL + 'ccrz__CCSiteLogin';
        },
        changeCountryCode: function () {
            var countryCode = document.getElementsByName("phoneCountryCode")[0],
                country = document.getElementsByName("Address.countryCode")[0],
                countryCodeROI = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_CountryCode_ROI'],
                phoneUK = $('#primaryPhoneUK'),
                phoneROI = $('#primaryPhoneROI'),
                phoneCA = $('#primaryPhoneCA'),
                phoneDefault = $('#primaryPhoneDefault'),
                phoneCode = $('#phoneCountryCode');

            var lastPhone;
            if (phoneUK.val() !== '') {
                lastPhone = phoneUK.val();
            } else if (phoneCA.val() !== '') {
                lastPhone = phoneCA.val();
            } else if (phoneROI.val() !== '') {
                lastPhone = phoneROI.val();
            }

            if (countryCode && country) {
                countryCode = countryCode.value;
                country = country.value;
                if (countryCode == countryCodeROI) {
                    phoneROI.val(lastPhone).show();
                    phoneCode.prop('disabled', false);
                    phoneUK.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneUK-error").hide();
                    phoneCA.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneCA-error").hide();
                    phoneDefault.removeAttr('aria-required').hide();
                } else if (country == 'CA') {
                    phoneCA.val(lastPhone).show();
                    phoneCode.prop('disabled', false);
                    phoneROI.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneROI-error").hide();
                    phoneUK.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneUK-error").hide();
                    phoneDefault.removeAttr('aria-required').hide();
                } else if (country == 'GB') {
                    phoneUK.val(lastPhone).show();
                    phoneCode.prop('disabled', false);
                    phoneROI.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneROI-error").hide();
                    phoneCA.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneCA-error").hide();
                    phoneDefault.removeAttr('aria-required').hide();
                } else if (country == '') {
                    phoneDefault.show();
                    phoneCA.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneCA-error").hide();
                    phoneROI.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneROI-error").hide();
                    phoneUK.val('').removeAttr('aria-required').hide();
                    $("#primaryPhoneUK-error").hide();
                    phoneCode.val('');
                }
            }
        },
        setConfigPerCountry: function () {
            var v = this;
            var validation = $('#newCustomerForm').validate();
            validation.resetForm();
            validation.settings.rules = v.setupValidationRules();
            validation.settings.messages = v.setupValidationMessages();
            v.setPhoneCountryCode();
            v.changeCountryCode();
            v.checkAdditionalAccountRequested(true);
        },
        setupValidationMessages: function () {
            var firstNameMsg, lastNameMsg, phoneCountryCodeMsg, primaryPhoneROIMsg, primaryPhoneUKMsg,
                primaryPhoneCAMsg, postalCodeMsg, usernameMsg,
                confirmUsernameMsg, sapNumberMsg, countryMsg, termsAcceptMsg, privacyAcceptMsg, multiAccountValueMsg,
                country = document.getElementsByName("Address.countryCode")[0],
                language = navigator.language;
            if (country && country.value != '') {
                if (country.value == 'CA') {
                    firstNameMsg = lastNameMsg = phoneCountryCodeMsg = primaryPhoneROIMsg = primaryPhoneUKMsg = primaryPhoneCAMsg = postalCodeMsg = usernameMsg =
                        confirmUsernameMsg = sapNumberMsg = countryMsg = termsAcceptMsg = privacyAcceptMsg = multiAccountValueMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Registration_Unsuccessful_CA'];
                } else if (country.value == 'GB') {
                    firstNameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_FirstName_Required'];
                    lastNameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_LastName_Required'];
                    phoneCountryCodeMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_CountryCodePhone_Required'];
                    primaryPhoneROIMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PhoneNumber_Required'];
                    primaryPhoneUKMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PhoneNumber_Required'];
                    primaryPhoneCAMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PhoneNumber_Required'];
                    postalCodeMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PostCode_Required'];
                    usernameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_EmailAddress_Required'];
                    confirmUsernameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_ConfirmEmailAddress_Required'];
                    sapNumberMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_SAPAccountNumber_Required'];
                    countryMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Country_Required'];
                    termsAcceptMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_AcceptTerms_Required'];
                    privacyAcceptMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_AcceptPrivacy_Required'];
                    multiAccountValueMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_MultipleAccountError'];
                }
            } else {
                if (checkIfInArray(language, 'fr') || checkIfInArray(language, 'CA')) {
                    firstNameMsg = lastNameMsg = phoneCountryCodeMsg = primaryPhoneROIMsg = primaryPhoneUKMsg = primaryPhoneCAMsg = postalCodeMsg = usernameMsg =
                        confirmUsernameMsg = sapNumberMsg = countryMsg = termsAcceptMsg = privacyAcceptMsg = multiAccountValueMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Registration_Unsuccessful_CA'];
                } else {
                    firstNameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_FirstName_Required'];
                    lastNameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_LastName_Required'];
                    phoneCountryCodeMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_CountryCodePhone_Required'];
                    primaryPhoneROIMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PhoneNumber_Required'];
                    primaryPhoneUKMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PhoneNumber_Required'];
                    primaryPhoneCAMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PhoneNumber_Required'];
                    postalCodeMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_PostCode_Required'];
                    usernameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_EmailAddress_Required'];
                    confirmUsernameMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_ConfirmEmailAddress_Required'];
                    sapNumberMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_SAPAccountNumber_Required'];
                    countryMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Country_Required'];
                    termsAcceptMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_AcceptTerms_Required'];
                    privacyAcceptMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_AcceptPrivacy_Required'];
                    multiAccountValueMsg = CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_MultipleAccountError'];
                }
            }

            var validationMessages =  {
                      firstName       : { required : firstNameMsg},
                      lastName       : { required : lastNameMsg},
                      phoneCountryCode      : { required : phoneCountryCodeMsg},
                      primaryPhoneROI      : { required : primaryPhoneROIMsg, minlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Min_NumberErrorMsg']), maxlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Max_NumberErrorMsg'])},
                      primaryPhoneUK      : { required : primaryPhoneUKMsg, minlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Min_NumberErrorMsg']), maxlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Max_NumberErrorMsg'])},
                      primaryPhoneCA      : { required : primaryPhoneCAMsg, minlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Min_NumberErrorMsg']), maxlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Max_NumberErrorMsg'])},
                      postalCode       : { required : postalCodeMsg},
                      username       : { required : usernameMsg},
                      confirmUsername       : { required : confirmUsernameMsg},
                      sapNumber       : { required : sapNumberMsg},
                      country       : { required : countryMsg},
                      termsAccept       : { required : termsAcceptMsg},
                      privacyAccept       : { required : privacyAcceptMsg},
                      primaryPhoneCA      : { required : primaryPhoneCAMsg, minlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Min_NumberErrorMsg']), maxlength : jQuery.validator.format(CCRZ.pagevars.pageLabels['CCB2B_SiteRegister_Max_NumberErrorMsg'])},
                      additionalAccounts        : { required : multiAccountValueMsg},
            };
            return validationMessages;
        },
        setupValidationRules: function () {
            var validationRules = {
                firstName: {required: true},
                lastName: {required: true},
                phoneCountryCode: {required: true},
                primaryPhoneROI: {required: true, minlength: 8, maxlength: 9, digits: true},
                primaryPhoneUK: {required: true, minlength: 9, maxlength: 10, digits: true},
                primaryPhoneCA: {required: true, minlength: 10, maxlength: 10, digits: true},
                postalCode: {required: true},
                username: {required: true, email: false},
                confirmUsername: {required: true, email: false},
                sapNumber: {required: true},
                country: {required: true},
                termsAccept: {required: true},
                privacyAccept: {required: true},
                additionalAccounts: {required: true}
            };
            return validationRules;
        },
        setPhoneCountryCode: function () {
            var dropdown = $('#phoneCountryCode');
            dropdown.empty();
            var country = document.getElementsByName("Address.countryCode")[0];
            if (country) {
                var phoneCountryCodeConfig = CCRZ.getPageConfig('reg.phonecountrycode').split(';');
                $.each(phoneCountryCodeConfig, function (index, item) {
                    if (checkIfInArray(item, country.value)) {
                        var phoneCountryCodes = item.split(':')[1];
                        $.each(phoneCountryCodes.split(','), function (index, v) {
                            dropdown.append(new Option(v, v));
                        });
                    }
                });
            }
        }
    }

    if (CCRZ.CCB2B_FooterMenuComponentView)
        CCRZ.CCB2B_FooterMenuComponentView = new CCRZ.views.CCB2B_FooterMenuComponentView();

});