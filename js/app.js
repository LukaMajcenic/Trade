var oModul = angular.module('oModul', ['ngRoute', 'ngTable']);

oModul.run(['$rootScope', '$http', '$location', 'GeneralServices', function ($rootScope, $http, $location) {

	$rootScope.Logout = function()
	{
		$http.post("http://localhost/KV2/Logout")
		.then(function() {
			$rootScope.User = undefined;
			$location.url("/login");
			localStorage.setItem("Tema", 'L');
			$rootScope.PostaviTemu();
		});
	}

	$rootScope.ConfigSettings = function()
	{
		return {headers:
			{
				'SifraZaposlenika': localStorage.getItem("SifraZaposlenika"),
				'PageUrl': $location.$$url
			}
		}
	}

	$rootScope.BreadcrumbArray = [{Naziv : 'Home', Link: '#!/dodaj_racun'}]
	$rootScope.SetBreadcrumb = function(Nazivi = null, Linkovi = null)
	{
		$rootScope.BreadcrumbArray = [];
		$rootScope.BreadcrumbArray = [{Naziv : 'Home', Link: '#!/dodaj_racun'}]

		if(Nazivi != null && Linkovi != null)
		{
			for(let i = 0; i < Nazivi.length; i++)
			{
				$rootScope.BreadcrumbArray.push({Naziv: Nazivi[i], Link: Linkovi[i]});
			}
		}
	}

	$rootScope.PostaviTemu = function()
	{
		if(localStorage.getItem("Tema") == 'D')
		{
			document.documentElement.style.setProperty('--background', Gray);
			document.documentElement.style.setProperty('--backgroundDarker1', GrayDarker1);
			document.documentElement.style.setProperty('--backgroundDarker2', GrayDarker2);

			document.documentElement.style.setProperty('--foreground', White);
			document.documentElement.style.setProperty('--foreground', WhiteDarker1);
		}
		else
		{
			document.documentElement.style.setProperty('--background', White);
			document.documentElement.style.setProperty('--backgroundDarker1', WhiteDarker1);
			document.documentElement.style.setProperty('--backgroundDarker2', WhiteDarker2);

			document.documentElement.style.setProperty('--foreground', Gray);
			document.documentElement.style.setProperty('--foregroundDarker1', GrayDarker1);
		}
	}
	
	$rootScope.PostaviTemu();
	$http.get("http://localhost/KV2/Zaposlenici?SifraZaposlenika=" + localStorage.getItem("SifraZaposlenika"), $rootScope.ConfigSettings())
	.then(function(response) {
		$rootScope.User = response.data[0];

		localStorage.setItem("Tema", $rootScope.User.Tema);
		$rootScope.PostaviTemu();
	});

	window.addEventListener("storage", function (event) {
		if(event.key == 'SifraZaposlenika')
		{
			$rootScope.Logout();
		}
	}, false);

}]);

oModul.factory('ResponseHandler', function($rootScope, $location)
{
	var factory = {};

	factory.Handle = function(response)
	{
		switch(response.status)
		{
			case 401:
				console.log('redirected');
				$rootScope.Logout();
				break;
				
			case 403:
				$location.url("/pregled_racuna");
				break;
		}
		console.log(response.status);
	}

	return factory;
});

oModul.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'predlosci/pregled_racuna.html',
		controller: 'pregledRacunaKontroler'
	});

	$routeProvider.when('/login', {
		templateUrl: 'predlosci/login.html',
		controller: 'loginKontroler'
	});

	//Pregled svih racuna
	$routeProvider.when('/pregled_racuna', {
		templateUrl: 'predlosci/pregled_racuna.html',
		controller: 'pregledRacunaKontroler'
	});

	//Pregled jednog racuna
	$routeProvider.when('/pregled_racuna/:sifra_racuna', {
		templateUrl: 'predlosci/pregled_jednog_racuna.html',
		controller: 'pregledJednogRacunaKontroler'
	});

	//Dodavanje racuna
	$routeProvider.when('/dodaj_racun', {
		templateUrl: 'predlosci/dodaj_racun.html',
		controller: 'dodajRacunKontroler'
	});

	//Storniranje racuna - prikaz svih
	$routeProvider.when('/storniraj_racune', {
		templateUrl: 'predlosci/storniraj_racune.html',
		controller: 'stornirajRacuneKontroler'
	});

	//Storniranje racuna - prikaz jednog
	$routeProvider.when('/storniraj_racune/:sifra_racuna', {
		templateUrl: 'predlosci/storniraj_jedan_racun.html',
		controller: 'stornirajJedanRacunKontroler'
	});

	//Pregled artikala
	$routeProvider.when('/pregled_artikla', {
		templateUrl: 'predlosci/pregled_artikla.html',
		controller: 'pregledArtiklaKontroler'
	});

	//Dodavanje artikala
	$routeProvider.when('/dodaj_artikl', {
		templateUrl: 'predlosci/dodaj_artikl.html',
		controller: 'dodajArtiklKontroler'
	});

	//Uredivanje artikala
	$routeProvider.when('/uredi_artikle', {
		templateUrl: 'predlosci/uredi_artikle.html',
		controller: 'urediArtikleKontroler'
	});

	//Pregled zaposlenika
	$routeProvider.when('/pregled_zaposlenika', {
		templateUrl: 'predlosci/pregled_zaposlenika.html',
		controller: 'pregledZaposlenikaKontroler'
	});

	//Uredi zaposlenike
	$routeProvider.when('/uredi_zaposlenike', {
		templateUrl: 'predlosci/uredi_zaposlenike.html',
		controller: 'urediZaposlenikeKontroler'
	});

	//Uredivanje profila
	$routeProvider.when('/uredi_profil', {
		templateUrl: 'predlosci/uredi_profil.html',
		controller: 'urediProfilKontroler'
	});
});

