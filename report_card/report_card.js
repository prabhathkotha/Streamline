const axios = require('axios')
const fs = require('fs')
/**
 * This function should use axios to make a GET request to the following url:
 *   https://comp426fa19.cs.unc.edu/a08/heroes
 *
 * The axios request should be "await"ed, and once the response is available,
 *   the body of the HTTP response (which is in JSON format) should be returned
 *   as a JavaScript Object.
 *
 * @returns  {Object}  The body of the HTTP response.
 */
let reportCards = {};
const platforms = ['netflix', 'hbo', 'amazon_prime']
/*
 *  Report card model:
 
 
    - each platform has a movie and show object
    - movies: 
        [x] total count
		[x] average length
        [x] average popularity
        [x] average score (vote_average)
        [x] distribution of MPAA ratings
        [x] distribution of release year
		[x] number of movies at each genre
        [x] number of movies at each language
    - shows:
        - total count
		- average length
		- average popularity
        - average score (vote_average)
        - average number of seasons
        - distribution of ratings
        - distribution of pilot year
        - distribution of end year
		- number of shows at each TV rating
		- number of shows at each genre
		- number of movies at each language

 */
export async function requestMovieData() {
    for(let i in platforms) {   // generate report card for each platform
        const response = await axios({
            method: 'get',
            url: `http://casecomp.konnectrv.io/movie?platform=${platforms[i]}`,
        });

        reportCards[platforms[i]] = {
         'shows': {}   
        }
        // movies first
        let movies = {}      // report card object for aggregate movie data
        let movieList = response.data;

        // Create the fields for each report card
        movies.count = movieList.length;
        movies.avgPopularity = 0;
        movies.avgScore = 0;
        movies.avgRuntime = 0;
        movies.ratingDistr = {};
        movies.yearDistr = {};
        movies.genres = {};
        movies.languages = {};
        
        for( let entry in movieList) {
            let id = movieList[entry].imdb; // get imdb ID and request addtnl data from OMDB
            const imdb_data = await axios({
                method: 'get',
                url: `http://www.omdbapi.com/?apikey=c6f70b0d&i=${id}`,
            });

            // POPULARITY, SCORE, RUNTIME
            movies.avgPopularity += movieList[entry].popularity;  // sum popularities
            movies.avgScore += movieList[entry].vote_average;
            movies.avgRuntime += parseInt(imdb_data.data.Runtime.split(' ')[0]); // grab number of 

            // MPAA ratings distrbutions
            // add new rating to the bucket, always increment the count of rating by 1
            let rating = movieList[entry].rating;
            if(!movies.ratingDistr.hasOwnProperty(rating))
                movies.ratingDistr[rating] = 0;
            movies.ratingDistr[rating] += 1;
            
            // year distribution
            let year = imdb_data.data.Year;
            if(!movies.yearDistr.hasOwnProperty(year))
                movies.yearDistr[year] = 0;
            movies.yearDistr[year] += 1;

            // OMBD genre data formatted as 'Genre1, Genre2, ... GenreN'
            let currGenres = imdb_data.data.Genre.split(", ");
            currGenres.forEach((genre) => {
                if(!movies.genres.hasOwnProperty(genre))
                    movies.genres[genre] = 0;
                movies.genres[genre] += 1;
            });
            // OMBD available language data formatted as 'Lang1, Lang2, ... LangN'
            let lang = movieList[entry].original_language;
            if(!movies.languages.hasOwnProperty(lang))
                movies.languages[lang] = 0;
            movies.languages[lang] += 1;
        }
        // turn the running sums into averages
        movies.avgPopularity = movies.avgPopularity / movieList.length;
        movies.avgScore = movies.avgScore / movieList.length;
        movies.avgRuntime = movies.avgRuntime / movieList.length;
        reportCards[platforms[i]].movies = movies;
    }    
};
requestMovieData().then(() => {
    fs.writeFile("./reportCards.json", JSON.stringify(reportCards, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("File has been created");
    });
    // console.log(reportCard);
});
//console.log(reportCards);