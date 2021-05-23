<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM artikli INNER JOIN kategorije ON artikli.SifraKategorije = kategorije.SifraKategorije";
		if(isset($_GET['SifraArtikla']))
		{
			$sQuery .= " WHERE SifraArtikla = '". $_GET['SifraArtikla'] ."'";
		}

		$oRecord = $oConnection->query($sQuery);
		$Artikli = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			$oKategorija = new Kategorija($oRow['SifraKategorije'], $oRow['NazivKategorije']);
			$oArtikl = new Artikl($oRow['SifraArtikla'], $oRow['Naziv'], $oRow['Opis'], $oRow['JedinicaMjere'], $oRow['JedinicnaCijena'], $oRow['Slika'], $oKategorija);

			array_push($Artikli, $oArtikl);
		}
		header('Content-Type: application/json');
		echo json_encode($Artikli);
		break;

	case 'POST':
		
		$_POST = json_decode(file_get_contents('php://input'), true);
		var_dump($_POST);

		if(isset($_POST['Naziv']) && isset($_POST['Opis']) && isset($_POST['JedinicaMjere']) && isset($_POST['JedinicnaCijena']) && isset($_POST['SifraKategorije']))
		{
			$sQuery = "INSERT INTO artikli (Naziv, Opis, JedinicaMjere, JedinicnaCijena, SifraKategorije) VALUES (:Naziv, :Opis, :JedinicaMjere, :JedinicnaCijena, :SifraKategorije)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'Naziv' => $_POST['Naziv'],
				'Opis' => $_POST['Opis'],
				'JedinicaMjere' => $_POST['JedinicaMjere'],
				'JedinicnaCijena' => $_POST['JedinicnaCijena'],
				'SifraKategorije' => $_POST['SifraKategorije']
			);

			if($oStatement->execute($oData))
			{
				echo "Artikl '" . $_POST['Naziv'] . "' dodan";
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

		$_PUT = json_decode(file_get_contents('php://input'), true);
		
		if(isset($_PUT['SifraArtikla']) && isset($_PUT['Naziv']) && isset($_PUT['Opis']) && isset($_PUT['JedinicaMjere']) && isset($_PUT['JedinicnaCijena']) && isset($_PUT['SifraKategorije']))
		{
			$sQuery = "UPDATE artikli SET 
				Naziv = :Naziv, 
				Opis = :Opis, 
				JedinicaMjere = :JedinicaMjere, 
				JedinicnaCijena = :JedinicnaCijena,
				SifraKategorije = :SifraKategorije
				WHERE SifraArtikla = :SifraArtikla";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraArtikla' => $_PUT['SifraArtikla'],
				'Naziv' => $_PUT['Naziv'],
				'Opis' => $_PUT['Opis'],
				'JedinicaMjere' => $_PUT['JedinicaMjere'],
				'JedinicnaCijena' => $_PUT['JedinicnaCijena'],
				'SifraKategorije' => $_PUT['SifraKategorije']
			);

			if($oStatement->execute($oData))
			{
				echo "Artikl '" . $_PUT['SifraArtikla'] . "' ažuriran";
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
			var_dump($_PUT);
		}
		break;


	case 'DELETE':
		
		if(isset($_GET['SifraArtikla']))
		{
			$sQuery = "DELETE FROM artikli WHERE SifraArtikla = :SifraArtikla";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array('SifraArtikla' => $_GET['SifraArtikla']);

			if($oStatement->execute($oData))
			{
				echo "Artikl '" . $_GET['SifraArtikla'] . "' obrisan";
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