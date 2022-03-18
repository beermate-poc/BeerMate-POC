jQuery( function($){
    CCRZ.uiProperties.Menu.desktop.tmpl = CCRZ.templates.CCB2B_HeaderMenuComponentTemplate;
    CCRZ.pubSub.once('view:Menu:refresh', function(menuView) {
        menuView.preRender = function() {
            Handlebars.registerPartial("subMenuItem", CCRZ.templates.CCB2B_HeaderSubMenuComponentTemplate);
        };

        CCRZ.menuView.changeLocale = CCRZ.subsc.menuEvents.changeLocale;
        CCRZ.menuView.goToMyAccount = CCRZ.subsc.menuEvents.goToMyAccount;
        CCRZ.menuView.doLogout = CCRZ.subsc.menuEvents.doLogout;
        CCRZ.menuView.showSubMenu = CCRZ.subsc.menuEvents.showSubMenu;
        CCRZ.menuView.hideSubMenu = CCRZ.subsc.menuEvents.hideSubMenu;
        CCRZ.menuView.showSubMenuTablet = CCRZ.subsc.menuEvents.showSubMenuTablet;
        CCRZ.menuView.preventCategoryMenuCloseDesktop = CCRZ.subsc.menuEvents.preventCategoryMenuCloseDesktop;

        CCRZ.menuView.delegateEvents(_.extend(CCRZ.menuView.events,
              {
                  "click .switchLocale": "changeLocale",
                  "click .goToMyAccount": "goToMyAccount",
                  "click .doLogout": "doLogout",
                  "click .icon-plus-dark": "showSubMenu",
                  "click .icon-minus-dark": "hideSubMenu",
                  "click .icon-arrow-right": "preventCategoryMenuCloseDesktop"
              }
        ));
        if (isMobileDevice()) {
            CCRZ.menuView.delegateEvents(_.extend(CCRZ.menuView.events,
                {
                    "click .icon-arrow-right": "showSubMenuTablet"
                }
            ));
        }
        CCRZ.menuView.render();
    });

    CCRZ.pubSub.on('view:Menu:refresh', function(menuView) {
        /*remove first dropdown from menu item - workaround*/
        var menuItem = $("#ccb2b-menu-menuitem_uk_remove"),
            menuMobileItem = $("#ccb2b-menu-m-menuitem_uk_remove");
        if(menuItem){
           menuItem.closest(".dropdown-submenu").find('span').remove();
           menuItem.closest(".dropdown-menu").remove();
        }
        if(menuMobileItem){
           menuMobileItem.closest(".dropdown-submenu").find('span').remove();
           menuMobileItem.closest(".dropdown-menu").remove();
        }
    })

    CCRZ.subsc = CCRZ.subsc || {};
    CCRZ.subsc.menuEvents = {
         changeLocale: function(event) {
             $(".lssec").find(".changeLocale").click();
         },
         goToMyAccount: function(event) {
            if (CCRZ.pagevars.linkOverrideMap['HeaderMyAccount']) {
                window.location.href = CCRZ.pagevars.linkOverrideMap['HeaderMyAccount'];
            } else {
                CCRZ.headerView.goToMAS('myOverview');
            }
         },
         doLogout: function(event) {
             CCRZ.headerView.doLogout();
         },
         showSubMenu: function(event) {
             event.stopImmediatePropagation();
             var elem = $(event.currentTarget),
                 minusElem = elem.next(),
                 subMenu = elem.parent();
             elem.addClass("close").removeClass("open");
             minusElem.addClass("open").removeClass("close");
             subMenu.addClass('open');
         },
         hideSubMenu: function(event) {
             event.stopImmediatePropagation();
             var elem = $(event.currentTarget),
                 plusElem = elem.prev(),
                 subMenu = elem.parent();
             elem.addClass("close").removeClass("open");
             plusElem.addClass("open").removeClass("close");
             subMenu.removeClass('open');
         },
        preventCategoryMenuCloseDesktop: function(event) {
            // Prevents category menu close after click on right arrow
            event.stopImmediatePropagation();
        },
        showSubMenuTablet: function (event) {
             event.stopImmediatePropagation();

             var elem = $(event.currentTarget),
                 menuElem = elem.parent();

             // Hide all open menus
            var openMenus = $(".dropdown-submenu.open");
            for (var i = 0; i < openMenus.length; i++) {
                $(openMenus[i]).removeClass("open");
            }

            // Open menu - Bootstrap keeps parent submenu open and focused
             menuElem.addClass("open");
        }
    }
});
