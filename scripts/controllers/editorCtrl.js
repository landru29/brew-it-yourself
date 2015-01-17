/*global angular */
angular.module('BrewItYourself').controller('EditorCtrl', ['$scope', '$localStorage', '$modal', 'messageService', 'storageService', 'util', 'recipe', function ($scope, $localStorage, $modal, messageService, storageService, util, recipe) {
    "use strict";
    
    $scope.insertIngredient = function (step) {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-ingredient-pick.html',
            controller: 'ModalIngredientPickCtrl',
            size: ''
        });
        modalInstance.result.then(function (ingredient) {
            step.ingredients.push(ingredient);
        }, function () {
            
        });
    };
    
    $scope.deleteIngredient = function (step, index) {
        util.deleteFromArray(step.ingredients, index);
    };
    
    $scope.save = function () {
        storageService.save($scope.recipe);
        messageService.inform('Information', 'Your recipe is saved');
    };
    
    $scope.open = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-recipe-open.html',
            controller: 'ModalRecipeOpenCtrl',
            size: '',
            resolve: {
                allRecipes: function () {
                    return storageService.getAllrecipes();
                }
            }
        });
        modalInstance.result.then(function (recipe) {
            $scope.recipe.steps = [];
            //$scope.$apply();
            $scope.recipe = recipe;
        }, function () {
            
        });
    };
    
    $scope.deleteRecipe = function () {
        messageService.confirm('Confirm deletion', 'Do you really want to delete this recipe ?').then(function () {
            storageService.deleteOneRecipe($scope.recipe);
            $scope.recipe = new recipe.Recipe();
        }, function () {
        });
    };
    
    $scope.cloneRecipe = function () {
        var steps = util.cleanObject(JSON.parse(JSON.stringify($scope.recipe.steps)));
        $scope.newRecipe({name: $scope.recipe.name + ' (cloned)'});
        $scope.recipe.steps = steps;
        storageService.save($scope.recipe);
        messageService.inform('Information', 'Your recipe is cloned');
    };
    
    $scope.newRecipe = function (data) {
        $scope.recipe = new recipe.Recipe(data);
    };
    
    $scope.recipe = new recipe.Recipe();
    
    $scope.pushStep = function () {
        $scope.recipe.steps.push(new recipe.Step());
    };
    
    $scope.deleteStep = function (index) {
        util.deleteFromArray($scope.recipe.steps, index);
    };
    
    $scope.stepSortOptions = {
        containment: '#sortable-container'
    };
}]);

