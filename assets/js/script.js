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




////////////////////////////////////////////////////////////////////////////////////////
var getCityWeather = function ( city ) {

    // Get the current date
    var date = moment().format('L');

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

    // Personal API Key for 'openweather.com'
    var apiKey = "4ac62930f02efe4befd5f739a4de35e6";

    // Format the 'Weather' API URL to obtain the current day's forecast.
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;



    // Format the 'Weather API URL to obtain the 5-day forecast.
    // var apiUrl = "https://api.openweathermap.org/data/2.5/forecast/?q=" + city + "&units=imperial&appid=" +apiKey;
 
    // Make the request for the current day's weather
    fetch(apiUrl)
        .then(function (response) {
            
            if (response.ok) {
                // Request was successful
                response.json().then(function (data) {
                    console.log(data);
                    weatherTemperature = data.main.temp;
                    weatherHumidity = data.main.humidity;
                    weatherWindSpeed = data.wind.speed;
                    cityLat = data.coord.lat;
                    cityLong = data.coord.lon;

                    // Put the data for today's weather on the page.
                    var tempDisplayEl = document.querySelector("#temperature");
                    var weatherString = "Temperature: " + weatherTemperature + " \xB0F";                 
                    tempDisplayEl.textContent = weatherString;

                    var humidDisplayEl = document.querySelector("#humidity");
                    humidDisplayEl.textContent = "Humidity: " + weatherHumidity + " %";

                    var windDisplayEl = document.querySelector("#wind");
                    windDisplayEl.textContent = "Wind Speed: " + weatherWindSpeed + " MPH";

                });
                return( response );
            } else {
                // Request was not successful
                alert("Error: " + response.statusText);
                return;
            };
        })
        .then(function (response) {

            while( !cityLat ) {

            };
            
            // since the above request worked, use the lat/long values to obtain the 'UV index'.
            // Format the 'UV' API URL.
             var apiUrl = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLon + "&cnt=1";
            //var apiUrl = "http://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + apiKey + "&lat=29.76&lon=-95.57&cnt=1";

            fetch(apiUrl)
                .then(function (response) {

                    if (response.ok) {
                        // Request was successful
                        response.json().then(function (data2) {
                            console.log(data2);
                            weatherUV = data2[0].value;

                            // Put the data for UV on the page
                            var uvDisplayEL = document.querySelector("#uv");
                            uvDisplayEL.textContent = "UV Index: " ;
                            var uvDisplayValEl = document.querySelector("#uv-value");
                            uvDisplayValEl.textContent = weatherUV ;
                        });
                    };
                })
            })
        .catch(function (error) {
            // Notice this `.catch()` is chained onto the end of the `.then()` method
            alert("Unable to connect to OpenWeather");
            return;
        });

    



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
    console.log( searchCity );

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
