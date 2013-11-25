'use strict';

// Declare app level module which depends on filters, and services
angular.module('dangle', ['dangle.filters', 'dangle.services', 'dangle.directives','ngCookies']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/kids',
        controller: KidsCtrl
      }).
      when('/index', {
        templateUrl: '/partials/index',
        controller: IndexCtrl
      }).
      when('/chores', {
        templateUrl: '/partials/tasks',
        controller: TasksCtrl
      }).
      when('/chores/:id', {
        templateUrl: '/partials/tasks',
        controller: TasksCtrl
      }).
      when('/coins', {
        templateUrl: '/partials/coins',
        controller: CoinsCtrl
      }).
      when('/coins/:id', {
        templateUrl: '/partials/coins',
        controller: CoinsCtrl
      }).
      when('/rewards', {
        templateUrl: '/partials/rewards',
        controller: RewardsCtrl
      }).
      when('/profile', {
        templateUrl: '/partials/profile',
        controller: ProfileCtrl
      }).
      when('/passcode', {
        templateUrl: '/partials/passcode',
        controller: PassCodeCtrl
      }).
      when('/create-account', {
        templateUrl: '/partials/create-account',
        controller: CreateAccountCtrl
      }).
      // ADMIN ROUTES
      when('/admin', {
        templateUrl: '/partials/admin',
        controller: AdminCtrl
      }).
      when('/admin-chore-feed', {
        templateUrl: '/partials/chore-feed',
        controller: ChoreFeedCtrl
      }).
      when('/admin-chores', {
        templateUrl: '/partials/admin-chores',
        controller: AdminChoresCtrl
      }).
      when('/admin-add-chore', {
        templateUrl: '/partials/add-chore',
        controller: AddChoreCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);

angular.module('ng').run(['$rootScope', function($rootScope) {
    $rootScope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };
}]);