<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM racuni";
		if(isset($_GET['SifraRacuna']))
		{
			$sQuery .= " WHERE SifraRacuna = '". $_GET['SifraRacuna'] ."'";
		}

		$oRecord = $oConnection->query($sQuery);
		$Racuni = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			$Stavke = file_get_contents("http://localhost/KV2/Stavke?SifraRacuna=" . $oRow['SifraRacuna']);
			$oRacun = new Racun($oRow['SifraRacuna'], $oRow['SifraZaposlenika'], $oRow['UkupanIznos'], $oRow['Datum'], json_decode($Stavke));

			array_push($Racuni, $oRacun);
		}
		header('Content-Type: application/json');
		echo json_encode($Racuni);
		break;

	case 'POST':
		
		if(isset($_POST['SifraZaposlenika']) && isset($_POST['UkupanIznos']) && isset($_POST['Datum']))
		{
			$sQuery = "INSERT INTO racuni (SifraZaposlenika, UkupanIznos, Datum) VALUES (:SifraZaposlenika, :UkupanIznos, :Datum)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraZaposlenika' => $_POST['SifraZaposlenika'],
				'UkupanIznos' => $_POST['UkupanIznos'],
				'Datum' => $_POST['Datum']
			);

			if($oStatement->execute($oData))
			{
				echo "Racun dodan";
			}
			else
			{
				http_response_code(400);
				echo "Upit nije izvršen!";
			}
		}
		else
		{
			http_response_code(400);
			echo 'Nisu svi parametri postavljeni!';
		}
		break;

	case 'PUT':

		parse_str(file_get_contents('php://input'), $_PUT);
		
		if(isset($_PUT['SifraRacuna']) && isset($_PUT['SifraZaposlenika']) && isset($_PUT['UkupanIznos']) && isset($_PUT['Datum']))
		{
			$sQuery = "UPDATE racuni SET 
				SifraZaposlenika = :SifraZaposlenika, 
				UkupanIznos = :UkupanIznos, 
				Datum = :Datum
				WHERE SifraRacuna = :SifraRacuna";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraRacuna' => $_PUT['SifraRacuna'],
				'SifraZaposlenika' => $_PUT['SifraZaposlenika'],
				'UkupanIznos' => $_PUT['UkupanIznos'],
				'Datum' => $_PUT['Datum']
			);

			if($oStatement->execute($oData))
			{
				echo "Račun '" . $_PUT['SifraRacuna'] . "' ažuriran";
			}
			else
			{
				http_response_code(400);
				echo "Upit nije izvršen!";
			}
		}
		else
		{
			http_response_code(400);
			echo 'Nisu svi parametri postavljeni!';
		}
		break;

	case 'DELETE':
		
		if(isset($_GET['SifraRacuna']))
		{
			$sQuery = "DELETE FROM racuni WHERE SifraRacuna = :SifraRacuna";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array('SifraRacuna' => $_GET['SifraRacuna']);

			if($oStatement->execute($oData))
			{
				echo "Račun '" . $_GET['SifraRacuna'] . "' obrisan";
			}
			else
			{
				http_response_code(400);
				echo "Upit nije izvršen!";
			}
			break;
		}
		else
		{
			http_response_code(400);
			echo 'Nisu svi parametri postavljeni!';
		}

		break;
	
	default:
		http_response_code(405);
		break;
}

?>