oModul.controller('loginKontroler', function($rootScope, $scope, $http, $window){

	if($rootScope.User != undefined)
	{
		$window.location.href = '/KV2/#!/dodaj_racun';
	}

	$scope.User = {};

	$scope.User.Email = undefined;
	$scope.User.Lozinka = undefined;

	$scope.Submit= function()
	{
		console.log($scope.User);
		$http.post("http://localhost/KV2/Login", $scope.User)
		.then(function(response) {
			if(response.data == '')
			{
				console.log('Neuspjela prijava');
			}
			else
			{
				$rootScope.User = response.data;
				localStorage.setItem("Tema", $rootScope.User.Tema);
				$rootScope.PostaviTemu();
				localStorage.setItem("SifraZaposlenika", $rootScope.User.SifraZaposlenika);
				$rootScope.Config = {headers:{'SifraZaposlenika': localStorage.getItem("SifraZaposlenika")}};
				$window.location.href = '/KV2/#!/dodaj_racun';
			}
		});
	}
});

oModul.controller('pregledRacunaKontroler', function($rootScope, $scope, $http, NgTableParams, GeneralServices, RacuniFilterSerivice, ResponseHandler){

	$rootScope.SetBreadcrumb(['Pregled računa'], ['#!/pregled_racuna']);

   	$(document).on('DOMSubtreeModified', '.SliderValue', function() {
		if($scope.FilterObject != undefined && $scope.FilterObject != undefined) $scope.FilterChange();	
		});

	$scope.FilterChange = function()
	{
		$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	GeneralServices.GetExchangeRates().then(function(ExchangeRates){

		$http.get("http://localhost/KV2/Racuni", $rootScope.ConfigSettings())
		.then(function(response) {
			$scope.Racuni = response.data;

			$scope.Racuni.forEach(function(value){
				value.UkupanIznosConverted = parseFloat((ExchangeRates[value.SifraValute] * value.UkupanIznos).toFixed(2));
			})
			
			$scope.tableParams = new NgTableParams(
			{
				sorting: 
				{
					Datum: 'desc'
				},
			});

			$scope.NajveciUkupanIznos = Math.max.apply(Math,$scope.Racuni.map(function(o){return o.UkupanIznosConverted;}));
			$scope.NajveciUkupanIznos = parseInt($scope.NajveciUkupanIznos) + 1;
			$scope.NajveciBrojStavki = Math.max.apply(Math,$scope.Racuni.map(function(o){return o.Stavke.length;}));

			$scope.FilterObject = {};

			$scope.FilterObject.PrikaziStornirane = false;
			$scope.FilterObject.PrikaziNesortirane = true;

			$scope.FilterObject.SifraRacunaFilter = '';

			$scope.FilterObject.IznosMinValue = 0;
			$scope.FilterObject.IznosMaxValue = $scope.NajveciUkupanIznos;

			$scope.FilterObject.StavkeMinValue = 0;
			$scope.FilterObject.StavkeMaxValue = $scope.NajveciBrojStavki;

			$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
			$scope.tableParams.reload();
		}, function errorCallback(response) {
			ResponseHandler.Handle(response);
		});	
	})
});

oModul.controller('pregledJednogRacunaKontroler', function($rootScope, $scope, $http, $routeParams, ResponseHandler){

	let SifraRacuna = $routeParams.sifra_racuna;
	$rootScope.SetBreadcrumb(['Pregled računa', 'Račun ' + SifraRacuna], ['#!/pregled_racuna', '#!/pregled_racuna/' + SifraRacuna]);

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + SifraRacuna, $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Racun = response.data[0];
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });
});

