/**
 * Captures the address form submit
 */
$("#postcodeForm").submit(function( event ) {
    getWeatherFromPostcode($('#postcode').val(), displayWeather);
    event.preventDefault();
});

// Once DOM has loaded, start the weather processing!
jQuery().ready(function() {
    getWeatherFromLocation(displayWeather);
    getLocation(getTodayWeather);
});

function postcodeGetSubmit(){
    getWeatherFromPostcode($('#postcode').val(), displayWeather);
}

function storeLc(position, callback){
    if(typeof position.location != "undefined"){
        userLocation = position.location;
    } else if (typeof position.coords != "undefined"){
        userLocation = position.coords;
    } else {
        var err = {code: 998, message: "Position information failed."};
        locationError(err);
        return;
    }
    if(typeof position.city != "undefined" && typeof position.city.names.en != "undefined") {
        userLocation.city = position.city.names.en;
    }
    userLocation.time = new Date();
    if(typeof callback != "undefined")
        callback(userLocation);
}

function getLocation(callback){
   var options = {
      timeout: 5000,
      maximumAge: 0
    };
    if (navigator.geolocation){
        resetResults();
        var cb = callback;
        navigator.geolocation.getCurrentPosition(function(data){storeLc(data, cb);}, locationError, options);
    } 
    else 
    {
        var err = {code: 999, message: "Not supported"};
        locationError(err);
    }
}

function getTodayWeather(location){
    console.log(location);
    var times = {};
    times.today     = new Date();
    console.log("Hello");
    $.getJSON( "getWeather.php", 
    { 
        latitude: location.latitude, 
        longitude: location.longitude
    }).done(function( data ) {
        console.log("Hello there");
        console.log(data);
    }).fail(function( err ) {
        console.log(err);
    });
}

/*
 * These are the units used by forecast.io
 */
var units = {
    si: {
        wind: "m/s",
        temp: "&deg;C",
        windMultiplier: 1,
        tempMultiplier: 1,
        pressure: "hPa",
        nearestStormDistance: "km",
        precipIntensity: "mm/h",
        precipIntensityMax: "mm/h",
        precipAccumulation: "cm",
        temperature: "&deg;C",
        temperatureMin: "&deg;C",
        temperatureMax: "&deg;C",
        apparentTemperature: "&deg;C",
        dewPoint: "&deg;C",
        windSpeed: "m/s",
        visibility: "km"
    },
    us: {
        wind: "mph",
        temp: "&deg;f",
        windMultiplier: 2.2,
        tempMultiplier: 1.8,
        pressure: "mbars",
        nearestStormDistance: "km",
        precipIntensity: "in/h",
        precipIntensityMax: "in/h",
        precipAccumulation: "in",
        temperature: "&deg;f",
        temperatureMin: "&deg;f",
        temperatureMax: "&deg;f",
        apparentTemperature: "&deg;f",
        dewPoint: "&deg;f",
        windSpeed: "mph",
        visibility: "mi"
    },
    uk: {
        wind: "mph",
        temp: "&deg;C",
        windMultiplier: 2.2,
        tempMultiplier: 1,
        pressure: "hPa",
        nearestStormDistance: "km",
        precipIntensity: "mm/h",
        precipIntensityMax: "mm/h",
        precipAccumulation: "cm",
        temperature: "&deg;C",
        temperatureMin: "&deg;C",
        temperatureMax: "&deg;C",
        apparentTemperature: "&deg;C",
        dewPoint: "&deg;C",
        windSpeed: "mph",
        visibility: "mi"
    },
    uk2: {
        wind: "mph",
        temp: "&deg;C",
        windMultiplier: 2.2,
        tempMultiplier: 1,
        pressure: "hPa",
        nearestStormDistance: "km",
        precipIntensity: "mm/h",
        precipIntensityMax: "mm/h",
        precipAccumulation: "cm",
        temperature: "&deg;C",
        temperatureMin: "&deg;C",
        temperatureMax: "&deg;C",
        apparentTemperature: "&deg;C",
        dewPoint: "&deg;C",
        windSpeed: "mph",
        visibility: "mi"
    },
    ca: {
        wind: "kph",
        temp: "&deg;C",
        windMultiplier: 3.6,
        tempMultiplier: 1,
        pressure: "hPa",
        nearestStormDistance: "km",
        precipIntensity: "mm/h",
        precipIntensityMax: "mm/h",
        precipAccumulation: "cm",
        temperature: "&deg;C",
        temperatureMin: "&deg;C",
        temperatureMax: "&deg;C",
        apparentTemperature: "&deg;C",
        dewPoint: "&deg;C",
        windSpeed: "kph",
        visibility: "km"
    },
    auto: {
        wind: "m/s",
        temp: "&deg;C",
        windMultiplier: 1,
        tempMultiplier: 1,
        pressure: "hPa",
        nearestStormDistance: "km",
        precipIntensity: "mm/h",
        precipIntensityMax: "mm/h",
        precipAccumulation: "cm",
        temperature: "&deg;C",
        temperatureMin: "&deg;C",
        temperatureMax: "&deg;C",
        apparentTemperature: "&deg;C",
        dewPoint: "&deg;C",
        windSpeed: "m/s",
        visibility: "km"
    }
};

/**
 * Once weather and location data has been aqcuired, display
 * it in the correct places.
 */
