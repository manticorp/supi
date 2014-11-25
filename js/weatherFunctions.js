/**
 * Get the weather data for a lat, lon pair.
 */
function getWeather(lat, lon, callback) {
    // console.log("New Requests");
    var weather = {};
    var times = {};
    times.today     = new Date();
    times.yesterday = new Date();
    times.tomorrow  = new Date();

    times.yesterday.setDate(times.today.getDate()-1);
    times.tomorrow.setDate(times.today.getDate()+1);
    $.when( 
        $.ajax({
            url:"http://supiapi.hmp.is.it", 
            type: 'POST',
            dataType: 'json',
            data: { 
                latitude: lat, 
                longitude: lon,
                time: times.today.toWeatherString()
            }
        }), 
        $.ajax({
            url:"http://supiapi.hmp.is.it", 
            type: 'POST',
            dataType: 'json',
            data: { 
                latitude: lat, 
                longitude: lon,  
                time: times.tomorrow.toWeatherString()
            }
        }), 
        $.ajax({
            url:"http://supiapi.hmp.is.it", 
            type: 'POST',
            dataType: 'json',
            data: { 
                latitude: lat, 
                longitude: lon, 
                time: times.yesterday.toWeatherString()
            }
        }) 
    ).done(function( today, tomorrow, yesterday ) {
        weather.time = new Date();
        weather.today = today[0];
        weather.tomorrow = tomorrow[0];
        weather.yesterday = yesterday[0];
        if(typeof callback !== "undefined") callback(weather);
    }).fail(function( jqxhr, textStatus, error ){
        var err = textStatus + ", " + error;
        console.log(jqxhr.responseText);
        console.log( "Request Failed: " + err );
    });
}

/**
 * Gets the address from a lat, lon pair
 */
function getCityFromLatLng(lat, lon, callback){
    var gmapsapi = "http://maps.googleapis.com/maps/api/geocode/json?";
    var city;
    $.getJSON(gmapsapi,{
        latlng: lat + "," + lon,
        sensor: "true"
    },function(data){
        city = "Unknown";
        if(typeof data.results != "undefined" && data.results.length > 1)
            city = data['results'][1]['formatted_address'];
        userLocation.city = city;
        if(typeof callback !== "undefined") callback(city);
    });
}

/**
 * Error handler when there is a location error.
 */
function locationError(err) {
    $('#weatherDisplay').html('<div class="col-xs-12"><div class="alert alert-info">Your location could not be determined, please either allow geolocation or type and address below.</div></div>');
    console.error('ERROR(' + err.code + '): ' + err.message, err);
};

/**
 * Stores the position data in the userLocation object
 */
function storeLocation(position, callback) {
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
    } else {
        userLocation.city = getCityFromLatLng(userLocation.latitude, userLocation.longitude);
    }
    userLocation.time = new Date();
    if(typeof callback != "undefined")
        getWeather(userLocation.latitude, userLocation.longitude, callback);
    else
        getWeather(userLocation.latitude, userLocation.longitude);
}

/**
 * Resets the weather display
 */
function resetResults(){
    $('#weatherDisplay').slideUp(0);
    $('#weatherDisplay').html('<div class="loading-spinner"></div>');
    $('#weatherDisplay').slideDown(500);
    $('#map-canvas').css('min-height',0);
}

/** 
 * Gets the weather using W3C geo info.
 */
function getWeatherFromLocation(callback) {
    console.log('Getting weather from location');
   var options = {
      timeout: 1000,
      maximumAge: 1000*60*10
    };
    if (navigator.geolocation){
        resetResults();
        var cb = callback;
        navigator.geolocation.getCurrentPosition(function(data){storeLocation(data, cb);}, locationError, options);
    } 
    else 
    {
        var err = {code: 999, message: "Not supported"};
        locationError(err);
    }
}

/**
 * Gets the weather from the address found in
 * the input box on the page.
 */
function getWeatherFromPostcode(postcode, callback) {
    // lookup postcode, store userLocation, getWeather
    postcode = $('#postcode').val();
    userLocation = {};
    userLocation.city = postcode;
    resetResults();
    $.ajax({
        url:"http://supiapi.hmp.is.it/address.php", 
        type: 'POST',
        dataType: 'json',
        data: { 
            address: postcode
        }
    }).done(function(data){
        userLocation.latitude = data.latitude;
        userLocation.longitude = data.longitude;
        if(typeof callback != "undefined")
            getWeather(data.latitude, data.longitude, callback);
        else
            getWeather(data.latitude, data.longitude);
    }).fail(function( jqxhr, textStatus, error ){
        $('#weatherDisplay').html('<div class="col-xs-12"><div class="alert alert-info">The address could not be found, please try a different address.</div></div>');
        var err = textStatus + ", " + error;
        console.log(jqxhr.responseText);
        console.log( "Request Failed: " + err );
    });
}