oModul.controller('dodajRacunKontroler', function($interval, $rootScope, $scope, $http, $window, ResponseHandler){

	$rootScope.SetBreadcrumb(['Dodaj račun'], ['#!/dodaj_racun']);

	$scope.NoviRacun = {
		UkupanIznos: 0.00,
		Stavke: [],
		SifraValute: 'HRK'
	}

	var tick = function() 
	{
		let DatumRaw = new Date();
		$scope.Datum = DatumRaw.getFullYear() + '-'
		+ (DatumRaw.getMonth()+1) + '-' 
		+ DatumRaw.getDate() + ' '
		+ DatumRaw.getHours() + ':'
		+ DatumRaw.getMinutes() + ':'
		+ DatumRaw.getSeconds();
	}
	tick();
	$interval(tick, 1000);

	$scope.ValutaChange = function()
	{
		$scope.Artikli.forEach(function(value){
			$http.get(`https://api.exchangerate.host/convert?from=${value.SifraValute}&to=${$scope.NoviRacun.SifraValute}`)
			.then(function(response){
				value.JedinicnaCijenaConverted = parseFloat((response.data.result * value.JedinicnaCijena).toFixed(2));
			})
		})

		$scope.NoviRacun.Stavke.forEach(function(value){
			$http.get(`https://api.exchangerate.host/convert?from=${value.SifraValute}&to=${$scope.NoviRacun.SifraValute}`)
			.then(function(response){
				value.JedinicnaCijenaConverted = parseFloat((response.data.result * value.JedinicnaCijena).toFixed(2));
				$scope.PromijeniUkupnuCijenu(value);

				console.log(value);
			})
		})
	}

	$http.get("http://localhost/KV2/Valute", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Valute = response.data;
	  });

	$http.get("http://localhost/KV2/Artikli", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Artikli = response.data;

		$scope.Artikli.forEach(function(value){
			if(value.SifraValute != 'HRK')
			{
				$http.get(`https://api.exchangerate.host/convert?from=${value.SifraValute}&to=${$scope.NoviRacun.SifraValute}`)
				.then(function(response){
					value.JedinicnaCijenaConverted = parseFloat((response.data.result * value.JedinicnaCijena).toFixed(2));
				})
			}
			else
			{
				value.JedinicnaCijenaConverted = value.JedinicnaCijena;
			}
		})
		
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });

	$scope.DodajStavku = function(Artikl)
	{
		let novaStavka = {
			Kolicina: 1,
			UkupnaCijena: Artikl.JedinicnaCijenaConverted,
			SifraArtikla: Artikl.SifraArtikla,
			Naziv: Artikl.Naziv,
			Opis:  Artikl.Opis,
			JedinicaMjere: Artikl.JedinicaMjere,
			JedinicnaCijena: Artikl.JedinicnaCijena,
			Slika: Artikl.Slika,
			Kategorija: Artikl.Kategorija,
			SifraValute: Artikl.SifraValute,
			JedinicnaCijenaConverted: Artikl.JedinicnaCijenaConverted
		}
		console.log(novaStavka);

		$scope.NoviRacun.Stavke.push(novaStavka);

		$scope.PromijeniUkupnuCijenu();
	}

	$scope.PromijeniUkupnuCijenu = function(Stavka = null)
	{
		if(Stavka != null)
		{
			Stavka.UkupnaCijena = parseFloat((Stavka.Kolicina * Stavka.JedinicnaCijenaConverted).toFixed(2));
		}

		$scope.NoviRacun.UkupanIznos = 0.00;
		$scope.NoviRacun.Stavke.forEach(function(value){
			$scope.NoviRacun.UkupanIznos += value.UkupnaCijena;
		})
		$scope.NoviRacun.UkupanIznos = parseFloat($scope.NoviRacun.UkupanIznos).toFixed(2);
	}

	$scope.ProvjeraArtikla = function(Artikl)
	{
		let PostojiNaRacunu = true;
		$scope.NoviRacun.Stavke.forEach(function(value){
			if(value.SifraArtikla == Artikl.SifraArtikla)
			{
				PostojiNaRacunu = false;
			}
		})

		return PostojiNaRacunu;
	}

	$scope.UkloniStavku = function(Stavka)
	{
		$scope.NoviRacun.Stavke = $scope.NoviRacun.Stavke.filter(stavka => stavka.SifraArtikla != Stavka.SifraArtikla);
	}

	$scope.Submit = function()
	{
		let DatumRaw = new Date();
		let Datum = DatumRaw.getFullYear() + '-'
		+ (DatumRaw.getMonth()+1) + '-' 
		+ DatumRaw.getDate() + ' '
		+ DatumRaw.getHours() + ':'
		+ DatumRaw.getMinutes() + ':'
		+ DatumRaw.getSeconds();

		$http.post("http://localhost/KV2/Racuni", {
				'SifraZaposlenika': $rootScope.User.SifraZaposlenika,
				'UkupanIznos': $scope.NoviRacun.UkupanIznos,
				'Datum': Datum,
				'SifraValute': $scope.NoviRacun.SifraValute
		}, $rootScope.ConfigSettings())
		.then(function() {

			$http.get("http://localhost/KV2/Racuni?SifraZaposlenika=" + localStorage.getItem("SifraZaposlenika"), $rootScope.ConfigSettings())
			.then(function(response) {

				let BrojStavki = $scope.NoviRacun.Stavke.length;
				$scope.NoviRacun.Stavke.forEach(function(value){
			
					$http.post("http://localhost/KV2/Stavke", {
						'SifraArtikla': value.SifraArtikla,
						'Kolicina': value.Kolicina,
						'UkupnaCijena': value.UkupnaCijena,
						'SifraRacuna': response.data
					}, $rootScope.ConfigSettings())
					.then(function() {
						BrojStavki--;
						if(BrojStavki == 0)
						{
							//Ako su sve stavke spremljene vracamo se na pregled racuna
							$window.location.href = '/KV2/#!/pregled_racuna';
						}
					});
		
				})
			});
		});
	}	  
});

