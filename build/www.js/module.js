/*global Recaptcha:false $:false process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 
//test
// var myAppModule = angular.module('myApp', ['ngView', 'ngSanitize']);

var myAppModule = angular.module('myApp', ['ngView', 'ui.bootstrap'])
    .directive('compile', ['$compile',
                           function($compile) {
                               // directive factory creates a link function
                               return function(scope, element, attrs) {
                                   scope.$watch(
                                       function(scope) {
                                           // watch the 'compile' expression for changes
                                           return scope.$eval(attrs.compile);
                                       },
                                       function(value) {
                                           // when the 'compile' expression changes
                                           // assign it into the current DOM
            
                                           element.html(value);
 
                                           // compile the new DOM and link it to the current
                                           // scope.
                                           // NOTE: we only compile .childNodes so that
                                           // we don't get into infinite loop compiling ourselves
                                           $compile(element.contents())(scope);
                                       }
                                   );
                               };
                               // });
                           }]

              ).value('$anchorScroll', angular.noop);

myAppModule.directive('fixscrollright',
                      ['$window',
                       function($window) {
                           return {
                               restrict: 'E',
                               transclude: true,
                               link: function(scope, el, attrs) {
                                   var window = angular.element($window),
                                   parent = angular.element(el.parent()),
                                   currentOffsetTop = el.offset().top-40;
                                   // console.log('getting offset', currentOffsetTop);
                                   // console.log('getting bottom offset', $('#bottomContainer').offset());
                                   var  origCss = {
                                       position: "static",
                                       width: getParentWidth()
                                   };

                                   handleSnapping();

                                   window.bind('scroll', function() {
                                       handleSnapping();
                                   });

                                   window.bind('resize', function() {
                                       // console.log('resizing');
                                       currentOffsetTop = el.offset().top-40;
                                       el.css({
                                           width: getParentWidth()
                                       });
                                   });

                                   function returnDigit(val) {
                                       var re = /\d+/;
                                       var digit = val.match(re)[0];
                                       return digit;
                                   }

                                   function getParentWidth() {
                                       // return returnDigit(parent.css('width')) - returnDigit(parent.css('padding-left')) - returnDigit(parent.css('padding-right'));
                                       return returnDigit(parent.css('width'));
                                   }

                                   function handleSnapping() {
                                       // console.log(el.offset().top + 450);
                                       var bottom = $('#bottomContainer').offset().top;
                                       var door = el.offset().top + 450;
                                       // var overlapping = door - bottom;
                                       // console.log(overlapping, el.offset().top);
                                       // console.log(bottom, window.height()-450 -40, window.scrollTop() + window.height()-bottom);
          
                                       // console.log(-450 -40 - window.scrollTop() +bottom);
                                       var overlapping = (-450 -60 - window.scrollTop() +bottom);
                                       // console.log(overlapping);
                                       // console.log('getting bottom offset', $('#bottomContainer').offset());
                                       // console.log(window.scrollTop(), currentOffsetTop);
                                       //  if (overlapping >0 || el.offset().top + 450 > 1223) {
                                       //      el.css(origCss);
                                       //      el.css({width: getParentWidth()});
                                       //  }
                                       // else 
                                       //   if (overlapping < 0) {
                                       //       el.css({
                                       //           top: overlapping +40 + "px",
                                       //           position: "fixed",
                                       //           width: getParentWidth()
                                       //           // width: "166px"
                                       //       });
              
                                       //   }
                                       // ese
                                       if (window.scrollTop() > currentOffsetTop ) {
                                           var headerOffsetTop = 40;
                                           el.css({
                                               top: headerOffsetTop + "px",
                                               position: "fixed",
                                               width: getParentWidth()
                                               // width: "166px"
                                           });
                                       } else {
                                           el.css(origCss);
                                           el.css({width: getParentWidth()});
                                       }
                                   }
                               }
                           };
                       }]);

myAppModule.directive('fixscroll',
                      ['$window',
                       function($window) {
                           return {
                               restrict: 'E',
                               transclude: true,
                               link: function(scope, el, attrs) {
                                       var window = angular.element($window),
                                   parent = angular.element(el.parent()),
                                       currentOffsetTop = el.offset().top-40;
                                   // console.log('getting offset', currentOffsetTop);
                                   // console.log('getting bottom offset', $('#bottomContainer').offset());
                                   var  origCss = {
                                       position: "static",
                                       width: getParentWidth()
                                   };

                                   handleSnapping();

                                   window.bind('scroll', function() {
                                       handleSnapping();
                                   });

                                   window.bind('resize', function() {
                                       // console.log('resizing');
                                       currentOffsetTop = el.offset().top-40;
                                       el.css({
                                           width: getParentWidth()
                                       });
                                   });

                                   function returnDigit(val) {
                                       var re = /\d+/;
                                       var digit = val.match(re)[0];
                                       return digit;
                                   }

                                   function getParentWidth() {
                                       // return returnDigit(parent.css('width')) - returnDigit(parent.css('padding-left')) - returnDigit(parent.css('padding-right'));
                                       return returnDigit(parent.css('width'));
                                   }

                                   function handleSnapping() {
                                       // console.log(el.offset().top + 450);
                                       var bottom = $('#bottomContainer').offset().top;
                                       var door = el.offset().top + 450;
                                       // var overlapping = door - bottom;
                                       // console.log(overlapping, el.offset().top);
                                       // console.log(bottom, window.height()-450 -40, window.scrollTop() + window.height()-bottom);
          
                                       // console.log(-450 -40 - window.scrollTop() +bottom);
                                       var overlapping = (-450 -60 - window.scrollTop() +bottom);
                                       // console.log(overlapping);
                                       // console.log('getting bottom offset', $('#bottomContainer').offset());
                                       // console.log(window.scrollTop(), currentOffsetTop);
                                       //  if (overlapping >0 || el.offset().top + 450 > 1223) {
                                       //      el.css(origCss);
                                       //      el.css({width: getParentWidth()});
                                       //  }
                                       // else 
                                       if (overlapping < 0) {
                                           el.css({
                                               top: overlapping +40 + "px",
                                               position: "fixed",
                                               width: getParentWidth()
                                               // width: "166px"
                                           });
              
                                       }
                                       else
                                           if (window.scrollTop() > currentOffsetTop ) {
                                               var headerOffsetTop = 40;
                                               el.css({
                                                   top: headerOffsetTop + "px",
                                                   position: "fixed",
                                                   width: getParentWidth()
                                                   // width: "166px"
                                               });
                                           } else {
                                               el.css(origCss);
                                               el.css({width: getParentWidth()});
                                           }
                                   }
                               }
                           };
                       }]);
// myAppModule.run(function($rootScope, $location, $anchorScroll, $routeParams) {
//   //when the route is changed scroll to the proper element.
//     $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
      
//         // $location.hash($routeParams.scrollTo);
//         // $anchorScroll();  
//         var hash = $location.$$hash;
//         var target_offset = angular.element("#" + hash);
            
//         console.log('offset: ', target_offset, target_offset.offset());
    
//         if (target_offset) {
//             var target_top = target_offset.top;
//             //goto that anchor by setting the body scroll top to anchor top
//             console.log("setting scroll top");
//             setTimeout(function() {
//                 $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
//                 // $('html, body').scrollTop(target_top - 30);
//             }, 1);
//         } 
      
//     });
// });

// myAppModule.directive('myscroll', function($location) {
    
//     return function(scope, element, attrs) {
        
//         // angular.element("body").ready(function() {
//         jQuery(document).ready(function(){
//                 var target_offset = element.offset();
//             console.log('In myscroll', target_offset);
//         });
//         // console.log("in myscroll") ;
//         // var hash = $location.$$hash;
//         // console.log(hash);
//         // setTimeout(function() {
//         //     var target_offset = element.offset();
//         //     console.log('offset: ', target_offset);
//         // }, 1000);
//     };
    
// });

myAppModule.directive('scroll',
                      ['$routeParams', '$location',
                       function($routeParams,$location) {
                           return {
                               restrict: 'A',
                               link: function(scope, element, attrs){ 
                                   // console.log('in scroll', $location.hash());
                                   if ($location.hash() === attrs.id) {
                                       var offsetTop = $('.menubar').offset().top;
                                       setTimeout(function() {
                                           // console.log('in scroll directive', element[0].offsetTop-30);
                                           $('html, body').animate({
                                               // scrollTop: element[0].offsetTop-30
                                               // scrollTop:160
                                               // scrollTop: offsetTop
                                               scrollTop:0
                                           }, 1);
                                           // window.scrollTo(0, element[0].offsetTop-30);
                                       },1);        
                                   }
                               }
                           };
                       }]);

// // declare a new module, and inject the $compileProvider

// angular.module('compile', [], function($compileProvider) {
//   // configure new 'compile' directive by passing a directive
//   // factory function. The factory function injects the '$compile'
//   $compileProvider.directive('compile', function($compile) {
//     // directive factory creates a link function
//     return function(scope, element, attrs) {
//       scope.$watch(
//         function(scope) {
//            // watch the 'compile' expression for changes
//           return scope.$eval(attrs.compile);
//         },
//         function(value) {
//           // when the 'compile' expression changes
//           // assign it into the current DOM
//           element.html(value);
 
//           // compile the new DOM and link it to the current
//           // scope.
//           // NOTE: we only compile .childNodes so that
//           // we don't get into infinite loop compiling ourselves
//           $compile(element.contents())(scope);
//         }
//       );
//     };
//   });// });

// function YtCntl($scope, $route, $routeParams, $location) {
//     var yt_videos = ['4r7wHMg5Yjg','txqiwrbYGrs','dMH0bHeiRNg','Z3ZAGBL6UBA','60og9gwKh1o','2K-TICdG1R8','CdD8s0jFJYo','Q5im0Ssyyus','4pXfHLUlZf4'];

//     /*Video height and width*/
//     var yt_height = 419;
//     var yt_width = 766;

