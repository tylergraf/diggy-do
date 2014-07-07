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
angular.module('diggydo', ['diggydo.filters', 'diggydo.services', 'diggydo.directives','ngMobile','ngCookies','angularLocalStorage']).
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
      when('/reward/:id', {
        templateUrl: '/partials/reward',
        controller: RewardCtrl
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
      when('/admin-edit-reward/:id', {
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
  .run(function($route, $http, $templateCache, $cookieStore, $rootScope, $location) {
    angular.forEach($route.routes, function(r) {
      if (r.templateUrl) {
        $http.get(r.templateUrl, {cache: $templateCache});
      }
    });
    $rootScope.navigate = function(direction, path, backURL) {
      $rootScope.$broadcast('navigate');
      $rootScope.backURL = (backURL) ? backURL : $rootScope.backURL;
      $rootScope.direction = direction;
      $location.path(path);
    };
    $rootScope.setNavigation = function(kid){
      if(kid && kid.admin){
        $rootScope.grabberLabel = 'Admin';
        $rootScope.grabberURL = '/admin';
        $rootScope.navigate('fade','/admin-chore-feed');

        $rootScope.navType = 'admin';
        $rootScope.nav = [
          {icon: 'check-mark', URL: '/admin-chore-feed', direction: 'LR'},
          {icon: 'profile', URL: '/admin-kid-feed', direction: 'LR'},
          {icon: 'reward', URL: '/admin-rewards', direction: 'RL'}
        ];
      } else {
        $rootScope.grabberLabel = 'Me';
        $rootScope.grabberURL = '/profile';
        $rootScope.navType = 'kid';
        $rootScope.nav = [
          {icon: 'check-mark', URL: '/chores', direction: 'LR'},
          {icon: 'ruby', URL: '/coins', direction: 'LR'},
          {icon: 'reward', URL: '/rewards', direction: 'RL'}
        ];
      }
    }


    var currentKid = $cookieStore.get('currentKid');
    $http.defaults.headers.common['DD-Kid-ID'] = (currentKid) ? currentKid._id : null;
    $rootScope.setNavigation(currentKid);

    // $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    //   if ( $rootScope.loggedUser == null ) {
    //     // no logged user, we should be going to #login
    //     if ( next.templateUrl == "partials/login.html" ) {
    //       // already going to #login, no redirect needed
    //     } else {
    //       // not going to #login, we should redirect now
    //       $location.path( "/login" );
    //     }
    //   }
    // });
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
