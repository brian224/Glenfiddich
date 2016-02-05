(function (window, document, jQuery, undefined) {
    'use strict';

    if ( Projects.Factory.Device.test(navigator.userAgent) ) {
        Projects.Factory.Animationend = 'webkitAnimationEnd webkitTransitionEnd';
    } else {
        Projects.Factory.Animationend = 'animationend transitionend';
    }

    if ( ! sessionStorage.Already ) {
        sessionStorage.Already = '';
    }

    jQuery('.l-header , .l-content , .l-footer').on('click' , 'a' , function(e){
        if ( jQuery(this)[0].origin === 'tel://' && Projects.Factory.UserAgent !== 'Mobile' ) {
            e.preventDefault();
        }
    });

    jQuery('.jQ-nav').on('click' , function(e){
        var $this = this;

        e.preventDefault();
        Projects.Factory.Nav.Onclick();
        if ( jQuery('.m-header').hasClass(jQuery('.m-header').data('open')) ) {
            jQuery($this).attr('ga_label' , jQuery($this).data('open-label'));
        } else {
            jQuery($this).attr('ga_label' , jQuery($this).data('close-label'));
        }
    });

    jQuery('.jQ-nav-sub').on('click' , function(e){
        Projects.Factory.Nav.SubOnClick(e , this);
    });

    jQuery('.jQ-media').on('click' , function(e){
        e.preventDefault();
        Projects.Factory.FB.GetLoaginState();
    });

    jQuery('.jQ-share').on('click' , function(e){
        e.preventDefault();
        Projects.Factory.FB.Share();
    });

    jQuery('.jQ-already').on('click' , function(e){
        e.preventDefault();
        Projects.Factory.Checked.Already();
    });

    jQuery('.jQ-not').on('click' , function(e){
        e.preventDefault();
        Projects.Factory.Checked.Not();
    });

    jQuery('.jQ-SFbox').on('click' , function(e){
        e.preventDefault();
        Projects.Factory.SugarFunBox(this);
    });

    jQuery(document).ready(function(e){
        Projects.Factory.GetUserAgent();
        Projects.Factory.Checked.OpenChecked();
        Projects.Factory.FB.Init();
    });

    jQuery(window).bind('load' , function(e){
        Projects.Factory.Nav.GetWidth();
    });

    jQuery(window).bind('resize' , function(e){
        Projects.Factory.GetUserAgent();
    });
}(window, document, jQuery));