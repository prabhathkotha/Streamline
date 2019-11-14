$("#start").click(function () {
    $("#survey").css("display", "block");
    $('html,body').animate({
        scrollTop: $("#start").offset().top
    },'slow');
});

let popularity = "";
$("#blockbuster, #niche").click(function() {
     popularity = $(this).attr("id");
});

let rating = "";
$("#child, #parental, #adult").click(function() {
    rating = $(this).attr("id");
});

$("#done").click(function() {
    let recommendation = recommendPlatform(
        $("#type").val(),
        $("#duration").val(),
        popularity,
        $("#decade").val(),
        rating
    );

    //debug ~~~
    recommendation = {platform: 'Netflix', suggestions: ['tt0110912', 'tt4633694', 'tt9243946']};
    
    //display recommended streaming platform
    $('.suggestion-platform').text(recommendation.platform);

    //display movies based on imdb ids in recommendation
    recommendation.suggestions.forEach(function(imdb_id, i) {
        $.get(`http://www.omdbapi.com/?apikey=c6f70b0d&i=${imdb_id}`, function(data) {
            $(`#suggestion-${i+1}-pic`).attr("src", data.Poster);
            $(`#suggestion-${i+1}-desc`).text(data.Plot);
        });
    });

    //display and scroll
    $("#suggestions").css("display", "block");
    $('html,body').animate({
        scrollTop: $("#suggestions").offset().top
    },'slow');
});