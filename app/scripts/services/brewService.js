/*global angular*/
angular.module('BrewItYourself').provider('brew', ['unitsConversionProvider',
    function (unitsConversionProvider) {
        'use strict';

        var mashingRatio = 3;
        var globalYield = 90;
        var retentionWaterRate = 1;
        var defaultFinalGravity = 1.010;
        var getIbu;

        this.setMashingRation = function (ratio) {
            mashingRatio = ratio;
        };

        this.setGlobalYield = function (newYield) {
            globalYield = newYield;
        };


        this.setRetentionWaterRate = function (rate) {
            retentionWaterRate = rate;
        };

        this.setDefaultGravity = function (gravity) {
            defaultFinalGravity = gravity;
        };

        /**
         * Set the method to calculate IBU
         *
         * @param string name method name (rager, garetz, tinseth)
         **/
        this.setIbuMethod = function (name) {
            if (ibuMethods[name.toLowerCase()]) {
                getIbu = ibuMethods[name.toLowerCase()];
            }
        };

        /**
         * Compute the volume of water to add to the malt
         *
         * @param float grainMass quantity of malt in kg
         * @param float ratio     mashing ratio (default 3)
         *
         * @return float
         **/
        var mashingVolume = function (grainMass, ratio) {
            if ('undefined' === typeof ratio) {
                ratio = mashingRatio;
            }
            return ratio * grainMass;
        };

        var sugarEstim = function (grainMass, grainYield) {
            return grainMass * grainYield * globalYield / 10000;
        };

        var liquidRetention = function (grain, retentionRate) {
            if (!retentionRate) {
                retentionRate = retentionWaterRate;
            }
            var grainMass = 0;
            if ('[object Array]' === Object.prototype.toString.call(grain)) {
                for (var index in grain) {
                    grainMass += grain[index].mass;
                }
            } else {
                grainMass = (grain.mass ? grain.mass : 0);
            }
            return grainMass * retentionRate;
        };

        var gravity = function (sugarMass, liquidVol) {
            if (!liquidVol) {
                return 1.0;
            }
            var gPerLiter = 1000 * sugarMass / liquidVol;
            return unitsConversionProvider.fromTo(gPerLiter, 'sugar.gPerLiter', 'sg');
        };

        var sugarEstimation = function (grain) {
            if ('[object Array]' === Object.prototype.toString.call(grain)) {
                var result = 0;
                for (var index in grain) {
                    result += sugarEstim(grain[index].mass, grain[index].yield);
                }
                return result;
            } else {
                return (grain.mass ? sugarEstim(grain.mass, grain.yield) : 0);
            }
        };

        var estimateSRM = function (grain, liquid) {
            var mcu = 0;
            var lovi;
            if ('[object Array]' === Object.prototype.toString.call(grain)) {
                for (var index in grain) {
                    lovi = unitsConversionProvider.fromTo(grain[index].color, 'color.ebc', 'lovibond');
                    mcu += 8.34540445202 * lovi * grain[index].mass / liquid;
                }
            } else {
                lovi = unitsConversionProvider.fromTo(grain.color, 'color.ebc', 'lovibond');
                mcu += 8.34540445202 * lovi * grain.mass / liquid;
            }
            var srm = 1.4922 * Math.pow(mcu, 0.6859);
            return {
                srm: srm,
                color: unitsConversionProvider.fromTo(srm, 'color.srm', 'rgb')
            };
        };

        var ibuMethods = {
            rager: function (alphaAcidity, massGr, volume, gravity, lasting) {
                var ga = (gravity > 1.050 ? (gravity - 1.050) / 0.2 : 1);
                var utilization = 18.11 + 13.86 * Math.tanh((lasting - 31.32) / 18.27);
                return massGr * utilization * alphaAcidity * 1000 / (volume * (1 + ga));
            },
            /*garetz: function (alphaAcidity, massGr, volume, gravity, lasting) {
                var finalVolume = volume;
                var CF = finalVolume / volume;
                var BG = (CF * (gravity - 1)) + 1;
                var GF = 1 + (BG - 1.050) / 0.2;
            },*/
            tinseth: function (alphaAcidity, massGr, volume, gravity, lasting) {
                var bignessFactor = 1.65 * Math.pow(0.000125, gravity - 1);
                var boilTimeFactor = (1 - Math.exp(-0.04 * lasting)) / 4.15;
                var utilization = bignessFactor * boilTimeFactor;
                return massGr * utilization * alphaAcidity * 1000 / volume;
            }
        };
        getIbu = ibuMethods.tinseth;
        
        var ibuEstimation = function (hops, gravity, volume) {
            if ('[object Array]' === Object.prototype.toString.call(hops)) {
                var result = 0;
                for (var index in hops) {
                    var alphaAcidity = ((hops[index].type) && (hops[index].type === 'pellets') ? 1.1 * hops[index].alpha / 100 : hops[index].alpha / 100);
                    result += getIbu(alphaAcidity, hops[index].mass, volume, gravity, hops[index].lasting);
                }
                return result;
            } else {
                var alphaAcidity = ((hops.type) && (hops.type === 'pellets') ? 1.1 * hops.alpha / 100 : hops.alpha / 100);
                return (hops.mass ? getIbu(alphaAcidity, hops.mass, volume, gravity, hops.lasting) : 0);
            }
        };

        var getAlcohol = function (initialGravity, finalGravity) {
            if (!finalGravity) {
                finalGravity = defaultFinalGravity;
            }
            return (initialGravity > finalGravity ? unitsConversionProvider.fromTo(1 + initialGravity - finalGravity, 'sugar.sg', 'alcohol') : 0);

        };



        this.$get = [
            function () {
                return {
                    mashingVolume: function (grain, ratio) {
                        if ('[object Array]' === Object.prototype.toString.call(grain)) {
                            var result = 0;
                            for (var index in grain) {
                                result += mashingVolume(grain[index].mass, ratio);
                            }
                            return result;
                        } else {
                            return (grain.mass ? mashingVolume(grain.mass, ratio) : 0);
                        }
                    },
                    liquidEstimation: function (liquid, grain, retentionRate) {
                        var retention = liquidRetention(grain, retentionRate);
                        return (liquid > retention ? liquid - retention : 0);
                    },
                    sugarEstimation: sugarEstimation,
                    gravityEstimation: function (grain, liquidVol) {
                        var sugar = sugarEstimation(grain);
                        return gravity(sugar, liquidVol);
                    },
                    ibuEstimation: ibuEstimation,
                    getAlcohol: getAlcohol,
                    estimateSRM: estimateSRM
                };
        }];
    }]);