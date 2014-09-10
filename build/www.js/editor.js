function getCSSRule(ruleName, deleteFlag) {               // Return requested style obejct
    ruleName=ruleName.toLowerCase();                       // Convert test string to lower case.
    if (document.styleSheets) {                            // If browser can play with stylesheets
        for (var i=0; i<document.styleSheets.length; i++) { // For each stylesheet
            var styleSheet=document.styleSheets[i];          // Get the current Stylesheet
            var ii=0;                                        // Initialize subCounter.
            var cssRule=false;                               // Initialize cssRule.
            // console.log(styleSheet);
            do {                                             // For each rule in stylesheet
                // try {
                cssRule=false;                               // Initialize cssRule.
                if (styleSheet.cssRules) {                    // Browser uses cssRules?
                    cssRule = styleSheet.cssRules[ii];         // Yes --Mozilla Style
                } if (styleSheet.rules)  {                                      // Browser usses rules?
                    cssRule = styleSheet.rules[ii];            // Yes IE style.
                }                                             // End IE check.
                    
                // } catch(e) { console.log('my error', e); }
                if (cssRule)  {                               // If we found a rule...
                    // console.log(cssRule.selectorText);
                    if (cssRule.selectorText &&
                        cssRule.selectorText.toLowerCase()==ruleName) { //  match ruleName?
                            if (deleteFlag=='delete') {             // Yes.  Are we deleteing?
                                    if (styleSheet.cssRules) {           // Yes, deleting...
                                            styleSheet.deleteRule(ii);        // Delete rule, Moz Style
                                    } else {                             // Still deleting.
                                            styleSheet.removeRule(ii);        // Delete rule IE style.
                                    }                                    // End IE check.
                                    return true;                         // return true, class deleted.
                            } else {                                // found and not deleting.
                                    return cssRule;                      // return the style object.
                            }                                       // End delete Check
                    }                                          // End found rule name
                }                                             // end found cssRule
                    ii++;                                         // Increment sub-counter
            } while (cssRule)                                // end While loop
        }                                                   // end For loop
    }                                                      // end styleSheet ability check
        return false;                                          // we found NOTHING!
}                                                         // end getCSSRule

function killCSSRule(ruleName) {                          // Delete a CSS rule
    return getCSSRule(ruleName,'delete');                  // just call getCSSRule w/delete flag.
}                                                         // end killCSSRule

function addCSSRule(ruleName) {                           // Create a new css rule
    if (document.styleSheets) {                            // Can browser do styleSheets?
        if (!getCSSRule(ruleName)) {                        // if rule doesn't exist...
            if (document.styleSheets[0].addRule) {           // Browser is IE?
                document.styleSheets[0].addRule(ruleName, null,0);      // Yes, add IE style
            } else {                                         // Browser is IE?
                document.styleSheets[0].insertRule(ruleName+' { }', 0); // Yes, add Moz style.
            }                                                // End browser check
        }                                                   // End already exist check.
        }                                                      // End browser ability check.
    return getCSSRule(ruleName);                           // return rule we just created.
}

