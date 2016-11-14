# CITIZEN

**README FOR DUMMIES** *2016-11-13 version*



**First time set up, step-by-step:**  

*First install these:*

1. Visual studio code (or whichever code editor you like)

2. Xcode
3. Homebrew (and memcached):
`$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`  `$ brew install memcached`  

4. Docker: https://www.docker.com/products/docker#/mac - and once you’ve installed Docker, run this in terminal:   
    `$ docker run --name=mongo --detach -p 27017:27017 --restart=always mongo:3.0`  
    `$ docker exec -ti mongo mongo`  

*Then do this:*

1. Go to https://github.com/citizenly/citizen

2. Click ‘clone or download’ and copy the address `https://github.com/citizenly/citizen.git`

3. Open terminal

4. `cd Documents` *...or wherever else you wish to put the project.*

5. `git clone https://github.com/citizenly/citizen.git`

6. `cd citizen`

7. `npm install`
  *If get error with permissions: *`sudo xcodebuild -license`* (and agree)*

8. `sudo gem install sass`
9. Install a parse server:  
  `$ cd Documents`
  `$ git clone https://github.com/ParsePlatform/parse-server.git`
  `$ cd parse-server`  
  `$ docker build --tag parse-server .`  
  `$ docker run --name my-parse-server --link mongo:mongo parse-server --appId “arbitrary” --masterKey “arbitrary” --databaseURI mongodb://mongo/test`

10. Open a new tab and run `$ memcached -d`  
*This will start a memcached server on port 11211 - you can check if it’s running by running *`$ lsof -i :11211` *and you can stop it by running* `$ killall memcached`
11. `$ cd citizen`
12. Start server and webpack (build frontend code)  
  `$ npm start`  and in a different tab  `$ npm run build:watch`      when you want to rebuild on frontend code changes  
  OR  
  `$ npm run build`  and in a different tab `$ npm run start:watch`  when you want to rebuild on backend code changes  
  OR  
  `$ npm run start:watch`   and in a different tab  `$ npm run build:watch` when you want to rebuild on any code changes

13. Open browser, go to localhost:8080
14. ALL SET. Dandy.



**When starting in the future:**

1. `$ cd citizen`

2. `$ code .`

3. New tab: `$ memcached -d`

4. New tab: start server and webpack (build frontend code)
`$ npm start`  and in a different tab  `$ npm run build:watch`      when you want to rebuild on frontend code changes   
OR  
`$ npm run build`  and in a different tab `$ npm run start:watch`  when you want to rebuild on backend code changes  
OR  
`$ npm run start:watch`   and in a different tab`$ npm run build:watch`      when you want to rebuild on any code changes. 

5. Open browser, go to localhost:8080


*If error: Docker should already be running. If not, check step 9 in step-by-step. You might have to start it up again with* `$ docker run --name my-parse-server --link mongo:mongo parse-server --appId “arbitrary” --masterKey “arbitrary” --databaseURI mongodb://mongo/test`  



**FROM PREVIOUS README, NOT TESTED, DEPLOY STUFF:**

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