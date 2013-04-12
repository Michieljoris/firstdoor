/*global $:false jQuery:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function filebrowserCntl($scope, $routeParams) {
    console.log('filebrowser controller');
    
    var pathArray = [];

    jQuery('#getroot').click(function(event){
        console.log('Clicked get root', event);
        pathArray = [];
        pathArray.push('/build');
        getUrl('content', pathArray);
        return false;
    });

    function getUrl(id, pathArray) {
        var path = pathArray.join('');

        $.ajax({
            url: path,
            type: "GET",
            contentType: "text/plain",
            success: function (data, status, req) {
                console.log('REQ:', req);
                $('#' + id).html(data);
                if (data.indexOf('<!doctype html>') === 0) {
                    console.log('Downloaded html doc');
                    data = data.slice(data.indexOf('h1') -1);
                    $('#' + id + ' a').click(function(event){
                        console.log('link clicked!!!!', event.target.pathname);
                        pathArray.push(event.target.pathname);
                        console.log(pathArray);
                        getUrl(id, pathArray);
                        return false;
                    });
                
                }
                // do something with your data here.
            },
            error: function () {
                console.log('error', arguments);
                // likewise do something with your error here.
            }
        });
    
    }
} 