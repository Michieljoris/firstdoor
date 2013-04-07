/*----------------------------------------------------*/
/*	Slide down and responsive menu
/*----------------------------------------------------*/

jQuery(document).ready(function() {
    
    /* Menu */
    (function() {

        var $mainNav    = $('#navigation').children('ul');

        $mainNav.on('mouseenter', 'li', function() {
            var $this    = $(this),
            $subMenu = $this.children('ul');
            if( $subMenu.length ) $this.addClass('hover');
            $subMenu.hide().stop(true, true).slideDown('fast');
        }).on('mouseleave', 'li', function() {
            $(this).removeClass('hover').children('ul').stop(true, true).slideUp('fast');
        });
		
    })();
	
    /* Responsive Menu */
    (function() {
        selectnav('nav', {
            label: 'Menu',
            nested: true,
            indent: '-'
        });
				
    })();
    
    
});
