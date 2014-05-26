var forever = require('forever-monitor');

var child = new (forever.Monitor)('server/server.js', {
    // max: 3,
    silent: false
    ,'watch': true              // Value indicating if we should watch files.
    ,'watchIgnoreDotFiles': null // Dot files we should read to ignore ('.foreverignore', etc).
    ,'watchIgnorePatterns': null // Ignore patterns to use when watching files.
    ,'watchDirectory': "server/"      // Top-level directory to watch from.
    ,options: []
});

child.on('exit', function () {
    console.log('your-filename.js has exited after 3 restarts');
});

child.start();