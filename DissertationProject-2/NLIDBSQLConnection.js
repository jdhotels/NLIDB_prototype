/* Jonnyleeming*/
/*jshint esversion: 6 */
var mysql = require('mysql');
var express = require('express');
var sw = require('stopword');
var st = require('node-snowball');
var app = express();
var results = "No Results Returned";
var table = null;
var column = null;
var column1 = null;
var value = null;
var max = null;
var min = null;


// Binding express app to port 3000
app.listen(3000, function() {
    console.log('Node server running @ http://localhost:3000');
});

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile('NLIDB.html', { root: __dirname });
});

app.post('/requestQuery', function(req, res) {
    var rawQuery = req.body.payload;
    var rawQArray = rawQuery.split(' ');
    var query = sw.removeStopwords(rawQArray);
    console.log("Request received: " + query);
    var stemmed = st.stemword(query);
    console.log("Received: " + rawQuery + ". Formatted: " + stemmed);
    var withSynonyms = mapSynonyms(stemmed);
    var sql = mapSqlQuery(withSynonyms);
    res.send(returnResult(sql));
});

app.post('/insertFeedback', function(request, res) {
    var isPositive = request.body.isPositive;
    var reservationQuery = request.body.reservationQuery;
    var fsql = request.body.sql;

    feedbacksql = "INSERT INTO Logs (Input, SQLreturned, Feedback) values ('" + reservationQuery + "', '" + fsql + "', '" + isPositive + "')";
    returnResult(feedbacksql);
});

function returnResult(query) {
    var connection = mysql.createConnection({
        host: 'mudfoot.doc.stu.mmu.ac.uk',
        user: 'walkerd',
        password: 'pristdeW5',
        database: 'walkerd'
    });

    connection.connect();

    connection.query(query, function(err, rows, fields) {
        if (!err) {
            setValue(rows);
        } else
            console.log('Error while performing Query.');
    });

    connection.end();


    return results;
}

function mapSynonyms(stemmed) {
    stemmed.forEach(word => {
        var index = stemmed.indexOf(word);
        switch (word) {
            case "book":
                stemmed[index] = "Booking";
                break;

            case "bookings":
                stemmed[index] = "Booking";
                break;

            case "reservation":
                stemmed[index] = "Booking";
                break;

            case "show":
                stemmed[index] = "Select";
                break;

            case "locat":
                stemmed[index] = "Location";
                break;

            case "avail":
                stemmed[index] = "Available";
                break;

                /* case "cancel":
                stemmed[index] = "Cancellation";
                break;
*/
            case "comment":
                stemmed[index] = "Comments";
                break;

                /*  case "number of guests":
                     stemmed[index] = "No_Guest";
                     break; */

            case "id":
                stemmed[index] = "Booking_ID";
                break;

            case "in":
                stemmed[index] = "CheckIN";
                break;

            case "out":
                stemmed[index] = "CheckOUT";
                break;

            case "Payment":
                stemmed[index] = "Payment_ID";
                break;

            case "room":
                stemmed[index] = "Room_Type";
                break;

            case "cost":
                stemmed[index] = "Total Cost";
                break;

            case "salut":
                stemmed[index] = "Salutation";
                break;

            case "first":
                stemmed[index] = "FirstName";
                break;

            case "surnam":
                stemmed[index] = "Surname";
                break;

            case "1":
                stemmed[index] = "Address_Line1";
                break;

            case "2":
                stemmed[index] = "Address_Line2";
                break;

            case "3":
                stemmed[index] = "Address_Line3";
                break;

            case "code":
                stemmed[index] = "Postcode";
                break;

            case "mobil":
                stemmed[index] = "MobileNo";
                break;

            case "home":
                stemmed[index] = "HomeNo";
                break;

            case "birth":
                stemmed[index] = "DOB";
                break;

            case "email":
                stemmed[index] = "Email";
                break;

            case "phone":
                stemmed[index] = "PhoneNumber";
                break;

            case "citi":
                stemmed[index] = "City";
                break;

            case "postcod":
                stemmed[index] = "postcode";
                break;

            case "card":
                stemmed[index] = "CardNo";
                break;

            case "expiri":
                stemmed[index] = "ExpiryDate";
                break;
                // Need to look at this
            case "occup":
                stemmed[index] = "Max_Guest";
                break;

            case "descript":
                stemmed[index] = "Room_Description";
                break;

            case "manchest":
                stemmed[index] = "Manchester";
                break;
            case "custom":
                stemmed[index] = "Guest";
                break;

            case "guest":
                stemmed[index] = "Guest";
                break;

            case "client":
                stemmed[index] = "Guest";
                break;

            case "hotel":
                stemmed[index] = "Location";
                break;

            case "inn":
                stemmed[index] = "Location";
                break;

            case "lodging":
                stemmed[index] = "Location";
                break;

            case "stay":
                stemmed[index] = "Location";
                break;

            case "price":
                stemmed[index] = "Price";
                break;




        }
    });
    return stemmed;
}

