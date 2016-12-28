# instagram-photo-picker
Web app for creating collages from your Instagram photos.

## Dependencies
* Docker (I use [docker toolbox](https://www.docker.com/products/docker-toolbox) on Mac)
* [Graphicsmagick](http://www.graphicsmagick.org/), (I install through homebrew)
* [nodejs](https://nodejs.org/en/), (again, I use homebrew to install)

## Pre-requisites
* You'll need an alias for the docker-machine IP on your machine. I use `photopicker.local`
* On OSX
  * `sudo emacs /etc/hosts`
  * Add a line like the following to the file
  * `192.168.99.100  photopicker.local`
  * You should now be able to ping `photopicker.local`
* Copy the config file:
  * `cp src/config.sample.json src/config.json`
  * Populate `config.json` with appropriate configuration fields (Instagram app configuration, express session secret, etc.)

## Running
### To run the node app locally (faster development cycles)
This configuration runs nginx in a docker container to serve static assets, and
forwards requests to `/api` to the node application running locally. The node
application uses `nodemon` to reload the application when changes are detected
to the source files.

To run in this configuration:
```
cd src
npm i
cd ..
./scripts/dev.sh
```
Go to [http://photopicker.local:8080](http://photopicker.local:8080)

### To run mimicking production configuration
This configuration runs both nginx and the node app server in docker containers.
The source files are copied into the container during the first step, so changes
to source files will requires rebuilding and relaunching the docker containers
to take effect. This configuration is not good for fast iterative development,
but closely reflects the deployed configuration.

To run in this configuration:
```
docker-compose build
./scripts/run.sh
```

Go to [http://photopicker.local:8080](http://photopicker.local:8080)

## Help!
### I'm getting a blank page / I see a 404 for `/login` in the console!
Try visiting [http://photopicker.local:8080/api/logout](http://photopicker.local:8080/api/logout)

This is a stupid issue Ricky needs to fix (and not redirect to `/login` on missing sessions, like the sample code he pasted did).
