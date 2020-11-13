app.controller('HomeController', function($window, $rootScope, $scope, $http, $compile) {
    $scope.background_slide = 0;
    $scope.background_slide_style = [{'z-index':1},{'z-index':1},{'z-index':1},{'z-index':1}]
    $scope.home_slider_highlight = ['thick-bottom-border', '', '']
    $scope.slider_panel_selection = 0

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

    $scope.home_slider_select = function(id){
        for (i = 0; i < 3; i++){
            if (i == id){
                $scope.home_slider_highlight[i] = 'thick-bottom-border'
            } else {
                $scope.home_slider_highlight[i] = ''
            }
        }
        $scope.slider_panel_selection = id
    }
});