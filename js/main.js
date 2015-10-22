var $menu    = $('.menu'),
	$btnMenu = $('.btn-menu'),
	$dotnav  = $('.dotnav .list');

$(function(){
	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
	});

	$dotnav.on('click', function(){
		$(this).addClass('is-curr').siblings().removeClass('is-curr');
	});
});