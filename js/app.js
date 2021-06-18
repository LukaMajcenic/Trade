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

	$rootScope.SetBreadcrumb = function(Nazivi = null, Linkovi = null)
	{
		$rootScope.BreadcrumbArray = [];
		$rootScope.BreadcrumbArray = [{Naziv : 'Home', Link: '#!/'}]

		if(Nazivi != null && Linkovi != null)
		{
			for(let i = 0; i < Nazivi.length; i++)
			{
				$rootScope.BreadcrumbArray.push({Naziv: Nazivi[i], Link: Linkovi[i]});
			}
		}
	}
	$rootScope.SetBreadcrumb();

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
	$rootScope.User = {};
	$rootScope.User.Valuta = 'ss';
	$http.get("http://localhost/KV2/Zaposlenici?SifraZaposlenika=" + localStorage.getItem("SifraZaposlenika"), $rootScope.ConfigSettings())
	.then(function(response) {
		$rootScope.User = response.data[0];

		localStorage.setItem("Tema", $rootScope.User.Tema);
		$rootScope.PostaviTemu();
	}, function(){
		console.log('redirected');
	});

	window.addEventListener("storage", function (event) {
		if(event.key == 'SifraZaposlenika' || event.key == 'Valuta')
		{
			$rootScope.Logout();
		}
	}, false);

}]);

oModul.factory('ResponseHandler', function($rootScope, $location)
{
	var factory = {};

	factory.Handle = function(response, message = null)
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
	}

	return factory;
});

oModul.config(function($routeProvider){
	$routeProvider.when('/', {
		templateUrl: 'predlosci/home.html',
		controller: 'homeKontroler'
	});

	$routeProvider.when('/login', {
		templateUrl: 'predlosci/login.html',
		controller: 'loginKontroler'
	});

	//Pregled svih racuna
	$routeProvider.when('/pregled_racuna', {
		templateUrl: 'predlosci/pregled_racuna.html',
		controller: 'pregledRacunaKontroler',
		/* resolve: {
            app: function($q, $rootScope, $location) 
			{
                var defer = $q.defer();
                if ($rootScope.currentUser == undefined) 
				{
                    $location.path('/login');
                };
                defer.resolve();
                return defer.promise;
            }
		} */
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
		$window.location.href = '/KV2/#!/';
	}

	$scope.User = {};

	$scope.User.Email = undefined;
	$scope.User.Lozinka = undefined;

	$scope.Submit= function()
	{
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
				localStorage.setItem("Valuta", $rootScope.User.Valuta);

				$rootScope.PostaviTemu();
				localStorage.setItem("SifraZaposlenika", $rootScope.User.SifraZaposlenika);
				$rootScope.Config = {headers:{'SifraZaposlenika': localStorage.getItem("SifraZaposlenika")}};
				$window.location.href = '/KV2/#!/';
			}
		});
	}
});

oModul.controller('homeKontroler', function($rootScope, $scope, $http, $window){

	var ctx = $('#myChart');

	const data = {
		labels: [
		  'Red',
		  'Green',
		  'Yellow',
		  'Grey',
		  'Blue'
		],
		datasets: [{
		  label: 'My First Dataset',
		  data: [11, 16, 7, 3, 14],
		  backgroundColor: [
			'rgb(255, 99, 132)',
			'rgb(75, 192, 192)',
			'rgb(255, 205, 86)',
			'rgb(201, 203, 207)',
			'rgb(54, 162, 235)'
		  ]
		}]
	  };

	const config = {
		type: 'polarArea',
		data: data,
		options: {}
	  };

	  var myChart = new Chart(ctx, config);
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
		$http.get(`https://api.exchangerate.host/convert?from=${$scope.Racun.SifraValute}&to=${$rootScope.User.Valuta}`)
		.then(function(response){
			$scope.Racun.UkupanIznosConverted = parseFloat((response.data.result * $scope.Racun.UkupanIznos).toFixed(2));
		})
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });
});

