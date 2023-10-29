var fiveDayForecast = document.querySelector("#five-day-forecast");
var currentDay = document.querySelector("#current-day");
var sidebar = document.querySelector("#sidebar");

// Creates empty array to hold previously searched items
var previousSearches = [];
previousSearches = previousSearches.concat(JSON.parse(localStorage.getItem("previous-searches")));
// // Keeps the previous searches limited to 5
if (previousSearches.length > 5) {
    previousSearches.pop();
    localStorage.setItem("previous-searches", JSON.stringify(previousSearches));
}
// Ensures blank button won't be created with empty array when no cities have been searched yet
if (previousSearches[0] !== null) {
renderPreviousSearches();
}



// URL for retrieving weather forecast data of cities based on latitude and longitude using farenheight
var requestWeatherForecastUrl = "https://api.openweathermap.org/data/2.5/forecast/?lat={lat}&lon={lon}&units=imperial&appid=91e1ab2853251b69b38a1c4b07c71d3c";

// URL for retrieving data of cities based on name, formatted to return only one city
var requestLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=1&appid=91e1ab2853251b69b38a1c4b07c71d3c";

// URL for retrieving current weather data of cities based on latitude and longitude using farenheight
var requestCurrentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=91e1ab2853251b69b38a1c4b07c71d3c"

var searchButton = document.querySelector("#search-button");
// Searches city and displays current as well as five-day forecast
searchButton.addEventListener("click", searchCity);
// Saves the searched city using JSON
searchButton.addEventListener("click", saveSearch);

// Allows user to click previously searched and saved cities and receive data
sidebar.addEventListener("click", function(event) {
    if (event.target.classList.contains("previous-search-button")) {
      searchCityAgain(event);
    }
  });

function searchCity() {
    // Selects entered text in search bar
    inputEl = document.querySelector("#city-search").value;
    // Ensures data is present within the text field to be searched
    if (inputEl === "") {
        return;
    }

    // Creates new string and fetches coordinates using the text in search bar
    requestLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + inputEl + "&limit=1&appid=91e1ab2853251b69b38a1c4b07c71d3c";
    fetch(requestLocationUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeather(data);
            displayForecast(data);
        })


}

// For use in searching cities via buttons elements for previously searched cities
function searchCityAgain(event) {
    var searchAgainName = event.target.textContent;

    // Creates new string and fetches coordinates using the text in search bar
    requestLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchAgainName + "&limit=1&appid=91e1ab2853251b69b38a1c4b07c71d3c";
    fetch(requestLocationUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            displayCurrentWeather(data);
            displayForecast(data);
        })


}

// For displaying five-day forecast
function displayForecast(data) {
    // Pulls latitude and longitude from fetch request on line 18
    var latitude = data[0].lat;
    var longitude = data[0].lon;

    // Creates new string and fetches five day forecast using the retrieved latitude and longitude
    requestWeatherForecastUrl = "https://api.openweathermap.org/data/2.5/forecast/?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=91e1ab2853251b69b38a1c4b07c71d3c";
    fetch(requestWeatherForecastUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {

            // Clears any preexisting data from previous searches
            fiveDayForecast.innerHTML = "";

            // Formats the recieved data to only have one weather result per day for 5 days using noon as the time
            for (var i = 3; i < data.list.length; i += 8) {
                console.log(data.list[i])

                // Creates container for each day
                forecast = document.createElement("section");
                forecast.setAttribute("class", "forecasted-days col-2");
                fiveDayForecast.appendChild(forecast)

                // Pulls data for each day
                // Determines weather and adds appropriate icon
                weather = data.list[i].weather[0].main;
                if (weather === "Clouds") {
                    weather = "\u2601";
                } else if (weather === "Rain") {
                    weather = "\u2614";
                } else {
                    weather = "\u2600";
                }

                date = data.list[i].dt_txt;
                temperature = data.list[i].main.temp;
                wind = data.list[i].wind.speed;
                humidity = data.list[i].main.humidity;

                // Creates element, applies text content based on above data, puts all p elements of the forecast into a class
                forecastDate = document.createElement("h3");
                forecastWeather = document.createElement("p");
                forecastTemp = document.createElement("P");
                forecastWind = document.createElement("p");
                forecastHumidity = document.createElement("p");

                // Formats the date into something more visually appealing
                forecastDate.textContent = date.slice(8,10) + "/" + date.slice(5,7) + "/" + date.slice(0,4);
                forecastWeather.textContent = weather;
                forecastTemp.textContent = "Temp: " + temperature + " \u00B0F";
                forecastWind.textContent = "Wind: " + wind + " MPH";
                forecastHumidity.textContent = "Humidity: " + humidity + "%";

                forecastDate.setAttribute("class", "forecast-stat");
                forecastWeather.setAttribute("class", "forecast-stat");
                forecastTemp.setAttribute("class", "forecast-stat");
                forecastWind.setAttribute("class", "forecast-stat");
                forecastHumidity.setAttribute("class", "forecast-stat");

                // Adds p elements into their specific day containers
                forecast.appendChild(forecastDate);
                forecast.appendChild(forecastWeather);
                forecast.appendChild(forecastTemp);
                forecast.appendChild(forecastWind);
                forecast.appendChild(forecastHumidity);

            }
            }
        )}