oModul.controller('stornirajRacuneKontroler', function($rootScope, $scope, $http, NgTableParams, GeneralServices, RacuniFilterSerivice, ResponseHandler){

	$rootScope.SetBreadcrumb(['Storniraj račune'], ['#!/storniraj_racune']);

	$(document).on('DOMSubtreeModified', '.SliderValue', function() {
		if($scope.FilterObject != undefined && $scope.FilterObject != undefined) $scope.FilterChange();	
		});

	$scope.FilterChange = function()
	{
		$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	GeneralServices.GetExchangeRates().then(function(ExchangeRates){

		$http.get("http://localhost/KV2/Racuni", $rootScope.ConfigSettings())
		.then(function(response) {
			$scope.Racuni = response.data;	

			$scope.Racuni.forEach(function(value)
			{
				value.UkupanIznosConverted = parseFloat((ExchangeRates[value.SifraValute] * value.UkupanIznos).toFixed(2));
			})		
			
			$scope.tableParams = new NgTableParams(
			{
				sorting: 
				{
					Datum: 'desc'
				},
			});

			$scope.NajveciUkupanIznos = Math.max.apply(Math,$scope.Racuni.map(function(o){return o.UkupanIznos;}));
			$scope.NajveciUkupanIznos = parseInt($scope.NajveciUkupanIznos) + 1;
			$scope.NajveciBrojStavki = Math.max.apply(Math,$scope.Racuni.map(function(o){return o.Stavke.length;}));

			$scope.FilterObject = {};

			$scope.FilterObject.PrikaziStornirane = false;
			$scope.FilterObject.PrikaziNesortirane = true;

			$scope.FilterObject.SifraRacunaFilter = '';

			$scope.FilterObject.IznosMinValue = 0;
			$scope.FilterObject.IznosMaxValue = $scope.NajveciUkupanIznos;

			$scope.FilterObject.StavkeMinValue = 0;
			$scope.FilterObject.StavkeMaxValue = $scope.NajveciBrojStavki;

			$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
			$scope.tableParams.reload();
		}, function errorCallback(response) {
			ResponseHandler.Handle(response);
		});

	})

	$scope.Storniraj = function(Racun)
	{
		Racun.Storniran = true;

		$http.put("http://localhost/KV2/Racuni", {
				'SifraRacuna' : Racun.SifraRacuna
		},  $rootScope.ConfigSettings())
		.then(function(response) {

		}, function (response) {

		});
	}

});

oModul.controller('stornirajJedanRacunKontroler', function($rootScope, $scope, $http, $routeParams, ResponseHandler){

	let SifraRacuna = $routeParams.sifra_racuna;
	$rootScope.SetBreadcrumb(['Storniraj račune', 'Račun ' + SifraRacuna], ['#!/storniraj_racune', '#!/storniraj_racune/' + SifraRacuna]);

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + SifraRacuna, $rootScope.ConfigSettings())
	.then(function(response) {
	    $scope.Racun = response.data[0];
	}, function(response) {
		ResponseHandler.Handle(response);
	});

	$scope.Storniraj = function(Racun)
	{
		Racun.Storniran = true;

		$http.put("http://localhost/KV2/Racuni", {
				'SifraRacuna' : Racun.SifraRacuna
		},  $rootScope.ConfigSettings())
		.then(function(response) {

		}, function() {

		});
	}
	  
});

