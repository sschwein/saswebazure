app.controller('StocksController', function($window, $location, $rootScope, $timeout, $scope, $http, $compile, $cookies, $sce, $filter) {

    $scope.$watch('past_perf_selection', function (newValue, oldValue, scope) {
        if (newValue === oldValue){
            console.log('initializing past_perf_selection watch')
        } else {
            $scope.loadFundsHistory()
        }
    }, true);

    $scope.newHolding = {
        symbol: null,
        shares: null
    }

    $scope.newFund = {
        name: '',
        holdings: ''
    }

    $scope.past_perf_select = {
        '10': 10,
        '5': 5,
        '3': 3,
        '1': 1,
    }
    $scope.past_perf_selection = $scope.past_perf_select['10']

    $scope.freeHoldings = []
    $scope.stockData = []
    $scope.fundData = []
    $scope.is_expanded_fund = []

    $scope.total_value = 0
    $scope.total_dividend = 0
    $scope.show_loading = false
    $scope.params = $location.search()

    $scope.init = function(){
        if ($scope.params.p === undefined){
            $scope.loadTrackerPage(0)
        } else {
            $scope.loadTrackerPage($scope.params.p)
        }
        $scope.loadHoldings()
    }

    $scope.loadTrackerPage = function(id){
        if (id == 1 || id == 2 || id == 3){
            console.log('load tracker page if')
            $scope.loadFunds()
        }
        $http.get('/stocks/html?p='+id)
        .then(function(response){
            $scope.bodyHTML = response.data;
            $location.url($location.path() + "?p=" + id);
            $scope.params = $location.search()
        })
        .catch(function(response){
            console.log('error loading page ' + id.toString())
        });
    }

    $scope.loadHoldings = function(){
        $scope.show_loading = true

        $http.get('/api/stocks/holding/all')
        .then(function(response){
            $scope.total_value = 0
            $scope.total_dividend = 0
            for (i = 0; i < response.data.length; i++){
                $scope.total_value += response.data[i].close * response.data[i].shares
                $scope.total_dividend += response.data[i].dividend_price * response.data[i].shares / 2500
                response.data[i]['dividend_yield'] = (response.data[i].dividend_price / 2500) / (response.data[i].close)
                response.data[i]['is_showing'] = true
            }
            $scope.stockData = response.data
            // console.log('loaded holdings')
            if ($scope.params.p == 1 || $scope.params.p == 2 || $scope.params.p == 3){
                $scope.loadFunds()
            } else {
                $scope.show_loading = false
            }
        })
        .catch(function(response){
            $scope.show_loading = false
            console.log('error')
        })
    }

    $scope.addNewHolding = function(){
        data = $scope.newHolding
        $http.post('/api/stocks/holding/add', data)
        .then(function(response){
            $scope.newHolding.symbol = null
            $scope.newHolding.shares = null
            errorTimeout = $timeout(function() {$scope.loadHoldings()}, 1000);
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.editHolding = function(id){
        if ($scope.stockData[id].is_showing) {
            $scope.stockData[id].is_showing = false
        } else {
            $http.post('/api/stocks/holding/edit', $scope.stockData[id])
            .then(function(response){
                console.log(response)
                $scope.stockData[id].is_showing = true
            })
        }
    }

    $scope.loadFunds = function(){
        if ($scope.stockData.length == 0){
            console.log('funds still waiting on holdings to load')
            return 1
        }

        $scope.show_loading = true

        $http.get('/api/stocks/fund/get')
        .then(function(response){
            $scope.fundData = response.data
            $scope.is_expanded = []
            for (i = 0; i < $scope.fundData.length; i++){
                $scope.fundData[i]['holdings'] = []
                $scope.fundData[i]['total_value'] = 0
                $scope.fundData[i]['total_dividend'] = 0
                for (j = 0; j < $scope.fundData[i].holding_list.split(',').length; j++){
                    temp_stock = $filter('filter')($scope.stockData, {symbol: $scope.fundData[i].holding_list.split(',')[j]}, true)[0];
                    $scope.fundData[i].total_value += temp_stock.close * temp_stock.shares
                    $scope.fundData[i].total_dividend += temp_stock.dividend_price * temp_stock.shares / 2500
                    $scope.fundData[i].holdings.push(temp_stock)
                }
                $scope.is_expanded_fund.push(false)
            }
            console.log('loaded funds')
            // console.log($scope.fundData)
            $scope.buildFreeHoldings()
            if ($scope.params.p == 2){
                $scope.loadFundsHistory()
            } else if ($scope.params.p == 3){
                $scope.loadFundsFuture()
            } else {
                $scope.show_loading = false
            }
        })
        .catch(function(response){
            $scope.show_loading = false
            console.log('error on /api/stocks/fund/get')
        })
    }

    $scope.buildFreeHoldings = function(){
        $scope.freeHoldings = []
        for (i = 0; i < $scope.stockData.length; i++){
            $scope.freeHoldings.push($scope.stockData[i].symbol)
        }
        for (i = 0; i < $scope.fundData.length; i++){
            for (j = 0; j < $scope.fundData[i].holding_list.split(',').length; j++){
                var remove_symbol = $scope.fundData[i].holding_list.split(',')[j]
                if ($scope.freeHoldings.includes(remove_symbol)){
                    var index = $scope.freeHoldings.indexOf(remove_symbol);
                    if (index !== -1) $scope.freeHoldings.splice(index, 1);
                }
            }
        }
    }

    $scope.addNewFund = function(){
        if ($scope.newFund.holdings.substring($scope.newFund.holdings.length - 1) == ','){
            $scope.newFund.holdings = $scope.newFund.holdings.substring(0, $scope.newFund.holdings.length - 1).toUpperCase()
        } else {
            $scope.newFund.holdings = $scope.newFund.holdings.toUpperCase()
        }
        $http.post('/api/stocks/fund/add', $scope.newFund)
        .then(function(response){
            console.log('made it')
        })
    }

    $scope.addHoldingToFund = function(id){
        $scope.newFund.holdings += $scope.freeHoldings[id] + ','
    }

    $scope.expandFund = function(id){
        if ($scope.is_expanded_fund[id]){
            $scope.is_expanded_fund[id] = false
        } else {
            $scope.is_expanded_fund[id] = true
        }
    }

    $scope.loadFundsHistory = function(){
        $http.get('/api/stocks/fund/past/summary?date=' + $scope.past_perf_selection)
        .then(function(response){
            data = response.data
            console.log(data)
            for (i = 0; i < $scope.fundData.length; i++){
                $scope.fundData[i]['proj_past_performance'] = {
                    start_value: 0,
                    end_value: 0,
                    total_dividends: 0,
                    total_percent_change: 0,
                    yoy_percent_change: 0,
                    inception_value: 0,
                    inception_end_value: 0,
                    total_inception_dividends: 0,
                    inception_total_percent_change: 0,
                    inception_yoy_percent_change: 0
                }
                for (j = 0; j < $scope.fundData[i].holdings.length; j++){
                    $scope.fundData[i].proj_past_performance.start_value += data[$scope.fundData[i].holdings[j].symbol].start_price * $scope.fundData[i].holdings[j].shares / 10000
                    $scope.fundData[i].proj_past_performance.inception_value += data[$scope.fundData[i].holdings[j].symbol].inception_price * $scope.fundData[i].holdings[j].shares / 10000
                    $scope.fundData[i].proj_past_performance.end_value += data[$scope.fundData[i].holdings[j].symbol].end_price * $scope.fundData[i].holdings[j].shares / 10000 + data[$scope.fundData[i].holdings[j].symbol].dividends * $scope.fundData[i].holdings[j].shares / 10000
                    $scope.fundData[i].proj_past_performance.inception_end_value += data[$scope.fundData[i].holdings[j].symbol].end_price * $scope.fundData[i].holdings[j].shares / 10000 + data[$scope.fundData[i].holdings[j].symbol].inception_dividends * $scope.fundData[i].holdings[j].shares / 10000
                    $scope.fundData[i].proj_past_performance.total_dividends += data[$scope.fundData[i].holdings[j].symbol].dividends * $scope.fundData[i].holdings[j].shares / 10000
                    $scope.fundData[i].proj_past_performance.total_inception_dividends += data[$scope.fundData[i].holdings[j].symbol].inception_dividends * $scope.fundData[i].holdings[j].shares / 10000
                }
                $scope.fundData[i].proj_past_performance.total_percent_change = 100 * ($scope.fundData[i].proj_past_performance.end_value / $scope.fundData[i].proj_past_performance.start_value - 1)
                $scope.fundData[i].proj_past_performance.yoy_percent_change = $scope.fundData[i].proj_past_performance.total_percent_change / $scope.past_perf_selection
                $scope.fundData[i].proj_past_performance.inception_total_percent_change = 100 * ($scope.fundData[i].proj_past_performance.inception_end_value / $scope.fundData[i].proj_past_performance.inception_value - 1)
                $scope.fundData[i].proj_past_performance.inception_yoy_percent_change = $scope.fundData[i].proj_past_performance.inception_total_percent_change / data[$scope.fundData[i].holdings[0].symbol].inception_years
            }
            console.log($scope.fundData)
            $scope.show_loading = false
        })
        .catch(function(response){
            $scope.show_loading = false
            console.log('error in load funds history')
        });
        // $http.get('/api/stocks/fund/past/detail?fund=' + $scope.past_graph_fund_selection + '&date=1y')
        // .then(function(response){
        //     console.log(response.data)
        // })
    }

    $scope.loadFundsFuture = function(){
        $http.get('/api/stocks/fund/future')
        .then(function(response){
            data = response.data
            for (i = 0; i < $scope.fundData.length; i++){
                // console.log(data[$scope.fundData[i].name])
                $scope.fundData[i]['yearly_dividend'] = 0
                for (j = 0; j < $scope.fundData[i].holdings.length; j++){
                    $scope.fundData[i]['yearly_dividend'] += data[$scope.fundData[i].name][$scope.fundData[i].holdings[j].symbol] * $scope.fundData[i].holdings[j].shares / 10000
                }
                // console.log($scope.fundData[i].yearly_dividend)
            }
            $scope.show_loading = false
        })
        .catch(function(response){
            console.log('error on loadFundsFuture')
            $scope.show_loading = false
        })
    }
});