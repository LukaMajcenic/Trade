<?php

	$response = file_get_contents('https://fakestoreapi.com/users');
	$response = json_decode($response);

	$servername = "localhost";
	$username = "root";
	$password = "";
	$dbname = "trade";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	  die("Connection failed: " . $conn->connect_error);
	}

	foreach ($response as $value) 
	{
		$sql = "INSERT INTO zaposlenici (SifraZaposlenika, Ime, Prezime, Email, Lozinka)
		VALUES ('" . $value->id . "', '" . $value->name->firstname . "', '" . $value->name->lastname . "', '" . $value->email . "', '" . $value->password . "')";

		if ($conn->query($sql) === TRUE) {
		  echo "New record created successfully";
		} else {
		  echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	$conn->close();

?>