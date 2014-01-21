<html>
<head>
        <title>javascript-mobile-desktop-geolocation With No Simulation with Google Maps</title>         

        <style>
                body {font-family: Helvetica;font-size:11pt;padding:0px;margin:0px}
                #title {background-color:#e22640;padding:5px;}
                #current {font-size:10pt;padding:5px;}        
        </style>
        </head>
        <body onload="initialiseMap();initialise()">
                <h1>javascript-mobile-desktop-geolocation With No Simulation with Google Maps</h1>
                <div id="current">Initializing...</div>
                <div id="map_canvas" style="width:320px; height:350px"></div>

                <script src="js/geoPosition.js" type="text/javascript" charset="utf-8">
                </script>
                <script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>

                <script>
                function initialiseMap()
                {
                    var myOptions = {
                              zoom: 4,
                              mapTypeControl: true,
                              mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
                              navigationControl: true,
                              navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
                              mapTypeId: google.maps.MapTypeId.ROADMAP      
                            }        
                        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                }
                function initialise()
                {
                        if(geoPosition.init())
                        {
                                document.getElementById('current').innerHTML="Receiving...";
                                geoPosition.getCurrentPosition(showPosition,function(err){console.log(err);document.getElementById('current').innerHTML="Couldn't get location"},{enableHighAccuracy:true});
                        }
                        else
                        {
                                document.getElementById('current').innerHTML="Functionality not available";
                        }
                }

                function showPosition(p)
                {
                        var latitude = parseFloat( p.coords.latitude );
                        var longitude = parseFloat( p.coords.longitude );
                        document.getElementById('current').innerHTML="latitude=" + latitude + " longitude=" + longitude;
                        var pos=new google.maps.LatLng( latitude , longitude);
                        map.setCenter(pos);
                        map.setZoom(14);

                        var infowindow = new google.maps.InfoWindow({
                            content: "<strong>yes</strong>"
                        });

                        var marker = new google.maps.Marker({
                            position: pos,
                            map: map,
                            title:"You are here"
                        });

                        google.maps.event.addListener(marker, 'click', function() {
                          infowindow.open(map,marker);
                        });
                        
                }
                </script>
        </body>
</html>