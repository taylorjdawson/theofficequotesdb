/**
 * Created by Foba on 3/27/2017.
 */

const ElasticSearchAddr = "http://35.185.217.146:9200/firebase/line/_search?q=text_entry_norm:";
const ELASTICSEARCH_LOCAL_ADDR = "http://localhost:9220/_search?q=";

function makeRequest(url) {
    httpRequest = new XMLHttpRequest();

    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }

    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', url);
    httpRequest.send();
}

function alertContents() {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
            
            //TODO: Move outside of function?????
            var responseJSON = JSON.parse(httpRequest.responseText);
            displaySearchResults(responseJSON);
        } else {
            alert('There was a problem with the request. Status: ' + httpRequest.status);
        }
    }
}

function displaySearchResults(arr) {
    var out = "";
    var i;
    for(i = 0; i < arr.length; i++) {
        out += '<li class="list-group-item"><blockquote>' + arr[i]['line'] + '</blockquote>Season:' +
            arr[i]['season'] + 'Episode:' + arr[i]['episode'] + 'Time:' + arr[i]['time']['minutes'] + 'm' + arr[i]['time']['seconds']+'s' +
            '<br><span><button type="button" class="btn btn-link icon-button" style="outline:none;" >' +
            '<span aria-hidden="true" class="glyphicon glyphicon-eye-open"></span></button></span>' +
            '<span aria-hidden="true" class="glyphicon glyphicon-eye-open"></span></button></span>' +
            '</li>'
    }
    document.getElementById("quotes_list").innerHTML = out;
}


//TODO: Condense function
 function searchFunction() {

    var httpRequest;


    //Todo: Sanitize search text
    var searchText = document.getElementById('search_text').value;
    var searchEncoded = encodeURIComponent(searchText);

    // Tilda added for fuzzy searching
    //Todo: Make a json structured query
    makeRequest(ELASTICSEARCH_LOCAL_ADDR  + searchText );
    alertContents();
 }

 function createIssue() {
     $.ajax({
         url: 'users.php',
         dataType: 'json',
         type: 'post',
         contentType: 'application/json',
         data: JSON.stringify( { "first-name": $('#first-name').val(), "last-name": $('#last-name').val() } ),
         processData: false,
         success: function( data, textStatus, jQxhr ){
             $('#response pre').html( JSON.stringify( data ) );
         },
         error: function( jqXhr, textStatus, errorThrown ){
             console.log( errorThrown );
         }
     });
 }


