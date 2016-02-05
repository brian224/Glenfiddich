(function (window, document, jQuery, undefined) {
    'use strict';

    var Background   = jQuery('.m-background'),
        ProductBD    = jQuery('.product-bd'),
        ProductMenu  = jQuery('.product-menu'),
        ProductBtn   = ProductMenu.find('.product-button'),
        ProductArrow = jQuery('.product-menu-arrow'),
        ProductEvent = {
            Arrow   : [0 , 0],
            OnClick : function(Element) {
                var $this  = this;
                var $index = jQuery(Element).data('index');

                $this.Arrow[1] = $this.Arrow[0];
                $this.Arrow[0] = parseInt($index , 10);
                ProductBD.find('> ul > li').eq($index).removeClass(ProductBD.data('hide')).siblings().addClass(ProductBD.data('hide'));
                ProductBtn.removeClass(ProductMenu.data('curr'));
                jQuery(Element).addClass(ProductMenu.data('curr'));
                ProductArrow.addClass((ProductMenu.data('arrow') + (($this.Arrow[0] + 1) + ''))).removeClass((ProductMenu.data('arrow') + (($this.Arrow[1] + 1) + '')));
            }
        }

    jQuery('.jQ-product').on('click' , function(e){
        e.preventDefault();
        ProductEvent.OnClick(this);
    });

    jQuery(document).ready(function(){
        Projects.Factory.ImgFull.Init(Background);
        Projects.Factory.DotSet();
    });

    jQuery(window).bind('resize' , function(){
       Projects.Factory.ImgFull.Init(Background);
    });

    jQuery(window).scroll(function(){
        Projects.Factory.Nav.Scroll();
    }).scroll();
}(window, document, jQuery));