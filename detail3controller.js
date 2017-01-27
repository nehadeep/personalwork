App.controller('DialogController',function ($scope, $mdDialog,items){
    $scope.catchInvalidColumns=items;
    console.log('vvvvvvvvvvvvvvvvvvv',$scope.catchInvalidColumns)
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };
});

//var verifyInventory = angular.module('varifyinventory')


App.controller('verifyInventoryTransactionCtrl', function($scope,$state, myfactory, $sce, $rootScope,$mdDialog){
	myfactory.getverifyinventory('3550').then(function(response){
		$scope.selectActive = 0;
		$scope.itemsSteps = response.Workflow.Steps;
        $scope.isStepsLoad = true;
		$scope.total = $scope.itemsSteps.length - 1;
		$state.go('detail3.'+ $scope.itemsSteps[0].Name);
	/*	angular.forEach($scope.itemsSteps,function(obj){
			obj['text'] = $sce.trustAsHtml(obj.instructionHtml);
		})*/
	//	$scope.curentStep=1;
	});


/*$scope.itemsSteps = [{
	"id": 1, "title": "Edits"},
	{"id": 2, "title": "Review Edits"},
	{"id": 3, "title": "Confirmation"},

];*/

//var views=['home.detail.detail3.edits','home.detail.detail3.review','home.detail.detail3.confirmaton'];
//$state.go(views[$scope.selectActive]);
$scope.mappingObj=myfactory.getMappingObject();
$scope.getAllTabDataForValidation={};
$scope.goToNextState = function(){
    $scope.catchInvalidColumns=[];
    //var chkAllTablesValid=myfactory.getEmptyFieldValidation();

    angular.forEach($scope.getAllTabDataForValidation.colDefs,function(colVal,colKey){
        var invalidcols=[];
        angular.forEach($scope.getAllTabDataForValidation.filteredData,function(filVal,filKey){
            if(filVal.SubCategory.Code==colVal.Code) {
                if (!(filVal.ID < 0 && !filVal.IsVerified)){ //if mew row and is not verfied themm it won;t go to is required
                    angular.forEach(colVal.ColumnDefinitions, function (defVal, defKey) {
                        if (defVal.IsRequired && $scope.mappingObj.hasOwnProperty(defVal.ColumnName)) {
                            if (filVal[$scope.mappingObj[defVal.ColumnName]] === '') {
                                invalidcols.push(defVal.Label);
                                debugger;
                                $scope.getAllTabDataForValidation.filteredData[filKey]['errorClass']=true;
                            }
                        }
                    });
                }
            }
        });
        if(invalidcols.length){
            $scope.catchInvalidColumns.push({'table':colVal.Name,'column':invalidcols});
        }
    });
    /*angular.forEach(chkAllTablesValid,function(tabData,tabInd){
        var invalidcols=[];
        angular.forEach(tabData.ColumnDefinitions,function(colDefData,colDefKey){
            if(colDefData.hasOwnProperty("valid")){
                if(colDefData.valid==false){
                    invalidcols.push(colDefData.Label);
                }
            }
        });
        if(invalidcols.length){
            $scope.catchInvalidColumns.push({'table':tabData.Name,'column':invalidcols});
        }
    });*/
    if($scope.catchInvalidColumns.length){
          $mdDialog.show({
              templateUrl:'trash.html',
              ariaLabel:'name',
              controller: 'DialogController',
              clickOutsideToClose:true,
              locals: {
                  items: $scope.catchInvalidColumns
              }
          });
        return false;
    }

     $scope.repositoryData = myfactory.getRepositoryData();
     $scope.verifiedData = myfactory.getVerifiedData(); //checkd data we have
     $scope.allUnverifiedData = [];
    angular.forEach( $scope.repositoryData,function(obj,key,itm){
        if(obj.ID < 0 && !obj.IsVerified){
            itm.splice(key, 1);
        }else {
            var count = 0;
            angular.forEach($scope.verifiedData, function (selected) {
                if (selected.ID == obj.ID) {
                    count++;
                }
            });
            if (count == 0) {
                $scope.allUnverifiedData.push(obj);
            }
        }
    });
    angular.forEach( $scope.repositoryData,function(obj){
        if(obj.Quantity < obj.OriginalQuantity){
            var changedObj = angular.copy(obj);
            changedObj['RelatedID'] = obj.ID;
            changedObj['Quantity'] = obj.OriginalQuantity - obj.Quantity;
            // changedObj['ID'] = -1;
            $scope.allUnverifiedData.push(changedObj);
        }
    });

    myfactory.getverifyinventory('3550').then(function(response){

/*                  $scope.tab2 = response.Safebox.Packets[1].Type.Id;
*/
        angular.forEach(response.Safebox.Packets,function(packet){
            if(packet.Type.Id=='STORE'){
                $scope.originalStoreData = packet.Inventory;
            }
            if(packet.Type.Id=='REPOSITORY'){
                packet.Inventory =  $scope.verifiedData;
                $scope.tab2 = packet.Type.Id
            }
            if(packet.Type.Id=='MISSING'){
                packet.Inventory =  $scope.allUnverifiedData;
                 $scope.tab3 = packet.Type.Id
            }
        });
        $scope.newRepositoryData = response.Safebox.Packets;
        console.log($scope.newRepositoryData,'$scope.newRepositoryData');
           //  myfactory.setnewRepositoryData($scope.newRepositoryData);

    });

	if($scope.selectActive < $scope.total){
		$scope.selectActive++;
	}
	else if($scope.selectActive == $scope.total){
		$scope.selectActive = 0;
	}
    console.log($scope.itemsStep,"hh",$scope.itemsSteps[$scope.selectActive].Name);
	$state.go('detail3.'+ $scope.itemsSteps[$scope.selectActive].Name);
    //$scope.itemsSteps=$scope.itemsSteps;
    console.log($scope.itemsStep,"hh");
}

});
/*
App.config(function ($stateProvider) {
    $stateProvider

      .state('edits', {
          url: '/edits',
          views: {
              'inventorydetail@': {
                  templateUrl: 'edits.html',
              }
          }

      })
  });
*/
   /* .state('home.about', {
        url: '/about',
        views: {
            'main@': {
                templateUrl: 'about.html',
            }
        },
        data: {
            displayName: 'About'
        }
    })
 .state('home.details2', {
        url: '/details2',
        views: {
            'main@': {
                templateUrl: 'details2.html',
            }
        },
        data: {
            displayName: 'detail'
        }
    })
    .state('home.detail', {
        url: '/:id',
        views: {
            'main@': {
                templateUrl: 'detail.html'
                //Sample controller declaration
                //controller: function ($scope, userId) {
                //    $scope.userId = userId;
                //}
            }
        },
        data: {
            displayName: '{{ id }}'
        },
        resolve: {
            id: function ($stateParams) {
                return $stateParams.id
            }
        }
    })
   .state('home.detail.detail3', {
        url: '/detail3',
        views: {
            'main@': {
                templateUrl: 'detail3.html',
            }
        },
        data: {
            displayName: 'detail3'
        }
    })
  .state('home.detail.detail4', {
        url: '/detail4',
        views: {
            'main@': {
                templateUrl: 'detail4.html',
            }
        },
        data: {
            displayName: 'detail4'
        }
    })
})*/
/*App.run(function ($state) {
    $state.go('home');
});
*/