myAppModule.factory('editor', function() {
    var signedIn;
    var email;
    var editable = false;
    var $scope;
    var $http;
    var signingIn = false;

    var api =  {
        signin: function() {
            signedIn = true;
            editable = false;
            api.toggleEditable();

        },
        signout: function() {
            console.log('Signing out..');
            Object.keys(CKEDITOR.instances).forEach(function(id) {
                CKEDITOR.instances[id].setData(partials[id].data);
            });
            editable = true;
            api.toggleEditable();
            signedIn = false;
        },
        setEditable: function(value) { editable = value; },
        setEmail: function(value) { email = value; },
        signedIn: function() { return signedIn; },
        email: function(value) { return email; },
        editable: function() { return editable; },
        set: function(scope, http) {
            $scope = scope;
            $http = http;
            $scope.login = function($event) {
                $event.preventDefault();
                console.log('Logging in');
                navigator.id.request();
            };

            $scope.logout = function($event) {
                $event.preventDefault();
                console.log('Logging out');
                navigator.id.logout();
            };
        },
        signingIn : function(value) {
            // console.log('signing in ', value, typeof value);
            if (typeof value !== 'undefined')
                signingIn = value;
            return signingIn;
        }
    };


    function saveFile(fileName, data) {
        if (!fileName) {
            console.log('no filename, so not saving', data);
        }
        console.log('Saving file ' + fileName);
        $http.post('/__api/save?path=' + fileName, data).
            success(function(data, status, headers, config) {
                console.log(data, status, config);
                if (!data.success) {
                    console.log('Failed to save on the server ', data.error);
                    alert('Warning: this file did not save to the server!!');
                    if (data.error === 'Not authorized.')
                        $scope.signedIn = false;
                    
                }
                else {
                    if (data.pathname)
                        location.pathname = data.pathname; 
                    console.log("Success. Data saved to:", fileName, data.pathname);
                }

            }).
            error(function(data, status, headers, config) {
                console.log('Failed to post data!!', data, status, headers, config);
                alert('Warning: this file did not save to the server!!\n' +
                      'Reason:' + data.error || status );
            });

    }

    var partials;

    var regexp = /<!--partial:([^>]*)-->/;
    api.toggleEditable = function() {

        editable = !editable;
        console.log('(***************************************ok then', editable);
        // var meta = getCSSRule('[contenteditable] pre:first-of-type');
        // var meta = getCSSRule('[contenteditable] pre');
        // if (!meta) meta = getCSSRule('#unpublishedWidget, [contenteditable] pre');
        // meta.style.display = editable ? "block" : "none";
        // var unpublishedWidget = getCSSRule('#unpublishedWidget');
        // if (unpublishedWidget) unpublishedWidget.style.display = editable ? "block" : "none";
        var rule = getCSSRule('#unpublishedWidget, [contenteditable] pre');
        if (rule) rule.style.display = editable ? "block" : "none";

        // var metas = document.querySelectorAll('[contenteditable] pre:first-of-type');
        // metas = Array.prototype.slice.apply(metas);
        // var teaserBreaks = document.querySelectorAll('[contenteditable] pre');
        // teaserBreaks = Array.prototype.slice.apply(teaserBreaks);
        // teaserBreaks = teaserBreaks.filter(function(teaserBreak) {
        //     return teaserBreak.innerHTML.indexOf('-----') !== -1;
        // });
        // metas = metas.concat(teaserBreaks);
        // metas.forEach(function(meta) {
        //     if (!editable) {
        //         meta.setAttribute('style', 'display:none;');
        //     }
        //     else {
        //         console.log('setting display:block for editable pre');
        //         meta.setAttribute('style', 'display:block;');
        //         // meta.removeAttribute('style');
        //     }
        // });

        // var unpublishedWidgets = document.querySelectorAll('.widget.unpublished');
        // unpublishedWidgets = Array.prototype.slice.apply(unpublishedWidgets);
        // unpublishedWidgets.forEach(function(widget) {
        //     if (!editable) {
        //         widget.setAttribute('style', 'display:none;');
        //     }
        //     else {
        //         widget.setAttribute('style', 'display:block;');
        //         // widget.removeAttribute('style');
        // }
        // });


        // console.log('editable?', editable);
        if (editable) {
            setTimeout(function() {
                var editables = $('div[contenteditable=true]');
                editables.each(function(e) {
                    CKEDITOR.inline(editables[e],
                                    { on:
                                      { key:
                                        function() {
                                            setTimeout(function() {
                                                $scope.$apply();
                                            },100);
                                        }
                                      }
                                    });

                });
                console.log('+++++++++++++++++++++', CKEDITOR.instances);
                partials = {};
                Object.keys(CKEDITOR.instances).forEach(function(id) {
                    var data = CKEDITOR.instances[id].getData();
                    var fileName = regexp.exec(data);
                    partials[id] = {
                        data: data,
                        fileName: fileName ? fileName[1] : null
                    };
                });

            },10);
        }
        else {
            Object.keys(CKEDITOR.instances).forEach(function(id) {
                CKEDITOR.instances[id].destroy();
            });
        }

    };

    api.printEditable = function() {
        Object.keys(CKEDITOR.instances).forEach(function(id) {
            var data = CKEDITOR.instances[id].getData();
            console.log(data);
        });
        console.log(partials);
    };

    api.isDirty = function() {
        var dirty = Object.keys(CKEDITOR.instances)
            .filter(function(id) {
                return CKEDITOR.instances[id].checkDirty();
            });
        // console.log('isDirty', dirty.length);
        // return dirty.length > 0;
        return true;

    };

    api.saveEditable = function() {
        var result = confirm('Are your sure?\n\nThis will save your changes to the server.');
        if (!result) return;
        console.log('saving editable');
        var count = 0;
        Object.keys(CKEDITOR.instances)
            .filter(function(id) {
                return CKEDITOR.instances[id].checkDirty();
            })
                .forEach(function(id) {
                    console.log('saving ', id);
                    count++;
                    var data = CKEDITOR.instances[id].getData();
                    saveFile(partials[id].fileName, data);
                });
        if (!count) {
            alert("Nothing to save!");
            console.log('Nothing to save!!');
        }

    };

    api.undoEditable = function() {
        var result = confirm('Are your sure?\n\nThis will undo all your edits. Don\'t forget you can also undo per inline block.');
        if (!result) return;
        Object.keys(CKEDITOR.instances).forEach(function(id) {
            CKEDITOR.instances[id].setData(partials[id].data);
        });
        // CKEDITOR.instances['test--'].setData();
    };

    api.locationChanged = function(path) {
        console.log('in editor, location is', path);
        editable = false;
        if (signedIn)
                api.toggleEditable();
    };


    api.newPost = function() {
        console.log('new post')  ;
        var postTitle = prompt('New post title ?');
        var post = "<pre>published: no\n" +
            "title:" + postTitle + "\n" +
            "comments: no</pre>\nWrite post here..";
        $http.post('/__api/new?path=post/' + postTitle + '.html', post).
            success(function(data, status, headers, config) {
                console.log(data, status, config);
                if (!data.success) {
                    console.log('Failed to save on the server ', data.error);
                    alert('Warning: this file did not save to the server!!');
                    if (data.error === 'Not authorized.')
                        $scope.signedIn = false;
                }
                else {
                    console.log("Success. Data saved to:", postTitle);
                    // if (data.pathname) location.pathname = data.pathname;
                    location.pathname = data.pathname || "blog";
                }

            }).
            error(function(data, status, headers, config) {
                console.log('Failed to post data!!', data, status, headers, config);
                alert('Warning: this file did not save to the server!!\n' +
                      'Reason:' + data.error || status );
            });

    };

    api.deletePost = function() {
        var fileName; 
        Object.keys(CKEDITOR.instances)
            .forEach(function(id) {
                // console.log('found post ', id, partials[id].fileName);
                fileName = partials[id].fileName;
            });
        console.log('delete post')  ;
        var deletePost = confirm('Delete post ' + fileName + '?');
        if (!deletePost) return;
        console.log('deleting post ', fileName)  ;
        $http.get('/__api/remove?path=' + fileName).
            success(function(data, status, headers, config) {
                console.log(data, status, config);
                location.pathname = data.pathname || "blog";
                if (!data.success) {
                    console.log('Failed to remove post from the server ', data.error);
                    alert('Warning: this post did not get removed from the server!!');
                    if (data.error === 'Not authorized.')
                        $scope.signedIn = false;
                }
                console.log("Success. Removed:", fileName);

            }).
            error(function(data, status, headers, config) {
                console.log('Failed to post data!!', data, status, headers, config);
                alert('Warning: this file did not get removed from the server!!\n' +
                      'Reason:' + data.error || status );
            });

    };

    api.renderBlog = function() {
        console.log('render blog')  ;

        $http.get('/__api/render').
            success(function(data, status, headers, config) {
                console.log(data, status, config);
                if (!data.success) {
                    console.log('Failed to render blog on the server ', data.error);
                    alert('Warning: rendering failed');
                    if (data.error === 'Not authorized.')
                        $scope.signedIn = false;
                }
                console.log("Success, blog rendered");
                location.pathname = data.pathname || "blog";
            }).
            error(function(data, status, headers, config) {
                console.log('Failed to render blog!!', data, status, headers, config);
                alert('Warning: this file did not save to the server!!\n' +
                      'Reason:' + data.error || status );
            });
    };
    return api;

});
