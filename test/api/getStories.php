<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$dataArr = array();

$recordOnTheFly = array();
$recordOnTheFly["name"] = "how to fix a watch";	   
$recordOnTheFly["author"] = "Jim Smith";
$recordOnTheFly["keyWords"] = "how to";
$recordOnTheFly["publisher"] = "howtostories.com";
array_push($dataArr, $recordOnTheFly);
       
$recordOnTheFly = array();
$recordOnTheFly["name"] = "when I am in Thailand";	   
$recordOnTheFly["author"] = "Joe Doe";
$recordOnTheFly["keyWords"] = "travel";
$recordOnTheFly["publisher"] = "travelstories.net";	 
array_push($dataArr, $recordOnTheFly);  
       
$recordOnTheFly["name"] = "U got mail";	   
$recordOnTheFly["author"] = "Jin Wu";
$recordOnTheFly["keyWords"] = "romance";
$recordOnTheFly["publisher"] = "funstories.us";
array_push($dataArr, $recordOnTheFly);
       
$recordOnTheFly = array();
$recordOnTheFly["name"] = "My strange pets";	   
$recordOnTheFly["author"] = "Zack Swift";
$recordOnTheFly["keyWords"] = "animal";
$recordOnTheFly["publisher"] = "animalstories.net";	 
array_push($dataArr, $recordOnTheFly);  

$recordOnTheFly = array();
$recordOnTheFly["name"] = "how to play mahjong";	   
$recordOnTheFly["author"] = "Kim Smith, Jin Wu";
$recordOnTheFly["keyWords"] = "how to";
$recordOnTheFly["publisher"] = "howtostories.com";
array_push($dataArr, $recordOnTheFly);

$recordOnTheFly = array();
$recordOnTheFly["name"] = "Greenland";	   
$recordOnTheFly["author"] = "Joe Doe";
$recordOnTheFly["keyWords"] = "travel";
$recordOnTheFly["publisher"] = "mytravelstories.net";	 
array_push($dataArr, $recordOnTheFly);
		
$responseData = array();
$responseData['records'] = $dataArr;
 
echo json_encode($responseData);  
 
?>