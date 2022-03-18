jQuery( function($){
    CCRZ.uiProperties.loginView.desktop.tmpl = CCRZ.templates.CCB2B_SiteLoginDesktopTemplate;

    CCRZ.pubSub.once('view:loginView:refresh', function(loginView) {
        var imageUrl = CCRZ.pagevars.pageConfig['sc.loginpagebackground'];
        loginView.$el.find('#login_panel').css('background','url('+imageUrl+')');
    });

    CCRZ.pubSub.once("ccb2b:forgotPasswordExtension", function() {
        var emailContainer = $('.cc_forgot_password_panel .form-group > .col-sm-5');
        var emailInput = emailContainer.children();
        var errorDialog = '<div class="invalid_email_div">'+CCRZ.pagevars.pageLabels['CCB2B_Login_InvalidEmail']+'</div>';
        var resetPasswordButton = $('.btn.btn-default.btn-sm.cc_submit');
        resetPasswordButton.on('click', function(e){
            var isValid = validateEmail(emailInput, true);
                if(!isValid){
                   if($('.invalid_email_div').length==0){
                       emailContainer.append(errorDialog);
                   }
                   e.preventDefault();
                }
        });
        emailInput.on('keyup', function(e){
            var isValid = validateEmail(emailInput, false);
            if(isValid){
               var invalidEmailDiv = $('.invalid_email_div');
               if(invalidEmailDiv.length!=0){
                   $(emailInput).removeClass('error_input');
                   invalidEmailDiv.remove();
               }
            }
        });
    });

    if(CCRZ.CCB2B_FooterMenuComponentView)
         CCRZ.CCB2B_FooterMenuComponentView = new CCRZ.views.CCB2B_FooterMenuComponentView();
});