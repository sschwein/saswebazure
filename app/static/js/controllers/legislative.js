app.factory('debounce', function($timeout) {
    return function(callback, interval) {
        var timeout = null;
        return function() {
            $timeout.cancel(timeout);
            var args = arguments;
            timeout = $timeout(function () { 
                callback.apply(this, args); 
            }, interval);
        };
    }; 
});

app.controller('LegislativeController', function($window, $location, $rootScope, $timeout, $scope, $http, $compile, $cookies, debounce) {
    //First initialize the variable watchers
    $scope.$watch('filter', debounce(function (newValue, oldValue, scope) {
        if (newValue === oldValue){
            console.log('initializing watch')
        } else {
            $scope.load_bill_list()
        }
    }, 1000), true);

    //Then initialize all the variables
    $scope.init_bill_results = []
    $scope.bill_results = []
    $scope.bill_detail_cache = {}

    $scope.active_bill_detail = {}
    $scope.is_bill_detail_active = false
    $scope.show_loading = false
    $scope.search_error = false
    $scope.is_bill_detail_panel = 1;
    $scope.bill_detail_action_selector = [
        {
            'class': 'btn-active',
            'val': true
        },
        {
            'class': '',
            'val': false
        }
    ]

    $scope.bill_detail_subject_selector = [
        {
            'class': 'btn-active',
            'val': true
        },
        {
            'class': '',
            'val': false
        }
    ]

    $scope.bill_detail_related_selector = [
        {
            'class': 'btn-active',
            'val': true
        },
        {
            'class': '',
            'val': false
        }
    ]

    var today = new Date()
    $scope.init_end_date = pad((today.getMonth() + 1), 2) + '-' + today.getDate() + '-' + today.getFullYear()
    $scope.init_start_date = '2017-01-01'
    $scope.filter = {
        'query': '',
        'sort': 'last_action_desc',
        'chamber': {
            'house': true,
            'senate': true
        },
        'status': {
            'inactive': false,
            'active': true,
            'enacted': false,
            'vetoed': false
        }
    }

    $scope.init_bill_search = function(){
        $scope.load_csrf_token()
        if ('b' in $location.search()){
            $scope.load_full_bill($location.search()['b'])
        }
        $scope.show_loading = true
        timeout = $timeout(function () { 
            $scope.load_bill_list()
        }, 1000);
    }

    $scope.search_load_full_bill = function(id){
        bill_cong_id = $scope.bill_results[id].congress.toString() + '-' + $scope.bill_results[id].bill_id
        if (typeof $scope.bill_detail_cache[bill_cong_id] == "undefined") {
            $scope.load_full_bill(bill_cong_id)
        } else {
            $scope.open_full_bill_screen(bill_cong_id)
        }
    }

    $scope.load_full_bill = function(bill_cong_id){
        // console.log(bill_cong_id)
        $http.get('/api/congress/v1/' + bill_cong_id.split('-')[0] + '/' + bill_cong_id.split('-')[1] + '?token=' + $scope.bill_csrf_token + '&content=all')
        .then(function(response){
            // console.log(response.data)
            data = response.data
            data.bill.status_bar = [
                'bill-detail-status-active',
                'bill-detail-status-inactive',
                'bill-detail-status-inactive',
                'bill-detail-status-inactive',
                'bill-detail-status-inactive'
            ]

            data.bill.status = 'Inactive'
            if (data.bill.is_enacted){
                data.bill.status = 'Enacted Law'
            } else if (data.bill.is_active){
                data.bill.status = 'Active'
            } else if (data.bill.is_vetoed){
                data.bill.status = 'Vetoed'
            }
            
            
            is_passed = {'house': false, 'senate': false}
            num_houses_passed = 0

            temp_actions = []
            temp_important_actions = []

            for (i = 0; i < data.actions.length; i++){
                act_text = data.actions[i].text
                // console.log(act_text)
                if ((act_text.includes('Passed') || act_text.includes('Agreed')) && !is_passed['house'] && act_text.includes('House')){
                    num_houses_passed += 1
                    is_passed['house'] = true
                    data.bill.status_bar[1] = 'bill-detail-status-active'
                    if (num_houses_passed == 2) {
                        data.bill.status_bar[2] = 'bill-detail-status-active'
                    }
                }
                if ((act_text.includes('Passed') || act_text.includes('Agreed')) && !is_passed['senate'] && act_text.includes('Senate')){
                    num_houses_passed += 1
                    is_passed['senate'] = true
                    data.bill.status_bar[1] = 'bill-detail-status-active'
                    if (num_houses_passed == 2) {
                        data.bill.status_bar[2] = 'bill-detail-status-active'
                    }
                }
                if (act_text.includes('Presented to President')){
                    data.bill.status_bar[3] = 'bill-detail-status-active'
                }
                if (act_text.includes('Became Public Law')){
                    data.bill.status_bar[4] = 'bill-detail-status-active'
                }

                if (data.actions[i].is_important){
                    temp_important_actions.push(data.actions[i])
                } else {
                    temp_actions.push(data.actions[i])
                }
            }
            
            data.actions = temp_actions
            data.important_actions = temp_important_actions

            for (i = 0; i < data.bill.status_bar.length; i++){
                if (!data.bill.is_active && data.bill.status_bar[i] == 'bill-detail-status-active'){
                    data.bill.status_bar[i] = 'bill-detail-status-completed'
                }
            }

            data.congress_gov_url = 'https://www.congress.gov/bill/{congress_id}{suffix}-congress/{chamber}-bill/{bill_id}'
            data.congress_gov_url = data.congress_gov_url.replace('{congress_id}', data.bill.congress)
            if (data.bill.congress % 10 == 1){
                data.congress_gov_url = data.congress_gov_url.replace('{suffix}', 'st')
            } else if (data.bill.congress % 10 == 2){
                data.congress_gov_url = data.congress_gov_url.replace('{suffix}', 'nd')
            } else if (data.bill.congress % 10 == 3){
                data.congress_gov_url = data.congress_gov_url.replace('{suffix}', 'rd')
            } else {
                data.congress_gov_url = data.congress_gov_url.replace('{suffix}', 'th')
            }
            if (data.bill.bill_cong_id.includes('H.R.')){
                data.congress_gov_url = data.congress_gov_url.replace('{chamber}', 'house')
                data.congress_gov_url = data.congress_gov_url.replace('{bill_id}', data.bill.bill_id.replace('H.R.', ''))
            } else {
                data.congress_gov_url = data.congress_gov_url.replace('{chamber}', 'senate')
                data.congress_gov_url = data.congress_gov_url.replace('{bill_id}', data.bill.bill_id.replace('S.', ''))
            }

            $scope.bill_detail_cache[response.data.bill.bill_cong_id] = data
            $scope.open_full_bill_screen(bill_cong_id)
        })
        .catch(function(response){
            console.log('error loading bill')
        })
    }

    $scope.open_full_bill_screen = function(bill_cong_id){
        $scope.active_bill_detail = $scope.bill_detail_cache[bill_cong_id]
        $scope.is_bill_detail_active = true
        $location.search("b", bill_cong_id);
        $scope.load_sponsor_data()
        document.getElementsByTagName("body")[0].style.overflow="hidden"
    }

    $scope.load_sponsor_data = function(){
        sponsors = $scope.active_bill_detail.bill.sponsor_bioid

        $http.get('/api/congress/v1/member/get?ids=' + sponsors)
        .then(function(response){
            $scope.active_bill_detail.bill['sponsor'] = response.data[0]
            console.log($scope.active_bill_detail)
        })
        .catch(function(response){
            console.log('error loading sponsor data')
        });

        sponsors = ''
        for (i = 0; i < $scope.active_bill_detail.cosponsors.length; i++){
            sponsors += $scope.active_bill_detail.cosponsors[i].bioid + ','
        }
        sponsors = sponsors.substring(0, sponsors.length - 1)

        $http.get('/api/congress/v1/member/get?ids=' + sponsors)
        .then(function(response){
            $scope.active_bill_detail.cosponsors = merge_list_of_objects(response.data, $scope.active_bill_detail.cosponsors)
        })
        .catch(function(response){
            console.log('error loading cosponsor data')
        });
    }

    $scope.close_full_bill = function(){
        $scope.is_bill_detail_active = false
        $location.url($location.path());
        $scope.is_bill_detail_panel = 1;
        document.getElementsByTagName("body")[0].style.overflow="auto"
    }

    $scope.change_bill_detail_panel = function(id){
        $scope.is_bill_detail_panel = id;
    }

    $scope.load_csrf_token = function(){
        $scope.bill_csrf_token = document.getElementById('csrf-token').innerHTML
    }

    $scope.load_bill_list = function(){
        $scope.search_error = false
        url_endpoint = '/api/congress/v1/bill/gui_search?limit=10'
        url_endpoint += '&start_date=' + $scope.init_start_date 
        url_endpoint += '&query=' + $scope.filter.query
        url_endpoint += '&end_date=' + $scope.init_end_date 
        url_endpoint += '&token=' + $scope.bill_csrf_token
        url_endpoint += '&sort=' + $scope.filter.sort
        url_endpoint += '&chamber=' + $scope.filter.chamber.house + ',' + $scope.filter.chamber.senate
        url_endpoint += '&status=' + $scope.filter.status.inactive + ',' + $scope.filter.status.active + ',' + $scope.filter.status.enacted + ',' + $scope.filter.status.vetoed
        $http.get(url_endpoint)
        .then(function(response){
            data = response.data
            // console.log(data)
            for (i = 0; i < data.length; i++){
                if (response.data[i].congress % 10 == 1){
                    response.data[i].congress_term = response.data[i].congress + 'st Congress'
                } else if (response.data[i].congress % 10 == 2){
                    response.data[i].congress_term = response.data[i].congress + 'nd Congress'
                } else if (response.data[i].congress % 10 == 3){
                    response.data[i].congress_term = response.data[i].congress + 'rd Congress'
                } else{
                    response.data[i].congress_term = response.data[i].congress + 'th Congress'
                }
                response.data[i].introduced_date = response.data[i].introduced_date.split('T')[0]
                response.data[i].last_action_date = response.data[i].last_action_date.split('T')[0]
            }
            $scope.init_bill_results = response.data
            $scope.bill_results = response.data
            $scope.show_loading = false
        })
        .catch(function(response){
            console.log('bill search error')
            $scope.show_loading = false
            $scope.search_error = true
            timeout = $timeout(function () { 
                $scope.search_error = false
            }, 5000);
        });
    }

    $scope.switch_full_bill_action = function(id){
        if (id){
            $scope.bill_detail_action_selector[0]['class'] = ''
            $scope.bill_detail_action_selector[1]['class'] = 'btn-active'
            $scope.bill_detail_action_selector[1]['val'] = true
            $scope.bill_detail_action_selector[0]['val'] = false
        } else {
            $scope.bill_detail_action_selector[0]['class'] = 'btn-active'
            $scope.bill_detail_action_selector[1]['class'] = ''
            $scope.bill_detail_action_selector[1]['val'] = false
            $scope.bill_detail_action_selector[0]['val'] = true
        }
    }

    $scope.switch_full_bill_subjects = function(id){
        if (id){
            $scope.bill_detail_subject_selector[0]['class'] = ''
            $scope.bill_detail_subject_selector[1]['class'] = 'btn-active'
            $scope.bill_detail_subject_selector[1]['val'] = true
            $scope.bill_detail_subject_selector[0]['val'] = false
        } else {
            $scope.bill_detail_subject_selector[0]['class'] = 'btn-active'
            $scope.bill_detail_subject_selector[1]['class'] = ''
            $scope.bill_detail_subject_selector[1]['val'] = false
            $scope.bill_detail_subject_selector[0]['val'] = true
        }
    }

    $scope.switch_full_bill_related = function(id){
        if (id){
            $scope.bill_detail_related_selector[0]['class'] = ''
            $scope.bill_detail_related_selector[1]['class'] = 'btn-active'
            $scope.bill_detail_related_selector[1]['val'] = true
            $scope.bill_detail_related_selector[0]['val'] = false
        } else {
            $scope.bill_detail_related_selector[0]['class'] = 'btn-active'
            $scope.bill_detail_related_selector[1]['class'] = ''
            $scope.bill_detail_related_selector[1]['val'] = false
            $scope.bill_detail_related_selector[0]['val'] = true
        }
    }

    $scope.set_subject_search_term = function(search_term){
        $scope.filter.query = search_term
        $scope.show_loading = true
        $scope.close_full_bill()
    }
});

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function merge_list_of_objects(arr1, arr2){
    ret_arr = []
    for (i = 0; i < arr1.length; i++){
        let temp = {...arr2[i], ...arr1[i]}
        ret_arr.push(temp)
    }
    // console.log(ret_arr)
    return ret_arr
}