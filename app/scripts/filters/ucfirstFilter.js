/*global angular*/
angular.module('BrewItYourself').filter('ucfirst', function () {
    'use strict';
    return function (text) {
        return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
    };
});