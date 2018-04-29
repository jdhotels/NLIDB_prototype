/*jshint esversion: 6 */
var mysql = require('mysql');
var express = require('express');
var sw = require('stopword');
var st = require('node-snowball');
var synonyms = require('./Synonyms');
var app = express();
var results = "No Results Returned";
var latestSqlQuery = "";
var table = null;
var column = null;
var value = null;
var max = null;
var min = null;
var V1 = null;
var viewguest = null;
var viewlocat = null;
var viewroom = null;
var viewName = null;
var viewpay = null;
var roomdouble = null;
var locationview = null;
var listOfLocations = [];
var commentsCheck = [];
var customerpay = [];
var customerLocat = [];
var customerRoom = [];
var cancelledBook = [];
var emailCheck = [];
var offers = [];
listOfLocations.push("LONDON", "MANCHESTER", "WEST BROMWICH", "LIVERPOOL", "BOLTON");
commentsCheck.push("COMMENTS", "COMMENT", "FEEDBACK");
cancelledBook.push("CANCEL");
emailCheck.push("EMAIL");
offers.push("OFFER");




const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.sendFile('AboutNLIDB.html', { root: __dirname });

});

app.get('/NLIDB.html', function(req, res) {
    res.sendFile('NLIDB.html', { root: __dirname });

});

app.get('/NLIDB_FAQ.html', function(req, res) {
    res.sendFile('NLIDB_FAQ.html', { root: __dirname });

});
// Binding express app to port 3000
app.listen(3000, function() {
    console.log('Node server running @ http://localhost:3000');
});


app.post('/requestQuery', function(req, res) {

    var rawQuery = req.body.payload;
    var rawQArray = rawQuery.split(' ');
    var query = sw.removeStopwords(rawQArray);
    console.log("Request received: " + query);
    var stemmed = st.stemword(query);
    console.log("Received: " + rawQuery + ". Formatted: " + stemmed);
    var withSynonyms = synonyms.mapSynonyms(stemmed);
    var sql = mapSqlQuery(withSynonyms);
    console.log("SQL: " + sql);
    latestSqlQuery = sql;

    var results = {
        data: returnResult(sql)
    };
    res.send(results);
});

app.post('/insertFeedback', function(request, res) {
    var isPositive = request.body.isPositive;
    var reservationQuery = request.body.reservationQuery;

    feedbacksql = "INSERT INTO Logs (Input, SQLreturned, Feedback) values ('" + reservationQuery + "', '" + latestSqlQuery + "', '" + isPositive + "')";
    returnResult(feedbacksql);
    res.send(200);
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
    view = mapViewName(formattedQuery);
    value = getSqlValue(formattedQuery);
    max = getMaxValue(formattedQuery);
    min = getMinValue(formattedQuery);


    if (view !== null) {
        sql = "select * from " + view;
    } else if (table && column && value !== null && max == null)
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
    viewguest = null;
    viewlocat = null;
    viewroom = null;
    viewName = null;
    viewpay = null;
    roomdouble = null;

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

    listOfMax.push("MAX", "EXPENS", "MOST", "LAVISH", "LUXURI");

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

    listOfMin.push("MIN", "CHEAPEST", "CUT", "LOW", "LOWEST", "SALE", "ECONOMY", "INEXPENS");

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


    query.forEach(word => {


        if (word.toUpperCase() === "NOT") {
            V1 = 'N';
        }

        if (table === "Booking" && V1 !== null) {
            value = 'N';
            column = 'Paid';
        }


        if (table === "Booking" && word.toUpperCase() === "UNPAID") {
            value = 'N';
            column = 'Paid';

        }

        if (table === "Booking" && word.toUpperCase() === "PAID" && V1 !== 'N') {
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
        if (table === "Room_Type" && word.toUpperCase() === "4") {
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

function mapViewName(query) {

    query.forEach(word => {

        if (word.toUpperCase() === "2") {
            viewguest = 'Y';
        }
        if (word.toUpperCase() === "TWO") {
            viewguest = 'Y';
        }
        if (word.toUpperCase() === "STAY" && viewroom === null) {
            viewlocat = 'Y';
        }
        if (word.toUpperCase() === "TYPE") {
            viewroom = 'Y';
        }
        if (word.toUpperCase() === "ROOM") {
            viewroom = 'Y';
        }

        if (word.toUpperCase() === "PAY") {
            viewpay = 'Y';
        }

        if (word.toUpperCase() === "CHARG") {
            viewpay = 'Y';
        }

        if (word.toUpperCase() === "DOUBLE") {
            roomdouble = 'Y';
        }

        if (word.toUpperCase() === "DOUBL") {
            roomdouble = 'Y';
        }

        if (listOfLocations.indexOf(word.toUpperCase()) !== -1) {
            locationview = word;
        }

        if (viewguest === null && word.toUpperCase() === "STAY") {
            table = "Location";
        }

        if (viewguest === null && word.toUpperCase() === "TYPE") {
            table = "Room_Type";
        }

        if (viewguest === null && word.toUpperCase() === "ROOM") {
            table = "Room_Type";
        }

        if (locationview !== null && roomdouble !== null) {
            table = null;
        }


        /* if (viewName === null && word.toUpperCase() === "ROOM") {
            table = "Room_Type";
        } */

        if (locationview !== null && roomdouble !== null) {
            viewName = locationview + "DoubleRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("Single") !== -1) {
            viewName = word + "SingleRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("King") !== -1) {
            viewName = word + "KingRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("HoneyMoon") !== -1) {
            viewName = word + "HoneyMoonRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("Group Single") !== -1) {
            viewName = word + "GroupSingleRooms";
        } else if (commentsCheck.indexOf(word.toUpperCase()) !== -1) {
            viewName = "KingComments";
        } else if (viewguest !== null && viewlocat !== null) {
            viewName = "customerlocat2";
        } else if (viewguest !== null && viewroom !== null && viewpay === null) {
            viewName = "customerRoom2";
        } else if (viewguest !== null && viewpay !== null) {
            viewName = "TotalCost2";
        } else if (cancelledBook.indexOf(word.toUpperCase()) !== -1) {
            viewName = "CancelledBookings";

        } else if (emailCheck.indexOf(word.toUpperCase()) !== -1) {
            viewName = "EmailCheck";

        } else if (offers.indexOf(word.toUpperCase()) !== -1) {
            viewName = "MinRoom";
        }
    });
    return viewName;

}

function removeArrayItem(array, itemToRemove) {
    var index = array.indexOf(itemToRemove);
    if (index > -1)
        array.splice(index, 1);

    return array;
}