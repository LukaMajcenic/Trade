<?php

include 'classes.php';
include 'connection.php';

$_POST = json_decode(file_get_contents('php://input'), true);

if(isset($_POST['Email']) && isset($_POST['Lozinka']))
{
    $sQuery = "SELECT * FROM zaposlenici";
    $sQuery .= " WHERE (Email = '". $_POST['Email'] ."' AND Deaktiviran = '0')";

    $oRecord = $oConnection->query($sQuery);
    while($oRow = $oRecord->fetch(PDO::FETCH_BOTH))
    {
        if($oRow['Lozinka'] == $_POST['Lozinka'])
        {
            $_SESSION['SifraZaposlenika'] = $oRow['SifraZaposlenika'];
            echo json_encode(new Zaposlenik($oRow['SifraZaposlenika'], $oRow['Ime'], $oRow['Prezime'], $oRow['Email'], 
            $oRow['AdminX'], $oRow['Deaktiviran'], $oRow['Tema'], $oRow['Valuta']));
        }
        else
        {
            http_response_code(401);
            echo 'Neispravna lozinka';
        }
        die();
    }
    http_response_code(404);
    echo 'Korisnik ne postoji';
}
else
{
    http_response_code(400);
    echo 'Nisu svi parametri postavljeni!';
}

?>