'use strict';

angular.module('kuralpalApp.contributeView',[])
 .controller('ContributeController', function($scope, $http, $mdSidenav, $rootScope) {

    $rootScope.title="Contribute page";
    $rootScope.metaDescription = "This page provides contribution detailed  " + $scope.language;

    $scope.isSidenavOpen = true;
    $mdSidenav('left').toggle();

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    var ext = $scope.langExtension;
    if(ext !== '_en' || ext !== ''){
        ext = '_en';
    }
    
    $http.get('kural/contribute' + ext + '.json')
        .success(function(data){
            $rootScope.details = data;
  	});
 	
 }); 