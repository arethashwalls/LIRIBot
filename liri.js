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
    if(!concertData.data[0].venue) return '\nArtist not found.\n';
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
    if(songData.tracks.total === 0) return 'Song not found.'
    let songsString = '';
    songData.tracks.items.forEach(song => {
        const { 
            artists: [{ name: artist = 'N/A'}], 
            name = 'N/A', external_urls: { spotify: preview = 'N/A'}, 
            album: { name: album  = 'N/A'} 
        } = song;
        songsString += `\nArtist: ${artist}\nTrack title: ${name}\nPreview: ${preview}\nAlbum: ${album}\n`
    })
    return songsString;
}
//***********************************************************************//

//OMDB: *****************************************************************//
const searchOmdb = (movie = 'mr nobody') => {
    return axios.get(`http://www.omdbapi.com/?apikey=trilogy&t=${movie}&type=movie`);
}
const formatOmdb = (movieData) => {
    if(movieData.data.Response === 'False') return 'Movie not found.'
    const {
        Title: title = 'N/A',
        Released: date = 'N/A',
        Ratings: [imdbRating = 'N/A', rtRating = 'N/A', ],
        Country: country = 'N/A',
        Language: language = 'N/A',
        Plot: plot = 'N/A',
        Actors: actors = 'N/A'
    } = movieData.data;
    return `\nTitle: ${title}\nReleased: ${date.split(' ')[2]}\nIMDB Rating: ${imdbRating.Value || 'N/A'}
    \rRotten Tomatoes Rating: ${rtRating.Value || 'N/A'}\nCountry: ${country}\nLanguage: ${language}
    \rPlot: ${plot}\nStaring: ${actors}\n`
}
//***********************************************************************//

const searchAndFormat = (searchFunc, formatFunc, searchTerm) => {
    searchFunc(searchTerm);
    .then((response) => {
        console.log( formatFunc(response) );
    })
    .catch((err) => {
        console.log(err);
    });
}

const lirify = (command, arg) => {
    switch (command) {
        case ('concert-this'): {
            searchAndFormat(searchBandsintown, formatBandsintown, arg);
            break;
        }
        case ('spotify-this-song'): {
            //modify to deal with unknown songs
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
                if(fileCommand === 'do-what-it-says') {
                    return '\nCannot call do-what-it-says recursively.\n';
                }
                lirify(fileCommand, fileArg);
              });
            break;
        }
        default: {
            return '\nCommand not found.\n'
        }
    }
}

clArg ? lirify(liriCommand, clArg) : lirify(liriCommand);