/**
 * @author  reetsee.com
 * @date    20160624
 */
var fs = require('fs');

function Watcher() {
    this.fileExists = false;

    this.fileExistsAction = function(onceTimeout) {
        var thisWatcher = this;
        thisWatcher.fileExists = true;

        setTimeout(function() {
            if (fs.existsSync(thisWatcher.path)) {
                var fileStats = fs.statSync(thisWatcher.path);
                if (String(thisWatcher.lastMtime) != String(fileStats.mtime)) {
                    console.log(
                        'File ' + thisWatcher.path + ' changed, last mtime=' 
                            + thisWatcher.lastMtime + ', mtime=' + fileStats.mtime
                    );

                    thisWatcher.lastMtime = fileStats.mtime;
                    fs.readFile(thisWatcher.path, 'utf8', function(err, data) {
                        thisWatcher.fileExistsAction();
                        if (err) {
                            console.log(err);
                            return;
                        }

                        thisWatcher.onRead(data);
                    });
                } else {
                    thisWatcher.fileExistsAction();
                }

            } else {
                console.log('File ' + thisWatcher.path + ' deleted');

                thisWatcher.lastMtime = null;
                thisWatcher.fileNotExistsAction();
            }
        }, onceTimeout || thisWatcher.options.interval || 5007);
    };

    this.fileNotExistsAction = function() {
        var thisWatcher = this;
        thisWatcher.fileExists = false;

        setTimeout(function() {
            if (fs.existsSync(thisWatcher.path)) {
                console.log('File ' + thisWatcher.path + ' created');

                thisWatcher.fileExistsAction(0);
            } else {
                thisWatcher.fileNotExistsAction();
            }
        }, thisWatcher.options.interval || 5007);
    };

    this.init = function(path, onRead, options) {
        this.path = path;
        this.onRead = onRead;
        this.options = options || {};

        if (fs.existsSync(this.path)) {
            this.fileExistsAction(0);
        } else {
            this.fileNotExistsAction();
        }
    };
}
exports.Watcher = Watcher;
