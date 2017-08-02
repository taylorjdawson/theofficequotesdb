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


    //Test whether or not a JSON object is empty
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    //Issues an http request to search server
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

    function createGitIssue(issue_type, issue_text, line_id, line) {
        var dynamicData = {};

        dynamicData["issue_type"] = encodeURIComponent(issue_type);
        dynamicData["issue_text"] = encodeURIComponent(issue_text);
        dynamicData["line_id"] = encodeURIComponent(line_id);
        dynamicData["line"] = encodeURIComponent(line);
        $.ajax({
            url: "http://localhost:9220/",
            type: "post",
            data: dynamicData,
            contentType: "application/json"
        })
            .success(function () {
                var feedbackModal = $('#feedbackModal');
                feedbackModal.find('.modal-header .modal-title').html("Result");
                feedbackModal.find('.modal-body').html("Your report has been submitted.")
                $('#feedback-form').remove();
            })

            //TODO: Add modal error message
            .error(function(jqXhr) {
            alert('There was a problem sending report. Status: ' + jqXhr.status);
        });
    }

    function viewQuoteVideo() {
        var min = $(this).data()['time']['minutes'];
        var sec = $(this).data()['time']['seconds'];
        var ep_id = $(this).data()['ep_id'];

        $.getJSON("episode_links", function(json_data) {
            var url = json_data[ep_id] + '?t=' + min + 'm' + sec + 's';
            console.log(json_data[ep_id] + '?t=' + min + 'm' + sec + 's');

            $("#leaveSiteModalYesBtn").data("url",url);
        });

        $('#leaveSiteModal').modal('show')
    }

    function launchFeedbackModal() {
        var id = $(this).data()['id'];
        var line = $('#'+id).find('blockquote:first-child').text();

        //Attach the data to the feedback modal's report button
        $("#feedbackModalReportBtn").data({"id": id, "line": line});
        $('#feedbackModal').modal('show')
    }

    $("#leaveSiteModalYesBtn").click(function () {
        $('#leaveSiteModal').modal('hide');
       var url = $(this).data("url").toString();
        window.open(url);
    });

    //TODO: Check for empty form
    //TODO: Since it is a form maybe change it to 'submit' (possibly seek out internet justification)

    // Function handels when the report button is pressed
    $('#feedbackModalReportBtn').click(function () {
        var feedback_modal_selector = $('#feedback-modal-selector');
        var issue_type = feedback_modal_selector.find('option:selected').text();
        var message_text = $('#feedback-modal-message-text').val();
        var line_id = $(this).data('id').toString();

        //TODO: Fix line it is coming back as undefined
        var line = $(this).data('line').toString();

        createGitIssue(issue_type, message_text, line_id, line);

        console.log(line);

        $('#feedback-form')[0].reset();
        feedback_modal_selector.selectpicker('refresh');
    });


    //TODO: reuse more code (best practices)
    $('#feedbackModalCancelBtn').click(function () {
        $('#feedback-form')[0].reset();
        $('#feedback-modal-selector').selectpicker('refresh');
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

                        //Create new list element and set attributes
                        var li = document.createElement('li');
                        li.className = 'list-group-item';
                        li.id = data[i]["id"];
                        li.innerHTML = '<blockquote>' + data[i]['line'] + '</blockquote>';

                        //Create the view icon button and set attributes
                        var btn_view = document.createElement('button');
                        btn_view.typeName = 'button';
                        btn_view.className = 'btn btn-link icon-button';
                        btn_view.style = "outline:none;";
                        btn_view.dataset.time = JSON.stringify(data[i]['time']);
                        btn_view.dataset.id = data[i]['id'];
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

                        li.appendChild(btn_view);
                        li.appendChild(btn_feedback);

                        btn_view.onclick = viewQuoteVideo;
                        btn_feedback.onclick = launchFeedbackModal;

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
    });

}));
