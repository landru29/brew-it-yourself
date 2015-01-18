/*global angular */
angular.module('BrewItYourself').controller('ModalIngredientPickCtrl', ['$scope', '$modalInstance', 'ingredient', 'util', function ($scope, $modalInstance, ingredient, util) {
    'use strict';

    $scope.treeData = ingredient.getTreeIngredients();
    $scope.ingredient = {
        currentNode: null
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
    
    $scope.$watch('ingredient.currentNode', function (newVal, oldVal) {
        if (newVal) {
            $modalInstance.close(util.duplicate(newVal));
        }
    });
    
}]);