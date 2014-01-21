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
});

function postcodeGetSubmit(){
    getWeatherFromPostcode($('#postcode').val(), displayWeather);
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
    
    var tomorrow = $('<div class="col-sm-12">');
    
    // TODAY
    // wind and temp diffs
    var windDiff = compareWind(weather.tomorrow.averageWindSpeed, weather.today.averageWindSpeed);
    var tempDiff = compareTemperature(weather.tomorrow.averageTemperature, weather.today.averageTemperature,weather.tomorrow.units);
    
    var titleRow = $('<div class="row tomorrow title">')
        .append($('<div class="col-sm-12"><h2>Tomorrow</h2></div>'))
        .append('<canvas id="icon-tomorrow" width="' + iconSize + '" height="' + iconSize + '"></canvas>')
        .append($('<p>' + weather.tomorrow.summary + '</p>'));
    
    var sunriseTime = new Date(weather.tomorrow.sunriseTime*1000);
    var sunsetTime = new Date(weather.tomorrow.sunsetTime*1000);
    var summary = $('<div class="wind col-sm-4">')
        .append('<h3>Stats</h3>')
        .append('<p>' + weather.tomorrow.cloudCover*100 + '% Cloud Cover &bullet; Pressure: ' + weather.tomorrow.pressure + ' ' + units[weather.tomorrow.units]["pressure"] + '</p>')
        .append('<p>Visibility: ' + weather.tomorrow.visibility  + units[weather.tomorrow.units]["visibility"] + ' &bullet; Relative humidity: ' + weather.tomorrow.humidity  + '</p>')
        .append('<p>Sunrise: ' +  sunriseTime.getHours() + ':' + sunriseTime.getMinutes() + ':' + sunriseTime.getSeconds() + ' &bullet; Sunset: ' +  sunsetTime.getHours() + ':' + sunsetTime.getMinutes() + ':' + sunsetTime.getSeconds() + '</p>');
        
    // create wind display
    var wind = $('<div class="wind col-sm-4">')
        .append('<h3>Wind</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.tomorrow.averageWindSpeed) + ' ' + units[weather.tomorrow.units]["wind"] + '</h4>')
        .append('<h5 class="numeric">' + twoDP(weather.tomorrow.precipProbability*100) + '% chance of rain</h5>')
        .append('<p>' + windDiff.text + " today (" +addSign(twoDP(windDiff.diff)) + " " + units[weather.tomorrow.units]["wind"] + ")</p>");
        
    // create temp display
    var temp = $('<div class="temp col-sm-4">')
        .append('<h3>Temperature</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.tomorrow.averageTemperature) + ' ' + units[weather.tomorrow.units]["temp"] + '</h4>')
        .append('<h5 class="numeric">Low: ' + twoDP(weather.tomorrow.temperatureMin) + ' ' + units[weather.tomorrow.units]["temp"] + ' High: ' + twoDP(weather.tomorrow.temperatureMax) + ' ' + units[weather.tomorrow.units]["temp"] + '</h5>')
        .append('<p>' + tempDiff.text + " today (" + addSign(twoDP(tempDiff.diff)) + " " + units[weather.tomorrow.units]["temp"] + ")</p>");
    
    // The result row, with the wind and temp boxes
    var tomorrowResultRow = $('<div class="row tomorrow result">').append(summary).append(wind).append(temp);
    
    // Adds the hotter/colder classes to the temp box
    if(Math.round(tempDiff.diff) > 0){
        tomorrow.addClass('hotter');
    } else if(Math.round(tempDiff.diff) < 0) {
        tomorrow.addClass('colder');
    }
    
    tomorrow.append(titleRow).append(tomorrowResultRow);
    
    $('#subheading').text("Relative Weather for " + userLocation.city);
    $('#weatherDisplay').append(tomorrow);
    
    // Creates the skycons
    var skycons = new Skycons({"color": "white"});
    skycons.add("icon-tomorrow",Skycons[weather.tomorrow.icon.toUpperCase().replace(/-/gi,'_')]);
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
    $(".tomorrow.result div.col-sm-4").each(function(){
        if(maxHeight < $(this).height()) maxHeight = $(this).height();
    });
    $(".tomorrow.result div.col-sm-4").each(function(){
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