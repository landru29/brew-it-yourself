/*global angular */
angular.module('BrewItYourself').controller('ModalPropertiesCtrl', ['$scope', '$modalInstance', 'recipe', function ($scope, $modalInstance, recipe) {
    'use strict';
    
    $scope.properties = JSON.parse(JSON.stringify(recipe.Recipe.prototype.properties));

    $scope.ok = function () {
        recipe.Recipe.prototype.properties = $scope.properties;
        $modalInstance.close($scope.properties);
    };
    
    $scope.reset = function() {
        for (var i in recipe.Recipe.prototype.defaultProperties) {
            $scope.properties[i] = recipe.Recipe.prototype.defaultProperties[i];
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);