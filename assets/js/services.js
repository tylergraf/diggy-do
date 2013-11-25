'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
// angular.module('cookbookApp.services', [])
//   .factory('localStorageCheck',function(localStorageService){
//     return {
//       check: function (id) {

//         var recipe = localStorageService.get(id);
//         if(recipe){
//           console.log('recipe found');
//           console.log(recipe);
//           return JSON.stringify(recipe);
//         } else {
//           console.log('recipe not found');
//           return false;
//         }


//         console.log(localStorageService);
//         return 'stuff'
//       }
//     }
//   });

angular.module('dangle.services', ['ngResource']).
    factory('TaskListService', function($resource){
  return $resource('/api/tasks/:id/:date', {}, {
    query: {method:'GET', isArray:true}
  });
});
