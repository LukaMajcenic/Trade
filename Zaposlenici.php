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
			$oZaposlenik = new Zaposlenik($oRow['SifraZaposlenika'], $oRow['Ime'], $oRow['Prezime'], $oRow['Email'], $oRow['Lozinka']);

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

		parse_str(file_get_contents('php://input'), $_PUT);
		
		if(isset($_PUT['SifraZaposlenika']) && isset($_PUT['Ime']) && isset($_PUT['Prezime']) && isset($_PUT['Email']) && isset($_PUT['Lozinka']))
		{
			$sQuery = "UPDATE zaposlenici SET 
				Ime = :Ime, 
				Prezime = :Prezime, 
				Email = :Email, 
				Lozinka = :Lozinka 
				WHERE SifraZaposlenika = :SifraZaposlenika";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraZaposlenika' => $_PUT['SifraZaposlenika'],
				'Ime' => $_PUT['Ime'],
				'Prezime' => $_PUT['Prezime'],
				'Email' => $_PUT['Email'],
				'Lozinka' => $_PUT['Lozinka']
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

	case 'DELETE':
		
		if(isset($_GET['SifraZaposlenika']))
		{
			$sQuery = "DELETE FROM zaposlenici WHERE SifraZaposlenika = :SifraZaposlenika";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array('SifraZaposlenika' => $_GET['SifraZaposlenika']);

			if($oStatement->execute($oData))
			{
				echo "Zaposlenik '" . $_GET['SifraZaposlenika'] . "' izbrisan";
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