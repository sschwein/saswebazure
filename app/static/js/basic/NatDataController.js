app.controller('natdataController', function($rootScope, $scope, $http, $compile, $timeout) {
    $scope.nat_data_init = function(){
        $http.get('/nationaldata?panel=center')
        .then(function (response){
            $scope.centerpanel = response.data;
        });
        $http.get('/nationaldata?panel=left')
        .then(function (response){
            $scope.leftpanel = response.data;
            $scope.select_left_panel(1)
        });
        $http.get('/nationaldata?panel=right')
        .then(function (response){
            $scope.rightpanel = response.data;
        });
        //load beta feedback

        if ($('#isloggedin').html() == 1){
            $http.get('/feedback/betaq')
            .then(function (response){
                $scope.feedbackqs = response;
            })
            $http.get('/feedback/betar')
            .then(function (response){
                $scope.feedbackrs = response;
            })
        }
        $scope.showfeedbackquestion = 'natdata';
        $scope.presheadshow = 0;
        if ($('.beta-feedback-wrap').css('display') != 'none'){
            $('#beta-feedback-exclaimation').css('display','block')
            window.setTimeout(exclaimBounce,2000);
        } else {
            $('#beta-feedback-exclaimation').css('display','none')
        }
    }

    $scope.select_left_panel_nat = function(index){
        if ($scope.current_leftpanel != index) {
            $('.leftpanel-tab').each(function(){
                $(this).toggleClass('leftpanel-tab-selected')
            })
        }
        $scope.current_leftpanel = index
        if (window.innerWidth < 1024) {
            $scope.mob_menu_raise();
        }
    }

    $scope.mob_closer = 0;

    $scope.mob_menu_raise = function(){
        if (window.innerWidth < 1024) {
            $('#left-panel-wrapper').css('animation-name','menu_animation1')
            $('#left-panel-wrapper').css('animation-duration','500ms')
            $('#left-panel-wrapper').css('height','100vh')
            $('#beta-feedback-exclaimation').css('display','none')
            cssChangeTimeout = $timeout(function() {
                $('#left-panel-wrapper').css('top','73px');
            }, 490);
            $scope.mob_closer = 1
        }
    }

    $scope.mob_menu_close = function() {
        if (window.innerWidth < 1024) {
            $('#left-panel-wrapper').css('animation-name','menu_animation2')
            $('#left-panel-wrapper').css('animation-duration','500ms')
            $('#left-panel-wrapper').css('height','')
            cssChangeTimeout = $timeout(function() {
                $('#left-panel-wrapper').css('top','calc(100vh - 41px)');
                $('#beta-feedback-exclaimation').css('display','block')
            }, 490);
            $scope.mob_closer = 0
        }
    }

    $scope.runNatDataQuery = function(searchTerm){
        const MAX_SUMMARY_LENGTH = 150;
        $http.get('/api/search_natdata?query=' + searchTerm)
        .then(function(response){
            //console.dir(response);
            $scope.searchResults = response.data.searchResults
            .map(function(currentResponse){
            return currentResponse;
            });
        })
    }

    $scope.graphSwitcher = function(graphtype, docid, docnum, docsmooth, docdays){
        if (graphtype = '2') {
            console.log('2')
            graphSwitcher2(docid, docnum, docsmooth, docdays);
        } else if (graphtype = 'Avg') {
            console.log('avg')
            graphSwitcherAvg(docid, docnum, docsmooth, docdays);
        } else if (graphtype = 'Sum') {
            console.log('sum')
            graphSwitcherSum(docid, docnum, docsmooth, docdays);
        }
        console.log('test')
        window.location.hash = '#center-panel';
        $scope.mob_menu_close()
    }

    $scope.switchHeadButton = function(id){
        switchButton(id)
    }
});
