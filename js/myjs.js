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
    $(".scroll").click(function(event){
        
        console.log('click on scroll');
        //prevent the default action for the click event
        event.preventDefault();
        
        //get the full url - like mysitecom/index.htm#home
        var full_url = this.href;
        
        //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
        var parts = full_url.split("#");
        // console.log(parts);
        var trgt = parts[parts.length-1];
        
        if (trgt[0] === '!') return;
        //get the top offset of the target anchor
        var target_offset = $("#"+trgt).offset();
        if (target_offset) {
            var target_top = target_offset.top;
            
            //goto that anchor by setting the body scroll top to anchor top
            $('html, body').animate({scrollTop:target_top }, 1000, 'easeOutQuad');
        }
    });
    
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

$(window).scroll(function() {
    if ($(this).scrollTop() > 220) {
        // $('.fixedbar').addClass('fix');
        $('.fixedbar').fadeIn();
    } else {
        $('.fixedbar').fadeOut();
	// $('.fixedbar').removeClass('fix');
    }
});


