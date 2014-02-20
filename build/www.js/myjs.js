/*global $:false jQuery:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

// initialise Superfish

jQuery(document).ready(function(){
    // jQuery('ul.sf-menu').superfish({
    //     delay:       0,                            // one second delay on mouseout
    //     animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation
    //     speed:       'fast',                          // faster animation speed
    //     speedOut:       'fast',                          // faster animation speed
    //     autoArrows:  false                            // disable generation of arrow mark-up
    // });
    jQuery('#bla').click(function(){
        console.log('clicked scroll to top');
        jQuery("html, body").animate({
            scrollTop: 0
        }, 700);
        return false;
    });

    // $(function(){
    //     console.log('contactable');
    //     $('#contactable').contactable({
    //         subject: 'A Feeback Message'
    //     });
    // });
    
});


/*----------------------------------------------------*/
/*	Back To Top Button
        /*----------------------------------------------------*/
jQuery(window).scroll(function(){
    if (jQuery(this).scrollTop() > 100) {
        jQuery('#scroll-to-top').fadeIn();
    } else {
        jQuery('#scroll-to-top').fadeOut();
    }
}); 

/* Responsive Menu */
(function() {
    selectnav('nav', {
        label: 'Menu',
        nested: true,
        indent: '-'
    });
    
})();

//fixedbar
$(window).scroll(function() {
    if ($(this).scrollTop() > 192) {
        // $('.fixedbar').addClass('fix');
        $('.fixedbar').fadeIn();
    } else {
        $('.fixedbar').fadeOut();
	// $('.fixedbar').removeClass('fix');
    }
});


