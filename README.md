Firstdoor
------

My first website using node, angular and bootstrap, built by my own html-builder.

Copied parts of the css and html of other sites to learn how it is
done, as a result a little bit messy here and there, but the site
works.

Clone the repo, and execute ./develop in its directory to work on
it. On save the site gets rebuilt. Edit and read recipe.js to see how
it is put together and to add new bits.

The enduser can edit most of the text himself by linking it up to a
dropbox account (go to /dropbox_authorize and then /dropbox_connect)

When visiting /sync data gets pulled down from the dropbox and the
site rebuilt.

See the build/editable for the files that would need to be in dropbox.

Any new file in resources gets added to the resource page (collection
of videos and text)

At the moment running on nodejitsu: [firstdoor.com.au]()

Inline editing of the text, phantom.js creation of crawlable fragments
and gzipping, merging and minifying of resources are in the works.
