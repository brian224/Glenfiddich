(function (window, document, jQuery, undefined) {
    'use strict';

    jQuery(window).scroll(function(){
        Projects.Factory.Nav.Scroll();
    }).scroll();
}(window, document, jQuery));