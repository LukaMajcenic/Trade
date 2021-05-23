var oModul = angular.module('oModul', ['ngRoute']);

oModul.config(function($routeProvider){
	$routeProvider.when('/naslovna', {
		templateUrl: 'predlosci/naslovna.html',
		controller: 'naslovnaKontroler'
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

oModul.controller('dodajArtiklKontroler', function($scope, $http, ValidationService){

	$http.get("http://localhost/KV2/Artikli")
	  .then(function(response) {
	    $scope.Artikli = response.data;
	  });

	$http.get("http://localhost/KV2/Kategorije")
	  .then(function(response) {
	    $scope.Kategorije = response.data;
	    $scope.NoviArtikl.SifraKategorije = response.data[0].SifraKategorije;
	  });

	$scope.NoviArtikl = {
		Naziv: "",
		Opis: "",
		JedinicaMjere: "Komad",
		JedinicnaCijena: ""
	}

	$scope.Submit = function()
	{
		if(ValidationService.ValidateForm('.customForm'))
		{
			console.log($scope.NoviArtikl);
			$http.post("http://localhost/KV2/Artikli", $scope.NoviArtikl)
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
				'SifraKategorije': '1'
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
		odustaniParametar: '&'
      },
   };
});