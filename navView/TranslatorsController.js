'use strict';

angular.module('kuralpalApp.translatorsView',[])
 .controller('TranslatorsController', function($scope, $http, $mdSidenav, $rootScope) {

    $rootScope.title="Translators page";
    $rootScope.metaDescription = "This page provides details about the Translators " + $scope.language;

    $scope.isSidenavOpen = true;
    $mdSidenav('left').toggle();

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    var ext = $scope.langExtension;
    if(ext !== '_en' || ext !== ''){
        ext = '_en';
    }

    $http.get('kural/translators' + ext + '.json')
        .success(function(data){
            $rootScope.details = data;
  	});
 	
 }); 