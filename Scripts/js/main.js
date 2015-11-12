var $menu        = $('.menu'),
	$sidenav     = $('.sidenav'),
	$lBoxWrap    = $('.lightbox-wrap'),
	$hintScroll  = $('.hint-scroll'),
	$lContent    = $('.l-content'),
	$btnClose    = $lBoxWrap.find('.btn-close'),
	$tvc         = $lBoxWrap.find('#tvc'),
	$videoWrap   = $lContent.find('.video-wrap'),
	$caseWrap    = $lContent.find('.case-wrap'),
	$productWrap = $lContent.find('.product-wrap'),
	$btnMenu     = $menu.find('.btn-menu'),
	$videoList   = $videoWrap.find('.list'),
	$btnLocation = $caseWrap.find('.btn-location'),
	$productList = $productWrap.find('.product-list'),
	$productMenu = $productWrap.find('.product-menu'),
	$dotnav      = $sidenav.find('.dotnav'),
	$btnVideo    = $sidenav.find('.btn-video'),
	_videoLength = $videoList.length,
	_wSignsHei   = $('.warning-signs').outerHeight(),
	_timer       = null,
	_perEvent    = false, // 是否跑過百分比的數字
	_scrollEvent = false, // 是否停止滑鼠滾輪事件
	_lock        = false,
	_nowCut      = 1;