function displayWeather(weather){
    $('#weatherDisplay').html('');
    var iconSize = 64;
    
    var today = $('<div class="col-sm-12">');
    
    // TODAY
    // wind and temp diffs
    var windDiff = compareWind(weather.today.averageWindSpeed, weather.yesterday.averageWindSpeed);
    var tempDiff = compareTemperature(weather.today.averageTemperature, weather.yesterday.averageTemperature,weather.today.units);
    
    var titleRow = $('<div class="row today title">')
        .append($('<div class="col-sm-12"><h2>Today</h2></div>'))
        .append('<canvas id="icon-today" width="' + iconSize + '" height="' + iconSize + '"></canvas>')
        .append($('<p>' + weather.today.summary + '</p>'));
    
    var sunriseTime = new Date(weather.today.sunriseTime*1000);
    var sunsetTime = new Date(weather.today.sunsetTime*1000);
    var summary = $('<div class="wind col-sm-4">')
        .append('<h3>Stats</h3>')
        .append('<p>' + weather.today.cloudCover*100 + '% Cloud Cover &bullet; Pressure: ' + weather.today.pressure + ' ' + units[weather.today.units]["pressure"] + '</p>')
        .append('<p>Visibility: ' + weather.today.visibility  + units[weather.today.units]["visibility"] + ' &bullet; Relative humidity: ' + weather.today.humidity  + '</p>')
        .append('<p>Sunrise: ' +  sunriseTime.getHours() + ':' + sunriseTime.getMinutes() + ':' + sunriseTime.getSeconds() + ' &bullet; Sunset: ' +  sunsetTime.getHours() + ':' + sunsetTime.getMinutes() + ':' + sunsetTime.getSeconds() + '</p>');
        
    // create wind display
    var wind = $('<div class="wind col-sm-4">')
        .append('<h3>Wind</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.today.averageWindSpeed) + ' ' + units[weather.today.units]["wind"] + '</h4>')
        .append('<h5 class="numeric">' + twoDP(weather.today.precipProbability*100) + '% chance of rain</h5>')
        .append('<p>' + windDiff.text + " yesterday (" +addSign(twoDP(windDiff.diff)) + " " + units[weather.today.units]["wind"] + ")</p>");
        
    // create temp display
    var temp = $('<div class="temp col-sm-4">')
        .append('<h3>Temperature</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.today.averageTemperature) + ' ' + units[weather.today.units]["temp"] + '</h4>')
        .append('<h5 class="numeric">Low: ' + twoDP(weather.today.temperatureMin) + ' ' + units[weather.today.units]["temp"] + ' High: ' + twoDP(weather.today.temperatureMax) + ' ' + units[weather.today.units]["temp"] + '</h5>')
        .append('<p>' + tempDiff.text + " yesterday (" + addSign(twoDP(tempDiff.diff)) + " " + units[weather.today.units]["temp"] + ")</p>");
    
    // The result row, with the wind and temp boxes
    var todayResultRow = $('<div class="row today result">').append(summary).append(wind).append(temp);
    
    // Adds the hotter/colder classes to the temp box
    if(Math.round(tempDiff.diff) > 0){
        today.addClass('hotter');
    } else if(Math.round(tempDiff.diff) < 0) {
        today.addClass('colder');
    }
    
    today.append(titleRow).append(todayResultRow);
    
    $('#subheading').text("Relative Weather for " + userLocation.city);
    $('#weatherDisplay').append(today);
    
    // Creates the skycons
    var skycons = new Skycons({"color": "white"});
    skycons.add("icon-today",Skycons[weather.today.icon.toUpperCase().replace(/-/gi,'_')]);
    skycons.play();
    
    // Creates the map
    var userLatlng = new google.maps.LatLng(userLocation.latitude, userLocation.longitude);
    var mapOptions = {
        center: userLatlng,
        zoom: 11
    };
    
    var mapHeight = $(window).height() > 600 ? 300 : 200;
    $('#map-canvas').css('min-height', mapHeight);
    
    $('#map-canvas').html('');
    var map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);

    var marker = new google.maps.Marker({
        position: userLatlng,
        map: map
    });
    
    var maxHeight = 0;
    $(".today.result div.col-sm-4").each(function(){
        if(maxHeight < $(this).height()) maxHeight = $(this).height();
    });
    $(".today.result div.col-sm-4").each(function(){
        $(this).height(maxHeight);
    });
}

/**
 * Rounds num to two decimal places
 */
function twoDP(num){
    return ((Math.round(num*100))/100);
}

/**
 * Adds a + to positive numbers and a plusminus to 0
 */
function addSign(num){
    addition = "";
    if(num > 0) addition = "+";
    else if(num == 0) addition = "&plusmn;";
    return addition + num;
}

/**
 * highlights the input
 */
var timer;
var timer2;
function highlight(input) {
    clearTimeout(timer);
    if(input.hasClass('highlight')){
        input.removeClass('highlight');
        clearTimeout(timer2);
        timer2 = setTimeout(function(){
            input.addClass('highlight');
            timer = setTimeout(function(){
                input.removeClass('highlight');
            },3000);
        },50);
    } else {
        input.addClass('highlight');
        timer = setTimeout(function(){
            input.removeClass('highlight');
        },3000);
    }
}

/**
 * Adds toWeatherString method for date. This
 * outputs the format needed for the forecast.io
 * API service.
 */
( function() {
function pad(number) {
  if ( number < 10 ) {
    return '0' + number;
  }
  return number;
}
Date.prototype.toWeatherString = function() {
  return this.getUTCFullYear() +
    '-' + pad( this.getUTCMonth() + 1 ) +
    '-' + pad( this.getUTCDate() ) +
    'T' + pad( this.getUTCHours() ) +
    ':' + pad( this.getUTCMinutes() ) +
    ':' + pad( this.getUTCSeconds() ) +
    'Z';
};
}() );