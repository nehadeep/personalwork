App.directive('inventoryGrid', function (myfactory) {
    return {
        restrict: 'E',
        scope: {
            subCategoryCode: "=",
            data: "=",
            metaData:"=",
            invData:"=",
            section:"@"
           
        },
        templateUrl: 'inventoryGrid.html',
        controllerAs: "invGrid",
        controller: function ($scope, $filter) {
            $scope.$on('updateFilterData', function(e) {
                $scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode}});           
            });
            console.log('1',$scope.section)
        //$rootScope.id = -99;
        	$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode}});
            $scope.metadata=$scope.metaData;
            //$scope.section= $scope.section;
            $scope.chkMisgDat=false;
            if($scope.section=='missingData')
                $scope.chkMisgDat=true;
            var _that = this;
            //find selected sub category
            	//$rootScope.subCat=$scope.subCategories;  
            angular.forEach($scope.metadata.SubCategories, function (subCategory, key) {
                if (subCategory.Code === $scope.subCategoryCode) {
                    _that.selectedSubCategory = subCategory;
                    console.log("sennndsnks", _that.selectedSubCategory );
                }
            });
            var found = false;
            angular.forEach(_that.selectedSubCategory.ColumnDefinitions,function(colDefVal,colDefKey){
                if(colDefVal.ColumnName){
                    if(colDefVal.ColumnName=='REMOVE_ITEM'){
                        found = true;
                    }
                }
            });
            if(!found){
    			_that.selectedSubCategory.ColumnDefinitions.push(
    			{
    				"ColumnName": "REMOVE_ITEM",
    				"Label": ''
    			});
            }

            var currArr;
            $scope.rowVerified=function(item){
                currArr = [];
                angular.forEach($scope.filterdData,function(obj){
                    if(obj.IsVerified){
                        currArr.push(obj);
                    }
                });
                myfactory.setVerifiedData(item.SubCategory.Code,currArr);
            }
            $scope.addRowToTable=function(){
                $scope.newCloned=angular.copy($scope.invData[0]);
            	$scope.newCloned.SubCategory.Code=$scope.subCategoryCode;
            	//$scope.newCloned= angular.copy($scope.data[$scope.data.length-1]);
            	for(k in $scope.newCloned){
            		if(!(typeof($scope.newCloned[k])=='object' && $scope.newCloned[k] != null)){
            			$scope.newCloned[k] = '';
            		}
				}
                //myfactory.getIncrement();
                //$scope.$parent.setIncrement();
                $scope.newCloned.ID=myfactory.getIncrement();
            	$scope.newCloned.removeItem=true;                
                $scope.newCloned.IsVerified=false;                               
                $scope.newCloned.IsQuantityChanged=false;                
            	$scope.data.push($scope.newCloned);
            	$scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode}});
            }
            $scope.removeRowFromTable=function(ind,itm){
                angular.forEach($scope.data,function(datVal,datKey){
                    if(datVal.ID==itm.ID)
                        $scope.data.splice(datKey, 1);

                });
               $scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode}});
            }
            $scope.undoRowFromTable=function(ind,itm){
                var deletedItem;
                var boolChk=true;
                angular.forEach($scope.data,function(datVal,datKey){
                    if(datVal.ID==itm.ID) {
                        deletedItem = $scope.data.splice(datKey, 1);
                        deletedItem[0].IsVerified = true;
                    }
                });
                angular.forEach($scope.$parent.verifiedData,function(verVal,verKey){
                    if(verVal.ID==deletedItem[0].ID){
                        deletedItem[0].Quantity=verVal.OriginalQuantity;
                        $scope.$parent.verifiedData[verKey]=deletedItem[0];
                        boolChk=false;
                    }
                });
                if(boolChk){
                    $scope.$parent.verifiedData.push(deletedItem[0]);
                }
                //$scope.$apply();
                $scope.filterdData = $filter('filter')($scope.data, {SubCategory : {Code : $scope.subCategoryCode}});
            }

        }
    }
});
 
 