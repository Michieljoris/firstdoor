/*global */
var css = [
    //google font for mobile ?
    // 'http://fonts.googleapis.com/css?family=Droid+Serif:400,400italic,700'
    
    //css framework
    "bootstrap"
    
    //The iconic font designed for use with Twitter Bootstrap
    ,"font-awesome"

    //some reset rules
    ,'reset'
    
    //
    
    //Message bar on top of page
    ,'message-top'
    ,'social'
    ,'contact'
    
    
    ,'main'
    //FancyBox is a tool for displaying images, html content and
    // multi-media in a Mac-style "lightbox" that floats overtop
    // of web page, the css part
    // ,"fancybox"
    // ,'misc'
    
    //footer
    // ,'photo-stream'
    // ,'footer-twitter-widget'
    
    // ,'entry-title'
    // ,'footer'
    //Css for flex-slider
    // ,'flex-slider'
    // ,'style-responsive' 
    // This file overrides the default bootstrap. The reason
    // is to achieve a small width
    // ,'override'
    
    // ,{name: 'ribbons', id: 'ribbons'}
    
    // Theme created for use with Sequence.js
    // Theme: Modern Slide In
    // ,'sequence'
    //extra responsive rules
    
    //colors, with extra attrs so styles switcher can find it
    // ,{ name: 'colors/default', media: 'all', id: 'colors'}
    // ,{ name: 'colors/default', media: 'all', id: 'colors'}
];

var js = [
    //Reload when any files change, not using it now, using
    // Firefox autoreload
    // 'livepage',
    
    //Version 1.7.2
    'jquery'
    // 'jquery-1.9.1.min.js'
    // 'jquery-1.6.2.js'
    // ,'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min'
    ,'angular.min'
    
    // Modernizr is a small JavaScript library that detects the
    // availability of native implementations for next-generation
    // web technologies, i.e. features that stem from the HTML5
    // and CSS3 specifications. Many of these features are already
    // implemented in at least one major browser (most of them in
    // two or more), and what Modernizr does is, very simply, tell
    // you whether the current browser has this feature natively
    // implemented or not.
    // 'modernizr',
    
    // 'twitter',//??
    
    //FancyBox is a tool for displaying images, html content and
    // multi-media in a Mac-style "lightbox" that floats overtop
    // of web page.
    // 'fancybox',
    
    // An exquisite jQuery plugin for magical layouts
    // Features:
    // Layout modes: Intelligent, dynamic layouts that can’t be achieved with CSS alone.
    // Filtering: Hide and reveal item elements easily with jQuery selectors.
    // Sorting: Re-order item elements with sorting. Sorting data
    // can be extracted from just about anything.
    // Interoperability: features can be utilized together for a
    // coheive experience.
    // Progressive enhancement: Isotope’s animation engine takes
    // advantage of the best browser features when available — CSS
    // transitions and transforms, GPU acceleration — but will
    // also fall back to JavaScript animation for lesser browsers.
    // 'isotope',
    
    //css framework
    ,'bootstrap'
    
    // menu
    // ,'hoverIntent'
    // ,'superfish'
    ,'epiceditor.min.js'
    ,'myjs'
    ,'router'
    
    // A lightweight, easy-to-use jQuery plugin for fluid width video embeds.       
    // ,'jquery.fitvids'
    
    //Tweaks: Menu slide, responsive menu, image overlay, fancybox and icon spin
    // ,'custom'
    
    //Tweaks: Menu slide, responsive menu
    // ,'menu-slide'
    
    //* Converts your <ul>/<ol> navigation into a dropdown list for small screens
    // ,'selectnav'
    
    
    // ,'twitter'
    // Parallax Content Slider with CSS3 and jQuery A content
    // slider with delayed animations and background parallax effect
    // ,'jquery.cslider.js'
];

