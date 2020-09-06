// Javascript file for the Weather Dashboard

// Variables for the user input form.
var userCitySearchEl  = document.querySelector( "#city-form" );
var cityNameEl = document.querySelector( "#cityname" );

// Variable for the click handler on city name stack.
var cityButtonsEl = document.querySelector( "#previous-cities" );
var clearButtonEl = document.querySelector( "#clear-all" );

// Variables for the daily weather and display information
var curDay;
var weatherTemperature;
var weatherHumidity;
var weatherWindSpeed;
var weatherUV;
var cityLat;
var cityLong;
var numPreviousCities;
var previousCities = [10];




////////////////////////////////////////////////////////////////////////////////////////
var getCityWeather = function ( city ) {

    // Get the current date
    var date = moment().format('L');
    curDay = moment().format("dddd");

 
    // Personal API Key for 'openweather.com'
    var apiKey = "4ac62930f02efe4befd5f739a4de35e6";

    // Format the 'Weather' API URL to obtain the current day's forecast.
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;




 
    // Make the request for the current day's weather
    fetch(apiUrl)
        .then(function (response) {

            return response.json();
        })
        .then(function (response) {
 
            // Put the city name/date on the page, then the day's weather
            displayCityNameDate( city, date );
            displayToday( response );

            cityLat = response.coord.lat;  // need to set these here because of the asynchronous nature of 'fetch'
            cityLon = response.coord.lon;

            // since the above request worked, use the lat/long values to obtain the 'UV index'.
            // Format the 'UV' API URL.
            var apiUrl = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon + "&cnt=1";

            return fetch(apiUrl)
 
        })
        .then( function( response ) {
            return response.json();
        })
        .then( function(response) {
             displayUvValue(response);
        })
        .catch(function (error) {
            // Notice this `.catch()` is chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather");
            return( -1 );
        });

    // Format the 'Weather API URL to obtain the 5-day forecast.
    var apiUrl2 = "https://api.openweathermap.org/data/2.5/forecast/?q=" + city + "&units=imperial&appid=" +apiKey;

    // Make the request for the current day's weather
    fetch(apiUrl2)
        .then(function (response) {

            if (response.ok) {
                // Request was successful
                response.json().then(function (data) {

                    display5Days(data);
                });

            } else {
                // Request was not successful
                alert("Error: " + response.statusText);
                return;
            };
            return response;
        })

}


////////////////////////////////////////////////////////////////////////////////////////
// Function to put the city name and current date on the page
var displayCityNameDate = function( city, date ) {

    // Format the data we need from the response
    var cityInfo = city.split(",");
    var cityDisplayNameEl = document.querySelector( "#citytext" );
    cityDisplayNameEl.textContent = cityInfo[0] + ", " + date + ", " + curDay;
    var cityLocationNameEl = document.querySelector( "#citylocation" );

    // If the 3rd part of the location wasn't specified, set it to a blank.
    if( !cityInfo[2] ) {
        cityInfo[2] = " ";
    }
    else {
        cityInfo[2] = ", " + cityInfo[2];
    }
    
    // If the 2nd part of the location wasn't specified, set it to a blank.
    if( !cityInfo[1] ) {
        cityInfo[1] = " ";
    }


    cityLocationNameEl.textContent = cityInfo[1] + cityInfo[2];

    // Put this city (search string) in the list of previously searched locations.
    // If there are more than 10 locations, push them down and put this one at
    // the top of the list.  Also, if the current city is already in the list, 
    // don't alter the list.

    pushCity( city );
}


////////////////////////////////////////////////////////////////////////////////////////
// Function to put "today's" weather on the page
var displayToday = function( data ) {
    

    // Get the data we want from the JSON object.
    weatherTemperature = data.main.temp;
    weatherHumidity    = data.main.humidity;
    weatherWindSpeed   = data.wind.speed;

    // Put the data for today's weather on the page.
    var tempDisplayEl = document.querySelector("#temperature");
    var weatherString = "Temperature: " + weatherTemperature + " \xB0F";                 
    tempDisplayEl.textContent = weatherString;

    var humidDisplayEl = document.querySelector("#humidity");
    humidDisplayEl.textContent = "Humidity: " + weatherHumidity + " %";

    var windDisplayEl = document.querySelector("#wind");
    windDisplayEl.textContent = "Wind Speed: " + weatherWindSpeed + " MPH";

}