oModul.controller('pregledArtiklaKontroler', function($rootScope, $scope, $http, NgTableParams, GeneralServices, ArtikliFilterSerivice, ResponseHandler){

	$rootScope.SetBreadcrumb(['Pregled artikla'], ['#!/pregled_artikla']);

	$scope.FilterChange = function()
	{
		$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	GeneralServices.GetExchangeRates().then(function(response){
		let ExchangeRates = response;

		$http.get("http://localhost/KV2/Artikli", $rootScope.ConfigSettings())
		.then(function(response) {
			$scope.Artikli = response.data;

			$scope.Artikli.forEach(function(value)
			{
				value.JedinicnaCijenaConverted =  parseFloat((ExchangeRates[value.SifraValute] * value.JedinicnaCijena).toFixed(2));
			})

			$scope.tableParams = new NgTableParams(
			{
				sorting: 
				{
					Naziv: 'asc'
				},
			});
			$scope.NajvecaCijena = Math.max.apply(Math,$scope.Artikli.map(function(o){return o.JedinicnaCijenaConverted;}));
			$scope.NajvecaCijena = parseInt($scope.NajvecaCijena) + 1;

			$scope.FilterObject = {};

			$scope.FilterObject.SifraArtiklaFilter = '';
			$scope.FilterObject.NazivFilter = '';
			$scope.FilterObject.OpisFilter = '';
			$scope.FilterObject.JedinicaMjereFilter = '';
			$scope.FilterObject.KategorijaFilter = '';
			$scope.FilterObject.CijenaMinValue = 0;
			$scope.FilterObject.CijenaMaxValue = $scope.NajvecaCijena;

			$( "#slider-range-cijena" ).slider({
				range: true,
				min: 0,
				max: $scope.NajvecaCijena,
				values: [ 0, $scope.NajvecaCijena ],
				slide: function( event, ui ) 
				{
					$scope.FilterObject.CijenaMinValue = ui.values[0];
					$scope.FilterObject.CijenaMaxValue = ui.values[1];

					$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
					$scope.tableParams.reload();
				}
			});

			$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
			$scope.tableParams.reload();

			$scope.FilterObject.UniqueJediniceMjere = [...new Set($scope.tableParams._settings.dataset.map(a => a.JedinicaMjere))];
			$scope.FilterObject.UniqueKategorije = [...new Set($scope.tableParams._settings.dataset.map(a => a.Kategorija.Naziv))];
		}, function errorCallback(response) {
			ResponseHandler.Handle(response);
		});
	});

  	$scope.ShowCards = function()
  	{
  		$('#pregledArtiklaCards').removeClass('displayNone');
		$('#pregledArtiklaTable').addClass('displayNone');
  	}

  	$scope.ShowTable = function()
  	{
  		$('#pregledArtiklaTable').removeClass('displayNone');
		$('#pregledArtiklaCards').addClass('displayNone');
  	}
});

oModul.controller('dodajArtiklKontroler', function($rootScope, $scope, $http, GeneralServices, ResponseHandler){

	$rootScope.SetBreadcrumb(['Dodaj artikl'], ['#!/dodaj_artikl']);

	$http.get("http://localhost/KV2/Valute", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Valute = response.data;
		console.log($scope.Valute);
	  });

	$http.get("http://localhost/KV2/Artikli", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Artikli = response.data;
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });

	$http.get("http://localhost/KV2/Kategorije", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Kategorije = response.data;
	    $scope.NoviArtikl.Kategorija.SifraKategorije = response.data[0].SifraKategorije;

		console.log($scope.NoviArtikl);
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });

	$scope.NoviArtikl = {
		Naziv: "",
		Opis: "",
		JedinicaMjere: "Komad",
		JedinicnaCijena: "",
		Kategorija: {
			SifraKategorije: null,
			Naziv: ""
		},
		SifraValute: 'HRK'
	}

	$scope.Submit = function(NoviArtikl)
	{
		if(GeneralServices.ValidateForm('.customForm'))
		{
			console.log($scope.NoviArtikl);
			$http.post("http://localhost/KV2/Artikli", {
				'SifraArtikla' : NoviArtikl.SifraArtikla,
				'Naziv': NoviArtikl.Naziv,
				'Opis': NoviArtikl.Opis,
				'JedinicaMjere': NoviArtikl.JedinicaMjere,
				'JedinicnaCijena': NoviArtikl.JedinicnaCijena,
				'SifraKategorije': NoviArtikl.Kategorija.SifraKategorije,
				'SifraValute': NoviArtikl.SifraValute
			}, $rootScope.ConfigSettings())
			  .then(function(response) {
			  	$('.customForm')[0].reset();
			  }, function errorCallback(response) {
				ResponseHandler.Handle(response);
			  });
		}
		else
		{
			console.log('Invalid form');
		}
	}

});
 
