'use strict';

angular.module('kuralpalApp.homeView',['ui.router'])
.controller('MainController', function($scope) {

	

})
.config(function($stateProvider,$urlRouterProvider,$locationProvider){
	// $locationProvider.html5Mode({
	// 	enabled:true,
	// 	requireBase:true,
	// 	rewriteLinks:true
	// });

	$urlRouterProvider.otherwise("/");

	var header = {
		templateUrl : 'header.html',
		controller: 'HeaderController'
	}

	var footer = {
		templateUrl : 'footer.html',
		controller : function($scope){}
	}

	$stateProvider
		.state('home', {
			url:"/",
			templateUrl: 'homeView/home.html',
			controller: 'HomeController',
			resolve: {
		        delay: function($q, $timeout) {
		          var delay = $q.defer();
		          $timeout(delay.resolve, 1500);
		          return delay.promise;
		        }
		    }
		})
		.state('valluvar', {
			url:"/valluvar",
			templateUrl: 'navView/valluvar.html',
			controller: 'ValluvarController'
		})
		.state('translators', {
			url:"/translators",
			templateUrl: 'navView/translators.html',
			controller: 'TranslatorsController'
		})
		.state('why', {
			url:"/why",
			templateUrl: 'navView/why.html',
			controller: 'WhyController'
		})
		.state('contribute', {
			url:"/contribute",
			templateUrl: 'navView/contribute.html',
			controller: 'ContributeController'
		})		
		.state('about', {
			url:"/about",
			templateUrl: 'navView/about.html',
			controller: 'AboutController'
		})
		.state('contact', {
			url:"/contact",
			templateUrl: 'navView/contact.html',
			controller: 'ContactController'
		})
});


'use strict';

/* App Module */

angular.module('kuralpalApp', ['ngMaterial', 'ngRoute','kuralpalApp.homeView',
  'kuralpalApp.contentView',
  'kuralpalApp.navView',
  'kuralpalApp.aboutView',
  'kuralpalApp.contactView',
  'kuralpalApp.contributeView',
  'kuralpalApp.translatorsView',
  'kuralpalApp.valluvarView'
  ])
.config(['$mdThemingProvider','$routeProvider',function($mdThemingProvider,$routeProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $mdThemingProvider.theme('default')
    .primaryPalette('deep-purple', {
      'default': '400', // by default use shade 400 from the pink palette for primary intentions
      'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
      'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
      'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
    })
    // If you specify less than all of the keys, it will inherit from the
    // default shades
    .accentPalette('purple', {
      'default': '200' // use shade 200 for default, and keep all other shades the same
    });
  }
  ])

.run(function($rootScope, $location, $window) {

        // initialise google analytics
        $window.ga('create', 'UA-77441658-1', 'auto');

        //ga('create', 'UA-77441658-1', 'auto');

        // record page view on each state change
        $rootScope.$on('$stateChangeSuccess', function (event) {
            $window.ga('send', 'pageview', $location.path());
        });
    });
