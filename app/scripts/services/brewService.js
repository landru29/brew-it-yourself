/*global angular*/
angular.module('BrewItYourself').provider('brew', [
    function () {
        'use strict';

        var mashingRatio = 3;
        
        this.setMashingRation = function (ratio) {
            mashingRatio = ratio;
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
                }
            };
        }];
    }]);