(function (window, document, jQuery, undefined) {
    'use strict';

    $(document).ready(function(){
        setTimeout(function(){
            scrollBar();
        } , 300);

        $('.location-button').on('click', function(){
            var _idx = $(this).data('index');

            $('.location-button').removeClass('is-curr');
            $(this).addClass('is-curr');
            $('.location-menu-arrow').attr('class', 'location-menu-arrow is-curr-0' + (_idx + 1));
            $('.location-tab > .list').addClass('b-hide-md b-hide-sm b-hide-xs').eq(_idx).removeClass('b-hide-md b-hide-sm b-hide-xs');
            window.parent.$.SugarFunBox.resize();
            if ($(this).parent().index() !== 5) {
                $('.box-list-area').perfectScrollbar('update');
                $('.ps-container>.ps-scrollbar-y-rail').show();
            } else {
                $('.ps-container>.ps-scrollbar-y-rail').hide();
            }
        });
    });

    $(window).resize(function(){
        scrollBar();
    });

    function scrollBar(){
        if ( window.parent.Projects.Factory.UserAgent === 'PC' ) {
            $('.box-list-area').perfectScrollbar();
        } else {
            $('.box-list-area').perfectScrollbar('destroy');
        }
    }
}(window, document, $));