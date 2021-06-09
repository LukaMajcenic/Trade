<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'POST':

		$_POST = json_decode(file_get_contents('php://input'), true);
		
		if(isset($_POST['SifraArtikla']) && isset($_POST['Kolicina']) && isset($_POST['UkupnaCijena']) && isset($_POST['SifraRacuna']))
		{
			$sQuery = "INSERT INTO stavke (SifraArtikla, Kolicina, UkupnaCijena, SifraRacuna) VALUES (:SifraArtikla, :Kolicina, :UkupnaCijena, :SifraRacuna)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraArtikla' => $_POST['SifraArtikla'],
				'Kolicina' => $_POST['Kolicina'],
				'UkupnaCijena' => $_POST['UkupnaCijena'],
				'SifraRacuna' => $_POST['SifraRacuna']
			);

			if($oStatement->execute($oData))
			{
				echo "Stavka dodana";
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
		
		if(isset($_PUT['SifraStavke']) && isset($_PUT['SifraArtikla']) && isset($_PUT['Kolicina']) && isset($_PUT['UkupnaCijena']) && isset($_PUT['SifraRacuna']))
		{
			$sQuery = "UPDATE stavke SET 
				SifraArtikla = :SifraArtikla, 
				Kolicina = :Kolicina, 
				UkupnaCijena = :UkupnaCijena, 
				SifraRacuna = :SifraRacuna
				WHERE SifraStavke = :SifraStavke";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraStavke' => $_PUT['SifraStavke'],
				'SifraArtikla' => $_PUT['SifraArtikla'],
				'Kolicina' => $_PUT['Kolicina'],
				'UkupnaCijena' => $_PUT['UkupnaCijena'],
				'SifraRacuna' => $_PUT['SifraRacuna']
			);

			if($oStatement->execute($oData))
			{
				echo "Stavka '" . $_PUT['SifraStavke'] . "' ažurirana";
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
		
		if(isset($_GET['SifraStavke']))
		{
			$sQuery = "DELETE FROM stavke WHERE SifraStavke = :SifraStavke";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array('SifraStavke' => $_GET['SifraStavke']);

			if($oStatement->execute($oData))
			{
				echo "Stavka '" . $_GET['SifraStavke'] . "' obrisana";
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