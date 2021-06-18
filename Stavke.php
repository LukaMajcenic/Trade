<?php

include 'classes.php';
include 'connection.php';

switch ($_SERVER['REQUEST_METHOD']) 
{
	case 'POST':

		$_POST = json_decode(file_get_contents('php://input'), true);
		
		if(isset($_POST['SifraArtikla']) && isset($_POST['Kolicina']) && isset($_POST['JedinicnaCijenaStavke']) && isset($_POST['UkupnaCijena']) && isset($_POST['SifraRacuna']))
		{
			$sQuery = "INSERT INTO stavke (SifraArtikla, Kolicina, JedinicnaCijenaStavke, UkupnaCijena, SifraRacuna) 
			VALUES (:SifraArtikla, :Kolicina, :JedinicnaCijenaStavke, :UkupnaCijena, :SifraRacuna)";
			$oStatement = $oConnection->prepare($sQuery);
			$oData = array(
				'SifraArtikla' => $_POST['SifraArtikla'],
				'Kolicina' => $_POST['Kolicina'],
				'JedinicnaCijenaStavke' => $_POST['JedinicnaCijenaStavke'],
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
	
	default:
		http_response_code(405);
		break;
}

?>