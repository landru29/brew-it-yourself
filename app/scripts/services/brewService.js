/*global angular*/
angular.module('BrewItYourself').provider('brew', ['unitsConversionProvider',
    function (unitsConversionProvider) {
        'use strict';

        var mashingRatio = 3;
        var globalYield = 90;
        var retentionWaterRate = 1;
        var defaultFinalGravity = 1.010;
        
        this.setMashingRation = function (ratio) {
            mashingRatio = ratio;
        };
        
        this.setGlobalYield = function (newYield) {
            globalYield = newYield;
        };
        
        
        this.setRetentionWaterRate = function(rate) {
            retentionWaterRate = rate;
        };
        
        this.setDefaultGravity = function(gravity) {
            defaultFinalGravity = gravity;
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
        
        var sugarEstim = function(grainMass, grainYield) {
            return grainMass * grainYield * globalYield / 10000;
        };
        
        var liquidRetention= function(grain, retentionRate) {
            if (!retentionRate) {
                retentionRate = retentionWaterRate;
            }
            var grainMass = 0;
            if ('[object Array]' === Object.prototype.toString.call( grain )) {
                for (var index in grain) {
                    grainMass += grain[index].mass;
                }
            } else {
                grainMass = (grain.mass ? grain.mass : 0);
            }
            return grainMass * retentionRate;
        };
        
        var gravity = function(sugarMass, liquidVol) {
            if (!liquidVol) {
                return 1.0;
            }
            var gPerLiter = 1000*sugarMass/liquidVol;
            return unitsConversionProvider.fromTo(gPerLiter, 'sugar.gPerLiter', 'sg');
        };
        
        var sugarEstimation = function(grain) {
            if ('[object Array]' === Object.prototype.toString.call( grain )) {
                var result=0;
                for (var index in grain) {
                    result += sugarEstim(grain[index].mass, grain[index].yield);
                }
                return result;
            } else {
                return (grain.mass ? sugarEstim(grain.mass, grain.yield) : 0);
            }
        };
        
        var ibuEstimation = function(hops, gravity, volume) {
            if ('[object Array]' === Object.prototype.toString.call( hops )) {
                var result=0;
                for (var index in hops) {
                    result += getIbu(hops[index].alpha, hops[index].mass, volume, gravity, hops[index].lasting);
                }
                return result;
            } else {
                return (hops.mass ? getIbu(hops.alpha, hops.mass, volume, gravity, hops.lasting) : 0);
            }
        };
        
        var estimateSRM = function(grain, liquid) {
            var mcu = 0;
            var lovi;
             if ('[object Array]' === Object.prototype.toString.call( grain )) {
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
        
        var getIbu = function(alphaAcidity, massGr, volume, gravity, lasting) {
            var result = (alphaAcidity*massGr*10/volume) * (1.65 * Math.pow(1.25e-4, gravity-1)) * (1-Math.exp(-0.04*lasting))/4.15;
            return isNaN(result) ? 0 : result;
        };
        
        var getAlcohol = function(initialGravity, finalGravity) {
            if (!finalGravity) {
                finalGravity = defaultFinalGravity;
            }
            return (initialGravity > finalGravity ? unitsConversionProvider.fromTo(1 + initialGravity - finalGravity, 'sugar.sg', 'alcohol'):0);
        };

        this.$get = [function () {
            return {
                mashingVolume: function(grain, ratio) {
                    if ('[object Array]' === Object.prototype.toString.call( grain )) {
                        var result=0;
                        for (var index in grain) {
                            result += mashingVolume(grain[index].mass, ratio);
                        }
                        return result;
                    } else {
                        return (grain.mass ? mashingVolume(grain.mass, ratio) : 0);
                    }
                },
                liquidEstimation: function(liquid, grain, retentionRate) {
                    var retention = liquidRetention(grain, retentionRate);
                    return (liquid>retention ? liquid - retention : 0);
                },
                sugarEstimation: sugarEstimation,
                gravityEstimation: function(grain, liquidVol) {
                    var sugar = sugarEstimation(grain);
                    return gravity(sugar, liquidVol);
                },
                ibuEstimation:ibuEstimation,
                getAlcohol: getAlcohol,
                estimateSRM: estimateSRM
            };
        }];
    }]);