oModul.controller('urediArtikleKontroler', function($rootScope, $scope, $http, GeneralServices, NgTableParams, ArtikliFilterSerivice, ResponseHandler){

	$rootScope.SetBreadcrumb(['Uredi artikle'], ['#!/uredi_artikle']);

	$http.get("http://localhost/KV2/Valute", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Valute = response.data;
	  });

	$scope.FilterChange = function()
	{
		$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	GeneralServices.GetExchangeRates().then(function(response){
		$scope.ExchangeRates = response;

		$http.get("http://localhost/KV2/Artikli", $rootScope.ConfigSettings())
		.then(function(response) {
			$scope.Artikli = response.data;

			$scope.Artikli.forEach(function(value)
			{
				value.JedinicnaCijenaConverted =  parseFloat(($scope.ExchangeRates[value.SifraValute] * value.JedinicnaCijena).toFixed(2));
			})

			$scope.tableParams = new NgTableParams(
			{
				sorting: 
				{
					SifraArtikla: 'asc'
				},
			});

			$scope.NajvecaCijena = Math.max.apply(Math,$scope.Artikli.map(function(o){return o.JedinicnaCijenaConverted;}));
			$scope.NajvecaCijena = parseInt($scope.NajvecaCijena) + 1;
		
			$scope.FilterObject = {};
		
			$scope.FilterObject.SifraArtiklaFilter = '';
			$scope.FilterObject.NazivFilter = '';
			$scope.FilterObject.OpisFilter = '';
			$scope.FilterObject.JedinicaMjereFilter = '';
			$scope.FilterObject.KategorijaFilter = '';
			$scope.FilterObject.CijenaMinValue = 0;
			$scope.FilterObject.CijenaMaxValue = $scope.NajvecaCijena;
		
			$( "#slider-range-cijena" ).slider({
				range: true,
				min: 0,
				max: $scope.NajvecaCijena,
				values: [ 0, $scope.NajvecaCijena ],
				slide: function( event, ui ) 
				{
					$scope.FilterObject.CijenaMinValue = ui.values[0];
					$scope.FilterObject.CijenaMaxValue = ui.values[1];
		
					$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
					$scope.tableParams.reload();
				}
			});
		
			$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
			$scope.tableParams.reload();
		
			$scope.FilterObject.UniqueJediniceMjere = [...new Set($scope.tableParams._settings.dataset.map(a => a.JedinicaMjere))];
			$scope.FilterObject.UniqueKategorije = [...new Set($scope.tableParams._settings.dataset.map(a => a.Kategorija.Naziv))];
		}, function errorCallback(response) {
			ResponseHandler.Handle(response);
		});
	});

	$http.get("http://localhost/KV2/Kategorije", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Kategorije = response.data;
	});

	$scope.Open = function(Artikl)
	{
		$('tr:not(.noHoverEffect,.tableHeader)').addClass('disabledRow'); //dissables all rows except header and form
		$('.customIconButton').prop('disabled', true);
	}

	$scope.Odustani = function(Artikl)
	{
		$http.get("http://localhost/KV2/Artikli?SifraArtikla=" + Artikl.SifraArtikla, $rootScope.ConfigSettings())
		.then(function(response) {
			const index = $scope.Artikli.findIndex(x => x.SifraArtikla == Artikl.SifraArtikla);
			$scope.Artikli[index] = response.data[0];

			$('tr').removeClass('disabledRow'); //enables all rows
			$('.customIconButton').prop('disabled', false); //enable all buttons
		});
	}


	$scope.Change = function(Artikl)
	{
		Artikl.Kategorija.Naziv = $scope.Kategorije.find(x => x.SifraKategorije == Artikl.Kategorija.SifraKategorije).Naziv;
	}

	$scope.Submit = function(Artikl)
	{
		console.log(Artikl);
		if(GeneralServices.ValidateForm('#form' + Artikl.SifraArtikla))
		{
			$('tr').removeClass('disabledRow'); //enables all rows
			$('.customIconButton').prop('disabled', false);
			$('.collapse').collapse('hide');
			console.log(Artikl);

			$http.put("http://localhost/KV2/Artikli", {
				'SifraArtikla' : Artikl.SifraArtikla,
				'Naziv': Artikl.Naziv,
				'Opis': Artikl.Opis,
				'JedinicaMjere': Artikl.JedinicaMjere,
				'JedinicnaCijena': Artikl.JedinicnaCijena,
				'SifraKategorije': Artikl.Kategorija.SifraKategorije,
				'SifraValute': Artikl.SifraValute
			}, $rootScope.ConfigSettings())
			  .then(function() {
				if(Artikl.SifraValute != 'HRK')
				{
					$http.get(`http://free.currconv.com/api/v7/convert?apiKey=dd8550b7929baea6904f&q=${Artikl.SifraValute}_HRK&compact=y`)
					.then(function(response) {
						Artikl.JedinicnaCijenaConverted = (response.data[Artikl.SifraValute + '_HRK'].val * Artikl.JedinicnaCijena).toFixed(2);;
					});
				}
			  }, function (response) {

			  });
		}
		else
		{
			console.log('Invalid form');
		}
	}

	$scope.Delete = function(Artikl)
	{
		$http.delete("http://localhost/KV2/Artikli?SifraArtikla=" + Artikl.SifraArtikla, $rootScope.ConfigSettings())
		.then(function() {
			$scope.Artikli = $scope.Artikli.filter(x => x.SifraArtikla != Artikl.SifraArtikla);
			$scope.tableParams._settings.dataset = $scope.tableParams._settings.dataset.filter(x => x.SifraArtikla != Artikl.SifraArtikla);
			$scope.tableParams.reload();
		});
	}
});

