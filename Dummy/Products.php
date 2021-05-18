<?php

	$response = file_get_contents('https://fakestoreapi.com/products');
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
		$sql = "INSERT INTO artikli (SifraArtikla, Naziv, Opis, JedinicaMjere, JedinicnaCijena, Slika)
		VALUES ('" . $value->id . "', '" . $value->title . "', '" . $value->description . "', '" . 'Komad' . "', '" . $value->price . "', '" . $value->image . "')";

		if ($conn->query($sql) === TRUE) {
		  echo "New record created successfully";
		} else {
		  echo "Error: " . $sql . "<br>" . $conn->error;
		}
	}

	$conn->close();

?>