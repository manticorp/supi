navigator.vibrate = navigator.vibrate ||
                  navigator.webkitVibrate ||
                  navigator.mozVibrate || 
                  navigator.msVibrate;
 
function MakeVibe(time){
    time = time || 500;
    if (navigator.vibrate) {
        navigator.vibrate(time);
    }
}

/**
 * Captures the address form submit
 */
$("#postcodeForm").submit(function( event ) {
    MakeVibe();
    getWeatherFromPostcode($('#postcode').val(), displayWeather);
    event.preventDefault();
});

function postcodeGetSubmit(){
    getWeatherFromPostcode($('#postcode').val(), displayWeather);
}

// Once DOM has loaded, start the weather processing!
jQuery().ready(function() {
    if(document.URL.indexOf("#debug") != -1){
        $('#debug').css('display','block');
    }
    getWeatherFromLocation(displayWeather);
});

/*
 * These are the units used by forecast.io
 */
var units = {
    si: {
        wind: "m/s",
        temp: "&deg;C",
        windMultiplier: 1,
        tempMultiplier: 1
    },
    us: {
        wind: "mph",
        temp: "&deg;f",
        windMultiplier: 2.2,
        tempMultiplier: 1.8
    },
    uk: {
        wind: "mph",
        temp: "&deg;C",
        windMultiplier: 2.2,
        tempMultiplier: 1
    },
    uk2: {
        wind: "mph",
        temp: "&deg;C",
        windMultiplier: 2.2,
        tempMultiplier: 1
    },
    ca: {
        wind: "kph",
        temp: "&deg;C",
        windMultiplier: 3.6,
        tempMultiplier: 1
    },
    auto: {
        wind: "m/s",
        temp: "&deg;C",
        windMultiplier: 1,
        tempMultiplier: 1
    }
};

/**
 * Once weather and location data has been aqcuired, display
 * it in the correct places.
 */