var mainMenuTree = [
    { label: 'Home', icon: '', href: 'index.html#!home', id: 'icurrent'
      
    } 
    ,{ label: 'About us', icon: '', href: 'index.html#!aboutus',
       sub: [
           { label: 'Our Company Vision', href: 'index.html#!aboutus#leaders'}
           ,{ label: 'Mission Statement', href: 'index.html#!aboutus#mission'}
           ,{ label: 'First Door Company Values', href: 'index.html#!aboutus#values'}
           ,{ label: 'Our Name And Logo', href: 'index.html#!aboutus#namelogo'}
           // ,{ label: 'Our people', href: 'index.html#!aboutus#people'}
           
       ]
     } 
    ,{ label: 'Accredited training', icon: '', href: 'index.html#!courses'
       ,sub: [
           { label: 'CHC50908 Diploma of Children’s Services (Early Childhood Education and Care)', href: 'index.html#!courses#disabilitycare'}
           ,{ label: 'Diploma of Management ', href: 'index.html#!courses#childrenservices'}
           ,{ label: 'Certificate lV in Training and Assessment', href: 'index.html#!courses#managementtraining'}
           // ,{ label: 'Aged care', href: 'index.html#!courses#agedcare'}
       ]
     } 
    ,{ label: 'Professional developement', icon: '', href: 'index.html#!pd'
       ,sub: [
           { label: 'The Inspired Educator, <span>working with a child focused approach</span>', href: 'index.html#!pd#course1'}
           ,{ label: 'Observation, documentation, planning and evaluating', href: 'index.html#!pd#course2'}
           ,{ label: 'Environment and experiences', href: 'index.html#!pd#course3'}
           ,{ label: 'Developing Cooperative Behaviour', href: 'index.html#!pd#course4'}
           ,{ label: 'Evaluation and reflective practice for improved program and practice', href: 'index.html#!pd#course4'}
           ,{ label: 'Children at Risk: identify and respond', href: 'index.html#!pd#course4'}
           ,{ label: 'Identify and Manage Risk to protect against harm', href: 'index.html#!pd#course4'}
       ]
     } 
    ,{ label: 'Resources', icon: '', href: '#'
       ,sub: [
           { label: 'Quiz', href: 'index.html#!quiz'}
           ,{ label: 'Creating a learning organisation', href: 'index.html#!resources'
            }
           ,{ label: 'Early Childhood Education and Care', href: 'index.html#!resources'
              ,sub: [
                  { label: 'Educational leaders', href: 'index.html#!resources'}
              ]
            }
           ,{ label: 'Inspiration and motivation', href: 'index.html#!resources'}
           ,{ label: 'Learning', href: 'index.html#!resources'}
           ,{ label: 'Management', href: 'index.html#!resources'}
       ]
       
     } 
    ,{ label: 'Blog', icon: '', href: '#'
       ,sub: [ 
           { label: 'Markdown editor', href: 'index.html#!epic'}
           // ,{ label: 'Submenu item 2', href: 'index.html'}
           // ,{ label: 'Submenu item 2', href: 'index.html'}
       ]
       
     } 
];
/*
The wording for the four rolling images on the home page are:
1. Early Childhood Education and Care training
 
2. First Door mentoring inspires focused students
 
3. Innovative resources to bridge the gap between theory and practice
4. Interactive professional development connecting educators to the National Quality Framework
*/

var slides =  [
    { url: "images/frontpage_slideshow/earlychild.jpg",
      title: 'Early Childhood Education and Care training'
      // ,subtitle: 'Aged care slogan'
    },
    { url: "images/frontpage_slideshow/Innovative_resources.jpg",
      title: 'Innovative resources to bridge the gap between theory and practice'
      // ,subtitle: 'Slogan'
    },
    { url: "images/frontpage_slideshow/mentoring.jpg",
      title: 'First Door mentoring inspires focused students'
      // ,subtitle: 'Slogan'
    }
    ,{ url: "images/frontpage_slideshow/interactivePD.jpg",
      title: 'Interactive professional development connecting educators to the National Quality Framework'
      // ,subtitle: 'Slogan'
    }
     
 
    // ,{ url: "images/fp/PDcoop.jpg",
    //   title: 'Disability',
    //   subtitle: 'Slogan'}
    // ,{ url: "images/fp/PDobserving.jpg",
    //   title: 'Disability',
    //   subtitle: 'Slogan'}
    // ,{ url: "images/fp/PDenv.jpg",
    //   title: 'Disability',
    //   subtitle: 'Slogan'}
    // ,{ url: "images/fp/PDinspired.jpg",
    //   title: 'Disability',
    //   subtitle: 'Slogan'}
    
];

