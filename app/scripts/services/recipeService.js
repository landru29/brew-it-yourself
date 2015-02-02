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

    /**
     * Constructor for a recipe
     * @param Object data JSON data to preload the recipe
     */
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

    /**
     * Recipe properties
     **/ 
    Recipe.prototype.properties = {
        ibuComputeCurrentMethod: 'tinseth', // method to compute IBU
        globalGrainYield: 90,               // global efficiency of the installation for the extraction of sugar
        waterRetentionRate: 100,            // water retention in the grain in percent
        mashingWaterRate: 300,              // rate to compute recommended volume of water for mashing
        residualGravity: 1.015              // residual gravity after fermentation (used in the alcohol estimation)
    };
    
    /**
     * Get all the ingredients of the recipe
     * @param   {[[Type]]} filter [[Description]]
     * @returns [Ingredient] array of ingredients, the ingredients will be overloaded with the step
     */
    Recipe.prototype.getIngredients = function (filter) {
        var result = [];
        for (var stpIndex in this.steps) {
            result = result.concat(this.steps[stpIndex].getIngredients(filter));
        }
        return result;
    };

    /**
     * Get all informations about the fermentables (=malts) in the recipe)
     * @returns [{mass, yield, color}] array of fermentable descriptions; mass are in kg
     */
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

    /**
     * Get all information about hops
     * @returns [{mass, alpha, lasting}] array of hops; mass are in grams, lastings are in minutes
     */
    Recipe.prototype.getHops = function () {
        var hops = this.getIngredients({
            type: 'hop'
        });
        var lastHoppingStep = hops[hops.length-1].step;
        var result = [];
        for (var index in hops) {
            var qty = hops[index].qty;
            if (qty) {
                result.push({
                    mass: unitsConversionProvider.fromTo(qty.value, qty.unit.type, 'g'),
                    alpha: hops[index].alpha,
                    lasting: this.getTime(hops[index].step, lastHoppingStep)
                });
            }
        }
        return result;
    };

    /**
     * Get the volume of water in the recipe
     * @returns Integer volume in liter
     */
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

    /**
     * Convert this object in a JSON string
     * @returns String JSON representation of the object. all fields which name begin with '$' will be ignored
     */
    Recipe.prototype.stringify = function () {
        var cleanObject = function (obj) {
            for (var i in obj) {
                if (i[0] === '$') {
                    delete obj[i];
                } else if ('object' === typeof obj[i]) {
                    cleanObject(obj[i]);
                }
            }
            return obj;
        };
        var clonedObject = cleanObject(JSON.parse(JSON.stringify(this)));
        return JSON.stringify(clonedObject);
    };

    /**
     * Clone a recipe
     * @returns Recipe cloned recipe
     */
    Recipe.prototype.clone = function () {
        var cloned = new Recipe(JSON.parse(this.stringify()));
        cloned.uuid = generateLocalUUID();
        return cloned;
    };

    /**
     * List of methods to compute IBU
     * @param Float alphaAcidity alpha acidity of the hop in percent
     * @param Float massGr       mass of the hop in grams
     * @param Float volumeL      volume of liquid in liter
     * @param Float gravitySg    gravity of the liquid in Sg
     * @param Float lastingMin   time during which the hops is in the boiling liquide
     **/ 
    Recipe.prototype.ibuComputeMethods = {
        rager: function (alphaAcidity, massGr, volumeL, gravitySg, lastingMin) {
            var ga = (gravitySg > 1.050 ? (gravitySg - 1.050) / 0.2 : 1);
            var utilization = 18.11 + 13.86 * Math.tanh((lastingMin - 31.32) / 18.27);
            return massGr * utilization * alphaAcidity * 1000 / (volumeL * (1 + ga));
        },
        /*garetz: function (alphaAcidity, massGr, volumeL, gravitySg, lastingMin) {
            var finalVolume = volumeL;
            var CF = finalVolume / volumeL;
            var BG = (CF * (gravitySg - 1)) + 1;
            var GF = 1 + (BG - 1.050) / 0.2;
        },*/
        tinseth: function (alphaAcidity, massGr, volumeL, gravitySg, lastingMin) {
            var bignessFactor = 1.65 * Math.pow(0.000125, gravitySg - 1);
            var boilTimeFactor = (1 - Math.exp(-0.04 * lastingMin)) / 4.15;
            var utilization = bignessFactor * boilTimeFactor;
            return massGr * utilization * alphaAcidity * 1000 / volumeL;
        }
    };

    /**
     * Estimate the color of the beer
     * @returns {srm, rgb} color of the beer
     */
    Recipe.prototype.estimateColor = function () {
        var mcu = 0;
        var lovi;
        var grain = this.getFermentableMass();
        var liquid = this.getLiquidVolume();
        for (var index in grain) {
            lovi = unitsConversionProvider.fromTo(grain[index].color, 'color.ebc', 'lovibond');
            mcu += 8.34540445202 * lovi * grain[index].mass / liquid;
        }
        var srm = 1.4922 * Math.pow(mcu, 0.6859);
        return {
            srm: srm,
            rgb: unitsConversionProvider.fromTo(srm, 'color.srm', 'rgb')
        };
    };

    /**
     * Compute the liquid retention in the grain
     * @returns Float volume, in liter of the liquid in the grain (lost)
     */
    Recipe.prototype.liquidRetention = function () {
        var grainMass = 0;
        var grain = this.getFermentableMass();
        for (var index in grain) {
            grainMass += grain[index].mass;
        }
        return grainMass * this.properties.waterRetentionRate / 100;
    };

    /**
     * Compute the recommended volume of water for mashing
     * @returns Float volume of water in liter
     */
    Recipe.prototype.mashingVolume = function () {
        var grain = this.getFermentableMass();
        var result = 0;
        for (var i in grain) {
            result += grain[i].mass * this.properties.mashingWaterRate / 100;
        }
        return result;
    };

    /**
     * Estimate the mass of sugar extracted from the malts
     * @returns Float mass of sugar in kg
     */
    Recipe.prototype.sugarMassEstimation = function () {
        var grain = this.getFermentableMass();
        var result = 0;
        for (var index in grain) {
            result += grain[index].mass * grain[index].yield * this.properties.globalGrainYield / 10000;
        }
        return result;
    };

    /**
     * Estimate the gravity before fermentation
     * @returns Float gravity in sg
     */
    Recipe.prototype.gravity = function () {
        var liquidVol = this.getLiquidVolume();
        var sugarMass = this.sugarMassEstimation();
        if (!liquidVol) {
            return 1.0;
        }
        var gPerLiter = 1000 * sugarMass / liquidVol;
        return unitsConversionProvider.fromTo(gPerLiter, 'sugar.gPerLiter', 'sg');
    };

    /**
     * Compute the IBU of the beer
     * @returns Float IBU
     */
    Recipe.prototype.ibuEstimation = function () {
        var alphaAcidity;
        var hops = this.getHops();
        var gravity = this.gravity();
        var volume = this.getLiquidVolume();
        var getIbu = this.ibuComputeMethods[this.properties.ibuComputeCurrentMethod];
        var result = 0;
        for (var index in hops) {
            alphaAcidity = ((hops[index].type) && (hops[index].type === 'pellets') ? 1.1 * hops[index].alpha / 100 : hops[index].alpha / 100);
            result += getIbu(alphaAcidity, hops[index].mass, volume, gravity, hops[index].lasting);
        }
        return result;
    };

    /**
     * Estimate the alcohol in the beer (based on the residual gravity specified in the properties
     * @returns Float alcohol rate per volume (ie. returning 0.052 means 5.2%Vol)
     */
    Recipe.prototype.getAlcohol = function () {
        var initialGravity = this.gravity();
        return (initialGravity > this.properties.residualGravity ? unitsConversionProvider.fromTo(1 + initialGravity - this.properties.residualGravity, 'sugar.sg', 'alcohol') : 0);
    };

    /**
     * Return the time between two steps (included)
     * @param   Step stepStart Starting step
     * @param   Step stepEnd   Ending step / not required
     * @returns Float time in minutes
     */
    Recipe.prototype.getTime = function (stepStart, stepEnd) {
        var indexStart = this.steps.indexOf(stepStart);
        var indexEnd = (stepEnd ? this.steps.indexOf(stepEnd) : this.steps.length-1);
        var result = 0;
        if (indexStart > -1) {
            for(var i = indexStart; i <= indexEnd; i++) {
                result += this.steps[i].getMinutes();
            }
        }
        return result;
    };


    /*******************************************************************************/
    /** Define Step Object                                                        **/
    /*******************************************************************************/

    /**
     * Constructor for a step
     * @param Object data JSON data to preload the step
     */
    var Step = function (data) {
        this.name = '';
        this.lasting = 0;
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
                case 'lasting': {
                    if (Object.prototype.toString.call(data.lasting) === '[object Object]') {
                        this.lasting = data.lasting.minutes + data.lasting.hours * 60 + data.lasting.days * 60 *24;
                    } else {
                        this.lasting = data.lasting;
                    }
                    break;
                }
                default:
                    this[i] = data[i];
                }
            }
        }
    };

    /**
     * Get the lasting of the step in minutes
     * @returns Float lasting of the step in minutes
     */
    Step.prototype.getMinutes = function () {
        return this.lasting;
    };

    /**
     * Get all the ingredients of the recipe
     * @param   {[[Type]]} filter [[Description]]
     * @returns [Ingredient] array of ingredients, the ingredients will be overloaded with the step
     */
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

    /**
     * Constructor for an ingredient
     * @param Object data JSON data to preload the ingredient
     */
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