

App.controller('reviewEditController', function($scope,myfactory){

 	$scope.tab = 1;

	$scope.setTab = function(tabId){
		$scope.tab = tabId;
		$scope.$broadcast('updateFilterData');
	}
	$scope.isSet = function(tabId){
		return $scope.tab === tabId;
	}
	$scope.allUnverifiedDat=$scope.$parent.allUnverifiedData;

	myfactory.getverifyinventory('3550').then(function(response){
	    $scope.categories=response.Metadata.SubCategories;
     	$scope.metadata=response.Metadata;

	    $scope.filteredObject = {};
	    angular.forEach($scope.categories,function(obj){
	     	if(!($scope.filteredObject.hasOwnProperty(obj.Category.Name))){
	     		$scope.filteredObject[obj.Category.Name] = [];
	     	}
	     	$scope.filteredObject[obj.Category.Name].push(obj);
	    });
	    var indexedTeams = [];
	    
	    $scope.playersToFilter = function() {
	        indexedTeams = [];
	        return $scope.categories;
	    }
	    
	    $scope.filterTeams = function(player) {
	        var teamIsNew = indexedTeams.indexOf(player.Category.Name) == -1;
	        if (teamIsNew) {
	            indexedTeams.push(player.Category.Name);
	        }
	        return teamIsNew;
	    }
	});
});
