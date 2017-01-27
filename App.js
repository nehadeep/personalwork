var App = angular.module('App', ['ui.router', 'ngMaterial','ngAnimate' ,'ui.grid', 'angular.filter','ui.grid.pagination','ui.bootstrap']);

App.config(function ($stateProvider) {
    $stateProvider

   .state('detail3', {

        url: '/detail3/:safeboxId',
        views: {
            'main@': {
                templateUrl: 'detail3.html',
                controller : 'verifyInventoryTransactionCtrl'
            }
        },
        data: {
            displayName: 'detail3'
        },
        resolve: {
            safeboxId: function ($stateParams) {
                return $stateParams.safeboxId
            }
        }
    })
   .state('detail3.Step 1', {
            templateUrl: 'edits1.html',
                controller : 'editController'

        })
      .state('detail3.Step 2', {
            templateUrl: 'review.html', 
            controller : 'reviewEditController'
        }).state('detail3.Step 3', {
            templateUrl: 'confirmation.html'
        })
 
})
App.run(function ($state,myfactory) {
    myfactory.getverifyinventory('3550').then(function(response){
      $state.go('detail3',{safeboxId:response.Safebox.Id});
    });
    
});
