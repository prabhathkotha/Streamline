const getStreamingProvider = function(type, duration, popularity, decade, rating) {
    //TODO
    // do some magic here
    // return streaming provider and three imdb ids to display
        // { provider: 'netflix', suggestions: ['imdbid_a', 'imdbid_b', 'imdbid_c'] }
}

$("#start").click(function () {
    $("#survey").css("display", "block");
    $('html,body').animate({
        scrollTop: $("#start").offset().top
    },'slow');
});

let popularity = "";
$("#blockbuster").click(function() {
     popularity = "blockbuster";
});
$("#niche").click(function() {
    popularity = "niche";
});
let rating = "";
$("#child").click(function() {
    rating = "child";
});
$("#parental").click(function() {
    rating = "parental";
});
$("#adult").click(function() {
    rating = "adult";
});

let stream_service = "";

$("#done").click(function() {
    let recommendation = getStreamingProvider(
        $("#type").val(),
        $("#duration").val(),
        popularity,
        $("#decade").val(),
        rating
    );

    //display movies based on imdb ids in recommendation
    recommendation = [] //debugging. remove this line. ---------
    recommendation.forEach(function(imdb_id, i) {
        let image_url = null;//TODO get url using omdb and imdb_id
        let image_desc = null;//TODO get desc using omdb and imdb_id
        $(`#suggestion-${i+1}-pic`).attr("src", image_url);
        $(`#suggestion-${i+1}-desc`).text("src", image_desc);
    });
    
    stream_service = recommendation.provider;

    //display and scroll
    $("#suggestions").css("display", "block");
    $('html,body').animate({
        scrollTop: $("#suggestions").offset().top
    },'slow');
});

// After user selects a movie, display service