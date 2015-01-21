/*global angular*/
angular.module('BrewItYourself').provider('recipe', [ function () {
    'use strict';
    
    var generateLocalUUID = function () {
        return new Date().getTime().toString(16).toUpperCase();
    };
    
    var getAllIngredients = function (recipe) {
        var result = [];
        for (var stpIndex in recipe.steps) {
            for (var igdIndex in recipe.steps[stpIndex].ingredients) {
                result.push(angular.extend({step:recipe.steps[stpIndex]}, recipe.steps[stpIndex].ingredients[igdIndex]));
            }
        }
        return result;
    };
    
    var getIngredientsByType = function (recipe, ingredientType) {
        var result = [];
        var ingredients = getAllIngredients(recipe);
        for (var index in ingredients) {
            if (ingredients[index].type.toLowerCase() === ingredientType.toLowerCase()) {
                result.push(ingredients[index]);
            }
        }
        return result;
    };
    
    var getMinutes = function(lasting) {
        return lasting.minutes + lasting.hours*60 + lasting.days*60*24;
    };

    this.$get = ['$http', '$q', 'unitsConversion', function ($http, $q, unitsConversion) {
        return {
            Step: function (data) {
                this.name = '';
                this.lasting = {
                    minutes: 0,
                    hours: 0,
                    days: 0
                };
                this.temperature = 20;
                this.ingredients = [];
                angular.extend(this, data);
            },
            Recipe: function (data) {
                this.name = '';
                this.date = new Date();
                this.author = '';
                this.uuid = generateLocalUUID();
                this.steps = [];
                angular.extend(this, data);
            },
            generateUUID: generateLocalUUID,
            getIngredient: function (recipe, filter) {
                return getIngredientsByType(recipe, filter.type);
            },
            getFermentableMass: function (recipe) {
                var fermentable = getIngredientsByType(recipe, 'fermentable');
                var result=[];
                for (var index in fermentable) {
                    var qty = fermentable[index].qty;
                    if (qty) {
                        result.push({
                            mass: unitsConversion.fromTo(qty.value, qty.unit.type, 'kg'),
                            yield: fermentable[index].yield,
                            color: fermentable[index].color
                        });
                    }
                }
                return result;
            },
            getHops: function (recipe) {
                var hops = getIngredientsByType(recipe, 'hop');
                var result=[];
                for (var index in hops) {
                    var qty = hops[index].qty;
                    if (qty) {
                        result.push({
                            mass: unitsConversion.fromTo(qty.value, qty.unit.type, 'g'),
                            alpha: hops[index].alpha,
                            lasting: getMinutes(hops[index].step.lasting)
                        });
                    }
                }
                return result;
            },
            getLiquidVolume: function(recipe) {
                var water = getIngredientsByType(recipe, 'water');
                var result=0;
                for (var index in water) {
                    var qty = water[index].qty;
                    if (qty) {
                        result += unitsConversion.fromTo(qty.value, qty.unit.type, 'l');
                    }
                }
                return result;
            }
        };
    }];
}]);