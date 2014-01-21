<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <?php include("meta.php"); ?>
        
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBtxLJfxu6EwqN92o9FgMQBc_5dBbUykX8&sensor=true"></script>
        <style>
            #map-canvas { height: 100% }
        </style>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <div class="container">
            <?php include('head.php'); ?>
            <div class="row" id="weatherDisplay">
            </div>
            <div class="row" id="map-row">
                <div class="col-md-12" id="map-canvas">
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-md-offset-3">
                    <form class="form" id="postcodeForm" method="POST" name="postcodeForm" action="#" role="form">
                        <div class="form-group">
                            <div class="input-group">
                                <input type="text" class="form-control" placeholder="Address or ZIP/Postcode" name="postcode" id="postcode">
                                <span class="input-group-btn">
                                    <a href="javascript:void(0);" onClick="postcodeGetSubmit();" title="Get weather based on ZIP/Postcode." id="go-button" class="btn btn-large btn-primary">Go</a> 
                                    <a href="javascript:void(0);" onClick="getWeatherFromLocation();" title="Get weather based on your location." id="location-button" class="btn btn-large btn-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns:xlink="http://www.w3.org/1999/xlink" height="16" version="1.1" width="16">
                                          <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
                                            <g fill="#000000" transform="translate(-192.000000, -192.000000)">
                                              <path class="location-circle" d="M201 205.92C203.51 205.5 205.5 203.51 205.92 201L203 201 203 199 205.92 199C205.5 196.49 203.51 194.5 201 194.08L201 197 199 197 199 194.08C196.49 194.5 194.5 196.49 194.08 199L197 199 197 201 194.08 201C194.5 203.51 196.49 205.5 199 205.92L199 203 201 203ZM200 208C195.58 208 192 204.42 192 200 192 195.58 195.58 192 200 192 204.42 192 208 195.58 208 200 208 204.42 204.42 208 200 208ZM200 208"/>
                                            </g>
                                          </g>
                                        </svg>
                                    </a> 
                                </span>
                            </div><!-- /input-group -->
                       </div>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-md-offset-3">
                    <h4 id="desct" class="text-center">A weather app in relative terms</h4>
                    <p id="desc1">With Supi you can see the weather in relative terms - most people don't know what 12&deg;C feels like or how windy 20m/s wind is, however, most people know what it <em>felt</em> like yesterday, so why not phrase it in terms of that?</p>
                    <p id="desc2">See today's and tomorrow's weather in terms you can relate to. If you needed a coat yesterday, will you need a coat today? Should you wear shorts like yesterday, or will that small wind have picked up to something more fierce?</p>
                    <p id="desc3">We show you what you want - the weather in real terms, so you can plan your days easily. Add our app to your homescreen on iPhone by clicking the bookmark icon and 'add to homescreen', or on your Android device by clicking 'Add to homescreen' in the menu or by bookmarking and then long-pressing the bookmark and selecting 'Add to homescreen'.</p>
                    <p id="desc4">Supi is a weather app that uses today's weather, yesterday's weather and tomorrow's weather to calculate how the weather feels relative to today or yesterday. Other weather apps usually just show you things in terms of numbers, but we've done one better</p>
                </div>
            </div>
            <?php include('foot.php'); ?>
        </div>
    </div> <!-- /container -->        
        <?php include('footscripts.php'); ?>

        <!-- These are not needed at the moment
        <script src="js/debounce.min.js"></script>
        <script src="js/vendor/jquery.animate-enhanced.min.js"></script>
        -->

        <script src="js/weatherFunctions.js"></script>
        <script src="js/main.js"></script>
        <?php include('bottomscripts.php'); ?>
    </body>
</html>
