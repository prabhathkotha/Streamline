const axios = require('axios')
const fs = require('fs')

let reportCards = {};

/**
 * @returns  An array containing media movie and show streaming platforms, without duplicates.
 */
export async function getPlatforms() {
    const moviePlatforms = await axios({
        method: 'get',
        url: `http://casecomp.konnectrv.io/platform/movie`,
    });
    const showPlatforms = await axios({
        method: 'get',
        url: `http://casecomp.konnectrv.io/platform/show`,
    });
    return [...new Set([...moviePlatforms.data, ...showPlatforms.data])];
}
//const platforms = ['netflix', 'hbo', 'amazon_prime'];

/**
 * @returns  {Object}  An object containing media [movie or show] info for a given platform.
 */
export async function getMediaInfo(mediaType, platform) {
    const response = await axios({
        method: 'get',
        url: `http://casecomp.konnectrv.io/${mediaType}?platform=${platform}`,
    });
    // movies first
    let media = {};      // report card object for aggregate movie data
    let mediaList = response.data;

    // Create the fields for each report card
    media.count = mediaList.length;
    media.avgPopularity = 0;
    media.avgScore = 0;
    media.avgRuntime = 0;
    let avgRuntimeDiscount = 0;
    media.ratingDistr = {};
    media.yearDistr = {};
    media.genres = {};
    media.languages = {};

    for (let entry in mediaList) {
        let id = mediaList[entry].imdb; // get imdb ID and request addtnl data from OMDB
        const imdb_data = await axios({
            method: 'get',
            url: `http://www.omdbapi.com/?apikey=c6f70b0d&i=${id}`,
        });

        // POPULARITY, SCORE, RUNTIME
        media.avgPopularity += mediaList[entry].popularity;  // sum popularities
        media.avgScore += mediaList[entry].vote_average;
        if (imdb_data.data.Runtime == 'N/A')
            avgRuntimeDiscount += 1;
        else
            media.avgRuntime += parseInt(imdb_data.data.Runtime.split(' ')[0]); // grab number of minutes

        // MPAA ratings distrbutions
        // add new rating to the bucket, always increment the count of rating by 1
        let rating = imdb_data.data.Rated;
        if (!media.ratingDistr.hasOwnProperty(rating))
            media.ratingDistr[rating] = 0;
        media.ratingDistr[rating] += 1;

        // year distribution
        let year = imdb_data.data.Year.split('–')[0];
        if (!media.yearDistr.hasOwnProperty(year))
            media.yearDistr[year] = 0;
        media.yearDistr[year] += 1;

        // OMBD genre data formatted as 'Genre1, Genre2, ... GenreN'
        let currGenres = imdb_data.data.Genre.split(", ");
        currGenres.forEach((genre) => {
            if (!media.genres.hasOwnProperty(genre))
                media.genres[genre] = 0;
            media.genres[genre] += 1;
        });
        // OMBD available language data formatted as 'Lang1, Lang2, ... LangN'
        let lang = mediaList[entry].original_language;
        if (!media.languages.hasOwnProperty(lang))
            media.languages[lang] = 0;
        media.languages[lang] += 1;
    }
    // turn the running sums into averages
    media.avgPopularity = media.avgPopularity / mediaList.length;
    media.avgScore = media.avgScore / mediaList.length;
    media.avgRuntime = media.avgRuntime / (mediaList.length - avgRuntimeDiscount);

    return media;
}
export async function getShowInfo(platform) {
    const response = await axios({
        method: 'get',
        url: `http://casecomp.konnectrv.io/show?platform=${platform}`,
    });

    let shows = {};      // report card object for aggregate show data
    let showList = response.data;

    // Create the fields for each report card
    shows.count = showList.length;
    shows.avgPopularity = 0;
    shows.avgScore = 0;
    shows.avgRuntime = 0;
    let avgRuntimeDiscount = 0;
    shows.ratingDistr = {};
    shows.yearDistr = {};
    shows.genres = {};
    shows.languages = {};

    for (let entry in showList) {
        let id = showList[entry].imdb; // get imdb ID and request addtnl data from OMDB
        const imdb_data = await axios({
            method: 'get',
            url: `http://www.omdbapi.com/?apikey=c6f70b0d&i=${id}`,
        });
        // console.log(imdb_data.data);
        console.log(imdb_data.data);
        // POPULARITY, SCORE, RUNTIME
        shows.avgPopularity += showList[entry].popularity;  // sum popularities
        shows.avgScore += showList[entry].vote_average;
        if (imdb_data.data.Runtime == 'N/A')
            avgRuntimeDiscount += 1;
        else
            shows.avgRuntime += parseInt(imdb_data.data.Runtime.split(' ')[0]); // grab number of minutes

        // TV ratings distrbutions
        // add new rating to the bucket, always increment the count of rating by 1
        let rating = imdb_data.data.Rated;
        if (!shows.ratingDistr.hasOwnProperty(rating))
            shows.ratingDistr[rating] = 0;
        shows.ratingDistr[rating] += 1;

        // year distribution
        let year = imdb_data.data.Year.split('–')[0];
        if (!shows.yearDistr.hasOwnProperty(year))
            shows.yearDistr[year] = 0;
        shows.yearDistr[year] += 1;

        // OMBD genre data formatted as 'Genre1, Genre2, ... GenreN'
        let currGenres = imdb_data.data.Genre.split(", ");
        currGenres.forEach((genre) => {
            if (!shows.genres.hasOwnProperty(genre))
                shows.genres[genre] = 0;
            shows.genres[genre] += 1;
        });
        // OMBD available language data formatted as 'Lang1, Lang2, ... LangN'
        let lang = showList[entry].original_language;
        if (!shows.languages.hasOwnProperty(lang))
            shows.languages[lang] = 0;
        shows.languages[lang] += 1;
    }
    // turn the running sums into averages
    shows.avgPopularity = shows.avgPopularity / showList.length;
    shows.avgScore = shows.avgScore / showList.length;
    shows.avgRuntime = shows.avgRuntime / (showList.length - avgRuntimeDiscount);

    return shows;
}
/*
  Report card model:
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
        [x] total count
		[x] average length
		[x] average popularity
        [x] average score (vote_average)
        [ ] average number of seasons
        [x] distribution of ratings
        [x] distribution of pilot year
        [ ] distribution of end year
		[x] number of shows at each TV rating
		[x] number of shows at each genre
		[x] number of shows at each language

 */
export async function requestMovieData() {
    const platforms = await getPlatforms();

    for (const platform of platforms) {   // generate report card for each platform
        reportCards[platform] = {}

        let movieInfo = await getMediaInfo('movie', platform);
        let showInfo = await getMediaInfo('show', platform);
        // let showInfo = await getShowInfo(platforms[i]);

        reportCards[platform].movies = movieInfo;
        reportCards[platform].shows = showInfo;
    }
};
requestMovieData().then(() => {
    fs.writeFile("./reportCards.json", JSON.stringify(reportCards, null, 4), (err) => {
        if (err) {
            console.error(err);
            return;
        };
        console.log("Report Card Generated");
    });
});