(function () {
    angular.module('kuralpalApp')
            .factory('dataService', dataService);

    function dataService($q, $http) {

        return {
            getLabels: getLabels,
            getIyals: getIyals,
            getAthikarams:getAthikarams,
            getKurals:getKurals,
            getMeaning:getMeaning,
            getPals:getPals
        };

        function getLabels(langExtension) {
            return $http.get('kural/label' + langExtension + '.json')
                    .then(sendResponse)
                    .catch(sendErrorMessage);
        }

        function sendResponse(response) {
            //console.log(response);
            return response.data;
        }

        function sendErrorMessage(response) {
            return $q.reject('Error retrieving labels ' + response.status);
        }
        
        function getPals(langExtension){
            return $http.get('kural/pal' + langExtension + '.json')
                    .then(sendPalResponse)
                    .catch(sendErrorMessage);
        }
        
        function sendPalResponse(response){
            return response.data;
        }
        
        var receivedPalId = '';
        function sendIyalResponse(response) {
            var iyals = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].pal_id === receivedPalId)
                    iyals.push(response.data[i].iyal);
            }
            return iyals;
        }
        
        function getIyals(langExtension, palId) {
            receivedPalId = palId;
            return $http.get('kural/iyal' + langExtension + '.json')
                    .then(sendIyalResponse)
                    .catch(sendErrorMessage);
        }
        
        var receivedIyalId = '';
        function getAthikarams(langExtension, selectedIyal){
            receivedIyalId = selectedIyal;
            return $http.get('kural/athikaram' + langExtension + '.json')
                    .then(sendAthikaramResponse)
                    .catch(sendErrorMessage);
        }
        
        function sendAthikaramResponse(response){
            var athikarams = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].iyal === receivedIyalId){
                    athikarams.push(response.data[i].athikaram);
                }
            }  
            return athikarams[0];
        }
        
        var receivedAthi = '';
        function getKurals(langExtension, selectedAthi){
            receivedAthi = selectedAthi;
            return $http.get('kural/kurals' + langExtension + '.json')
                    .then(sendKuralResponse)
                    .catch(sendErrorMessage);
        }
        
        function sendKuralResponse(response){
            var kurals = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].athikaram.replace(/^\s+|\s+$/g, '') === receivedAthi.replace(/^\s+|\s+$/g, '')) {
                    kurals.push(response.data[i].kurals);
                }
            }
            return kurals;
        }
        
        function getMeaning(langExtension){
            return $http.get('kural/translation' + langExtension + '.json')
                    .then(sendMeaning)
                    .catch(sendErrorMessage);
        }
        
        function sendMeaning(response){
            var trans = [];
            for (var i = 0; i < response.data.length; i++) {
                if (response.data[i].athikaram.replace(/^\s+|\s+$/g, '') === receivedAthi.replace(/^\s+|\s+$/g, '')) {
                    for (var j = 0; j < response.data[i].trans.length; j++) {
                        trans.push(response.data[i].trans[j]);
                    }
                }
            }  
            return trans;
        }

    }
}());
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
'use strict';
angular.module('kuralpalApp.contentView', [])
        .controller('HomeController', ['$scope', '$http', '$mdSidenav', '$rootScope', '$location', 'dataService', '$state',
            function HomeController($scope, $http, $mdSidenav, $rootScope, $location, dataService) {

                $rootScope.title = "Home page";
                $rootScope.metaDescription = "Its the dashboard for the kuralpalApp";
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
                        "id": 3,
                        "name": "français",
                        "img":"img/icons/english.svg"
                    },
                    {
                        "id": 2,
                        "name": "English",
                        "img":"img/icons/english.svg"
                    },
                    {
                        "id": 1,
                        "name": "தமிழ்",
                        "img":"img/icons/tamil.ico"
                    }
                ];

                $rootScope.updateLangExtensions = function (language) {
                    if (language === "English") {
                        $rootScope.langExtension = "_en";
                        //set Default Iyal
                        $rootScope.selectedIyal = "Introduction";
                    } else if (language === "தமிழ்") {
                        $rootScope.langExtension = "";
                        $rootScope.playtip = "இந்த குறளை கேட்க இங்கே கிளிக் செய்யவும்";
                    } else if (language === "français"){
                        $rootScope.langExtension = "_fr";
                    }
                    
                    $rootScope.loadLabels();
                };

                $rootScope.getPal = function () {
                    var ext = ($rootScope.langExtension.length > 0) ? $rootScope.langExtension : '';
                    dataService.getPals(ext).then(getSelectedPal).catch(getErrorCallback);
                    
                };
                
                function getSelectedPal(pal){
                    $rootScope.pal = pal;
                    $rootScope.selectedPalId = $rootScope.selectedPalId !== undefined ? $rootScope.selectedPalId : 1;
                    $rootScope.selectedPal = pal[ $rootScope.selectedPalId - 1 ].name;
                    $rootScope.selectedIyl($rootScope.selectedPalId);
                }

                $rootScope.loadLabels = function () {
                    var ext = ($rootScope.langExtension.length > 0) ? $rootScope.langExtension : '';
                    if(ext !== '_en' || ext !== ''){
                        ext = '_en';
                    }
                    dataService.getLabels(ext).then(getLbls).catch(getErrorCallback);
                };

                function getLbls(labels) {
                    $rootScope.labels = labels;
                    $rootScope.getPal();
                }

                function getErrorCallback(errorMsg) {
                    console.log('Error message ' + errorMsg);
                }

                $rootScope.selectedIyl = function (palId) {
                    $rootScope.receivedPalId = palId;
                    dataService.getIyals($rootScope.langExtension, palId).then(getIyls).catch(getErrorCallback);
                };

                function getIyls(iyals) {
                    $rootScope.iyals = iyals[0];
                    $rootScope.iyal = $rootScope.iyals[0];
                    $rootScope.selectedPalId = $rootScope.receivedPalId;
                    $rootScope.selectedPal = $rootScope.pal[ $rootScope.selectedPalId - 1 ].name;
                    $rootScope.selectedAthikaram($rootScope.iyal);
                }

                var selIyal ='';
                $rootScope.selectedAthikaram = function (iyal) {
                    selIyal = iyal;
                    dataService.getAthikarams($rootScope.langExtension, iyal)
                            .then(getAthikarams)
                            .catch(getErrorCallback);
                };

                function getAthikarams(athikarams) {
                    $rootScope.iyal = selIyal;
                    $rootScope.athikarams = athikarams;
                    $rootScope.athikaram = $rootScope.athikarams[0];
                    $rootScope.selectedKurals($rootScope.athikaram);
                }
                
                $rootScope.selectedKurals = function (selectedAthikaram) {
                    $scope.selAthikaram = selectedAthikaram;
                    dataService.getKurals($rootScope.langExtension, selectedAthikaram)
                            .then(getKurals)
                            .catch(getErrorCallback);
                };

                function getKurals(kurals) {
                    console.log("service layer " + kurals[0]);
                    $rootScope.kurals = kurals[0];
                    $rootScope.athikaram = $scope.selAthikaram;                    
                    dataService.getMeaning($rootScope.langExtension )
                            .then(getMeaning)
                            .catch(getErrorCallback);
                }

                function getMeaning(meaning) {
                    $rootScope.trans = meaning;
                    console.log($rootScope.trans);
                }

                $rootScope.selectedTrans = function (language) {
                    $rootScope.selectedLangage = language;
                    $rootScope.updateLangExtensions(language);

                    if ($location.path() !== "/") {
                        $http.get('kural' + $location.path() + $rootScope.langExtension + '.json').success(function (data) {
                            $rootScope.details = data;
                        });
                    }

                };

                //$scope.selectedTrans($scope.selectedLanguage);

                //$timeout(function() { $scope.loaded = true; }, 5000);

                //setTimeout(function() {  }, 1000); 

                //$rootScope.spinner.off();

                $scope.playing = false;

                $scope.playKural = function (kural) {
                    if (document.getElementById(kural.id) !== null) {
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