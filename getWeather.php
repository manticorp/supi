<?php
include('forecast.io.php');
header('Content-type: application/json');

<<<<<<< HEAD
$config = parse_ini_file("config.ini");

$api_key = $config["forecastioAPIkey"];
=======
$api_key = "6b80c5e93b04f843aab9f440bb12b7e5";
>>>>>>> Initial project version.

$latitude   = $_REQUEST["latitude"];
$longitude  = $_REQUEST["longitude"];

$forecast = new ForecastIO($api_key);


if(isset($_REQUEST["time"])){
    $condition = $forecast->getHistoricalConditions($latitude, $longitude, $_REQUEST["time"]);
    $rawData = $condition->getRawData();
} else {
    $condition = $forecast->getForecastToday($latitude, $longitude);
    $rawData = [];
    foreach($condition as $c){
        $rawData[] = $c->getRawData();
    }
}

echo json_encode( $rawData );



