# CITIZEN

README FOR DUMMIES (WIP. This is the 2016-11-13 version)

First install:

1. Visual studio code (or whichever code editor you like)

2. You would need xcode on your system as well.

3. Install homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"` 
    1. `brew install memcached`  

4. Install Docker: https://www.docker.com/products/docker#/mac once you’ve installed Docker, run this in terminal:   
    1. `docker run --name=mongo --detach -p 27017:27017 --restart=always mongo:3.0`  
    2. `docker exec -ti mongo mongo`  

Step-by-step  

1. go to https://github.com/citizenly/citizen
2. click ‘clone or download’ and copy the address `https://github.com/citizenly/citizen.git`
3. open terminal
4. cd Documents
5. `git clone https://github.com/citizenly/citizen.git`
6. cd citizen
7. npm install
  (IF GET ERROR WITH PERMISSIONS: sudo xcodebuild -license (and agree))
8. sudo gem install sass
9. install a parse server:  

  $ cd Documents
  $ git clone https://github.com/ParsePlatform/parse-server.git

  $ cd parse-server

  $ docker build --tag parse-server .

  $ docker run --name my-parse-server --link mongo:mongo parse-server --appId “arbitrary” --masterKey “arbitrary” --databaseURI mongodb://mongo/test

10. open a new tab and run $ memcached -d

  this will start a memcached server on port 11211 - you can check if it’s running by running lsof -i :11211 you can stop it you can run killall memcached

11. cd citizen

12. start server and webpack (build frontend code)

  $ `npm start`  and in a different tab  $ `npm run build:watch`      when you want to rebuild on frontend code changes

  OR

  $ `npm run build`  and in a different tab $ `npm run start:watch`  when you want to rebuild on backend code changes

  OR

  $ `npm run start:watch`   and in a different tab  $ `npm run build:watch` when you want to rebuild on any code changes

13. open browser, go to localhost:8080



FROM PREVIOUS README, NOT TESTED, DEPLOY STUFF:

// Run webpack for Prod
webpack --config webpack.config.prod.js


// Heroku - deploy to prod
heroku git:remote citizenly
git push heroku bills:master
http://citizenly.herokuapp.com/




install Heroku toolbelt
wget -O- https://toolbelt.heroku.com/install-ubuntu.sh | sh


//After a pull request, check if the space name is still ok fot the mongo-DB:

app.js, line 14
Marie-Eve: Parse.serverURL = 'https://citizen-marie-evegauthier.c9users.io/parse'
Alex: Parse.serverURL = 'https://citizen-molecularcode.c9users.io/parse'
Osa: 'https://citizen-iblamemymother.c9users.io/parse'

server.js, line 43
Marie-Eve:  serverURL: 'https://citizen-marie-evegauthier.c9users.io/parse' 
Alex: serverURL: 'https://citizen-molecularcode.c9users.io/parse'
Osa: serverURL: 'https://citizen-iblamemymother.c9users.io/parse'