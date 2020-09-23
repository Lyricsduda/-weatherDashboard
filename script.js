// Declaered variables
var cityLocationList = [];
var cityLocationName;

// Local storage functions
initCityList();
initWeather();

// Function that places the user data that they searched into the DOM
function renderCities() {
    $("#cityList").empty();
    $("#cityInput").val("");

    for (i = 0; i < cityLocationList.length; i++) {
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityLocationList[i]);
        a.text(cityLocationList[i]);
        $("#cityList").prepend(a);
    }
}

// Function that pulls the cityLocationList array from local storage
function initCityList() {
    var storedCitiesLocation = JSON.parse(localStorage.getItem("cities"));

    if (storedCitiesLocation !== null) {
        cityLocationList = storedCitiesLocation;
    }

    renderCities();
}

// Funtion that pulls the city that was searched into local storage to be displayed
function initWeather() {
    var storedWeatherLocation = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeatherLocation !== null) {
        cityLocationName = storedWeatherLocation;

        displayWeatherLocation();
        displayLocationFiveDayForecast();
    }
}

// Function to save the cityLocalList into local storage
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityLocationList));
}

// Fucntion that saves the current city into local storage
function storeCurrentCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityLocationName));
}

// onClick event to activate the search button
$("#citySearchBtn").on("click", function (event) {
    event.preventDefault();

    cityLocationName = $("#cityInput").val().trim();
    if (cityLocationName === "") {
        alert("Please enter a city to look the weather up for")

    } else if (cityLocationList.length >= 5) {
        cityLocationList.shift();
        cityLocationList.push(cityLocationName);

    } else {
        cityLocationList.push(cityLocationName);
    }
    storeCurrentCity();
    storeCityArray();
    renderCities();
    displayWeatherLocation();
    displayLocationFiveDayForecast();
});

// Event handler that activates after the user enters a search term
$("#cityInput").keypress(function (e) {
    if (e.which == 13) {
        $("#citySearchBtn").click();
    }
})

// Function to call the OpenweatherAPI to call the weather information
async function displayWeatherLocation() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityLocationName + "&units=imperial&appid=c5dfa25345c05369d6aadd02f49f5e15";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
    })


    var currentLocationWeatherDiv = $("<div class='card-body' id='currentWeather'>");
    var getCurrentLocationCity = response.name;
    var date = new Date();
    var val = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    var getCurrentLocationWeather = response.weather[0].icon;
    var displayCurrentWeather = $(getCurrentLocationWeather);
    var currentCityLocationEl = $("<h3 class = 'card-body'>").text(getCurrentLocationCity + " (" + val + ")");
    currentCityLocationEl.append(displayCurrentWeather);
    currentLocationWeatherDiv.append(currentCityLocationEl);
    var getLocationTemp = response.main.temp.toFixed(1);
    var locationTempEl = $("<p class='card-text'>").text("Temperature: " + getLocationTemp + "° F");
    currentLocationWeatherDiv.append(locationTempEl);
    var getLocationHumidity = response.main.humidity;
    var locationHumidityEl = $("<p class='card-text'>").text("Humidity: " + getLocationHumidity + "%");
    currentLocationWeatherDiv.append(locationHumidityEl);
    var getLocationWindSpeed = response.wind.speed.toFixed(1);
    var LocationWindSpeedEl = $("<p class='card-text'>").text("Wind Speed: " + getLocationWindSpeed + " mph");
    currentLocationWeatherDiv.append(LocationWindSpeedEl);
    var getLong = response.coord.lon;
    var getLat = response.coord.lat;

    var uvURL = "https://api.openweathermap.org/data/2.5/uvi?appid=d3b85d453bf90d469c82e650a0a3da26&lat=" + getLat + "&lon=" + getLong;
    var uvResponse = await $.ajax({
        url: uvURL,
        method: "GET"
    })

    // Pulls the UV info from the API and displays it with styling
    var getLocationUVIndex = uvResponse.value;
    var uvLocationNumber = $("<span>");
    if (getLocationUVIndex > 0 && getLocationUVIndex <= 2.99) {
        uvLocationNumber.addClass("lowUVI");
    } else if (getLocationUVIndex >= 3 && getLocationUVIndex <= 5.99) {
        uvLocationNumber.addClass("moderateUVI");
    } else if (getLocationUVIndex >= 6 && getLocationUVIndex <= 7.99) {
        uvLocationNumber.addClass("highUVI");
    } else if (getLocationUVIndex >= 8 && getLocationUVIndex <= 10.99) {
        uvLocationNumber.addClass("veryHighUVI");
    } else {
        uvLocationNumber.addClass("extremeUVI");
    }
    uvLocationNumber.text(getLocationUVIndex);
    var uvIndexEl = $("<p class='card-text'>").text("UV Index: ");
    uvLocationNumber.appendTo(uvIndexEl);
    currentLocationWeatherDiv.append(uvIndexEl);
    $("#weatherContainer").html(currentLocationWeatherDiv);
}
// Function to call the OpenweatherAPI to call the 5 day forcast
async function displayLocationFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityLocationName + "&units=imperial&appid=c5dfa25345c05369d6aadd02f49f5e15";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
    })
    var locationForecastDiv = $("<div  id='fiveDayForecast'>");
    var locationForecastHeader = $("<h5 class='card-header border-secondary'>").text("5 Day Forecast");
    locationForecastDiv.append(locationForecastHeader);
    var cardDeck = $("<div  class='card-deck'>");
    locationForecastDiv.append(cardDeck);


    for (i = 0; i < 5; i++) {
        var locationForecastCard = $("<div class='card mb-3 mt-3'>");
        var locationCardBody = $("<div class='card-body'>");
        var date = new Date();
        var val = (date.getMonth() + 1) + "/" + (date.getDate() + i + 1) + "/" + date.getFullYear();
        var locationForecastDate = $("<h5 class='card-title'>").text(val);

        locationCardBody.append(locationForecastDate);
        var getCurrentLocationWeather = response.list[i].weather[0].icon;

        var displayWeatherLocation = $(getCurrentLocationWeather);
        locationCardBody.append(displayWeatherLocation);
        var getLocationTemp = response.list[i].main.temp;
        var locationTempEl = $("<p class='card-text'>").text("Temp: " + getLocationTemp + "° F");
        locationCardBody.append(locationTempEl);
        var getLocationHumidity = response.list[i].main.humidity;
        var locationHumidityEl = $("<p class='card-text'>").text("Humidity: " + getLocationHumidity + "%");
        locationCardBody.append(locationHumidityEl);
        locationForecastCard.append(locationCardBody);
        cardDeck.append(locationForecastCard);
    }
    $("#forecastContainer").html(locationForecastDiv);
}
// Function to send infromation from the weather history to the displayWeatherLocation function
function historydisplayWeatherLocation() {
    cityLocationName = $(this).attr("data-name");
    displayWeatherLocation();
    displayLocationFiveDayForecast();


}

$(document).on("click", ".city", historydisplayWeatherLocation);
