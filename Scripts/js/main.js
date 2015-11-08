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
	_scrollEvent = false,
	_now         = 0;

$(function(){
	setProd(0);
	setViewHeight();
	$sidenav.css({'margin-top' : - (_sidenav / 2)});
	$btnLocation.each(function(){
		var _num = parseInt($(this).data('per'), 10),
			_idx = $(this).parent().index();

		writePer(_idx, _num);
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

	$dotnav.on('click', function(){
		if (!$(this).hasClass('is-curr')) {
			var _videoHei = $videoList.height(),
				_idx      = $(this).index();

			$(this).addClass('is-curr').siblings().removeClass('is-curr');
			$lContent.animate({scrollTop: _idx * _videoHei}, 500);
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

	$lContent.on('scroll', function(e){
		// if (_scrollEvent === false) {
		// 	_scrollEvent = true;

		// 	var _idx       = $('.dotnav .list.is-curr').index(),
		// 		_videoHei  = $videoList.height(),
		// 		_scrollTop = $(this).scrollTop();

		// 	$(this).css({'overflow' : 'hidden'});
		// 	$dotnav.removeClass('is-curr').eq(_idx + 1).addClass('is-curr');
		// 	$lContent.animate({
		// 		scrollTop: (Math.ceil(_scrollTop / _videoHei) + _idx) * _videoHei
		// 	}, 500, function() {
		// 		_scrollEvent = false;
		// 		$(this).css({'overflow' : 'auto'});
		// 	});
		// }
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

	function setViewHeight() {
		var _windowHei = $(window).height(),
			_idx       = $('.dotnav .list.is-curr').index();

		$videoList.each(function(){
			$(this).css({'height' : _windowHei - _wSignsHei});
		});
		$lContent.animate({scrollTop: _idx * (_windowHei - _wSignsHei)}, 0);
	}

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

	function writePer(_idx, _num) {
		$('li.location').eq(_idx).find('.btn-location').text(_num + '%');

		// if (_now < _num) {
		// 	_now += 1;
		// }

		// setTimeout('writePer(_idx, _num)', 1000);
	}
});