oModul.controller('pregledZaposlenikaKontroler', function($rootScope, $scope, $http, NgTableParams, GeneralServices, ArtikliFilterSerivice, ResponseHandler){

	$rootScope.SetBreadcrumb(['Pregled zaposlenika'], ['#!/pregled_zaposlenika']);

	$http.get("http://localhost/KV2/Zaposlenici", $rootScope.ConfigSettings())
	.then(function(response){
		$scope.Zaposlenici = response.data;

		$scope.tableParams = new NgTableParams(
		{
			sorting: 
			{
				Prezime: 'asc'
			},
		});
		$scope.tableParams._settings.dataset = $scope.Zaposlenici;
	})
});

oModul.controller('urediZaposlenikeKontroler', function($rootScope, $scope, $http, NgTableParams, GeneralServices, ArtikliFilterSerivice, ResponseHandler){

	$rootScope.SetBreadcrumb(['Uredi zaposlenike'], ['#!/uredi_zaposlenike']);

	$http.get("http://localhost/KV2/Zaposlenici", $rootScope.ConfigSettings())
	.then(function(response){
		$scope.Zaposlenici = response.data;

		$scope.tableParams = new NgTableParams(
		{
			sorting: 
			{
				Prezime: 'asc'
			},
		});
		$scope.tableParams._settings.dataset = $scope.Zaposlenici;
	})

	$scope.AdminChange = function(Zaposlenik)
	{
		if(Zaposlenik.Admin == 1) {Zaposlenik.Admin = '0';}
		else {Zaposlenik.Admin = '1';}

		$scope.UrediZaposlenika(Zaposlenik);
	}

	$scope.DeaktivirajRacun = function(Zaposlenik)
	{
		Zaposlenik.Deaktiviran = '1';

		$scope.UrediZaposlenika(Zaposlenik);
	}

	$scope.UrediZaposlenika = function(Zaposlenik)
	{
		$http.put("http://localhost/KV2/Zaposlenici", {
			'SifraZaposlenika': Zaposlenik.SifraZaposlenika,
			'Ime': Zaposlenik.Ime,
			'Prezime': Zaposlenik.Prezime,
			'Tema': Zaposlenik.Tema,
			'Admin': Zaposlenik.Admin,
			'Deaktiviran': Zaposlenik.Deaktiviran,
			'Valuta': $rootScope.User.Valuta},
			$rootScope.ConfigSettings())
		.then(function(){
		})
	}
})

oModul.controller('urediProfilKontroler', function($rootScope, $scope, $http, GeneralServices){

	$rootScope.SetBreadcrumb(['Uredi profil'], ['#!/uredi_profil']);

	$http.get("http://localhost/KV2/Valute", $rootScope.ConfigSettings())
	.then(function(response){
		$scope.Valute = response.data;
	})

	$scope.Submit = function()
	{
		if(GeneralServices.ValidateForm('.customForm'))
		{
			$http.put("http://localhost/KV2/Zaposlenici", {
				'SifraZaposlenika': $rootScope.User.SifraZaposlenika,
				'Ime': $rootScope.User.Ime,
				'Prezime': $rootScope.User.Prezime,
				'Tema': $rootScope.User.Tema,
				'Admin': $rootScope.User.Admin,
				'Deaktiviran': $rootScope.User.Deaktiviran, 
				'Valuta': $rootScope.User.Valuta},
				$rootScope.ConfigSettings())
			.then(function(){

			})
		}
		else
		{
			
		}
	}
});

oModul.directive('artiklForma', function(){
   return {
      restrict:'E',
      templateUrl:'direktive/artikl_forma',
      scope: {
		metodaParametar: '=',
		artiklParametar: '=',
		kategorijeParametar: '=',
		valuteParametar: '=',
		submitParametar: '&',
		odustaniParametar: '&',
		changeParametar: '&'
      },
   };
});

oModul.directive('racuniTable', function(){
	return {
	   restrict:'E',
	   templateUrl:'direktive/racuni_table',
	   scope: {
		isAdminParametar: '=',
		ngTableParamsParameter: '=',
		filterObjectParameter: '=',
		filterChangeParameter: '&',
		stornirajParametar: '&'
      },
	};
});

oModul.directive('racunPrikaz', function(){
	return {
	   restrict:'E',
	   templateUrl:'direktive/racun_prikaz',
	   scope: {
		isAdminParametar: '=',
		racunParametar: '=',
		stornirajParametar: '&'
      },
	};
});

oModul.directive('artiklFiltriranje', function(){
	return {
	   restrict:'E',
	   templateUrl:'direktive/artikli_filtriranje',
	   scope: {
		tableParamsParametar: '=',
		filterObjectParametar: '=',
		filterChangeParametar: '&'
      },
	};
});

oModul.directive('logo', function(){
	return {
	   restrict:'E',
	   templateUrl:'direktive/logo',
	   scope: {
		   forNavMenu: '='
	   }
	};
});

