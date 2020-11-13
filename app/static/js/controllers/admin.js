app.controller('adminController', function($window, $rootScope, $scope, $http, $compile) {
    
});

app.controller('TDBTableController', function($rootScope, $scope, $http, $compile, $location, $timeout, $httpParamSerializer) 
{
    $scope.tdbTableInit = function(){
        $http.get('/admin/tdb/index')
        .then(function(response){
            $scope.tdbtablelist = response.data
        })
        .catch(function(response){
            console.log('error')
        });; 
           $scope.tablesel = 'No Selection';
           $scope.showTableSel = false;
           $scope.cellDetail = ' ';
           $scope.editcell = false;
           $scope.checkboxModel = [];
           $scope.allchecked = 0;
    }

    $scope.tdbTableUpdate = function(){
        $http.post('/admin/tdb/index')
        .then(function(response){
            $scope.tdbtablelist = response.data
        })
        .catch(function(response){
           console.log('error')
        }); 
    }

    $scope.loadTable = function(table){
        $scope.tablesel = table;
        $scope.showTableSel = false;
        $http.get('/admin/tdb/table/'+table)
        .then(function(response){
            console.log(response)
            $scope.table = response.data;
            $scope.checkboxModel = [0];
            for (i = 1; i < $scope.table['d'].length; i++){
                $scope.checkboxModel.splice(i,0,0);
            }
        })
        .catch(function (response){
            console.log('error')
        });
    }

    $scope.selTableList = function(){
        if ($scope.showTableSel){
            $scope.showTableSel = false;
        } else {
            $scope.showTableSel = true;
        }
    }

    $scope.loadCellDetail = function(row, col){
        $scope.cellRow = row;
        $scope.cellCol = col;
        if (Array.isArray($scope.table['d'][row]['cols'][$scope.table['h'][col]])){
            $scope.cellDetailArray = true;
            $scope.cellDetailArr = $scope.table['d'][row]['cols'][$scope.table['h'][col]]
            $scope.cellDetail = ''
            console.log($scope.cellDetailArr)
        } else {
            $scope.cellDetailArray = false;
            $scope.cellDetail = $scope.table['d'][row]['cols'][$scope.table['h'][col]]
            console.log($scope.cellDetail)
        }
        $scope.cellHead = $scope.table['h'][col]
        $scope.selRow(row);
    }

    $scope.closeCellDetail = function(){
        $scope.cellDetail = ' ';
        $scope.editsuccess = false;
        $scope.editerror = false;
        $scope.editcell = false;
    }

    $scope.selRow = function(row){
        if ($('.thing-row-'+row).css('background-color') == 'rgb(230, 230, 255)'){
            $('.thing-row-'+row).css('background','none')
            $scope.checkboxModel[row] = 0
        } else {
            $('.thing-row-'+row).css('background','#e6e6ff')
            $scope.checkboxModel[row] = 1
        }
    }

    $scope.editCellDetail = function(){
        $scope.editcell = true;
    }

    $scope.saveCellDetail = function(temp){
        if ($scope.cellDetailArray) {
            $scope.cellDetailArr = temp
            $http.post('/admin/tdb/update', {tid:$scope.table['d'][$scope.cellRow]['id'], col:$scope.table['h'][$scope.cellCol], value:$scope.cellDetailArr})
            .then(function(response){
                $scope.editcell = false;
                $scope.editerror = false;
                $scope.editsuccess = true;
                $scope.table['d'][$scope.cellRow]['cols'][$scope.table['h'][$scope.cellCol]] = $scope.cellDetail;
            })
            .catch(function(response){
                $scope.editerror = true;
                $scope.editsuccess = false;
            });
        } else {
            $scope.cellDetail = temp
            $http.post('/admin/tdb/update', {tid:$scope.table['d'][$scope.cellRow]['id'], col:$scope.table['h'][$scope.cellCol], value:$scope.cellDetail})
            .then(function(response){
                $scope.editcell = false;
                $scope.editerror = false;
                $scope.editsuccess = true;
                $scope.table['d'][$scope.cellRow]['cols'][$scope.table['h'][$scope.cellCol]] = $scope.cellDetail;
            })
            .catch(function(response){
                $scope.editerror = true;
                $scope.editsuccess = false;
            });
        }
    }

    $scope.checkAll = function(){
        if ($scope.allchecked == 1){
            for (i = 0; i < $scope.checkboxModel.length; i++){
                $scope.checkboxModel[i] = 1;
            }
        } else {
            for (i = 0; i < $scope.checkboxModel.length; i++){
                $scope.checkboxModel[i] = 0;
            }
        }
    }

    $scope.deleteRows = function(){
        for (i = $scope.checkboxModel.length-1; i >= 0; i--){
            if ($scope.checkboxModel[i] == 1){
                $http.post('/admin/tdb/delete', {tid: $scope.table['d'][i]['id']})
                .then(function(response){
                    $scope.checkboxModel[i] = 0
                    console.log('deleted')
                })
                .catch(function (response){
                    console.log('error')
                });                $scope.checkboxModel.splice(i, 1)
                $scope.table['d'].splice(i, 1)
            }
        }
    }

});