////////////////////////////////////////////////////////////////////////////////////////
// Function to put "today's" UV index on the page
var displayUvValue = function( data2 ) {

    // Get the value from the JSON object
    weatherUV = data2[0].value;

    // Put the data for UV on the page
    var uvDisplayEL = document.querySelector("#uv");
    uvDisplayEL.textContent = "UV Index: " ;
    var uvDisplayValEl = document.querySelector("#uv-value");
    uvDisplayValEl.textContent = weatherUV ;
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to display the weather for the next 5 days.
var display5Days = function( data ) {

    // There could already be a forecast on the page, this needs to be removed
    // before we append the current city's forecast.

    empty5Days();

    // "data" is a list of 40 items, the weather for 5 days every 3 hours.
    // Display the weather information at noon each day, "list" locations
    // 2, 10, 18, 26, and 34.

    showDayInfo( "#day1", data, 2 )    // display 1st day, pass in ID and weather index
    showDayInfo( "#day2", data, 10 )   // display 2nd day, pass in ID and weather index
    showDayInfo( "#day3", data, 18 )   // display 3rd day, pass in ID and weather index
    showDayInfo( "#day4", data, 26 )   // display 4th day, pass in ID and weather index
    showDayInfo( "#day5", data, 34 )   // display 5th day, pass in ID and weather index

}


////////////////////////////////////////////////////////////////////////////////////////
// Function to show the forecast data for a single future day.
var showDayInfo = function( ulId, data, weatherIndex ) {
    // Generic 'li' element.
    var genericLi;

    // Generic display elements
    var dateDisplay1;
    var dateDisplay2;
    var imgDisplay;
    var iconDisplayUrl = "http://openweathermap.org/img/wn/";
    var iconDisplay;
    var usDate;
    var showDate;
  
    
    // ************************************************
    // Display the data for the indicated day.
     dateDisplay1 = document.querySelector( ulId );

    // Display the date
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].dt_txt.split(" ");

    // From the date, obtain the day of the week;
    dayOfWeek = moment(dateDisplay2[0]).format('dddd');

    // Put the date in usual 'US' format
    usDate = dateDisplay2[0].split("-");
    showDate = usDate[1] + "-" + usDate[2] + "-" + usDate[0] + ", " + dayOfWeek;
    genericLi.textContent = showDate;
    dateDisplay1.appendChild(genericLi);

    // Display the weather icon
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].weather[0].icon;
    imgDisplay = document.createElement( "img" );
    iconDisplay = iconDisplayUrl + dateDisplay2 + "@2x.png";
    imgDisplay.setAttribute( "src", iconDisplay );
    genericLi.appendChild( imgDisplay );
    dateDisplay1.appendChild(genericLi);

    // Display the weather description
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].weather[0].description;
    genericLi.textContent = "Looks like: " + dateDisplay2;
    dateDisplay1.appendChild(genericLi);

    // Display the temperature
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].main.temp;
    genericLi.textContent = "Temperature: " + dateDisplay2 + " \xB0F";
    dateDisplay1.appendChild(genericLi);

    // Display the humidity
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].main.humidity;
    genericLi.textContent = "Humidity: " + dateDisplay2;
    dateDisplay1.appendChild(genericLi);

}

////////////////////////////////////////////////////////////////////////////////////////
// Function to clear out an existing 5-day forecast
var empty5Days = function() {

    var ulItem;

    // Point to each <ul></ul> item, and delete its content
    ulItem = document.querySelector( "#day1" );  
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day2" );
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day3" );
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day4" );
    ulItem.innerHTML = '' ;

    ulItem = document.querySelector( "#day5" );
    ulItem.innerHTML = '' ;
}


////////////////////////////////////////////////////////////////////////////////////////
// Function to maintain the list of 'previous' cities, both in the data array and on the page.
var pushCity = function( city ) {

    // Based on the number of cities in the list, make sure the current 'city' is not
    // already in the list.

    // Make sure our city name string is upper case, with no white space
    var localCity = city.toUpperCase().trim();

    for( var i = 0; i < numPreviousCities; i++ ) {
        if( localCity === previousCities[i] ) {
            // This city is already in the list, don't add it.
            return;
        }
    }

    // We have a new city to add.  Push the list down, add the new city
    // and bump the counter.  Note the limit is ten cities.
    var maxIndex = Math.min(10, numPreviousCities);
    
    if (maxIndex) {
        // If we have cities, push them down in the stack.  The oldest one
        // will fall out of the bottom.
        for (var j = maxIndex; j > 0; j--) {
            previousCities[j] = previousCities[j - 1];
        }
    }

    previousCities[0] = localCity;
    numPreviousCities = Math.min( 10, ++numPreviousCities );

    // Update the city list on the page and save to local Storage.

    updateCityList();
    saveCityList();
}