oModul.factory('GeneralServices', function($http)
{
	var factory = {};

	factory.ValidateForm = function(selector)
	{
		let Valid = true;

		$(selector).find('.validationLabel').remove();
		$(selector).find('*').each(function()
		{
			if(($(this).prop('tagName') == 'INPUT' || $(this).prop('tagName') == 'TEXTAREA') && $(this).val() == '')
			{
				Valid = false;
				$(this).after('<h3 class="validationLabel mb-2"><i class="fas fa-exclamation-circle me-1"></i>Polje ne može biti prazno!</h3>');
			}
		})

		return Valid;
	}

	factory.GetExchangeRates = function()
	{
		return $http.get('https://api.exchangerate.host/latest?base=HRK').then(function(response)
		{
			let ExchangeRates = response.data.rates;
			for (rate in ExchangeRates) 
			{
				//Invertira bazni exchgange rate
				ExchangeRates[rate] = 1 / ExchangeRates[rate];
			}
			return ExchangeRates;
		});
	}

	return factory;
});

oModul.factory('RacuniFilterSerivice', function()
{
	var factory = {};

	factory.SetNgTable = function(scope)
	{
		$( "#slider-range-iznos" ).slider({
			range: true,
			min: 0.00,
			max: scope.NajveciUkupanIznos,
			values: [ 0, scope.NajveciUkupanIznos ],
			slide: function( event, ui ) 
			{
				scope.FilterObject.IznosMinValue = ui.values[0];
				scope.FilterObject.IznosMaxValue = ui.values[1];

				$('#IznosMinValue').text(ui.values[0]);
				$('#IznosMaxValue').text(ui.values[1]);

			    factory.SetNgTable(scope);
			}
		});

		$( "#slider-range-stavke" ).slider({
			range: true,
			min: 0,
			max: scope.NajveciBrojStavki,
			values: [ 0, scope.NajveciBrojStavki ],
			slide: function( event, ui ) 
			{
				scope.FilterObject.StavkeMinValue = ui.values[0];
				scope.FilterObject.StavkeMaxValue = ui.values[1];

				$('#StavkeMinValue').text(ui.values[0]);
				$('#StavkeMaxValue').text(ui.values[1]);

			  	factory.SetNgTable(scope);
			}
		});

 		let SortiraniRacuni = scope.Racuni;
 		if(!scope.FilterObject.PrikaziStornirane)
		{
			SortiraniRacuni = SortiraniRacuni.filter(x =>
				x.Storniran == false)
		}

		if(!scope.FilterObject.PrikaziNesortirane)
		{
			SortiraniRacuni = SortiraniRacuni.filter(x =>
				x.Storniran == true)
		}

		if(scope.FilterObject.SifraRacunaFilter != '')
		{
			SortiraniRacuni = SortiraniRacuni.filter(x =>
				x.SifraRacuna.toString().includes(scope.FilterObject.SifraRacunaFilter.toString()))
		}

		SortiraniRacuni = SortiraniRacuni.filter(x =>
			x.UkupanIznosConverted >= scope.FilterObject.IznosMinValue &&
			x.UkupanIznosConverted <= scope.FilterObject.IznosMaxValue)

		SortiraniRacuni = SortiraniRacuni.filter(x =>
			x.Stavke.length >= scope.FilterObject.StavkeMinValue &&
			x.Stavke.length <= scope.FilterObject.StavkeMaxValue)

		scope.tableParams._settings.dataset = SortiraniRacuni;

		return scope.tableParams;
	}

	return factory;
});

oModul.factory('ArtikliFilterSerivice', function($http)
{
	var factory = {};

	factory.SetNgTable = function(scope)
	{
 		let SortiraniArtikli = scope.Artikli;

		if(scope.FilterObject.SifraArtiklaFilter != '')
		{
			SortiraniArtikli = SortiraniArtikli.filter(x =>
				x.SifraArtikla.toString().includes(scope.FilterObject.SifraArtiklaFilter.toString()))
		}

		if(scope.FilterObject.NazivFilter != '')
		{
			SortiraniArtikli = SortiraniArtikli.filter(x =>
				x.Naziv.toLowerCase().includes(scope.FilterObject.NazivFilter.toLowerCase()))
		}

		if(scope.FilterObject.OpisFilter != '')
		{
			SortiraniArtikli = SortiraniArtikli.filter(x =>
				x.Opis.toLowerCase().includes(scope.FilterObject.OpisFilter.toLowerCase()))
		}

		if(scope.FilterObject.JedinicaMjereFilter != '')
		{
			SortiraniArtikli = SortiraniArtikli.filter(x =>
				x.JedinicaMjere == scope.FilterObject.JedinicaMjereFilter)
		}

		SortiraniArtikli = SortiraniArtikli.filter(x =>
			x.JedinicnaCijenaConverted >= scope.FilterObject.CijenaMinValue &&
			x.JedinicnaCijenaConverted <= scope.FilterObject.CijenaMaxValue);

		if(scope.FilterObject.KategorijaFilter != '')
		{
			SortiraniArtikli = SortiraniArtikli.filter(x =>
				x.Kategorija.Naziv == scope.FilterObject.KategorijaFilter)
		}

		scope.tableParams._settings.dataset = SortiraniArtikli;

		return scope.tableParams;
	}

	return factory;
});