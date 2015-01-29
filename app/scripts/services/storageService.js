/*global angular */
angular.module('BrewItYourself').service('storageService', ['$localStorage', '$http', '$q',  function ($localStorage, $http, $q) {
    'use strict';
    
    var saveAllRecipes = function (allRecipes) {
        $localStorage.allRecipes = JSON.stringify(allRecipes);
    };
    
    var loadAllRecipes = function () {
        var defered = $q.defer();
        // if storage is empty, add a basic recipe
        if (!$localStorage.allRecipes) {
            $http.get('data/basic-recipe.json').then(function (basicRecipe) {
                saveAllRecipes({
                    '0000': basicRecipe.data
                });
                defered.resolve(JSON.parse($localStorage.allRecipes));
            }, function (err) {
                defered.reject(err);
            });
        } else {
            // get all the recipe from the storage
            defered.resolve(JSON.parse($localStorage.allRecipes));
        }
        return defered.promise;
    };
    
    this.getAllrecipes = function () {
        return loadAllRecipes();
    };
    
    this.save = function (recipe) {
        loadAllRecipes().then(function (allRecipes) {
            allRecipes[recipe.uuid] = JSON.parse(recipe.stringify());
            saveAllRecipes(allRecipes);
        });
    };
    
    this.getOneRecipe = function (uuid) {
        var defered = $q.defer();
        loadAllRecipes().then(function (allRecipes) {
            defered.resolve(allRecipes[uuid]);
        });
        return defered.promise;
    };
    
    this.deleteOneRecipe = function (recipe) {
        loadAllRecipes().then(function (allRecipes) {
            delete allRecipes[recipe.uuid];
            saveAllRecipes(allRecipes);
        });
    };
    
}]);