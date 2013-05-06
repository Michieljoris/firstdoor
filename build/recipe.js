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
    
    // ,'angular-ui'
    
    //
    
    //Message bar on top of page
    ,'message-top'
    ,'social'
    ,'contact'
    // ,'feedback'
    // ,'contactable'
    // ,'youtubecarousel'
    
    ,'main'
    //FancyBox is a tool for displaying images, html content and
    // multi-media in a Mac-style "lightbox" that floats overtop
    // of web page, the css part
    // ,"fancybox"
    // ,'misc'
    ,'cslider'
    ,'chat'
    
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
    
    // ,'https://ajax.googleapis.com/ajax/libs/angularjs/1.0.5/angular.min'
    //Version 1.7.2
    // 'jquery'
    'jquery-1.9.1.min.js'
    ,'noconsole'
    // 'jquery-1.6.2.js'
    ,'angular-1.1.4/angular.min'
    // ,'angular-1.1.4/angular-sanitize.min'
    
    // Modernizr is a small JavaScript library that detects the
    // availability of native implementations for next-generation
    // web technologies, i.e. features that stem from the HTML5
    // and CSS3 specifications. Many of these features are already
    // implemented in at least one major browser (most of them in
    // two or more), and what Modernizr does is, very simply, tell
    // you whether the current browser has this feature natively
    // implemented or not.
    ,'modernizr'
    
    
    ,'selectnav'
    // ,'chat'
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
    
    // ,'angular-ui'
    ,'ui-bootstrap-tpls-0.2.0'
    // menu
    // ,'hoverIntent'
    // ,'superfish'
    ,'epiceditor.min.js'
    ,'myjs'
    ,'controllers'
    ,'filebrowserCntl'
    ,'resourcesCntl'
    ,'router'
    
    // ,'jquery.validate'
    // ,'jquery.contactable'
    // ,'feedback'
    
    ,'jquery.cslider'
    
    
    ,'jquery.tabSlideOut.v1.3.js'
    ,'feedback'
    // ,'jquery.youtubecarousel'
    
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


var routes = [
    ['home', '/built/view-home.html', 'HomeCntl'],
    // ['aboutus', '/build/markdown/aboutus.md'],
    ['aboutus', '/built/view-aboutus.html'],
    ['pd', '/built/view-pd.html'],
    // ['resources', '/build/markdown/resources.md'],
    ['resources', '/built/view-resources.html', 'ResourcesCntl'],
    ['courses', '/built/view-courses.html'],
    ['quiz', '/build/markdown/quiz.md'],
    ['blog', '/built/view-blog.html'],
    ['epic', '/built/view-epic.html', 'EpicCntl'],
    ['chat', '/built/view-chat.html', 'chatCntl'],
    ['filebrowser', '/built/view-filebrowser.html', 'filebrowserCntl'],
    ['contactus', '/built/view-contactus.html', 'contactusCntl']
    // ,['ytcarousel', '/build/html/ytcarousel.html']
];

