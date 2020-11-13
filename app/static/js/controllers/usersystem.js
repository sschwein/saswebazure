app.controller('UserSystemController', function($window, $rootScope, $scope, $http, $compile, $cookies, $cookieStore, $timeout) {
    $scope.newuser = {
        username:'',
        pw:'',
        duppw:'',
        pwconf:'',
        email:''
    }

    $scope.user = {
        username:'',
        pw:'',
        duppw:'',
        rme:"0"
    }

    $scope.error = ''

    $scope.submitSignup = function(){
        $http.post('/api/signup', $scope.newuser)
        .then(function(response){
            data = response.data
            if (data.split('||')[0] != 'success') {
                $scope.error = data
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
            } else {
                cookie_data = data.split('||')[1].split(';')
                exprDate = new Date()
                exprDate.setSeconds(exprDate.getSeconds() + 7200);
                cookie_options = {
                    'path': cookie_data[2].split('=')[1],
                    'expires': exprDate
                }
                $cookies.put(cookie_data[0].split('=')[0], cookie_data[0].split('=')[1], cookie_options)
                $window.location.assign('/api/profile');
            }
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.submitLogin = function(){
        $http.post('/login', $scope.user)
        .then(function(response){
            console.log(response)
            data = response.data
            if (data.split('||')[0] != 'success') {
                $scope.error = data
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
            } else {
                cookie_data = data.split('||')[1].split(';')
                exprDate = new Date(cookie_data[1].split('=')[1]+'Z')
                console.log(exprDate)
                cookie_options = {
                    'path': cookie_data[2].split('=')[1],
                    'expires': exprDate
                }
                console.log(cookie_options)
                $cookies.put(cookie_data[0].split('=')[0], cookie_data[0].split('=')[1], cookie_options)
                $window.location.assign('/api/profile');
            }
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.submitForgot = function(){
        $http.post('/forgotpass', {'user':$scope.user})
        .then(function(response){
            data = response.data
            if (data.split('||')[0] != 'success') {
                $scope.error = data
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
            } else {
                console.log(data)
            }
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.submitReset = function(){
        console.log($scope.newuser)
        $http.post('/emailreset', {'user':$scope.newuser})
        .then(function(response){
            data = response.data
            if (data.split('||')[0] != 'success') {
                $scope.error = data
                errorTimeout = $timeout(function() {$scope.error = ''}, 5000);
            } else {
                $scope.error = 'Successful password change, will redirect in 5 seconds'
                errorTimeout = $timeout(function() {$window.location.assign('/api/profile');}, 5000);
            }
        })
        .catch(function(response){
            console.log('error')
        });
    }

    $scope.resetInit = function(name){
        $scope.newuser.email = name
    }
});