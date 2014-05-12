/*global lastRoute:false $:false */
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 
var fs = require('fs');

function isYoutube(line) {
    return line.indexOf('youtube') !== -1;
}

function isVimeo(line) {
    return line.indexOf('vimeo') !== -1;
}

function getYoutubeId(line) {
   var idPos = line.indexOf('watch?v=');
    if (idPos !==-1) return line.slice(idPos + 8, idPos+8+11);
    else console.log('Error: no youtube video id fount!!');
}


function getVimeoId(line) {
   var result = line.match(/vimeo\.com\/video\/([0-9]{1,10})/);
    if (result[1]) return result[1];
   // var idPos = line.indexOf('com/video/');
    // if (idPos !==-1) return line.slice(idPos + 10);
    else console.log('Error: no vimeo video id fount!!');
}


function getData(video, file) {
    var lines = fs.readFileSync(file, 'utf8');
    lines = lines.split('\n');
    var link, title;
    var blurb = [];
    for (var i = 0; i < lines.length; i++) {
        var l = lines[i].replace(/ /g, '');
        if (!link || !video || blurb.length === 0) {
            if (l.length > 0) {
                if (!link) {
                    link = lines[i];   
                    lines[i] = '';
                }
                else {
                    if (!title) {
                        title = lines[i];   
                        lines[i] = '';
                    }
                    else {  blurb.push(lines[i]); }
                }
            }
        } 
        else {
            blurb.push(lines[i]);
            }
    }
    video.provider = isYoutube(link) ? 'youtube' :
        (isVimeo(link) ? 'vimeo' : 'text');
    // if (!video.provider) {
    //     console.log('Error: no provider found!!!');
    //     return null;
    // }
    video.id = isYoutube(link) ? getYoutubeId(link) :
        (isVimeo(link) ? getVimeoId(link) : '' );
    video.title = title;
    video.blurb = blurb.join('\n');
    return video;
    
}

function getVideoPaths(path) {
    var dir = fs.readdirSync(path);
    var paths = [];
    dir.forEach(function(d) {
        var vids = fs.readdirSync(path + '/' +  d);
        // console.log(vids);
        vids.forEach(function(v) {
            paths.push({ section: d, path: path + '/' + d + '/' + v });
        });
    });
    
    return paths;
}

function buildVideosData(path) {
    var videos = [];
    var paths = getVideoPaths(path);
    // console.log(paths);
    paths.forEach(function(p) {
        videos.push(getData(p, p.path));
       }); 
    return videos;
    
}
function go(path, out) {
    var result = buildVideosData(path);
    var str = JSON.stringify(result, null, 2);
    str = 'var videos = ' + str + ';';
    // console.log(str);
    fs.writeFile(out, str, function(err) {
        if (err) {
            console.log("Couldn't save videos.js");
        }
    });
}

exports.go = go;

console.log(process.cwd());
go(process.cwd() + '/../build/editable/resources',
   process.cwd()  + '/../www/js/videos.js');

