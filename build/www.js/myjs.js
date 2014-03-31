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


// var opts = {
//   lines: 13, // The number of lines to draw
//   length: 20, // The length of each line
//   width: 10, // The line thickness
//   radius: 30, // The radius of the inner circle
//   corners: 1, // Corner roundness (0..1)
//   rotate: 29, // The rotation offset
//   direction: 1, // 1: clockwise, -1: counterclockwise
//   color: '#000', // #rgb or #rrggbb or array of colors
//   speed: 1, // Rounds per second
//   trail: 50, // Afterglow percentage
//   shadow: false, // Whether to render a shadow
//   hwaccel: true, // Whether to use hardware acceleration
//   className: 'spinner', // The CSS class to assign to the spinner
//   zIndex: 2e9, // The z-index (defaults to 2000000000)
//   top: 'auto', // Top position relative to parent in px
//   left: 'auto' // Left position relative to parent in px
// };
// var target = document.getElementById('foo');
// var spinner = new Spinner(opts).spin(target);
