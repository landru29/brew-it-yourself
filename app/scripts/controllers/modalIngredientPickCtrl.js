/*global angular */
angular.module('BrewItYourself').controller('ModalIngredientPickCtrl', ['$scope', '$modalInstance', 'ingredient', function ($scope, $modalInstance, ingredient) {
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
            $modalInstance.close(JSON.parse(JSON.stringify(newVal)));
        }
    });
    
}]);