var $menu    = $('.menu'),
	$sidenav = $('.sidenav'),
	$btnMenu = $menu.find('.btn-menu'),
	$dotnav  = $sidenav.find('.dotnav .list'),
	_sidenav = $sidenav.height();

$(function(){
	$sidenav.css({'margin-top' : - (_sidenav / 2)});

	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
	});

	$dotnav.on('click', function(){
		$(this).addClass('is-curr').siblings().removeClass('is-curr');
	});
});