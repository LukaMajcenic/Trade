<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM zaposlenici";
		if(isset($_GET['SifraZaposlenika']))
		{
			$sQuery .= " WHERE SifraZaposlenika = '". $_GET['SifraZaposlenika'] ."'";
		}

		$oRecord = $oConnection->query($sQuery);
		$Zaposlenici = Array();
		while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
		{
			$oZaposlenik = new Zaposlenik($oRow['SifraZaposlenika'], $oRow['Ime'], $oRow['Prezime'], $oRow['Email'], 
			$oRow['AdminX'], $oRow['Deaktiviran'], $oRow['Tema'], $oRow['Valuta']);

			array_push($Zaposlenici, $oZaposlenik);
		}
		header('Content-Type: application/json');
		echo json_encode($Zaposlenici);
		break;

	case 'POST':

		if(isset($_POST['Ime']) && isset($_POST['Prezime']) && isset($_POST['Email']) && isset($_POST['Lozinka']))
		{
			$sQuery = "INSERT INTO zaposlenici (Ime, Prezime, Email, Lozinka) VALUES (:Ime, :Prezime, :Email, :Lozinka)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'Ime' => $_POST['Ime'],
				'Prezime' => $_POST['Prezime'],
				'Email' => $_POST['Email'],
				'Lozinka' => $_POST['Lozinka']
			);

			if($oStatement->execute($oData))
			{
				echo "Zaposlenik '" . $_POST['Ime'] . " " . $_POST['Prezime'] . "' dodan";
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
		
		if(isset($_PUT['SifraZaposlenika']) && isset($_PUT['Ime']) && isset($_PUT['Prezime']) && isset($_PUT['Tema'])
		&& isset($_PUT['Admin']) && isset($_PUT['Deaktiviran']) && isset($_PUT['Valuta']))
		{
			$sQuery = "UPDATE zaposlenici SET 
				Ime = :Ime, 
				Prezime = :Prezime, 
				Tema = :Tema,
				AdminX = :AdminX,
				Deaktiviran = :Deaktiviran,
				Valuta = :Valuta
				WHERE SifraZaposlenika = :SifraZaposlenika";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraZaposlenika' => $_PUT['SifraZaposlenika'],
				'Ime' => $_PUT['Ime'],
				'Prezime' => $_PUT['Prezime'],
				'Tema' => $_PUT['Tema'],
				'AdminX' => $_PUT['Admin'],
				'Deaktiviran' => $_PUT['Deaktiviran'],
				'Valuta' => $_PUT['Valuta']
			);

			if($oStatement->execute($oData))
			{
				echo "Zaposlenik '" . $_PUT['SifraZaposlenika'] . "' ažuriran";
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