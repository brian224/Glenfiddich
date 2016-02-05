(function (window, document, jQuery, undefined) {
    'use strict';

    $(document).ready(function(){
        setTimeout(function(){
            scrollBar();
        } , 300);
    });

    $(window).resize(function(){
        scrollBar();
    });

    function scrollBar(){
        if ( window.parent.Projects.Factory.UserAgent === 'PC' ) {
            $('.box-area').perfectScrollbar();
        } else {
            $('.box-area').perfectScrollbar('destroy');
        }
    }
}(window, document, $));