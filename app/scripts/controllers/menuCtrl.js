/*global angular */
angular.module('BrewItYourself').controller('MenuCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    "use strict";
    $scope.triggerAction = function(action) {
        $rootScope.$broadcast('menu-trigger', {action:action});
    };
}]);