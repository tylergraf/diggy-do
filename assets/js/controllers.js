'use strict';

// ****************
// PAGE CONTROLLERS
// ****************

function IndexCtrl($scope, $rootScope, $cookieStore, storage, $http) {
  $rootScope.pageAdmin = false;
  $http.get('/api/kids/').
    success(function(data, status, headers, config) {
      // $scope.kids = data;
      console.log(data);
      $scope.kids.push({admin: true, passcode: '0000', name: 'Mom', _id: 'all'});
    });

  $scope.addKid = function() {
    if($scope.kidName){
      var kid = {name:$scope.kidName};
      $http.post('/api/kid', kid).
        success(function(data, status, headers, config) {
          $scope.kids.push(data);
        });
    }
  }
  $scope.addTask = function(task) {
    if(task.name){
      // var task = {name:$scope.taskName, kidId: $scope.kidId};
      console.log(task);
      $http.post('/api/task', task).
        success(function(data, status, headers, config) {
          $scope.task = {};
        });
    }
  }
}


function CreateAccountCtrl($scope, $rootScope, $cookieStore, storage, $http) {
  $rootScope.modal = true;
  $rootScope.pageAdmin = false;
  $rootScope.pageName = 'create-account';
  $rootScope.pageTitle = 'diggy do';
  $rootScope.headerColor = 'purple';
  $rootScope.pageIcon = 'ruby';

  $scope.c = function(user) {
    console.log(user);
    if(typeof user === 'undefined'){ return alert('You must enter a valid name, email, and password.');}
    if(!user.email || !user.password || !user.name){ return alert('You must enter a valid name, email, and password.');}

    if(!validateEmail(user.email)){ return alert('You must enter a valid email.');}

      $http.post('/api/user/new', {user: user}).
          success(function(data, status, headers, config) {
            if(status === 200){
              storage.set('dd_user',data);
              $rootScope.navigate('fade','/');
            }
          }).
          error(function(err, status, headers, config) {
            alert(err.message)
          });

  }

  function validateEmail(email) {
    var re = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return re.test(email);
  }
}
function HomeScreenCtrl($scope, $rootScope, $cookieStore, storage, $http) {

}
function KidsCtrl($scope, $rootScope, $cookieStore, storage, $http, $routeParams) {
  if($cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/chores');
  }
  $rootScope.pageName = 'login';
  $rootScope.pageAdmin = false;
  $rootScope.pageTitle = 'diggy do';
  $rootScope.headerColor = 'purple';
  $rootScope.pageIcon = 'ruby';

  $rootScope.initLogin = function(kid) {
    $rootScope.tempKid = kid;
    $rootScope.navigate('RL','/passcode');
  };

  $http.get('/api/kids/').
    success(function(data, status, headers, config) {
      // if(data.length === 0){$rootScope.navigate('RL','/welcome') }
      $scope.kids = data;
      var admin = storage.get('dd_user');
      admin.passcode = '0000';
      admin.admin = true;
      $scope.kids.push(admin);
    });

}
function TasksCtrl($scope, $rootScope, $cookieStore, storage, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }
  $rootScope.modal = false;
  $rootScope.pageAdmin = false;
  $rootScope.pageName = 'chores';
  $rootScope.pageTitle = 'diggy do';
  $rootScope.headerColor = 'purple';
  $rootScope.pageIcon = 'check-mark';


  $rootScope.subNavItems = [
    {link: '/', icon: 'calendar', title: 'Once'},
    {link: '/', icon: 'add', title: 'Bonus'}
  ];
  $rootScope.pageTitle = 'diggy do';
  $rootScope.headerColor = 'purple';
  $rootScope.pageIcon = 'check-mark';


  var currentDate = moment(),
      id = ($cookieStore.get('currentKid')) ? $cookieStore.get('currentKid')._id : null,
      // property = attr.property,
      date = currentDate.unix(),
      url = (id) ? 'api/tasks/'+id : 'api/tasks/all';
  $scope.filterExpr = {done: false};
  console.log($scope.filterExpr);
  console.log($scope.feed);
  console.log($scope.admin);
  $scope.day = currentDate.format('dddd');

  $scope.prevDay = function() {
    currentDate.subtract('days',1);
    $scope.day = currentDate.format('dddd'),
    date = currentDate.unix();

    getList($http, url, date);

  }
  $scope.nextDay = function() {
    currentDate.add('days',1);
    $scope.day = currentDate.format('dddd'),
    date = currentDate.unix();

    getList($http, url, date);
  }

  $scope.transact = function(task, index) {
    var date = currentDate.unix(),
        taskIndex = $scope.tasks.indexOf(task);

        console.log(task);

    if(!task.approved){
      task.done = (!task.done);
      if(task.transactionId){
        $http.delete('/api/transaction/'+task.transactionId,{done: task.done}).
          success(function(data, status, headers, config) {
            delete task.transactionId;
            console.log(task);
            totalCounts($scope.tasks)
          });
      } else {
        // EXPLOSION EFFECT
        // var el = angular.element(document.querySelectorAll('.task-list-item')[taskIndex]),
        //     iconEl = document.querySelectorAll('.icon-ruby')[taskIndex],
        //     top = iconEl.offsetTop,
        //     left = iconEl.offsetLeft,
        //     els = [];
        //
        // for (var i = 10 - 1; i >= 0; i--) {
        //   els.push(angular.element(iconEl).clone().css({
        //     position: 'absolute',
        //     top: top+70+'px',
        //     left: left+'px',
        //     'font-size': '18px'
        //   }));
        //
        // };
        // for (var i = els.length - 1; i >= 0; i--) {
        //   angular.element(document.querySelectorAll('body')).append(els[i]);
        // };
        //
        // setTimeout(function() {
        //   for (var i = els.length - 1; i >= 0; i--) {
        //     els[i].css({top: '350px'});
        //     els[i].css({left: left+Math.floor(Math.random() * 10) + 1+'px'});
        //   };
        // }, 100)
        //
        // setTimeout(function() {
        //   for (var i = els.length - 1; i >= 0; i--) {
        //     els[i].remove();
        //   };
        // }, 600)


        $http.post('/api/transaction/',{date: date, _kid: task._kid, _task: task._id}).
          success(function(data, status, headers, config) {
            console.log(data);
            task.transactionId = data._id;
            totalCounts($scope.tasks)
          });
      }
    }
  }

  getList($http, url, date);

  function totalCounts(tasks) {
    $scope.total = {done: 0, notDone: 0, approved: 0};
    tasks.forEach(function(t) {
      if(t.done){
        $scope.total.done++;
      } else{
        $scope.total.notDone++;
      }

      if(t.approved){$scope.total.approved++}

    });
  }

  function getList(agent, baseURL, date, done) {
    var url = baseURL+'/'+date;
    agent.get(url)
      .success(function(data, status, headers, config) {
        $scope.tasks = data;
        totalCounts(data)

      })
      .error(function(error) {
        done(error);
      });

    }

  }

