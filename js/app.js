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