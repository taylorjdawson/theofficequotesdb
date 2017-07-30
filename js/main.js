/**
 * Created by tjdaw on 7/29/2017.
 */


// IIFE - Immediately Invoked Function Expression
(function(yourcode) {

    // The global jQuery object is passed as a parameter
    yourcode(window.jQuery, window, document);

}(function($, window, document) {

    // The $ is now locally scoped

    // Listen for the jQuery ready event on the document
    $(function() {

        console.log('The DOM is ready');

        // The DOM is ready!

    });

    console.log('The DOM may not be ready');

    function search(text) {
        var dynamicData = {};
        dynamicData["search"] = text;
        return $.ajax({
            url: "http://localhost:9220/",
            type: "get",
            data: dynamicData
        });
    }

    $("#search_text").keyup(function(event){
        if(event.keyCode === 13){
            $("#search_button").click();
        }
    });

    $("#search_button").click(function() {

        var searchText = $('#search_text').val();

        console.log(searchText);

        search(searchText).done(function(data) {
            // Updates the UI based the ajax result
            
        });

        // // Dynamically building an unordered list from an array
        // var localArr = ["Greg", "Peter", "Kyle", "Danny", "Mark"],
        //     list = $("#quotes_list"),
        //     dynamicItems = "";
        //
        // $.each(localArr, function(index, value) {
        //
        //     dynamicItems += "<li id=" + index + ">" + value + "</li>";
        //
        // });
        //
        // list.append(dynamicItems);

    });

}));
