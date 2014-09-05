/*global EpicCntl:false HomeCntl:false DefaultCntl:false EpicEditor:false $:false angular:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:6 maxcomplexity:10 maxlen:190 devel:true*/

angular.module('ngView', [],
               ['$routeProvider', '$locationProvider',
                function($routeProvider, $locationProvider) {
    
                    var baseDir = '/built/';
                    var mapping =
                        [
                            inserthere
                            // ['home', '/built/view-home.html', HomeCntl],
                            // ['aboutus', '/build/markdown/aboutus.md'],
                            // ['pd', '/built/view-pd.html'],
                            // ['resources', '/build/markdown/resources.md'],
                            // ['courses', '/built/view-courses.html'],
                            // ['quiz', '/build/markdown/quiz.md'],
                            // ['blog', '/build/markdown/blog.md'],
                            // ['epic', '/built/view-epic.html', EpicCntl]

                        ];
                    $routeProvider.when('/blog/post/:post', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("/blog/post/" + route.post  + '.html');
                        },
                        controller: DefaultCntl });
                    $routeProvider.when('/blog/unpublished/:post', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("/blog/unpublished/" + route.post  + '.html');
                        },
                        controller: DefaultCntl });
                    
                    $routeProvider.when('/blog/landing/:page', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("/blog/landing/" + route.page + '/index.html');
                        },
                        controller: DefaultCntl });
                    
                    $routeProvider.when('/blog/tag/:tag', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("/blog/tag/" + route.tag + '/index.html');
                        },
                        controller: DefaultCntl });
                    $routeProvider.when('/blog/tag/:tag/:page', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("/blog/tag/" + route.tag + 
                                        '/' + route.page + '/index.html');
                        },
                        controller: DefaultCntl });
                    
                    $routeProvider.when('/blog/archive/:year', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("blog/archive/" + route.year + '/index.html');
                        },
                        controller: DefaultCntl });
                    $routeProvider.when('/blog/archive/:year/:page', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("blog/archive/" + route.year +
                                        '/' + route.page + '/index.html');
                        },
                        controller: DefaultCntl });
                    $routeProvider.when('/blog/archive/:year/:month', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("blog/archive/" + route.year + '/' +
                                        route.month + '/index.html');
                        },
                        controller: DefaultCntl });
                    $routeProvider.when('/blog/archive/:year/:month/:page', {
                        templateUrl: function(route) {
                            console.log('----------------------', arguments);
                            return '//' + document.location.host + '/' +
                                cachify("blog/archive/" + route.year + '/' +
                                        route.month + 
                                        '/' + route.page + '/index.html');
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
 

