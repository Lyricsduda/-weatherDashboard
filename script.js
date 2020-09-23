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
