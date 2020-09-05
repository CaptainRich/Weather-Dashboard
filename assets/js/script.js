// Javascript file for the Weather Dashboard

// Variables for the user input form.
var userCitySearchEl  = document.querySelector( "#city-form" );
var cityNameEl = document.querySelector( "#cityname" );

// Variables for the daily weather information
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

    // Put the city name/date on the page
    displayCityNameDate( city, date );


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
 
            displayToday( response );

            cityLat = response.coord.lat;  // need to set these here because of the asynchronous nature of 'fetch'
            cityLon = response.coord.lon;

            // since the above request worked, use the lat/long values to obtain the 'UV index'.
            // Format the 'UV' API URL.
            var apiUrl = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon + "&cnt=1";

            return fetch(apiUrl)
 
        })
        .then( function( response ) {
            return response.json();
        })
        .then( function(response) {
            console.log( response );
            displayUvValue(response);
        })
        .catch(function (error) {
            // Notice this `.catch()` is chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather");
            return;
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
    cityDisplayNameEl.textContent = cityInfo[0] + ", " + date;
    var cityLocationNameEl = document.querySelector( "#citylocation" );
    if( !cityInfo[2] ) {
        cityInfo[2] = " ";
    }
    else {
        cityInfo[2] = ", " + cityInfo[2];
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
    weatherHumidity = data.main.humidity;
    weatherWindSpeed = data.wind.speed;

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
  
    
    // ************************************************
    // Display the data for the indicated day.
     dateDisplay1 = document.querySelector( ulId );

    // Display the date
    genericLi = document.createElement("li");
    dateDisplay2 = data.list[weatherIndex].dt_txt.split(" ");
    genericLi.textContent = dateDisplay2[0];
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
    // and bump the counter.
    var maxIndex = Math.min(10, numPreviousCities);
    if (maxIndex) {
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
    for( var i = 0; i < numPreviousCities; i++ ) {
        idValue = "p" + i;
        displayItem = document.getElementById( idValue );
        displayItem.innerHTML = previousCities[i];
    }
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to save the cities searched to local storage.
var saveCityList = function() {

    // Save the count of previously searched cities
    localStorage.setItem( "cityCount", numPreviousCities );

    // Save the array of previously searched cities
    localStorage.setItem( "citiesForecast", previousCities );
}

////////////////////////////////////////////////////////////////////////////////////////
// Function to load the cities searched from local storage.
var retrieveCityList = function() {

    // Retrieve the count of the previously searched cities
    numPreviousCities = localStorage.getItem( "cityCount" );

    // Retrieve the array of previously searched cities
    previousCities = localStorage.getItem( "citiesForecast" );

    // Now put the data on the HTML page, if necessary.
    if( numPreviousCities > 0 ) {
        updateCityList();
    }

}

////////////////////////////////////////////////////////////////////////////////////////
// Define the function to the 'repo' information
// var displayRepos = function( repos, searchTerm ) {

//     // Check if the API returned any 'repos'
//     if( repos.length === 0 ) {
//         repoContainerEl.textContent = "No repositories found for this user." ;
//         return;
//     }

//     // Clear out any earlier displayed data
//     repoContainerEl.textContent = "";
//     repoSearchTerm.textContent  = searchTerm;

//     // Display the repository data on the page.
//     // Loop over the discovered 'repos'.
//     for( i = 0; i < repos.length; i++ ) {
//         // Format the 'repo' name
//         var repoName = repos[i].owner.login + "/" + repos[i].name;

//         // Create the container for this 'repo'.
//         var repoEl = document.createElement( "a" );
//         repoEl.classList = "list-item flex-row justify-space-between align-center";
//         // Link the next HTML page and sends it the selected 'repo' name.
//         repoEl.setAttribute( "href", "./single-repo.html?repo=" + repoName );   

//         // Create a span element to hold the 'repo' name
//         var titleEl = document.createElement( "span" );
//         titleEl.textContent = repoName;

//         // Append the element to the container
//         repoEl.appendChild( titleEl );

//         // Now create the status element for 'repo issues'
//         var statusEl = document.createElement( "span" );
//         statusEl.classList = "flex-row align-center";

//         // See if the repo has any issues
//         if( repos[i].open_issues_count > 0 ) {
//             statusEl.innerHTML = 
//             "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
//         }
//         else {
//             statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
//         }

//         // Append the status to the container
//         repoEl.appendChild( statusEl );


//         // Append the container to the DOM
//         repoContainerEl.appendChild( repoEl );
//     }

//     console.log( repos );
//     console.log( searchTerm );
// }


////////////////////////////////////////////////////////////////////////////////////////
// Function to search GitHub based on language features.
// var getFeaturedRepos = function( language ) {
//     var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

//     fetch( apiUrl ).then( function( response ) {
//         if( response.ok ) {
//             response.json().then(function(data) {
//                 displayRepos( data.items, language );
//             })
//         }
//         else {
//             alert( "Error: " + response.statusText );
//         }
//     });
// }

////////////////////////////////////////////////////////////////////////////////////////
// Define the event handlers needed.

// The event handler for the form submit button
var formSubmitHandler = function( event ) {
    event.preventDefault();

    // Get the requested user name from the form
    var searchCity = cityNameEl.value.trim();

    if( searchCity ) {
        getCityWeather( searchCity );
        cityNameEl.value = "";
    }
    else {
        alert( "Please enter a City name to search for." );
    }
}

// The event handler for the language buttons
// var buttonClickHandler = function( event ) {

//     // Determine which button was clicked from the button data attributes
//     var language = event.target.getAttribute( "data-language" );
    
//     // Invoke the API to return the requested language 'repos'
//     getFeaturedRepos( language );

//     // Clear out any earlier data.  The container is actually cleared before any new
//     // data is displayed because 'getFeaturedRepos' runs asynchronously and will take
//     // longer to finish.
//     repoContainerEl.textContent = "";
// }


////////////////////////////////////////////////////////////////////////////////////////
// Define the event listeners needed.

// Event listener for the GitHub user name.
userCitySearchEl.addEventListener( "submit", formSubmitHandler );

// Event listener for the language buttons.
//languageButtonsEl.addEventListener( "click", buttonClickHandler );


////////////////////////////////////////////////////////////////////////////////////////
// When things start off, initialize the number of previously searched cities and try
// to load data from local storage.

retrieveCityList();