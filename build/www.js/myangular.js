/*global angular:false $:false jQuery:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var myAppModule = angular.module('myApp', ['ngView', 'ui', 'ui.bootstrap'])
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

// angular.module('myModule', [], function($provide) {
//   $provide.factory('notify', ['$window', function(win) {
//     var msgs = [];
//     return function(msg) {
//       msgs.push(msg);
//       if (msgs.length == 3) {
//         win.alert(msgs.join("\n"));
//         msgs = [];
//       }
//     };
//   }]);
// });

myAppModule.factory('mainScope', function() {
  var shinyNewServiceInstance = { a:1 };
    // var msgs = [];
    // return function(msg) {
    //   msgs.push(msg);
    //   if (msgs.length == 3) {
    //     win.alert(msgs.join("\n"));
    //     msgs = [];
    //   }
    // };
  //factory function body that constructs shinyNewServiceInstance
  return shinyNewServiceInstance;
});

var TabsDemoCtrl = function ($scope) {
  $scope.panes = [
    { title:"Dynamic Title 1", content:"Dynamic content 1" },
    { title:"Dynamic Title 2", content:"Dynamic content 2" }
  ];
};

myAppModule.value('ui.config', {
   // The ui-jq directive namespace
   jq: {
      // The Tooltip namespace
      tooltip: {
         // Tooltip options. This object will be used as the defaults
         placement: 'left'
      }
   }
});

function AccordionDemoCtrl($scope) {
  $scope.oneAtATime = true;

  $scope.groups = [
    {
      title: "Dynamic Group Header - 1",
      content: "Dynamic Group Body - 1"
    },
    {
      title: "Dynamic Group Header - 2",
      content: "Dynamic Group Body - 2"
    }
  ];

  $scope.items = ['Item 1', 'Item 2', 'Item 3'];

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };
}

function initScrollToTop() {
    
    jQuery('#bla').click(function(){
        console.log('clicked scroll to top');
        jQuery("html, body").animate({
            scrollTop: 110
        }, 700);
        return false;
    });

    jQuery(window).scroll(function(){
        if (jQuery(this).scrollTop() > 100) {
            jQuery('#scroll-to-top').fadeIn();
        } else {
            jQuery('#scroll-to-top').fadeOut();
        }
    }); 
    
}

function scrollOnClick() {
    
    $(".scroll").click(function(event){
        
        // console.log('click on scroll');
        //prevent the default action for the click event
        event.preventDefault();
        
        //get the full url - like mysitecom/index.htm#home
        var full_url = this.href;
        
        //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
        var parts = full_url.split("#");
        // console.log(parts);
        var trgt = parts[parts.length-1];
        
        if (trgt[0] === '!') return;
        //get the top offset of the target anchor
        var target_offset = $("#"+trgt).offset();
        if (target_offset) {
            var target_top = target_offset.top-50;
            // console.log(target_offset);
            //     //goto that anchor by setting the body scroll top to anchor top
            $('html, body').animate({scrollTop:target_top }, 1000, 'easeOutQuad');
        }
    });
}


function DefaultCntl($scope) {
    console.log('In DefaultCntl');
    // console.log('Targets', $('body').find("#menu-- .nav li > a"));
    initScrollToTop();
    
    //any href with class scroll with smoothly scroll to the #target
    scrollOnClick(); 
    
    //Fix menu, but let it scroll to the top
    var $window = $(window);
    $('.bs-docs-sidenav').affix({
        offset: {
            top: function () { return $window.width() <= 980 ? 210 : 110 }
            // , bottom: 270
            , bottom:0 
        }
    });
    
    //spy on the scrolling body and match data-target in #menu-- 
    $('body').scrollspy({target: '#menu--', offset:60});
    
}


function mainCntl($location, $scope) {
    console.log('in main');
    $scope.isGuideView = function() {
        return $location.$$url === '/guide';
        };
}