// For displaying current forecast
function displayCurrentWeather(data) {
    // Pulls latitude and longitude from fetch request on line 18
    var latitude = data[0].lat;
    var longitude = data[0].lon;
    
    requestCurrentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather/?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=91e1ab2853251b69b38a1c4b07c71d3c";
    fetch(requestCurrentWeatherUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function(data) {
            console.log(data);
            currentDay.innerHTML = "";

            // Creates element, applies text content based on above data, puts all elements of the current day into a class
            cityName = document.createElement("h3");
            currentTemp = document.createElement("p");
            currentWind = document.createElement("p");
            currentHumidity = document.createElement("p");

            weather = data.weather[0].main;
                if (weather === "Clouds") {
                    weather = "\u2601";
                } else if (weather === "Rain") {
                    weather = "\u2614";
                } else {
                    weather = "\u2600";
                }

            cityName.textContent = data.name + " (" + new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear() + ") " + weather;
            currentTemp.textContent = "Temp: " + data.main.temp + " \u00B0F";
            currentWind.textContent = "Wind: " + data.wind.speed + " MPH";
            currentHumidity.textContent = "Humidity: " +data.main.humidity + "%";

            cityName.setAttribute("class", "current-weather");
            currentTemp.setAttribute("class", "current-weather");
            currentWind.setAttribute("class", "current-weather");
            currentHumidity.setAttribute("class", "current-weather");

            // Adds child elements into current day container
            currentDay.appendChild(cityName);
            currentDay.appendChild(currentTemp);
            currentDay.appendChild(currentWind);
            currentDay.appendChild(currentHumidity);
        })
}

// For saving searched cities using JSON
function saveSearch() {
    inputEl = document.querySelector("#city-search").value;
        // Ensures data is present within the text field to be searched
    if (inputEl === "") {
        return;
    }

    // Capitalizes first letter of city name for more visually pleasing buttons created during the renderPreviousSearches function
    inputEl = inputEl.charAt(0).toUpperCase() + inputEl.slice(1);

    // Removes the null element from an empty array when first city is searched and saved
    if (previousSearches[0] === null) {
        previousSearches.pop();
    }

    // Adds newly searched city to front of array
    previousSearches.unshift(inputEl);

    //Limits array length to 5
    if (previousSearches.length > 5) {
        previousSearches.pop();
    }
    localStorage.setItem("previous-searches", JSON.stringify(previousSearches));

    renderPreviousSearches();
}

// For rendering previously searched cities
function renderPreviousSearches() {
    // Checks for previously created buttons and removes before creating and appending new button list
    // Code created with assistance from Xpert Learning Assistant
    var btnsCheck = document.querySelectorAll(".previous-search-button")
    btnsCheck.forEach(function(btn) {
        btn.remove();
      });

    // Creates a button element for each previously searched city up to 5 and appends it to sidebar
    for (var i = 0; i < previousSearches.length; i++) {
    previousSearchBtn = document.createElement("button");
    previousSearchBtn.setAttribute("class", "previous-search-button");
    previousSearchBtn.textContent = previousSearches[i];
    sidebar.appendChild(previousSearchBtn);
    }
}
