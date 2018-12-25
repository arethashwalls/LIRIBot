//GLOBAL VARIABLES: ****************************************************//
require("dotenv").config();
const keys = require('./keys');
const fs = require('fs');
const [, , liriCommand, ...clArgs] = process.argv;
clArg = clArgs.join(' ');
const axios = require('axios');
var moment = require('moment');
moment().format();
const Spotify = require('node-spotify-api');
//***********************************************************************//

//BANDSINTOWN: **********************************************************//
const searchBandsintown = (band) => {
    return axios.get(`https://rest.bandsintown.com/artists/${band}/events?app_id=codingbootcamp`);
}
const formatBandsintown = (concertData) => {
    const formattedConcerts = '\nUPCOMING CONCERTS:\n---------------------\n' + concertData.data.map(concert => {
        return `Venue: ${concert.venue.name}
        \rLocation: ${concert.venue.city}, ${concert.venue.region} ${concert.venue.country}
        \rDate: ${moment(concert.datetime.split('T')[0], 'YYYY-MM-DD').format('MM/DD/YYYY')}`
        
    }).join('\n---------------------\n') + '\n';
    
    return formattedConcerts;
}
//***********************************************************************//

//SPOTIFY: **************************************************************//
const spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});
//Return a promise from a search, default to The Sign:
const searchSpotify = (song = 'the sign ace of base') => {
    return spotify.search({ type: 'track', query: song });
}
//Format the result of a spotify promise:
const formatSpotify = (songData) => {
    const { 
        artists: [{ name: artist }], 
        name, external_urls: { spotify: preview }, 
        album: { name: album } 
    } = songData.tracks.items[0];
    return `Artist: ${artist}\nTrack title: ${name}\nPreview: ${preview}\nAlbum: ${album}`;
}
//***********************************************************************//

//OMDB: *****************************************************************//
const searchOmdb = (movie = 'mr nobody') => {
    return axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}&type=movie`);
}
const formatOmdb = (movieData) => {
    const {
        Title: title = 'N/A',
        Released: date = 'N/A',
        Ratings: [imdbRating = 'N/A', rtRating = 'N/A', ],
        Country: country = 'N/A',
        Language: language = 'N/A',
        Plot: plot = 'N/A',
        Actors: actors = 'N/A'
    } = movieData.data;
    return `Title: ${title}\nReleased: ${date.split(' ')[2]}\nIMDB Rating: ${imdbRating.Value || 'N/A'}
    \rRotten Tomatoes Rating: ${rtRating.Value || 'N/A'}\nCountry: ${country}\nLanguage: ${language}
    \rPlot: ${plot}Staring: ${actors}`
}
//***********************************************************************//

const searchAndFormat = (searchFunc, formatFunc, arg) => {
    searchFunc(arg)
    .then((response) => {
        console.log( formatFunc(response) );
    })
    .catch(function (err) {
        console.log(err);
    });
}

const lirify = (command, arg) => {
    switch (command) {
        case ('concert-this'): {
            searchAndFormat(searchBandsintown, formatBandsintown, arg);
        }
        case ('spotify-this-song'): {
            searchAndFormat(searchSpotify, formatSpotify, arg);
            break;
        }
        case ('movie-this'): {
            searchAndFormat(searchOmdb, formatOmdb, arg);
            break;
        }
        case ('do-what-it-says'): {
            fs.readFile('./random.txt', 'utf8', (err,data) => {
                if (err) {
                  return console.log(err);
                }
                const [fileCommand, ...fileArgs] = data.split(',');
                fileArg = fileArgs.join(' ');
                lirify(fileCommand, fileArg);
              });
            break;
        }
    }
}

clArg ? lirify(liriCommand, clArg) : lirify(liriCommand);