var exports = {
    verbose: true
    ,monitor: true
    ,prettyPrintHtml: false
    // ,tagIdPostfix: '__' //can be overridden per template
    ,paths: {
        root: '/home/michieljoris/www/firstdoor/'
        //relative to this root:
        ,partials: 'build/'  //can be overridden per template
        ,out:'built' 
        // ,monitor: 'build'
    }
    
    //Every partial generates a string. How the partial is generated
    //depends on its type. Each type can define more than one partial
    //of that type by assigning an array of definitions instead of
    //just one (object) definition to that type. These partials are
    //identified by their id. This enables them to uses as the source in
    //later defined templates. They don't need an id if you just want
    //to generate a string to save to the file defined in 'out'.
    ,partials: {
        ids: {
            title: '<title>Test New Html-builder</title>'
        }
        ,metaBlock : {
            id: 'meta',
            tags: [ { charset:'utf-8' },
                    { name: "viewport"
                      ,content: "width=device-width, initial-scale=1, maximum-scale=1"
                    } ]
        }
        ,linkBlock:  {
            id: 'myLinkBlock',
            files: css,
            path: 'css/'
        }
        ,scriptBlock: {
            id: 'myJsBlock',
            files: js,
            path: 'js/'
        }
        ,slideShow: [{ type: 'flex',
                       id: 'flex',
                       slides: slides
                     }
                     ,{ type: 'camera',
                       id: 'camera',
                       slides: slides
                     }
                    ]
        ,menu: [{ type: 'superfish',
                  tree: mainMenuTree,
                  id: 'superfish'
                },
                { type: 'css',
                  tree: mainMenuTree,
                  id: 'cssmenu'
                }
               ]
        ,template: [
            { id: 'showhide_pd_inspired_info',
               src: 'html/showhide_pd_inspired_info'
               // ,out : 'test.html'
               ,mapping: {
                   "pd_inspired_info_md": "markdown/pd_inspired_info.md"
               }} 
            ,{ id: 'showhide_pd_coop_info',
               src: 'html/showhide_pd_coop_info'
               // ,out : 'test.html'
               ,mapping: {
                   "pd_coop_info_md": "markdown/pd_coop_info.md"
               }}, 
            { id: 'showhide_pd_environment_info',
               src: 'html/showhide_pd_environment_info'
               // ,out : 'test.html'
               ,mapping: {
                   "pd_environment_info_md": "markdown/pd_environment_info.md"
               }}, 
            { id: 'showhide_pd_observing_info',
               src: 'html/showhide_pd_observing_info'
               // ,out : 'test.html'
               ,mapping: {
                   "pd_observing_info_md": "markdown/pd_observing_info.md"
               }}
            ,{ id:"pd_wrapper",
               src: 'markdown/pd.md'
               // ,out : 'test.html'
               ,mapping: {
                   showhide_pd_inspired_info: "showhide_pd_inspired_info"
                   ,showhide_pd_observing_info: "showhide_pd_observing_info"
                   ,showhide_pd_environment_info: "showhide_pd_environment_info"
                   ,showhide_pd_coop_info: "showhide_pd_coop_info"
               }}
            ,{ 
               src: 'views/view_pd_partial.html'
               ,out : 'view-pd.html'
               ,mapping: {
                   sidebar: 'html/sidebar'
                   ,slogan: 'html/slogan'
                   ,contents: 'pd_wrapper'
               }}
            ,{ 
               src: 'views/view_home_partial.html'
               ,out : 'view-home.html'
               ,mapping: {
                   sidebar: 'html/sidebar'
                   ,slogan: 'html/slogan'
                   ,slideShow: 'flex',
                   homeContents: 'markdown/welcome.md'
               }}
            ,{ 
               src: 'views/view_courses_partial.html'
               ,out : 'view-courses.html'
               ,mapping: {
                   sidebar: 'html/sidebar'
                   // ,slogan: 'slogan'
                   // ,slideShow: 'flex',
                   ,contents: 'markdown/courses.md'
               }}
            ,{
               src: 'views/view_epic_partial.html'
               ,out : 'view-epic.html'
               ,mapping: {
                   // sidebar: 'html/sidebar'
                   // ,slogan: 'html/slogan'
                   // ,slideShow: 'flex',
                   // homeContents: 'markdown/welcome.md'
               }}
            
            ,{ id: 'page' 
              ,src: 'html/basicAngularPage.html'
               //Maps tag ids to partial ids. Tag ids have to be
               //postfixed with two dashes in the template. Partials
               //with an extension will be loaded from the partials
               //folder for this template. Markdown files will be
               //converted to html. Partials in an array will be
               //concatenated before inserted at the tag id element
              ,mapping: {
                  head: ['title', 'meta', 'myLinkBlock','_linkBlock'],
                  body: ['html/body.html', 'myJsBlock', '_scriptBlock']
              }
            }
            ,{ src: 'page' 
               ,tagIdPostfix: '--' //can be overridden per template
               ,pathOut: ''
               ,out: 'index.html' //optional, relative to root
               ,mapping: {
                   message: 'html/message'
                   ,logo: 'html/logo'
                   ,social: 'html/social'
                   ,contact: 'html/contact'
                   ,studentLogin: 'html/wisenet-login'
                   ,search: 'html/search'
                   ,menu: 'cssmenu'
                   // ,viewHome: 'view-home'
                   ,footerLeft: 'html/footerLeft'
                   ,footerMiddle: 'html/footerMiddle'
                   ,footerRight: 'html/footerRight'
                   ,'footerBottom': 'html/footerBottom'
               }
             }
            
        ] 
        
    }
};



