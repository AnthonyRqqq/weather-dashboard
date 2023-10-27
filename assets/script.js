var fiveDayForecast = document.querySelector("#five-day-forecast");


// URL for retrieving weather data of cities based on latitude and longitude
var requestWeatherForecastUrl = "https://api.openweathermap.org/data/2.5/forecast/?lat={lat}&lon={lon}&units=imperial&appid=91e1ab2853251b69b38a1c4b07c71d3c";
// URL for retrieving data of cities based on name, formatted to return only one city
var requestLocationUrl = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit=1&appid=91e1ab2853251b69b38a1c4b07c71d3c";

var requestCurrentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=91e1ab2853251b69b38a1c4b07c71d3c"

var searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", searchCity);

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
            displayCurrentWeather(date);
            displayForecast(data);
        })


}

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
                console.log(data.list[i])

                // Creates container for each day
                forecast = document.createElement("section");
                forecast.setAttribute("class", "forecasted-days col-2");
                fiveDayForecast.appendChild(forecast)

                // Pulls data for each day
                date = data.list[i].dt_txt
                console.log(date)
                temperature = data.list[i].main.temp;
                wind = data.list[i].wind.speed;
                humidity = data.list[i].main.humidity;

                // Creates element, applies text content based on above data, puts all p elements of the forecast into a class
                forecastDate = document.createElement("h3");
                forecastTemp = document.createElement("P");
                forecastWind = document.createElement("p");
                forecastHumidity = document.createElement("p");

                forecastDate.textContent = date
                forecastTemp.textContent = "Temp: " + temperature + " \u00B0F";
                forecastWind.textContent = "Wind: " + wind + " MPH";
                forecastHumidity.textContent = "Humidity: " + humidity + "%"

                forecastDate.setAttribute("class", "forecast-stat");
                forecastTemp.setAttribute("class", "forecast-stat");
                forecastWind.setAttribute("class", "forecast-stat");
                forecastHumidity.setAttribute("class", "forecast-stat");

                // Adds p elements into their specific day containers
                forecast.appendChild(forecastDate)
                forecast.appendChild(forecastTemp);
                forecast.appendChild(forecastWind);
                forecast.appendChild(forecastHumidity);

            }
        })
}

