app.factory('beforeUnload', function ($rootScope, $window) {
    // Events are broadcast outside the Scope Lifecycle
    
    $window.onbeforeunload = function (e) {
        var confirmation = {};
        var event = $rootScope.$broadcast('onBeforeUnload', confirmation);
        if (event.defaultPrevented) {
            return confirmation.message;
        }
    };
    
    $window.onunload = function () {
        $rootScope.$broadcast('onUnload');
    };
    return {};
})
app.run(function (beforeUnload) {
    // Must invoke the service at least once
});

// app.run([
//     '$window',
//     '$rootScope',
//     function($window, $rootScope) {
//         $window.addEventListener('beforeunload', function() {
//             user_model = $rootScope.$$childHead
//             console.log(user_model)
//             $rootScope.$$childHead.send_user_data()
//             alert('wait')
//         });
//     }
// ]);
app.controller('BaseController', function($rootScope, $scope, $http, $compile, $timeout, $window, $httpParamSerializer, $location) {
    $scope.user = {}
});

app.directive('bindUnsafeHtml', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                // watch the 'bindUnsafeHtml' expression for changes
                return scope.$eval(attrs.bindUnsafeHtml);
                },
            function(value) {
                // when the 'bindUnsafeHtml' expression changes
                // assign it into the current DOM
                element.html(value);

                // compile the new DOM and link it to the current
                // scope.
                // NOTE: we only compile .childNodes so that
                // we don't get into infinite loop compiling ourselves
                $compile(element.contents())(scope);
            }
        );
    };
}]);

app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);