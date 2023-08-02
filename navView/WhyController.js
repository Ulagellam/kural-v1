'use strict';

angular.module('kuralpalApp.navView',[])
 .controller('WhyController', function($scope, $http, $mdSidenav, $rootScope) {

    $rootScope.title="Why Kuralpal?";
    $rootScope.metaDescription = "Description about why kuralpalApp " + $scope.language;


    $scope.isSidenavOpen = true;
    $mdSidenav('left').toggle();
    console.log($scope.isSidenavOpen);

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };
 
    var ext = $scope.langExtension;
    if(ext !== '_en' || ext !== ''){
        ext = '_en';
    }
    
    $http.get('kural/why' + ext + '.json')
        .success(function(data){
            $rootScope.details = data;
        });

 }); 