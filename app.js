require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get("/", (req, res, next)=>{
    res.render("home")
})




app.get('/artist-search', (req, res) => {
    spotifyApi
  .searchArtists(req.query.artist)
  .then(artistsArray => {

    // console.log('The received data from the API: ', artistsArray.body.artists.items);

    const data = {
        artists: artistsArray.body.artists.items
    }
    res.render('artist-search-results', data);
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    artistId = req.params.artistId;
    spotifyApi.getArtistAlbums(artistId)
    .then(function(albumsData) {
       
        //   console.log('******** ******** Artist albums', data);
          res.render('albums', {albumsData});
        },
        function(err) {
          console.error(err);
        }
      );
  });

  app.get('/tracks/:tracksId', (req, res, next) => {
    // .getArtistAlbums() code goes here
    tracksId = req.params.tracksId;
    spotifyApi.getAlbumTracks(tracksId)
    .then(function(tracksData) {
       
          console.log('******** ******** Tracks data ', tracksData.body.items[0].preview_url);
          res.render('tracks', {tracksData});
        },
        function(err) {
          console.error(err);
        }
      );
  });



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
