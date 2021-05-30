var oModul = angular.module('oModul', ['ngRoute']);

oModul.config(function($routeProvider){
	$routeProvider.when('/naslovna', {
		templateUrl: 'predlosci/naslovna.html',
		controller: 'naslovnaKontroler'
	});

	$routeProvider.when('/pregled_racuna', {
		templateUrl: 'predlosci/pregled_racuna.html',
		controller: 'pregledRacunaKontroler'
	});
	$routeProvider.when('/pregled_racuna/:sifra_racuna', {
		templateUrl: 'predlosci/pregled_jednog_racuna.html',
		controller: 'pregledJednogRacunaKontroler'
	});
	$routeProvider.when('/dodaj_racun', {
		templateUrl: 'predlosci/dodaj_racun.html',
		controller: 'dodajRacunKontroler'
	});
	$routeProvider.when('/storniraj_racune', {
		templateUrl: 'predlosci/storniraj_racune.html',
		controller: 'stornirajRacuneKontroler'
	});
	$routeProvider.when('/storniraj_racune/:sifra_racuna', {
		templateUrl: 'predlosci/storniraj_jedan_racun.html',
		controller: 'stornirajJedanRacunKontroler'
	});

	$routeProvider.when('/pregled_artikla', {
		templateUrl: 'predlosci/pregled_artikla.html',
		controller: 'pregledArtiklaKontroler'
	});
	$routeProvider.when('/dodaj_artikl', {
		templateUrl: 'predlosci/dodaj_artikl.html',
		controller: 'dodajArtiklKontroler'
	});
	$routeProvider.when('/uredi_artikle', {
		templateUrl: 'predlosci/uredi_artikle.html',
		controller: 'urediArtikleKontroler'
	});
});

oModul.controller('prijavaKontroler', function($scope){
	$scope.pozdravnaPoruka = "Nalazimo se na naslovnoj stranici";
});

oModul.controller('pregledRacunaKontroler', function($scope, $http){

	$http.get("http://localhost/KV2/Racuni")
	  .then(function(response) {
	    $scope.Racuni = response.data;
	  });

});

oModul.controller('pregledJednogRacunaKontroler', function($scope, $http, $routeParams){

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + $routeParams.sifra_racuna)
	  .then(function(response) {
	    $scope.Racun = response.data[0];
	  });
	  
});

oModul.controller('dodajRacunKontroler', function($scope, $http, $window){

	$scope.NoviRacun = {
		UkupanIznos: 0.00,
		Stavke: []
	}

	$http.get("http://localhost/KV2/Artikli")
	  .then(function(response) {
	    $scope.Artikli = response.data;
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
		+ DatumRaw.getMonth() + ' '
		+ DatumRaw.getHours() + ':'
		+ DatumRaw.getMinutes() + ':'
		+ DatumRaw.getSeconds();

		$http.post("http://localhost/KV2/Racuni", {
				'SifraZaposlenika': 1,
				'UkupanIznos': $scope.NoviRacun.UkupanIznos,
				'Datum': Datum
		})
		.then(function(response) {

			console.log(response);
			$http.get("http://localhost/KV2/Racuni?SifraZaposlenika=1")
			.then(function(response) {

				console.log(response.data);
				$scope.NoviRacun.Stavke.forEach(function(value){
			
					$http.post("http://localhost/KV2/Stavke", {
						'SifraArtikla': value.SifraArtikla,
						'Kolicina': value.Kolicina,
						'UkupnaCijena': value.UkupnaCijena,
						'SifraRacuna': response.data
					})
					.then(function(response) {
						  console.log(response);
					}, function (response) {
		
					});
		
				})
			});
			$window.location.href = '/KV2/#!/pregled_racuna';
		}, function (response) {

		});
	}
	  
});

oModul.controller('stornirajRacuneKontroler', function($scope, $http){

	$http.get("http://localhost/KV2/Racuni")
	  .then(function(response) {
	    $scope.Racuni = response.data;
	  });

	$scope.Storniraj = function(Racun)
	{
		Racun.Storniran = true;

		$http.put("http://localhost/KV2/Racuni", {
				'SifraRacuna' : Racun.SifraRacuna
		})
		.then(function(response) {

		}, function (response) {

		});
	}

});

oModul.controller('stornirajJedanRacunKontroler', function($scope, $http, $routeParams){

	$http.get("http://localhost/KV2/Racuni?SifraRacuna=" + $routeParams.sifra_racuna)
	  .then(function(response) {
	    $scope.Racun = response.data[0];
	  });

	$scope.Storniraj = function(Racun)
	  {
		  Racun.Storniran = true;
  
		  $http.put("http://localhost/KV2/Racuni", {
				  'SifraRacuna' : Racun.SifraRacuna
		  })
		  .then(function(response) {
  
		  }, function (response) {
  
		  });
	  }
	  
});

oModul.controller('pregledArtiklaKontroler', function($scope, $http){

	$http.get("http://localhost/KV2/Artikli")
	  .then(function(response) {
	    $scope.Artikli = response.data;
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

oModul.controller('dodajArtiklKontroler', function($scope, $http, ValidationService){

	$http.get("http://localhost/KV2/Artikli")
	  .then(function(response) {
	    $scope.Artikli = response.data;
	  });

	$http.get("http://localhost/KV2/Kategorije")
	  .then(function(response) {
	    $scope.Kategorije = response.data;
	    $scope.NoviArtikl.Kategorija.SifraKategorije = response.data[0].SifraKategorije;

		console.log($scope.NoviArtikl);
	  });

	$scope.NoviArtikl = {
		Naziv: "",
		Opis: "",
		JedinicaMjere: "Komad",
		JedinicnaCijena: "",
		Kategorija: {
			SifraKategorije: null,
			Naziv: ""
		}
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
				'SifraKategorije': NoviArtikl.Kategorija.SifraKategorije
			})
			  .then(function(response) {
			  	$('.customForm')[0].reset();
			  }, function (response) {

			  });
		}
		else
		{
			console.log('Invalid form');
		}
	}

});
 
oModul.controller('urediArtikleKontroler', function($scope, $http, ValidationService){

	$http.get("http://localhost/KV2/Artikli")
	  .then(function(response) {
	    $scope.Artikli = response.data;
		$scope.Artikli.forEach(function(value){
			value.JedinicnaCijena = parseFloat(value.JedinicnaCijena);
		})
	  });

	$http.get("http://localhost/KV2/Kategorije")
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
		$http.get("http://localhost/KV2/Artikli?SifraArtikla=" + Artikl.SifraArtikla)
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
				'SifraKategorije': Artikl.Kategorija.SifraKategorije
			})
			  .then(function(response) {

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
		$http.delete("http://localhost/KV2/Artikli?SifraArtikla=" + Artikl.SifraArtikla)
		.then(function(response) {
			let index = $scope.Artikli.indexOf(Artikl);
			$scope.Artikli.splice(index, 1);
			alert(response.xhrStatus);		
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
		racuniParametar: '=',
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