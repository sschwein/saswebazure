app.controller('APIController', function($window, $rootScope, $timeout, $scope, $http, $compile, $cookies, $sce) {
    $scope.background_slide = 0;
    $scope.background_slide_style = [{'z-index':1},{'z-index':1},{'z-index':1},{'z-index':1}]
    $scope.new_key_label = ''
    $scope.key_list = []
    $scope.key_edit = []
    $scope.file = ''
    $scope.manual_match_made = false

    $scope.background_slider = function(id){
        for (i = 0; i < 4; i++){
            if (i == id-1){
                $scope.background_slide_style[i]['z-index'] = 2
            } else {
                $scope.background_slide_style[i]['z-index'] = 1
            }
        }
        $scope.background_slide = id
    }

    $scope.createAPIKey = function(){
        $http.post('/api/key/create', $scope.new_key_label)
        .then(function(response){
            data = response.data
            if (data == 'duplicate'){
                $scope.error = 'Label Already Used'
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
            } else if (data == 'success'){
                $scope.error = 'Success'
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
                $scope.refreshKeys()
            } else{
                $scope.error = 'Error, Try again'
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
            }
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.init_profile = function(){
        $scope.refreshKeys()
    }

    $scope.refreshKeys = function(){
        $http.get('/api/getkeys')
        .then(function(response){
            data = response.data
            $scope.key_list = data
            $scope.key_list.forEach(function(){$scope.key_edit.push(false)})
            //console.log($scope.key_list)
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.deleteKey = function(id){
        $http.post('/api/key/delete', id)
        .then(function(response){
            $scope.refreshKeys()
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.editSlide = function(id){
        console.log(id)
        if ($scope.key_edit[id]){
            $scope.key_edit[id] = false
            $http.post('/api/key/update', {'label':$scope.key_list[id].label, 'security':$scope.key_list[id].sec_level})
            .then(function(response){
                console.log(response.data)
            })
            .catch(function(response){
                console.log('error')
            });
        } else{
            $scope.key_edit[id] = true
        }
        console.log($scope.key_edit[id])
    }


    //CRYPTO TRACKER PAGE


    $scope.initTracker = function(){
        $http.get('/crypto/tracker/html?p=2')
        .then(function(response){
            $scope.bodyHTML = response.data;
            $scope.getTradePairs()
            $scope.getUnmatchedTrades()
        })
        .catch(function(response){
            console.log('error initializing tracker page')
        })
    }

    $scope.getTradePairs = function(){
        $http.get('/api/crypto/trades/pairs')
        .then(function(response){
            $scope.pairsPanelData = response.data
            $scope.calculatePairProfit()
        })
        .catch(function(response){
            console.log('error getting crypto trade pairs')
        })
    }

    $scope.getUnmatchedTrades = function(){
        $http.get('/api/crypto/trades/unmatched')
        .then(function(response){
            $scope.buysPanelData = response.data.buys
            $scope.sellsPanelData = response.data.sells
            for(i = 0; i < $scope.buysPanelData.length; i++){
                $scope.buysPanelData[i]['background'] = 'none'
                $scope.buysPanelData[i]['selected'] = false
            }
            for(i = 0; i < $scope.sellsPanelData.length; i++){
                $scope.sellsPanelData[i]['background'] = 'none'
                $scope.sellsPanelData[i]['selected'] = false
            }
        })
        .catch(function(response){
            console.log('error getting unmatched trades')
        })
    }

    $scope.calculatePairProfit = function(){
        $scope.totalCryptoProfitInETH = 0.0
        $scope.totalCryptoProfitInUSD = 0.0
        for (i = 0; i < $scope.pairsPanelData.length; i++){
            $scope.totalCryptoProfitInETH += $scope.pairsPanelData[i].gain_loss
        }
        $scope.totalCryptoProfitInUSD = $scope.totalCryptoProfitInETH * 700
    }

    $scope.submitTransHist = function(){
        var filename = 'test2.csv'
        $http.get('/upload/id')
        .then(function(response){
            var fd = new FormData();
            var myFile = new File([b64DecodeUnicode($scope.file.split('base64,')[1])], filename);
            fd.append('file', myFile, filename);
            fd.append('page', 'crypto_trades')
            fd.append('submit', 'Submit');
            $http.post(response.data, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            })
            // console.log(req)
            // $http(req)
            // $http.post(response.data, {'file': $scope.file}/*, {'headers':{'Content-Type': 'application/json;charset=UTF-8'}}*/)
            .then(function(response){
                console.log('file loaded')
            })
            .catch(function(response){
                console.log('error loading file')
            });
        })
        // .catch(function(response){
        //     console.log('error getting upload url')
        // })
    }

    $scope.loadTrackerPage = function(id){
        $http.get('/crypto/tracker/html?p='+id)
        .then(function(response){
            $scope.bodyHTML = response.data;//$sce.trustAsHtml(response.data);
        })
        .catch(function(response){
            console.log('error loading page ' + id.toString())
        });
    }

    $scope.refreshTradeList = function(){
        $http.get('/api/crypto/trades/refresh')
        .then(function(response){
            console.log('successfully refreshed trades')
        })
        .catch(function(response){
            console.log('error refreshing trade list')
        });
    }

    $scope.buyUnMatchedClick = function(i){
        if ($scope.buysPanelData[i].selected) {
            $scope.buysPanelData[i].background = 'none'
            $scope.buysPanelData[i].selected = false
        } else {
            $scope.buysPanelData[i].background = '#ddd'
            $scope.buysPanelData[i].selected = true
        }
        $scope.checkForPotentialMatch();
    }

    $scope.sellUnMatchedClick = function(i){
        if ($scope.sellsPanelData[i].selected) {
            $scope.sellsPanelData[i].background = 'none'
            $scope.sellsPanelData[i].selected = false
        } else {
            $scope.sellsPanelData[i].background = '#ddd'
            $scope.sellsPanelData[i].selected = true
        }
        $scope.checkForPotentialMatch();
    }

    $scope.checkForPotentialMatch = function(){
        $scope.manual_match_made = false
        buy_selected = false
        sell_selected = false
        for (i = 0; i < $scope.buysPanelData.length; i++) {
            if ($scope.buysPanelData[i].selected) {
                buy_selected = true
                break
            }
        }
        for (i = 0; i < $scope.sellsPanelData.length; i++) {
            if ($scope.sellsPanelData[i].selected) {
                sell_selected = true
                break
            }
        }
        if (buy_selected && sell_selected) {
            $scope.manual_match_made = true
        }
    }

    $scope.submitHandMatchedTrades = function(){
        data = {
            buys: [],
            sells: []
        }
        for (i = 0; i < $scope.buysPanelData.length; i++){
            if ($scope.buysPanelData[i].selected){
                data.buys.push($scope.buysPanelData[i])
            }
        }
        for (i = 0; i < $scope.sellsPanelData.length; i++){
            if ($scope.sellsPanelData[i].selected){
                data.sells.push($scope.sellsPanelData[i])
            }
        }
        $http.post('/api/crypto/trades/unmatched', data)
        .then(function(response){
            if (response.data == 'coin'){
                console.log('Coin Mismatch')
            } 
            if (response.data == 'date'){
                console.log('buy date greater than sell date')
            } else {
                console.log('successfully matched')
                for (i = 0; i < data.buys.length; i++){
                    var index = $scope.buysPanelData.indexOf(data.buys[i]);
                    if (index > -1) {
                        $scope.buysPanelData.splice(index, 1);
                    }
                }
                for (i = 0; i < data.sells.length; i++){
                    var index = $scope.sellsPanelData.indexOf(data.sells[i]);
                    if (index > -1) {
                        $scope.sellsPanelData.splice(index, 1);
                    }
                }
            }
        })
        .catch(function(response){
            console.log('error submitting trade list')
        });
    }

    $scope.undoTradePair = function(id){
        $http.post('/api/crypto/trades/undo', {'id': $scope.pairsPanelData[id].id})
        .then(function(response){
            console.log('success')
        })
        .catch(function(response){
            console.log('failure')
        })
    }

    $scope.recalculateCryptoTaxes = function(){
        $http.post('/api/crypto/taxes/remove')
        .then(function(response){
            console.log('remove old taxes success')
            $http.post('/api/crypto/taxes/buys')
            .then(function(response){
                console.log('build buys success')
                $http.post('/api/crypto/taxes/sells')
                .then(function(response){
                    console.log('calculate sells success')
                })
                .catch(function(response){
                    console.log('calculate sells failure')
                });
            })
            .catch(function(response){
                console.log('build buys failure')
            });
        })
        .catch(function(response){
            console.log('remove old taxes failure')
        })

    }

    $scope.getCryptoTaxes = function(){
        $http.get('/api/crypto/taxes/get')
        .then(function(response){
            console.log('success')
        })
    }
});

function b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}