$(function(){
	// setProd();
	setViewHeight();
	setDotNav();
	runAnimation('cut01');

	// 開關menu
	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
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

	// 開啟lightbox (打開箱子時無效)
	$btnVideo.on('click', function(){
		if (!$('body').hasClass('add-blur')) {
			$lBoxWrap.addClass('show');
		}
	});

	// 關閉lightbox 並暫停影片
	$btnClose.on('click', function(){
		$lBoxWrap.removeClass('show');
		$tvc.removeClass('playing');
		$tvc[0].pause();
	});

	// 點擊預覽圖 播放/暫停 影片
	$tvc.on('click', function(){
		if (!$(this).hasClass('playing')) {
			$(this).addClass('playing');
			$tvc[0].play();
		} else {
			$(this).removeClass('playing');
			$tvc[0].pause();
		}
	});

	// 切換產品
	$productMenu.on('click', '.btn-product', function(){
		if (!$(this).hasClass('is-curr')) {
			var _idx = $(this).parent().index();

			$('.btn-product').removeClass('is-curr');
			$(this).addClass('is-curr');
			$productList.find('.product-info').removeClass('is-curr').eq(_idx).addClass('is-curr');
		}
	});

	// 點擊紅點換cut
	$dotnav.on('click', '.list', function(){
		if (!$(this).hasClass('is-curr') && !$('body').hasClass('add-blur')) {
			var _videoHei = $videoList.height(),
				_idx      = $(this).index();

			_nowCut = 1;
			_lock = false;
			$(this).addClass('is-curr').siblings().removeClass('is-curr');
			$lContent.animate({scrollTop: _idx * _videoHei}, 500);

			if (_idx === $dotnav.find('.list').length - 1) {
				$hintScroll.addClass('hide');
			} else {
				$hintScroll.removeClass('hide');
			}
		}
	});

	// 用滑鼠滾輪cut
	$lContent.on('mousewheel', function(e){
		if (_scrollEvent === false) {
			_nowCut = 1;
			_scrollEvent = true;

			var _idx       = $('.dotnav .list.is-curr').index(),
				_videoHei  = $videoList.height(),
				_scrollTop = $(this).scrollTop();

			if (e.originalEvent.wheelDelta >= 10 && _idx > 0) {
				// 向上捲動，且不在第一幕
				$dotnav.find('.list').removeClass('is-curr').eq(_idx - 1).addClass('is-curr');
				$lContent.animate({
					scrollTop: (_idx - 1) * _videoHei
				}, 500, function() {
					// 如果是離開最後一cut 則顯示scroll提示
					if ($hintScroll.hasClass('hide')) {
						$hintScroll.removeClass('hide');
					}
					_lock = false;
					_scrollEvent = false;
				});
			} else if (e.originalEvent.wheelDelta < -10 && _idx < ($('.dotnav .list').length - 1)){
				// 向下捲動，且不在最後一幕
				if (_lock === true) {
					_lock = false;

					var _newIdx = $('.dotnav .list.is-curr').index(),
						_newCut = $videoList.eq(_newIdx).attr('class').split('list ')[1];

					runAnimation(_newCut);
				} else {
					$dotnav.find('.list').removeClass('is-curr').eq(_idx + 1).addClass('is-curr');
					$lContent.animate({
						scrollTop: (_idx + 1) * _videoHei
					}, 500, function() {
						// 如果是最後一cut 隱藏scroll提示
						if ($('.dotnav .list.is-curr').index() + 1 === $('.dotnav .list').length) {
							$hintScroll.addClass('hide');
						}
						_lock = false;
						_scrollEvent = false;
					});
				}
			} else {
				// 向下捲動，且在最後一幕
				_scrollEvent = false;
			}
		}
	});

	$lContent.on('scroll', function(){
		// 檢查到哪一cut影片以供執行動畫
		$videoList.each(function(){
			if ($(this).offset().top === 0 && _lock === false) {
				_nowCut = 1;
				runAnimation($(this).attr('class').split('list ')[1]);
			}
		});

		// 如果進箱子那一cut
		if ($caseWrap.offset().top === 0 && _perEvent === false) {
			// 計算北中南的百分比與背景圖
			$btnLocation.each(function(){
				var _per = $(this).data('per'),
					_idx = $(this).parent().index(),
					_now = 0;

				$(this).addClass('per-' + Math.round(_per / 10));
				writePer(_per, _idx, _now);
			});

			_perEvent = true;
		}
	});

	// 打開箱子時 關閉logo & 側邊選單功能
	$('.logo .link, .sidenav, .sidenav *').on('click', function(){
		if ($('body').hasClass('add-blur')) {
			return false;
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

	// 寫入點的數量
	function setDotNav() {
		var _dotView = '<li class="list is-curr"></li>';

		for (var i = 1; i < _videoLength + 2; i++) {
			if (i === _videoLength) {
				// 拍立得
				_dotView += '<li class="list act"></li>';
			} else if (i === _videoLength + 1) {
				// 箱子
				_dotView += '<li class="list case"></li>';
			} else {
				_dotView += '<li class="list"></li>';
			}
		}
		$dotnav.html(_dotView);
		setNavMiddle();
	}

	// 左側選單居中
	function setNavMiddle() {
		var _sidenav = $sidenav.height();

		$sidenav.css({'margin-top' : - (_sidenav / 2)});
	}

	// 跑影片動畫
	function runAnimation(cut) {
		var $nowCut = $videoWrap.find('.' + cut),
			$img    = $nowCut.find('img'),
			_amount = $nowCut.data('amount');

		// 判斷是否跑完了
		if (_nowCut < _amount && _lock === false) {
			setTimeout(function(){
				if (_nowCut < 10) {
					$img.attr('src', '../content/img/video/' + cut + '/gf_00' + _nowCut + '.jpg');
				} else {
					$img.attr('src', '../content/img/video/' + cut + '/gf_0' + _nowCut + '.jpg');
				}
				_nowCut += 1;
				runAnimation(cut);
			}, 100);
		} else {
			// 跑完了 進下一cut
			var _idx       = $('.dotnav .list.is-curr').index(),
				_dotLen    = $('.dotnav .list').length,
				_videoHei  = $videoList.height(),
				_scrollTop = $(this).scrollTop();

			_lock = true;
			$dotnav.find('.list').removeClass('is-curr').eq(_idx + 1).addClass('is-curr');
			$lContent.animate({
				scrollTop: (_idx + 1) * _videoHei
			}, 0, function() {
				// 如果是進拍立得那一cut 加跑拍立得動畫
				if (_idx + 1 === _dotLen - 2) {
					$('.act-wrap').addClass('goScale');
					_lock = false;
				}
				// 還原前一cut的圖片 回到gf_001.jpg
				$img.attr('src', '../content/img/video/' + cut + '/gf_001.jpg');
				_scrollEvent = false;
			});
		}
	}

	// 組合產品的view
	// function setProd(num) {
	// 	var _liStr = '',
	// 		_view  = [];

	// 	$.getJSON('../Scripts/api/products.json' , function(data){
	// 		$.each(data, function(index, value){
	// 			var _str = prodView(value);

	// 			_liStr += '<li class="list"><button class="btn-product">' + data[index].year + ' YEAR OLD</button></li>';
	// 			_view.push(_str);
	// 		});
	// 	}).done(function() {
	// 		$productList.html(_view);
	// 		$productMenu.html(_liStr);
	// 		$productList.find('.product-info').eq(0).addClass('is-curr');
	// 		$('.btn-product').eq(0).addClass('is-curr');
	// 	});
	// }

	// 單一個產品view
	// function prodView(value) {
	// 	return [
	// 		'<li class="product-info">',
	// 			'<h2 class="product-title"><i class="icon-year">' , value.year , '</i>格蘭菲迪<br><i class="year">' , value.year , '</i>年單一麥芽威士忌</h2>',
	// 			'<span class="product-content">容量 700 ml　ABV 40%</span>',
	// 			'<p class="product-desc">' , value.desc , '</p>',
	// 			'<ul class="award-list">' , awardView(value) , '</ul>',
	// 			'<span class="img-wrap"><img src="../Content/img/' , value.photo , '" alt="格蘭菲迪' , value.year , '年單一麥芽威士忌" title="格蘭菲迪' , value.year , '年單一麥芽威士忌"></span>',
	// 		'</li>'
	// 	].join('');
	// }

	// 每個產品獲得的獎項
	// function awardView(value) {
	// 	var _str = '';

	// 	for (var i = 0; i < value.award.length; i++) {
	// 		_str += '<li class="list">' + value.award[i] + '</li>';
	// 	}
	// 	return _str;
	// }

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