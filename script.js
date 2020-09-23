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
    var sttoredWeatherLocationLocation = JSON.parse(localStorage.getItem("currentCity"));

    if (sttoredWeatherLocationLocation !== null) {
        cityLocationName = sttoredWeatherLocationLocation;

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
