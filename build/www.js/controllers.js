
function BottomCntl($scope, $location, $http, editor) {
    initPersona($scope, $http, editor);
    console.log('In BottomCntl', $scope.signedIn);
    console.log(editor);
    $scope.signedIn = editor.signedIn;
    $scope.email = editor.email;
    
    $scope.login = function($event) {
        $event.preventDefault();
        console.log('Logging in');
        navigator.id.request();
    };
    
    $scope.logout = function($event) {
        $event.preventDefault();
        console.log('Logging out');
        navigator.id.logout();
    };
    
    
}
BottomCntl.$inject = ['$scope', '$location', '$http', 'editor'];

var nrtlogo_allowed = [
    "/courses/intro",
    "/courses/children_ecec",
    "/courses/diploma_management",
    "/courses/certivtraining",
    "/courses/apprenticeship"
    ];

//Controllers
function MainCntl($scope, $location, $http, editor) {
    console.log('Main controller..');
    console.log(editor);
    
    $scope.signedIn = editor.signedIn;
    $scope.email = editor.email;
    $scope.saveEditable = editor.saveEditable;
    $scope.undoEditable = editor.undoEditable;
    $scope.printEditable = editor.printEditable;
    $scope.toggleEditable = editor.toggleEditable;
    $scope.editable = editor.editable;
    editor.set($scope, $http);
    $scope.signingIn = editor.signingIn;
    $scope.isDirty = editor.isDirty;
    
    $scope.getContactUsText = function() {
        
        var path = $location.$$path.split('/').filter(function(e) { return e; });
        var page = path[0] || 'home';
        // console.log('route' ,$location.path);
        var strings = {
            'home':'Request your First Door ' +
                // '<a href="documents/FirstDoor_StudentHandbook.pdf">'+
                'student handbook now, or phone us. We’re here to help.',
            'aboutus':'Contact us, we are here to help you.',
            'pd':'Request forms now to evaluate your Centre’s PD needs, or call us for more information',
            'courses': 'Request a course guide' +
                ' and sample training plan, or phone us. We’re here to help.',
            'resources': 'Fill in your details to receive regular resource updates.'
        };
        return strings[page];
    };
    
    $scope.show_events = function() {
        // console.log('show events', $location.$$url);
         return $location.$$url === "/home/welcome";
        };
    
    
    $scope.hide_nrtlogo = function() {
        var loc = $location.$$url;
        // console.log(loc);
        return nrtlogo_allowed.indexOf(loc) === -1;
        };

    $scope.cachify = function(path) {
        var cs = cachify(path);
        return cs;
    };
    // $anchorScroll();
    
    // console.log('location', $location);
    // console.log('route', $route);
    // console.log('params', $routeParams);
    // $scope.$route = $route;
    // $scope.$location = $location;
    // $scope.$routeParams = $routeParams;
    
    // $(".scroll").click(function(event){
    //     console.log($scope);
        
    //     console.log('click on scroll');
    //     //prevent the default action for the click event
    //     event.preventDefault();
        
    //     //get the full url - like mysitecom/index.htm#home
    //     // var full_url = this.href;
        
    //     // //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
    //     // var parts = full_url.split("#");
    //     // console.log(parts);
    //     // var trgt = parts[parts.length-1];
        
    //     var hash = $scope.$location.$$hash;
    //     //get the top offset of the target anchor
    //     var target_offset = $("#"+hash).offset();
    //     if (target_offset) {
    //         var target_top = target_offset.top;
    //         console.log('scrolling', hash, target_top);
    //         //goto that anchor by setting the body scroll top to anchor top
    //         $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
    //     }
    // });
    
}
MainCntl.$inject = ['$scope', '$location', '$http', 'editor'];

