var fiveDayForecast = document.querySelector("#five-day-forecast");
var currentDay = document.querySelector("#current-day");

// Creates empty array to hold previously searched items
var previousSearches = []


// URL for retrieving weather data of cities based on latitude and longitude
var requestWeatherForecastUrl = "https://api.openweathermap.org/data/2.5/forecast/?lat={lat}&lon={lon}&units=imperial&appid=91e1ab2853251b69b38a1c4b07c71d3c";
// URL for retrieving data of cities based on name, formatted to return only one city
var requestLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=1&appid=91e1ab2853251b69b38a1c4b07c71d3c";

var requestCurrentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=91e1ab2853251b69b38a1c4b07c71d3c"

var searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);
searchButton.addEventListener("click", saveSearch);

function searchCity() {
    // Selects entered text in search bar
    inputEl = document.querySelector("#city-search").value;

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

            // Formats the recieved data to only have one weather result per day for 5 days
            for (var i = 3; i < data.list.length; i += 8) {
                // console.log(data.list[i])

                // Creates container for each day
                forecast = document.createElement("section");
                forecast.setAttribute("class", "forecasted-days col-2");
                fiveDayForecast.appendChild(forecast)

                // Pulls data for each day
                date = data.list[i].dt_txt
                // console.log(date)
                temperature = data.list[i].main.temp;
                wind = data.list[i].wind.speed;
                humidity = data.list[i].main.humidity;

                // Creates element, applies text content based on above data, puts all p elements of the forecast into a class
                forecastDate = document.createElement("h3");
                forecastTemp = document.createElement("P");
                forecastWind = document.createElement("p");
                forecastHumidity = document.createElement("p");

                var currentDate = new Date();

                for (var j = 1; j <= 4; j++) {

                var day = currentDate.getDate()
                var month = currentDate.getMonth()
                var year = currentDate.getFullYear();
                var formattedDate = (day+j) + "/" + (month+j) + "/" + year;
                forecastDate.textContent = formattedDate;
                }
                console.log(forecastDate)

                forecastTemp.textContent = "Temp: " + temperature + " \u00B0F";
                forecastWind.textContent = "Wind: " + wind + " MPH";
                forecastHumidity.textContent = "Humidity: " + humidity + "%"

                forecastDate.setAttribute("class", "forecast-stat");
                forecastTemp.setAttribute("class", "forecast-stat");
                forecastWind.setAttribute("class", "forecast-stat");
                forecastHumidity.setAttribute("class", "forecast-stat");

                // Adds p elements into their specific day containers
                forecast.appendChild(forecastDate);
                forecast.appendChild(forecastTemp);
                forecast.appendChild(forecastWind);
                forecast.appendChild(forecastHumidity);

            }
        })
}

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

            cityName.textContent = data.name + " (" + new Date().getDate() + "/" + new Date().getMonth() + "/" + new Date().getFullYear() + ")"
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

function saveSearch() {
    inputEl = document.querySelector("#city-search").value;
    inputEl.textContent = inputEl.toUpperCase();
    previousSearches.unshift(inputEl);
    localStorage.setItem("previous-searches", JSON.stringify(previousSearches));
}