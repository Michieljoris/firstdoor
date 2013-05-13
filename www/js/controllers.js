
/*global Recaptcha:false $:false process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

// var myAppModule = angular.module('myApp', ['ngView', 'ngSanitize']);

var myAppModule = angular.module('myApp', ['ngView', 'ui.bootstrap'])
    .directive('compile', function($compile) {
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
  }).value('$anchorScroll', angular.noop);

myAppModule.directive('cart', function($window) {
  return {
    restrict: 'E',
    transclude: true,
    link: function(scope, el, attrs) {
      var window = angular.element($window),
          parent = angular.element(el.parent()),
          currentOffsetTop = el.offset().top-40;
          origCss = {
            position: "static",
            width: getParentWidth()
          };

      handleSnapping();

      window.bind('scroll', function() {
        handleSnapping();
      });

      window.bind('resize', function() {
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
        if (window.scrollTop() > currentOffsetTop) {
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
});
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

myAppModule.directive('scroll', function($routeParams,$location) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs){ 
      // console.log('in scroll', $location.hash());
        if ($location.hash() === attrs.id) {
            
          setTimeout(function() {
              $('html, body').animate({
                  scrollTop: element[0].offsetTop-30
              }, 1000);
             // window.scrollTo(0, element[0].offsetTop-30);
          },1);        
        }
    }
  };
});

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




//Controllers
function MainCntl($scope, $route, $routeParams, $location, $anchorScroll) {
    console.log('Main controller..');
    $anchorScroll();
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

var lastRoute='whatever';
function DefaultCntl($scope, $routeParams, $location, $anchorScroll) {
    console.log('default controller..');
    // $scope.name = "BookCntl";
    // $scope.params = $routeParams;
    // console.log($location);
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    
    
    console.log($location);
    var url = $location.$$url;
    if (!url) url = "whatever";
    console.log(url);
    var newRoute = $location.$$path.slice(1);
    $(".menu #" + newRoute).attr("class", "active");
    if (lastRoute !== newRoute)
        $(".menu #" + lastRoute).attr("class", "inactive");
    lastRoute = newRoute;
    console.log('course1 tag', $('#course1'));
    if (!$location.$$hash)
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    // setTimeout(function(){
    //     $anchorScroll(hash);
    // },100);
    
    
    $(function() {
        $('#da-slider').cslider({
            autoplay	: true
            ,interval: 10000
        });
    });
    
    
    $scope.isShow = function(id) {
        // console.log('id=', id);
        // console.log('hash=', $location.$$hash);
        return $location.$$hash === id;
    };
    
    
}

function contactusCntl($scope, $routeParams, $location) {
    // $scope.result = "now it is working..";
    Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
    "captchadiv",
    {
      // theme: "clean",
      theme: "red",
      callback: Recaptcha.focus_response_field
    }
  );
    console.log('contactus');
    var url = $location.$$url;
    if (!url) url = "whatever";
    console.log(url);
    $(".menu #" + url.slice(1)).attr("class", "active");
    
    $(".menu #" + lastRoute.slice(1)).attr("class", "inactive");
    lastRoute = $location.$$url;
    $('#send').bind('click', function() {
        var username=$('#username').val(), email=$('#email').val();
        var textmessage=$('#textmessage').val();
        // var recaptcha_response_field = $("#recaptcha_response_field").val();
        // var recaptcha_response_field = Recaptcha.get_response();
        console.log("From the form:", username, email, textmessage, Recaptcha.get_response());
        // console.log(JSON.stringify($("#loginForm").serializeObject()));

        $.ajax({
            url: "/contactus_form",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username:username,
                                   email:email,
                                   textmessage:textmessage,
                                   recaptcha_response: Recaptcha.get_response(),
                                   recaptcha_challenge: Recaptcha.get_challenge()}),
            // data:'balbalbla',
            success: function (data, textStatus, jqXHR) {
                Recaptcha.reload();
                data = JSON.parse(data);
                console.log('Form result:', data);
                // $scope.result = 
                if (data.success) $scope.result = "Message sent!!!";
                
                else $scope.result = "Message not sent: " + data.error;
                $scope.$apply();
                
                // do something with your data here.
            },
            error: function (jqXHR, textStatus, errorThrown) {
                Recaptcha.reload();
                console.log('error', arguments);
                // likewise do something with your error here.
            }
        });
  
  
        return false; // Prevent form submit.
    });
    
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
 
function HomeCntl($scope, $routeParams, $location) {
    
    console.log('Home controller..');
    
    var url = $location.$$url;
    if (!url) url = "whatever";
    console.log(url);
    
    var newRoute = $location.$$path.slice(1);
    if (!newRoute) newRoute = 'home';
    console.log('Path is:', $location.$$path);
    $(".menu #" + newRoute).attr("class", "active");
    if (lastRoute !== newRoute)
        $(".menu #" + lastRoute).attr("class", "inactive");
    lastRoute = newRoute;
    console.log('course1 tag', $('#course1'));
    if (!$location.$$hash)
        $('html, body').animate({
            scrollTop: 0
        }, 1000);
    
    $('.flexslider').flexslider({
        // animation: "slide",
        easing: 'easeInOutQuad',
        slideshow:true,
        controlNav: false,
        directionNav: false,
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


