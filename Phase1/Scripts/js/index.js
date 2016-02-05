(function (window, document, jQuery, undefined) {
    'use strict';

    var Load           = jQuery('.l-load'),
        Content        = jQuery('.l-content'),
        Footer         = jQuery('.l-footer'),
        Video          = jQuery('.index-video-list'),
        Cut            = Video.find('.index-cut'),
        Step           = jQuery('.index-step'),
        CaseBG         = Step.find('.index-case-bg'),
        ScrollIcon     = jQuery('.index-scroll'),
        ScrollBD       = ScrollIcon.find('.index-scroll-bd'),
        ScrollActivity = ScrollIcon.find('.index-scroll-acyivity'),
        Speed          = 250,
        TagBoard   = {
            Elememt   : jQuery('.tagboard-embed'),
            GetHeight : function() {
                var $this  = this;
                var $count = Math.round( ( $this.Elememt.parent().outerHeight() - 100 - parseInt($this.Elememt.css('padding-top') , 10) ) / 280 ) * 3;

                $this.Elememt.attr('tgb-post-count' , $count);
                $this.Elememt.empty();
                // setTimeout(function(){
                //     $this.GetScript();
                // } , 100);
            },
            GetScript : function() {
                if ( Projects.Factory.UserAgent === 'PC' ) {
                    jQuery.getScript(document.getElementById('tagboard').value , function (data, textStatus, jqxhr){});
                }
            }
        },
        ImgLoaded = function() {
            Load.addClass(Load.data('cloak'));
            setTimeout(function(){
                Load.addClass(Load.data('hide')).removeClass(Load.data('cloak'));
            } , 400);

            Projects.Factory.ViewHeight(Cut , Footer.height());
            Projects.Factory.ViewHeight(Step , Footer.height());
            Projects.Factory.ImgFull.Init(Cut);
            TagBoard.GetScript();
            TagBoard.GetHeight();
        },
        DotGet = function() {
            var $clone;

            for ( var i = 0 ; i < ( Cut.length + Step.length ) ; i ++ ) {
                if ( i !== 0 ) {
                    $clone = Projects.Factory.DotNav.last().clone();
                    $clone.removeClass(Projects.Factory.Dot.data('curr'));

                    if ( i > ( Cut.length - 1 ) ) {
                        $clone.addClass(Projects.Factory.Dot.data('step'));
                        if ( i === ( Cut.length + Step.length - 2 ) ) {
                            $clone.attr('ga_label' , 'upload');
                        } else if ( i === ( Cut.length + Step.length - 1 ) ) {
                            $clone.attr('ga_label' , 'case');
                        }
                    } else {
                        $clone.attr('ga_label' , 'cf_0'+(i + 1)+'');
                    }
                    
                    Projects.Factory.Dot.find('ul').append($clone);
                } else {
                    Projects.Factory.DotNav.eq(0).attr('ga_label' , 'cf_0'+(i + 1)+'');
                }
            }
        },
        OnEvent = {
            Index  : 0,
            Scroll : false,
            Blur   : false,
            IsPlay : false,
            Speed  : 0,
            Touch  : [],
            Cut    : function(Elememt) {
                var $this = this;

                if ( Projects.Factory.UserAgent === 'PC' ) {
                    Elememt.on('mousewheel DOMOnEvent' , function(e , delta){
                        e.preventDefault();
                        $this.CutEvent(delta);
                    });
                } else {
                    var $Delta = 0;

                    Elememt.add('.index-scroll').swipe({
                        swipe : function(event , direction , distance , duration , fingerCount , fingerData) {
                            if ( direction === 'up' ) {
                                $Delta = ( -1 );
                            } else if ( direction === 'down' ) {
                                $Delta = 1;
                            }

                            $this.CutEvent($Delta);
                        }
                    });

                }
            },
            Step : function(Elememt) {
                var $this = this;

                if ( Projects.Factory.UserAgent === 'PC' ) {
                    Elememt.on('mousewheel DOMOnEvent' , function(e , delta){
                        e.preventDefault();
                        $this.StepEvent(delta);
                    });
                } else {
                    var $Delta = 0;

                    Elememt.add('.index-scroll').swipe({
                        //Generic swipe handler for all directions
                        swipe : function(event, direction, distance, duration, fingerCount, fingerData) {
                            if ( direction === 'up' ) {
                                $Delta = ( -1 );
                            } else if ( direction === 'down' ) {
                                $Delta = 1;
                            }
                            $this.StepEvent($Delta);
                        }
                    });
                }
            },
            CutEvent : function(Delta) {
                var $this = this;
                var $Cut = ( Projects.Factory.UserAgent === 'PC' ) ? Cut.eq($this.Index).find('.is-pc img') : Cut.eq($this.Index).find('.is-mobile img');

                if ( ! $this.Scroll && ! $this.Blur ) {
                    if ( Delta < 0 ) {
                        $this.Scroll = true;
                        ScrollBD.addClass(ScrollIcon.data('hide'));
                        $this.Speed = 0;

                        if ( ! Cut.eq($this.Index).hasClass(Video.data('over')) ) {
                            Animate.Run($this.Index);
                            Cut.eq($this.Index).find('.index-os').addClass(Video.data('animate'));
                        } else {
                            $Cut.eq(0).addClass(Video.data('show')).siblings().removeClass(Video.data('show'));
                            Cut.eq($this.Index).find('.index-os').removeClass(Video.data('animate'));
                            $this.Index += 1;
                            $this.IsPlay = true;
                            Cut.eq($this.Index).removeClass(Video.data('over'));
                            Cut.eq($this.Index).find('.index-os').addClass(Video.data('animate'));
                        }
                    }  else if ( Delta > 0 && $this.Index !== 0 ) {
                        $this.Scroll = true;
                        Cut.eq($this.Index).find('.index-os').removeClass(Video.data('animate'));
                        $this.Index -= 1;
                        $this.IsPlay = false;
                        $this.Speed  = Speed;
                        Cut.eq($this.Index).removeClass(Video.data('over'));
                    }

                    Content.stop().animate({
                        scrollTop : $this.Index * Cut.eq($this.Index).outerHeight()
                    } , $this.Speed , function(){
                        if ( $this.IsPlay ) {
                            Animate.Run($this.Index);;
                        } else {
                            if ( $this.Speed !== 0 ) {
                                $this.Scroll = false;
                            }
                        }
                    });

                    if ( ( Cut.length - 1) >= $this.Index ) {
                        Projects.Factory.DotNav.eq($this.Index).addClass(Projects.Factory.Dot.data('curr')).siblings().removeClass(Projects.Factory.Dot.data('curr'));
                    }
                }
            },
            StepEvent : function(Delta) {
                var $this   = this;
                var $navIdx = null;

                if ( ! $this.Scroll && ! $this.Blur ) {
                    $this.Scroll = true;
                    if ( Delta < 0 && ( Step.length - 1) > ( $this.Index - Cut.length ) ) {
                        $this.Index ++;
                        ScrollBD.addClass(ScrollIcon.data('hide'));
                    } else if ( Delta > 0 ) {
                        $this.Index --;
                        CaseAnimate.Pause();
                        setTimeout(function(){
                            ScrollBD.removeClass(ScrollIcon.data('hide'));
                        } , 100);
                    }

                    Content.stop().animate({
                        scrollTop : $this.Index * Cut.outerHeight()
                    } , Speed , function(){
                        $this.Scroll = false;

                        if ( $this.Index === ( Projects.Factory.DotNav.length - 1 ) ) {
                            setTimeout(function(){
                                CaseAnimate.Run();
                            } , 150);
                            GAPush(Step.eq(1).attr('ga_cat') , Step.eq(1).attr('ga_event') , Step.eq(1).attr('ga_label'));
                        } else if ( $this.Index === ( Projects.Factory.DotNav.length - 2 ) ) {
                            GAPush(Step.eq(0).attr('ga_cat') , Step.eq(0).attr('ga_event') , Step.eq(0).attr('ga_label'));
                        }
                    });

                    if ( $this.Index <= ( Cut.length - 1 ) ) {
                        setTimeout(function(){
                            ScrollActivity.removeClass(ScrollActivity.data('hide'));
                        } , 100);
                    }

                    $navIdx = ( $this.Index - Cut.length ) <= ( Step.length - 1 ) ? ( ( $this.Index - Cut.length ) + Cut.length ) : ( Cut.length - 1 );
                    Projects.Factory.DotNav.removeClass(Projects.Factory.Dot.data('curr')).eq($navIdx).addClass(Projects.Factory.Dot.data('curr'));
                }
            }
        },
        DotEvent = {
            OnClick : function(Elememt) {
                if ( ! OnEvent.Blur && ! OnEvent.Scroll ) {
                    var $Index = jQuery(Elememt).index();

                    OnEvent.Index = $Index;

                    if ( $Index === ( Projects.Factory.DotNav.length - 1 ) ) {
                        ScrollBD.addClass(ScrollIcon.data('hide'));
                    } else {
                        setTimeout(function(){
                            ScrollBD.removeClass(ScrollIcon.data('hide'));
                        } , 100);
                        CaseAnimate.Pause();
                    }
                    
                    jQuery(Elememt).addClass(Projects.Factory.Dot.data('curr')).siblings().removeClass(Projects.Factory.Dot.data('curr'));
                    Cut.eq($Index).removeClass(Video.data('over'));

                    Content.stop().animate({
                        scrollTop : $Index * Cut.outerHeight()
                    } , Speed , function(){
                        if ( $Index >= ( Projects.Factory.DotNav.length - 2 ) ) {
                            if ( $Index === ( Projects.Factory.DotNav.length - 1 ) ) {
                                setTimeout(function(){
                                    CaseAnimate.Run();
                                } , 150);
                            }
                            ScrollActivity.addClass(ScrollActivity.data('hide'));
                        }
                    });
                }
            }
        },
        CaseAnimate = {
            Index  : 0,
            Timer  : null,
            CaseBg : null,
            Amount : null,
            SetTime : function() {
                var $this = this;

                $this.Timer = setTimeout(function(){
                    $this.Index ++;
                    if ( $this.Index > $this.Amount ) {
                        $this.Index = 0;
                        clearTimeout($this.Timer);
                    }
                    $this.Run();
                } , 150);
            },
            Run : function() {
                var $this = this;

                $this.CaseBG = ( Projects.Factory.UserAgent === 'PC' ) ? CaseBG.parent().find('.is-pc') : CaseBG.parent().find('.is-mobile');
                $this.Amount = $this.CaseBG.find('img').length;

                $this.SetTime();
                $this.CaseBG.find('img').eq($this.Index).addClass(Video.data('show')).siblings().removeClass(Video.data('show'));
            },
            Pause : function() {
                var $this = this;
                clearTimeout($this.Timer);
            }
        },
        Animate = {
            Index : 1,
            Run : function(Idx) {
                var $this        = this;
                var $nowCut      = Cut.eq(Idx),
                    $cut         = ( Projects.Factory.UserAgent === 'PC' ) ? $nowCut.find('.is-pc') : $nowCut.find('.is-mobile'),
                    $amount      = ( Projects.Factory.UserAgent === 'PC' ) ? $cut.find('img').length : $cut.find('img').length;
                var $Timer       = null,
                    $TimerScroll = null;

                if ( $this.Index < $amount ) {
                    $Timer = setTimeout(function(){
                        $this.Index ++;
                        $this.Run(Idx);
                    } , 100);

                    $cut.find('img').eq($this.Index).addClass(Video.data('show')).siblings().removeClass(Video.data('show'));
                } else {
                    $this.Index = 1;
                    OnEvent.Scroll = false;
                    $nowCut.addClass(Video.data('over'));
                    setTimeout(function(){
                        ScrollBD.removeClass(ScrollIcon.data('hide'));
                        clearTimeout($Timer);
                    } , 100);

                    GAPush($nowCut.attr('ga_cat') , $nowCut.attr('ga_event') , $nowCut.attr('ga_label'));

                    if ( $nowCut.data('end') ) {
                        OnEvent.Index += 1;

                        Content.scrollTop(OnEvent.Index * Cut.outerHeight());

                        Projects.Factory.DotNav.eq(OnEvent.Index).addClass(Projects.Factory.Dot.data('curr')).siblings().removeClass(Projects.Factory.Dot.data('curr'));
                        $cut.find('img').eq(0).addClass(Video.data('show')).siblings().removeClass(Video.data('show'));
                        $nowCut.find('.index-os').removeClass(Video.data('animate'));
                        $nowCut.removeClass(Video.data('over'));
                        ScrollActivity.addClass(ScrollActivity.data('hide'));
                        GAPush(Step.eq(0).attr('ga_cat') , Step.eq(0).attr('ga_event') , Step.eq(0).attr('ga_label'));
                    }
                }
            }
        },
        OpenBox = {
            Timer   : null,
            OnClick : function(Elememt) {
                var $this = this;
                jQuery(Elememt).removeClass(jQuery(Elememt).data('hide')).addClass(jQuery(Elememt).data('open'));
                OnEvent.Blur = true;
                clearTimeout(CaseAnimate.Timer);
                jQuery('.m-Projects.Factory.dot').addClass(jQuery('.m-Projects.Factory.dot').data('blur'));

                Projects.Factory.D.on(Projects.Factory.DocumentOff, function (e) {
                    e.stopPropagation();

                    if ( ! jQuery(e.target).is('.jQ-box , .jQ-box * , .index-case-ft , .index-case-ft *') ) {
                        jQuery(Elememt).removeClass(jQuery(Elememt).data('open'));
                        $this.Timer = setTimeout(function(){
                            jQuery(Elememt).addClass(jQuery(Elememt).data('hide'));
                            OnEvent.Blur = false;
                            CaseAnimate.SetTime();
                            jQuery('.m-Projects.Factory.dot').removeClass(jQuery('.m-Projects.Factory.dot').data('blur'));
                            clearTimeout($this.Timer);
                        } , 400);
                    }
                });
            }
        };

    jQuery('.l-content').on('click' , '.m-dot-item' , function(e){
        e.preventDefault();
        DotEvent.OnClick(this);
    });

    jQuery('.jQ-box').on('click' , function(e){
        if ( Projects.Factory.UserAgent === 'PC' ) {
            e.preventDefault();
            OpenBox.OnClick('.index-case-ft');
        }
    });

    jQuery(document).ready(function(){
        Projects.Factory.DotSet(DotGet);
        OnEvent.Cut(Cut);
        OnEvent.Step(Step);

        if ( Projects.Factory.UserAgent === 'PC' ) {
            jQuery('.index-case-link').addClass('ga_click_preventDefault');
        }
    });

    jQuery(window).load(function(){
        Projects.Factory.LoadImg.Append(ImgLoaded);
    });

    jQuery(window).bind('resize' , function(){
        Projects.Factory.ViewHeight(Cut , Footer.height());
        Projects.Factory.ViewHeight(Step , Footer.height());
        Projects.Factory.ImgFull.Init(Cut);
        Content.scrollTop(OnEvent.Index * Cut.outerHeight());
        if ( Projects.Factory.UserAgent === 'PC' ) {
            jQuery('.index-case-link').addClass('ga_click_preventDefault');
        }
    });
}(window, document, jQuery));