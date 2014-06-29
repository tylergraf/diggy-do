'use strict';

/* Directives */


angular.module('diggydo.directives', [])
  .directive('ngTap', function() {
    var isTouchDevice = !!("ontouchstart" in window);
    return function(scope, elm, attrs) {
      if (isTouchDevice) {
        var tapping = false;
        elm.bind('touchstart', function(evt) {  tapping = true; });
        elm.bind('touchmove', function(evt) {  tapping = false; });
        elm.bind('touchend', function(evt) {
          evt.preventDefault();
          evt.stopPropagation();
          tapping && scope.$apply(attrs.ngTap);
        });
      } else {
        elm.bind('click', function(evt) {
          scope.$apply(attrs.ngTap);
        });
      }
    };
  })
  .directive('dayViewer', function ($http, $rootScope, $routeParams) {
    return {
        restrict: 'A',
        templateUrl: '/partials/dayViewer',
        scope: {
          feed: '@',
          property: '@',
          url: '@'
        },
        replace: false,
        link: function (scope, iterStartElement, attr) {
          moment.calendar = {
              lastDay : '[Yesterday]',
              sameDay : '[Today]',
              nextDay : '[Tomorrow]',
              lastWeek : 'MMM D YYYY',
              nextWeek : 'MMM D YYYY',
              sameElse : 'MMM D YYYY'
          };

          var currentDate = moment(),
              id = ($rootScope.currentKid) ? $rootScope.currentKid._id : null,
              property = attr.property,
              date = currentDate.unix(),
              url = (id) ? attr.url+'/'+id : attr.url+'/all';

          scope.filterExpr = {done: false};
          console.log(scope.filterExpr);
          scope.feed = (attr.feed === 'true');
          console.log(scope.feed);
          console.log(scope.admin);
          scope.day = currentDate.format('dddd');

          scope.prevDay = function() {
            currentDate.subtract('days',1);
            scope.day = currentDate.format('dddd'),
            date = currentDate.unix();

            getList($http, url, date);

          }
          scope.nextDay = function() {
            currentDate.add('days',1);
            scope.day = currentDate.format('dddd'),
            date = currentDate.unix();

            getList($http, url, date);
          }
          scope.approveTransaction = function(transactionId, index) {
            var URL = '/api/transaction/'+transactionId,
                approved = scope.tasks[index].approved;

            $http.put(URL,{transaction: {approved: approved}})
              .success(function(data, status, headers, config) {

              });
          }
          scope.transact = function(taskId, kidId, transactionId, taskIndex) {
            var date = currentDate.unix(),
                task = scope.tasks[taskIndex];

            if(!task.approved){
              task.done = (!task.done);
              if(transactionId){
                $http.delete('/api/transaction/'+transactionId,{done: task.done}).
                  success(function(data, status, headers, config) {
                    delete task.transactionId;
                    totalCounts(scope.tasks)
                  });
              } else {
                $http.post('/api/transaction/',{date: date, _kid: kidId, _task: taskId}).
                  success(function(data, status, headers, config) {
                    task.transactionId = data._id;
                    totalCounts(scope.tasks)
                  });
              }
            }
          }

          getList($http, url, date);

          function totalCounts(tasks) {
            scope.total = {done: 0, notDone: 0, approved: 0};
            tasks.forEach(function(t) {
              if(t.done){
                scope.total.done++;
              } else{
                scope.total.notDone++;
              }

              if(t.approved){scope.total.approved++}

            });
          }

          function getList(agent, baseURL, date, done) {
            var url = baseURL+'/'+date;
            agent.get(url)
              .success(function(data, status, headers, config) {
                scope[property] = data;
                totalCounts(data)

              })
              .error(function(error) {
                done(error);
              });
          }

        }
    };
  })
.directive("ddChooseAvatar", function($timeout, $rootScope) {
  return {
    restrict: 'AE',
    templateUrl: '/partials/choose-avatar',
    scope: {
      currentIcon: "="
    },
    replace: true,
    link: function(scope, element, attrs) {
      var currentIcon = scope.currentIcon,
          allAvatars = document.querySelectorAll('.avatars-wrapper .avatar');

      $rootScope.$on('navigate',function(){
        angular.element(element).addClass('hide');
      });

      $timeout(function () {
        angular.element(element).removeClass('hide');
      }, 500);

      scope.$parent.openAvatarChooser = function() {

        angular.element(document.querySelector('#'+currentIcon)).addClass('selected');

        angular.element(element).addClass('opening');
        var t = setTimeout(function() {
          angular.element(element).removeClass('opening');
          angular.element(element).addClass('open');

        }, 300);
      };
      scope.closeAvatarChooser = function() {
        angular.element(element).removeClass('open');
      }

      scope.chooseAvatar = function(icon) {
        scope.$parent.chosenAvatarIcon = scope.currentIcon = icon;

        angular.forEach(allAvatars, function(el) {
          el.classList.remove('selected');
        });
        document.getElementById(icon).classList.add('selected');
        this.closeAvatarChooser();
        // element.find('.icon').removeClass('selected');
      }
    }
  }
})
// .directive("avatarModal", function() {
//   return {
//     restrict: 'A',
//     templateUrl: '/partials/choose-avatar',
//     replace: false,
//     link: function($scope, $element, $attributes) {
//       $scope.chooseAvatar = function(icon) {
//         if($scope.kid && $scope.kid.avatar){
//           $scope.kid.avatar.icon = icon;
//         } else if($scope.kid) {
//           $scope.kid.avatar = {icon: icon};
//         } else {
//           $scope.kid = {avatar: {icon: icon}};
//         }
//         var els = document.querySelectorAll('.avatars-wrapper .avatar');
//         angular.forEach(els, function(el) {
//           el.classList.remove('selected');
//         });
//         document.getElementById(icon).classList.add('selected');
//         $element.find('.icon').removeClass('selected');
//       }
//     }
//   }
// });
// .directive("ngTap", function() {
//   return function($scope, $element, $attributes) {
//     var tapped;
//     tapped = false;
//     $element.bind("click", function() {
//       if (!tapped) {
//         return $scope.$apply($attributes["ngTap"]);
//       }
//     });
//     $element.bind("touchstart", function(event) {
//       return tapped = true;
//     });
//     $element.bind("touchmove", function(event) {
//       tapped = false;
//       return event.stopImmediatePropagation();
//     });
//     return $element.bind("touchend", function() {
//       if (tapped) {
//         return $scope.$apply($attributes["ngTap"]);
//       }
//     });
//   };
// });
