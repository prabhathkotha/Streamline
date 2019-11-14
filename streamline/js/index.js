$("#start").click(function () {
    $("#survey").css("display", "block");
    $('html,body').animate({
        scrollTop: $("#start").offset().top
    }, 'slow');
});

let popularity = "NA";
$("#blockbuster, #niche").click(function () {
    popularity = $(this).attr("id");
});

let rating = "NA";
$("#child, #parental, #adult").click(function () {
    rating = $(this).attr("id");
});

$("#done").one("click", function () {
    const user_input = {
        type: $("#type").val(),
        duration: $("#duration").val(),
        popularity: popularity,
        decade: $("#decade").val(),
        rating: rating
    };
    recommendPlatform(user_input).then(recommendation => {
        //debug ~~~
        // recommendation = {platform: 'Netflix', suggestions: ['tt0110912', 'tt4633694', 'tt9243946']};

        //display recommended streaming platform
        $('.suggestion-platform').text(recommendation.platform);

        //display movies based on imdb ids in recommendation
        recommendation.suggestions.forEach(function (imdb_id, i) {
            $.get(`http://www.omdbapi.com/?apikey=c6f70b0d&i=${imdb_id}`, function (data) {
                $(`#suggestion-${i + 1}-pic`).attr("src", data.Poster);
                $(`#suggestion-${i + 1}-desc`).text(data.Plot);
            });
        });

        //display and scroll
        $("#suggestions").css("display", "block");
        $('html,body').animate({
            scrollTop: $("#suggestions").offset().top
        }, 'slow');

        //reporting analytic data
        //acceptUserInput(...Object.values(user_input));
        user_input.id = $.get('https://api.ipify.org/')
        console.log(user_input)
        $.post(
            'https://api.airtable.com/v0/appk6FaokTBZoh6nP/main?api_key=keyIuAjkkDzAM4OyC',
            { "fields": user_input }
        );
    });
});