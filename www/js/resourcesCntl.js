/*global lastRoute:false $:false */
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

    // { section: ''
    //   ,title: ''
    //   ,blurb: ''
    //   ,provider: ''
    //   ,id: ''  }Motivation

var sectionToTitleMap = {
    motivation: 'Motivation'
    ,earlychildhood: 'Early Childhood Education and Care (ECEC)'
    ,learningorganisations: 'Learning Organisations'
    ,learning: 'Learning'
    ,leadership: 'Leadership and Management'
    ,general: 'General'
};


console.log('Running..');
var sections = (function() {
    var sections = {};
    videos.forEach(function(v){
        if (!v.section) v.section = 'general';
        if (!sections[v.section]) sections[v.section] = []; 
        sections[v.section].push(v);
    });
    return sections;
    // console.log(tags);
})();


var requestedVimeoThumbnails = {};
function vimeoLoadThumb(index, video_id){    
    if (requestedVimeoThumbnails[video_id]) return '';
    requestedVimeoThumbnails[video_id] = 'requested!';
    
    console.log(index + ' getting video:', video_id);
    $.ajax({
        type:'GET',
        url: 'http://vimeo.com/api/v2/video/' + video_id + '.json',
        jsonp: 'callback',
        dataType: 'jsonp',
        success: function(data){
            var thumbnail_src = data[0].thumbnail_small;
            console.log(thumbnail_src);
            // $('#' + video_id).append('<img src="' + thumbnail_src + '"/>');
            $('#' + video_id).append('<img src="' + thumbnail_src + '"/>');
        }
    });
    return '';
}



function ResourcesCntl($scope, $route, $routeParams, $location) {
    console.log('resource controller');
    
    $scope.page = greendoor[$location.$$path];
    $(".menu li>ul").addClass('hide');
    setTimeout(function() {
        $(".menu li>ul").removeClass('hide');
    },1000);
    
    var url = $location.$$url;
    if (!url) url = "whatever";
    console.log(url);
    // $(".menu #" + url.slice(1)).attr("class", "active");
    
    // $(".menu #" + lastRoute.slice(1)).attr("class", "inactive");
    // lastRoute = $location.$$url;
    
    setActiveTab($location);
    // var newRoute = $location.$$path.slice(1);
    // $(".menu #" + newRoute).attr("class", "active");
    // if (lastRoute !== newRoute)
    //     $(".menu #" + lastRoute).attr("class", "inactive");
    // window.lastRoute = newRoute;
    // console.log('course1 tag', $('#course1'));
    // if (!$location.$$hash)
    //     $('html, body').animate({
    //         scrollTop: 0
    //     }, 1000);
    
    
    requestedVimeoThumbnails = {};

    // var videos = [];
    // videos.push(aVideo);
    // $scope.videos = videos;
    $scope.getSectionTitle = function(section) {
        return sectionToTitleMap[section];
    };
    $scope.vimeoLoadThumb = vimeoLoadThumb;
    // $scope.selectedVideo = videos[0];
    $scope.sectionsList = Object.keys(sections);
    $scope.sections = sections;
    
    $scope.open = function (event, video) {
        $scope.shouldBeOpen = true;
        event.preventDefault();
        console.log(event, video);
        $scope.selectedVideo = video;
    };

    $scope.close = function () {
        $scope.closeMsg = 'I was closed at: ' + new Date();
        $scope.shouldBeOpen = false;
        // event.preventDefault();
    };

    $scope.items = ['item1', 'item2'];

    $scope.opts = {
        backdropFade: true,
        dialogFade:true
    };
    
    
    $scope.$on('$viewContentLoaded', function() {
        
        // $("#videolist").ready(function() {
        
        // jQuery(document).ready(function(){
        //     console.log("View loaded!!!");
        //     var hash = $scope.$location.$$hash;
        //         var target_offset = angular.element("#motivation");
            
        //     console.log('offset: ', target_offset, target_offset.offset());
    
        //     if (target_offset) {
        //             var target_top = target_offset.top;
        //         //goto that anchor by setting the body scroll top to anchor top
        //         console.log("setting scroll top");
        //         // $('html, body').animate({scrollTop:target_top - 30}, 1000, 'easeOutQuad');
        //         $('html, body').scrollTop(target_top - 30);
        //     }
            
            
        // });
    });
    
    
    // $(".scroll").click(function(event){
        
    //     console.log('click on scroll');
    //     //prevent the default action for the click event
    //     event.preventDefault();
        
    //     //get the full url - like mysitecom/index.htm#home
    //     var full_url = this.href;
        
    //     //split the url by # and get the anchor target name - home in mysitecom/index.htm#home
    //     var parts = full_url.split("#");
    //     // console.log(parts);
    //     var trgt = parts[parts.length-1];
        
    //     if (trgt[0] === '!') return;
    //     //get the top offset of the target anchor
    //     var target_offset = $("#"+trgt).offset();
    //     if (target_offset) {
    //         var target_top = target_offset.top-100;
            
    //         //goto that anchor by setting the body scroll top to anchor top
    //         $('html, body').animate({scrollTop:target_top }, 1000, 'easeOutQuad');
    //     }
    // });
    $scope.getHeaderImage = function() {
        // console.log('get image header for:', $location.$$path, $location.$$hash);
        var page = headerImages[$location.$$path];
        if (!page) {
            console.warn("WARNING: header images for page " +
                         $location.$$path + " don't exist");
            return "";
        }
        var imageSrc = page[$location.$$hash] || page["*"];
        // console.log(imageSrc);
        if (!imageSrc)
            console.warn("WARNING: header image for " + $location.$$hash + " doesn't exist");
        // return "images/slides/tab_professional_development.jpg";
        return imageSrc;
    };
    
    $scope.getPageClass = function() {
        var path = $location.$$path;
        if (path) path = path.slice(1);
        console.log(path);
        return 'doorlinks-' + path;
    };
    
    
    $scope.isSelected = function(fullPath) {
        // console.log('index.html#!' + $location.$$url, fullPath);
        if ('index.html#!' + $location.$$url === fullPath) return "selected";
        else return "";
    };
    
    $scope.isShow = function(id) {
        // console.log('id=', id);
        // console.log('hash=', $location.$$hash);
        if ($routeParams.page && $routeParams.page === id) return true;
        else return $location.$$hash === id;
    };
    
    $scope.sent = false;
    Recaptcha.create("6LfL6OASAAAAAM6YHDJmCJ-51zXY1TwCL7pL7vW5",
                     "captchadiv",
                     {
                         // theme: "clean",
                         theme: "red",
                         callback: Recaptcha.focus_response_field
                     }
                    );
    $scope.clicksend = function($event) {
        clickSend($event, $scope);
    }; 
    
} 

