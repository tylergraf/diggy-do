'use strict';

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

  var currentDate = moment(),
      id = ($rootScope.currentKid) ? $rootScope.currentKid._id : null,
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
  $scope.approveTransaction = function(task, transactionId) {
    var URL = '/api/transaction/'+transactionId,
        approved = (!task.approved);
        
    if(task.done){
      task.approved = (!task.approved);
      $http.put(URL,{transaction: {approved: approved}})
        .success(function(data, status, headers, config) {
        });
    }
  }
  $scope.transact = function(task) {
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

function AddChoreCtrl($scope, $rootScope, $cookieStore, $http) {
  console.log($cookieStore.get('currentKid').admin);
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin-chores';
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

  $scope.saveTask = function(task) {
    console.log(task);
    $http.post('/api/task', task).
      success(function(data, status, headers, config) {
        $scope.task = {};
        $rootScope.navigate('LR','/admin-chores')
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
function AddKidCtrl($scope, $rootScope, $cookieStore, $http) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin-kids';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-add-kid';
  $rootScope.pageTitle = 'Add Kid';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'settings';

  $scope.type = 'add';

  $scope.saveKid = function(kid) {
    console.log(kid);
    // var kid = $rootScope.tempKid;
    // delete $rootScope.tempKid;
    $http.post('/api/kid',{kid: kid})
      .success(function(data, status, headers, config) {
        $rootScope.navigate('LR','/admin-kids');
      });
  }
  // $scope.goToAvatar = function(kid) {
  //   $rootScope.tempKid = kid;
  //   $rootScope.navigate('BT','/choose-avatar');
  // }

}

function AddRewardCtrl($scope, $rootScope, $cookieStore, $http) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin-rewards';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-add-rewards';
  $rootScope.pageTitle = 'Add Reward';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'settings';
}

function EditChoreCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin-chores';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-edit-chore';
  $rootScope.pageTitle = 'Edit Chore';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'settings';

  $scope.type = 'edit';

  var taskId = $routeParams.id;
  $http.get('/api/task/'+taskId)
    .success(function(data, status, headers, config) {
      $scope.task = data;
      console.log($scope.task);
    });

  $http.get('/api/kids/')
    .success(function(data, status, headers, config) {
      $scope.kids = data;
    });

  $scope.saveTask = function(task) {
    console.log(task);
    $http.put('/api/task/'+taskId,{task: task})
      .success(function(data, status, headers, config) {
        $rootScope.navigate('LR','/admin-chores');
      });
  }
  $scope.deleteTask = function(taskId) {
    console.log(taskId);
    $http.delete('/api/task/'+taskId)
      .success(function(data, status, headers, config) {
        $rootScope.navigate('LR','/admin-chores');
      });
  }
}
function EditKidCtrl($scope, $rootScope, $cookieStore, $http, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin-kids';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-add-kid';
  $rootScope.pageTitle = 'Edit Kid';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'settings';

  $scope.type = 'edit';
  var kidId = $routeParams.id;
  $http.get('/api/kid/'+kidId)
    .success(function(data, status, headers, config) {
      $scope.kid = data;
      console.log($scope.kid);
    });
  // $scope.kid = $rootScope.tempEditKid;
  // delete $rootScope.tempEditKid;
  $scope.saveKid = function(kid) {
    console.log(kid);
    $http.put('/api/kid/'+kidId,{kid: kid})
      .success(function(data, status, headers, config) {
        $rootScope.navigate('LR','/admin-kids');
      });
  }
  $scope.deleteKid = function(kidId) {
    $http.delete('/api/kid/'+kidId)
      .success(function(data, status, headers, config) {
        $rootScope.navigate('LR','/admin-kids');
      });
  }
}
function EditRewardCtrl($scope, $rootScope, $cookieStore, $http) {
}


function AdminCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin-chore-feed';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin';
  $rootScope.pageTitle = 'Admin';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = 'settings';

  $scope.rewardCount = 19;

  $http.get('/api/kids')
    .success(function(data, status, headers, config) {
        $scope.kidCount = data.length;
      });

  $http.get('/api/tasks/all')
    .success(function(data, status, headers, config) {
        $scope.choreCount = data.length;
      });
  
}
function AdminChoresCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-chores';
  $rootScope.pageTitle = 'Chores';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = null;
  
  $http.get('/api/tasks/all')
    .success(function(data, status, headers, config) {
        $scope.tasks = data;
      });



}
function AdminKidsCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-kids';
  $rootScope.pageTitle = 'Kids';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = null;
  
  $http.get('/api/kids')
    .success(function(data, status, headers, config) {
        $scope.kids = data;
      });

  $scope.editKid = function(kid) {
    $rootScope.tempEditKid = kid;
    $rootScope.navigate('RL','/admin-edit-kid');
  }

}
function AdminRewardsCtrl($scope, $rootScope, $cookieStore, $http, $location, $routeParams) {
  if(!$cookieStore.get('currentKid')) {
    return $rootScope.navigate('fade','/');
  } else if(!$cookieStore.get('currentKid').admin){
    return $rootScope.navigate('fade','/chores');
  }

  $rootScope.backURL = '/admin';
  $rootScope.modal = true;
  $rootScope.pageName = 'admin-rewards';
  $rootScope.pageTitle = 'Rewards';
  $rootScope.headerColor = 'red';
  $rootScope.pageIcon = null;
  
  $http.get('/api/tasks/all')
    .success(function(data, status, headers, config) {
        $scope.tasks = data;
      });



}
