/*global angular */
angular.module('BrewItYourself').controller('ModalRecipeOpenCtrl', ['$scope', '$modalInstance', 'allRecipes', function ($scope, $modalInstance, allRecipes) {
    'use strict';
    $scope.allRecipes = allRecipes;

    $scope.select = function (recipe) {
        $modalInstance.close(recipe);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);