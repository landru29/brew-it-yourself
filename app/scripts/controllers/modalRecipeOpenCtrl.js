/*global angular */
angular.module('BrewItYourself').controller('ModalRecipeOpenCtrl', ['$scope', '$modalInstance', 'recipe', 'allRecipes', function ($scope, $modalInstance, recipe, allRecipes) {
    'use strict';
    $scope.allRecipes = allRecipes;
    $scope.json = {
        recipe: ''
    };
    
    $scope.accordeonStatus = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
    $scope.oneAtATime = true;
    
    $scope.import = function() {
        var thisRecipe;
        try {
            thisRecipe = JSON.parse($scope.json.recipe);
            thisRecipe.uuid = recipe.generateUUID();
            $modalInstance.close({recipe:thisRecipe, action:'import'});
        } catch (e) {
            $modalInstance.dismiss('You are trying to import bullshit. Unfortunately, this won\'t work.');
        }
    };

    $scope.select = function (thisRecipe) {
        $modalInstance.close({recipe:thisRecipe, action:'open'});
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);