/**
 * Comapares the temp of a to b (e.g. today to yesterday)
 */
function compareTemperature(a, b, unit){
    if(typeof unit === "undefined") unit = "si";
    var tempa, tempb;
    if(typeof units[unit] !== "undefined"){
        if(units[unit]['temp'] == "&deg;C"){
            var tempa = CtoK(a);
            var tempb = CtoK(b);
        } else if (units[unit]['temp'] == "&deg;f"){
            var tempa = FtoK(a);
            var tempb = FtoK(b);
        } else {
            var tempa = a;
            var tempb = b;
        }
    } else {
        var tempa = a;
        var tempb = b;
    }
    var diff = ((tempa/tempb));
    // console.log("A = " + tempa + " B = " + tempb + " Diff = " + diff);
    /*
     * if a > b then diff > 1 (it's hotter in a than b)
     * if a = b then diff = 1 (it's the same temp in a as b)
     * if a < b then diff < 1 (it's colder in a than b)
     */
    var text;
    if(diff < 1){
        text = "Not noticeably colder than";
        if(diff > 0.995){
            text = "Barely noticeably colder than";
        } else if(diff > 0.996){
            text = "A bit colder than";
        } else  if(diff > 0.992){
            text = "Noticeably colder than";
        } else if(diff > 0.984){
            text = "Quite a bit colder than";
        } else if(diff > 0.98) {
            text = "Quite a lot colder than";
        } else if(diff > 0.97) {
            text = "A lot colder than";
        } else if(diff > 0.955) {
            text = "Very much colder than";
        } else if(diff > 0.95) {
            text = "Freezing compared to";
        } else if(diff > 0.9) {
            text = "Absolutely freezing compared to";
        } else if(diff <= 0.9) {
            text = "Where do you live?! It's CRAZY cold compared to yesterday";
        }
    } else if (diff === 1) {
        text = "The same temperature as";
    } else {
        if(diff < 1.004) {
            text = "Not noticeably hotter than";
        } else if(diff < 1.008) {
            text = "Barely noticeably hotter than";
        } else if(diff < 1.01) {
            text = "A tiny bit hotter than";
        } else if(diff < 1.013) {
            text = "A bit hotter than";
        } else if(diff < 1.015) {
            text = "Just noticeably hotter than";
        } else if(diff < 1.029) {
            text = "Noticeably hotter than";
        } else if(diff < 1.035) {
            text = "Quite a bit hotter than";
        } else if(diff < 1.05) {
            text = "Hotter than";
        } else if(diff < 1.08) {
            text = "A lot hotter than";
        } else if(diff < 1.09) {
            text = "Quite a lot hotter than";
        } else if(diff < 1.1) {
            text = "A massive amount hotter than";
        } else if(diff < 1.125) {
            text = "Very much hotter than";
        } else if(diff >= 1.125) {
            text = "Scorching compared to";
        }
    }
    return {text: text, diff: a-b, pdiff: tempa/tempb};
}


/**
 * compares the wind in a to b (e.g. today to yesterday)
 */
function compareWind(a, b){
    var diff = a/b;
    var text;
    if(diff < 1){
        if(diff < 0.1){ 
            text = "There's basically no wind compared to";
        } else if(diff < 0.2){
            text = "Majorly less windy than";
        } else if(diff < 0.35){
            text = "Significantly less windy than";
        } else if(diff < 0.5){
            text = "A lot less windy than";
        } else if(diff < 0.6){
            text = "Noticably less windy than";
        } else if(diff < 0.75){
            text = "A bit less windy than";
        } else if(diff < 0.9){
            text = "Slightly less windy than";
        } else {
            text = "Ever so slightly less windy than";
        }
    } else if (diff === 1){
            text = "No different to";
    } else if (diff > 1) {
        if(diff > 3){
            text = "It's a wind-fest compared to";
        } else if(diff > 2.5){
            text = "Majorly windier than";
        } else if(diff > 2.2){
            text = "Significantly windier than";
        } else if(diff > 2){
            text = "Noticeably windier than";
        } else if(diff > 1.5){
            text = "A bit windier than";
        } else if(diff > 1.2){
            text = "Slightly windier than";
        } else {
            text = "Ever so slightly windier than";
        }
    }
    return {text: text, diff: a-b, pdiff: a/b};
}

/**
 * Convert f (farenheit) to Kelvin
 */
function FtoK(f){
    return ((((f-32)*5)/9)+273.15)
}

/**
 * Convert c (celsius) to Kelvin
 */
function CtoK(c){
    return (c+273.15)
}

function checkConnection() {
    if(!navigator.connection) return null;
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    return states[networkState];
}

