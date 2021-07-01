<?php

session_start();

class Configuration
{
    public $host = '127.0.0.1';
    public $dbName = 'trade';
    public $username = 'root';
    public $password = '';
}

$configuration = new Configuration();

try
{
	$oConnection = new PDO("mysql:host=$configuration->host; dbname=$configuration->dbName; charset=utf8", $configuration->username, $configuration->password);
	$AdminOnlyPages = array("/storniraj_racune", "/dodaj_artikl", "/uredi_artikle", '/pregled_zaposlenika', '/uredi_zaposlenike');

    if($_SERVER['REQUEST_URI'] != '/KV2/Login' && $_SERVER['HTTP_PAGEURL'] != '/registracija')
    {
        if(!isset($_SERVER['HTTP_SIFRAZAPOSLENIKA'])
        || !isset($_SESSION['SifraZaposlenika'])
        || $_SESSION['SifraZaposlenika'] != $_SERVER['HTTP_SIFRAZAPOSLENIKA'])
        {       
            http_response_code(401);
            exit();
        }
        else if(in_array($_SERVER['HTTP_PAGEURL'], $AdminOnlyPages))
        {
            $sQuery = "SELECT AdminX FROM zaposlenici WHERE SifraZaposlenika = '". $_SERVER['HTTP_SIFRAZAPOSLENIKA'] ."'";

            $oRecord = $oConnection->query($sQuery);
            while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
            {
                if($oRow['AdminX'] == 0)
                {
                    http_response_code(403);
                    exit();
                }
            }
        }
    }
}
catch (PDOException $pe)
{
	die("Could not connect to the database $configuration->dbName :" . $pe->getMessage());
}

?>