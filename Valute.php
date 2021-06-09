<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':
        $sQuery = "SELECT * FROM valute";

		$oRecord = $oConnection->query($sQuery);
		$Valute = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			$oValuta = new Valuta($oRow['SifraValute'], $oRow['NazivValute'], $oRow['SimbolValute']);

			array_push($Valute, $oValuta);
		}
		header('Content-Type: application/json');
		echo json_encode($Valute);
        break;

    default:
        http_response_code(405);
        break;
}

?>