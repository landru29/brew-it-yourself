/*global angular */
angular.module('BrewItYourself').service('storageService', ['$localStorage', 'util', '$http', '$q',  function ($localStorage, util, $http, $q) {
    'use strict';
    var loadAllRecipes = function () {
        var defered = $q.defer();
        // if storage is empty, add a basic recipe
        if (!$localStorage.allRecipes) {
            $http.get('data/basic-recipe.json').then(function(basicRecipe){
                saveAllRecipes({
                    '0000': basicRecipe.data
                });
                defered.resolve(JSON.parse($localStorage.allRecipes));
            }, function(err) {
                defered.reject(err);
            });
        } else {
            // get all the recipe from the storage
            var t = JSON.parse($localStorage.allRecipes);
            defered.resolve(JSON.parse($localStorage.allRecipes));
        }
        return defered.promise;
        //return $localStorage.allRecipes ? JSON.parse($localStorage.allRecipes) : {};
    };
    
    var saveAllRecipes = function (allRecipes) {
        $localStorage.allRecipes = JSON.stringify(allRecipes);
    };
    
    this.getAllrecipes = function () {
        return loadAllRecipes();
    };
    
    this.save = function (recipe) {
        loadAllRecipes().then(function(allRecipes) {
            allRecipes[recipe.uuid] = util.cleanObject(JSON.parse(JSON.stringify(recipe)));
            saveAllRecipes(allRecipes);
        });
    };
    
    this.getOneRecipe = function (uuid) {
        var defered = $q.defer();
        loadAllRecipes().then(function(allRecipes) {
            defered.resolve(allRecipes[uuid]);
        });
        return defered.promise;
    };
    
    this.deleteOneRecipe = function (recipe) {
        loadAllRecipes().then(function(allRecipes) {
            delete allRecipes[recipe.uuid];
            saveAllRecipes(allRecipes);
        });
    };
    
}]);