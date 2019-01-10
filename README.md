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

Next, for each API two functions are defined, one for calling the API and one for formatting the resultant data. BandsInTown and OMBD are called with [Axios](https://www.npmjs.com/package/axios) while Spotify is called with its own [API library](https://www.npmjs.com/package/node-spotify-api).

Once a call and format function has been defined for each API, I define a more abstract `searchAndFormat` function that takes a call function, a format function, and a search term as arguments.

I then define a `lirify` function composed of a switch statement with a case for each command.
* `concert-this` calls BandsInTown and returns a list of all upcoming concerts by the given artist.
* `spotify-this-song` calls Spotify and returns information on all Spotify tracks with the given title.
* `movie-this` calls OMBD and returns information on a movie with the given title.
* `do-what-it-says` reads `random.txt` and calls `lirify` with the command and argument given.

Finally, I call the `lirify` function with `clArg` if it exists and without it if not.
