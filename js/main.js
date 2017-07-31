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

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    function search(text) {
        var dynamicData = {};
        dynamicData["search"] = text;
        return $.ajax({
            url: "http://localhost:9220/",
            type: "get",
            data: dynamicData,
            contentType: "application/json"
        });
    }

    //TODO: Change name
    function testDataattr() {
        var min = $(this).data()['time']['minutes'];
        var sec = $(this).data()['time']['seconds'];
        var ep_id = $(this).data()['ep_id'];

        $.getJSON("episode_links", function(json_data) {
            var url = json_data[ep_id] + '?t=' + min + 'm' + sec + 's';
            console.log(json_data[ep_id] + '?t=' + min + 'm' + sec + 's');

            $("#yes_btn").data("url",url);
        });

        //TODO: Change name
        $('#myModal').modal('show')

        //alert('Line id' + $(this).data());
    }

    function launch_feedback_modal() {
        $('#feedbackModal').modal('show')
    }

    $("#yes_btn").click(function () {
        $('#myModal').modal('hide');
       var url = $(this).data("url").toString();
        window.open(url);
    });

    $("#search_text").keyup(function(event) {
        if(event.keyCode === 13) {
            $("#search_button").click();
        }
    });

    $("#search_button").click(function() {



        var search_box = $('#search_text');
        var searchText = search_box.val();

        var myNode = document.getElementById('quotes_list');
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        search(searchText)

            .success(function(data) {

                if(!isEmpty(data)){

                    $('#no_results').hide();

                    var list = $("#quotes_list");
                    var i;
                    for(i = 0; i < data.length; i++) {

                        var li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.id = data[i]["id"];
                        li.innerHTML = '<blockquote>' + data[i]['line'] + '</blockquote>';


                        var btn_view = document.createElement('button');
                        btn_view.typeName = 'button';
                        btn_view.className = 'btn btn-link icon-button';
                        btn_view.style = "outline:none;";
                        btn_view.dataset.time = JSON.stringify(data[i]['time']);
                        btn_view.dataset.ep_id = data[i]['id'].substring(0,4);

                        var btn_feedback = btn_view.cloneNode(true);
                        btn_feedback.className = 'btn btn-link icon-button pull-right';

                        var spn_icon_view = document.createElement('span');
                        spn_icon_view.title = 'View';
                        spn_icon_view.className = "glyphicon glyphicon-eye-open";

                        var spn_icon_feedback = document.createElement('span');
                        spn_icon_feedback.title = 'Feedback';
                        spn_icon_feedback.className = "glyphicon glyphicon-info-sign";

                        btn_view.appendChild(spn_icon_view);
                        btn_feedback.appendChild(spn_icon_feedback);

                        var spn = document.createElement('span');

                        // spn.appendChild(btn_view);

                        li.appendChild(btn_view);
                        li.appendChild(btn_feedback);

                        btn_view.onclick = testDataattr;
                        btn_feedback.onclick = launch_feedback_modal;

                    // <button type="button" class="btn btn-link icon-button pull-right" style="outline:none;" >
                    //         <span title="Feedback" aria-hidden="true" class="glyphicon glyphicon-info-sign"></span>
                    //         </button>

                        list[0].appendChild(li);
                    }
                } else {
                    var div = document.createElement('div');
                    div.innerHTML = 'No results for: "' + searchText + '"';
                    div.className = "text-center";
                    $('#quotes_list')[0].appendChild(div);
                    console.log('no results');
                }
            })

            .fail(function(jqXhr) {
                alert('There was a problem with the request. Status: ' + jqXhr.status);
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
