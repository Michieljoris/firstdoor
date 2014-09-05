rsync --verbose  --progress --stats --compress --rsh=/usr/bin/ssh --recursive --times --perms --links --delete \
--exclude "*bak" \
--exclude "*~" \
--exclude ".git" \
--exclude "node_modules" \
--exclude "develop-mode" \
--exclude "PORT" \
~/www/sites/firstdoor/ michieljoris@linode:~/www/firstdoor.axion5.net/


# --exclude "build/editable" \









