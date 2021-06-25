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

	$rootScope.ShowAlert = function(message = null)
	{
		$rootScope.AlertMessage = message;
		if(message == null)
		{
			$rootScope.AlertMessage = "Došlo je do pogreške!";
			$('.alertDiv').addClass("bg-danger");	
		}

		$('.alertDiv').addClass("visible");
		setTimeout(function() 
		{
			$('.alertDiv').removeClass("visible");
			$('.alertDiv').removeClass("bg-danger");
		}, 2000);
	}

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
				$location.url("/");
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

oModul.controller('loginKontroler', function($rootScope, $scope, $http, $window, GeneralServices){

	if($rootScope.User != undefined)
	{
		$window.location.href = '/KV2/#!/';
	}

	$scope.User = {};

	$scope.User.Email = "";
	$scope.User.Lozinka = "";

	$scope.Submit= function()
	{
		$scope.User.Errors = GeneralServices.ValidateForm($scope.User);
		if($scope.User.Errors.length == 0)
		{
			$http.post("http://localhost/KV2/Login", $scope.User)
			.then(function(response) {
				$rootScope.User = response.data;
				localStorage.setItem("Tema", $rootScope.User.Tema);
				localStorage.setItem("Valuta", $rootScope.User.Valuta);

				$rootScope.PostaviTemu();
				localStorage.setItem("SifraZaposlenika", $rootScope.User.SifraZaposlenika);
				$rootScope.Config = {headers:{'SifraZaposlenika': localStorage.getItem("SifraZaposlenika")}};
				$window.location.href = '/KV2/#!/';
			}, function(response){
				if(response.status == 401)
				{
					$scope.User.Errors.push({'Atribut': 'Lozinka', 'Poruka': `Neispravna lozinka`});
				}
				else if(response.status == 404)
				{
					$scope.User.Errors.push({'Atribut': 'Email', 'Poruka': `Zaposlenik ne postoji`});
				}
			});
		}
	}
});