var ModalDemoCtrl = function ($scope) {
    console.log('In ModalDemoCntl');
  $scope.open = function () {
    $scope.shouldBeOpen = true;
  };

  $scope.close = function () {
    $scope.closeMsg = 'I was closed at: ' + new Date();
    $scope.shouldBeOpen = false;
  };

  $scope.items = ['item1', 'item2'];

  $scope.opts = {
    backdropFade: true,
    dialogFade:true
  };

};
function DialogDemoCtrl($scope, $dialog){

    // Inlined template for demo
    var t = '<div class="modal-header">'+
        '<h1>This is the title</h1>'+
        '</div>'+
        '<div class="modal-body">'+
        '<p>Enter a value to pass to <code>close</code> as the result: <input ng-model="result" /></p>'+
        '</div>'+
        '<div class="modal-footer">'+
        '<button ng-click="close(result)" class="btn btn-primary" >Close</button>'+
        '</div>';

    $scope.opts = {
        backdrop: true,
        keyboard: true,
        backdropClick: true,
        template:  t, // OR: templateUrl: 'path/to/view.html',
        controller: 'TestDialogController'
    };

    $scope.openDialog = function(){
        var d = $dialog.dialog($scope.opts);
        d.open().then(function(result){
            if(result)
            {
                alert('dialog closed with result: ' + result);
            }
        });
        };

    $scope.openMessageBox = function(){
        var title = 'This is a message box';
        var msg = 'This is the content of the message box';
        var btns = [{result:'cancel', label: 'Cancel'}, {result:'ok', label: 'OK', cssClass: 'btn-primary'}];

        $dialog.messageBox(title, msg, btns)
            .open()
            .then(function(result){
                alert('dialog closed with result: ' + result);
            });
    };
}

// the dialog is injected in the specified controller
function TestDialogController($scope, dialog){
    $scope.close = function(result){
        dialog.close(result);
    };
}


























// function YtCntlb($scope, $route, $routeParams, $location) {
//     console.log('YtController');
//     var yt_videos = ['4r7wHMg5Yjg','txqiwrbYGrs','dMH0bHeiRNg','Z3ZAGBL6UBA','60og9gwKh1o','2K-TICdG1R8','CdD8s0jFJYo','Q5im0Ssyyus','4pXfHLUlZf4'];

//     /*Video height and width*/
//     var yt_height = 419;
//     var yt_width = 766;

//     /*-----DO NOT EDIT BELOW THIS-----*/
//     var yt_html = "";
	
//     for (var num=0, len=yt_videos.length; num<len; ++num){
// 	yt_html = yt_html + "<li><a onclick='change_embeded(\"" + yt_videos[num] + "\")'><img src='http://img.youtube.com/vi/"+yt_videos[num]+"/2.jpg' class='myimage' style='max-height:75px;' /></a></li>";
//     }
	
//     jQuery('#yt_container').html (
//         '<div id="yt_videosurround"><div id="yt_embededvideo"><object width="'+
//             yt_width +'" height="'+ yt_height +'"><param name="movie" value="http://www.youtube.com/v/'+
//             yt_videos[0] +'?version=3&amp;hl=en_US"></param><param name="allowFullScreen" value="true"></param><param name="allowscriptaccess" value="always"></param><embed src="http://www.youtube.com/v/'+
//             yt_videos[0] +
//             '?version=3&amp;hl=en_US" type="application/x-shockwave-flash" width="'+
//             yt_width +'" height="'+ yt_height +
//             '" allowscriptaccess="always" allowfullscreen="true" wmode="transparent"></embed></object></div></div><ul id="mycarousel" class="jcarousel-skin-tango">'+
//             yt_html+'</ul>');
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

