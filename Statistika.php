<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM artikli INNER JOIN kategorije ON artikli.SifraKategorije = kategorije.SifraKategorije WHERE Obrisan = '0'";
		if(isset($_GET['SifraArtikla']))
		{
			$sQuery .= " AND SifraArtikla = '". $_GET['SifraArtikla'] ."'";
		}

		$oRecord = $oConnection->query($sQuery);
		$Artikli = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			$oKategorija = new Kategorija($oRow['SifraKategorije'], $oRow['NazivKategorije']);

			$oArtikl = new Artikl((int)$oRow['SifraArtikla'], $oRow['Naziv'], $oRow['Opis'], $oRow['JedinicaMjere'], 
			(float)$oRow['JedinicnaCijena'], $oRow['Slika'], $oKategorija, $oRow['SifraValute']);

			array_push($Artikli, $oArtikl);
		}
		header('Content-Type: application/json');
		echo json_encode($Artikli);
		break;
	
	default:
		http_response_code(405);
		break;
}

?>