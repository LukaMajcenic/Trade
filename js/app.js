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

oModul.controller('dodajArtiklKontroler', function($scope, $http){

	$scope.NoviArtikl = {
		Naziv: "",
		Opis: "",
		JedinicaMjere: "",
		JedinicnaCijena: ""
	}

	$scope.Submit = function()
	{
		console.log($scope.NoviArtikl);
	}

});