function getPrettyTitle(page, section) {
    var data = greendoor[page];
    if (!page || ! data || (page === 'home' && section === 'welcome'))
        return 'Firstdoor - Leaders in developing capability ';
    var links = data.links;
    if (!section || !links ) return 'Firstdoor - ' + (data.title || page);
    var path = page + '/' + section;
    var title;
    Object.keys(links).some(function(l) {
        if (links[l].route === path)  {
            title = 'Firstdoor - ' + (data.title || page) + ': ' +  links[l].label;   
            return true;
        }
        else return false;
    });
    return title || 'Firstdoor - Leaders in developing capability ';
}

var exists = {
    home : ['welcome', 'specialists', 'mentor', 'constructive', 'asqa','engaging'],
    aboutus : ['vision', 'mission', 'approach', 'values', 'namelogo', 'people', 'policies'],
    pd: ['intro', 'inspired', 'observing', 'environment', 'coop', 'evaluation', 'children', 'risk', 'pdfees', 'customised'],
    courses: ['intro', 'children_ecec', 'diploma_management', 'certivtraining', 'priorlearning', 'trainingplans', 'studentfees', 'apprenticeship']
    
        
};
    
var greendoor = {
    'home':{ heading: '',
             title: 'Home', 
            default_ie8sucks: 'welcome',  //ie8 gives error when using default as property name...
             links:    [
                 { label: 'Welcome', route: '/', scroll: true}
                 // ,{ label: 'Specialists in Early Childhood training and development', route: '/home/specialists', scroll: true}
                 ,{ label: 'Early Childhood Specialists', route: '/home/specialists', scroll: true}
                 ,{ label: 'Engaging resources and environments', route: '/home/engaging', scroll: true}
                 ,{ label: 'Your personal mentor ', route: '/home/mentor', scroll: true}
                 ,{ label: 'Constructive and timely assessment', route: '/home/constructive', scroll: true}
                 // ,{ label: 'Australian Skills Quality Authority audit summary', route: '/home/asqa', scroll: true}
                 ,{ label: 'ASQA Audit Summary', route: '/home/asqa', scroll: true}
                 // ,{ label: 'Quiz: discover your preferred learning style', route: '/home/quiz', scroll: true}
             ]
           }
    ,'pd':{
        title: 'Professional development',
        heading: '',
        default_ie8sucks: 'intro',
        links:    [
            { label: 'Tailored workshops', route: '/pd/intro', scroll: true}
            ,{ label: 'The inspired educator', route: '/pd/inspired', scroll: true}
            // ,{ label: 'Observation, documentation, planning and evaluating', route: '/pd/observing', scroll: true}
            ,{ label: 'Documentation', route: '/pd/observing', scroll: true}
            ,{ label: 'Environment and experiences', route: '/pd/environment', scroll: true}
            ,{ label: 'Developing cooperative behaviour', route: '/pd/coop', scroll: true}
            ,{ label: 'Evaluation and reflective practice', route: '/pd/evaluation', scroll: true}
            ,{ label: 'Children at risk', route: '/pd/children', scroll: true}
            ,{ label: 'Identify and manage risk', route: '/pd/risk', scroll: true}
            ,{ label: 'Customised workshop', route: '/pd/customised', scroll: true}
            ,{ label: 'Fees', route: '/pd/pdfees', scroll: true}
            // ,{ label: 'Fees', route: '/documents/Professional_Development_fees.docx', scroll: true}
        ]
    }
    ,'aboutus': {
        title: 'About us',
        heading: '',
        default_ie8sucks: 'vision'
        ,links: [
            // { label: 'Our company', route: '/aboutus/company', scroll: true
            //  } 
            // ,sub: [
            // { label: 'Markdown editor', route: '/epic'}
            { label: 'Vision', icon: '', route: '/aboutus/vision'}
            ,{ label: 'Mission', route: '/aboutus/mission'}
            ,{ label: 'Our student approach', route: '/aboutus/approach'}
            ,{ label: 'Values', route: '/aboutus/values'}
            // ]
            // }
            ,{ label: 'Our name and logo', route: '/aboutus/namelogo', scroll: true}
            ,{ label: 'Our people', route: '/aboutus/people', scroll: true}
            ,{ label: 'Policies', route: '/aboutus/policies'}
            
           
        ]
    } 
    ,'resources':   {
        title: 'Resources',
        heading: '',
        default_ie8sucks: 'motivation'
        ,links: [
            { label: 'Motivation', route: '/resources/motivation', scroll: true
            }
            ,{ label: 'Early childhood', route: '/resources/earlychildhood', scroll: true
               // ,sub: [
               //     { label: 'Educational leaders', route: '/resources'}
               // ]
             }
            ,{ label: 'Learning organisations', route: '/resources/learningorganisations', scroll:true}
            ,{ label: 'Learning', route: '/resources/learning', scroll:true}
            ,{ label: 'Leadership and Management', route: '/resources/leadership', scroll:true}
            // ,{ label: 'Quiz', route: '/quiz'}
        ]
    }
    ,'courses': {
        title: 'Accredited training',
        heading: '',
        default_ie8sucks: 'intro'
        // ,subtext: "Further information on Accredited Training with First Door will become available following registration as a Registered Training Organisation"
        ,links: [
            { label: 'Accredited training', route: '/courses/intro',
              scroll: true}
            ,{ label: 'Diploma of Early Childhood Education and Care', route: '/courses/children_ecec',
               scroll: true}
            ,{ label: 'Diploma of Management ', route: '/courses/diploma_management', scroll: true}
            // ,{ label: 'Leadership Units', route: '/courses/diploma_management', scroll: true}
            // ,{ label: 'Certificate IV in Training and Assessment', route: '/courses/certivtraining', scroll: true}
            ,{ label: 'Leadership Units', route: '/courses/certivtraining', scroll: true}
            ,{ label: 'Recognised Prior Learning', route: '/courses/priorlearning', scroll: true}
            ,{ label: 'Flexi or structured training plans', route: '/courses/trainingplans', scroll: true}
            ,{ label: 'Student fees', route: '/courses/studentfees', scroll: true}
            // ,{ label: 'Aged care', route: '/courses/agedcare'}
        ]

        
    } 
    ,'enrol': {
        title: 'Enrol',
        heading: '',
        default_ie8sucks: ''
        // ,subtext: "Further information on Accredited Training with First Door will become available following registration as a Registered Training Organisation"
        ,links: [
            { label: 'STUDENT HANDBOOK', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/FirstDoor_StudentHandbook.pdf", scroll: true}
            ,{ label: 'DIPLOMA ECEC COURGUIDE', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Diploma_Early_Childhood_Course_Guide.pdf", scroll: true}
            ,{ label: 'ENROLMENT: DIPLOMA ECEC (paper version)', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Dip%20ECEC%20enrolment%20print%20version.pdf", scroll: true}
            ,{ label: 'ENROLMENT: DIPLOMA ECEC (computer version)', download: "true", file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Dip%20ECEC%20enrolment%20electronic%20version.docx" , scroll: true}
            ,{ label: 'ENROLMENT: LEADERSHIP UNIT/S (paper version)', file: true, route: "https://dl.dropboxusercontent.com/u/121993962/Individual%20Units%20enrolment%20print%20version.pdf", scroll: true}
            ,{ label: 'ENROLMENT: LEADERSHIP UNIT/S (computer version)', download: "true", file: true, route:"https://dl.dropboxusercontent.com/u/121993962/Individual%20Units%20enrolment%20electronic%20version.docx" , scroll: true}
        ]

        
    }
    ,'contactus' : {
        title: 'Contact us'
        
        
    }
    ,'404': {
        title: 'Not found'
    }
    
};


function capitalizeDoor(door) {
    // return;
    Object.keys(door).forEach(function(k) {
        var menu = door[k];
        if (menu.title === 'Enrol') return;
        if (!menu.links) return;
        // console.log(menu);
        menu.links.forEach(function(l) {
            l.label = l.label.toUpperCase();
        });
    });
}
    
capitalizeDoor(greendoor);

function setActiveTab(page) {
    // console.log('setting active tab to ' , page);
    // var url = page.$$url;
    // if (!url) url = "whatever";
    var newRoute = page;
    // console.log('newRoute', newRoute);
    $(".menu > li > a[id*='" + newRoute+ "']").attr("class", "active");
    if (lastRoute !== newRoute)
        $(".menu > li > a[id*='" + lastRoute + "']").attr("class", "inactive");
    lastRoute = newRoute;
}


var headerImages = {
    
    "home": {
        "*": "/images/homepage_image.jpg"
        ,specialists: "/images/slides/home_page_Early_Childhood_Education_and_Care_training.jpg"
        ,engaging: "/images/slides/tab_resources.jpg"
        ,quiz: "/images/slides/tab_resources.jpg"
        ,mentor: "/images/slides/home_page_First_Door_mentoring.jpg"
        ,constructive: "/images/slides/home_assessment.jpg"
        // ,asqa: "/images/slides/home_assessment.jpg"
    } 
    ,"resources": {
        "*": "/images/slides/tab_resources.jpg"
        
    }
    ,"aboutus": {
        "*": '/images/slides/tab_about_us.jpg'
        
    }
    ,"sitemap": {
        "*": '/images/slides/tab_about_us.jpg'
        
    }
    ,"pd": {
        "*": "/images/slides/tab_professional_development.jpg"
        ,inspired: "/images/slides/PD_Inspired_educator.jpg"
        ,observing: "/images/slides/PD_Observing_and_documenting.jpg"
        ,environment: "/images/slides/PD_Environment_and_experiences.jpg"
        ,coop: "/images/slides/PD_cooperative_behaviour.jpg"
        ,evaluation: "/images/slides/PD_reflective_practice.jpg"
        ,children: "/images/slides/PD_identifying_at_risk_childen.jpg"
        ,risk: "/images/slides/PD_managing_risk.jpg"
        ,customised: ""
    }            
    ,"courses": {
        "*": "/images/slides/tab_accredited_training.jpg"
        ,children_ecec: "/images/slides/courses_Diploma_Childrens_services.jpg"
        ,diploma_management: "/images/slides/courses_Diploma_Management.jpg"
        ,certivtraining: "/images/slides/tab_professional_development.jpg"
        // ,certivtraining: "/images/slides/courses_certiv.jpg"
    }
    
};

var lastRoute='whatever';
function DefaultCntl($scope, $routeParams, $location, $anchorScroll, editor) {
    console.log('default controller..', $location, $routeParams);
    
    editor.locationChanged($location.$$path);
    var path = $location.$$path.split('/').filter(function(e) { return e; });
    var page = path[0] || '404';
    // console.log('page in default cntl is ', page, path);
    
   
    // if ($location.$$path === '/') $location.$$path = '/home';
    
    // $scope.page = greendoor[$location.$$path] || greendoor['/home'];
    $scope.page = greendoor[page] || greendoor['404'];
    
    // console.log('$scope.page =', $scope.page);
    var section = $routeParams.section || $scope.page.default_ie8sucks; //
    console.log('section in defaultcntl:', section);
    
    // document.title = 'Firstdoor: ' + page + '/' + section;
    document.title = getPrettyTitle(page, section);
    // $scope.name = "BookCntl";
    // $scope.params = $routeParams;
    // console.log($location);
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    // console.log('routeparams', $routeParams);
    setActiveTab(page);
    // console.log($location);
    // var url = $location.$$url;
    // if (!url) url = "whatever";
    // console.log(url);
    // var newRoute = $location.$$path.slice(1);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // lastRoute = newRoute;
    
    
    // console.log('course1 tag', $('#course1'));
    if (!$location.$$hash) {
        console.log('scrolling to top');
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
        
    }
    // setTimeout(function(){
    //     $anchorScroll(hash);
    // },100);
    
    
    // $(function() {
    //     $('#da-slider').cslider({
    //         autoplay	: true
    //         ,interval: 10000
    //     });
    // });
    $scope.getHeaderImage = function() {
        
        console.log('getheaderimage:', page);
        var images = headerImages[page] || headerImages['home'];
        console.log('getheaderimage:', images);
        if (!images) {
            console.warn("WARNING: DefaultCntl: header images for page " +
                         page + " don't exist");
            return "";
        }
        // var imageSrc = page[$location.$$hash] || page["*"];
        // console.log('section:', $routeParams.section);
        var imageSrc = images[section] || images["*"];
        // var imageSrc = page[$routeParams.section] || page["*"];
        // console.log(imageSrc);
        if (!imageSrc)
            // console.warn("WARNING: header image for " + $location.$$hash + " doesn't exist");
            console.warn("WARNING: header image for " + section + " doesn't exist");
        // return "images/slides/tab_professional_development.jpg";
        return cachify(imageSrc);
    };
    
    $scope.isSelected = function(fullPath) {
        // if ($location.$$url === '/' + fullPath) return "selected";
        var loc = $location.$$url;
        var home;
        if (loc === '/' || loc === '/home/welcome')
            home = true;
        if (home && fullPath === '/' || fullPath === '/home/welcome') return "selected";
        
        if (fullPath === '/' || fullPath === '/home/welcome') fullPath = '';
        if ($location.$$url === '/' + fullPath ) return "selected";
        else return "";
    };
    
    $scope.getPageClass = function() {
        // var path = $location.$$path;
        var path = page;
        // if (path) path = path.slice(1);
        console.log(path);
        // return 'doorlinks-' + path;
        return 'doorSpacing';
    };
    
    $scope.isShow = function(id) {
        // console.log('defaultcntl: isshow: id=', id);
        // console.log('hash=', $location.$$hash);
        
        // if ($routeParams.page && $routeParams.page === id) return true;
        // else return $routeParams.section === id;
        return section === id;
        // if ($routeParams.page && $routeParams.page === id) return "selected";
        // else return $location.$$hash === id ? "selected" : "";
    };

    $scope.is404 = function() {
        
        return !exists[page] || exists[page].indexOf(section) === -1;
    };
    
    
    // console.log('contactus controller');
    // $scope.result = "now it is working..";
    $scope.sent = false;
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
    //                 );
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
    }; 
}
DefaultCntl.$inject = ['$scope', '$routeParams', '$location', '$anchorScroll', 'editor'];


function clickSend($event, $scope) {
        $event.preventDefault();
        console.log('clicked on send');
        var username_first=$('#username_first').val()
            ,username_last=$('#username_last').val()
            ,email=$('#email').val();
        var username = username_first + ' ' + username_last;
        var textmessage=$('#textmessage').val();
        
        if (!username_first || !username_last || username.length === 1) {
            $scope.namemissing = 'error';
            $scope.result = "Please add a full name..";
            return;
        }
        else if (!email || email.length === 0) {
            
            $scope.namemissing = '';
            $scope.emailmissing = 'error';
            $scope.result = "Please add an email address..";
            return;
        }
        else if (!textmessage || textmessage.length === 0) {
            $scope.namemissing = '';
            $scope.emailmissing = '';
            $scope.msgmissing = 'error';
            $scope.result = "Please add a message..";
            return;
        }
        else {
            $scope.emailmissing="";
            $scope.namemissing="";
            $scope.msgmissing="";
        }
        
        // console.log("From the form:", username, email, textmessage, Recaptcha.get_response());
        $.ajax({
            url: "/contactus_form",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username:username,
                                   email:email,
                                   textmessage:textmessage
                                   // ,recaptcha_response: Recaptcha.get_response(),
                                   // recaptcha_challenge: Recaptcha.get_challenge()
                                 }),
            success: function (data, textStatus, jqXHR) {
                // Recaptcha.reload();
                data = JSON.parse(data);
                console.log('Form result:', data);
                $scope.result = '';
                if (data.success) $scope.sent = true;
                    // $scope.result = "Message sent!!!";
                else $scope.result = "Message not sent: " + data.error;
                
                $scope.$apply();
                
                // do something with your data here.
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Recaptcha.reload();
                console.log('error', arguments);
                // likewise do something with your error here.
            }
        });
    
}

function contactusCntl($scope, $routeParams, $location, editor) {
    
    $('html, body').animate({
        scrollTop: 0
    }, 1);
    $scope.sent = false;
    console.log('contactus controller');
    // $scope.result = "now it is working..";
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
                    // );
    
    
    // document.title = 'Firstdoor: Contact us';
    document.title = getPrettyTitle('contactus');
    setActiveTab('contactus');
    // console.log($location);
    // var url = $location.$$url;
    // if (!url) url = "whatever";
    // console.log(url);
    // var newRoute = $location.$$path.slice(1);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // lastRoute = newRoute;
    
        
    // var url = $location.$$url;
    // if (!url) url = "whatever";
    // console.log(url);
    
    // $(".menu #" + url.slice(1)).attr("class", "active");
    // $(".menu #" + lastRoute.slice(1)).attr("class", "inactive");
    // lastRoute = $location.$$url;
    // $scope.emailmissing="error";
    // $scope.namemissing="error";
    // $scope.msgmissing="error";
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
       }; 
    
}

