<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		if(!isset($_GET['SifraZaposlenika']))
		{
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
				$oRacun = new Racun($oRow['SifraRacuna'], $oRow['SifraZaposlenika'], $oRow['UkupanIznos'], $oRow['Datum'], $oRow['Storniran'], json_decode($Stavke));

				array_push($Racuni, $oRacun);
			}
			header('Content-Type: application/json');
			echo json_encode($Racuni);
			break;
		}
		else
		{
			$sQuery = "SELECT SifraRacuna FROM racuni";
			$sQuery .= " WHERE SifraZaposlenika = '". $_GET['SifraZaposlenika'] ."' ORDER BY SifraRacuna DESC LIMIT 1";

			$oRecord = $oConnection->query($sQuery);
			while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
			{
				echo $oRow['SifraRacuna'];
			}
			header('Content-Type: application/json');
			break;
		}

	case 'POST':

		$_POST = json_decode(file_get_contents('php://input'), true);
		
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
			var_dump($_POST);
		}
		break;

	case 'PUT':

		$_PUT = json_decode(file_get_contents('php://input'), true);
		
		if(isset($_PUT['SifraRacuna']))
		{
			$sQuery = "UPDATE racuni SET 
				Storniran = :Storniran
				WHERE SifraRacuna = :SifraRacuna";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraRacuna' => $_PUT['SifraRacuna'],
				'Storniran' => '1'
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