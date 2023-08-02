'use strict';

angular.module('kuralpalApp.valluvarView',[])
 .controller('ValluvarController', function($scope, $http, $mdSidenav, $rootScope) {

    $rootScope.title="Valluvar";
    $rootScope.metaDescription = "Description about Valluvar " + $scope.language;

    $scope.isSidenavOpen = true;
    $mdSidenav('left').toggle();

    $scope.openLeftMenu = function() {
      $mdSidenav('left').toggle();
    };

    var ext = $scope.langExtension;
    if(ext !== '_en' || ext !== ''){
        ext = '_en';
    }
    
    $http.get('kural/valluvar' + ext + '.json')
        .success(function(data){
            $rootScope.details = data;
        });
 	
 }); 