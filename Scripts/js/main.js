var $menu        = $('.menu'),
	$sidenav     = $('.sidenav'),
	$lContent    = $('.l-content'),
	$videoWrap   = $lContent.find('.video-wrap'),
	$caseWrap    = $lContent.find('.case-wrap'),
	$productWrap = $lContent.find('.product-wrap'),
	$btnMenu     = $menu.find('.btn-menu'),
	$btnSublink  = $menu.find('.btn-sublink'),
	$videoList   = $videoWrap.find('.list'),
	$btnLocation = $caseWrap.find('.btn-location'),
	$productInfo = $productWrap.find('.product-info'),
	$productMenu = $productWrap.find('.product-menu'),
	$prodTitle   = $productInfo.find('.product-title'),
	$prodDesc    = $productInfo.find('.product-desc'),
	$awardList   = $productInfo.find('.award-list'),
	$prodImg     = $productInfo.find('.img-wrap img'),
	$dotnav      = $sidenav.find('.dotnav .list'),
	_sidenav     = $sidenav.height(),
	_wSignsHei   = $('.warning-signs').outerHeight(),
	_loadAPI     = false;
	_timer       = null,
	_scrollEvent = false;

$(function(){
	setProd(0);
	setViewHeight();
	$sidenav.css({'margin-top' : - (_sidenav / 2)});
	$btnLocation.each(function(){
		var _per = $(this).data('per'),
			_idx = $(this).parent().index(),
			_now = 0;

		writePer(_per, _idx, _now);
	});

	// 開關menu
	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
	});

	// 進入產品介紹頁
	$btnSublink.on('click', function(){
		if ($(this).data('wrap') === 'product') {
			$lContent.attr('class', 'l-content ' + $(this).data('wrap'));
		}
	});

	// 開啟箱子的北中南照片
	$btnLocation.on('click', function(){
		$('body').addClass('add-blur');
		$caseWrap.removeClass('left center right').addClass($(this).data('part'));
	});

	// 開啟箱子的北中南照片時，只要點擊背景就能關閉箱子
	$('body').off('click').on('click', function(e){
		e.stopPropagation();

		if (!$(e.target).is('.inside-case, .inside-case *, .menu, .menu *, .btn-location') && $caseWrap.attr('class') !== 'case-wrap') {
			$('body').removeClass('add-blur');
			$caseWrap.removeClass('left center right');
		}
	});

	// 切換產品
	$productMenu.on('click', '.btn-product', function(){
		if (!$(this).hasClass('is-curr')) {
			var _idx = $(this).parent().index();

			$('.btn-product').removeClass('is-curr');
			$(this).addClass('is-curr');
			setProd(_idx);
		}
	});

	// 點擊紅點換cut
	$dotnav.on('click', function(){
		if (!$(this).hasClass('is-curr')) {
			var _videoHei = $videoList.height(),
				_idx      = $(this).index();

			$(this).addClass('is-curr').siblings().removeClass('is-curr');
			$lContent.animate({scrollTop: _idx * _videoHei}, 500);
		}
	});

	// 用滑鼠滾輪cut
	$lContent.on('mousewheel', function(e){
		if (_scrollEvent === false && $(this).hasClass('video')) {
			_scrollEvent = true;

			var _idx       = $('.dotnav .list.is-curr').index(),
				_videoHei  = $videoList.height(),
				_scrollTop = $(this).scrollTop();

			if (e.originalEvent.wheelDelta >= 0 && _idx > 0) {
				// 向上捲動，且不在第一幕
				$dotnav.removeClass('is-curr').eq(_idx - 1).addClass('is-curr');
				$lContent.animate({
					scrollTop: (_idx - 1) * _videoHei
				}, 500, function() {
					_scrollEvent = false;
				});
			} else if (e.originalEvent.wheelDelta < 0 && _idx < ($('.dotnav .list').length - 1)){
				// 向下捲動，且不在最後一幕
				$dotnav.removeClass('is-curr').eq(_idx + 1).addClass('is-curr');
				$lContent.animate({
					scrollTop: (_idx + 1) * _videoHei
				}, 500, function() {
					_scrollEvent = false;
				});
			} else if (e.originalEvent.wheelDelta < 0 && _idx === ($('.dotnav .list').length - 1)){
				// 向下捲動，且在最後一幕
				$(this).attr('class', 'l-content act');
			} else {
				_scrollEvent = false;
			}
		}
	});

	// 螢幕縮放保持滿版
	$(window).on('resize', function(){
		if (_timer) {
			clearTimeout(_timer);
		}
		
		_timer = setTimeout(function(){
			setViewHeight();
		}, 100);
	});

	// 保持滿版
	function setViewHeight() {
		var _windowHei = $(window).height(),
			_idx       = $('.dotnav .list.is-curr').index();

		$videoList.each(function(){
			$(this).css({'height' : _windowHei - _wSignsHei});
		});
		$lContent.animate({scrollTop: _idx * (_windowHei - _wSignsHei)}, 0);
	}

	// 組合產品的view
	function setProd(num) {
		var _str   = '',
			_liStr = '';

		$.getJSON('../Scripts/api/products.json' , function(data){
			for (var i = 0; i < data[num].award.length; i++) {
				_str += '<li class="list">' + data[num].award[i] + '</li>';
			}

			if (_loadAPI === false) {
				for (var j = 0; j < data.length; j++) {
					_liStr += '<li class="list"><button class="btn-product">' + data[j].year + ' YEAR OLD</button></li>';
				}
			}

			$prodTitle.find('.icon-year').text(data[num].year);
			$prodTitle.find('.year').text(data[num].year);
			$prodDesc.html(data[num].desc);
			$awardList.html(_str);
			$prodImg.attr({
				'src'   : '../Content/img/' + data[num].photo,
				'alt'   : '格蘭菲迪' + data[num].year + '年單一麥芽威士忌',
				'title' : '格蘭菲迪' + data[num].year + '年單一麥芽威士忌'
			});
		}).done(function() {
			if (_loadAPI === false) {
				$productMenu.html(_liStr);
				$('.btn-product').eq(0).addClass('is-curr');
				_loadAPI = true;
			}
		});
	}

	// 跑北中南的百分比
	function writePer(_per, _idx, _now) {
		_now += 1;

		if (_now <= _per) {
			setTimeout(function(){
				$('.location').eq(_idx).find('.btn-location').text(_now + '%');
				writePer(_per, _idx, _now)
			}, 50);
		}
	}
});