function getTaskList(agent,id,date, cb) {
  agent.get('/api/tasks/'+id+'/'+date).
    success(function(data, status, headers, config) {
      cb(null, data)
    });
}

function CoinsCtrl($scope, $rootScope, $cookieStore, storage, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.hideMainNav = false;
  $rootScope.pageName = 'coins';
  $rootScope.pageTitle = 'Coins';
  $rootScope.headerColor = 'orange';
  $rootScope.pageIcon = 'ruby';

  var currentKid = $cookieStore.get('currentKid');

  $http.get('/api/transactions/'+currentKid._id).
    success(function(data, status, headers, config) {
      $scope.transactions = data;
      $scope.transactions.forEach(function(t) {
        t.dateUpdated = moment(t.dateUpdated).format('MMM D, YYYY | h:mma')
      });

    });
}
function RewardsCtrl($scope, $rootScope, $cookieStore, storage, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.pageName = 'rewards';
  $rootScope.pageTitle = 'Rewards';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'reward';

  $http.get('/api/rewards').
    success(function(data, status, headers, config) {
      // $scope.kids = data;
      console.log(data);
      $scope.rewards = data;
    });

}
function RewardCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }

  var rewardId = $routeParams.id;

  $rootScope.backURL = '/rewards';
  $rootScope.modal = true;
  $rootScope.pageAdmin = false;
  $rootScope.pageName = 'rewards';
  $rootScope.pageTitle = 'Reward';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'reward';


  $http.get('/api/reward/'+rewardId).
    success(function(data, status, headers, config) {
      // $scope.kids = data;
      console.log(data);
      $scope.reward = data;
    });
}
function ProfileCtrl($scope, $rootScope, $cookieStore, storage, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.backURL = '/chores';
  $rootScope.modal = true;
  $rootScope.pageAdmin = false;
  $rootScope.pageName = 'profile';
  $rootScope.pageTitle = 'Me';
  $rootScope.headerColor = 'blue';
  $rootScope.pageIcon = 'profile';

  $scope.kid = $cookieStore.get('currentKid');
  console.log($scope.kid);

  $scope.$watch('chosenAvatarIcon',function() {
    if($scope.chosenAvatarIcon){
      $scope.kid.avatar.icon = $scope.chosenAvatarIcon;

      var kidId = $scope.kid._id,
          kid = {avatar: $scope.kid.avatar};

      $http.put('/api/kid/'+kidId, {kid: kid}).
        success(function(data, status, headers, config) {
          // $scope.kids = data;
          console.log(data);

          $cookieStore.put('currentKid',$scope.kid);

        });
    }
  });
}
function PassCodeCtrl($scope, $rootScope, $cookieStore, storage, $http, $location, $routeParams) {
  if(!$rootScope.tempKid) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.pageName = 'passcode';
  $rootScope.modal = true;
  $rootScope.pageAdmin = false;

  $scope.focus = function() {
    document.querySelector('.passcode-input').focus();
    // angular.element(pcode).focus();
    // angular.element('.passcode').focus();
  }
  $scope.$watch('passcode', function(p) {
    $scope.passcodeLength = (typeof p === 'undefined') ? 0 : p.length;
    console.log(p);
    console.log($scope.passcodeLength);
    if($scope.passcodeLength === 4){
      var passcode = $rootScope.tempKid.passcode;
      console.log($rootScope.tempKid);
      if($scope.passcode == passcode){
        $rootScope.login($rootScope.tempKid);
        $rootScope.$emit('login');
      }
    }
  });



}

