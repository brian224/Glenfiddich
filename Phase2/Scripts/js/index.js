(function (window, document, jQuery, undefined) {
    'use strict';

    var Load    = jQuery('.l-load'),
        Content = jQuery('.l-content'),
        Footer  = jQuery('.l-footer'),
        Open    = {
            Element : jQuery('.jQ-lock').find('span'),
            Total   : 0,
            Replay  : false,
            Win     : ['1' , '9' , '6' , null],
            OnClick : function() {
                var $this = this;
                jQuery('.jQ-section').addClass(jQuery('.jQ-section').data('lock'));

                for (var i = 0 ; i < Open.Element.length ; i ++ ) {
                    Open.Start.Arrays.push(0);
                    Open.Start.TimeOut.push(null);
                    Open.Start.Checked.push(null);
                };

                Open.GetResult();
                Open.Numbers();
            },
            GetResult : function () {
                var $this = this;
                var $type = null;
                // var result = 99;

                jQuery.post('/api/lottery/'+ Projects.Factory.FB.UserID +'' , function (result) {
                } , 'json').then(function (result) {
                    if ( result !== 99 && result !== 2 ) {
                        $this.Random();
                        $type = jQuery('.jQ-result').data('miss');

                        if ( result !== 3 ) {
                            $this.Replay = true;

                            if ( result === 0 ) {
                                // 今天沒抽過、沒中獎
                                Open.Token.Get();
                                jQuery('.jQ-result-check').addClass(jQuery('.jQ-result-check').data('form')).removeClass(jQuery('.jQ-result-check').data('end'));
                            } else if ( result === 1 ) {
                                // 今天已抽過 沒中獎
                                jQuery('.jQ-result-check').addClass(''+jQuery('.jQ-result-check').data('replay')+' '+jQuery('.jQ-result-check').data('end')+'').removeClass(jQuery('.jQ-result-check').data('form'));
                            }
                        } else {
                            // 已經中過獎
                            Open.Token.Get();
                            jQuery('.jQ-result-check').addClass(jQuery('.jQ-result-check').data('form')).removeClass(jQuery('.jQ-result-check').data('end'));
                        }
                    } else {
                        
                        $this.Win[($this.Win.length - 1)] = '3';
                        $type = jQuery('.jQ-result').data('win');

                        if ( result === 2 ) {
                            // 今天中過獎
                            jQuery('.jQ-result-check').addClass(''+jQuery('.jQ-result-check').data('replay')+' '+jQuery('.jQ-result-check').data('end')+'').removeClass(jQuery('.jQ-result-check').data('form'));
                        } else if ( result === 99 ) {
                            // 中獎
                            Open.Token.Get();
                            jQuery('.jQ-result-check').addClass(jQuery('.jQ-result-check').data('form')).removeClass(jQuery('.jQ-result-check').data('end'));
                        }
                    }

                    jQuery('.jQ-result').addClass($type);
                });
            },
            Random : function() {
                var $this   = this;
                var $arr    = [1 , 2 , 4 , 5 , 6 , 7 , 8 , 9 , 0];
                var $random = (Math.floor( Math.random() * ( $arr.length ) ));

                $this.Win[($this.Win.length - 1)] = ($arr[$random] + '');
            },
            Numbers : function() {
                var $this    = this;
                var $index   = 0;
                var $timeout = null;

                $timeout = setInterval(function(){
                    if ( $index < $this.Element.length  ) {
                        $index ++;
                        $this.Start.Run(($index - 1));
                        
                    } else {
                        window.clearInterval($timeout);
                    }
                } , 300);
            },
            Start : {
                Idx      : (-1),
                Time     : 0,
                StopTime : 5000,
                Speed    : 35,
                Arrays   : [],
                Checked  : [],
                TimeOut  : [],
                Run      : function(Index) {
                    var $this  = this;
                    var $clone = jQuery('.jQ-lock').find('span').eq(Index).find('.m-icon').first();

                    $this.Time ++;

                    jQuery('.jQ-lock').find('> ul > li > div').eq(Index).addClass(jQuery('.jQ-lock').data('animate'));
                    jQuery('.jQ-lock').find('span').eq(Index).append($clone);

                    $this.Arrays[Index] = ($this.Arrays[Index] += 1);

                    if ( $this.Arrays[Index] > 9 ) {
                        $this.Arrays[Index] = 0;
                    }

                    $this.TimeOut[Index] = setTimeout(function(){
                        $this.Run(Index);
                    } , $this.Speed);

                    if ( $this.Idx !== null ) {
                        if ( ( ( ( $this.StopTime / Open.Element.length ) / $this.Speed ) * ( $this.Idx + 2 ) ) < $this.Time ) {
                            $this.Idx += 1;

                            if ( $this.Idx > Open.Element.length ) {
                                $this.Idx = null;
                            }
                        }

                        if ( $this.Idx === 0 ) {
                            Open.Stop.Run($this.Idx);
                        } else {
                            if ( $this.Checked[($this.Idx - 1)] ) {
                                Open.Stop.Run($this.Idx);
                            }
                        }
                    }
                }
            },
            Stop : {
                Index : 0,
                Run   : function(Index) {
                    var $this = this;
                    
                    if ( ( Open.Win[Index] != 0 ? ( parseInt(Open.Win[Index] , 10) - 1 ) : 9 ) == jQuery('.jQ-lock').find('span').eq(Index).find('.m-icon').first().data('number') ) {
                        jQuery('.jQ-lock').find('> ul > li > div').eq(Index).removeClass(jQuery('.jQ-lock').data('animate'));
                        Open.Start.Checked[Index] = Open.Win[Index];
                        window.clearTimeout(Open.Start.TimeOut[Index]);
                        $this.Index = Index;
                    }

                    if ( $this.Index === ( Open.Element.length - 1 ) ) {
                        $this.Open.Run();
                    }
                },
                Open : {
                    StopTime : 500,
                    TimeOut  : null,
                    Run      : function() {
                        var $this = this;

                        $this.TimeOut = setTimeout(function(){
                            jQuery('.jQ-result').removeClass(jQuery('.jQ-result').data('hide'));
                            window.clearTimeout($this.TimeOut);
                        } , $this.StopTime);
                    }
                }
            },
            Token : {
                Arr      : ['0' , '1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , 'A' , 'B' , 'C' , 'D' , 'E' , 'F' , 'G' , 'H' , 'I' , 'J' , 'K' , 'L' , 'M' , 'N' , 'O' , 'P' , 'Q' , 'R' , 'S' , 'T' , 'U' , 'V' , 'W' , 'X' , 'Y' , 'Z'],
                Value    : '',
                ChkValue : '',
                Get : function() {
                    var $this  = this;
                    var $index = null;

                    for ( var i = 1 ; i <= 20 ; i ++ ) {

                        $index = Math.floor(Math.random() * $this.Arr.length);
                        
                        if ( i > 8 && i < 13 ) {
                            if ( i == 9 ) {
                                $this.Value    = $this.Value + $this.Arr[12];
                                $this.ChkValue = $this.ChkValue + $this.Arr[12];
                            } else if ( i == 10 ) {
                                $this.Value = $this.Value + $this.Arr[18];
                                $this.ChkValue = $this.ChkValue + $this.Arr[18];
                            } else if ( i == 11 ) {
                                $this.Value = $this.Value + $this.Arr[27];
                                $this.ChkValue = $this.ChkValue + $this.Arr[27];
                            } else if ( i == 12 ) {
                                $this.Value = $this.Value + $this.Arr[24];
                                $this.ChkValue = $this.ChkValue + $this.Arr[24];
                            }
                        } else {
                            $this.Value = $this.Value + $this.Arr[$index];
                        }
                    }

                    $this.Check();
                },
                Check : function() {
                    var $this = this;
                    var $regular = new RegExp('' + $this.ChkValue + '');

                    if ( $this.Value.match($this.ChkValue) ) {
                        return true;
                    }
                }
            },
            Submits : function(Element) {
                var $this        = this;
                var $type        = jQuery(Element).data('type');
                var $chinese     = /^[\u4E00-\u9FA5]+$/,
                    $number      = /^[0-9]+$/,
                    $email       = /^[^@^\s]+@[^\.@^\s]+(\.[^\.@^\s]+)+$/;
                var $nameElem    = jQuery(Element).prev('.index-result-form').find('input[name="Name"]'),
                    $phoneElem   = jQuery(Element).prev('.index-result-form').find('input[name="Phone"]'),
                    $emailElem   = jQuery(Element).prev('.index-result-form').find('input[name="Email"]'),
                    $receiveElem = jQuery('input[name="Receive"]:checked');
                var $error       = '';
                var $data        = {
                        FacebookId : ''+Projects.Factory.FB.UserID+'',
                        Name       : '',
                        Phone      : '',
                        Email      : '',
                        Receive    : ''
                    };

                // if ( $this.Token.Value !== '' && $this.Token.Value.length === 20 && $this.Token.Check ) {

                if ( $nameElem.val() !== '' && $chinese.test($nameElem.val()) ) {
                    $nameElem.parent().removeClass('is-error');
                    $data.Name = $nameElem.val();
                } else {
                    $nameElem.parent().addClass('is-error');
                    $error += $nameElem.data('error') + '\n';
                }

                if ( $phoneElem.val() !== '' && $phoneElem.val().length >= 9 && $number.test($phoneElem.val()) ) {
                    $phoneElem.parent().removeClass('is-error');
                    $data.Phone = $phoneElem.val();
                } else {
                    $phoneElem.parent().addClass('is-error');
                    $error += $phoneElem.data('error') + '\n';
                }

                if ( $emailElem.val() !== '' && $email.test($emailElem.val()) ) {
                    $emailElem.parent().removeClass('is-error');
                    $data.Email = $emailElem.val();
                } else {
                    $emailElem.parent().addClass('is-error');
                    $error += $emailElem.data('error');
                }

                if ( $type === 'win' ) {
                    if ( $receiveElem.val() ) {
                        jQuery('input[name="Receive"]').parents('.index-result-label').removeClass('is-error');
                        $data.Receive = $receiveElem.val();
                    } else {
                        jQuery('input[name="Receive"]').parents('.index-result-label').addClass('is-error');
                        $error += '\n' + jQuery('input[name="Receive"]').parents('.index-result-label').data('error');
                    }
                }

                // success
                if ( jQuery(Element).prev('.index-result-form').find('.is-error').length === 0 ) {
                    var $api = null;
                    var $title = '',
                        $description = '1963年，格蘭家族以夢想裝箱 起身挑戰世界；2016年，由你解密開箱！帶走襲捲世界的夢想威士忌！',
                        $picture = 'share.jpg';

                    if ( $type === 'win' ) {
                        $api   = '/api/winner/';
                        $title = '猴賽雷！一開年就帶走經典15年，和我一起好運吧！';
                    } else {
                        $api = '/api/share/';
                        $title = '吼~我需要好運！和我一起解密開箱拿格蘭菲迪15年！';
                    }

                    jQuery.post($api , $data , function (result) {
                    } , 'json').then(function (result) {
                        if ( result === 1 ) {
                            alert(jQuery('.jQ-result').data('error'));
                        } else {
                            jQuery('.jQ-result-check').addClass(jQuery('.jQ-result-check').data('end')).removeClass(jQuery('.jQ-result-check').data('form'));
                            Projects.Factory.FB.Feed($title , $description , $picture);
                        }
                    });
                } else {
                    alert($error);
                }
                // } else {
                //     alert(jQuery('.jQ-result').data('error'));
                // }
            }
        },
        ImgLoaded = function() {
            Load.addClass(Load.data('cloak'));
            setTimeout(function(){
                Load.addClass(Load.data('hide')).removeClass(Load.data('cloak'));
            } , 400);
        };

    jQuery('.jQ-open').on('click' , function(e){
        e.preventDefault();
        Projects.Factory.FB.GetLoaginState(Open.OnClick);
        // Open.OnClick();
    });

    jQuery('.jQ-submit').on('click' , function(e){
        e.preventDefault();
        Open.Submits(this);
    });

    jQuery('.jQ-ga').on('click' , function(e){
        var $this  = jQuery(this);
        var $label = $this.attr('ga_label');

        e.preventDefault();

        if ( Open.Replay ) {
            $label = ( $this.data('replay') + $this.attr('ga_label') );
        }

        if ( $this.hasClass('ga_click_preventDefault') ) {
            GAPush( $this.attr('ga_cat') , $this.attr('ga_event') , $label );
        } else {
            GAPush( $this.attr('ga_cat') , $this.attr('ga_event') , $label , {'hitCallback' : GAHitBack($this)} );
        }
        
    });

    jQuery(document).ready(function(){
        if ( Projects.Factory.UserAgent === 'Mobile' ) {
            Projects.Factory.ViewHeight(Content , Footer.height());
        }
    });

    jQuery(window).bind('load' , function(){
        Projects.Factory.LoadImg.Append(ImgLoaded);
    });

    jQuery(window).bind('resize' , function(){
        if ( Projects.Factory.UserAgent === 'Mobile' ) {
            Projects.Factory.ViewHeight(Content , Footer.height());
        } else {
            Content.css('height' , '');
        }
    });
}(window, document, jQuery));