/*global angular */
angular.module('BrewItYourself').service('storageService', ['$localStorage', 'util', function ($localStorage, util) {
    'use strict';
    var loadAllRecipes = function () {
        return $localStorage.allRecipes ? JSON.parse($localStorage.allRecipes) : {};
    };
    
    var saveAllRecipes = function (allRecipes) {
        $localStorage.allRecipes = JSON.stringify(allRecipes);
    };
    
    /*var cleanObject = function (obj) {
        for (var i in obj) {
            if (i[0] === '$') {
                delete obj[i];
            } else if ('object' === typeof obj[i]) {
                cleanObject(obj[i]);
            }
        }
        return obj;
    };*/
    
    this.getAllrecipes = function () {
        return loadAllRecipes();
    };
    
    this.save = function (recipe) {
        var allRecipes = loadAllRecipes();
        allRecipes[recipe.uuid] = util.cleanObject(JSON.parse(JSON.stringify(recipe)));
        saveAllRecipes(allRecipes);
    };
    
    this.getOneRecipe = function (uuid) {
        var allRecipes = loadAllRecipes();
        return allRecipes[uuid];
    };
    
    this.deleteOneRecipe = function (recipe) {
        var allRecipes = loadAllRecipes();
        delete allRecipes[recipe.uuid];
        saveAllRecipes(allRecipes);
    };
    
}]);