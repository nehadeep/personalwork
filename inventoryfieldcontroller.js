App.directive('inventoryField', inventoryField);
 
function inventoryField() {
    return {       
        restrict: "E",
        scope: {
            type:"=",
            value: "=",
            //metaData: "=",
            required: "=?",
            regularExpression: "=?",
            lookupKey: "=?",
            itemData:"="
        },
        templateUrl: 'inventoryfield.html',
        /*link: function (scope, ele, attr) {
            scope.Metadata = $rootScope.subCat;
            scope.type = attr.type;
            scope.value = attr.value;
            scope.lookupKey = attr.lookupKey;
            
        },*/
        controller: function ($scope,myfactory) {
            debugger;
            var _that = this;
            _that.readOnly = true;
            $scope.Metadata = $scope.$parent.metadata;
            $scope.selItem=$scope.itemData.row;
            //$scope.value=$scope.itemData.row[$scope.itemData.desc];

            if(!$scope.itemData.column.IsEditable && $scope.itemData.column.DefaultValue && $scope.itemData.row.ID<0){
                $scope.value=$scope.itemData.column.DefaultValue;
            }

            var currArr;
            $scope.rowEditEvent=function(itm,value) {
                if ($scope.itemData.column.ColumnName === 'DESC_1') {
                    var chkBoolForUnitAmt;
                    angular.forEach($scope.itemData.colDefs, function (colObj, colKey) {
                        if (colObj.Label == 'UNIT AMOUNT' && colObj.SourceColumnName == 'LOOKUP_VAL' || colObj.Label == 'FACE VALUE' && colObj.SourceColumnName == 'LOOKUP_VAL')
                            chkBoolForUnitAmt = true;
                        /*if(colObj.Label =='FACE VALUE' && colObj.SourceColumnName=='LOOKUP_VAL')
                         chkBoolForUnitAmt=true;*/
                    });
                    if (chkBoolForUnitAmt)
                        itm.Unit = value;
                }
                // itm.Unit=value.replace(/[^0-9\.]+/g,"");

                if ($scope.itemData.column.ColumnName == 'QUANTY')
                    itm.IsQuantityChanged = true;
                if (!itm.IsVerified)
                    itm.IsVerified = true;

                currArr = [];
                angular.forEach($scope.$parent.filterdData, function (obj) {
                    if (obj.IsVerified) {
                        currArr.push(obj);
                    }
                });
                myfactory.setVerifiedData(itm.SubCategory.Code, currArr);

                /*if (itm.ID < 0){
                    var mappingObj = myfactory.getMappingObject();
                    angular.forEach($scope.itemData.colDefs, function (defVal, defKey) {
                        if(mappingObj.hasOwnProperty(defVal.ColumnName)) {
                            var colName=mappingObj[defVal.ColumnName];
                            if (!$scope.selItem[colName] && defVal.IsRequired) {
                                defVal.valid = false;
                            } else {
                                defVal.valid = true;
                            }
                        }
                    });
                }
                if (value == "" && $scope.itemData.column.IsRequired) {
                    $scope.itemData.column.valid = false;
                } else {
                    $scope.itemData.column.valid = true;
                }*/

                //myfactory.setEmptyFieldValidation($scope.Metadata.SubCategories);
           }
          /* $scope.chkEmpty=function(row,itmData){
                console.log('row',row,itmData);
                if(row.length==0){

                }
           }*/
           $scope.toEdit=function(){
            if($scope.itemData.column.IsEditable && !$scope.$parent.chkMisgDat){
                if($scope.type=='DROPDOWN'){
                    if($scope.selItem.ID<0){
                       $scope.ifc.readOnly = !$scope.ifc.readOnly;
                    }
                }else{
                    $scope.ifc.readOnly = !$scope.ifc.readOnly;
                }
            }
           }

        },
        controllerAs: 'ifc'
    };
}

 