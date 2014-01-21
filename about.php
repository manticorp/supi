<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <?php include("meta.php"); ?>
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->
        <div class="container">
            <?php include('head.php'); ?>
            <div class="row">
                <div class="col-md-6 second-header col-md-offset-3">
                    <h2 class="text-center">About</h2>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 col-md-offset-3">
                    <p>Most weather apps give you the weather in terms of &deg;C or m/s, but most people don't <em>actually</em> know what 12&deg;C feels like or how windy 12m/s is. However, most people do know how windy it felt <em>yesterday</em> or how hot it feels <em>today</em>, so, why not put it in terms of that?</p>
                    <p>The Supi app uses a weather feed to look up yesterday's, today's and tomorrow's weather and then compares the temperatures and windspeeds to give you a relative feeling of what it's like.</p>
                    <p>This app is in beta testing at the moment, so please <a href="contact.php">feel free to contact us</a> when you find something's not working.</a>
                </div>
            </div>
            <?php include('foot.php'); ?>
        </div>
    </div> <!-- /container -->
        <?php include('footscripts.php'); ?>
        <?php include('bottomscripts.php'); ?>
    </body>
</html>
