/*global $:false jQuery:false require:false exports:false*/
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

function filebrowserCntl($scope, $routeParams, $http) {
    console.log('filebrowser controller');
    
    var path = $scope.path = (function() {
        var api = {};
        var pathArray = [];
        var fileName = '';
        
        api.set = function(aPathArray) {
            pathArray = [];
            aPathArray = aPathArray || [];
            aPathArray.forEach(function(p) {
                api.add(p);
            });
        };
        
        api.full = function () {
            return api.dir() + api.file();
        };
        
        
        api.dir = function() {
            return pathArray.join('');
        };

        api.file = function() {
            return fileName;
        };

        api.getPathToDir = function(index) {
            
            return pathArray[index];
        };
        
        api.add = function(name) {
            if (name[0] === '/')  name = name.slice(1);
            if (name[name.length-1] !== '/') fileName = name;
            else {
                pathArray.push(name);   
                fileName = '';
            }
            return api.full();
        };
        
        // api.setLength = function(length) {
        //     pathArray.length = length;
        // };
        
        api.till = function(n) {
            pathArray.length = n + 1;
            return pathArray.join('');
        };
        
        api.dirs = function() {
            return pathArray;
        };
        
        return api;
    })();
    
    $scope.getRoot = function() {
        console.log('Clicked get root');
        path.set();
        get('/build/');
    };
    
    // var test = '<ol><li><a ng-click="hello($event)" href="markdown/">markdown/</a></li></ol>';
    $scope.request = function(event) {
        event.preventDefault();
        var name = event.target.pathname;
        console.log('path:', event.target.pathname);
        get(name);
    };
    
    function setFileList(data) {
        var startOfList = data.indexOf('<ol>');
        if (startOfList === -1) startOfList = data.indexOf('<ul>');
        if (startOfList !== -1) {
            data = data.slice(startOfList);
            data = data.replace(/<a/g,'<a ng-click="request($event)"');
            $scope.fileList = data;
            return true;
        }
        else {
            alert('No list found in fetched dir listing!!');
            console.log(data);
            return false;
        }
    } 
    
    function endsWith(str, trail) {
        return (str.substr(str.length-trail.length, str.length-1) === trail);
    }

    function setFileContent(fileName, data) {
        console.log(fileName);
        var isMarkdown = endsWith(fileName, '.md') || endsWith(fileName, '.markdown') || endsWith(fileName, '.mdown');
        var isHtml = endsWith(fileName, '.html') || endsWith(fileName, '.htm');
        var isJs = endsWith(fileName, '.js');
        if (isMarkdown || isJs || isHtml ) {
            if (fileName[0] === '/') fileName = fileName.slice(1);
            editor.importFile(fileName,data);
            $scope.fileName = fileName;
        }
    }
    
    $scope.getPathTill = function(index) {
        console.log(index, path.till(index));
        $http({method: 'GET', url: path.till(index)}).
            success(function(data, status, headers, config) {
                // if (setFileList(data)) path.setLength(index);
                setFileList(data);
            }).
            error(function(data, status, headers, config) {
                console.log('Failed', status);
                alert('Failed to get listing.');
            });
        
    };
    
    function get(name){
        $http({method: 'GET', url: path.dir() + name}).
            success(function(data, status, headers, config) {
                path.add(name);
                if (path.file()) {
                    $scope.fileContent = data;
                    setFileContent(name, data);
                } else { 
                    setFileList(data);
                }
            }).
            error(function(data, status, headers, config) {
                console.log('Failed', status);
                alert('Failed getting listing or file');
            });
        
        
    }

    get('/build/');
    
    
    console.log('epiceditor in fb');
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
    // window.test = editor;
    
    // editor.importFile('test',str);
    
    // function getUrl(id, pathArray) {
    //     var path = pathArray.join('');

    //     $.ajax({
    //         url: path,
    //         type: "GET",
    //         contentType: "text/plain",
    //         success: function (data, status, req) {
    //             console.log('REQ:', req);
    //             $('#' + id).html(data);
    //             if (data.indexOf('<!doctype html>') === 0) {
    //                 console.log('Downloaded html doc');
    //                 data = data.slice(data.indexOf('h1') -1);
    //                 $('#' + id + ' a').click(function(event){
    //                     console.log('link clicked!!!!', event.target.pathname);
    //                     pathArray.push(event.target.pathname);
    //                     console.log(pathArray);
    //                     getUrl(id, pathArray);
    //                     return false;
    //                 });
                
    //             }
    //             // do something with your data here.
    //         },
    //         error: function () {
    //             console.log('error', arguments);
    //             // likewise do something with your error here.
    //         }
    //     });
    // 
    // }
} 