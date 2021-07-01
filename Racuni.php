<?php

include 'classes.php';
include 'connection.php';

function DohvatiStavke($oConnection, $SifraRacuna)
{
	$sQuery = "SELECT * FROM stavke INNER JOIN artikli ON stavke.SifraArtikla = artikli.SifraArtikla";
	$sQuery .= " WHERE SifraRacuna = '". $SifraRacuna ."'";

	$oRecord = $oConnection->query($sQuery);
	$Stavke = Array();
	while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
	{
		$sQueryKategorije = "SELECT * FROM kategorije WHERE SifraKategorije = '". $oRow['SifraKategorije'] ."'";
		$oRecordKategorija = $oConnection->query($sQueryKategorije);

		while($oRowKategorija = $oRecordKategorija->fetch(PDO::FETCH_BOTH))
		{
			$oKategorija = new Kategorija($oRowKategorija['SifraKategorije'], $oRowKategorija['NazivKategorije']);
		}

		$oStavka = new Stavka($oRow['Kolicina'], $oRow['UkupnaCijena'], $oRow['SifraArtikla'], $oRow['Naziv'], $oRow['Opis'], 
		$oRow['JedinicaMjere'], $oRow['JedinicnaCijenaStavke'], $oRow['Slika'], $oKategorija, null);

		array_push($Stavke, $oStavka);
	}

	return $Stavke;
}

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		if(!isset($_GET['SifraZaposlenika']))
		{
			$sQuery = "SELECT * FROM racuni INNER JOIN zaposlenici ON racuni.SifraZaposlenika = zaposlenici.SifraZaposlenika ";
			$oData = array();
			if(isset($_GET['SifraRacuna']))
			{
				$sQuery .= " WHERE SifraRacuna = :SifraRacuna";
				$oData = array(
					'SifraRacuna' => $_GET['SifraRacuna']
				);
			}
			$oStatement = $oConnection->prepare($sQuery);
			$oStatement->execute($oData);
	
			$Rows = $oStatement->fetchAll(\PDO::FETCH_ASSOC);
			$Counter = 0;
			$Racuni = Array();
			while($Counter < count($Rows))
			{
				$oRow = $Rows[$Counter];

				$oZaposlenik = new Zaposlenik($oRow['SifraZaposlenika'], $oRow['Ime'], $oRow['Prezime'], $oRow['Email'], 
				$oRow['AdminX'], $oRow['Deaktiviran'], $oRow['Tema'], $oRow['Valuta'], $oRow['ProfilnaSlika']);
				$Stavke = DohvatiStavke($oConnection, $oRow['SifraRacuna']);
				$oRacun = new Racun((int)$oRow['SifraRacuna'], (int)$oRow['SifraZaposlenika'], (float)$oRow['UkupanIznos'], 
				$oRow['Datum'], $oRow['Storniran'], $oRow['SifraValute'], $Stavke, $oZaposlenik);

				array_push($Racuni, $oRacun);
				$Counter++;
			}
			
			echo json_encode($Racuni); 
			break;
		}
		else
		{
			$sQuery = "SELECT SifraRacuna FROM racuni WHERE SifraZaposlenika = :SifraZaposlenika ORDER BY SifraRacuna DESC LIMIT 1";
			$oData = array(
				'SifraZaposlenika' => $_GET['SifraZaposlenika']
			);

			$oStatement = $oConnection->prepare($sQuery);
			$oStatement->execute($oData);
	
			$Rows = $oStatement->fetchAll(\PDO::FETCH_ASSOC);
			$Counter = 0;
			while($Counter < count($Rows))
			{
				$oRow= $Rows[$Counter];
				echo $oRow['SifraRacuna'];
				$Counter++;
			}
			break;
		}

	case 'POST':

		$_POST = json_decode(file_get_contents('php://input'), true);
		
		if(isset($_POST['SifraZaposlenika']) && isset($_POST['UkupanIznos']) && isset($_POST['Datum']))
		{
			$sQuery = "INSERT INTO racuni (SifraZaposlenika, UkupanIznos, Datum, SifraValute) 
			VALUES (:SifraZaposlenika, :UkupanIznos, :Datum, :SifraValute)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraZaposlenika' => $_POST['SifraZaposlenika'],
				'UkupanIznos' => $_POST['UkupanIznos'],
				'Datum' => $_POST['Datum'],
				'SifraValute' => $_POST['SifraValute']
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
	
	default:
		http_response_code(405);
		break;
}

?>