function mapSqlQuery(formattedQuery) {
    var sql = "";
    var listOfTables = [];
    var listOfColumns = [];
    var listOfValues = [];
    var listOfMax = [];
    var listOfMin = [];

    listOfTables.push("Booking", "Guest", "Location", "Payment", "Room", "Room_Type");

    listOfColumns.push("Booking_ID", "CheckIN", "CheckOUT", "No_Guest", "Cancellation", "Comments", "Room_ID", "Guest_ID", "Payment_ID", "Total Cost", "Paid",
        "Salutation", "FirstName", "Surname", "Address_Line1", "Address_Line2", "Address_Line3", "Postcode", "MobileNo", "HomeNo", "DOB", "Email",
        "Location_ID", "City", "PhoneNumber",
        "CardNo", "ExpiryDate",
        "Room_Type_ID", "RoomNumber", "Available",
        "Price", "Room_Description", "Max_Guest");


    formattedQuery.forEach(word => {
        word = capitalizeFirstLetter(word);

        if (listOfTables.indexOf(word) !== -1) {
            table = word;
        }

        if (listOfColumns.indexOf(word) !== -1) {
            column = word;
        }

    });

    value = getSqlValue(formattedQuery, table, column);
    max = getMaxValue(formattedQuery, table, column);
    min = getMinValue(formattedQuery, table, column);


    if (table && column && value !== null && max == null)
        sql = "select * from " + table + " where " + column + " like '%" + value + "%'";

    else if (table && column && max !== null && min == null)
        sql = "select " + column1 + ", MAX(" + column + ") from " + table;

    else if (table && column && min !== null && max == null)
        sql = "select " + column1 + ",MIN(" + column + ") from " + table;

    else if (value == null && table && column !== null)
        sql = "select " + column + " from " + table;

    else if (table !== null)
        sql = "select * from " + table;

    table = null;
    column = null;
    column1 = null;
    value = null;
    max = null;
    min = null;


    return sql;
}

function setValue(value) {
    results = value;
    console.log(results);
}

function capitalizeFirstLetter(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getMaxValue(query) {
    var listOfMax = [];

    listOfMax.push("MAX", "EXPENS", "MOST", "LAVISH");


    query.forEach(word => {

        if (table === "Room_Type" && listOfMax.indexOf(word.toUpperCase()) !== -1) {
            max = word;
            column = 'Price';
            column1 = 'Room_Description';
        }

    });
    return max;
}

function getMinValue(query) {
    var listOfMin = [];

    listOfMin.push("MIN", "CHEAPEST", "CUT", "LOW", "SALE", "ECONOMY");


    query.forEach(word => {

        if (table === "Room_Type" && listOfMin.indexOf(word.toUpperCase()) !== -1) {
            min = word;
            column = 'Price';
            column1 = 'Room_Description';
        }

    });
    return min;
}


function getSqlValue(query) {
    var listOfLocations = [];

    listOfLocations.push("LONDON", "MANCHESTER", "WEST BROMICH", "LIVERPOOL", "BOLTON");

    query.forEach(word => {


        if (table === "Booking" && word.toUpperCase() === "NOT") {
            value = 'N';
            column = 'Paid';
        }

        if (table === "Booking" && word.toUpperCase() === "UNPAID") {
            value = 'N';
            column = 'Paid';
        }
        if (table === "Booking" && word.toUpperCase() === "PAID") {
            value = 'Y';
            column = 'Paid';
        }
        if (table === "Booking" && word.toUpperCase() === "OWE") {
            value = 'N';
            column = 'Paid';
        }
        if (table === "Booking" && word.toUpperCase() === "CANCEL") {
            value = 'Y';
            column = 'Cancellation';
        }
        if (table === "Location" && listOfLocations.indexOf(word.toUpperCase()) !== -1) {
            value = word;
            column = 'City';
        }
        if (table === "Room_Type" && word.toUpperCase() === "FOUR") {
            value = '4';
            column = 'Max_Guest';
        }
        if (table === "Room_Type" && word.toUpperCase() === "KING") {
            value = word;
            column = 'Room_Description';
        }

    });
    return value;
}

function removeArrayItem(array, itemToRemove) {
    var index = array.indexOf(itemToRemove);
    if (index > -1)
        array.splice(index, 1);
    return array;


}