const express = require('express');
const bodyParser = require('body-parser');
const SpotifyWebApi = require('spotify-web-api-node');
const dotenv = require('dotenv');

// this one loads client id and secret from env ;0
dotenv.config();

const app = express();
const port = 3000;
1
// SpotifyWebApi instance with the credentials loaded from the .env file.
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

// Obtain an access token
spotifyApi.clientCredentialsGrant().then(
    (data) => spotifyApi.setAccessToken(data.body['access_token']),
    (err) => console.error('Failed to retrieve access token', err)
);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes, it server the html file when user visits the homepage
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));


// this one accepts a post request with the user's search query and uses the Spotify API's searchTracks method to search for tracks.
// And it sends back the list of tracks as a JSON response, ok?
app.post('/search', (req, res) => {
    const query = req.body.query;
    spotifyApi.searchTracks(query).then(
        (data) => res.json(data.body.tracks.items),
        (err) => res.status(500).send('Error fetching data from Spotify')
    );
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
