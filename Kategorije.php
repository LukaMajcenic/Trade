<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM kategorije";

		$oRecord = $oConnection->query($sQuery);
		$Kategorije = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			$oKategorija = new Kategorija($oRow['SifraKategorije'], $oRow['NazivKategorije']);

			array_push($Kategorije, $oKategorija);
		}
		header('Content-Type: application/json');
		echo json_encode($Kategorije);
		break;
	
	default:
		http_response_code(405);
		break;
}

?>