////////////////////////////////////////////////////////////////////////////////////////
// Function to update the HTML page with the city list
var updateCityList = function() {

    var idValue;
    var displayItem;

    if( numPreviousCities == 0 ) {
        return;
    }

    // Loop over the number of cities and update the list on the page
    var attributeName;
    for( var i = 0; i < numPreviousCities; i++ ) {
        idValue = "p" + i;
        displayItem = document.getElementById( idValue );
        displayItem.innerHTML = previousCities[i];
        displayItem.setAttribute( "previous", previousCities[i] );
    }
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to save the cities searched to local storage.
var saveCityList = function() {

    // Save the count of previously searched cities
    localStorage.setItem( "cityCount", numPreviousCities );

    // Save the array of previously searched cities
    if (numPreviousCities > 0) {
        var key;
        for (var i = 0; i < numPreviousCities; i++) {
            key = "citiesForecast" + i;
            localStorage.setItem(key, previousCities[i] );
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to load the cities searched from local storage.
var retrieveCityList = function() {

    // Retrieve the count of the previously searched cities
    numPreviousCities = localStorage.getItem( "cityCount" );

    // Retrieve the array of previously searched cities, if it exists.
    if( numPreviousCities > 0 ) {
        var key;
        for( var i = 0; i < numPreviousCities; i++ ) {
            key = "citiesForecast" + i;
            previousCities[i] = localStorage.getItem( key );
        }
    }
    else {
        numPreviousCities = 0;
        previousCities = [];
    }

    // Now put the data on the HTML page, if necessary.
    if( numPreviousCities > 0 ) {
        updateCityList();
    }

}


/////////////// ** Event Handler ** //////////////////////////////////////////
// Define the event handlers needed.

// The event handler for the form submit button
var formSubmitHandler = function( event ) {
    event.preventDefault();

    // Get the requested user name from the form
    var searchCity = cityNameEl.value.trim();
    var returnCode;

    if( searchCity ) {
        returnCode = getCityWeather( searchCity );
        cityNameEl.value = "";
    }
    else {
        alert( "Please enter a City name to search for." );
    }

    if( returnCode === -1 ) {
        alert( "Invalid city name, please re-specify." );
    }
}

/////////////// ** Event Handler ** //////////////////////////////////////////
// The event handler for the cities in the display stack.  Each city name is 
// a button that can be clicked.

var buttonCityClickHandler = function( event ) {

    // Determine which city button was clicked from the stack
    var cityName = event.target.getAttribute( "previous" );
    
    // Invoke the 'display city' routine to display the weather.
    getCityWeather( cityName );

}


/////////////// ** Event Handler ** //////////////////////////////////////////
// The event handler for the clear button.  This will empty local browser storage
// as well as the display stack.

var buttonClearStackHandler = function () {

    // Remove all the "city" entries.
    if (numPreviousCities > 0) {
        var key;
        for (var i = 0; i < numPreviousCities; i++) {
            key = "citiesForecast" + i;
            localStorage.removeItem(key);
        }
    }

    // Remove the city names from the page
    // Loop over the number of cities and blank the HTML Element
    for (var i = 0; i < numPreviousCities; i++) {
        idValue = "p" + i;
        displayItem = document.getElementById(idValue);
        displayItem.innerHTML = " ";
    }

    // Now remove the count.
    localStorage.removeItem("cityCount");
    numPreviousCities = 0;
}

////////////////////////////////////////////////////////////////////////////////////////
// Define the event listeners needed.

// Event listener for the GitHub user name.
userCitySearchEl.addEventListener( "submit", formSubmitHandler );

// Event listener for the 'city' buttons in the 'stack'
cityButtonsEl.addEventListener( "click", buttonCityClickHandler );

// Event listener for the "clear" button, to empty local storage
clearButtonEl.addEventListener( "click", buttonClearStackHandler );


////////////////////////////////////////////////////////////////////////////////////////
// When things start off, initialize the number of previously searched cities and 
// load data from local storage.

retrieveCityList();
