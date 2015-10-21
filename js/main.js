var $menu    = $('.menu'),
	$btnMenu = $('.btn-menu');

$(function(){
	$btnMenu.on('click', function(){
		$menu.toggleClass('open');
	});
});