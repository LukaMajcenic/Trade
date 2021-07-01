<?php  

abstract class Osoba
{
	public $SifraZaposlenika;
	public $Ime;
	public $Prezime;
	public $Email;
	public $Admin;
	public $Deaktiviran;
	public $Tema;
	public $Valuta;
	public $ProfilnaSlika;

	function __construct($SifraZaposlenika, $Ime, $Prezime, $Email, $Admin, $Deaktiviran, $Tema, $Valuta, $ProfilnaSlika)
	{
		$this->SifraZaposlenika = $SifraZaposlenika;
		$this->Ime = $Ime;
		$this->Prezime = $Prezime;
		$this->Email = $Email;
		$this->Admin = $Admin;
		$this->Deaktiviran = $Deaktiviran;
		$this->Tema = $Tema;
		$this->Valuta = $Valuta;
		$this->ProfilnaSlika = $ProfilnaSlika;
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
	public $SifraValute;

	function __construct($SifraArtikla, $Naziv, $Opis, $JedinicaMjere, $JedinicnaCijena, $Slika, $Kategorija, $SifraValute)
	{
		$this->SifraArtikla = $SifraArtikla;
		$this->Naziv = $Naziv;
		$this->Opis = $Opis;
		$this->JedinicaMjere = $JedinicaMjere;
		$this->JedinicnaCijena = $JedinicnaCijena;
		$this->Slika = $Slika;
		$this->Kategorija = $Kategorija;
		$this->SifraValute = $SifraValute;
	}
}

class Stavka extends Artikl
{
	public $Kolicina;
	public $UkupnaCijena;

	function __construct($Kolicina, $UkupnaCijena, $SifraArtikla, $Naziv, $Opis, $JedinicaMjere, $JedinicnaCijena, $Slika, $Kategorija, $SifraValute)
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
		$this->SifraValute = $SifraValute;
	}
}

class Racun
{
	public $SifraRacuna;
	public $SifraZaposlenika;
	public $UkupanIznos;
	public $Datum;
	public $Storniran;
	public $SifraValute;
	public $Stavke;
	public $Zaposlenik;

	function __construct($SifraRacuna, $SifraZaposlenika, $UkupanIznos, $Datum, $Storniran, $SifraValute, $Stavke, $Zaposlenik)
	{
		$this->SifraRacuna = $SifraRacuna;
		$this->SifraZaposlenika = $SifraZaposlenika;
		$this->UkupanIznos = $UkupanIznos;
		$this->Datum = $Datum;
		$this->Storniran = $Storniran;
		$this->SifraValute = $SifraValute;
		$this->Stavke = $Stavke;
		$this->Zaposlenik = $Zaposlenik;
	}
}

class Sifrarnik
{
	public $Kategorije;
	public $Valute;

	function __construct($Kategorije, $Valute)
	{
		$this->Kategorije = $Kategorije;
		$this->Valute = $Valute;
	}
}

class Valuta
{
	public $SifraValute;
	public $NazivValute;
	public $SimbolValute;

	function __construct($SifraValute, $NazivValute, $SimbolValute)
	{
		$this->SifraValute = $SifraValute;
		$this->NazivValute = $NazivValute;
		$this->SimbolValute = $SimbolValute;
	}
}

class Statistika
{
	public $Racuni;

	function __construct($Racuni)
	{
		$this->Racuni = $Racuni;
	}
}

?>