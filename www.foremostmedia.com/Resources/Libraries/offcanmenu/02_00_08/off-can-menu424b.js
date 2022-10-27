/*
* Off-Canvas Menu Script
* https://bitbucket.org/foremostmedia/offcanmenu
* Author : Foremost Media https://www.foremostmedia.com
* v2.0.7
*/

$.fn.offCanMenu = function (options) {
    var $baseNode = this,
    baseMenu = '',
    baseMenuWrapper,
    isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    },
    defaultVars = {
        menuLayout: {
            direction: 'left',
            closeMenu: true,
            login: false,
            menuLogo: '',
            animationBounce: '',
            buttonLocation: $baseNode,
            buttonText: '',
            sideLinks: [],
            extraLinks: []
        },
        menuDimensions: {
            screenWidthTrigger: 1183,
            menuWidth: 400,
            sideLinksWidth: 50,
            responsiveScreenWidthTrigger: 500,
            responsiveMenuPercent: .8
        },
        menuIcons: {
            closeIcon: '<i class="fa fa-close"></i>',
            backIcon: '<i class="fa fa-reply"></i>',
            navIcon: '<i class="fa fa-chevron-right"></i>',
            loginIcon: '<i class="fa fa-sign-in"></i>',
            logoutIcon: '<i class="fa fa-sign-out"></i>'
        }
    },
    defaults = $.extend(true,{}, defaultVars, options),
    winWidth = $(window).width(),
    $menu;
    
    menuCheck();

    $(window).resize(function () {
        winWidth = $(window).width();
        menuCheck();
    });

    function menuCheck() {
        if (winWidth < defaults.menuDimensions.responsiveScreenWidthTrigger) {
            defaults.menuDimensions.menuWidth = defaults.menuDimensions.responsiveMenuPercent * winWidth;
        }

        baseMenuWrapper = defaults.menuDimensions.menuWidth;

        if (winWidth < defaults.menuDimensions.screenWidthTrigger || isMobile.any()) {
            launchMenu();
        } else {
            revertMenu();
        }
    }

    function launchMenu() {
        if (baseMenu === '') {
            baseMenu = $baseNode.html();
        }
        
        /*OUTER MENU BUILD AND POSITIONING*/
        if ($('.ocm-active').length === 0) {
            $baseNode.html('');
            defaults.menuLayout.buttonLocation.append('<button class="hamburger" type="button"><span class="hamburger-box"><span class="hamburger-inner"></span></span><span class="menu-label">'+ defaults.menuLayout.buttonText +'</span></button>');
            $('body').addClass('ocm-active').prepend('<div class="ocm-overlay ocm-close"></div><div id="ocmMenuWrapper"></div>');
            $menu = $('#ocmMenuWrapper');
            
            if (defaults.menuLayout.animationBounce) {
                
                if (defaults.menuLayout.animationBounce > '1') {
                    $menu.css('transition-timing-function', 'cubic-bezier(0.31, 0.42, 0.49, '+defaults.menuLayout.animationBounce+')');
                } else {
                    $menu.css('transition-timing-function', '1');
                }
            }
            
            if (defaults.menuLayout.direction === 'left') {
                $menu.css('transform', 'translateX(-' + defaults.menuDimensions.menuWidth + 'px)').css('width', '' + defaults.menuDimensions.menuWidth + 'px');
                $menu.addClass('direction-left');
                
                if (defaults.menuLayout.sideLinks.length) {
                    defaults.menuDimensions.menuWidth = defaults.menuDimensions.menuWidth - defaults.menuDimensions.sideLinksWidth;
                }
            }

            else if (defaults.menuLayout.direction === 'right') {
                $menu.css('transform', 'translateX(100vw)').css('width', '' + defaults.menuDimensions.menuWidth + 'px');
                $menu.addClass('direction-right');
                
                if (defaults.menuLayout.sideLinks.length) {
                    defaults.menuDimensions.menuWidth = defaults.menuDimensions.menuWidth - defaults.menuDimensions.sideLinksWidth;
                }
            }
            
            else if (defaults.menuLayout.direction === 'bottom') {
                $menu.css('transform', 'translateY(100%)').css('width', '100%');
                $menu.addClass('direction-bottom');
            }
            
            else if (defaults.menuLayout.direction === 'top') {
                $menu.css('transform', 'translateY(-100%)').css('width', '100%');
                $menu.addClass('direction-top');
            }
        }

        if ($menu.is(':empty')) {
            buildMenu(baseMenu);
        }
        
        /*$('.ocm-overlay.active').click(function () {
            setTimeout(function(){
                $('.hamburger').toggleClass("is-active");
            }, 500);
        });*/

        /*OPEN MENU FUNCTION*/
        $('.hamburger').click(function () {
            $('.hamburger').addClass("is-active");
            
            if (!$menu.hasClass('active')) {
                setTimeout(function(){
                    $('.ocm-overlay').addClass('active');

                    if (defaults.menuLayout.direction === 'left') {
                        $menu.addClass('active').css('transform', 'translateX(0)');
                    }
                    else if (defaults.menuLayout.direction === 'right') {
                        var scrollBarOffset = 0,
                        widthShift = defaults.menuDimensions.menuWidth + scrollBarOffset;

                        if (window.innerWidth > document.documentElement.offsetWidth) {
                            scrollBarOffset = 17;
                        }
                        $menu.addClass('active').css('transform', 'translateX(calc(100vw - ' + widthShift + 'px))');
                    }
                    else if (defaults.menuLayout.direction === 'bottom' || defaults.menuLayout.direction === 'top') {
                        $menu.addClass('active').css('transform', 'translateY(0)');
                    }
                }, 500);
            }
        });
    }
    
    /*INNER MENU BUILD FUNCTION*/
    function buildMenu(base) {
        var $that;
        $menu.append(base);
        
        /*ADD EXTRA LINKS*/
        if (defaults.menuLayout.extraLinks.length) {
            defaults.menuLayout.extraLinks.forEach(function(item) {
                $menu.find('>ul:last-child').append('<li style="width:' + defaults.menuDimensions.menuWidth + 'px"><a class="' + item.wrapperClass + '" target="' + item.target + '" href="' + item.href + '"><span>' + item.title + '</span></a></li>');
            });
        }
        
        /*ADD CLOSE BUTTON/LOGO*/
        if (defaults.menuLayout.direction === "bottom" || defaults.menuLayout.direction === 'top') {
            
            if (defaults.menuLayout.menuLogo) {
                $menu.find('>ul:first-child').prepend('<li><a class="ocm-logo" href="/"><img src="' + defaults.menuLayout.menuLogo + '"/></a><a class="ocm-close"><span>' + defaults.menuIcons.closeIcon + '</span></a></li>');
            } else {
                $menu.find('>ul:first-child').prepend('<li><a class="ocm-close"><span>' + defaults.menuIcons.closeIcon + '</span></a></li>');
            }
        }
        
        else {
            
            if (defaults.menuLayout.closeMenu === true || defaults.menuLayout.menuLogo) {
            
                if (defaults.menuLayout.closeMenu === true && defaults.menuLayout.menuLogo) {
                    $menu.find('>ul:first-child').prepend('<li><a class="ocm-logo" href="/"><img src="' + defaults.menuLayout.menuLogo + '"/></a><a class="ocm-close"><span>' + defaults.menuIcons.closeIcon + '</span></a></li>');
                }
                
                else if (defaults.menuLayout.closeMenu === true) {
                    $menu.find('>ul:first-child').prepend('<li><a class="ocm-close"><span>' + defaults.menuIcons.closeIcon + '</span></a></li>');
                }
                
                else if (defaults.menuLayout.menuLogo) {
                    $menu.find('>ul:first-child').prepend('<li><a class="ocm-logo" href="/"><img src="' + defaults.menuLayout.menuLogo + '"/></a></li>');
                }
            }
        }
        
        /*BUILD SIDE LINKS*/
        if (defaults.menuLayout.sideLinks.length || defaults.menuLayout.login === true) {        
            var sidePanelContent = '<div class="side-panel" style="width:' + defaults.menuDimensions.sideLinksWidth + 'px">';
            
            if (defaults.menuLayout.login) {
                var dnn = document.getElementById("ControlPanelWrapper"),
                dnnLogged = document.getElementById("ControlBar"),
                nop = document.querySelector('meta[content="nopCommerce"]'),
                nopLogged = document.getElementsByClassName('administration');
                
                sidePanelContent += '<div class="login-wrapper">';
                
                if(dnn){
                    if (dnnLogged) {
                        sidePanelContent += '<a href="/logoff"><span>' + defaults.menuIcons.logoutIcon +'</span></a>';
                    } else {
                        sidePanelContent += '<a href="/login"><span>' + defaults.menuIcons.loginIcon +'</span></a>';
                    }
                }
                
                if(nop){
                    if (nopLogged.length) {
                        sidePanelContent += '<a href="/logout"><span>' + defaults.menuIcons.logoutIcon +'</span></a>';
                    } else {
                        sidePanelContent += '<a href="/login"><span>' + defaults.menuIcons.loginIcon +'</span></a>';
                    }
                }
                
                sidePanelContent += '</div>';
            }
            
            if (defaults.menuLayout.sideLinks) {
                defaults.menuLayout.sideLinks.forEach(function(item) {
                    sidePanelContent += '<a class="' + item.wrapperClass + '" href="' + item.href + '" target="_blank" rel="nofollow"><span class="' + item.icon + '"></span></a>';
                });
            }
            
            sidePanelContent += "</div>";
            $menu.prepend(sidePanelContent);
        }
        
        /*BUILD SUB MENU*/
        $menu.find('li').each(function () {
            $that = $(this);
            if ($that.find('ul').length) {
                $that.prepend('<span class="ocmSubMenu">' + defaults.menuIcons.navIcon  + '</span>');
            }
        });
        
        /*PLACEHOLDER PAGE SUB MENU NAVIGATION FUNCTION*/
        $(".ocmSubMenu + span").on("click", function () { $(this).prev().trigger("click"); });
        
        /*SUB MENU NAVIGATION FUNCTION*/
        $menu.find('.ocmSubMenu').click(function () {
            $that = $(this);
            $that.closest('li').find('ul').css('transform', 'translateX(0)').removeClass("ul-closed");
            
            if (defaults.menuLayout.direction === 'bottom' || defaults.menuLayout.direction === 'top') {
                $that.closest('li').find('ul').find('ul').css('transform', 'translateX(100%)');
            } else {
                $that.closest('li').find('ul').find('ul').css('transform', 'translateX(' + defaults.menuDimensions.menuWidth + 'px)');
            }
        });
        
        /*INITIAL SUB MENU POSITIONS*/
        $menu.find('> ul').find('ul').each(function () {
            $that = $(this);
            if (defaults.menuLayout.direction === 'bottom' || defaults.menuLayout.direction === 'top') {
                $that.css('transform', 'translateX(100%)').addClass("ul-closed");
            } else {
                $that.css('transform', 'translateX(' + defaults.menuDimensions.menuWidth + 'px)').addClass("ul-closed");
            }
            $that.prepend('<li class="btnOCMBack">' + defaults.menuIcons.backIcon + '</li>');
        });
        
        /*SET MENU ITEMS WIDTH*/
        $menu.find('ul').each(function () {
            $that = $(this);
            
            if (defaults.menuLayout.direction === 'bottom' || defaults.menuLayout.direction === 'top') {
                $that.css('width', '100%');
            } else {
                $that.width(defaults.menuDimensions.menuWidth);
            }
            $('#ocmMenuWrapper').find('li').each(function () {
                $that = $(this);
                
                if (defaults.menuLayout.direction === 'bottom' || defaults.menuLayout.direction === 'top') {
                    $that.css('width', '100%');
                } else {
                    $that.width(defaults.menuDimensions.menuWidth);
                }

            });
        });
        
        /*BACK FUNCTION*/
        $menu.find('.btnOCMBack').click(function () {
            $that = $(this);
            
            if (defaults.menuLayout.direction === 'bottom' || defaults.menuLayout.direction === 'top') {
                $that.closest('ul').css('transform', 'translateX(100%)');
            } else {
                $that.closest('ul').css('transform', 'translateX(' + defaults.menuDimensions.menuWidth + 'px)');
            }
            $that.closest('ul').addClass("ul-closed");
        });
        
        /*CLOSE FUNCTION*/
        $('.ocm-close').click(function () {
            $that = $(this);
            $('.ocm-overlay').removeClass('active');
            
            setTimeout(function(){
                $('.hamburger').removeClass("is-active");
            }, 500);

            if (defaults.menuLayout.direction === 'left') {
                $menu.removeClass('active').css('transform', 'translateX(-' + (defaults.menuDimensions.menuWidth + defaults.menuDimensions.sideLinksWidth) + 'px)');
            }
            else if (defaults.menuLayout.direction === 'right') {
                $menu.removeClass('active').css('transform', 'translateX(100vw)');
            }
            else if (defaults.menuLayout.direction === 'bottom') {
                $menu.removeClass('active').css('transform', 'translateY(100%)');
            }
            else if (defaults.menuLayout.direction === 'top') {
                $menu.removeClass('active').css('transform', 'translateY(-100%)');
            }
        });
    }

    function revertMenu() {
        if (baseMenu !== '') {
            $baseNode.html(baseMenu);
        }
        $('.hamburger').remove();
        $('#ocmMenuWrapper').remove();
        $('.ocm-close').remove();
        $('.ocm-active').removeClass('ocm-active');
    }
}