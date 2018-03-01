function postQueryData() {
    var reservationQuery = $('#reservationQuery').val();
    $.post("requestQuery", {
        "payload": reservationQuery
    }, function(results) {
        console.log(results);
        if (results.data == "No Results Returned") {
            $('#results').text("No results returned, please retype your question");

        } else {
            $('#results').html("<table border='1'>");
            var headers = results.data[0];
            for (var header in headers) {
                $('#results').append('<th style="min-width:200px">' + header + '</th>');
            }

            for (var x in results.data) {
                var obj = results.data[x];
                $('#results').append('<tr>');
                for (var key in obj) {
                    var value = obj[key];
                    $('#results').append('<td style="text-align: center">' + value + '</td>');
                }
                $('#results').append('</tr>');
            }
            $("#results").append("</table>");
        }
    });
}

function postFeedbackData() {
    var isPositive = '';
    var reservationQuery = $('#reservationQuery').val();

    if ($("#button1").is(':checked')) {
        isPositive = 'Y';
    } else {
        isPositive = 'N';
    }

    $.post("insertFeedback", {
        "isPositive": isPositive,
        "reservationQuery": reservationQuery
    }, function() {
        alert("feedback submitted!");
        console.log("Feedback inserted");
    });
}