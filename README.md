# instagram-photo-picker
Client-side tool for selecting images selected from Instagram.

## Dependencies
* Docker (native of docker-machine)

## Pre-requisites
Currently, instagram-photo-picker assumes you've pulled a series of instagram
post locally. I like using [instagram-screen-scrape](https://github.com/slang800/instagram-screen-scrape)
to pull a JSON feed from an account.

For example:
* `npm i instagram-screen-scrape`
* `./node_modules/instagram-screen-scrape/bin/index.js rhussmann > posts.json`

## Running
* Ensure a `posts.json` file exists in the `app/` folder
* `docker-compose up`
* If running natively
  * `open http://localhost`
* If running through docker-machine
  * `open http://192.168.99.100`
