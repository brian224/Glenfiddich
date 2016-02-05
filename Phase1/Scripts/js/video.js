(function (window, document, jQuery, undefined) {
    'use strict';

    var Video     = jQuery('.video'),
        GetHeight = function() {
            setTimeout(function(){
                Video.find('.video-bd').css('height' , ( Projects.Factory.W.width() / 16 * 9 ));
            } , 0);
        }

    jQuery(window).load(function(){
        GetHeight();
    });

}(window, document, jQuery));