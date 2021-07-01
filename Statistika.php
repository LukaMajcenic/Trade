<?php

include 'classes.php';
include 'connection.php';

//header('Content-Type: application/json');
switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT racuni.SifraValute, valute.NazivValute, UkupanIznos, Datum, SifraZaposlenika, Storniran FROM racuni INNER JOIN valute ON racuni.SifraValute = valute.SifraValute";

		$oRecord = $oConnection->query($sQuery);
		$data = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			array_push($data, $oRow);
		}

		$oStatistika = new Statistika($data);

		echo json_encode($oStatistika);	

		break;
	
	default:
		http_response_code(405);
		break;
}

?>