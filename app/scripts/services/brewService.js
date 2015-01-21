/*global angular*/
angular.module('BrewItYourself').provider('brew', [
    function () {
        'use strict';

        var mashingRatio = 3;
        var globalYield = 90;
        var retentionWaterRate = 1;
        
        this.setMashingRation = function (ratio) {
            mashingRatio = ratio;
        };
        
        this.setGlobalYield = function (newYield) {
            globalYield = newYield;
        }
        
        
        this.setRetentionWaterRate = function(rate) {
            retentionWaterRate = rate;
        }
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
        
        var sugarEstimation = function(grainMass, grainYield) {
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
                sugarEstimation: function(grain) {
                    if ('[object Array]' === Object.prototype.toString.call( grain )) {
                        var result=0;
                        for (var index in grain) {
                            result += sugarEstimation(grain[index].mass, grain[index].yield);
                        }
                        return result;
                    } else {
                        return (grain.mass ? mashingVolume(grain.mass, grain.yield) : 0);
                    }
                }
            };
        }];
    }]);