oModul.controller('dodajRacunKontroler', function($interval, $rootScope, $scope, $http, $window, ResponseHandler){

	$rootScope.SetBreadcrumb(['Dodaj račun'], ['#!/dodaj_racun']);

	$scope.NoviRacun = {
		UkupanIznos: 0.00,
		Stavke: [],
		SifraValute: localStorage.getItem("Valuta")
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
			if(value.SifraValute != $rootScope.User.Valuta)
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
		$scope.NoviRacun.Stavke.forEach(function(Stavka){
			if(Stavka.Kolicina != undefined)
			{
				$http.post("http://localhost/KV2/Racuni", {
				'SifraZaposlenika': $rootScope.User.SifraZaposlenika,
				'UkupanIznos': $scope.NoviRacun.UkupanIznos,
				'Datum': $scope.Datum,
				'SifraValute': $scope.NoviRacun.SifraValute
				}, $rootScope.ConfigSettings())
				.then(function() {

					$http.get("http://localhost/KV2/Racuni?SifraZaposlenika=" + localStorage.getItem("SifraZaposlenika"), 
					$rootScope.ConfigSettings())
					.then(function(response) {

						let BrojStavki = $scope.NoviRacun.Stavke.length;
						$scope.NoviRacun.Stavke.forEach(function(value){
					
							$http.post("http://localhost/KV2/Stavke", {
								'SifraArtikla': value.SifraArtikla,
								'Kolicina': value.Kolicina,
								'JedinicnaCijenaStavke': value.JedinicnaCijena,
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
		})		
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

	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });

	function PostaviNoviArtikl()
	{
		$scope.NoviArtikl = {
			Naziv: "",
			Opis: "",
			JedinicaMjere: "Komad",
			JedinicnaCijena: null,
			Kategorija: {
				SifraKategorije: '1',
				Naziv: ""
			},
			SifraValute: localStorage.getItem("Valuta"),
			Slika: null
		}
	}
	PostaviNoviArtikl();

	$scope.Submit = function(NoviArtikl)
	{
		$scope.NoviArtikl.Errors = GeneralServices.ValidateForm($scope.NoviArtikl);
		if($scope.NoviArtikl.Errors.length == 0)
		{
			$http.post("http://localhost/KV2/Artikli", {
				'SifraArtikla' : NoviArtikl.SifraArtikla,
				'Naziv': NoviArtikl.Naziv,
				'Opis': NoviArtikl.Opis,
				'JedinicaMjere': NoviArtikl.JedinicaMjere,
				'JedinicnaCijena': NoviArtikl.JedinicnaCijena.toFixed(2),
				'SifraKategorije': NoviArtikl.Kategorija.SifraKategorije,
				'SifraValute': NoviArtikl.SifraValute,
				'Slika': NoviArtikl.Slika
			}, $rootScope.ConfigSettings())
			  .then(function(response) {
			  	$('.customForm')[0].reset();
				PostaviNoviArtikl();
			  }, function(response) {
				ResponseHandler.Handle(response);

				if(response.status == 409)
				{
					$scope.NoviArtikl.Errors.push({'Atribut': response.data, 'Poruka': `Artikl s nazivom ${NoviArtikl.Naziv} već postoji`});
				}
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
			$http.get(`https://api.exchangerate.host/convert?from=${Artikl.SifraValute}&to=${$rootScope.User.Valuta}`)
			.then(function(exchangeRate) {
				response.data[0].JedinicnaCijenaConverted = parseFloat((exchangeRate.data.result * Artikl.JedinicnaCijena).toFixed(2));

				let index = $scope.Artikli.findIndex(x => x.SifraArtikla == Artikl.SifraArtikla);
				$scope.Artikli[index] = response.data[0];

				index = $scope.tableParams._settings.dataset.findIndex(x => x.SifraArtikla == Artikl.SifraArtikla);
				for (attr in $scope.tableParams._settings.dataset[index])
				{
					$scope.tableParams._settings.dataset[index][attr] = response.data[0][attr];
				}
				$scope.tableParams.reload();

				$('tr').removeClass('disabledRow'); //enables all rows
				$('.customIconButton').prop('disabled', false); //enable all buttons
				$('.collapse').collapse('hide');
			});
			
			
		});
	}


	$scope.Change = function(Artikl)
	{
		//Rucno mijenjanje naziva kategorije da odgovara sifri kategorije koja je bindana na select
		Artikl.Kategorija.Naziv = $scope.Kategorije.find(x => x.SifraKategorije == Artikl.Kategorija.SifraKategorije).Naziv;

		$http.get(`https://api.exchangerate.host/convert?from=${Artikl.SifraValute}&to=${$rootScope.User.Valuta}`)
		.then(function(response) {
			Artikl.JedinicnaCijenaConverted = parseFloat((response.data.result * Artikl.JedinicnaCijena).toFixed(2));
		});
	}

	$scope.Submit = function(Artikl)
	{
		Artikl.Errors = GeneralServices.ValidateForm(Artikl);
		if(Artikl.Errors.length == 0)
		{			
			$http.put("http://localhost/KV2/Artikli", {
				'SifraArtikla' : Artikl.SifraArtikla,
				'Naziv': Artikl.Naziv,
				'Opis': Artikl.Opis,
				'JedinicaMjere': Artikl.JedinicaMjere,
				'JedinicnaCijena': Artikl.JedinicnaCijena,
				'SifraKategorije': Artikl.Kategorija.SifraKategorije,
				'SifraValute': Artikl.SifraValute,
				'Slika': Artikl.Slika
			}, $rootScope.ConfigSettings())
			.then(function() {
				$('tr').removeClass('disabledRow'); //enables all rows
				$('.customIconButton').prop('disabled', false);
				$('.collapse').collapse('hide');
			}, function (response) {
				ResponseHandler.Handle(response);

				if(response.status == 409)
				{
					Artikl.Errors.push({'Atribut': response.data, 'Poruka': `Artikl s nazivom ${Artikl.Naziv} već postoji`});
				}
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

oModul.controller('pregledZaposlenikaKontroler', function($rootScope, $scope, $http, NgTableParams, ZaposleniciFilterService, ResponseHandler){

	$rootScope.SetBreadcrumb(['Pregled zaposlenika'], ['#!/pregled_zaposlenika']);

	$scope.FilterChange = function()
	{
		$scope.tableParams = ZaposleniciFilterService.SetNgTable($scope);
		$scope.tableParams.reload();
	}

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

		$scope.FilterObject = {};

		$scope.FilterObject.SifraZaposlenikaFilter = '';
		$scope.FilterObject.ImeFilter = '';
		$scope.FilterObject.PrezimeFilter = '';
		$scope.FilterObject.EmailFilter = '';
		$scope.FilterObject.PrikaziAdmine = true;
		$scope.FilterObject.PrikaziZaposlenike = true;

		$scope.tableParams = ZaposleniciFilterService.SetNgTable($scope);
		$scope.tableParams.reload();
	})
});

oModul.controller('urediZaposlenikeKontroler', function($rootScope, $scope, $http, NgTableParams, ZaposleniciFilterService, ResponseHandler){

	$rootScope.SetBreadcrumb(['Uredi zaposlenike'], ['#!/uredi_zaposlenike']);

	$scope.FilterChange = function()
	{
		$scope.tableParams = ZaposleniciFilterService.SetNgTable($scope);
		$scope.tableParams.reload();
	}

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

		$scope.FilterObject = {};

		$scope.FilterObject.SifraZaposlenikaFilter = '';
		$scope.FilterObject.ImeFilter = '';
		$scope.FilterObject.PrezimeFilter = '';
		$scope.FilterObject.EmailFilter = '';
		$scope.FilterObject.PrikaziAdmine = true;
		$scope.FilterObject.PrikaziZaposlenike = true;

		$scope.tableParams = ZaposleniciFilterService.SetNgTable($scope);
		$scope.tableParams.reload();
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
		$rootScope.User.Errors = GeneralServices.ValidateForm($rootScope.User);

		if($rootScope.User.Errors.length == 0)
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
				localStorage.setItem('Valuta', $rootScope.User.Valuta);
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

oModul.directive('zaposleniciFiltriranje', function(){
	return {
	   restrict:'E',
	   templateUrl:'direktive/zaposlenici_filtriranje',
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

oModul.factory('GeneralServices', function($rootScope, $http)
{
	var factory = {};

	factory.ValidateForm = function(Object = null)
	{
		let Errors = [];

		for (prop in Object) 
		{
			if(Object[prop] == '' || Object[prop] === null)
			{
				if(prop != 'Slika')
				{
					Errors.push({'Atribut': prop, 'Poruka': 'Polje ne može biti prazno!'})
				}
			}
			
			if(Object[prop] === undefined)
			{
				Errors.push({'Atribut': prop, 'Poruka': 'Neispravan unos!'})
			}
		}

		return Errors;
	}

	factory.GetExchangeRates = function()
	{
		let BaseCurrency = 'HRK';
		if($rootScope.User != undefined)
		{
			//Ako je korisnik logiran
			BaseCurrency = $rootScope.User.Valuta;
		}
		
		return $http.get('https://api.exchangerate.host/latest?base=' + BaseCurrency).then(function(response)
		{
			let ExchangeRates = response.data.rates;
			for (rate in ExchangeRates) 
			{
				//Invertira bazni exchange rate
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

oModul.factory('ArtikliFilterSerivice', function()
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

oModul.factory('ZaposleniciFilterService', function()
{
	var factory = {};

	factory.SetNgTable = function(scope)
	{
 		let SortiraniZaposlenici = scope.Zaposlenici;

		if(scope.FilterObject.SifraZaposlenikaFilter != '')
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.SifraZaposlenika.toString().includes(scope.FilterObject.SifraZaposlenikaFilter.toString()))
		}

		if(scope.FilterObject.ImeFilter != '')
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Ime.toLowerCase().includes(scope.FilterObject.ImeFilter.toLowerCase()))
		}

		if(scope.FilterObject.PrezimeFilter != '')
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Prezime.toLowerCase().includes(scope.FilterObject.PrezimeFilter.toLowerCase()))
		}

		if(scope.FilterObject.EmailFilter != '')
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Email.toLowerCase().includes(scope.FilterObject.EmailFilter.toLowerCase()))
		}

		if(!scope.FilterObject.PrikaziAdmine)
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Admin == false)
		}

		if(!scope.FilterObject.PrikaziZaposlenike)
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Admin == true)
		}

		scope.tableParams._settings.dataset = SortiraniZaposlenici;

		return scope.tableParams;
	}

	return factory;
});