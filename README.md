# LIRIBot
## A CLI application that makes calls to several APIs using Node.js, created for UA Coding Bootcamp.

LIRIBot is a simple JavaScript command-line application that allows users to make calls to three different APIs: [BandsInTown](https://manager.bandsintown.com/support/bandsintown-api), [Spotify](https://developer.spotify.com/documentation/web-api/), and [The Open Movie Database](http://www.omdbapi.com/).

LIRIBot's core functionality can be found in `liri.js`.

### Contents
* A `node_modules`directory will automatically be created on calling `npm install`
* [`videos`](./videos) contains a collection of mp4 videos demonstrating the application's functionality as per the assignment's requirements.
* A `.env` file is included in the original file structure but gitignored; it stores the Spotify API key.
* A `.gitignore` file
* `keys.js` loads the Spotify API key from the `.env` file using [dotenv](https://www.npmjs.com/package/dotenv).
* [`liri.js`](./liri.js) contains the application's core functionality.
* `package-lock.json` and `package.json` are created automatically by [NPM](https://www.npmjs.com/).
* `random.txt` includes commands in txt format to be executed by LIRIBot's `do-what-it-says` command.

### liri.js

`liri.js` begins by loading several global variables:
* `axios`, `moment`, `fs`, and `node-spotify-api` are loaded in from NPM.
* The Spotify API key is loaded from `keys.js`.
* The first command line argument is stored as `liriCommand`.
* All other command line arguments are joined into `clArg`.

Next, for each API two functions are defined, one for calling the API and one for formatting the resultant data. BandsInTown and OMBD are called with [Axios](https://www.npmjs.com/package/axios)