oModul.controller('homeKontroler', function($rootScope, $scope, $http, ResponseHandler){

	$rootScope.SetBreadcrumb([], []);

	function groupBy(xs, key) {
		return xs.reduce(function(rv, x) {
		  (rv[x[key]] = rv[x[key]] || []).push(x);
		  return rv;
		}, {});
	};

	function randomShadeRed()
	{
		let min = 150;
		let max = 255;
		let R = Math.floor(Math.random() * (max - min + 1)) + min;
		let A =	Math.random() * (0.8 - 0.5) + 0.5;

		return 'rgba('+ R +', 0, 0, ' + A +')';
	} 

	$http.get("http://localhost/KV2/Statistika", $rootScope.ConfigSettings())
	.then(function(response){
		let Statistika = response.data;	

		//#region Racuni po ukupnom iznosu
		let TotalAmountGroups = [0,0,0,0,0];
		let Counter = Statistika.Racuni.length;
		
		Statistika.Racuni.forEach(function(value)
		{
			$http.get(`https://api.exchangerate.host/convert?from=${value.SifraValute}&to=${$rootScope.User.Valuta}`)
			.then(function(response){
				Counter--;
				value.UkupanIznosConverted = parseFloat((response.data.result * value.UkupanIznos).toFixed(2));

				if(value.UkupanIznosConverted <= 50)
				{
					TotalAmountGroups[0]++;
				}
				else if(value.UkupanIznosConverted <= 100)
				{
					TotalAmountGroups[1]++;
				}
				else if(value.UkupanIznosConverted <= 500)
				{
					TotalAmountGroups[2]++;
				}
				else if(value.UkupanIznosConverted <= 1000)
				{
					TotalAmountGroups[3]++;
				}
				else
				{
					TotalAmountGroups[4]++;
				}

				if (Counter == 0) 
				{
					const data1 = {
						labels: ['0-50', '51-100', '101-500', '501-1000', '1000+'],
						datasets: [{
						  label: 'My First Dataset',
						  data: TotalAmountGroups,
						  backgroundColor: [
							'rgb(255, 99, 132)',
							'rgb(75, 192, 192)',
							'rgb(255, 205, 86)',
							'rgb(201, 203, 207)'
						  ]}]
					};

					const config1 = {
						type: 'polarArea',
						data: data1,
						options: {}
					};

					var ctx = $('#Racuni1');

					var myChart = new Chart(ctx, config1);
				}				
			})
		})	
		
		//#endregion

		//#region Racuni po valutama
		
		let labels1 = [];
		let dataset1 = [];
		for(attr in groupBy(Statistika.Racuni, 'SifraValute'))
		{
			labels1.push(attr);
			dataset1.push(groupBy(Statistika.Racuni, 'SifraValute')[attr].length);
		}

		const data2 = {
			labels: labels1,
			datasets: [{
			  label: 'My First Dataset',
			  data: dataset1,
			  backgroundColor: [
				'rgb(255, 99, 132)',
				'rgb(54, 162, 235)',
				'rgb(255, 205, 86)'
			  ],
			  hoverOffset: 4
			}]
		};

		const config2 = {
			type: 'doughnut',
			data: data2,
			options: {
				cutout: '65%'
			}
		};

		var ctx2 = $('#Racuni2');

		var myChart2 = new Chart(ctx2, config2);

		//#endregion

		//#region Racuni po datumima

		let DaysFrom = [0, 1, 2, 3, 4, 5, 6];
		let data3 = [0, 0, 0, 0, 0, 0, 0];
		let labels3 = new Array(7); //dani u tjednu

		Statistika.Racuni.map(x => x.Datum).forEach(function(RacunDate)
		{			
			DaysFrom.forEach(function(value, index)
			{
				let CurrentDate = new Date();
				RacunDate = new Date(RacunDate);

				CurrentDate.setDate(CurrentDate.getDate() - DaysFrom[index]);
				switch(CurrentDate.getDay())
				{
					case 0:
						labels3[index] = "Nedjelja";
						break;
					case 1:
						labels3[index] = "Ponedjeljak";
						break;
					case 2:
						labels3[index] = "Utorak";
						break;
					case 3:
						labels3[index] = "Srijeda";
						break;
					case 4:
						labels3[index] = "Četvrtak";
						break;
					case 5:
						labels3[index] = "Petak";
						break;
					case 6:
						labels3[index] = "Subota";
						break;

				}

				CurrentDate = CurrentDate.getFullYear() + '-' + (CurrentDate.getMonth()+1) + '-' + CurrentDate.getDate();
				RacunDate = RacunDate.getFullYear() + '-' + (RacunDate.getMonth()+1) + '-' + RacunDate.getDate();

				if(RacunDate == CurrentDate)
				{
					data3[index]++;
				}
			})
		})
		labels3[0] += " (danas)";
		labels3[1] += " (jučer)";

		const dataznj = {
		labels: labels3.reverse(),
		datasets: [{
			label: 'Količina izdanih računa',
			data: data3.reverse(),
			fill: false,
			borderColor: 'rgb(75, 192, 192)',
			tension: 0.4
			}]
		};

		const config3 = { type: 'line', data: dataznj};

		var ctx3 = $('#Racuni3');

		var myChart3 = new Chart(ctx3, config3);

		//#endregion
		
	}, function(response){
		ResponseHandler.Handle(response)
	})
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
		$scope.FilterObject.SifreZaposlenikaUnique = [...new Set($scope.tableParams._settings.dataset.map(x => x.SifraZaposlenika))];
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
			$scope.FilterObject.SifraZaposlenikaFilter = '';

			$scope.FilterObject.IznosMinValue = 0;
			$scope.FilterObject.IznosMaxValue = $scope.NajveciUkupanIznos;

			$scope.FilterObject.StavkeMinValue = 0;
			$scope.FilterObject.StavkeMaxValue = $scope.NajveciBrojStavki;

			$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
			$scope.tableParams.reload();
			$scope.FilterObject.SifreZaposlenikaUnique = [...new Set($scope.tableParams._settings.dataset.map(x => x.SifraZaposlenika))];

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
			$scope.Racun.Stavke.forEach(function(value){
				value.JedinicnaCijenaConverted = parseFloat((response.data.result * value.JedinicnaCijena).toFixed(2));
				value.UkupnaCijenaConverted = parseFloat((response.data.result * value.UkupnaCijena).toFixed(2));
				console.log(value);
			})

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
				value.UkupnaCijenaConverted = parseFloat((response.data.result * value.UkupnaCijena).toFixed(2));
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
			JedinicnaCijena: Artikl.JedinicnaCijenaConverted,
			Slika: Artikl.Slika,
			Kategorija: Artikl.Kategorija,
			SifraValute: Artikl.SifraValute,
			JedinicnaCijenaConverted: Artikl.JedinicnaCijenaConverted,
			UkupnaCijenaConverted: Artikl.JedinicnaCijenaConverted
		}

		$scope.NoviRacun.Stavke.push(novaStavka);
		$scope.PromijeniUkupnuCijenu();
	}

	$scope.PromijeniUkupnuCijenu = function(Stavka = null)
	{
		if(Stavka != null)
		{
			Stavka.UkupnaCijenaConverted = parseFloat((Stavka.Kolicina * Stavka.JedinicnaCijenaConverted).toFixed(2));
		}

		$scope.NoviRacun.UkupanIznos = 0.00;
		$scope.NoviRacun.Stavke.forEach(function(value){
			$scope.NoviRacun.UkupanIznos += value.UkupnaCijenaConverted;
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
		$scope.PromijeniUkupnuCijenu();
	}

	$scope.Submit = function()
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
						'JedinicnaCijenaStavke': value.JedinicnaCijenaConverted,
						'UkupnaCijena': value.UkupnaCijenaConverted,
						'SifraRacuna': response.data
					}, $rootScope.ConfigSettings())
					.then(function() {
						BrojStavki--;
						if(BrojStavki == 0)
						{
							//Ako su sve stavke spremljene vracamo se na pregled racuna
							$window.location.href = '/KV2/#!/pregled_racuna';
							$rootScope.ShowAlert(`Račun ${response.data} dodan`);
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
		$scope.FilterObject.SifreZaposlenikaUnique = [...new Set($scope.tableParams._settings.dataset.map(x => x.SifraZaposlenika))];
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
			$scope.FilterObject.SifraZaposlenikaFilter = '';

			$scope.FilterObject.IznosMinValue = 0;
			$scope.FilterObject.IznosMaxValue = $scope.NajveciUkupanIznos;

			$scope.FilterObject.StavkeMinValue = 0;
			$scope.FilterObject.StavkeMaxValue = $scope.NajveciBrojStavki;

			$scope.tableParams = RacuniFilterSerivice.SetNgTable($scope);
			$scope.tableParams.reload();
			$scope.FilterObject.SifreZaposlenikaUnique = [...new Set($scope.tableParams._settings.dataset.map(x => x.SifraZaposlenika))];

		}, function errorCallback(response) {
			ResponseHandler.Handle(response);
		});

	})

	$scope.Storniraj = function(Racun)
	{
		var r = confirm("Jeste li sigurni da želite stornirati račun " + Racun.SifraRacuna);
		if (r == true) 
		{			
			$http.put("http://localhost/KV2/Racuni", {
					'SifraRacuna' : Racun.SifraRacuna
			},  $rootScope.ConfigSettings())
			.then(function(response) {
				Racun.Storniran = true;
				$rootScope.ShowAlert(`Račun ${Racun.SifraRacuna} storniran`);
			}, function (response) {
				$rootScope.ShowAlert();
			});
		}		
	}

});