contactusCntl.$inject = ['$scope', '$routeParams', '$location', 'editor'];

function EpicCntl($scope, $routeParams) {
    console.log('default controller..');
    $scope.name = "BookCntl";
    $scope.params = $routeParams;
    var opts = {
        container: 'epiceditor',
        textarea: null,
        basePath: 'epiceditor',
        clientSideStorage: true,
        localStorageName: 'epiceditor',
        useNativeFullsreen: true,
        // parser: marked,
        file: {
            name: 'epiceditor',
            defaultContent: '',
            autoSave: 100
        },
        theme: {
            base: '/themes/base/epiceditor.css',
            preview: '/themes/preview/bartik.css',
            editor: '/themes/editor/epic-dark.css'
        },
        button: {
            preview: true,
            fullscreen: true
        },
        focusOnLoad: false,
        shortcut: {
            modifier: 18,
            fullscreen: 70,
            preview: 80
        },
        string: {
            togglePreview: 'Toggle Preview Mode',
            toggleEdit: 'Toggle Edit Mode',
            toggleFullscreen: 'Enter Fullscreen'
        }
    };
    var editor = new EpicEditor(opts);
    editor.load();
    window.test = editor;
    
    var str = "Something to play with. I am going to try to hook it up with the markdown files on the server.\
\n\n\
This will not be in the final website as such of course,  there will be secure secret website address with login etc\
\n\n\
Move the mouse over the black area and two icons appear, click them for previews of the markdown text.\
\n\n\
Escape gets you out of full screen mode.\
\n\n\
Following is some text from the welcome page. Any edits are not yet saved back to the server.\
\
\n\n\
\
#Welcome to First Door Training and Development\
\
\n\n\
Choosing a job role to enrich and touch people’s lives is a career choice that has the ability to impact on individuals, communities and our society.\
\
\n\n\
>    “I alone cannot change the world, but I can cast a stone across the waters to create many ripples.” Mother Teresa\
\n\n\
A list:\
\n\n\
* item 1\n\
* item 2\n\
\n\n\
Numbered:\
\n\n\
1. item 1\n\
* item 2\n\
\n\n\
And some examples to make links: [http://www.google.com]() or [google](http://www.google.com)";
    editor.importFile('test',str);
}

