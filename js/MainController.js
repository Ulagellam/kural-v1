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

