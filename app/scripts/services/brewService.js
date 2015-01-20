/*global angular*/
angular.module('BrewItYourself').provider('brew', [
    function () {
        'use strict';


        this.$get = [function () {
            return {
                /**
                 * Compute the volume of water to add to the malt
                 *
                 * @param float grainMass quantity of malt in kg
                 * @param float ratio     mashing ratio (default 3)
                 *
                 * @return float
                 **/
                mashingVolume: function (grainMass, ratio) {
                    if ('undefined' === typeof ratio) {
                        ratio = 3;
                    }
                    return ratio * grainMass;
                }
            };
        }];
}]);