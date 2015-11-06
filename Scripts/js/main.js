var $menu        = $('.menu'),
	$sidenav     = $('.sidenav'),
	// $btnProduct  = $('.btn-product'),
	$productWrap = $('.product-wrap'),
	$btnMenu     = $menu.find('.btn-menu'),
	$productInfo = $productWrap.find('.product-info'),
	$productMenu = $productWrap.find('.product-menu'),
	$prodTitle   = $productInfo.find('.product-title'),
	$prodDesc    = $productInfo.find('.product-desc'),
	$awardList   = $productInfo.find('.award-list'),
	$prodImg     = $productInfo.find('.img-wrap img'),
	$dotnav      = $sidenav.find('.dotnav .list'),
	_sidenav     = $sidenav.height(),
	_loadAPI     = false;

$(function(){
	setProd(0);
	$sidenav.css({'margin-top' : - (_sidenav / 2)});

	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
	});

	$dotnav.on('click', function(){
		$(this).addClass('is-curr').siblings().removeClass('is-curr');
	});

	$productMenu.on('click', '.btn-product', function(){
		if (!$(this).hasClass('is-curr')) {
			var _idx = $(this).parent().index();

			$('.btn-product').removeClass('is-curr');
			$(this).addClass('is-curr');
			setProd(_idx);
		}
	});

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
});