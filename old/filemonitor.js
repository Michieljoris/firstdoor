/*global require:false */
/*jshint strict:false unused:true smarttabs:true eqeqeq:true immed: true undef:true*/
/*jshint maxparams:7 maxcomplexity:7 maxlen:150 devel:true newcap:false*/ 

var filemon = require('filemonitor');

var isLispy = /.*\.ls/;

var sys = require('sys');
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); }

var onFileEvent = function (ev) {
    console.log('file event!!!', ev);
    // var filetype = ev.isDir ? "directory" : "file";
    if (isLispy.test(ev.filename)) {
        console.log('Compiling ' + ev.filename);
        exec("lispy -r " + ev.filename, puts);
        // console.log("Event " + ev.eventId + " was captured for " +
        //             filetype + " " + ev.filename + " on time: " + ev.timestamp.toString());
    }
};



var options = {
    target: "./",
    listeners: {
        modify: onFileEvent
    }
};

filemon.watch(options);
