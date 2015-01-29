/*global angular*/
angular.module('BrewItYourself').provider('recipe', ['unitsConversionProvider', function (unitsConversionProvider) {
    'use strict';

    var generateLocalUUID = function () {
        return new Date().getTime().toString(16).toUpperCase();
    };

    var applyFilter = function (data, filter) {
        if ((!filter) || (Object.prototype.toString.call(filter) !== '[object Object]')) {
            return true;
        }
        for (var i in filter) {
            if (('undefined' !== typeof data[i]) && (data[i] !== filter[i])) {
                return false;
            }
        }
        return true;
    };

    /*******************************************************************************/
    /** Define Recipe Object                                                      **/
    /*******************************************************************************/

    var Recipe = function (data) {
        this.name = '';
        this.date = new Date();
        this.author = '';
        this.uuid = generateLocalUUID();
        this.steps = [];
        if (Object.prototype.toString.call(data) === '[object Object]') {
            for (var i in data) {
                switch (i) {
                case 'steps':
                    for (var stpIndex in data[i]) {
                        this[i].push(new Step(data[i][stpIndex]));
                    }
                    break;
                default:
                    this[i] = data[i];
                }
            }
        }
    };

    Recipe.prototype.getIngredients = function (filter) {
        var result = [];
        for (var stpIndex in this.steps) {
            result = result.concat(this.steps[stpIndex].getIngredients(filter));
        }
        return result;
    };

    Recipe.prototype.getFermentableMass = function () {
        var fermentable = this.getIngredients({
            type: 'fermentable'
        });
        var result = [];
        for (var index in fermentable) {
            var qty = fermentable[index].qty;
            if (qty) {
                result.push({
                    mass: unitsConversionProvider.fromTo(qty.value, qty.unit.type, 'kg'),
                    yield: fermentable[index].yield,
                    color: fermentable[index].color
                });
            }
        }
        return result;
    };

    Recipe.prototype.getHops = function () {
        var hops = this.getIngredients({
            type: 'hop'
        });
        var result = [];
        for (var index in hops) {
            var qty = hops[index].qty;
            if (qty) {
                result.push({
                    mass: unitsConversionProvider.fromTo(qty.value, qty.unit.type, 'g'),
                    alpha: hops[index].alpha,
                    lasting: hops[index].step.getMinutes()
                });
            }
        }
        return result;
    };

    Recipe.prototype.getLiquidVolume = function () {
        var water = this.getIngredients({
            type: 'water'
        });
        var result = 0;
        for (var index in water) {
            var qty = water[index].qty;
            if (qty) {
                result += unitsConversionProvider.fromTo(qty.value, qty.unit.type, 'l');
            }
        }
        return result;
    };

    /*******************************************************************************/
    /** Define Step Object                                                        **/
    /*******************************************************************************/

    var Step = function (data) {
        this.name = '';
        this.lasting = {
            minutes: 0,
            hours: 0,
            days: 0
        };
        this.temperature = 20;
        this.ingredients = [];
        if (Object.prototype.toString.call(data) === '[object Object]') {
            for (var i in data) {
                switch (i) {
                case 'ingredients':
                    for (var igdIndex in data[i]) {
                        this[i].push(new Ingredient(data[i][igdIndex]));
                    }
                    break;
                default:
                    this[i] = data[i];
                }
            }
        }
    };
    
    Step.prototype.getMinutes = function () {
        return this.lasting.minutes + this.lasting.hours * 60 + this.lasting.days * 60 * 24;
    };

    Step.prototype.getIngredients = function (filter) {
        var result = [];
        for (var igdIndex in this.ingredients) {
            var thisIngredient = JSON.parse(JSON.stringify(this.ingredients[igdIndex]));
            thisIngredient.step = this;
            if (applyFilter(this.ingredients[igdIndex], filter)) {
                result.push(new Ingredient(thisIngredient));
            }
        }
        return result;
    };

    /*******************************************************************************/
    /** Define Ingredient Object                                                      **/
    /*******************************************************************************/

    var Ingredient = function (data) {
        if (Object.prototype.toString.call(data) === '[object Object]') {
            for (var i in data) {
                this[i] = data[i];
            }
        }
    };

    /*******************************************************************************/
    /** Service definition                                                        **/
    /*******************************************************************************/


    this.$get = ['$http', '$q', function ($http, $q, unitsConversion) {
        return {
            Step: Step,
            Recipe: Recipe,
            Ingredient: Ingredient,
            generateUUID: generateLocalUUID
        };
    }];
            }]);