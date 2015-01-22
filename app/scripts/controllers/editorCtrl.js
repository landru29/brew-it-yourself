/*global angular */
angular.module('BrewItYourself').controller('EditorCtrl', ['$scope', '$rootScope', '$localStorage', '$modal', 'messageService', 'storageService', 'util', 'recipe', 'brew', function ($scope, $rootScope, $localStorage, $modal, messageService, storageService, util, recipe, brew) {
    "use strict";
    
    $scope.insertIngredient = function (step) {
        step.$ingredientSelection = true;
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-ingredient-pick.html',
            controller: 'ModalIngredientPickCtrl',
            size: ''
        });
        modalInstance.result.then(function (ingredient) {
            step.ingredients.push(ingredient);
            delete step.$ingredientSelection;
        }, function () {
            delete step.$ingredientSelection;
        });
    };
    
    $scope.deleteIngredient = function (step, ingredient) {
        step.ingredients.splice(step.ingredients.indexOf(ingredient), 1);
    };
    
    $scope.recipe = new recipe.Recipe();
    
    $scope.pushStep = function () {
        $scope.recipe.steps.push(new recipe.Step());
    };
    
    $scope.deleteStep = function (step) {
        $scope.recipe.steps.splice($scope.recipe.steps.indexOf(step), 1);
    };
    
    $scope.stepSortOptions = {
        containment: '#sortable-container',
        dragStart: function(event) {
            event.source.itemScope.step.$moving = true;
        },
        dragEnd: function(event) {
            delete(event.source.itemScope.step.$moving);
        }
    };
    
    $scope.toggleStep = function(step) {
        step.reduced = !step.reduced;
    };
    
    $scope.getRinsingWater = function() {
        var liquidVol = recipe.getLiquidVolume($scope.recipe);
        var mashingVolume = $scope.getMashingVolume();
        return (liquidVol > mashingVolume ? liquidVol - mashingVolume : 0);
    };
    
    $scope.getMashingVolume = function() {
        var grain = recipe.getFermentableMass($scope.recipe);
        return brew.mashingVolume(grain);
    };
    
    $scope.getFinalVolume = function() {
        var liquidInitialVol = recipe.getLiquidVolume($scope.recipe);
        var grain = recipe.getFermentableMass($scope.recipe);
        return brew.liquidEstimation(liquidInitialVol, grain);
    };
    
    $scope.getInitialGravity = function() {
        var grain = recipe.getFermentableMass($scope.recipe);
        return brew.gravityEstimation (grain, $scope.getFinalVolume());
    };
    
    $scope.getIbu = function() {
        var hops = recipe.getHops($scope.recipe);
        return brew.ibuEstimation(hops, $scope.getInitialGravity(), $scope.getFinalVolume());
    };
    
    $scope.getAlcohol = function() {
        return brew.getAlcohol($scope.getInitialGravity()) * 100;
    };
    
    /*************************************************/
    /** MENU ACTIONS                                **/
    /*************************************************/
    
    $scope.save = function () {
        storageService.save($scope.recipe);
        $rootScope.$broadcast('display-message', {type:'success', message:'Your recipe is saved'});
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
        modalInstance.result.then(function (data) {
            $scope.recipe.steps = [];
            $scope.recipe = data.recipe;
            if (data.action==='import') {
                $scope.save();
            }
        }, function (message) {
            if (message) {
                $rootScope.$broadcast('display-message', {type:'danger', message: message});
            }
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
        $rootScope.$broadcast('display-message', {type:'success', message:'Your recipe is cloned'});
    };
    
    $scope.newRecipe = function (data) {
        $scope.recipe = new recipe.Recipe(data);
    };
    
    $scope.exportRecipe = function() {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-export.html',
            controller: 'ModalExportCtrl',
            size: '',
            resolve: {
                thisRecipe: function () {
                    return $scope.recipe;
                }
            }
        });
        
        modalInstance.result.then(function (recipe) {
        }, function (message) {
        });
    };
    
    /*************************************************/
    /** MENU TRIGGER RECIEVER                       **/
    /*************************************************/
    
    $scope.$on('menu-trigger', function(event, args) {
        switch (args.action) {
            case 'trash': 
                $scope.deleteRecipe();
                break;
            case 'clone': 
                $scope.cloneRecipe();
                break;
            case 'new': 
                $scope.newRecipe();
                break;
            case 'open': 
                $scope.open();
                break;
            case 'save': 
                $scope.save();
                break;
            case 'export': 
                $scope.exportRecipe();
                break;
            default:
                break;
        }
    });
    
}]);

