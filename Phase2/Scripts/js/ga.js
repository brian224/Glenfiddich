if ( document.getElementById('GAScript').dataset.id ) {
    (function(i , s , o , g , r , a , m){
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function(){(
            i[r].q = i[r].q || []
        ).push(arguments)},

        i[r].l = 1*new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a , m)
    })(window , document , 'script' , '//www.google-analytics.com/analytics.js' , 'ga');

    ga('create', document.getElementById('GAScript').dataset.id, 'auto');
    ga('require', 'displayfeatures');
    ga('send', 'pageview');

    function GAPush(Cat , Action , Label , HitCallback) {
        if ( document.getElementById('GAScript').dataset.id ) {
            ga('send' , 'event' , Cat , Action , Label , HitCallback);
        }
    };

    function GAHitBack(Element) {
        var $URLs = Element.attr('href') ? Element.attr('href') : '';

        if ( Element.attr('target') === '_parent' ) {
            window.parent.location = $URLs;
        } else {
            window.location = $URLs;
        }
    }

    (function (window, document, jQuery, undefined) {
        jQuery(document).on('click' , '.ga_click_trace' , function(e){
            var $set = {
                Cat    : jQuery(this).attr('ga_cat'),
                Action : jQuery(this).attr('ga_event'),
                Label  : jQuery(this).attr('ga_label')
            };

            if ( jQuery(this).attr('target') !== '_blank' && jQuery(this).attr('href') && jQuery(this).attr('href') != '#') {
                if ( jQuery(this).hasClass('ga_click_preventDefault') ) {
                    GAPush($set.Cat , $set.Action , $set.Label);
                } else {
                    e.preventDefault();
                    GAPush($set.Cat , $set.Action , $set.Label , {'hitCallback' : GAHitBack(jQuery(this))});
                }
            } else if ( jQuery(e.target)[0].nodeName !== 'A' ) {
                GAPush($set.Cat , $set.Action , $set.Label);
            }
        });
    }(window, document, jQuery));
}