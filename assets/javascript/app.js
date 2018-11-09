$(document).ready(function() {

    var gifs = ["burger", "taco", "chips", "peanut", "mango", "pho", "fries", "hot dog", "rice", "potato", "sushi", "kale", "nacho", "ramen"];

    function renderButtons() {
        //empy "buttons-view"
        $("#buttons-view").empty();

        // for loop dynamically creates buttons
        for (i = 0; i < gifs.length; i++) {
            var newBtn = $("<button>");
            newBtn.attr("type", "button");
            newBtn.attr("data-name", gifs[i]);
            newBtn.addClass("btn");
            newBtn.addClass("btn-primary");
            newBtn.text(gifs[i]);
            $("#buttons-view").append(newBtn);
        }
    }

    function displayGifs() {
        
        //first i build query string
        var url = "https://api.giphy.com/v1/gifs/search?"
        var queryParams = {"api_key":"UkmiIF6YMDUwFA0FkkUP4typsrMEnEz0"};
        queryParams.q = $(this).attr("data-name");
        queryParams.limit = 10;
        var queryURL = url + $.param(queryParams)

        // var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        // item + "&api_key=UkmiIF6YMDUwFA0FkkUP4typsrMEnEz0&limit=10";

        // var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        // item + "&api_key=dc6zaTOxFJmzC&limit=10";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response)
            $("#gif-view").empty();
            var results = response.data;

            const filterRes = results.filter(item => {
                return item.rating != "r"  
            })  

            //same thing as above
            // const filterRes = results.filter(item => item.rating != "r"  )  
            
            console.log(filterRes)

            for (j = 0; j < filterRes.length; j++) {
                var gifDiv = $("<div>");
                gifDiv.addClass("gif-div");

                // Storing the result item's rating
                var rating = filterRes[j].rating;

                // make a paragraph tag with the rating
                var p = $("<p>").text("Rating: " + rating);

                // make an image tag
                var itemGif = $("<img>");

                //add class of image for in click listener
                itemGif.addClass("gif-image");

                // Giving the image tag an src attribute of a proprty pulled off the response
                // add data attributes for playing and pausing
                itemGif.attr("src", filterRes[j].images.fixed_height_small_still.url);
                itemGif.attr("data-still", filterRes[j].images.fixed_height_small_still.url);
                itemGif.attr("data-animate", filterRes[j].images.fixed_height_small.url);
                itemGif.attr("data-state", "still")

                // Appending the paragraph and itemGif we created to the "gifDiv" div we created
                gifDiv.append(p);
                gifDiv.append(itemGif);

                // Prepending the gifDiv to the "#gif-view" div in the HTML
                $("#gif-view").append(gifDiv);
            }
        });


    }

    function playGifs() {
        console.log(this)
         //get the data attributes
        var state = $(this).attr("data-state");
        var still = $(this).attr("data-still");
        var animate = $(this).attr("data-animate");

        //this plays or pauses the gif and up dates "data-state" and "src"
         if (state === 'still') {
          $(this).attr("src", animate);
          $(this).attr("data-state", 'animate'); 
        }
        else if (state === 'animate') {
          $(this).attr("src", still);
          $(this).attr("data-state", 'still');

        }
    }



    //on click Submit new gifs
    $("#add-gif").on("click", function(event) {
        event.preventDefault();
   
        var gif = $("#gif-input").val().trim();
        gifs.push(gif);
        $("#gif-input").val('');

        renderButtons();
    });


    //on click display gifs
    $(document).on("click", ".btn-primary", displayGifs);

    //on click plays/pauses gifs
    $(document).on("click", ".gif-image", playGifs);

    renderButtons();
});