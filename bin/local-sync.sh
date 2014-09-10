rsync --verbose  --progress --stats --compress --rsh=/usr/bin/ssh --recursive --times --perms --links --delete \
--exclude "*bak" \
--exclude "*~" \
--exclude ".git" \
--exclude "develop-mode" \
--exclude "PORT" \
--exclude "node_modules" \
~/www/sites/firstdoor/ ~/www/firstdoor-live/









