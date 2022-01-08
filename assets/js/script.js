// base url for api calls
var theMovieDbUrl = "https://api.themoviedb.org/3/"; 
// api key pulled from config file
var theMovieDbApiKey = config.theMovieDbApiKey;

// placeholder for data that will be pulled from getConfigInfo
// poster urls are -- imgBaseUrl/posterSize/[poster_path]
let imgBaseUrl = null;
let configData = null;
let posterSize = null;

// get configuration data from TMDB api
var getConfigInfo = function() {
    fetch('https://api.themoviedb.org/3/configuration?api_key=' + theMovieDbApiKey)
    .then(function(response) {
        response.json()
        .then(function(data) {
            // imgBaseUrl is the start of the url for all movie posters
            imgBaseUrl = data.images.secure_base_url;
            // config data is all the relevant information for constructing those urls
            configData = data.images;
            // poster_sizes is an array of sizes, must define a size in url
            posterSize = data.images.poster_sizes[1];
        })
    })
};

// get the config data after document loads
document.addEventListener('DOMContentLoaded', getConfigInfo);

// grabbing buttons from html
let top10Btn = document.querySelector('#top10Btn');
let myFavBtn = document.querySelector('#myFav');
let genreSelBtn = document.querySelector('#genreSel');
let runTimeBtn = document.querySelector('#runTime');

// event listener to pull trending movies
top10Btn.addEventListener('click', function() {
    getTopTen();
});

// https://api.themoviedb.org/3/trending/all/day?api_key=<<api_key>>
// fetch movie data from TMDB API
var getTopTen = function() {
    // url pulls top 20 trending movies/shows for the day
    fetch(`${theMovieDbUrl}trending/all/day?api_key=${theMovieDbApiKey}`)
    .then(function(response) {
        response.json()
        .then(function(data) {
            // data.results is the array of results
            let results = data.results;
            console.log(results);
            // loop through results array
            for (let i = 0; i < 9; i++) {
                // pull id for each index
                let id = results[i].id;
                // pull media type for each index (movie/tv show)
                let mediaType = results[i].media_type;
                // for each item, pull full entry from tmdb (to get url for poster)
                fetch(`${theMovieDbUrl}${mediaType}/${id}?api_key=${theMovieDbApiKey}`)
                .then(function(response) {
                    response.json()
                    .then(function(data) {
                        console.log(data);
                        // end of url for the poster
                        let posterPath = data.poster_path;
                        // full url for poster
                        let fullUrl = `${imgBaseUrl}/${posterSize}/${posterPath}`
                        // grab img element from html
                        let imgBlock = document.querySelector(`#movie${i+1}`);
                        // set src attribute of imgBlock to full poster url
                        imgBlock.setAttribute('src', fullUrl);
                    })
                })
            }
        })
    })
};

// TODO: Update top ten for movie && | show -- Colin
// TODO: On click, show synopsis of movie or show -- use modal -- dismiss on click or swipe -- up for grabs!

// TODO: Add button to movie results/posters for local storage, cueing save to watchlist -- up for grabs!

// TODO: Gene selector -- using genre ids filter choices: let them choose from list using if() statement -- Claire

// TODO: Keyword search can filter request using Search, Discover, or Keyword API; clear input after submit -- Omar

// TODO: Jake and Omar on CSS :)