var mainMenuTree = [
    { label: 'Home', icon: '', route: 'home'
       // sub: [
       //     { label: 'Contact us', route: 'contactus', scroll: true}
       //     ]
    }
    ,{ label: 'About us', icon: '', route: 'aboutus',
       sub: [
           { label: 'Our Company', route: 'aboutus#company', scroll: true
             ,sub: [
                 // { label: 'Markdown editor', route: 'epic'}
                 { label: 'Vision', icon: '', route: 'aboutus#vision'}
                 ,{ label: 'Mission', route: 'aboutus#mission'}
                 ,{ label: 'Our student approach', route: 'aboutus#approach'}
                 ,{ label: 'Values', route: 'aboutus#values'}
                 ]
             }
             ,{ label: 'Our name and logo', route: 'aboutus#namelogo', scroll: true}
             ,{ label: 'Our people', route: 'aboutus#people', scroll: true}
             ,{ label: 'First Door policies', route: 'aboutus#policies', scroll: true}
             // ,{ label: 'Our people', route: 'index.html#!/aboutus#people'}
           
           ]
     } 
    ,{ label: 'Professional development', icon: '', route: 'pd'
       ,sub: [
           { label: 'The Inspired Educator, <span>working with a child focused approach</span>', route: 'pd#course1', scroll: true}
           ,{ label: 'Observation, documentation, planning and evaluating', route: 'pd#course2', scroll: true}
           ,{ label: 'Environment and experiences', route: 'pd#course3', scroll: true}
           ,{ label: 'Developing Cooperative Behaviour', route: 'pd#course4', scroll: true}
           ,{ label: 'Evaluation and reflective practice for improved program and practice', route: 'pd#course5', scroll: true}
           ,{ label: 'Children at Risk: identify and respond', route: 'pd#course6', scroll: true}
           ,{ label: 'Identify and Manage Risk to protect against harm', route: 'pd#course7', scroll: true}
           ,{ label: 'Customised workshop: for your Centre\'s needs', route: 'pd#course8', scroll: true}
       ]
     } 
    ,{ label: 'Accredited training', icon: '', route: 'courses'
       ,sub: [
           { label: 'Diploma of Children’s Services (Early Childhood Education and Care)', route: 'courses#childrenservices',
             scroll: true}
           ,{ label: 'Diploma of Management ', route: 'courses#diploma_management', scroll: true}
           ,{ label: 'Certificate lV in Training and Assessment', route: 'courses#certivtraining', scroll: true}
           // ,{ label: 'Aged care', route: 'courses#agedcare'}
       ]
     } 
    ,{ label: 'Resources', icon: '', route: 'resources'
       ,sub: [
           { label: 'General', route: 'resources#general', scroll: true
           }
           ,{ label: 'Motivation', route: 'resources#motivation', scroll: true
            }
           ,{ label: 'Early Childhood Education and Care (ECEC', route: 'resources#earlychildhood', scroll: true
              // ,sub: [
              //     { label: 'Educational leaders', route: 'resources'}
              // ]
            }
           ,{ label: 'Learning organisations', route: 'resources#learningorganisations', scroll:true}
           ,{ label: 'Learning', route: 'resources#learning', scroll:true}
           // ,{ label: 'Leadership and Management', route: 'resources#leadership', scroll:true}
           ,{ label: 'Quiz', route: 'quiz'}
           ,{ label: '(tryouts)' ,route: 'resources'
              ,sub: [
                  // { label: 'Markdown editor', route: 'epic'}
                  { label: 'Blog', icon: '', route: 'blog'}
                  ,{ label: 'Chat', route: 'chat'}
                  ,{ label: 'Editor', route: 'filebrowser'}
                  // ,{ label: 'Youtube carousel', route: 'ytcarousel'}
                  // ,{ label: 'Submenu item 2', route: 'index.html'}
                  // ,{ label: 'Submenu item 2', route: 'index.html'}
              ]
            } 
       ]
       
     } 
    ,{ label: 'Contact us', route: 'contactus', scroll: true
       // ,sub: [
       //     { label: '(Tryouts)', icon: '', route: 'blog'
       //       ,sub: [ 
       //           // { label: 'Markdown editor', route: 'epic'}
       //           { label: 'Chat', route: 'chat'}
       //           ,{ label: 'Editor', route: 'filebrowser'}
       //           ,{ label: 'Youtube carousel', route: 'ytcarousel'}
       //           // ,{ label: 'Submenu item 2', route: 'index.html'}
       //           // ,{ label: 'Submenu item 2', route: 'index.html'}
       //       ]
       
       //     } 
       // ]
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
    { url: "images/slides/home_page_Early_Childhood_Education_and_Care_training.jpg"
      // ,title: 'Early Childhood Education and Care training'
      // ,subtitle: 'Aged care slogan'
    }
    ,{ url: "images/slides/home_page_engaging_resources.jpg"
      // ,title: 'Innovative resources to bridge the gap between theory and practice'
      // ,subtitle: 'Slogan'
    },
    { url: "images/slides/home_page_First_Door_mentoring.jpg"
      //,title: 'First Door mentoring inspires focused students'
      // ,subtitle: 'Slogan'
    }
    ,{ url: "images/slides/home_page_interactive_professional_development.jpg"
      // ,title: 'Interactive professional development connecting educators to the National Quality Framework'
      // ,subtitle: 'Slogan'
    }
];

var exports = {
    verbose: true
    // ,monitor: true
    ,prettyPrintHtml: false
    // ,tagIdPostfix: '__' //can be overridden per template
    ,paths: {
        // root: '/home/michieljoris/www/firstdoor/'
        root: process.cwd() 
        //relative to this root:
        ,partials: 'build/'  //can be overridden per template
        ,out:'www/built' 
        ,js: 'www/js'
    }
    ,routes: routes
    
    //Every partial generates a string. How the partial is generated
    //depends on its type. Each type can define more than one partial
    //of that type by assigning an array of definitions instead of
    //just one (object) definition to that type. These partials are
    //identified by their id. This enables them to uses as the source in
    //later defined templates. They don't need an id if you just want
    //to generate a string to save to the file defined in 'out'.
    ,partials: {
        ids: {
            title: '<title>Firstdoor - Leaders in developing capability</title>'
            ,image_courses: '<img class="" src="images/slides/tab_accredited_training.jpg" />'
            ,image_aboutus: '<img class="" src="images/slides/tab_about_us.jpg" />'
            ,image_pd: '<img class="" src="images/slides/tab_professional_development.jpg" />'
            ,image_resources: '<img class="" src="images/slides/tab_resources.jpg" />'
            ,image_blog: '<img class="" src="images/slides/tab_blog.jpg" />'
            ,skewer:'<script src="http://localhost:9090/skewer"></script>'
            ,recaptcha: '<script type="text/javascript" src="http://www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>'

        }
        ,metaBlock : {
            id: 'meta',
            tags: [ { charset:'utf-8' }
                    ,{ content:"IE=edge,chrome=1",
                       "http-equiv":"X-UA-Compatible"
                    }
                    ,{ content:"First Door recognises the need and value of workplace learning and provides courses to create learning organisations with skilled mentors, leaders and managers. ",
                       name:"description"
                    }
                    ,{ name: "viewport"
                      ,content: "width=device-width, initial-scale=1, maximum-scale=1"}
                  ]
        }
        ,linkBlock:  {
            id: 'myLinkBlock',
            files: css,
            path: 'css/'
        }
        ,scriptBlock: [
            {
                id: 'headJsBlock',
                files: [
                    'prefetch_images'
                ],
                path: 'js/'
            },
            {
                id: 'myJsBlock',
                files: js,
                path: 'js/'
            }
        ]
        ,slideShow: [{ type: 'flex',
                       id: 'flex',
                       slides: slides
                     }
                     // ,{ type: 'camera',
                     //   id: 'camera',
                     //   slides: slides
                     // }
                    ]
        ,menu: [
            // { type: 'superfish',
            //       tree: mainMenuTree,
            //       id: 'superfish'
            //     },
                { type: 'css',
                  tree: mainMenuTree,
                  id: 'cssmenu'
                  // ,"ng-class:": "isActive()"
                }
                ,{ type: 'css',
                  tree: mainMenuTree,
                  id: 'fixedmenu'
                }
               ]
        ,template: [
            //Home
            {  src: 'views/view_home_partial.html'
               ,out : 'view-home.html'
               ,mapping: {
                   sidebar: 'html/sidebar'
                   // ,slogan: 'html/slogan'
                   ,slideShow: 'flex',
                   homeContents: 'markdown/welcome.md'
               }}
            
            //ProfDev
            ,{ id: "showhide_pd_inspired_info", showhide: "markdown/pd_inspired_info.md" },
            { id: "showhide_pd_coop_info", showhide: "markdown/pd_coop_info.md"}, 
            { id: "showhide_pd_environment_info", showhide: "markdown/pd_environment_info.md"},
            { id: "showhide_pd_observing_info", showhide: "markdown/pd_observing_info.md" }
            ,{ id: "showhide_pd_evaluation_info", showhide: "markdown/pd_evaluation_info.md" }
            ,{ id: "showhide_pd_children_info", showhide: "markdown/pd_children_info.md" }
            ,{ id: "showhide_pd_risk_info", showhide: "markdown/pd_risk_info.md" }
            ,{ id:"pd_wrapper",
               src: 'markdown/pd.md'
               // ,out : 'test.html'
               ,mapping: {
                   showhide_pd_inspired_info: "showhide_pd_inspired_info"
                   ,showhide_pd_observing_info: "showhide_pd_observing_info"
                   ,showhide_pd_environment_info: "showhide_pd_environment_info"
                   ,showhide_pd_coop_info: "showhide_pd_coop_info"
                   ,showhide_pd_evaluation_info: "showhide_pd_evaluation_info"
                   ,showhide_pd_children_info: "showhide_pd_children_info"
                   ,showhide_pd_risk_info: "showhide_pd_risk_info"
               }}
            ,{ 
                src: 'views/view_pd_partial.html'
                ,out : 'view-pd.html'
                ,mapping: {
                    sidebar: 'html/sidebar'
                    ,slogan: 'html/slogan'
                    ,image: 'image_pd'
                    ,contents: 'pd_wrapper'
                }}
            
            //Courses
            ,{ 
                src: 'views/view_courses_partial.html'
                ,out : 'view-courses.html'
                ,mapping: {
                    sidebar: 'html/sidebar'
                    ,image: 'image_courses'
                    // ,slogan: 'slogan'
                    // ,slideShow: 'flex',
                    ,contents: 'markdown/courses.md'
                }}
            
            //About us
            ,{ 
                src: 'views/view_aboutus_partial.html'
                ,out : 'view-aboutus.html'
                ,mapping: {
                    sidebar: 'html/sidebar'
                    ,image: 'image_aboutus'
                    // ,slogan: 'slogan'
                    // ,slideShow: 'flex',
                    ,contents: 'markdown/aboutus.md'
                }}
            
            //Resources
            ,{ 
                src: 'views/view_resources_partial.html'
                // src: 'html/resources.html'
                ,out : 'view-resources.html'
                ,mapping: {
                    sidebar: 'html/sidebar'
                    ,image: 'image_resources'
                    ,contents: 'html/resources'
                }}
            
            //Blog
            ,{ 
                src: 'views/view_blog_partial.html'
                ,out : 'view-blog.html'
                ,mapping: {
                    sidebar: 'html/sidebar'
                    // ,image: 'image_blog'
                    // ,slogan: 'slogan'
                    // ,slideShow: 'flex',
                    // ,contents: 'markdown/resources.md'
                }}
            
            //Misc
            //Contact Us
            ,{
                src: 'views/view_contactus_partial.html'
                ,out : 'view-contactus.html'
                ,mapping: {
                    // sidebar: 'html/sidebar'
                    // ,slogan: 'html/slogan'
                    contents: 'html/contactForm'
                }}
            //Epic editor
            ,{
                src: 'views/view_epic_partial.html'
                ,out : 'view-epic.html'
                ,mapping: {
                    // sidebar: 'html/sidebar'
                    // ,slogan: 'html/slogan'
                    // ,slideShow: 'flex',
                    // homeContents: 'markdown/welcome.md'
                }}
            //Chat
            ,{
                src: 'views/view_chat_partial.html'
                ,out : 'view-chat.html'
                ,mapping: {
                    left: 'html/chat.html',
                    right: 'markdown/chat.md'
                }}
            //FileBrowser
            ,{
                src: 'views/view_filebrowser_partial.html'
                ,out : 'view-filebrowser.html'
                ,mapping: {
                    left: 'html/chat.html',
                    right: 'markdown/chat.md'
                }}
            
            //Main layout
            ,{ id: 'page' 
               ,src: 'html/basicAngularPage.html'
               ,tagIdPostfix: '' //can be overridden per template
               
               //Maps tag ids to partial ids. Tag ids have to be
               //postfixed with two dashes in the template. Partials
               //with an extension will be loaded from the partials
               //folder for this template. Markdown files will be
               //converted to html. Partials in an array will be
               //concatenated before inserted at the tag id element
               ,mapping: {
                   head: ['title', 'meta',  'html/ieshim','skewer', 'headJsBlock', 'myLinkBlock','_linkBlock'],
                  
                   "ng:app": ['html/body.html', 'myJsBlock', 'recaptcha', '_scriptBlock', 'html/google_analytics.html']
               }
             }
            ,{ src: 'page' 
               ,tagIdPostfix: '--' //can be overridden per template
               ,pathOut: ''
               ,out: 'www/index.html' //optional, relative to root
               ,mapping: {
                   message: 'html/message'
                   ,logo: 'html/logo'
                   ,social: 'html/social'
                   ,contact: 'html/contact'
                   ,studentLogin: 'html/wisenet-login'
                   ,search: 'html/search'
                   ,menu: 'cssmenu'
                   ,fixedmenu: 'fixedmenu'
                   // ,footerLeft: 'html/footerLeft'
                   // ,footerMiddle: 'html/footerMiddle'
                   // ,footerRight: 'html/footerRight'
                   ,'footerBottom': 'html/footerBottom'
                   // ,'feedback': 'html/feedback'
               }
             }
            
        ] 
        
    }
};
