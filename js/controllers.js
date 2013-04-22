
/*global $:false process:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

// var myAppModule = angular.module('myApp', ['ngView', 'ngSanitize']);
var myAppModule = angular.module('myApp', ['ngView'])
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
//   });
// });



//Controllers
function MainCntl($scope, $route, $routeParams, $location) {
    console.log('Main controller..');
    console.log('location', $location);
    console.log('route', $route);
    console.log('params', $routeParams);
    $scope.$route = $route;
    $scope.$location = $location;
    $scope.$routeParams = $routeParams;
    
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
 
function DefaultCntl($scope, $routeParams) {
    console.log('default controller..');
    $scope.name = "BookCntl";
    $scope.params = $routeParams;
    // console.log('course1 tag', $('#course1'));
    
    // var hash = $scope.$location.$$hash;
    // $scope.hash = hash;
    // console.log(hash);
    // console.log($scope.$location);
    // var target_offset = $("#"+hash).offset();
    // // var target_offset;
    // console.log(hash, target_offset);
    // if (target_offset) {
    //     var target_top = target_offset.top;
    //     //goto that anchor by setting the body scroll top to anchor top
    //     $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
    // }
    $(function() {
        $('#da-slider').cslider({
            autoplay	: true
            ,interval: 10000
        });
    });
    
    
}

function contactusCntl($scope, $routeParams) {
    $('#login').bind('click', function() {
        var user=$('#user').val(), pwd=$('#pass').val();
        console.log(user, pwd);
        // console.log(JSON.stringify($("#loginForm").serializeObject()));

        $.ajax({
            url: "/contactus_form",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ user: user, pwd:pwd}),
            // data:'balbalbla',
            success: function (data, textStatus, jqXHR) {
               console.log(arguments);
                // do something with your data here.
            },
            error: function (jqXHR, textStatus, errorThrown) {
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
 
function HomeCntl($scope, $routeParams) {
    console.log('Home controller..');
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

