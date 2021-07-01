<?php

include 'classes.php';
include 'connection.php';

function Kategorije($oConnection)
{
	$sQuery = "SELECT * FROM kategorije";

	$oRecord = $oConnection->query($sQuery);
	$Kategorije = Array();
	while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
	{
		$oKategorija = new Kategorija($oRow['SifraKategorije'], $oRow['NazivKategorije']);
		array_push($Kategorije, $oKategorija);
	}

	return $Kategorije;	
}

function Valute($oConnection)
{
	$sQuery = "SELECT * FROM valute";

	$oRecord = $oConnection->query($sQuery);
	$Valute = Array();
	while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
	{
		$oValuta = new Valuta($oRow['SifraValute'], $oRow['NazivValute'], $oRow['SimbolValute']);
		array_push($Valute, $oValuta);
	}

	return $Valute;	
}

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':
		$oSifrarnik = new Sifrarnik(Kategorije($oConnection), Valute($oConnection));
		echo json_encode($oSifrarnik);
		
		break;
	
	default:
		http_response_code(405);
		break;
}

?>