/*global EpicEditor:false $:false angular:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:6 maxcomplexity:10 maxlen:190 devel:true*/

angular.module('ngView', [], function($routeProvider, $locationProvider) {
    
    var baseDir = '/built/';
    var mapping = [
        ['home', '/built/view-home.html', HomeCntl],
        ['aboutus', '/build/markdown/aboutus.md'],
        ['pd', '/built/view-pd.html'],
        ['resources', '/build/markdown/resources.md'],
        ['courses', '/built/view-courses.html'],
        ['quiz', '/build/markdown/quiz.md'],
        ['blog', '/build/markdown/blog.md'],
        ['epic', '/built/view-epic.html', EpicCntl]

    ];
    
    mapping.forEach(function(m) {
        $routeProvider.when('/' + m[0], { 
            templateUrl: '//' + document.location.host + m[1], controller: m[2] ? m[2] : DefaultCntl });
    });
    
    $routeProvider.otherwise( { 
        templateUrl: '//' + document.location.host +
            '/built/view-home.html', controller: HomeCntl });
    
    $locationProvider.html5Mode(false);
    // console.log($locationProvider.hashPrefix());
    $locationProvider.hashPrefix( '!');
    // console.log($locationProvider.hashPrefix());
});
 

//Controllers
function MainCntl($scope, $route, $routeParams, $location) {
    console.log('Main controller..');
    console.log('location', $location);
    console.log('route', $route);
    console.log('params', $routeParams);
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
}
 
function DefaultCntl($scope, $routeParams) {
    console.log('default controller..');
  $scope.name = "BookCntl";
  $scope.params = $routeParams;
}

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
 
function HomeCntl($scope, $routeParams) {
    console.log('Home controller..');
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
    
    $scope.name = "ChapterCntl";
    $scope.params = $routeParams;
}