<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM kategorije";
		if(isset($_GET['SifraKategorije']))
		{
			$sQuery .= " WHERE SifraKategorije = '". $_GET['SifraKategorije'] ."'";
		}

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

	case 'POST':

		if(isset($_POST['NazivKategorije']))
		{
			$sQuery = "INSERT INTO kategorije (NazivKategorije) VALUES (:NazivKategorije)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'NazivKategorije' => $_POST['NazivKategorije']
			);

			if($oStatement->execute($oData))
			{
				echo "Kategorija '" . $_POST['NazivKategorije'] .  "'' dodana";
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
		
		if(isset($_PUT['SifraKategorije']) && isset($_PUT['NazivKategorije']))
		{
			$sQuery = "UPDATE kategorije SET 
				NazivKategorije = :NazivKategorije
				WHERE SifraKategorije = :SifraKategorije";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraKategorije' => $_PUT['SifraKategorije'],
				'NazivKategorije' => $_PUT['NazivKategorije']
			);

			if($oStatement->execute($oData))
			{
				echo "Kategorija '" . $_PUT['SifraKategorije'] . "' ažurirana";
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
		
		if(isset($_GET['SifraKategorije']))
		{
			$sQuery = "DELETE FROM kategorije WHERE SifraKategorije = :SifraKategorije";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array('SifraKategorije' => $_GET['SifraKategorije']);

			if($oStatement->execute($oData))
			{
				echo "Kategorija '" . $_GET['SifraKategorije'] . "' obrisana";
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