EpicCntl.$inject = ['$scope', '$routeParams'];

function HomeCntl($scope, $routeParams, $location, editor) {
    // console.log(' Home controller..', $location);
    console.log(' Home controller..', $routeParams);
    editor.locationChanged($location.$$path);
    // console.log('routeParams:', $routeParams.section, $location);
    if (!$location.$$url || $location.$$url === '/') {
     $location.$$url="/home/welcome";   
        // $location.$$hash = 'welcome';
        $location.$$path = '/home/welcome';
    }
    
    var path = $location.$$path.split('/').filter(function(e) { return e; });
    var page = path[0] || '404';
    // console.log(page);
    $scope.page = greendoor[page] || greendoor['404'];
    // console.log(page, $scope.page);
    var section = $routeParams.section || $scope.page.default_ie8sucks;
    // console.log('page and section in homecntl:', page, section);
    // $scope.page = greendoor[$location.$$path ] || greendoor['/home'];
    
    // document.title = 'Firstdoor: ' + page + '/' + section;
    
    document.title = getPrettyTitle(page, section);
    
    
    
    
    setActiveTab(page);
    // var newRoute = $location.$$path.slice(1);
    // if (!newRoute) newRoute = 'home';
    // console.log('Path is:', $location.$$path);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // lastRoute = newRoute;
    // console.log('course1 tag', $('#course1'));
    if (!$location.$$hash) {
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
        
    }
    
    $('.flexslider').flexslider({
        // animation: "slide",
        easing: 'easeInOutQuad',
        slideshow:true,
        controlNav: false,
        directionNav: true,
        slideshowSpeed: 10000,
        animationSpeed: 5000,
        touch: true
    });
    // jQuery(document).ready(function(){
    //     console.log('starting camera');
    //     jQuery('#camera').camera({
    //         pagination: false
    //         ,playPause: false
    //     });
    // });
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    
    $scope.getPageClass = function() {
        // var path = $location.$$path;
        var path = page;
        // if (path) path = path.slice(1);
        // console.log(path);
        // return 'doorlinks-' + path;
        
        return 'doorSpacing';
    };
    
    
    $scope.isSelected = function(fullPath) {
        var loc = $location.$$url;
        var home;
        if (loc === '/' || loc === '/home/welcome')
            home = true;
        if (home && fullPath === '/' || fullPath === '/home/welcome') return "selected";
        if ($location.$$url === '/' + fullPath) return "selected";
        else return "";
    };
    
    $scope.getHeaderImage = function() {
        var images = headerImages[page] || headerImages['home'];
        
        if (!images) {
            console.warn("WARNING: homeCnlt: header images for page " +
                         page + " don't exist");
            return "";
        }
        
        // console.log('section:', $routeParams.section);
        var imageSrc = images[section] || images["*"];
        // var imageSrc = page[$routeParams.section] || page["*"];
        // var imageSrc = page[$location.$$hash] || page["*"];
        // var imageSrc = page[$routeParams.$$hash] || page["*"];
        // console.log(imageSrc);
        if (!imageSrc)
            console.warn("WARNING: header image for " + section + " doesn't exist");
        // return "images/slides/tab_professional_development.jpg";
        return cachify(imageSrc);
    };
    
    
    $scope.is404 = function() {
        // console.log (page,section,  !exists[page] || exists[page].indexOf(section) === -1);
        return !exists[page] || exists[page].indexOf(section) === -1;
    };
    
    
    $scope.isShow = function(id) {
        // console.log('is show: id=', id, section);
        // console.log('routeParams=', $routeParams.section);
        // console.log('hash=', $location.$$hash);
        // if ($routeParams.page && $routeParams.page === id) return true;
        if ($routeParams.page && $routeParams.page === id) return true;
        else return section === id;
        // else return $routeParams.section === id;
    };
    
    $scope.sent = false;
    // Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    //                  "captchadiv",
    //                  {
    //                      // theme: "clean",
    //                      theme: "red",
    //                      callback: Recaptcha.focus_response_field
    //                  }
    //                 );
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
    }; 
    
}

