'use strict';
// (function() {
//   if (!window.navigator.standalone) {
//     // in full screen
//     // if(window.location.path !== '')
//     console.log(window.location.pathname === '/homscreen');
//     if(window.location.pathname !== '/homscreen'){
//       // window.location = '/homescreen';
//     }
//   } 
// })()
// Declare app level module which depends on filters, and services
angular.module('dangle', ['dangle.filters', 'dangle.services', 'dangle.directives','ngMobile','ngCookies','angularLocalStorage']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/partials/kids',
        controller: KidsCtrl
      }).
      when('/homescreen', {
        templateUrl: '/partials/homescreen',
        controller: HomeScreenCtrl
      }).
      when('/choose-avatar', {
        templateUrl: '/partials/choose-avatar',
        controller: ChooseAvatarCtrl
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
        templateUrl: '/partials/admin-chore-feed',
        controller: ChoreFeedCtrl
      }).
      when('/admin-kid-feed', {
        templateUrl: '/partials/admin-kid-feed',
        controller: KidFeedCtrl
      }).
      when('/admin-chores', {
        templateUrl: '/partials/admin-chores',
        controller: AdminChoresCtrl
      }).
      when('/admin-kids', {
        templateUrl: '/partials/admin-kids',
        controller: AdminKidsCtrl
      }).
      when('/admin-rewards', {
        templateUrl: '/partials/admin-rewards',
        controller: AdminRewardsCtrl
      }).
      when('/admin-add-chore', {
        templateUrl: '/partials/admin-add-chore',
        controller: AddChoreCtrl
      }).
      when('/admin-add-kid', {
        templateUrl: '/partials/admin-add-kid',
        controller: AddKidCtrl
      }).
      when('/admin-add-reward', {
        templateUrl: '/partials/admin-add-reward',
        controller: AddRewardCtrl
      }).
      when('/admin-edit-chore/:id', {
        templateUrl: '/partials/admin-add-chore',
        controller: EditChoreCtrl
      }).
      when('/admin-edit-kid/:id', {
        templateUrl: '/partials/admin-add-kid',
        controller: EditKidCtrl
      }).
      when('/admin-edit-reward', {
        templateUrl: '/partials/admin-add-reward',
        controller: EditRewardCtrl
      }).
      when('/login', {
        templateUrl: '/partials/login',
        controller: LoginCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }])
  .run(function($route, $http, $templateCache) {
    angular.forEach($route.routes, function(r) {
      if (r.templateUrl) { 
        $http.get(r.templateUrl, {cache: $templateCache});
      }
    });
  });
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

moment.lang('en', {
  calendar : {
    lastDay : '[Yesterday]',
    sameDay : '[Today]',
    nextDay : '[Tomorrow]',
    lastWeek : 'dddd',
    nextWeek : 'dddd',
    sameElse : 'MMM D YYYY'
  }
});
