/*!
 * sugarfunbox - jQuery Plugin
 * version: 4.0.1 (mon , 24 Aug 2015)
 * @requires jQuery v1.9 or later
 *
 * Copyright 2015 sugarfun ciro
 */

(function (window , document , jQuery , undefined) {
	'use strict';

	var H  = $('html'),
		B  = $('body'),
		HB = $('html , body'),
		W  = $(window),
		D  = $(document),
		S  = $.SugarFunBox = function () {
			S.open.apply( this , arguments );
		},
		IE =  navigator.userAgent.match(/msie/i),
		Browsers = function(){
			var $useragent = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
			var $tem;

			if( /trident/i.test( $useragent[1] ) ){
				$tem = /\brv[ :]+(\d+)/g.exec( navigator.userAgent ) || [];
				return 'IE '+($tem[1] || '');
			}
    		
    		if( $useragent[1] === 'Chrome' ){
    			$tem = navigator.userAgent.match( /\b(OPR|Edge)\/(\d+)/ );
    			if($tem!= null) return $tem.slice(1).join(' ').replace('OPR', 'Opera');
    		}

    		$useragent = $useragent[2] ? [ $useragent[1] , $useragent[2] ]: [ navigator.appName , navigator.appVersion , '-?' ];

    		if ( ( $tem = navigator.userAgent.match( /version\/(\d+)/i) )!= null ) $useragent.splice(1, 1, $tem[1]);
    			return $useragent.join(' ');
		},
		didUpdate = null,
		isTouch = document.createTouch !== undefined,
		isMobile = ( /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || D.width() < 768 ) ? true : false,
		isQuery	= function(obj) {
			return obj && obj.hasOwnProperty && obj instanceof $;
		},
		isString = function(str) {
			return str && $.type(str) === "string";
		},
		isPercentage = function(str) {
			return isString(str) && str.indexOf('%') > 0;
		},
		isScrollable = function(el) {
			return ( el && !(el.style.overflow && el.style.overflow === 'hidden') && ((el.clientWidth && el.scrollWidth > el.clientWidth) || (el.clientHeight && el.scrollHeight > el.clientHeight)));
		},
		getScalar = function(orig , dim) {
			var value = parseInt( orig , 10) || 0;

			if ( dim && isPercentage(orig) ) {
				value = S.getViewport()[ dim ] / 100 * value;
			}

			return Math.ceil(value);
		},
		getValue = function(value, dim) {
			return getScalar(value , dim) + 'px';
		};

	$.extend( S , {
		version  : '4.0.1',
		defaults : {
			width         : 800,
			height        : 450,
			autoSize      : true,
			autoResize    : true,
			autoHeight    : false,
			autoWidth     : false,
			autoCenter    : !isTouch,
			fitToView     : true,
			topRatio      : 0.5,
			leftRatio     : 0.5,
			scrolling     : 'auto', // 'auto', 'yes' or 'no'
			closeBtn      : true,
			closeClick    : false,
			mouseWheel    : true,
			modal         : false,
			index         : 0,
			href          : null,
			content       : null,
			loadImg       : null,
			closeBtnElem  : 'close',
			supportMobile : false,
			scrollOutside : true,

			keys : {
				close : [27]
			},

			tpl : {
				overlay  : '<div class="sugarfunbox-overlay"></div>',
				wrap     : '<div class="sugarfunbox" tabIndex="-1" role="dialog"><div class="sugarfunbox-hd"></div><div class="sugarfunbox-bd"></div></div>',
				iframe   : '<iframe id="sugarfunbox-frame{rnd}" name="sugarfunbox-frame{rnd}" class="sugarfunbox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true"></iframe>',
				closeBtn : '.sugarfunbox-close',
				loading  : '<div class="sugarfunbox-loading sugarfunbox-middleSet"><div class="sugarfunbox-loading-bd"></div></div>'
			},

			// Opening sugarfunbox
			openEffect  : 'fade', // 'elastic', 'fade' or 'none'
			openSpeed   : 250,
			openEasing  : 'swing',
			openOpacity : true,
			openMethod  : 'zoomIn',

			// Closing sugarfunbox
			closeEffect  : 'fade', // 'elastic', 'fade' or 'none'
			closeSpeed   : 250,
			closeEasing  : 'swing',
			closeOpacity : true,
			closeMethod  : 'zoomOut',

			iframe : {
				scrolling : 'auto',
				preload   : true
			},

			overlay : {},

			beforeOpen  : $.noop,
			afterOpen   : $.noop,
			beforeClose : $.noop,
			afterClose  : $.noop
		},
		group    : {},
		opts     : {},
		coming   : null,  // Element being loaded
		current  : null,  // Currently loaded element
		isActive : false, // Is activated
		isOpen   : false, // Is currently open
		isOpened : false, // Have been fully opened at least once

		wrap  : null,
		hd    : null,
		bd    : null,

		transitions : {},

		open : function(group , opts) {
			if ( ! group ) {
				return;
			}

			if ( ! $.isPlainObject(opts) ) {
				opts = {};
			}

			// Close if already active
			if ( false === S.close(true) ) {
				return;
			}

			// Normalize group
			if ( ! $.isArray(group) ) {
				group = isQuery(group) ? $(group).get() : [group];
			}

			$.each( group , function( i , element ) {
				var obj = {},
					href,
					content;

				if ( $.type(element) === 'object' ) {
					// Check if is DOM element
					if ( element.nodeType ) {
						element = $(element);
					}

					if ( isQuery(element) ) {
						obj = {
							href    : element.data('sugarfunbox-href') || element.attr('href'),
							isDom   : true,
							element : element
						};

						if ( $.metadata ) {
							$.extend(true , obj , element.metadata());
						}

					} else {
						obj = element;
					}
				}

				href = opts.href  || obj.href || ( isString(element) ? element : null );

				content = opts.content || obj.content;

				$.extend(obj , {
					href     : href,
					content  : content
				});

				group[ i ] = obj;


			});

			S.opts = $.extend(true , {} , S.defaults , opts);

			S.group = group;

			return S._start(S.opts.index);
		},
		cancel : function () {
			var coming = S.coming;

			if ( ! coming || false === S.trigger('onCancel')) {
				return;
			}

			S.hideLoading();

			if ( coming.wrap ) {
				coming.wrap.stop(true, true).trigger('onReset').remove();
			}

			S.coming = null;

			// If the first item has been canceled, then clear everything
			if ( ! S.current ) {
				S._afterClose( coming );
			}
		},
		close: function (event) {
			S.cancel();

			if ( false === S.trigger('beforeClose') ) {
				return;
			}

			S.unbindEvents();

			if ( ! S.isActive ) {
				return;
			}

			if ( ! S.isOpen || event === true ) {
				$('.sugarfunbox').stop(true).trigger('onReset').remove();

				S._afterClose();

			} else {
				S.isOpen = S.isOpened = false;
				S.isClosing = true;

				S.wrap.stop(true, true).removeClass('sugarfunbox-opened');
				S.transitions[ S.current.closeMethod ]();
			}


		},
		reposition : function (e , onlyAbsolute) {
			var current = S.current,
				wrap    = current ? current.wrap : null,
				pos;

			if ( wrap ) {
				pos = S._getPosition(onlyAbsolute);

				if ( e && e.type === 'scroll' ) {
					delete pos.position;

					// wrap.stop(true, true).animate(pos, 200);

				} else {
					wrap.css(pos);

					current.pos = $.extend({} , current.dim , pos);
				}
			}
		},
		update : function (e) {
			var type = ( e && e.type ),
				anyway = ! type || type === 'orientationchange';

			if ( anyway ) {
				clearTimeout(didUpdate);

				didUpdate = null;
			}

			if ( ! S.isOpen || didUpdate ) {
				return;
			}

			didUpdate = setTimeout(function() {
				var current = S.current;

				if ( ! current || S.isClosing ) {
					return;
				}

				S.wrap.removeClass('sugarfunbox-hidden');
				
				if ( anyway || type === 'load' || ( type === 'resize' && current.autoResize ) ) {
					S._setDimension();
				}

				if ( ! ( type === 'scroll' && current.canShrink ) ) {
					S.reposition(e);
				}

				S.trigger('onUpdate');

				didUpdate = null;
			} , ( anyway && ! isTouch ? 0 : 300 ) );
		},
		unbindEvents: function () {
			if ( S.wrap && isQuery(S.wrap) ) {
				S.wrap.unbind('mousewheel DOMMouseScroll');
			}

			D.unbind('scroll keydown');
		},
		bindEvents : function () {
			var viewport = S.getViewport(),
				current  = S.current,
				scrollTop = D.scrollTop(),
				keys;

			if ( ! current ) {
				return;
			}

			keys = current.keys;

			W.bind('orientationchange' + (isTouch ? '' : ' resize') + (current.autoCenter && !current.locked ? ' scroll' : ''), S.update);

			if ( keys ) {
				D.bind('keydown', function (e) {
					var code   = e.which || e.keyCode,
						target = e.target || e.srcElement;

					// Skip esc key if loading, because showLoading will cancel preloading
					if ( code === 27 && S.coming ) {
						return false;
					}

					// Ignore key combinations and key events within form elements
					if ( ! e.ctrlKey && ! e.altKey && ! e.shiftKey && ! e.metaKey && ! ( target && ( target.type || $(target).is('[contenteditable]')))) {
						$.each(keys, function(i , val) {
							if ( current.group.length > 1 && val[ code ] !== undefined ) {
								S[ i ]( val[ code ] );

								e.preventDefault();
								return false;
							}

							if ( $.inArray(code, val) > -1 ) {
								S[ i ] ();

								e.preventDefault();
								return false;
							}
						});
					}
				});
			}

			if ( ( ! isMobile || current.supportMobile ) && viewport.h > S.wrap.height() && current.mouseWheel  ) {
				D.bind('scroll' , function(e){
					e.preventDefault();
					e.stopPropagation();
					H.add(D).scrollTop(scrollTop);
					HB.animate({'scrollTop' : scrollTop} , '1');
					HB.stop(true , true);
				});

				S.wrap.add('.sugarfunbox-overlay').bind('mousewheel DOMMouseScroll', function (e , delta , deltaX , deltaY) {
					e.preventDefault();
					e.stopPropagation();

					var target    = e.target || null,
						parent    = $(target),
						canScroll = false;

					while ( parent.length ) {
						if ( ( canScroll || parent.is('.sugarfunbox *') ) ) {
							if ( S.wrap !== null ) {
								S.wrap.unbind('mousewheel DOMMouseScroll');
							}
							break;
						}

						canScroll = isScrollable( parent[0] );
						parent    = $(parent).parent();
					}
				});

				D.bind('keydown' , function (e) {
					if ( e.keyCode === 38 || e.keyCode === 40 ) {
						e.preventDefault();
						e.stopPropagation();
					}
				});

			}
		},
		resize : function (currentWidth , currentHeight) {
			var viewport = S.getViewport(),
				current  = S.current,
				width    = current.width,
				wrap     = S.wrap,
				hd       = S.hd,
				bd       = S.bd,
				origWidth,
				origHeight;

			current.width  = currentWidth ? currentWidth : width;
			current.height = currentHeight ? currentHeight : bd.find(' > * ').outerHeight();
			S.update();
		},
		trigger : function ( event , o ) {
			var ret,
				obj = o || S.coming || S.current;

			if ( ! obj ) {
				return;
			}

			if ( $.isFunction( obj[event] ) ) {
				ret = obj[event].apply(obj, Array.prototype.slice.call(arguments, 1));
			}

			if ( ret === false ) {
				return false;
			}

			if ( obj.overlay ) {
				if ( $.isFunction( S.overlay[event] ) ) {
					S.overlay[event]( $.extend(true , {} , S.overlay.defaults , obj.overlay ) , obj );
				}
			}

			D.trigger(event);
		},
		hideLoading: function () {
			D.unbind('keydown');

			$('.sugarfunbox-loading').remove();
		},
		showLoading : function () {
			var el,
				viewport;

			S.hideLoading();

			el = $(S.defaults.tpl.loading).click(S.cancel).appendTo('body');

			if ( S.coming.loadImg !== null ) {
				$('<span class="sugarfunbox-loading-bd-img">'+ S.coming.loadImg +'</span>').appendTo('.sugarfunbox-loading-bd');
			} else {
				$('<span><i class="sugarfunbox-icon-loading"></i><i class="sugarfunbox-icon-loading"></i><i class="sugarfunbox-icon-loading"></i></span>').appendTo('.sugarfunbox-loading-bd');
			}

			// If user will press the escape-button, the request will be canceled
			D.bind('keydown' , function(e) {
				if ( ( e.which || e.keyCode ) === 27 ) {
					e.preventDefault();
					S.cancel();
				}
			});
		},
		getViewport : function () {
			var locked = ( S.current && S.current.locked ) || false,
				rez    = {
					x : W.scrollLeft(),
					y : W.scrollTop()
				};

			if ( locked ) {
				rez.w = locked[0].clientWidth;
				rez.h = locked[0].clientHeight;

			} else {
				rez.w = isTouch && window.innerWidth  ? window.innerWidth  : W.width();
				rez.h = isTouch && window.innerHeight ? window.innerHeight : W.height();
			}
			
			return rez;
		},
		_start: function (index) {
			var coming = {},
				obj,
				href;

			index = getScalar( index );
			obj   = S.group[ index ] || null;

			if ( ! obj ) {
				return false;
			}

			coming = $.extend(true , {} , S.opts , obj);

			// 'modal' propery is just a shortcut
			if ( coming.modal ) {
				$.extend(true , coming , {
					closeBtn   : false,
					closeClick : false,
					mouseWheel : false,
					keys       : null,
					overlay : {
						closeClick : false
					}
				});
			}

			// support Mobile
			if ( ! coming.supportMobile && isMobile ) {
				B.find('> *:not(.sugarfunbox)').addClass('sugarfunbox-hide');
			}

			// 'autoSize' property is a shortcut, too
			if ( ( coming.width === 'auto' || coming.width === S.defaults.width ) && coming.autoSize ) {
				coming.autoWidth = true;
			}

			if ( ( coming.height === 'auto' || coming.height === S.defaults.height ) && coming.autoSize ) {
				coming.autoHeight = true;
			}

			if ( coming.width === 'auto' ) {
				coming.autoWidth = true;
			}

			if ( coming.height === 'auto' ) {
				coming.autoHeight = true;
			}

			coming.group = S.group;
			coming.index = index;

			// Give a chance for callback or helpers to update coming item (type, title, etc)
			S.coming = coming;

			href = coming.href;

			S.isActive = true;

			coming.wrap = $(coming.tpl.wrap).addClass('sugarfunbox-' + ( ( ! coming.supportMobile && isMobile ) ? 'mobiles' : 'desktops' ) + ' sugarfunbox-hidden' ).appendTo( coming.parent || 'body' );

			// closebtn
			if ( coming.closeBtn ) {
				$('.sugarfunbox-hd', coming.wrap).append('<a href="javascript:;" class="sugarfunbox-close" title="Close"></a>');
			}

			if ( coming.closeBtnElem.match(/(\<|\>)/g) ) {
				$('.sugarfunbox-close' , $('.sugarfunbox-hd', coming.wrap)).append( $(coming.closeBtnElem) );
			} else {
				$('.sugarfunbox-close' , $('.sugarfunbox-hd', coming.wrap)).text( coming.closeBtnElem );	
			}

			// Build the neccessary markup
			$.extend( coming , {
				hd : $('.sugarfunbox-hd', coming.wrap),
				bd : $('.sugarfunbox-bd', coming.wrap)
			});

			S.trigger('onReady');

			// Check before try to load; 'inline' and 'html' types need content, others - href
			if ( coming.href !== null && coming.href !== 'javascript:;' && coming.href !== '#' ) {
				S._loadIframe();
			} else {
				S._afterLoad();	
			}
			
		},
		_loadIframe : function() {
			var coming = S.coming,
				iframe = $( coming.tpl.iframe.replace( /\{rnd\}/g , new Date().getTime() ) )
					.attr('scrolling', isTouch ? 'auto' : coming.iframe.scrolling)
					.attr('src', coming.href);

			$(coming.wrap).addClass('sugarfunbox-load-iframe');

			// This helps IE
			$(coming.wrap).bind('onReset', function () {
				try {
					$(this).find('iframe').hide().attr('src', '//about:blank').end().empty();
				} catch (e) {}
			});

			if ( coming.iframe.preload ) {
				S.showLoading();

				iframe.one('load', function() {
					$(this).data('ready', 1);

					// iOS will lose scrolling if we resize
					if ( ! isTouch ) {
						$(this).bind('load', S.update);
					}

					// Without this trick:
					// - iframe won't scroll on iOS devices
					// - IE7 sometimes displays empty iframe
					$(this).parents('.sugarfunbox').width('100%').removeClass('sugarfunbox-hidden').show();

					S._afterLoad();
				});
			}

			coming.content = iframe.appendTo( coming.bd );

			if ( ! coming.iframe.preload ) {
				S._afterLoad();
			}
		},
		_afterLoad : function () {
			var coming   = S.coming,
				previous = S.current,
				current,
				content,
				scrolling,
				href,
				embed;

			S.hideLoading();

			if ( ! coming || S.isActive === false ) {
				return;
			}

			if ( false === S.trigger('afterLoad' , coming , previous)) {
				coming.wrap.stop(true).trigger('onReset').remove();

				S.coming = null;

				return;
			}

			S.unbindEvents();

			current   = coming;
			content   = coming.content;
			scrolling = coming.scrolling;

			$.extend( S , {
				wrap     : current.wrap,
				hd       : current.hd,
				bd       : current.bd,
				current  : current,
				previous : previous
			});

			href = current.href;

			if ( isQuery( content ) ) {
				if ( ! ( isQuery( content ) && content.parent().is( current.bd ) ) ) {
					current.bd.append( content );
					$(content).attr('style' , 'display : block !important');
				}
			} else {
				if ( content.indexOf('#') === 0 || content.indexOf('.') === 0 ) {
					current.bd.append( $(content) );
					$(content).attr('style' , 'display : block !important');
				} else {
					current.bd.append( content );
					$(content).attr('style' , 'display : block !important');
				}
			}

			// Give a chance for helpers or callbacks to update elements
			S.trigger('beforeOpen');

			// Set scrolling before calculating dimensions
			current.bd.css('overflow', scrolling === 'yes' ? 'scroll' : (scrolling === 'no' ? 'hidden' : scrolling));

			// Set initial dimensions and start position
			S._setDimension();

			S.reposition();

			S.isOpen = false;
			S.coming = null;

			S.bindEvents();

			if ( ! S.isOpened ) {
				$('.sugarfunbox').not( current.wrap ).stop(true).trigger('onReset').remove();
			}

			S.transitions[ S.isOpened ? current.nextMethod : current.openMethod ]();
		},
		_setDimension : function () {
			var viewport   = S.getViewport(),
				steps      = 0,
				canShrink  = false,
				canExpand  = false,
				wrap       = S.wrap,
				hd         = S.hd,
				bd         = S.bd,
				current    = S.current,
				width      = current.width,
				height     = current.height,
				scrolling  = current.scrolling,
				scrollOut  = current.scrollOutside ? current.scrollbarWidth : 0,
				origWidth,
				origHeight,
				width_,
				height_,
				iframe,
				body;

			// Reset dimensions so we could re-check actual size
			if ( ! isMobile || current.supportMobile ) {
				wrap.add(hd).add(bd).width('auto').height('auto').removeClass('sugarfunbox-hidden');
			} else {
				wrap.width('100%').removeClass('sugarfunbox-hidden');
			}

			origWidth  = ( viewport.w < getScalar(width , 'w') ) ? ( viewport.w * 0.95 ) : getScalar(width , 'w');
			origHeight = height;

			if ( current.href !== null && current.href !== 'javascript:;' && current.href !== '#' ) {
				iframe = current.content;

				if ( current.autoHeight && parseInt(iframe.data('ready') , 10) === 1 ) {

					try {
						if ( iframe[0].contentWindow.document.location ) {
							if ( ! isMobile || current.supportMobile ) {
								wrap.add(bd).width( origWidth );
							} else {
								bd.width( '100%' );
							}

							body       = iframe[0].contentWindow.document.body;
							origHeight = body.scrollHeight;

							bd.height(9999);

							if ( scrollOut ) {
								body.css('overflow-x' , 'hidden');
							}

							origHeight = origHeight;
						}

					} catch (e) {}
				}

			} else if ( current.autoWidth || current.autoHeight ) {
				wrap.addClass( 'sugarfunbox-hidden' );

				// Set width or height in case we need to calculate only one dimension
				if ( ! current.autoWidth && ( ! isMobile || current.supportMobile ) ) {
					bd.width( origWidth );
				}

				if ( ! current.autoHeight ) {
					bd.height( origHeight );
				}

				if ( current.autoWidth && ( ! isMobile || current.supportMobile ) ) {
					origWidth = bd.width();
				}

				if ( current.autoHeight ) {
					origHeight = bd.height();
				}

				wrap.removeClass( 'sugarfunbox-hidden' );
			}

			width  = ( ! isMobile || current.supportMobile ) ? getScalar( origWidth ) : '100%';
			height = getScalar( origHeight );

			// Try to fit inside viewport (including the title)
			if ( current.fitToView ) {
				bd.width( width ).height( height );

				wrap.width( width );

				// Real wrap dimensions
				width_  = wrap.width();
				height_ = wrap.height();
			}

			if ( scrollOut && scrolling === 'auto' && height < origHeight_) {
				width += scrollOut;
			}

			bd.width( width ).height( height );
			wrap.width( width );

			width_  = wrap.width();
			height_ = wrap.height();

			canShrink = false;
			canExpand = current.aspectRatio ? (width < origWidth && height < origHeight) : ((width < origWidth || height < origHeight));

			$.extend(current, {
				dim : {
					width	: getValue( width_ ),
					height	: getValue( height_ )
				},
				origWidth  : origWidth,
				origHeight : origHeight,
				canShrink  : canShrink,
				canExpand  : canExpand,
				wrapSpace  : height_,
				hdSpace    : height
			});

			if ( ! iframe && current.autoHeight && ! canExpand ) {
				bd.height('auto');
			}
		},
		_getPosition : function (onlyAbsolute) {
			var current  = S.current,
				viewport = S.getViewport(),
				width    = S.wrap.width(),
				height   = S.wrap.height(),
				rez      = {
					top        : ( ! isMobile || current.supportMobile ) ? ( viewport.y + 10 ) : 0,
					marginTop  : 0,
					marginLeft : ( ! isMobile || current.supportMobile ) ? getValue( ( width * current.leftRatio * (-1) ) ) : 0
				};

			if ( viewport.h > height ) {
				rez.top       = ( ! isMobile || current.supportMobile ) ? getValue( ( (viewport.h * current.topRatio) + viewport.y ) ) : 0;
				rez.marginTop = ( ! isMobile || current.supportMobile ) ? getValue( ( height * current.topRatio * (-1) ) ) : 0;
			}

			return rez;
		},
		_afterOpen : function () {
			var current = S.current;

			if ( ! current ) {
				return;
			}

			S.isOpen = S.isOpened = true;

			S.wrap.css('overflow', 'visible').addClass('sugarfunbox-opened');

			S.update();

			// Create a close button
			if ( current.closeBtn ) {
				$('.sugarfunbox').on( 'click' , current.tpl.closeBtn , function(e) {
					e.preventDefault();
					S.close();
				});
			}

			S.trigger('afterOpen');
		},
		_afterClose : function(obj) {
			obj = obj || S.current;

			$('.sugarfunbox').trigger('onReset').remove();

			$.extend( S, {
				group     : {},
				opts      : {},
				router    : false,
				current   : null,
				isActive  : false,
				isOpened  : false,
				isOpen    : false,
				isClosing : false,
				wrap      : null,
				hd        : null,
				bd        : null
			});

			S.trigger('afterClose' , obj);
		}
	});

	S.transitions = {
		getOrigPosition: function () {
			var current  = S.current,
				element  = current.element,
				orig     = current.orig,
				pos      = {},
				width    = 50,
				height   = 50,
				viewport = S.getViewport();

			if ( ! orig && current.isDom && element.is(':visible')) {
				orig = element.find('img:first');

				if ( ! orig.length ) {
					orig = element;
				}
			}

			if ( isQuery( orig ) ) {
				pos = orig.offset();
			} else {
				pos.top  = viewport.y + (viewport.h - height) * current.topRatio;
				pos.left = viewport.x + (viewport.w - width)  * current.leftRatio;
			}

			if ( S.wrap.css('position') === 'fixed' || current.locked ) {
				pos.top  -= viewport.y;
				pos.left -= viewport.x;
			}

			pos = {
				top     : getValue(pos.top * current.topRatio),
				left    : getValue(pos.left * current.leftRatio),
				width   : getValue(width),
				height  : getValue(height)
			};

			return pos;
		},
		step: function (now, fx) {
			var ratio,
				value,
				prop       = fx.prop,
				current    = S.current,
				wrapSpace  = current.wrapSpace,
				hdSpace    = current.hdSpace;

			if ( prop === 'width' || prop === 'height' ) {
				ratio = fx.end === fx.start ? 1 : (now - fx.start) / (fx.end - fx.start);

				if ( S.isClosing ) {
					ratio = 1 - ratio;
				}

				value = now;

				S.hd[ prop ]( getScalar( prop === 'width' ?  value : value - (wrapSpace * ratio) ) );
				S.bd[ prop ]( getScalar( prop === 'width' ?  value : value - ( wrapSpace * ratio ) - ( hdSpace * ratio ) ) );
			}
		},
		zoomIn: function () {
			var current  = S.current,
				startPos = current.pos,
				effect   = current.openEffect,
				elastic  = effect === 'elastic',
				endPos   = $.extend({ opacity : 1 } , startPos);

			// Remove "position" property that breaks older IE
			delete endPos.position;

			if ( elastic ) {
				startPos = this.getOrigPosition();

				if ( current.openOpacity ) {
					startPos.opacity = 0.1;
				}

			} else if ( effect === 'fade' ) {
				startPos.opacity = 0.1;
			}

			S.wrap.css(startPos).animate(endPos , {
				duration : effect === 'none' ? 0 : current.openSpeed,
				easing   : current.openEasing,
				step     : elastic ? this.step : null,
				complete : S._afterOpen
			});
		},

		zoomOut: function () {
			var current  = S.current,
				effect   = current.closeEffect,
				elastic  = effect === 'elastic',
				endPos   = { opacity : 0.1 };

			if ( elastic ) {
				endPos = this.getOrigPosition();

				if ( current.closeOpacity ) {
					endPos.opacity = 0.1;
				}
			}

			if ( isQuery( current.content ) ) {
				if ( current.content.selector !== '' ) {
					current.content.removeAttr('style');
					current.content.appendTo('body');
				}
			} else {
				if ( current.content.indexOf('#') === 0 || current.content.indexOf('.') === 0 ) {
					$(current.content).removeAttr('style');
					$(current.content).appendTo('body');
				}
			}

			S.wrap.animate( endPos , {
				duration : effect === 'none' ? 0 : current.closeSpeed,
				easing   : current.closeEasing,
				step     : elastic ? this.step : null,
				complete : S._afterClose
			});
		},

		changeIn: function () {
			var current   = S.current,
				effect    = current.nextEffect,
				startPos  = current.pos,
				endPos    = { opacity : 1 },
				direction = S.direction,
				distance  = 200,
				field;

			startPos.opacity = 0.1;

			if ( effect === 'elastic' ) {
				field = direction === 'down' || direction === 'up' ? 'top' : 'left';

				if (direction === 'down' || direction === 'right') {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) - distance);
					endPos[ field ]   = '+=' + distance + 'px';

				} else {
					startPos[ field ] = getValue(getScalar(startPos[ field ]) + distance);
					endPos[ field ]   = '-=' + distance + 'px';
				}
			}

			if ( effect === 'none' ) {
				S._afterOpen();

			} else {
				S.wrap.css(startPos).animate(endPos, {
					duration : current.nextSpeed,
					easing   : current.nextEasing,
					complete : S._afterOpen
				});
			}
		},

		changeOut: function () {
			var previous  = S.previous,
				effect    = previous.prevEffect,
				endPos    = { opacity : 0.1 },
				direction = S.direction,
				distance  = 200;

			if ( effect === 'elastic' ) {
				endPos[ direction === 'down' || direction === 'up' ? 'top' : 'left' ] = ( direction === 'up' || direction === 'left' ? '-' : '+' ) + '=' + distance + 'px';
			}

			previous.wrap.animate(endPos , {
				duration : effect === 'none' ? 0 : previous.prevSpeed,
				easing   : previous.prevEasing,
				complete : function () {
					$(this).trigger('onReset').remove();
				}
			});
		}
	};

	S.overlay = {
		defaults : {
			closeClick : true,     // if true, fancyBox will be closed when user clicks on the overlay
			speedOut   : 200,      // duration of fadeOut animation
			showEarly  : true,     // indicates if should be opened immediately or wait until the content is ready
			css        : {},       // custom CSS properties
			locked     : !isTouch, // if true, the content will be locked into overlay
			fixed      : true      // if false, the overlay CSS position property will not be set to "fixed"
		},

		overlay : null,  // current handle
		fixed   : false, // indicates if the overlay has position "fixed"
		el      : H,     // element that contains "the lock"

		// Public methods
		create : function(opts) {
			opts = $.extend({} , this.defaults , opts);

			if ( this.overlay ) {
				this.close();
			}

			this.overlay = $(S.coming.tpl.overlay).addClass('sugarfunbox-overlay' + ( ( ! S.coming.supportMobile && isMobile ) ? 'mobiles' : 'desktops' ) );
			this.fixed   = false;

			if ( opts.fixed && S.defaults.fixed ) {
				this.overlay.addClass('sugarfunbox-overlay-fixed');

				this.fixed = true;
			}

			if ( ( S.coming.supportMobile && isMobile ) || ! isMobile ) {
				this.overlay.appendTo( S.coming ? S.coming.parent : opts.parent );
			}
		},

		open : function(opts) {
			var that = this;

			opts = $.extend({} , this.defaults , opts);

			if ( this.overlay ) {
				this.overlay.unbind('.overlay').width('auto').height('auto');
			} else {
				this.create(opts);
			}

			if ( ! this.fixed ) {
				W.bind('resize.overlay', $.proxy( this.update, this) );

				this.update();
			}

			if ( opts.closeClick ) {
				this.overlay.bind('click.overlay', function(e) {
					if ( $( e.target ).hasClass('sugarfunbox-overlay') ) {
						if ( S.isActive ) {
							S.close();
						} else {
							that.close();
						}

						return false;
					}
				});
			} else {
				this.overlay.addClass('sugarfunbox-overlay-cursor');
			}

			this.overlay.css( opts.css ).show();
		},

		close : function() {
			var scrollV, scrollH;

			W.unbind('resize.overlay');

			if ( this.el.hasClass('sugarfunbox-lock') ) {
				$('.sugarfunbox-margin').removeClass('sugarfunbox-margin');

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.removeClass('sugarfunbox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			$('.sugarfunbox-overlay').remove().hide();
			B.find('.sugarfunbox-hide').removeClass('sugarfunbox-hide');

			$.extend(this, {
				overlay : null,
				fixed   : false
			});
		},
		// Private, callbacks
		update : function () {
			var width = '100%',
				offsetWidth;

			// Reset width/height so it will not mess
			this.overlay.width(width).height('100%');

			// jQuery does not return reliable result for IE
			if ( IE ) {
				offsetWidth = Math.max( document.documentElement.offsetWidth , document.body.offsetWidth );

				if ( D.width() > offsetWidth ) {
					width = D.width();
				}

			} else if ( D.width() > W.width() ) {
				width = D.width();
			}

			this.overlay.width(width).height(D.height());
		},
		// This is where we can manipulate DOM, because later it would cause iframes to reload
		onReady : function (opts, obj) {
			var overlay = this.overlay;

			$('.sugarfunbox-overlay').stop(true, true);

			if ( ! overlay ) {
				this.create(opts);
			}

			if ( opts.locked && this.fixed && obj.fixed ) {
				if ( ! overlay ) {
					this.margin = D.height() > W.height() ? H.css('margin-right').replace('px' , '') : false;
				}

				obj.fixed  = false;
			}

			if ( opts.showEarly === true ) {
				this.beforeOpen.apply( this, arguments );
			}
		},

		beforeOpen : function(opts, obj) {
			var scrollV, scrollH;

			if ( obj.locked ) {
				if ( this.margin !== false ) {
					$( '*' ).filter(function(){
						return ( $(this).css('position') === 'fixed' && ! $(this).hasClass('sugarfunbox-overlay') && ! $(this).hasClass('sugarfunbox') );
					}).addClass('sugarfunbox-margin');

					this.el.addClass('sugarfunbox-margin');
				}

				scrollV = W.scrollTop();
				scrollH = W.scrollLeft();

				this.el.addClass('sugarfunbox-lock');

				W.scrollTop( scrollV ).scrollLeft( scrollH );
			}

			this.open(opts);
		},

		onUpdate : function() {
			if ( ! this.fixed ) {
				this.update();
			}
		},

		afterClose: function (opts) {
			// Remove overlay if exists and fancyBox is not opening
			// (e.g., it is not being open using afterClose callback)
			//if (this.overlay && !S.isActive) {
			if ( this.overlay && ! S.coming ) {
				if ( Browsers() !== 'MSIE 8' ) {
					this.overlay.fadeOut(opts.speedOut , $.proxy( this.close , this ));
				} else {
					this.overlay.hide();
					this.close;
				}
			}
		}
	};

	$.fn.SugarFunBox = function (options) {
		var index,
			that     = $(this),
			selector = this.selector || '',
			run      = function(e) {
				var what = $(this).blur(),
					idx  = index,
					relType,
					relVal;

				if ( ! ( e.ctrlKey || e.altKey || e.shiftKey || e.metaKey ) && ! what.is('.sugarfunbox')) {
					options.index = idx;

					// // Stop an event from bubbling if everything is fine
					if ( S.open( what , options ) !== false ) {
						e.preventDefault();
					}
				}
			};

		options = options || {};
		index   = options.index || 0;

		if ( ! selector || options.live === false ) {
			that.unbind('click').bind('click', run);
		} else {
			D.undelegate(selector , 'click').delegate(selector , 'click', run);
		}

		return this;
	};

	D.ready(function() {
		$.extend(S.defaults, {
			fixed  : $.support.fixedPosition,
			parent : B
		});
	});
}(window, document, jQuery));