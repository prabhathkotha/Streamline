
const recommendPlatform = async function(type, duration, popularity, decade, rating) {
    /** type:movie v. show
     *      0 to 100
     *  - duration: show length
     *      0 to 100 
     *  - popularity:
     *      blockbuster v niche
     *  - decade: 
     *      0 to 100
     *  - rating:
     *      child, parental, adult
     * 
    */
    //TODO
    // do some magic here
    // return streaming provider and three imdb ids to display
        // { platform: 'netflix', suggestions: ['imdbid_a', 'imdbid_b', 'imdbid_c'] }
        // movie vs show:
        // show duration preference:
        // popularity preference (movie or show importance)
        // age of movies:
        // ratings:
    /** request report_cards */
    let report_card = await $.get('../report_card/reportCards.json', (data) => {}, 'json');
    console.log(report_card);
    let score = {};
    let maxShow = 0;
    let maxMovie = 0;
    for(let i in report_card) {
        if( report_card[i].movies.avgPopularity > maxMovie)
            maxMovie = report_card[i].movies.avgPopularity;
        if(report_card[i].shows.avgPopularity > maxShow)
            maxShow = report_card[i].shows.avgPopularity;    
    }
    for(let i in report_card) {
        let provider = i;
        // let provider = report_card[i];
        // console.log(i);
        score[provider] = 0;
        score[provider] += 0.2 * ((report_card[i].movies.avgPopularity / maxMovie) * (1 - type/100) 
                                + (report_card[i].shows.avgPopularity / maxShow) * (type/100));
                                
        // runtime needs to be broken into buckets. for now, they are similar so all get full marks
        score[provider] += 0.2
        // ratio of movies within past year
        let newMovies = report_card[i].movies.yearDistr['2019'] / report_card[i].movies.count;
        let newShows = report_card[i].shows.yearDistr['2019'] / report_card[i].shows.count;
        newMovies = newMovies != NaN ? newMovies : 0; // in case a service has 0 new content
        newShows = newShows != NaN ? newShows : 0; // in case a service has 0 new movies
        let weightedNewness = (newMovies * (1 - type/100)) + (newShows * (type/100));
        score[provider] += 0.2 * ( 1 - Math.abs(weightedNewness  - (decade / 100) )); // percentage closeness to newness preference
        
    }
    let match = '';
    let matchScore = 0;
    console.log("Scorecard: ")
    console.log(score);
    for(let x in score) {
        if (score[x] > matchScore) {
            match = x;
            matchScore = score[x];
        }
    }
    let media = $.get(
        `https://casecomp.konnectrv.io/${type < 50 ? 'show' : 'movie'}?platform=${match}`,
    );

    let returner = media.then(movies => {
        // console.log(movies);
        return {'platform': match, suggestions: [movies[0].imdb, movies[1].imdb, movies[2].imdb]};
    });
    return await returner;
};