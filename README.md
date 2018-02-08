# CITIZEN

// CLOUD 9
Once setup project, run like this:
1. Terminal: sass --watch src/scss/app.scss:public/css/main.css, webpack --watch
2. New run configuration: Node.js



// run these 2 commands and wait for the packages to install

npm install

gem install sass


//run these commands to get started

nodemon server.js

webpack --watch

memcached -d

run-mongo


// Run webpack for Prod
webpack --config webpack.config.prod.js


// Heroku - deploy to prod
heroku git:remote citizenly
git push heroku bills:master
http://citizenly.herokuapp.com/




install Heroku toolbelt
wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh


//After a pull request, check if the space name is still ok for the mongo-DB:

app.js, line 14
Marie-Eve: Parse.serverURL = 'https://citizen-marie-evegauthier.c9users.io/parse'
Alex: Parse.serverURL = 'https://citizen-molecularcode.c9users.io/parse'
Osa: 'https://citizen-iblamemymother.c9users.io/parse'

server.js, line 43
Marie-Eve:  serverURL: 'https://citizen-marie-evegauthier.c9users.io/parse' 
Alex: serverURL: 'https://citizen-molecularcode.c9users.io/parse'
Osa: serverURL: 'https://citizen-iblamemymother.c9users.io/parse'