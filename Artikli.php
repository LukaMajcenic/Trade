<?php

include 'classes.php';
include 'connection.php';

function IsDuplicate($oConnection, $NazivArtikla, $SifraArtikla)
{
	$sQuery = "SELECT SifraArtikla, Naziv FROM artikli WHERE Obrisan = '0' AND Naziv = '". $NazivArtikla ."'";

	$oRecord = $oConnection->query($sQuery);
	while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
	{
		if($oRow['SifraArtikla'] != $SifraArtikla)
		{
			return true;
		}		
	}

	return false;
}

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM artikli INNER JOIN kategorije ON artikli.SifraKategorije = kategorije.SifraKategorije WHERE Obrisan = '0'";
		$oData = array();
		if(isset($_GET['SifraArtikla']))
		{
			$sQuery .= " AND SifraArtikla = :SifraArtikla";
			$oData = array(
				'SifraArtikla' => $_GET['SifraArtikla']
			);
		}
		$oStatement = $oConnection->prepare($sQuery);
		$oStatement->execute($oData);

		$Rows = $oStatement->fetchAll(\PDO::FETCH_ASSOC);
		$Counter = 0;
		$Artikli = Array();
		while($Counter < count($Rows))
		{
			$oRow = $Rows[$Counter];
			$oKategorija = new Kategorija($oRow['SifraKategorije'], $oRow['NazivKategorije']);

			$oArtikl = new Artikl((int)$oRow['SifraArtikla'], $oRow['Naziv'], $oRow['Opis'], $oRow['JedinicaMjere'], 
			(float)$oRow['JedinicnaCijena'], $oRow['Slika'], $oKategorija, $oRow['SifraValute']);

			array_push($Artikli, $oArtikl);
			$Counter++;
		}
		
		echo json_encode($Artikli); 
		break;

	case 'POST':
		
		$_POST = json_decode(file_get_contents('php://input'), true);

		if(isset($_POST['Naziv']) && isset($_POST['Opis']) && isset($_POST['JedinicaMjere']) && isset($_POST['JedinicnaCijena']) && isset($_POST['SifraKategorije']) && isset($_POST['SifraValute']))
		{
			$sQuery = "INSERT INTO artikli (Naziv, Opis, JedinicaMjere, JedinicnaCijena, SifraKategorije, SifraValute, Slika) 
			VALUES (:Naziv, :Opis, :JedinicaMjere, :JedinicnaCijena, :SifraKategorije, :SifraValute, :Slika)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'Naziv' => $_POST['Naziv'],
				'Opis' => $_POST['Opis'],
				'JedinicaMjere' => $_POST['JedinicaMjere'],
				'JedinicnaCijena' => $_POST['JedinicnaCijena'],
				'SifraKategorije' => $_POST['SifraKategorije'],
				'SifraValute' => $_POST['SifraValute'],
				'Slika' => $_POST['Slika']
			);


			if(IsDuplicate($oConnection, $_POST['Naziv'], null))
			{
				http_response_code(409);
				echo "Naziv";
			}
			else
			{
				$oStatement->execute($oData);
				echo "Artikl '" . $_POST['Naziv'] . "' dodan";
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
		
		if(isset($_PUT['SifraArtikla']) && isset($_PUT['Naziv']) && isset($_PUT['Opis']) && isset($_PUT['JedinicaMjere']) && isset($_PUT['JedinicnaCijena']) && isset($_PUT['SifraKategorije']) && isset($_PUT['SifraValute']))
		{
			$sQuery = "UPDATE artikli SET 
				Naziv = :Naziv, 
				Opis = :Opis, 
				JedinicaMjere = :JedinicaMjere, 
				JedinicnaCijena = :JedinicnaCijena,
				SifraKategorije = :SifraKategorije,
				SifraValute = :SifraValute,
				Slika = :Slika
				WHERE SifraArtikla = :SifraArtikla";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraArtikla' => $_PUT['SifraArtikla'],
				'Naziv' => $_PUT['Naziv'],
				'Opis' => $_PUT['Opis'],
				'JedinicaMjere' => $_PUT['JedinicaMjere'],
				'JedinicnaCijena' => $_PUT['JedinicnaCijena'],
				'SifraKategorije' => $_PUT['SifraKategorije'],
				'SifraValute' => $_PUT['SifraValute'],
				'Slika' => $_PUT['Slika']
			);

			if(IsDuplicate($oConnection, $_PUT['Naziv'], $_PUT['SifraArtikla']))
			{
				http_response_code(409);
				echo "Naziv";
			}
			else
			{
				$oStatement->execute($oData);
				echo "Artikl '" . $_PUT['SifraArtikla'] . "' ažuriran";
			}
		}
		else
		{
			http_response_code(400);
			echo 'Nisu svi parametri postavljeni!';
		}
		break;


	case 'DELETE':
		
		if(isset($_GET['SifraArtikla']))
		{
			$sQuery = "UPDATE artikli SET 
				Obrisan = :Obrisan
				WHERE SifraArtikla = :SifraArtikla";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraArtikla' => $_GET['SifraArtikla'],
				'Obrisan' => '1'
			);

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