//     /*-----DO NOT EDIT BELOW THIS-----*/
//     var yt_html = "";
	
//     for (var num=0, len=yt_videos.length; num<len; ++num){
// 	yt_html = yt_html + "<li><a onclick='change_embeded(\"" + yt_videos[num] + "\")'><img src='http://img.youtube.com/vi/"+yt_videos[num]+"/2.jpg' class='myimage' style='max-height:75px;' /></a></li>";
//     }
	
//     jQuery('#yt_container').html('<div id="yt_videosurround"><div id="yt_embededvideo"><object width="'+ yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+ yt_videos[0] +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+ yt_videos[0] +'?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+ yt_width +'" height="'+ yt_height +'" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object></div></div><ul id="mycarousel" class="jcarousel-skin-tango">'+yt_html+'</ul>');
//     var embeded_cssObj = {
// 	'width' : yt_width,
// 	'height' : yt_height
//     } 
//     jQuery('#yt_embededvideo').css(embeded_cssObj);
//     jQuery('#yt_videosurround').css(embeded_cssObj);
//     jQuery('#mycarousel').jcarousel({
//     	wrap: 'circular'
//     });
    
//     function change_embeded(video_id){
// 	jQuery('#yt_embededvideo').html('<object width="'+ yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+ video_id +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+ video_id +'?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+ yt_width +'" height="'+ yt_height +'" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object>');
//     }

// }


