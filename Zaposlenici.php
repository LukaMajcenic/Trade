<?php

include 'classes.php';
include 'connection.php';

function IsDuplicate($oConnection, $Email)
{
	$sQuery = "SELECT Email FROM zaposlenici WHERE Deaktiviran = '0' AND Email = '". $Email ."'";

	$oRecord = $oConnection->query($sQuery);
	while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
	{
		return true;
	}

	return false;
}

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'GET':

		$sQuery = "SELECT * FROM zaposlenici";
		$oData = array();
		if(isset($_GET['SifraZaposlenika']))
		{
			$sQuery .= " WHERE SifraZaposlenika = :SifraZaposlenika";
			$oData = array(
				'SifraZaposlenika' => $_GET['SifraZaposlenika']
			);
		}
		$oStatement = $oConnection->prepare($sQuery);
		$oStatement->execute($oData);

		$Rows = $oStatement->fetchAll(\PDO::FETCH_ASSOC);
		$Counter = 0;
		$Zaposlenici = Array();
		while($Counter < count($Rows))
		{
			$oRow = $Rows[$Counter];

			$oZaposlenik = new Zaposlenik($oRow['SifraZaposlenika'], $oRow['Ime'], $oRow['Prezime'], $oRow['Email'], 
			$oRow['AdminX'], $oRow['Deaktiviran'], $oRow['Tema'], $oRow['Valuta'], $oRow['ProfilnaSlika']);

			array_push($Zaposlenici, $oZaposlenik);
			$Counter++;
		}
		
		echo json_encode($Zaposlenici);
		break;

	case 'POST':

		$_POST = json_decode(file_get_contents('php://input'), true);

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

			if(IsDuplicate($oConnection, $_POST['Email']))
			{
				http_response_code(409);
				echo "Email";
			}
			else
			{
				if($oStatement->execute($oData))
				{

				}
				else
				{
					var_dump($oStatement->errorInfo());
					echo "Zaposlenik '" . $_POST['Ime'] . " " . $_POST['Prezime'] . "' dodan";
				}
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
		&& isset($_PUT['Admin']) && isset($_PUT['Deaktiviran']) && isset($_PUT['Valuta']) && isset($_PUT['ProfilnaSlika']))
		{
			$sQuery = "UPDATE zaposlenici SET 
				Ime = :Ime, 
				Prezime = :Prezime, 
				Tema = :Tema,
				AdminX = :AdminX,
				Deaktiviran = :Deaktiviran,
				Valuta = :Valuta,
				ProfilnaSlika = :ProfilnaSlika
				WHERE SifraZaposlenika = :SifraZaposlenika";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraZaposlenika' => $_PUT['SifraZaposlenika'],
				'Ime' => $_PUT['Ime'],
				'Prezime' => $_PUT['Prezime'],
				'Tema' => $_PUT['Tema'],
				'AdminX' => $_PUT['Admin'],
				'Deaktiviran' => $_PUT['Deaktiviran'],
				'Valuta' => $_PUT['Valuta'],
				'ProfilnaSlika' => $_PUT['ProfilnaSlika']
			);
			
			if(IsDuplicate($oConnection, $_PUT['Email']))
			{
				http_response_code(409);
				echo "Email";
			}
			else
			{
				$oStatement->execute($oData);
				echo "Zaposlenik '" . $_PUT['SifraZaposlenika'] . "' ažuriran";
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