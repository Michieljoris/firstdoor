/*global EpicCntl:false HomeCntl:false DefaultCntl:false EpicEditor:false $:false angular:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:6 maxcomplexity:10 maxlen:190 devel:true*/

angular.module('ngView', [],
               ['$routeProvider', '$locationProvider',
                function($routeProvider, $locationProvider) {
    
                    var baseDir = '/built/';
                    var mapping =
                        [
                            ["home", cachify("/built/view-home.html"), HomeCntl]
,["aboutus", cachify("/built/view-aboutus.html")]
,["pd", cachify("/built/view-pd.html")]
,["resources", cachify("/built/view-resources.html"), ResourcesCntl]
,["courses", cachify("/built/view-courses.html")]
,["quiz", cachify("/built/view-quiz.html")]
,["epic", cachify("/built/view-epic.html"), EpicCntl]
,["chat", cachify("/built/view-chat.html"), chatCntl]
,["filebrowser", cachify("/built/view-filebrowser.html"), filebrowserCntl]
,["contactus", cachify("/built/view-contactus.html"), contactusCntl]
,["enrol", cachify("/built/view-enroll.html")]
,["apprenticeship", cachify("/built/view-apprenticeship.html")]
,["blog", cachify("/built/view-blog.html")]
,["sitemap", cachify("/sitemap.html")]

                            // ['home', '/built/view-home.html', HomeCntl],
                            // ['aboutus', '/build/markdown/aboutus.md'],
                            // ['pd', '/built/view-pd.html'],
                            // ['resources', '/build/markdown/resources.md'],
                            // ['courses', '/built/view-courses.html'],
                            // ['quiz', '/build/markdown/quiz.md'],
                            // ['blog', '/build/markdown/blog.md'],
                            // ['epic', '/built/view-epic.html', EpicCntl]

                        ];
                        $routeProvider.when('/blog/:key',
                                            // { templateUrl: '//' + document.location.host + '/' + 'blog',
                                            { templateUrl: function() {
                                                console.log('----------------------', arguments);
                                                
                                             return '//' + document.location.host + '/' +
                                                    cachify("/built/view-blog.html");
                                            },
                                              controller: DefaultCntl });
    
                    mapping.forEach(function(m) {
                        var route ='/' + m[0];
                        if (m[1].indexOf('/') === 0) m[1] = m[1].slice(1);
                        $routeProvider.when(route,
                                            { templateUrl: '//' + document.location.host + '/' + m[1],
                                              controller: m[2] ? m[2] : DefaultCntl });
                        route ='/' + m[0] + '/:section';
                        $routeProvider.when(route,
                                            { templateUrl: '//' + document.location.host + '/' + m[1],
                                              controller: m[2] ? m[2] : DefaultCntl });
                    });
                    
    
                    $routeProvider.otherwise( { 
                        templateUrl: '//' + document.location.host +
                            cachify('/built/view-home.html'), controller: HomeCntl });
    
                    $locationProvider.html5Mode(true);
                    // console.log($locationProvider.hashPrefix());
                    $locationProvider.hashPrefix( '!');
                    // console.log($locationProvider.hashPrefix());
                }]);
 

