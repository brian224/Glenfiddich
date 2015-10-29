var $menu        = $('.menu'),
	$sidenav     = $('.sidenav'),
	$btnProduct  = $('.btn-product'),
	$productInfo = $('.product-info'),
	$btnMenu     = $menu.find('.btn-menu'),
	$prodTitle   = $productInfo.find('.product-title'),
	$prodDesc    = $productInfo.find('.product-desc'),
	$awardList   = $productInfo.find('.award-list'),
	$prodImg     = $productInfo.find('.img-wrap img'),
	$dotnav      = $sidenav.find('.dotnav .list'),
	_sidenav     = $sidenav.height();
var productInfo  = [
		{
			'year'  : 12,
			'desc'  : '全球單一麥芽威士忌的開創者。<br>在美國橡木桶與西班牙橡木桶內緩緩熟成，<br>醞釀出洋梨與橡木融合的細緻口感，<br>代表了格蘭菲迪 Glenfiddich<br>滑順醇厚的經典風味。',
			'award' : [
						'2014 蘇格蘭威士忌大師獎（SWMA）大師獎',
						'2014 國際葡萄酒烈酒競賽（IWSC）金獎',
						'2014 國際烈酒競賽（ISC）金獎',
						'2015 國際葡萄酒烈酒競賽（IWSC）金獎',
						'2015 國際烈酒競賽（ISC）金獎'
						],
			'photo' : 'wine/wine12.png'
		},{
			'year'  : 15,
			'desc'  : '運用創新的蘇羅拉調和系統，<br>於西班牙雪莉橡木桶、美國波本橡木桶，<br>以及全新美國橡木桶中交織熟成，<br>完美詮釋蜂蜜與葡萄乾交織的甜美豐富口感。',
			'award' : [
						'2014 蘇格蘭威士忌大師獎（SWMA）金獎',
						'2014 國際葡萄酒烈酒競賽（IWSC）卓越銀獎',
						'2014 國際烈酒競賽（ISC）銀獎',
						'2015 國際葡萄酒烈酒競賽（IWSC）卓越銀獎',
						'2015 國際烈酒競賽（ISC）金獎'
						],
			'photo' : 'wine/wine15.png'
		},{
			'year'  : 18,
			'desc'  : '小批次的生產過程皆由首席調酒師親自<br>從為數不到150桶的珍稀酒桶中選出，<br>再進行最後的融合與熟成，演繹烤蘋果與肉桂<br>融合而成的濃郁風味，值得饕客品味珍藏。',
			'award' : [
						'2014 國際葡萄酒烈酒競賽（IWSC）卓越金獎',
						'2014 國際烈酒競賽（ISC）金獎',
						'2015 國際葡萄酒烈酒競賽（IWSC）金獎',
						'2015 國際烈酒競賽（ISC）金獎'
						],
			'photo' : 'wine/wine18.png'
		},{
			'year'  : 21,
			'desc'  : '將21年的格蘭菲迪注入原貯存蘭姆酒的橡木桶，<br>經過四個月時間的過捅熟成，香味強烈、熱情<br>而甜美。和雪茄是絕配。',
			'award' : [
						'2014 國際烈酒競賽（ISC）金獎',
						'2015 國際烈酒競賽（ISC）金獎',
						'2015 國際葡萄酒烈酒競賽（IWSC）卓越金獎'
						],
			'photo' : 'wine/wine21.png'
		}
	];

$(function(){
	setProd(0);
	$sidenav.css({'margin-top' : - (_sidenav / 2)});

	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
	});

	$dotnav.on('click', function(){
		$(this).addClass('is-curr').siblings().removeClass('is-curr');
	});

	$btnProduct.on('click', function(){
		var _idx = $(this).parent().index();

		$btnProduct.removeClass('is-curr');
		$(this).addClass('is-curr');
		setProd(_idx);
	});

	function setProd(num) {
		var _str = '';

		for (var i = 0; i < productInfo[num].award.length; i++) {
			_str += '<li class="list">' + productInfo[num].award[i] + '</li>';
		}

		$prodTitle.find('.icon-year').text(productInfo[num].year);
		$prodTitle.find('.year').text(productInfo[num].year);
		$prodDesc.html(productInfo[num].desc);
		$awardList.html(_str);
		$prodImg.attr({
			'src'   : 'img/' + productInfo[num].photo,
			'alt'   : '格蘭菲迪' + productInfo[num].year + '年單一麥芽威士忌',
			'title' : '格蘭菲迪' + productInfo[num].year + '年單一麥芽威士忌'
		});
	}
});