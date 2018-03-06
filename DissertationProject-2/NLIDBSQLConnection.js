/*jshint esversion: 6 */
var mysql = require('mysql');
var express = require('express');
var sw = require('stopword');
var st = require('node-snowball');
var app = express();
var results = "No Results Returned";
var latestSqlQuery = "";
var table = null;
var column = null;
var value = null;
var max = null;
var min = null;
var V1 = null;
var viewName = null;
var listOfLocations = [];
var commentsCheck = [];
var customerpay = [];
var customerLocat = [];
var customerRoom = [];
var cancelledBook = [];
listOfLocations.push("LONDON", "MANCHESTER", "WEST BROMWICH", "LIVERPOOL", "BOLTON");
commentsCheck.push("COMMENTS");
customerpay.push("PAY");
customerLocat.push("STAY");
customerRoom.push("TYPE");
cancelledBook.push("CANCEL");




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
    var withSynonyms = mapSynonyms(stemmed);
    var sql = mapSqlQuery(withSynonyms);
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

            case "type":
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

            case "doubl":
                stemmed[index] = "Double";
                break;

            case "london":
                stemmed[index] = "London";
                break;

            case "liverpool":
                stemmed[index] = "Liverpool";
                break;


            case "bolton":
                stemmed[index] = "Bolton";
                break;

            case "west bromwich":
                stemmed[index] = "WestBromwich";
                break;

            case "singl":
                stemmed[index] = "Single";
                break;

            case "honey":
                stemmed[index] = "HoneyMoon";
                break;

            case "group":
                stemmed[index] = "Group Single";
                break;

            case "king":
                stemmed[index] = "King";
                break;

            case "room":
                stemmed[index] = "Room_Type";
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

    value = getSqlValue(formattedQuery);
    max = getMaxValue(formattedQuery);
    min = getMinValue(formattedQuery);
    view = mapViewName(formattedQuery);

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

    listOfLocations.push("LONDON", "MANCHESTER", "WEST BROMWICH", "LIVERPOOL", "BOLTON");


    query.forEach(word => {


        if (word.toUpperCase() === "NOT"){
            V1 = 'N';
        }

        if (table === "Booking" && V1 !==null) {
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
        if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("Double") !== -1) {
            viewName = word + "DoubleRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("Single") !== -1) {
            viewName = word + "SingleRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("King") !== -1) {
            viewName = word + "KingRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("HoneyMoon") !== -1) {
            viewName = word + "HoneyMoonRooms";
        } else if (listOfLocations.indexOf(word.toUpperCase()) !== -1 && query.indexOf("Group Single") !== -1) {
            viewName = word + "GroupSingleRooms";
        } else if (commentsCheck.indexOf(word.toUpperCase()) !== -1 && query.indexOf("King") !== -1) {
            viewName = "KingComments";
        } else if (customerpay.indexOf(word.toUpperCase()) !== -1 && query.indexOf("2") !== -1) {
            viewName = "TotalCost2";
        } else if (customerLocat.indexOf(word.toUpperCase()) !== -1 && query.indexOf("2") !== -1) {
            viewName = "customerlocat2";
        } else if (customerRoom.indexOf(word.toUpperCase()) !== -1 && query.indexOf("2") !== -1) {
            viewName = "customerRoom2";
        }else if (cancelledBook.indexOf(word.toUpperCase()) !== -1) {
        viewName = "CancelledBookings"
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