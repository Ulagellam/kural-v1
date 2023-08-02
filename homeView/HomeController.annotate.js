'use strict';
angular.module('kuralpalApp.contentView', []).controller('HomeController', [
  '$q',
  '$scope',
  '$http',
  '$mdSidenav',
  '$rootScope',
  '$location',
  'dataService',
  '$timeout',
  '$state',
  function HomeController($q, $scope, $http, $mdSidenav, $rootScope, $location, dataService, $timeout, $state) {
    $rootScope.title = 'Home page';
    $rootScope.metaDescription = 'Its the dashboard for the kuralpalApp';
    $scope.loaded = false;
    if ($scope.isSidenavOpen === true) {
      $mdSidenav('left').toggle();
    }
    $scope.isSidenavOpen = false;
    $scope.openLeftMenu = function () {
      $mdSidenav('left').toggle();
    };
    $scope.lang = [
      {
        'id': 2,
        'name': 'English'
      },
      {
        'id': 1,
        'name': '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd'
      }
    ];
    $scope.updateLangExtensions = function (language, callback) {
      if (language === 'English') {
        $scope.langExtension = '_en';
        //set Default Iyal
        $scope.selectedIyal = 'Introduction';
      } else if (language === '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd') {
        $scope.langExtension = '';
        $scope.playtip = '\u0b87\u0ba8\u0bcd\u0ba4 \u0b95\u0bc1\u0bb1\u0bb3\u0bc8 \u0b95\u0bc7\u0b9f\u0bcd\u0b95 \u0b87\u0b99\u0bcd\u0b95\u0bc7 \u0b95\u0bbf\u0bb3\u0bbf\u0b95\u0bcd \u0b9a\u0bc6\u0baf\u0bcd\u0baf\u0bb5\u0bc1\u0bae\u0bcd';
      }
      return callback();
    };
    $scope.loadLabels = function () {
      var ext = $scope.langExtension.length > 0 ? $scope.langExtension : '';
      dataService.getLabels(ext).then(getLbls).catch(getErrorCallback);
    };
    function getLbls(labels) {
      $rootScope.labels = labels;
    }
    function getErrorCallback(errorMsg) {
      console.log('Error message ' + errorMsg);
    }
    $scope.selectedIyl = function (palId) {
      $scope.iyals = [];
      $scope.athikaram="";
      $http.get('kural/iyal' + $scope.langExtension + '.json').success(function (data1) {
        var iyals = [];
        for (var i = 0; i < data1.length; i++) {
          if (data1[i].pal_id === palId)
            iyals.push(data1[i].iyal);
        }
        $scope.iyals = iyals[0];
        $scope.selectedIyal = $scope.iyals[0];
        $scope.selectedPalId = palId;
        $scope.selectedPal = $scope.pal[$scope.selectedPalId - 1].name;
      });
      $scope.selectedAthikaram($scope.selectedLanguage);
      $scope.selectedKurals($scope.athikaram);
    };
    $scope.selectedAthikaram = function (language) {
      $http.get('kural/athikaram' + $scope.langExtension + '.json').success(function (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].iyal === $scope.selectedIyal)
            $scope.athikarams = data[i].athikaram;
        }
        $scope.athikaram = $scope.athikarams[0];
      });
    };
    $scope.selectedKurals = function (selectedAthikaram) {
      $http.get('kural/kurals' + $scope.langExtension + '.json').success(function (data) {
        for (var i = 0; i < data.length; i++) {
          if (data[i].athikaram.replace(/^\s+|\s+$/g, '') === $scope.athikaram.replace(/^\s+|\s+$/g, '')) {
            $scope.kurals = data[i].kurals;
          }
        }
        console.log('kurals loaded');
      });
      $scope.athikaram = selectedAthikaram;
      $http.get('kural/translation' + $scope.langExtension + '.json').success(function (data) {
        $scope.trans = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].athikaram.replace(/^\s+|\s+$/g, '') === $scope.athikaram.replace(/^\s+|\s+$/g, '')) {
            for (var j = 0; j < data[i].trans.length; j++) {
              $scope.trans.push(data[i].trans[j]);
            }
          }
        }
      });
    };
    $scope.selectedTrans = function (language) {
      $scope.selectedLangage = language;
      $scope.updateLangExtensions(language, function () {
        $scope.selectedPalId = $scope.selectedPalId != undefined ? $scope.selectedPalId : 1;
        $http.get('kural/pal' + $scope.langExtension + '.json').success(function (data) {
          $scope.pal = data;
          $scope.selectedPal = data[$scope.selectedPalId - 1].name;
        });
        $scope.loadLabels();
        $scope.selectedIyl($scope.selectedPalId);
        if (!$state.abstract) {
          $state.reload();
        }
        if ($location.path() != '/') {
          $http.get('kural' + $location.path() + $scope.langExtension + '.json').success(function (data) {
            $rootScope.details = data;
          });
        }
      });
    };
    //$scope.selectedTrans($scope.selectedLanguage);
    //$timeout(function() { $scope.loaded = true; }, 5000);
    //setTimeout(function() {  }, 1000); 
    //$rootScope.spinner.off();
    $scope.playing = false;
    $scope.playKural = function (kural) {
      if (document.getElementById(kural.id) != null) {
        var audio = document.getElementById(kural.id);
        if (!$scope.playing) {
          audio.play();
          $scope.playing = true;
          setTimeout(function () {
            $scope.playing = false;
          }, 6000);
        }
      }
    };
    $scope.countOf = function (text) {
      return text ? text.length : '';
    };
  }
]);