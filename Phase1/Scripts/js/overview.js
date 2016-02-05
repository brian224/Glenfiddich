(function (window, document, jQuery, undefined) {
    'use strict';
    
    var Background = jQuery('.m-background'),
        TagBoard   = {
            GetScript : function() {
                jQuery.getScript(document.getElementById('tagboard').value , function (data, textStatus, jqxhr){});
            }
        };
    

    jQuery(document).ready(function(){
        Projects.Factory.ImgFull.Init(Background);
        Projects.Factory.DotSet();
        TagBoard.GetScript();
    });

    jQuery(window).bind('resize' , function(){
       Projects.Factory.ImgFull.Init(Background);
    });

    jQuery(window).scroll(function(){
        Projects.Factory.Nav.Scroll();
    }).scroll();
}(window, document, jQuery));