<?php  

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
	$oConnection = new PDO("mysql:host=$configuration->host;dbname=$configuration->dbName", $configuration->username, $configuration->password);
	//echo "Connected to $configuration->dbName at $configuration->host successfully.";
}
catch (PDOException $pe)
{
	die("Could not connect to the database $configuration->dbName :" . $pe->getMessage());
}

?>