oModul.controller('stornirajJedanRacunKontroler', function($rootScope, $scope, $http, $routeParams, ResponseHandler){

	let SifraRacuna = $routeParams.sifra_racuna;
	$rootScope.SetBreadcrumb(['Storniraj račune', 'Račun ' + SifraRacuna], ['#!/storniraj_racune', '#!/storniraj_racune/' + SifraRacuna]);

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + SifraRacuna, $rootScope.ConfigSettings())
	.then(function(response) {
	    $scope.Racun = response.data[0];

		$http.get(`https://api.exchangerate.host/convert?from=${$scope.Racun.SifraValute}&to=${$rootScope.User.Valuta}`)
		.then(function(response){
			$scope.Racun.UkupanIznosConverted = parseFloat((response.data.result * $scope.Racun.UkupanIznos).toFixed(2));
			$scope.Racun.Stavke.forEach(function(value){
				value.JedinicnaCijenaConverted = parseFloat((response.data.result * value.JedinicnaCijena).toFixed(2));
				value.UkupnaCijenaConverted = parseFloat((response.data.result * value.UkupnaCijena).toFixed(2));
			})

		})
	}, function(response) {
		ResponseHandler.Handle(response);
	});

	$scope.Storniraj = function(Racun)
	{
		var r = confirm("Jeste li sigurni da želite stornirati račun " + Racun.SifraRacuna);
		if (r == true) 
		{
			$http.put("http://localhost/KV2/Racuni", {
					'SifraRacuna' : Racun.SifraRacuna
			},  $rootScope.ConfigSettings())
			.then(function(response) {
				Racun.Storniran = true;
				$rootScope.ShowAlert(`Račun ${Racun.SifraRacuna} storniran`);
			}, function() {
				$rootScope.ShowAlert();
			});
		}
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
			$rootScope.ShowAlert();
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
			var r = confirm("Jeste li sigurni da želite dodati artikl " + NoviArtikl.Naziv);
			if (r == true) 
			{
				$http.post("http://localhost/KV2/Artikli", {
					'Naziv': NoviArtikl.Naziv,
					'Opis': NoviArtikl.Opis,
					'JedinicaMjere': NoviArtikl.JedinicaMjere,
					'JedinicnaCijena': NoviArtikl.JedinicnaCijena.toFixed(2),
					'SifraKategorije': NoviArtikl.Kategorija.SifraKategorije,
					'SifraValute': NoviArtikl.SifraValute,
					'Slika': NoviArtikl.Slika
				}, $rootScope.ConfigSettings())
				.then(function() {
					$('.customForm')[0].reset();
					PostaviNoviArtikl();
					$rootScope.ShowAlert(`Artikl ${NoviArtikl.Naziv} dodan`);
				}, function(response) {
					ResponseHandler.Handle(response);

					if(response.status == 409)
					{
						$scope.NoviArtikl.Errors.push({'Atribut': response.data, 'Poruka': `Artikl s nazivom ${NoviArtikl.Naziv} već postoji`});
					}
				});
			}
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
		console.log(Artikl.Errors);
		if(Artikl.Errors.length == 0)
		{		
			var r = confirm("Jeste li sigurni da želite urediti artikl " + Artikl.Naziv);
			if (r == true) 
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
					$rootScope.ShowAlert(`Artikl ${Artikl.Naziv} ažuriran`);
				}, function (response) {
					ResponseHandler.Handle(response);

					if(response.status == 409)
					{
						Artikl.Errors.push({'Atribut': response.data, 'Poruka': `Artikl s nazivom ${Artikl.Naziv} već postoji`});
					}
				});
			}
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
		$scope.FilterObject.PrikaziAktivne = true;
		$scope.FilterObject.PrikaziDeaktivirane = false;

		$scope.tableParams = ZaposleniciFilterService.SetNgTable($scope);
		$scope.tableParams.reload();
	}, function(response){
		ResponseHandler.Handle(response);
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
		$scope.FilterObject.PrikaziAktivne = true;
		$scope.FilterObject.PrikaziDeaktivirane = false;

		$scope.tableParams = ZaposleniciFilterService.SetNgTable($scope);
		$scope.tableParams.reload();
	}, function(response){
		ResponseHandler.Handle(response);
	})

	$scope.AdminChange = function(Zaposlenik)
	{		
		$scope.UrediZaposlenika(Zaposlenik, 'Admin' + Zaposlenik.Admin);
	}

	$scope.DeaktivirajRacun = function(Zaposlenik)
	{
		$scope.UrediZaposlenika(Zaposlenik, 'Deaktiviran');
	}

	$scope.UrediZaposlenika = function(Zaposlenik, Atribut)
	{
		console.log(Atribut)
		if(Atribut == 'Deaktiviran')
		{
			var r = confirm("Jeste li sigurni da želite deaktivirati korisnika " + Zaposlenik.Ime + " " + Zaposlenik.Prezime);
		}
		else if(Atribut == 'Admin1')
		{
			var r = confirm("Jeste li sigurni da želite ukloniti administratorska prava korisniku " + Zaposlenik.Ime + " " + Zaposlenik.Prezime);
		}
		else if(Atribut == 'Admin0')
		{
			var r = confirm("Jeste li sigurni da želite dodijeliti administratorska prava korisniku " + Zaposlenik.Ime + " " + Zaposlenik.Prezime);
		}	
		
		if (r == true) 
		{
			if(Atribut == 'Deaktiviran')
			{
				Zaposlenik.Deaktiviran = '1';
			}
			else
			{
				if(Zaposlenik.Admin == 1) {Zaposlenik.Admin = '0';}
				else {Zaposlenik.Admin = '1';}
			}

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
				$rootScope.ShowAlert(`Zaposlenik ${Zaposlenik.Ime} ${Zaposlenik.Prezime} ažuriran`);			
				
			}, function(response){
				ResponseHandler.Handle(response);
			})
		}
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
		var r = confirm("Jeste li sigurni?");
		if (r == true) 
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
					$rootScope.ShowAlert(`Profil ažuriran`);
				})
			}
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

	factory.ValidateForm = function(Object)
	{
		let Errors = [];

		for (prop in Object) 
		{
			if(Object[prop] == '' || Object[prop] === null)
			{
				if(prop != 'Slika' && prop != 'Errors')
				{
					Errors.push({'Atribut': prop, 'Poruka': 'Polje ne može biti prazno!'})
				}
			}
			
			if(Object[prop] === undefined)
			{
				if(prop != 'Slika' && prop != 'Errors')
				{
					Errors.push({'Atribut': prop, 'Poruka': 'Neispravan unos!'})
				}
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

		if(scope.FilterObject.SifraZaposlenikaFilter != '')
		{
			SortiraniRacuni = SortiraniRacuni.filter(x =>
				x.SifraZaposlenika.toString().includes(scope.FilterObject.SifraZaposlenikaFilter.toString()))
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

		if(!scope.FilterObject.PrikaziAktivne)
		{
			console.log(scope.FilterObject);
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Deaktiviran == true)
		}

		if(!scope.FilterObject.PrikaziDeaktivirane)
		{
			SortiraniZaposlenici = SortiraniZaposlenici.filter(x =>
				x.Deaktiviran == false)
		}

		scope.tableParams._settings.dataset = SortiraniZaposlenici;

		return scope.tableParams;
	}

	return factory;
});