HomeCntl.$inject = ['$scope', '$routeParams', '$location', 'editor'];


function chatCntl($scope, $routeParams) {
    
    "use strict";
    console.log('Chat Controller');
    
    // for better performance - to avoid searching in DOM
    var content = $('#content');
    var input = $('#input');
    var status = $('#status');
    
    // my color assigned by the server
    var myColor = false;
    // my name sent to the server
    var myName = false;
    
    // if user is running mozilla then use it's built-in WebSocket
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    // console.log('setting html');
    // content.html('blablabla');
    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t ' +
                                'support WebSockets.'} ));
        input.hide();
        $('span').hide();
        return;
        }
    
    // open connection
        var host = window.location.host;
    var connection = new WebSocket('ws://' + host); //127.0.0.1:8080');
    // var connection = new WebSocket('ws://127.0.0.1:8080');
    // var connection = new WebSocket('ws://firstdoor.michieljoris.com');
    
    connection.onopen = function () {
        // first we want users to enter their names
        input.removeAttr('disabled');
        status.text('Choose name:');
    };
    
    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                + 'connection or the server is down.' } ));
    };
    
    var userName;
    // most important part - incoming messages
    connection.onmessage = function (message) {
        // try to parse JSON message. Because we know that the server always returns
        // JSON this should work without any problem but we should make sure that
        // the massage is not chunked or otherwise damaged.
        var json;
        try {
            json = JSON.parse(message.data);
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }
        
        // NOTE: if you're not sure about the JSON structure
        // check the server source code above
        if (json.type === 'color') { // first response from the server with user's color
            userName = json.userName;
            console.log(userName);
            myColor = json.data;
            status.text(myName + ': ').css('color', myColor);
            input.removeAttr('disabled').focus();
            // from now user can start sending messages
        } else if (json.type === 'history') { // entire message history
            // insert every single message to the chat window
            for (var i=0; i < json.data.length; i++) {
                addMessage(json.data[i].author, json.data[i].text,
                           json.data[i].color, new Date(json.data[i].time));
            }
        } else if (json.type === 'message') { // it's a single message
            console.log(json.data.author, userName);
            if (json.data.author !== userName) {
                var bell = new Audio("soundclips/onechime.ogg");
                // console.log('Trying to play bell..');
                bell.play();
            }
            input.removeAttr('disabled'); // let the user write another message
            addMessage(json.data.author, json.data.text,
                       json.data.color, new Date(json.data.time));
        } else {
            console.log('Hmm..., I\'ve never seen JSON like this: ', json);
        }
    };
    
    /**
     * Send mesage when user presses Enter key
     */
    input.keydown(function(e) {
        if (e.keyCode === 13) {
            var msg = $(this).val();
            if (!msg) {
                return;
            }
            // send the message as an ordinary text
            connection.send(msg);
            $(this).val('');
            // disable the input field to make the user wait until server
            // sends back response
            input.attr('disabled', 'disabled');
            
            // we know that the first message sent from a user their name
            if (myName === false) {
                myName = msg;
            }
        }
    });
    
    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            status.text('Error');
            input.attr('disabled', 'disabled').val('Unable to comminucate '
                                                   + 'with the WebSocket server.');
        }
    }, 3000);
    
    /**
     * Add message to the chat window
     */
    function addMessage(author, message, color, dt) {
        content.prepend('<p><span style="color:' + color + '">' + author + '</span> @ ' +
                        + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
                        + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
                        + ': ' + message + '</p>');
    }
    
    
    
    
    
    
    // // if user is running mozilla then use it's built-in WebSocket
    // window.WebSocket = window.WebSocket || window.MozWebSocket;
    // console.log('Opening websocket..');
    // var connection = new WebSocket('ws://127.0.0.1:8081');
    // connection.onopen = function () {
    //     // connection is opened and ready to use
    //     console.log('Websocket connection is open!!!');
    // };

    // connection.onerror = function (error) {
    //     console.log('Websocket error!!');
    //     // an error occurred when sending/receiving data
    // };

    // connection.onmessage = function (message) {
    //     // try to decode json (I assume that each message from server is json)
    //     try {
    //         var json = JSON.parse(message.data);
    //     } catch (e) {
    //         console.log('This doesn\'t look like a valid JSON: ', message.data);
    //         return;
    //     }
    //     // handle incoming message
    // };
} 

chatCntl.$inject = ['$scope', '$routeParams'];


