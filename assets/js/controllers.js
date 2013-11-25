'use strict';

// ****************
// PAGE CONTROLLERS
// ****************

function IndexCtrl($scope, $rootScope, $cookieStore, $http) {
  
  $http.get('/api/kids/').
    success(function(data, status, headers, config) {
      $scope.kids = data;
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


function CreateAccountCtrl($scope, $rootScope, $cookieStore, $http) {
  $scope.createAccount = function(account) {
    console.log(account);
    if(account.email && account.password){

    $http.post('/api/user/new', account).
        success(function(data, status, headers, config) {
          window.location = '/';
        }).
        error(function(error, status, headers, config) {
          console.log(error);
        });
    }
  }
}
function KidsCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
  if($cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/chores');
  }
  $rootScope.hideMainNav = true;
  $rootScope.pageName = 'login';
  $rootScope.pageTitle = 'diggy do';
  $rootScope.headerColor = 'purple';
  $rootScope.pageIcon = 'ruby';

  $rootScope.initLogin = function(kid) {
    $rootScope.tempKid = kid;
    $rootScope.navigate('fade','/passcode');
  };

  $http.get('/api/kids/').
    success(function(data, status, headers, config) {
      $scope.kids = data;
    });

}
function TasksCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }
  $rootScope.hideMainNav = false;
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
  
}

function getTaskList(agent,id,date, cb) {
  agent.get('/api/tasks/'+id+'/'+date).
    success(function(data, status, headers, config) {
      cb(null, data)
    });
}

function CoinsCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
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
function RewardsCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.pageName = 'rewards';
  $rootScope.pageTitle = 'Rewards';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'reward';

  
}
function ProfileCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.hideMainNav = true;
  $rootScope.pageName = 'profile';



  
}
function PassCodeCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$rootScope.tempKid) {
    return $rootScope.navigate('fade','/');
  }

  $rootScope.pageName = 'passcode';
  $rootScope.hideMainNav = true;

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
      }
    }
  });


  
}


// **********
// ADMIN CONTROLS
// **********

function ChoreFeedCtrl($scope, $rootScope, $cookieStore, $http) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.modal = false;
  $rootScope.pageName = 'chore-feed';
  $rootScope.pageTitle = 'Chore Feed';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'check-mark';
}

function AddChoreCtrl($scope, $rootScope, $cookieStore, $http) {
  console.log($cookieStore.get('currentKid').admin);
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.hideMainNav = true;
  $rootScope.modal = true;
  $rootScope.pageName = 'add-chore';
  $rootScope.pageTitle = 'Add Chore';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'circlePlus';

  $http.get('/api/kids/')
    .success(function(data, status, headers, config) {
      $scope.kids = data;
    });

  $scope.isDisabled = false;
  
  $scope.checkIfDisabled = function() {
    if($scope.task && $scope.task._kid && $scope.task.repeated && $scope.task.value){
      $scope.isDisabled = false;
    }
  }

  $scope.toggleDay = function(day) {
    if(!$scope.task){$scope.task = {repeated: {}}};
    if(!$scope.task.repeated){$scope.task.repeated = {}};

    var toggled = document.getElementById(day).classList.toggle('selected');
    $scope.task.repeated[day] = toggled; 

    $scope.checkIfDisabled();
  }

  $scope.addTask = function(task) {
    console.log(task);
    $http.post('/api/task', task).
      success(function(data, status, headers, config) {
        $scope.task = {};
        $rootScope.navigate('LR','/chore-feed')
      });
  }

  $scope.back = function() {
    $scope.task = null;
    $rootScope.navigate('LR','/admin');

    $scope.checkIfDisabled();
  }
  $scope.assignChore = function(kid, e) {
    if(!$scope.task){$scope.task = {_kid: {}}};
    var avatars = document.querySelectorAll('.assign-chore-wrapper .avatar');
    angular.forEach(avatars, function(avatar) {
      avatar.classList.remove('selected');
    })
    document.getElementById(kid._id).classList.add('selected');
    $scope.task._kid = kid._id;
    console.log($scope.task._kid);

    $scope.checkIfDisabled();
  }
}

function AdminCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/chore-feed';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin';
  $rootScope.pageTitle = 'Admin';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'settings';

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
      }
    }
  });


  
}
function AdminChoresCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.modal = true;
  $rootScope.backURL = '/admin';
  $rootScope.pageName = 'admin-chores';
  $rootScope.pageTitle = 'Chores';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = null;
  
  $http.get('/api/tasks/all')
    .success(function(data, status, headers, config) {
        $scope.tasks = data;
      });



}


// **********
// COMPONENTS
// **********

function navCtrl($scope, $rootScope, $cookieStore, $http, $location) {
  $rootScope.direction = 'fade';
  $rootScope.navigate = function(direction, path) {
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
      $rootScope.navigate('fade','/chore-feed');
    } else {
      $rootScope.grabberLabel = 'Me';
      $rootScope.grabberURL = '/profile';
      $rootScope.navigate('fade','/chores');
    }
  }
  $rootScope.logOut = function() {
    $cookieStore.remove('currentKid'); 
    $rootScope.navigate('fade','/');
  };
}

function grabberCtrl($scope, $rootScope, $cookieStore, $http) {
  $scope.grabberToggle = false;
  $scope.toggleGrabber = function() {
    $scope.grabberToggle = (!$scope.grabberToggle);
  }

  var currentKid = $cookieStore.get('currentKid');
  if($cookieStore.get('currentKid')){
    if(currentKid.admin){
      $rootScope.grabberLabel = 'Admin';
      $rootScope.grabberURL = '/admin';
      // $rootScope.navigate('fade','/chore-feed');
    } else {
      $rootScope.grabberLabel = 'Me';
      $rootScope.grabberURL = '/profile';
      $rootScope.navigate('fade','/chores');
    }
  }
}
// function transactionsController($scope, $rootScope, $cookieStore, $http) {
//   $http.get('/api/transactions').
//     success(function(data, status, headers, config) {
//       $scope.transactions = data;
//     });
// }