var oModul = angular.module('oModul', ['ngRoute', 'ngTable']);

oModul.run(['$rootScope', '$http', '$location', function ($rootScope, $http, $location) {

	$rootScope.Logout = function()
	{
		$http.post("http://localhost/KV2/Logout")
		.then(function(response) {
			$rootScope.User = undefined;
			$location.url("/login");
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
	
	$http.get("http://localhost/KV2/Zaposlenici?SifraZaposlenika=" + localStorage.getItem("SifraZaposlenika"), $rootScope.ConfigSettings())
	.then(function(response) {
		$rootScope.User = response.data[0];
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
				localStorage.setItem("SifraZaposlenika", $rootScope.User.SifraZaposlenika);
				$rootScope.Config = {headers:{'SifraZaposlenika': localStorage.getItem("SifraZaposlenika")}};
				$window.location.href = '/KV2/#!/dodaj_racun';
			}
		});
	}
});

oModul.controller('pregledRacunaKontroler', function($rootScope, $scope, $http, NgTableParams, RacuniFilterSerivice, ResponseHandler){

   	$(document).on('DOMSubtreeModified', '.SliderValue', function() {
		if($scope.FilterObject != undefined && $scope.FilterObject != undefined) $scope.FilterChange();	
		});

	$scope.FilterChange = function()
	{
		$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	$http.get("http://localhost/KV2/Racuni", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Racuni = response.data;
		
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
});

oModul.controller('pregledJednogRacunaKontroler', function($rootScope, $scope, $http, $routeParams, ResponseHandler){

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + $routeParams.sifra_racuna, $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Racun = response.data[0];
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });
	  
});

oModul.controller('dodajRacunKontroler', function($rootScope, $scope, $http, $window, ResponseHandler){

	$scope.NoviRacun = {
		UkupanIznos: 0.00,
		Stavke: [],
		SifraValute: 'HRK'
	}

	$scope.ValutaChange = function()
	{
		console.log($scope.NoviRacun.SifraValute);
		$scope.Artikli.forEach(function(value){
			$http.get(`http://free.currconv.com/api/v7/convert?apiKey=dd8550b7929baea6904f&q=${value.SifraValute}_${$scope.NoviRacun.SifraValute}&compact=y`)
			.then(function(response) {
				value.JedinicnaCijena = (response.data[value.SifraValute + $scope.NoviRacun.SifraValute].val * value.JedinicnaCijena).toFixed(2);;
			});
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
				$http.get(`http://free.currconv.com/api/v7/convert?apiKey=dd8550b7929baea6904f&q=${value.SifraValute}_HRK&compact=y`)
				.then(function(response) {
					value.JedinicnaCijena = (response.data[value.SifraValute + '_HRK'].val * value.JedinicnaCijena).toFixed(2);;
				});
			}
		})
		
	  }, function errorCallback(response) {
		ResponseHandler.Handle(response);
	  });

	$scope.DodajStavku = function(Artikl)
	{
		let novaStavka = {
			Kolicina: 1,
			UkupnaCijena: 1*parseFloat(Artikl.JedinicnaCijena),
			SifraArtikla: Artikl.SifraArtikla,
			Naziv: Artikl.Naziv,
			Opis:  Artikl.Opis,
			JedinicaMjere: Artikl.JedinicaMjere,
			JedinicnaCijena: parseFloat(Artikl.JedinicnaCijena),
			Slika: Artikl.Slika,
			Kategorija: Artikl.Kategorija
		}
		console.log(novaStavka);

		$scope.NoviRacun.Stavke.push(novaStavka);

		$scope.PromijeniUkupnuCijenu();
	}

	$scope.PromijeniUkupnuCijenu = function(Stavka = null)
	{
		if(Stavka != null)
		{
			Stavka.UkupnaCijena = Stavka.Kolicina * Stavka.JedinicnaCijena;
		}

		$scope.NoviRacun.UkupanIznos = 0.00;
		$scope.NoviRacun.Stavke.forEach(function(value){
			$scope.NoviRacun.UkupanIznos += value.UkupnaCijena;
		})
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
				'Datum': Datum
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

oModul.controller('stornirajRacuneKontroler', function($rootScope, $scope, $http, NgTableParams, RacuniFilterSerivice, ResponseHandler){

	$(document).on('DOMSubtreeModified', '.SliderValue', function() {
		if($scope.FilterObject != undefined && $scope.FilterObject != undefined) $scope.FilterChange();	
		});

	$scope.FilterChange = function()
	{
		$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	$http.get("http://localhost/KV2/Racuni", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Racuni = response.data;
		
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

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + $routeParams.sifra_racuna, $rootScope.ConfigSettings())
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

oModul.controller('pregledArtiklaKontroler', function($rootScope, $scope, $http, NgTableParams, ArtikliFilterSerivice, ResponseHandler){

	$scope.FilterChange = function()
	{
		$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	$http.get("http://localhost/KV2/Artikli", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Artikli = response.data;

		$scope.Artikli.forEach(function(value){
			if(value.SifraValute != 'HRK')
			{
				$http.get(`http://free.currconv.com/api/v7/convert?apiKey=dd8550b7929baea6904f&q=${value.SifraValute}_HRK&compact=y`)
				.then(function(response) {
					value.JedinicnaCijenaConverted = (response.data[value.SifraValute + '_HRK'].val * value.JedinicnaCijena).toFixed(2);;
				});
			}
		})

		$scope.tableParams = new NgTableParams(
		{
			sorting: 
			{
				Naziv: 'asc'
			},
		});

		$scope.NajvecaCijena = Math.max.apply(Math,$scope.Artikli.map(function(o){return o.JedinicnaCijena;}));
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

oModul.controller('dodajArtiklKontroler', function($rootScope, $scope, $http, ValidationService, ResponseHandler){

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
		if(ValidationService.ValidateForm('.customForm'))
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
 
oModul.controller('urediArtikleKontroler', function($rootScope, $scope, $http, ValidationService, NgTableParams, ArtikliFilterSerivice, ResponseHandler){

	$http.get("http://localhost/KV2/Valute", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Valute = response.data;
		console.log($scope.Valute);
	  });

	$scope.FilterChange = function()
	{
		$scope.tableParams = ArtikliFilterSerivice.SetNgTable($scope);
		$scope.tableParams.reload();
	}

	$http.get("http://localhost/KV2/Artikli", $rootScope.ConfigSettings())
	  .then(function(response) {
	    $scope.Artikli = response.data;

		$scope.Artikli.forEach(function(value){
			if(value.SifraValute != 'HRK')
			{
				$http.get(`http://free.currconv.com/api/v7/convert?apiKey=dd8550b7929baea6904f&q=${value.SifraValute}_HRK&compact=y`)
				.then(function(response) {
					value.JedinicnaCijenaConverted = (response.data[value.SifraValute + '_HRK'].val * value.JedinicnaCijena).toFixed(2);;
				});
			}
		})

		$scope.tableParams = new NgTableParams(
		{
			sorting: 
			{
				SifraArtikla: 'asc'
			},
		});

		$scope.NajvecaCijena = Math.max.apply(Math,$scope.Artikli.map(function(o){return o.JedinicnaCijena;}));
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
			$('.customIconButton').prop('disabled', false);
		});
	}


	$scope.Change = function(Artikl)
	{
		Artikl.Kategorija.Naziv = $scope.Kategorije.find(x => x.SifraKategorije == Artikl.Kategorija.SifraKategorije).Naziv;
	}

	$scope.Submit = function(Artikl)
	{
		console.log(Artikl);
		if(ValidationService.ValidateForm('#form' + Artikl.SifraArtikla))
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
			let index = $scope.Artikli.indexOf(Artikl);
			$scope.Artikli.splice(index, 1);
			$scope.tableParams.reload();
		});
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

oModul.factory('ValidationService', function()
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
			x.UkupanIznos >= scope.FilterObject.IznosMinValue &&
			x.UkupanIznos <= scope.FilterObject.IznosMaxValue)

		SortiraniRacuni = SortiraniRacuni.filter(x =>
			x.Stavke.length >= scope.FilterObject.StavkeMinValue &&
			x.Stavke.length <= scope.FilterObject.StavkeMaxValue)

		scope.tableParams._settings.dataset = SortiraniRacuni;

		return scope.tableParams;
	}

	return factory;
})

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
			x.JedinicnaCijena >= scope.FilterObject.CijenaMinValue &&
			x.JedinicnaCijena <= scope.FilterObject.CijenaMaxValue);

		if(scope.FilterObject.KategorijaFilter != '')
		{
			SortiraniArtikli = SortiraniArtikli.filter(x =>
				x.Kategorija.Naziv == scope.FilterObject.KategorijaFilter)
		}

		scope.tableParams._settings.dataset = SortiraniArtikli;

		return scope.tableParams;
	}

	return factory;
})