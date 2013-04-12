A first implementation of one admin to many chat system.

###How to use:
When the page is loaded for the first time you choose a username to
identify yourself with. Any messages after that are sent to a user
that has named him/herself 'admin'.

The admin can see all the messages entered by all users. Ordinary
users only see their own messages and the ones coming from the admin
user.

When the admin enters a message it goes to everybody, if the admin
wants to address one user in particular he has to prefix the message
with the username followed by a colon (:). So like this:

>  peter:Hello from the admin!!

Eventually to be an admin you will have to enter a password. But for
now there is no authentication yet.

The idea is that you can have the web page open in your
browser/tablet/phone and that it will play a sound if there is
communication from somebody. You can then provide instant and
obligation free advice and help to whoever started typing in this box.

I can disable it if there is no admin logged in so that people don't
sit there waiting for a response.

Also I can make a tab per communication channel, so you can switch from
person to person, and address people directy in their tab without
having to prefix your messages with username:. 



