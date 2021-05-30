<?php  

abstract class Osoba
{
	public $SifraZaposlenika;
	public $Ime;
	public $Prezime;
	public $Email;
	public $Lozinka;

	function __construct($SifraZaposlenika, $Ime, $Prezime, $Email, $Lozinka)
	{
		$this->SifraZaposlenika = $SifraZaposlenika;
		$this->Ime = $Ime;
		$this->Prezime = $Prezime;
		$this->Email = $Email;
		$this->Lozinka = $Lozinka;
	}
}

class Zaposlenik extends Osoba
{
	
}

class Kategorija
{
    public $SifraKategorije;
    public $Naziv;

    function __construct($SifraKategorije, $Naziv)
    {
    	$this->SifraKategorije = $SifraKategorije;
    	$this->Naziv= $Naziv;
    }
}

class Artikl
{
	public $SifraArtikla;
	public $Naziv;
	public $Opis;
	public $JedinicaMjere;
	public $JedinicnaCijena;
	public $Slika;
	public $Kategorija;

	function __construct($SifraArtikla, $Naziv, $Opis, $JedinicaMjere, $JedinicnaCijena, $Slika, $Kategorija)
	{
		$this->SifraArtikla = $SifraArtikla;
		$this->Naziv = $Naziv;
		$this->Opis = $Opis;
		$this->JedinicaMjere = $JedinicaMjere;
		$this->JedinicnaCijena = $JedinicnaCijena;
		$this->Slika = $Slika;
		$this->Kategorija = $Kategorija;
	}
}

class Stavka extends Artikl
{
	public $Kolicina;
	public $UkupnaCijena;

	function __construct($Kolicina, $UkupnaCijena, $SifraArtikla, $Naziv, $Opis, $JedinicaMjere, $JedinicnaCijena, $Slika, $Kategorija)
	{
		$this->Kolicina = $Kolicina;
		$this->UkupnaCijena = $UkupnaCijena;
		$this->SifraArtikla = $SifraArtikla;
		$this->Naziv = $Naziv;
		$this->Opis = $Opis;
		$this->JedinicaMjere = $JedinicaMjere;
		$this->JedinicnaCijena = $JedinicnaCijena;
		$this->Slika = $Slika;
		$this->Kategorija = $Kategorija;
	}
}

class Racun
{
	public $SifraRacuna;
	public $SifraZaposlenika;
	public $UkupanIznos;
	public $Datum;
	public $Storniran;
	public $Stavke;

	function __construct($SifraRacuna, $SifraZaposlenika, $UkupanIznos, $Datum, $Storniran, $Stavke)
	{
		$this->SifraRacuna = $SifraRacuna;
		$this->SifraZaposlenika = $SifraZaposlenika;
		$this->UkupanIznos = $UkupanIznos;
		$this->Datum = $Datum;
		$this->Storniran = $Storniran;
		$this->Stavke = $Stavke;
	}
}

?>