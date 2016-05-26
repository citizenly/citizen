# CITIZEN

// run these 2 commands and wait for the packages to install

npm install

gem install sass


//run these 3 commands to get started

node server.js

webpack -watch

sass --watch src/scss/app.scss:public/css/main.css


// SCSS

A class of 'active' is added to a 'Link', such as in the nav menus, when active/clicked. You can use this is style the active links a:active.

// SSH tunnel
ssh -L 8080:api.openparliament.ca:80 molehost@klee.gzkp.net
// heads - you also need to modify cloud9's /etc/hosts file for api.openparliament.ca to go to 127.  Lastly, you connect locally to 8080 not 80.  SSL would be a new tunnel on 443, which is not on this command line example.
// IE: ssh -L 8443:api.openparliament.ca:443 -L 8080:api.openparliament.ca:80 molehost@klee.gzkp.net
// ...should open TWO tunnels - 8443->443 and also 8080->80 