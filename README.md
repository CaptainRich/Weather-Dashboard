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

1) The 'openweathermap' API is used to obtain the weather information for the specified city.
2) For each city specified, the specified location string is saved to a 'stack' for display as well as local storage.
3) On a restart or page refresh, the previously evaluated cities are retrieved from local storage, the 'stack' is reconstructed, and these cities are displayed for subsequent review.
4) The 'stack' is sized to 10 members.  If an 11th city is specified, the city at the bottom of the stack simply falls out the bottom.
5) Clicking on a city name in the stack (list) will display the weather information for that city.  The stack will remain unchanged.

6) For the selected/specified city:
* The weather for the current day is obtained (from the API) and displayed.
* The latitude and longitude from this 'API request' is used to implement an additional 'API endpoint' to obtain the 5-day forecast.
* The 5-day forecast is displayed in panels, below the weather details for the current day.


## Application Screen Shot

![Workday Planner Image](https://github.com/CaptainRich/Weather-Dashboard/blob/master/weather-screenshot.jpg)

