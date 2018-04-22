/*jshint esversion: 6 */
module.exports = {
    mapSynonyms: function(stemmed) {

        stemmed.forEach(word => {
            var index = stemmed.indexOf(word);

            switch (word) {

                case "book":
                    stemmed[index] = "Booking";
                    break;

                case "bookings":
                    stemmed[index] = "Booking";
                    break;

                case "reserv":
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
            }
        });
        return stemmed;
    }
};