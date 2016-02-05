(function (window, document, jQuery, undefined) {
    'use strict';

    $(document).ready(function(){
        scrollBar();
    });

    $(window).resize(function(){
        scrollBar();
    });

    function scrollBar(){
        if ( Projects.Factory.UserAgent === 'PC' ) {
            $('.list-area').perfectScrollbar();
        } else {
            $('.list-area').perfectScrollbar('destroy');
        }
    }
}(window, document, $));