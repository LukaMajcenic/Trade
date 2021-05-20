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

oModul.controller('dodajArtiklKontroler', function($scope, $http){

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
		var AllValid = true;

		$('.customForm').find('.validationLabel').remove();
		$('.customForm').find('*').each(function()
		{
			if(($(this).prop('tagName') == 'INPUT' || $(this).prop('tagName') == 'TEXTAREA') && $(this).val() == '')
			{
				if($(this).attr('type') == 'number')
				{
					$(this).val('');
				}

				//AllValid = false;
				$(this).after('<h3 class="validationLabel mb-2"><i class="fas fa-exclamation-circle me-1"></i>Polje ne može biti prazno!</h3>');
			}
		})

		if($('#floatingNaziv').val() != '')
		{
			var duplicate = false;
			$scope.Artikli.forEach(function(item){
				if(item.Naziv == $scope.NoviArtikl.Naziv && !duplicate)
				{
					$('#floatingNaziv').after('<h3 class="validationLabel mb-2"><i class="fas fa-exclamation-circle me-1"></i>Već postoji proizvod sa tim imenom!</h3>');
					duplicate = true;
				}
			});

			//AllValid = false;
		}

		if($scope.NoviArtikl.JedinicnaCijena === undefined)
		{
			//AllValid = false;
			$('#floatingJedinicnaCijena').after('<h3 class="validationLabel mb-2"><i class="fas fa-exclamation-circle me-1"></i>Neispravan unos!</h3>');
		}

		if(AllValid)
		{
			console.log($scope.NoviArtikl);
			$http.post("http://localhost/KV2/Artikli", JSON.stringify($scope.NoviArtikl))
			  .then(function(response) {
			  	$('.customForm')[0].reset();
			  }, function (response) {

			  });
		}
		else
		{
			console.log(AllValid);
		}
	}

});

oModul.controller('urediArtikleKontroler', function($scope, $http){

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

	$scope.Submit = function()
	{
		alert('xx');
	}
});

oModul.directive('artiklForma', function(){
   return {
      restrict:'E',
      templateUrl:'direktive/artikl_forma',
      scope: {
         artiklParametar: '=',
		 kategorijeParametar: '=',
		 submitParametar: '&'
      },
   };
});