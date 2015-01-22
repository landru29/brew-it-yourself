/*global angular */
angular.module('BrewItYourself').controller('MenuCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    "use strict";
    
    $scope.printing = false;
    
    $scope.togglePrint = function () {
        $scope.printing = !($scope.printing);
        $scope.triggerAction('print');
    };
    
    $scope.triggerAction = function(action) {
        $rootScope.$broadcast('menu-trigger', {action:action});
    };
}]);