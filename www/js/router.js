/*global EpicCntl:false HomeCntl:false DefaultCntl:false EpicEditor:false $:false angular:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:6 maxcomplexity:10 maxlen:190 devel:true*/

angular.module('ngView', [], function($routeProvider, $locationProvider) {
    
    var baseDir = '/built/';
    var mapping =
        [
            ["home", "/built/view-home.html", HomeCntl]
,["aboutus", "/built/view-aboutus.html"]
,["pd", "/built/view-pd.html"]
,["resources", "/built/view-resources.html", ResourcesCntl]
,["courses", "/built/view-courses.html"]
,["quiz", "/built/view-quiz.html"]
,["blog", "/built/view-quiz.html"]
,["epic", "/built/view-epic.html", EpicCntl]
,["chat", "/built/view-chat.html", chatCntl]
,["filebrowser", "/built/view-filebrowser.html", filebrowserCntl]
,["contactus", "/built/view-contactus.html", contactusCntl]
,["enrol", "/built/view-enroll.html"]

            // ['home', '/built/view-home.html', HomeCntl],
            // ['aboutus', '/build/markdown/aboutus.md'],
            // ['pd', '/built/view-pd.html'],
            // ['resources', '/build/markdown/resources.md'],
            // ['courses', '/built/view-courses.html'],
            // ['quiz', '/build/markdown/quiz.md'],
            // ['blog', '/build/markdown/blog.md'],
            // ['epic', '/built/view-epic.html', EpicCntl]

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
 

