//GLOBAL VARIABLES: ****************************************************//
require("dotenv").config();
const keys = require('./keys');
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
const formatBandsintown = (concerts) => {
    const formattedConcerts = '\nUPCOMING CONCERTS:\n---------------------\n' + concerts.map(concert => {
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
    return spotify.search({ type: 'track', query: clArg });
}
//Format the result of a spotify promise:
const formatSpotify = (song) => {
    const { 
        artists: [{ name: artist }], 
        name, external_urls: { spotify: preview }, 
        album: { name: album } 
    } = song;
    return `Artist: ${artist}\nTrack title: ${name}\nPreview: ${preview}\nAlbum: ${album}`;
}
//***********************************************************************//




const lirify = (command) => {
    switch (command) {
        case ('concert-this'): {
            searchBandsintown(clArg)
            .then((response) => {
                console.log( formatBandsintown(response.data) );
            })
            break;
        }
        case ('spotify-this-song'): {
            searchSpotify(clArg)
            .then((response) => {
                console.log( formatSpotify(response.tracks.items[0]) );
            })
            break;
        }
        case ('movie-this'): {
            break;
        }
        case ('do-what-it-says'): {
            break;
        }
    }
}



lirify(liriCommand);