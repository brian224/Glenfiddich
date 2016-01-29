(function (window, document, jQuery, undefined) {
    'use strict';

    var Projects = {
        Factory : {
            W            : jQuery(window),
            D            : jQuery(document),
            HB           : jQuery('html , body'),
            H            : jQuery('html'),
            B            : jQuery('body'),
            Year         : jQuery('.m-year'),
            Dot          : jQuery('.m-dot'),
            DotNav       : jQuery('.m-dot').find('.m-dot-item'),
            Device       : /Android|webOS|iPad|BlackBerry/i,
            IOS          : /iPhone|iPad|iPod/i,
            DocumentOff  : 'click touchstart',
            Animationend : null,
            UserAgent    : null,
            Href         : window.parent.location.href,
            Locations    : (window.parent.location.protocol + '//' + window.parent.location.host).toLowerCase(),
            Domain       : window.parent.location.href.split('' + (window.parent.location.protocol + '//' + window.parent.location.host).toLowerCase() + '')[1],
            GetUserAgent : function() {
                var $this = this;

                if ( jQuery(window).width() < 768 ) {
                    $this.UserAgent = 'Mobile';
                    $this.LoadImg.Element = '.jQ-load-mobile';
                } else {
                    if ( Projects.Factory.Device.test(navigator.userAgent) ) {
                        $this.UserAgent = 'Tablet';
                        $this.LoadImg.Element = '.jQ-load-mobile';
                    } else {
                        $this.UserAgent = 'PC';
                        $this.LoadImg.Element = '.jQ-load-pc';
                    }
                }
            },
            Nav : {
                Onclick : function() {
                    jQuery('.m-header').toggleClass(jQuery('.m-header').data('open'));
                    Projects.Factory.D.on(Projects.Factory.DocumentOff, function (e) {
                        // e.stopPropagation();

                        if ( ! jQuery(e.target).is('.jQ-nav , .jQ-nav * , .m-nav , .m-nav * , .m-nav-sub , .m-nav-sub *') ) {
                            jQuery('.m-header').removeClass(jQuery('.m-header').data('open'));
                            // Projects.Factory.D.off(Projects.Factory.DocumentOff);
                        }
                    });
                },
                Scroll : function() {
                    if ( Projects.Factory.W.scrollTop() > 0 ) {
                        jQuery('.m-header').addClass(jQuery('.m-header').data('scroll'));
                    } else {
                        jQuery('.m-header').removeClass(jQuery('.m-header').data('scroll'));
                    }
                }
            },
            DotSet : function(Functions) {
                var $this = this;

                if ( typeof(Functions) === 'function' ) {
                    Functions();
                }

                $this.Dot.css('margin-top' , ( $this.Dot.outerHeight() / 2 * ( -1 ) ));
                $this.DotNav = $this.Dot.find('.m-dot-item');
            },
            ViewHeight : function(Element , Height) {
                var $height = Height ? Height : 0;

                Element.css('height' , ( window.Projects.Factory.B.height() - $height ));
            },
            ImgFull : {
                Element : jQuery('.jQ-full'),
                EWidth  : null,
                EHeight : null,
                Init    : function(Browser) {
                    var $this    = this;
                    var $BWidth  = jQuery(Browser[0]).outerWidth(),
                        $BHeight = jQuery(Browser[0]).outerHeight();

                    
                    for ( var i = 0 ; i < $this.Element.length ; i ++ ) {
                        $this.Element.eq(i).removeAttr('style');

                        $this.EWidth  = $this.Element.eq(i).width();
                        $this.EHeight = $this.Element.eq(i).height();
                                
                        if ( ( $BHeight / $BWidth ) > ( $this.EHeight / $this.EWidth ) ) {
                            $this.Element.eq(i).css({
                                'margin-left' : ( parseInt( ( ( $BHeight / $this.EHeight ) * $this.EWidth ) , 10 ) - $BWidth ) / 2 * (-1) + 'px',
                                'width'       : parseInt( ( ( $BHeight / $this.EHeight ) * $this.EWidth ) , 10 )  + 'px',
                                'height'      : $BHeight + 'px'
                            });

                        } else {
                            $this.Element.eq(i).css({
                                'margin-top' : ( parseInt( ( ( $BWidth / $this.EWidth ) * $this.EHeight ) , 10 ) - $BHeight ) / 2 * (-1) + 'px',
                                'width'      : $BWidth + 'px',
                                'height'     : parseInt( ( ( $BWidth / $this.EWidth ) * $this.EHeight ) , 10 ) + 'px'
                            });
                        }
                    }
                }
            },
            LoadImg : {
                Index   : 0,
                Total   : 0,
                Element : null,
                Append  : function(CallBack) {
                    var $this = this;

                    for ( var i = 0 ; i < jQuery($this.Element).length ; i ++ ) {
                        jQuery($this.Element).eq(i).attr('src' , jQuery($this.Element).eq(i).data('src'));
                    };

                    $this.Load(CallBack);
                },
                Load : function(CallBack) {
                    var $this = this;

                    jQuery($this.Element).one('load', function() {
                        $this.Index ++;
                        $this.Total = parseInt((($this.Index / jQuery($this.Element).length) * 100) , 10);
                        
                        jQuery('.jQ-percentage').text(($this.Total + '%'));

                        if ( $this.Index === jQuery($this.Element).length ) {
                            if ( typeof(CallBack) === 'function' ) {
                                CallBack();
                            }
                        }
                    }).each(function() {
                        if( this.complete )
                            jQuery(this).load();
                    });
                }
            },
            Checked : {
                OpenChecked : function() {
                    if ( sessionStorage.Already !== 'true' ) {
                        jQuery('.l-content').addClass(jQuery('.l-content').data('blur'));
                        jQuery('.l-footer').addClass(jQuery('.l-footer').data('blur'));
                        Projects.Factory.Year.removeClass(Projects.Factory.Year.data('hide'));
                    }
                },
                Already : function() {
                    sessionStorage.Already = 'true';
                    Projects.Factory.Year.addClass(Projects.Factory.Year.data('cloak'));
                    Projects.Factory.D.finish().delay(400).queue(function(e){
                        jQuery('.l-content').removeClass(jQuery('.l-content').data('blur'));
                        jQuery('.l-footer').removeClass(jQuery('.l-footer').data('blur'));
                        Projects.Factory.Year.addClass(Projects.Factory.Year.data('hide')).removeClass(Projects.Factory.Year.data('cloak'));
                    });
                },
                Not : function() {
                    Projects.Factory.Year.find('.m-year-warning').removeClass(Projects.Factory.Year.find('.m-year-warning').data('hide'));
                }
            },
            FB : {
                Init : function() {
                    window.fbAsyncInit = function(){
                        FB.init({
                            appId   : 1516500198661515,
                            status  : true,
                            cookie  : true,
                            xfbml   : true,
                            version : 'v2.5'
                        });
                    };

                    (function(d, s, id){
                        var js,
                            fjs = d.getElementsByTagName(s)[0];
                    
                        if ( d.getElementById(id) ) {return;}

                        js     = d.createElement(s); js.id = id;
                        js.src = "//connect.facebook.net/zh_TW/sdk.js#xfbml=1&version=v2.5&appId=1516500198661515";

                        fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk'));
                },
                GetLoaginState : function() {
                    var $this = this;

                    FB.getLoginStatus(function (response) {
                        if ( response.authResponse ) {
                            $this.Media();
                        } else {
                            $this.Login();
                        }
                    });
                },
                Login : function() {
                    var $this = this;

                    FB.login(function (response) {
                        if ( response.authResponse ) {
                            $this.Media();
                        } else {
                            alert('須同意應用程式');
                        }
                    } , {scope : 'email'});
                },
                Share : function() {
                    FB.ui({
                        method      : 'feed',
                        name        : '格蘭菲迪 - 第一個挑戰世界的單一麥芽，送你挑戰世界機票！',
                        link        : 'http://www.glenfiddich1963.com.tw/',
                        picture     : 'http://www.glenfiddich1963.com.tw/Content/img/common/FB.jpg',
                        caption     : '',
                        description : '1963威士忌傳奇故事，分享你的第一先鋒精神，就有機會抽「紐約來回機票及百樣好禮」！加碼分享網站再抽大獎！'
                    } , function(response) {
                        if ( response && ! response.error_code ) {
                        } else {
                        }
                    });
                },
                Media : function() {
                    var $this = this;

                    window.parent.FB.ui({
                        method : 'share',
                        href   : 'http://www.glenfiddich1963.com.tw/',
                    } , function(response) {
                        if ( response && ! response.error_code ) {
                            $this.CallBack();
                        } else {
                        }
                    });
                },
                CallBack : function() {
                    FB.api('/me?fields=id,name,email', function(response) {
                        var $Data = {
                            'Mobile'  : response.id,
                            'Name'    : response.name,
                            'Address' : ( response.email ? response.email : '' )
                        }

                        jQuery.post('//campaign.sugarfun.com.tw/form/api/submit?site=Glenfiddich&callback=?' , $Data , function (data){} , 'json');
                    });
                }
            },
            SugarFunBox : function(Element) {
                jQuery('.m-header').removeClass(jQuery('.m-header').data('open'));
                
                jQuery.SugarFunBox.open({
                    href          : jQuery(Element).attr('href'),
                    supportMobile : true,
                    closeBtnElem  : jQuery(Element).data('ga-push') ? '<span class="m-box-close ga_click_trace" ga_cat="video_tvc" ga_event="click" ga_label="close"></span>' : '<span class="m-box-close"></span>',
                    width         : Projects.Factory.UserAgent !== 'Mobile' ? ( jQuery(Element).data('width') ? jQuery(Element).data('width') : '60%' ) : '95%',
                    loadImg       : '<div class="m-load"><div class="m-load-bd"><div><span class="m-icon-stack m-icon-stack-logos-ver"><i class="m-icon m-icon-stack-logo-ver"></i><i class="m-icon m-icon-stack-logo-text-ver is-absolute"></i><i class="m-icon m-icon-stack-logo-info-ver is-absolute"></i></span></div><span class="m-load-line"><i></i><i></i><i></i><i></i><i></i></span></div></div>'
                });
            },
            IOSChrome : function () {
                if ( Projects.Factory.IOS.test(navigator.userAgent) && navigator.userAgent.toLowerCase().split('version/')[1] === undefined ) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }

    if ( ! window.Projects ) {
        window.Projects = Projects;
    } else {
        window.Projects = $.extend( {} , window.Projects , Projects );
    }
}(window, document, jQuery));