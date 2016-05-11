var myApp = angular.module('myApp',
  ['ngRoute', 'firebase', 'mm.foundation'])
  .constant('FIREBASE_URL', 'https://getactive22.firebaseio.com/');


myApp.run(['$rootScope', '$location',
  function($rootScope, $location) {
    $rootScope.$on('$routeChangeError',
      function(event, next, previous, error) {
        if (error=='AUTH_REQUIRED') {
          $rootScope.message = 'Sorry, you must log in to access that page';
          $location.path('/login');
        } // AUTH REQUIRED
      }); //event info
  }]); //run

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/login', {
      templateUrl: 'views/login.html',
      controller: 'RegistrationController'
    }).
    when('/register', {
      templateUrl: 'views/register.html',
      controller: 'RegistrationController'
    }).
    when('/events', {
      templateUrl: 'views/events.html',
      controller: 'EventsController',
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        } //current Auth
      } //resolve
    }).
    when('/events/new', {
      templateUrl: 'views/eventsNew.html',
      controller: 'EventsController',
      resolve: {
        currentAuth: function(Authentication) {
          return Authentication.requireAuth();
        } //current Auth
      } //resolve
    }).
    when('/events/:eId', {
        templateUrl: 'views/eventsShow.html',
        controller: 'SingleEventController'
    }).
    when('/events/:eId/edit', {
        templateUrl: 'views/eventsEdit.html',
        controller: 'SingleEventController'
    }).
    otherwise({
      redirectTo: '/events'
    });
}]);

myApp.controller('OffCanvasDemoCtrl', function ($scope) {

});
