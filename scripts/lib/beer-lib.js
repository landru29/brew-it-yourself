/*global require, module,  __dirname */

(function() {
    "use strict";
    var polynome = function(data, value) {
        var coef = {};
        var keys = Object.keys(data).sort();
        for (var i in keys) {
            var key = (('' + keys[i]).match(/[^\d]*(\d)/))[1];
            coef[key] = data[keys[i]];
        }

        return {
            coef: coef,
            compute: function(value) {
                var result = 0;
                for (var i in this.coef) {
                    result += Math.pow(value, parseInt(i, 10)) * this.coef[i];
                }
                return result;
            },
            solve: function(value) {
                var _this = this;
                var cubeRoot = function(a) {
                    var sign = a < 0 ? -1 : 1;
                    return sign * Math.pow(Math.abs(a), 1 / 3);
                };
                var thirdDegree = function(value) {
                    var a = _this.coef['3'];
                    var b = _this.coef['2'];
                    var c = _this.coef['1'];
                    var d = _this.coef['0'] - value;
                    var p = c / a - Math.pow(b, 2) / (3 * Math.pow(a, 2));
                    var q = 2 * Math.pow(b, 3) / (27 * Math.pow(a, 3)) + d / a - b * c / (3 * Math.pow(a, 2));
                    var D = Math.pow(q, 2) + 4 * Math.pow(p, 3) / 27;
                    if (D === 0) {
                        if ((p === 0) && (q === 0)) {
                            return 0;
                        } else {
                            return [
                                2 * cubeRoot(-q / 2), -cubeRoot(-q / 2)
                            ];
                        }
                    }
                    if (D > 0) {
                        var u = cubeRoot((-q + Math.sqrt(D)) / 2);
                        var v = cubeRoot((-q - Math.sqrt(D)) / 2);
                        return u + v - b / (3 * a);
                    }
                    return [];
                };

                var secondDegree = function(value) {
                    var a = _this.coef['2'];
                    var b = _this.coef['1'];
                    var c = _this.coef['0'];
                    var D = Math.pow(b, 2) - 4 * a * c;
                    if (D === 0) {
                        return -b / (2 * a);
                    }
                    if (D > 0) {
                        return [
                            (-b - Math.sqrt(D)) / (2 * a), (-b + Math.sqrt(D)) / (2 * a)
                        ];
                    }
                    return [];
                };

                var firstDegree = function(value) {
                    return (value - _this.coef['0']) / _this.coef['1'];
                };

                if (this.coef['3']) {
                    return thirdDegree(value);
                }
                if (this.coef['2']) {
                    return secondDegree(value);
                }
                return firstDegree(value);
            }
        };
    };


    /************************************/
    /* TEMPERATURE                      */
    /************************************/

    var kelvin2CelciusPolynome = polynome({
        a0: -273.15,
        a1: 1
    });
    var kelvin2FahrenheitPolynome = polynome({
        a0: -459.67,
        a1: 9 / 5
    });

    var TemperatureTo = function(value) {
        this.value = value;
        this.toKelvin = function() {
            return this.value;
        };
        this.toCelcius = function() {
            return kelvin2CelciusPolynome.compute(this.value);
        };
        this.toFahrenheit = function() {
            return kelvin2FahrenheitPolynome.compute(this.value);
        };
    };

    var temperatureConversion = {
        fromCelcius: function(value) {
            return new TemperatureTo(kelvin2CelciusPolynome.solve(value));
        },
        fromKelvin: function(value) {
            return new TemperatureTo(value);
        },
        fromFahrenheit: function(value) {
            return new TemperatureTo(kelvin2FahrenheitPolynome.solve(value));
        }
    };


    /************************************/
    /* SUGAR                            */
    /************************************/
    var sg2PlatoPolynome = polynome({
        a3: 135.997,
        a2: -630.272,
        a1: 1111.14,
        a0: -616.868
    });
    var sg2BrixPolynome = polynome({
        a3: 182.4601,
        a2: -775.6821,
        a1: 1262.7794,
        a0: -669.5622
    });
    var sg2AlcoholPolynome = polynome({
        a1: 1 / 0.76,
        a0: -1 / 0.76
    });

    var SugarTo = function(value) {
        this.value = value;
        this.toSg = function() {
            return this.value;
        };
        this.toPlato = function() {
            return sg2PlatoPolynome.compute(this.value);
        };
        this.toBrix = function() {
            return sg2BrixPolynome.compute(this.value);
        };
        this.toAlcohol = function() {
            return sg2AlcoholPolynome.compute(this.value);
        };
    };

    var sugarConversions = {
        fromSg: function(value) {
            return new SugarTo(value);
        },
        fromPlato: function(value) {
            return new SugarTo(sg2PlatoPolynome.solve(value));
        },
        fromBrix: function(value) {
            return new SugarTo(sg2BrixPolynome.solve(value));
        },
        fromAlcohol: function(value) {
            return new SugarTo(sg2AlcoholPolynome.solve(value));
        }
    };


    /************************************/
    /* MISCELLANEOUS                    */
    /************************************/

    /**
     * Compute the volume of water to add to the malt
     *
     * @param float grainMass quantity of malt in kg
     * @param float ratio     mashing ratio (default 3)
     *
     * @return float
     **/
    var mashingVolume = function(grainMass, ratio) {
        if ('undefined' === typeof ratio) {
            ratio = 3;
        }
        return ratio * grainMass;
    };

    /**
     * Compute the volume of water lost in the grain
     *
     * @param float grainMass quantity of malt in kg
     * @param float ratio     retention ratio (default 1)
     *
     * @return float
     **/
    var grainRetention = function(grainMass, ratio) {
        if ('undefined' === typeof ratio) {
            ratio = 1;
        }
        return ratio * grainMass;
    };

    /**
     * Compute the volume to boil to reach a final expected volume
     *
     * @param float finalVolume       expected volume at the end of the operation (in liter)
     * @param float ratioLossBoiling  loss ratio during boiling operation (default 10%)
     * @param float rationLossCooling loss ration during cooling operation (default 5%)
     *
     * @return float
     **/
    var volumeToBoil = function(finalVolume, ratioLossBoiling, rationLossCooling) {
        if ('undefined' === typeof ratioLossBoiling) {
            ratioLossBoiling = 0.1;
        }
        if ('undefined' === typeof rationLossCooling) {
            rationLossCooling = 0.05;
        }
        return finalVolume / ((1 - ratioLossBoiling) * (1 - rationLossCooling));
    };


    /**
     * Compute the quantity of sugar produces from the malts
     *
     * @param object malts           malts description
     *     {
     *       pilsen: {
     *         mass: 1,    // in kilo
     *         yield:0.78  // between 0 and 1
     *       },
     *       cristal: {
     *         mass: 2,
     *         yield:0.75
     *       }
     *     }
     * @param float globalEfficiency global efficiency of the extraction (default 0.75)
     *
     * @return float
     **/
    var maltsToSugar = function(malts, globalEfficiency) {
        if ('undefined' === typeof globalEfficiency) {
            globalEfficiency = 0.75;
        }

        var result = 0;
        for (var maltIndex in malts) {
            var malt = malts[maltIndex];
            if (('mass' in malt) && ('yield' in malt)) {
                result += malt.mass * malt.yield * globalEfficiency;
            }
        }
        return result;
    };


    /************************************/
    /* BUILD MODULE                     */
    /************************************/
    module.exports = {
        conversion: {
            temperature: temperatureConversion,
            sugar: sugarConversions
        },
        mashingVolume: mashingVolume,
        grainRetention: grainRetention,
        volumeToBoil: volumeToBoil,
        maltsToSugar: maltsToSugar
    };

})();