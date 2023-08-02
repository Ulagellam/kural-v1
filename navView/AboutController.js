'use strict';

angular.module('kuralpalApp.aboutView',[])
 .controller('AboutController', function($scope, $http, $mdSidenav, $rootScope) {

    $rootScope.title=" About page";
    $rootScope.metaDescription = "This page provides the detailed about us " + $scope.language;

    $scope.isSidenavOpen = true;
    $mdSidenav('left').toggle();

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };
    
    var ext = $scope.langExtension;
    if(ext !== '_en' || ext !== ''){
        ext = '_en';
    }

    $http.get('kural/about' + ext + '.json')
        .success(function(data){
	    $rootScope.details = data;
	});    
 	
 }); 