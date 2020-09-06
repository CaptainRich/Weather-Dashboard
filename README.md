# Weather Dashboard Project

Richard Ay, August/September 2020

## Table of Contents
* [Project Objective](#project-objective)
* [Acceptance Criteria](#acceptance-criteria)
* [Deployment Link](#deployment-link)
* [Weather Dashboard Logic](#weather-dashboard-logic)
* [Application Screen Shot](#application-screen-shot)



## Project Objective
As a traveler I want the ability to see the weather outlook for multiple cities
so that I can plan a trip accordingly.

## Acceptance Criteria
GIVEN a 'weather dashboard' with form inputs:

1) WHEN I search for a city, THEN I am presented with current and future conditions for that 
city and that city is added to the search history.
2) WHEN I view current weather conditions for that city, THEN I am presented with the city name, 
the date, an icon representation of weather conditions, the temperature, the humidity, the wind 
speed, and the UV index.
3) WHEN I view the UV index, THEN I am presented with a color that indicates whether the 
conditions are favorable, moderate, or severe.
4) WHEN I view future weather conditions for that city, THEN I am presented with a 5-day forecast 
that displays the date, an icon representation of weather conditions, the temperature, and the 
humidity.
6) WHEN I click on a city in the search history, THEN I am again presented with current and future 
conditions for that city.

## Deployment Link
The deployment link to display the updated web page is: 
[GitHub Pages](https://captainrich.github.io/Weather-Dashboard/) 

## Weather Dashboard Logic

1) The 'openweathermap' API is used to obtain the weather information for the specified city.  _There appears to be an issue with this API if the U.S. state abbreviation is used without the country specification (see discussion below)._
2) For each city specified, the specified location string is saved to a 'stack' for display as well as local storage.
3) On a restart or page refresh, the previously evaluated cities are retrieved from local storage, the 'stack' is reconstructed, and these cities are displayed for subsequent review.
4) The 'stack' is sized to 10 members.  If an 11th city is specified, the city at the bottom of the stack simply falls out the bottom.
5) Clicking on a city name in the stack (list) will display the weather information for that city.  The stack will remain unchanged.
6) A {Clear} button is available to blank out the stack as well as local storage.
7) Reducing the width of the browser window will resize the panels and search box.  In its smallest form, the 5-day forecast panels are displayed on top of each other.
8) For the selected/specified city:
* Alerts are implemented to notify the user if the specified city is not found - no data is saved in this instance.
* The weather for the current day is obtained (from the API) and displayed.
* The latitude and longitude from this 'API request' is used to implement an additional 'API endpoint' to obtain the 5-day forecast.
* The 5-day forecast is displayed in panels, below the weather details for the current day.
* Each date displayed is followed by the associated 'day of the week'.

** OpenWeatherAPI Issue **
According to the OpenWeather API documentation, city locations can be specified in one of three formats:
1) City
2) City,State
3) City,State,Country

The following observations have been made in implementing this API.
1) Specifying 'Houston' works as documented.
2) Specifying 'Houston,TX,USA' works as documented.
3) ***Specifying 'Houston,TX' does not work, a 404 error is returned from the API.***
4) Specifying 'Houston,Texas' does work as documented.

This behavior was confirmed in _'Postman'_.


## Application Screen Shot

![Workday Planner Image](https://github.com/CaptainRich/Weather-Dashboard/blob/master/weather-screenshot.jpg)

