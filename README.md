# CITIZEN

// CLOUD 9

// run these 2 commands and wait for the packages to install
npm install
gem install sass


//run these commands to get started
nodemon server.js
webpack --watch
memcached -d
run-mongo

Once setup project, run like this:
1. Terminal: sass --watch src/scss/app.scss:public/css/main.css, webpack --watch
2. New run configuration: Node.js



**README FOR DUMMIES** *2016-11-17 version*
// LOCAL ENVIRONMENT

**First time set up, step-by-step:**  

*First install these:*

1. Visual studio code (or whichever code editor you like)

2. Xcode (for Mac users)

3. Homebrew (and memcached):  
$`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`  
$`brew install memcached`  

4. Docker: https://www.docker.com/products/docker#/mac - and once you’ve installed Docker, run this in terminal:   
    $`docker run --name=mongo --detach -p 27017:27017 --restart=always mongo:3.0`  
    $`docker exec -ti mongo mongo`  *...If this step doesn’t work right now, don’t worry. Check that you don’t have any other projects running and go ahead with the ‘then do this’ steps below. *

*Then do this:*

1. Go to https://github.com/citizenly/citizen

2. Click ‘clone or download’ and copy the address https://github.com/citizenly/citizen.git

3. Open terminal

4. `cd Documents` *...or wherever else you wish to put the project.*

5. `git clone https://github.com/citizenly/citizen.git`

6. `cd citizen`

7. `npm install`
  *If get error with permissions: *`sudo xcodebuild -license`* (and agree)*

8. `sudo gem install sass`
9. Install a parse server:  
  $`cd Documents`*...or wherever you put the project in step 4.*
  $`git clone https://github.com/ParsePlatform/parse-server.git`
  $`cd parse-server`  
  $`docker build --tag parse-server .`  *...don't forget the dot, and if you see lots of red on the screen don't panic, as long as it says 'npm something' its all good.*
  $`docker run --name my-parse-server --link mongo:mongo parse-server --appId “arbitrary” --masterKey “arbitrary” --databaseURI mongodb://mongo/test`

10. Open a new tab and run  
$`memcached -d`
*This will start a memcached server on port 11211 - you can check if it’s running with *`$ lsof -i :11211` *and you can stop it by running* `$ killall memcached`
11. $`cd citizen` *...again, or wherever you put the project in step 4.*
12. Start server and webpack (build frontend code)  
  $`npm start`  and in a different tab  $`npm run build:watch`      when you want to rebuild on frontend code changes  
  OR  
  $`npm run build`  and in a different tab $`npm run start:watch`  when you want to rebuild on backend code changes  
  OR  
  $`npm run start:watch`   and in a different tab  $`npm run build:watch` when you want to rebuild on any code changes.

13. Open your browser, go to localhost:8080
14. ALL SET. Dandy.



**When starting in the future:**

1. $`cd citizen`

2. $`code .`*...this is a shortcut to opening up your project in your code editor. If you haven't set this up yet, google "code . visual studio code."*

3. New tab: $`memcached -d`

4. New tab: start server and webpack (build frontend code)
$`npm start`  and in a different tab  $`npm run build:watch`      when you want to rebuild on frontend code changes   
OR  
$`npm run build`  and in a different tab $`npm run start:watch`  when you want to rebuild on backend code changes  
OR  
$`npm run start:watch`   and in a different tab $`npm run build:watch` when you want to rebuild on any code changes. 

5. Open browser, go to localhost:8080


*If you get an error in the above:  Docker should already be running. If not, check step 9 in step-by-step. You might have to start it up again with* `$ docker run --name my-parse-server --link mongo:mongo parse-server --appId “arbitrary” --masterKey “arbitrary” --databaseURI mongodb://mongo/test`
*If that doesn't work, try opening docker from your finder/applications (on mac) and once it's open click the docker icon at the top bar menu. Check so it says 'running' and see if localhost:8080 works now.  
If not, go back to the docker menu, click preferences>uninstall/reset>reset to factory settings and...*
    $`docker run --name=mongo --detach -p 27017:27017 --restart=always mongo:3.0`  
    $`docker exec -ti mongo mongo`  
Works? Yes? Sweet. No? Contact us at asaisacson@gmail.com



**FROM PREVIOUS README, NOT TESTED, DEPLOY STUFF:**

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