function LoginCtrl($scope, $rootScope, $cookieStore, storage, $http, $location) {
  $rootScope.pageName = 'login';
  $rootScope.modal = true;
  $rootScope.pageAdmin = false;
  var currentUser = storage.get('dd_user');
  $scope.currentUserExists = (currentUser);
  if(currentUser){
    appUserLogin(currentUser);
  }

  function appUserLogin(user) {

    $http.post('/api/appLogin',{email: user.email, id: user.id})
      .success(function(data, status) {
        if(status === 200){
          $rootScope.navigate('fade','/');
        }
      });
  }

  $scope.userLogin = function(user) {
    if(typeof user === 'undefined'){return alert('Please enter email and password');}
    if(!user.email && !user.password){return alert('Please enter email and password');}

    $http.post('/api/login',{username: user.email, password: user.password})
      .success(function(data, status) {
        if(status === 200){
          storage.set('dd_user',data);
          $rootScope.navigate('fade','/');
        }
      })
      .error(function(err) {
        alert(err.message);
      });
  }
}

function ChooseAvatarCtrl($scope, $rootScope, $cookieStore, storage, $http, $location) {

  $rootScope.backURL = '/admin-add-kid';
  $rootScope.modal = true;
  $rootScope.pageAdmin = false;
  $rootScope.pageName = 'choose-avatar';
  $rootScope.pageTitle = 'Choose Avatar';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'profile';

  $scope.chooseAvatar = function(icon) {
    $rootScope.tempKid.avatar = {icon: icon, color: 'grey'};
    $rootScope.navigate('TB',$rootScope.backURL);
  }
}

// **********
// COMPONENTS
// **********

function navCtrl($scope, $rootScope, $cookieStore, storage, $http, $location) {
  $rootScope.direction = 'fade';
  $rootScope.navigate = function(direction, path, backURL) {
    $rootScope.$broadcast('navigate');
    $rootScope.backURL = (backURL) ? backURL : $rootScope.backURL;
    $rootScope.direction = direction;
    $location.path(path);
  };
  $scope.showNav = false;
  $scope.toggleNav = function() {
    $scope.showNav = (!$scope.showNav);
  }
  $scope.showSubNav = false;
  $scope.toggleSubNav = function() {
    $scope.showSubNav = (!$scope.showSubNav);
  }

  $rootScope.login = function(kid) {
    $cookieStore.put('currentKid', kid);
    if(kid.admin){
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
      $rootScope.navigate('fade','/chores');
    }
  }
  $rootScope.logOut = function() {
    $cookieStore.remove('currentKid');
    $rootScope.navigate('fade','/');
  };
  $rootScope.logOutCompletely = function() {
    // console.log($cookieStore.get('connect.sid'));
    $cookieStore.remove('currentKid');
    $cookieStore.remove('connect.sid');
    storage.clearAll();
    $rootScope.navigate('fade','/login');
  };

  $rootScope.$on('login', function() {
    var kid = $cookieStore.get('currentKid');
    // if(kid.admin){
    //   $scope.navType = 'admin';
    //   $scope.nav = [
    //     {icon: 'check-mark', URL: '/chore-feed'},
    //     {icon: 'profile', URL: '/kids-feed'},
    //     {icon: 'reward', URL: '/rewards'}
    //   ];
    // }
  });
}

function grabberCtrl($scope, $rootScope, $cookieStore, storage, $http) {
  $scope.grabberToggle = false;
  $scope.toggleGrabber = function() {
    $scope.grabberToggle = (!$scope.grabberToggle);
  }

  var currentKid = $cookieStore.get('currentKid');
  if($cookieStore.get('currentKid')){
    if(currentKid.admin){
      $rootScope.grabberLabel = 'Admin';
      $rootScope.grabberURL = '/admin';
      // $rootScope.navigate('fade','/admin-chore-feed');
    } else {
      $rootScope.grabberLabel = 'Me';
      $rootScope.grabberURL = '/profile';
      // $rootScope.navigate('fade','/chores');
    }
  }
}
// function transactionsController($scope, $rootScope, $cookieStore, storage, $http) {
//   $http.get('/api/transactions').
//     success(function(data, status, headers, config) {
//       $scope.transactions = data;
//     });
// }
