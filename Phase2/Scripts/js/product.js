(function (window, document, jQuery, undefined) {
    'use strict';

    $(document).ready(function(){
        $('.product-button').on('click', function(){
            var _idx = $(this).data('index');

            $('.product-button').removeClass('is-curr');
            $(this).addClass('is-curr');
            $('.product-menu-arrow').attr('class', 'product-menu-arrow is-curr-0' + (_idx + 1));
            $('.product-bd .list').addClass('b-hide-md b-hide-sm').eq(_idx).removeClass('b-hide-md b-hide-sm');
        });
    });
}(window, document, $));