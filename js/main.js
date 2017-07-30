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
            data: dynamicData,
            contentType: "application/json"
        });
    }

    function testDataattr() {
        var min = $(this).data()['time']['minutes'];
        var sec = $(this).data()['time']['seconds'];
        var ep_id = $(this).data()['ep_id'];

        $.getJSON("episode_links", function(json_data) {
            var url = json_data[ep_id] + '?t=' + min + 'm' + sec + 's';
            console.log(json_data[ep_id] + '?t=' + min + 'm' + sec + 's');

            $("#yes_btn").data("url",url);
        });


        $('#myModal').modal('show')

        //alert('Line id' + $(this).data());
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
                //TODO: CHECK if data is empty    
                var list = $("#quotes_list");
                var i;
                for(i = 0; i < data.length; i++) {

                    var li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.id = data[i]["id"];
                    li.innerHTML = '<blockquote>' + data[i]['line'] + '</blockquote>';


                    var btn = document.createElement('button');
                    btn.typeName = 'button';
                    btn.className = 'btn btn-link icon-button';
                    btn.style = "outline:none;";
                    btn.dataset.time = JSON.stringify(data[i]['time']);
                    btn.dataset.ep_id = data[i]['id'].substring(0,4);

                    var spnIcon = document.createElement('span');
                    spnIcon.title = 'View';
                    spnIcon.className = "glyphicon glyphicon-eye-open";
                    //spnIcon.hidden = 'true';

                    btn.appendChild(spnIcon);

                    var spn = document.createElement('span');

                    spn.appendChild(btn);

                    li.appendChild(spn);
                    btn.onclick = testDataattr;

                    // dynamicItems += '<li class="list-group-item" data-time="'+ data[i]['time'] +'" id="'+ data[i]["id"]+'"><blockquote>' + data[i]['line'] + '</blockquote>Season: ' +
                    //     data[i]['season']['number'] + ' Episode: ' + data[i]['episode']['number'] + ' Time: ' + data[i]['time']['minutes'] + 'm ' + data[i]['time']['seconds']+'s' +
                    //     '<br><span><button type="button" class="btn btn-link icon-button" style="outline:none;" >' +
                    //     '<span title="View" aria-hidden="true" class="glyphicon glyphicon-eye-open"></span></button></span></li>'

                    list[0].appendChild(li);
                }



                //list.html(dynamicItems);

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
