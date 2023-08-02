'use strict';

angular.module('kuralpalApp.contactView',[])
 .controller('ContactController', function($scope, $mdSidenav, $rootScope) {

    $rootScope.title="Contact us page";
    $rootScope.metaDescription = "This page provides the detailed contact us " + $scope.language;

    $scope.isSidenavOpen = true;
    $mdSidenav('left').toggle();

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };
 	
 }); 