function displayWeather(weather){
    $('#weatherDisplay').html('');
    var iconSize = 64;
    
    var today = $('<div class="col-md-12 col-lg-6">');
    var tomorrow = $('<div class="col-md-12 col-lg-6">');
    
    // TODAY
    // wind and temp diffs
    var windDiff = compareWind(weather.today.averageWindSpeed, weather.yesterday.averageWindSpeed);
    var tempDiff = compareTemperature(weather.today.averageTemperature, weather.yesterday.averageTemperature,weather.today.units);
    
    // create wind display
    var wind = $('<div class="wind col-sm-6">')
        .append('<h3>Wind</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.today.averageWindSpeed) + ' ' + units[weather.today.units]["wind"] + '</h4>')
        .append('<h5 class="numeric">' + twoDP(weather.today.precipProbability*100) + '% chance of rain</h5>')
        .append('<p>' + windDiff.text + " yesterday (" +addSign(twoDP(windDiff.diff)) + " " + units[weather.today.units]["wind"] + ")</p>");
        
    // create temp display
    var temp = $('<div class="temp col-sm-6">')
        .append('<h3>Temperature</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.today.averageTemperature) + ' ' + units[weather.today.units]["temp"] + '</h4>')
        .append('<h5 class="numeric">Low: ' + twoDP(weather.today.temperatureMin) + ' ' + units[weather.today.units]["temp"] + ' High: ' + twoDP(weather.today.temperatureMax) + ' ' + units[weather.today.units]["temp"] + '</h5>')
        .append('<p>' + tempDiff.text + " yesterday (" + addSign(twoDP(tempDiff.diff)) + " " + units[weather.today.units]["temp"] + ")</p>");
    
    var todayTitleRow = $('<div class="row today title">').append($('<div class="col-md-12"><h2><a href="today.html" alt="Today\'s Weather" title="Today\'s Weather">Today</a></h2></div>'))
        .append('<canvas id="icon-today" width="' + iconSize + '" height="' + iconSize + '"></canvas>');
    var todaySummaryRow = $('<div class="row today summary">').append($('<div class="col-md-12">').append($('<p>' + weather.today.summary + '</p>')));
    var todayResultRow = $('<div class="row today result">').append(wind).append(temp);
        
    if(Math.round(tempDiff.diff) > 0){
        today.addClass('hotter');
    } else if(Math.round(tempDiff.diff) < 0) {
        today.addClass('colder');
    }
    
    // TOMORROW
    // wind and temp diffs
    windDiff = compareWind(weather.tomorrow.averageWindSpeed, weather.today.averageWindSpeed);
    tempDiff = compareTemperature(weather.tomorrow.averageTemperature, weather.today.averageTemperature,weather.tomorrow.units);
    
    // create wind display
    var wind = $('<div class="wind col-sm-6">')
        .append('<h3>Wind</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.tomorrow.averageWindSpeed) + ' ' + units[weather.tomorrow.units]["wind"] + '</h4>')
        .append('<h5 class="numeric">' + twoDP(weather.tomorrow.precipProbability*100) + '% chance of rain</h5>')
        .append('<p>' + windDiff.text + " today (" + addSign(twoDP(windDiff.diff)) + " " + units[weather.tomorrow.units]["wind"] + ")</p>");
    
    // create temp display
    var temp = $('<div class="temp col-sm-6">')
        .append('<h3>Temperature</h3>')
        .append('<h4 class="numeric">' + twoDP(weather.tomorrow.averageTemperature) + ' ' + units[weather.tomorrow.units]["temp"] + '</h4>')
        .append('<h5 class="numeric">Low: ' + twoDP(weather.tomorrow.temperatureMin) + ' ' + units[weather.tomorrow.units]["temp"] + ' High: ' + twoDP(weather.tomorrow.temperatureMax) + ' ' + units[weather.tomorrow.units]["temp"] + '</h5>')
        .append("<p>" + tempDiff.text + " today (" + addSign(twoDP(tempDiff.diff)) + " " + units[weather.tomorrow.units]["temp"] + ")</p>");
    
    var tomorrowTitleRow = $('<div class="row tomorrow title">').append($('<div class="col-md-12"><h2><a href="tomorrow.html" alt="Tomorrows Weather" title="Tomorrow\'s Weather">Tomorrow</a></h2></div>'))
        .append('<canvas id="icon-tomorrow" width="' + iconSize + '" height="' + iconSize + '"></canvas>');
    var tomorrowSummaryRow = $('<div class="row tomorrow summary">').append($('<div class="col-md-12">').append($('<p>' + weather.tomorrow.summary + '</p>')));
    var tomorrowResultRow = $('<div class="row tomorrow result">').append(wind).append(temp);
    
    today.append(todayTitleRow).append(todaySummaryRow).append(todayResultRow);
    tomorrow.append(tomorrowTitleRow).append(tomorrowSummaryRow).append(tomorrowResultRow);
    
    $('#subheading').text("Relative Weather for " + userLocation.city);
    $('#weatherDisplay').append(today).append(tomorrow);
        
    if(Math.round(tempDiff.diff) > 0){
        tomorrow.addClass('hotter');
    } else if(Math.round(tempDiff.diff) < 0) {
        tomorrow.addClass('colder');
    }
    
    // Creates the skycons
    var skycons = new Skycons({"color": "white"});
    skycons.add("icon-today",Skycons[weather.today.icon.toUpperCase().replace(/-/gi,'_')]);
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
    
    MakeVibe();
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


/* Fixed point scrolling for small devices */
/*
var scrollingOn = false;
var offsets = {};
$( window ).scroll($.debounce(function(data) {
    // Currently disabled...
    if(1==2 && $( document ).width() < 768){
    
        // different scrollable points
        offsets.todaytitle      = $('.row.today.title').offset();
        offsets.todaywind       = $('.row.today.result .wind').offset();
        offsets.todaytemp       = $('.row.today.result .temp').offset();
        offsets.tomorrowtitle   = $('.row.tomorrow.title').offset();
        offsets.tomorrowwind    = $('.row.tomorrow.result .wind').offset();
        offsets.tomorrowtemp    = $('.row.tomorrow.result .temp').offset();
        offsets.form            = $('#postcodeForm').offset();
        offsets.nav             = $('#nav-bottom').offset();
        offsets.desct           = $('#desct').offset();
        offsets.desc1           = $('#desc1').offset();
        offsets.desc2           = $('#desc2').offset();
        offsets.desc3           = $('#desc3').offset();
        offsets.desc4           = $('#desc4').offset();
        offsets.top             = {top: 0};
        
        var current = $(window).scrollTop();
        var closest = "";
        var curDiff = 99999;
        $.each(offsets, function( key, value ) {
            var diff = Math.abs(offsets[key].top - current);
            if(diff < curDiff){
                curDiff = diff;
                closest = key;
            }
        });
        
        animatedScroll(offsets[closest].top);
    }
},350));

/**
 * Animated scrolling to a certain offset in px
 *
function animatedScroll(offset){
    $("body").animate({ scrollTop: offset },200, function() {
        scrollingOn = false;
    });
}*/

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